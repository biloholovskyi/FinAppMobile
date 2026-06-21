# Spec: конвертация валют в переводах (поле «Зачислено»)

## Mission
- Добавить в экран транзакций поле «Зачислено» с авторасчётом суммы по курсу при переводе между кошельками разных валют.
- Синхронизировать сгенерированный API (Orval) и провести интеграцию по паттерну фронта (ручной API + сгенерированный currency-rate хук).

## Task profile
`feature` (новая возможность экрана + новый хук/утилита конвертации, изменение контракта save). Один связный шаг реализации, без многофазного цикла.

## Facts / constraints
- Backend уже поддерживает кросс-валютные переводы: `WalletTransactionModel.targetAmount: number | null`, `targetWalletId`; DTO `UpdateWalletTransactionDto`/`CreateWalletTransactionDto` содержат `targetWalletId` + `targetAmount` (positive). Endpoint `GET /currency-rate?currency=` возвращает `CurrencyRateModel` (rateBuy/rateSell/rateCross, vs UAH).
- В backend OpenAPI схемы `Create/UpdateWalletTransactionDto` пустые (`properties: {}`) — у backend DTO нет `@ApiProperty`. Перегенерация Orval НЕ создаёт типизированные тела для транзакций → используем ручной API, как на фронте. Backend не трогаем.
- Сгенерированный хук `useCurrencyRateControllerGetRate(params, { query })` уже существует (`src/shared/api/generated/currency-rate/currency-rate.ts`), модель `CurrencyRateModel` уже сгенерирована.
- `WalletModel.currency` и `Wallet.currency` (`src/entities/wallet/index.ts`) — ISO 4217 alpha-код («UAH», «USD»...). Основная валюта приложения UAH (₴), локаль `uk-UA`.
- Суммы из API в копейках → `/100` отображение, `Math.round(*100)` отправка. `targetAmount` в DTO — в той же единице, что и `amount` (фронт шлёт целые единицы валюты, не копейки; повторяем поведение фронта: ручной API шлёт значение как есть).
- Текущий экран: `src/features/operations/EditTransactionScreen/` — `EditTransactionScreen.tsx`, хуки `useEditTransactionScreen/Form/Actions/Data`, компонент `FormRow`, модалки выбора. Перевод уже имеет строку «Кошелёк-получатель» (`showTargetWalletRow`).
- `useEditTransactionForm` уже хранит `targetWalletId` и префиллит его из транзакции.
- Утилиты: `src/shared/utils/currency.ts` (`parseAmountInput`, форматтеры), `colors.ts` (`hexToRgba`).
- Референс-реализация (фронт): `fin-app-frontend/src/entities/Transaction/lib/useTransferTargetAmount.ts`, `src/shared/utils/currencyConversion.ts`, `src/pagesComponents/TransactionsPage/Components/EditTransactionModal/useEditTransactionModal.ts`.
- FSD: `app → features → entities → shared`. `entities` может импортировать `shared` (generated, utils). expo-router в entities/shared/features — запрещён.

## Target state

### Шаг 1 — Регенерация Orval (синк)
- Запустить `npm run api:generate` (через `rtk`). Цель — освежить сгенерированные модели/хуки из `../fin-app-backend/docs/openapi.json`.
- Ожидаемо: тела транзакционных DTO остаются пустыми (`{ [key: string]: unknown }`) — это нормально, потребляем ручной API. Проверить, что `currency-rate` хук и `CurrencyRateModel` на месте.
- Не коммитить, не делать git-операций.

### Шаг 2 — `src/shared/utils/currencyConversion.ts` (новый)
- Порт фронтового util:
  - `UAH_CURRENCY_CODE = 'UAH'`.
  - `pickSellRate(rate?: CurrencyRateModel): number | null` — `rateSell ?? rateCross ?? rateBuy ?? null`.
  - `roundAmount(value): number` — округление до 2 знаков.
  - `computeTargetAmount(absAmount, sourceRate, targetRate): number | null` — `null` если курс отсутствует/`targetRate === 0`, иначе `roundAmount(absAmount * sourceRate / targetRate)`.
- Импорт `CurrencyRateModel` из `@/shared/api/generated/models`.
- JSDoc на каждую публичную функцию. Magic numbers (decimals) — именованная константа.
- Реэкспорт из `src/shared/utils/index.ts`, если он существует; иначе импорт по прямому пути.

### Шаг 3 — `src/entities/transaction/lib/useTransferTargetAmount.ts` (новый)
- Преобразовать `src/entities/transaction/index.ts` в папку: создать `src/entities/transaction/lib/useTransferTargetAmount.ts`; `index.ts` оставить как публичный API сущности (типы + реэкспорт хука).
- Хук-порт фронта, параметры: `{ isTransfer, amount, walletId, targetWalletId, wallets }` (`amount` — строка ввода, `wallets: Wallet[]`).
- Определяет `sourceCurrency`/`targetCurrency` из кошельков (fallback `UAH`), `isCrossCurrency = isTransfer && оба кошелька выбраны && валюты различаются`.
- Два `useCurrencyRateControllerGetRate` (source/target), `enabled` только при `isCrossCurrency && currency !== UAH`, `staleTime = 5 мин` (именованная константа `RATE_STALE_TIME_MS`).
- `sourceRate`/`targetRate`: `1` для UAH, иначе `pickSellRate`.
- Дефолт зачисления: `computeTargetAmount(absAmount, sourceRate, targetRate)` при cross-currency, иначе `absAmount`.
- Ручной override через `useState` с `contextKey = isTransfer|walletId|targetWalletId` (сброс при смене контекста).
- Возвращает `targetAmountValue` (string), `targetAmountNumber`, `handleTargetAmountChange`, `isCrossCurrency`, `sourceCurrency`, `targetCurrency`, `conversionRate` (`roundAmount(sourceRate/targetRate)` при cross-currency, иначе `null`).
- Хук ≤ 50 строк → при превышении вынести вычисление курсов в под-хук `useCurrencyRatesPair`.
- TanStack Query v5 object-syntax. Без expo-router.

### Шаг 4 — `Transaction` тип (entities/transaction)
- Добавить `targetAmount?: number | null` в тип `Transaction` (для префилла в режиме редактирования).

### Шаг 5 — Ручной API (`src/shared/api/transactions.ts`)
- В `UpdateTransactionDto` добавить `targetAmount?: number` (поле `targetWalletId?` уже присутствует).
- Сигнатуры/функции `fetchTransactions`/`deleteTransaction` без изменений.

### Шаг 6 — Save-логика (`useEditTransactionActions.ts`)
- В `SavePayload` добавить `targetAmount: number | null`.
- `update`: прокидывать `targetAmount: p.targetAmount ?? undefined` в `updateTransaction` (только для перевода — для остальных типов `undefined`).
- `create`: добавить `targetAmount` в объект `data` (тип пустой → принимает поле); слать только для перевода.

### Шаг 7 — Форма (`useEditTransactionForm.ts`)
- Префилл при редактировании: ничего нового хранить не нужно (сумма зачисления вычисляется/override через `useTransferTargetAmount`), но обеспечить доступность `targetAmount` транзакции для начального override при cross-currency edit (опционально, если значение присутствует) — допустимо стартовать с авторасчёта.

### Шаг 8 — Хук экрана (`useEditTransactionScreen.ts`)
- Подключить `useTransferTargetAmount({ isTransfer: type === transfer, amount: amountStr, walletId: sourceWalletId|walletId, targetWalletId, wallets })`.
- Прокинуть в `onSave`: при переводе `targetWalletId` + `targetAmount = targetAmountNumber`; для остальных типов `targetWalletId/targetAmount` не отправляются.
- Валидация перевода: требовать выбранный `targetWalletId` и `targetAmountNumber > 0` (сообщения через существующий `setValidationError`/`ErrorBanner`). Сообщения на русском.
- Вернуть в экран: `creditedValue`, `onCreditedChange`, `showCreditedRow = isTransfer && isCrossCurrency`, `targetCurrency`, `conversionRate`, `sourceCurrency`.

### Шаг 9 — Компонент `CreditedAmountRow.tsx` (новый, папка экрана)
- Props (≤7): `value`, `onChangeText`, `currencyCode`/`currencySymbol`, `rate` (для pill), `sourceCurrencySymbol`.
- Разметка по `designs/screens/transaction-edit.html` (строка `rowCredited`): иконка `arrow-down-to-line`, лейбл «Зачислено», inline `TextInput` (моноширинный, accent-blue) с символом валюты получателя; справа pill (`repeat` + «1 {source} = {rate} {target}»).
- NativeWind className (без inline style для layout; динамический цвет — допустимо). Без хардкода hex вне согласованных accent-токенов проекта (повторить подход существующего экрана, использующего hex-константы accent — допускается, как в текущем файле).
- ≤150 строк, бизнес-логики нет (всё в хуке).

### Шаг 10 — Встраивание в `EditTransactionScreen.tsx`
- Рендерить `CreditedAmountRow` внутри `form-card` сразу после строки «Кошелёк-получатель», только когда `showCreditedRow`.
- Прокинуть значения из хука. Существующая верстка/анимации не ломаются.

## Verification
- `rtk yarn lint` — без ошибок.
- `rtk yarn tsc --noEmit` — без ошибок.
- Ручная проверка сценариев (dev): перевод между кошельками одной валюты (строка «Зачислено» скрыта, сохраняется без targetAmount-конвертации), перевод между разными валютами (авторасчёт, ручной override, pill с курсом, успешный save с `targetAmount`).
- Чек-лист post-code: kopeck-математика, инвалидция кэша в мутациях (уже есть), нет array-index ключей, нет inline-style для layout.

## Out of scope
- Split-режим (разбиение транзакции на части).
- Любые изменения в `fin-app-backend` (включая `@ApiProperty` для DTO).
- Мультивалютная агрегация балансов.
- Изменение источника/семантики курса (только `pickSellRate` vs UAH, как на фронте).
- Git-операции и коммиты.

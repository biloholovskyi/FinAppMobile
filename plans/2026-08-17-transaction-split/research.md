# Research — Разделение платежа

Facts-only discovery. Дата: 17.08.2026.

## Затронутые файлы

| Файл | Роль |
|------|------|
| `src/features/operations/EditTransactionScreen/EditTransactionScreen.tsx` | JSX экрана: сегменты типа, поле суммы, карточка формы, кнопки |
| `src/features/operations/EditTransactionScreen/useEditTransactionScreen.ts` | Композиция: данные + форма + действия, валидация и сбор payload в `onSave` |
| `src/features/operations/EditTransactionScreen/useEditTransactionForm.ts` | Локальное состояние формы, гидрация из `transaction` |
| `src/features/operations/EditTransactionScreen/useEditTransactionActions.ts` | Мутации create / update / delete, инвалидация, ошибки |
| `src/features/operations/EditTransactionScreen/useEditTransactionData.ts` | Загрузка транзакции, категорий, кошельков |
| `src/features/operations/EditTransactionScreen/FormRow.tsx` | Переиспользуемая строка формы (иконка, лейбл, значение, шеврон) |
| `src/features/operations/EditTransactionScreen/CategoryPickerModal/CategoryPickerModal.tsx` | Модалка выбора категории и подкатегории |
| `src/features/operations/EditTransactionScreen/ErrorBanner.tsx` | Баннер ошибки над кнопкой сохранения |
| `src/shared/api/transactions.ts` | `updateTransaction` (PATCH `wallets/transactions/{id}`), `deleteTransaction`, `fetchTransactions` |
| `src/shared/api/generated/wallets/wallets.ts` | `useWalletControllerCreateTransaction` (POST создание транзакции) |
| `src/entities/transaction/index.ts` | `WalletTransactionType`, тип `Transaction` |
| `src/shared/utils/currency.ts` | `parseAmountInput`, `getCurrencySymbol` |
| `src/shared/constants/queryKeys.ts` | `QUERY_KEYS.transactions.all`, `QUERY_KEYS.wallets.all` |
| `designs/screens/transaction-edit.html` | Утверждённый прототип разделения |

## Текущие контракты

- Обновление транзакции идёт через ручной модуль `src/shared/api/transactions.ts` (legacy read-only слой), создание — через generated-хук `useWalletControllerCreateTransaction`. Оба пути уже сосуществуют в `useEditTransactionActions.ts`.
- Generated-модели `CreateWalletTransactionDto` и `UpdateWalletTransactionDto` объявлены как `{ [key: string]: unknown }` — типизации полей в OpenAPI-контракте нет. Это пробел бэкенд-контракта: типобезопасность payload обеспечивается локальным типом `SavePayload`, а не generated-моделью.
- Суммы приходят и отправляются в копейках. Форма держит строку в рублях: гидрация `String(Math.abs(transaction.amount) / 100)`, отправка `parseAmountInput` + знак (`expense` → отрицательный).
- `walletId` в режиме редактирования берётся из `transaction.walletId`; в payload создания передаётся явно.
- После успешной мутации: инвалидация `QUERY_KEYS.transactions.all` и `QUERY_KEYS.wallets.all`, затем `router.back()`.
- Категория и подкатегория показываются только для не-переводов (`showCategoryRows`); подкатегория — только если у категории есть `subCategory`.
- Ошибки мутаций складываются в один `errorMessage` через `getApiErrorMessage`, показываются в `ErrorBanner`.

## Границы

- Разделение применимо только к `WalletTransactionType.expense`.
- Разделение доступно только в режиме редактирования существующей транзакции (`isCreateMode === false`): в режиме создания исходной транзакции ещё нет.
- Копируемые из исходной транзакции поля новой транзакции: `walletId`, `type`, `description`, `transactionTime`. Собственные поля: `categoryId`, `subCategoryId`, `amount`.
- `targetWalletId` и `targetAmount` для новой транзакции всегда пустые — разделение не работает с переводами.

## Открытые вопросы (решены)

| Вопрос | Решение |
|--------|---------|
| Сколько частей | Ровно одна дополнительная часть за раз |
| Как считается сумма | Верхнее поле = базовая сумма − сумма новой части, read-only на время разделения |
| Порядок запросов | Сначала PATCH исходной, затем POST новой |
| Частичный успех | Отдельное состояние, повторное сохранение не вычитает сумму повторно |
| Версия релиза | 1.8.0 |

## Ссылки

- `ai/rules/projects/fin-app-mobile/architecture.md`
- `ai/rules/projects/fin-app-mobile/state-management.md`
- `ai/rules/common/patterns.md`

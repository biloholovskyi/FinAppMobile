# Research — эквивалент транзакций в UAH

Дата: 05.10.2026

## Бэкенд-контракт

- `rtk yarn api:generate` выполнен 05.10.2026 по запросу пользователя; `rtk yarn tsc --noEmit` после генерации проходит без ошибок
- `WalletTransactionModel` получил поля `currency`, `exchangeRate`, `amountUah` — все nullable и необязательные
- `currency` — валюта кошелька-источника на момент создания, в нижнем регистре (`usd`, `uah`); `null` для переводов
- `exchangeRate` — курс к UAH, применённый к транзакции; для UAH равен `1`; `null` для переводов
- `amountUah` — эквивалент в копейках UAH, `Math.round(amount * exchangeRate)`, знак совпадает со знаком `amount`; `null` для переводов
- Источник: `fin-app-backend/src/core/wallet/transaction-currency.service.ts`, `utils/amount-uah.util.ts`
- Создание транзакции берёт текущий курс (`rateSell ?? rateCross` Monobank); обновление пересчитывает `amountUah` по сохранённому `exchangeRate`
- `POST /wallets/transactions/backfill-amount-uah` заполняет поля для старых транзакций; транзакции без курса попадают в `skipped` и остаются с `amountUah = null`
- В `@ApiProperty` бэкенда для трёх полей не указан `type`, поэтому Orval генерирует `{ [key: string]: unknown } | null` (как и для `targetAmount`); фактический рантайм-тип — `string | null` и `number | null`
- Попутно сгенерированы модули `monthly-reports`, `reserve-plans`, поле `WalletModel.purpose`, параметры `purpose` и `walletId` в `walletControllerGetAllTransactions` — к этой задаче не относятся

## Затронутые файлы клиента

- `src/entities/transaction/index.ts` — рукописный тип `Transaction`, полей валюты и эквивалента нет
- `src/entities/transaction/lib/normalizeTransactionsPage.ts` — приведение ответа к `Transaction[]` через `unknown`
- `src/shared/api/transactions.ts` — `fetchTransactions` (`GET /wallets/transactions` без пагинации), используется экраном расходов
- `src/features/operations/OperationsScreen/OperationsScreen.tsx` — строка транзакции: сумма в валюте кошелька через `formatAmount` и `getCurrencySymbol(tx.wallet?.currency)`
- `src/features/operations/OperationsScreen/useTransactionsDayGroups.ts` — итог дня `total += tx.amount`, суммирует разные валюты и переводы
- `src/shared/utils/dateAndTime.ts` — `formatDayTotal` (копейки → `±N ₴`, литерал `100`)
- `src/features/categorySpending/CategorySpendingScreen/lib/aggregateCategorySpending.ts` — суммы категорий, подкатегорий и «Потрачено» через `Math.abs(t.amount)`, без учёта валюты
- `src/features/operations/EditTransactionScreen/AmountField.tsx` — поле суммы, символ валюты кошелька, строка `hint`
- `src/features/operations/EditTransactionScreen/useEditTransactionScreen.ts` — `walletId`, `sourceCurrency`, сборка пропсов экрана
- `src/features/operations/EditTransactionScreen/useTransactionSplit.ts` — остаток суммы при разделении платежа
- `src/entities/transaction/lib/useTransferTargetAmount.ts` — эталон запроса курса: `useCurrencyRateControllerGetRate`, `pickSellRate`, `RATE_STALE_TIME_MS`
- `src/shared/utils/currencyConversion.ts` — `UAH_CURRENCY_CODE`, `pickSellRate`, `roundAmount`
- `src/shared/utils/currency.ts` — `formatAmount`, `formatUah`, `getCurrencySymbol`

## Вне задачи, но с тем же дефектом

- `src/features/dashboard/lib/aggregateExpenses.ts` суммирует `t.amount` без учёта валюты

## Ограничения

- FSD: `app → features → entities → shared`; хелперы эквивалента нужны в двух фичах — место в `entities/transaction`
- Деньги в копейках: `/KOPECK_DIVISOR` при отображении
- Локаль `uk-UA`, валюта `UAH`
- `className` для раскладки, без новых hex-литералов
- Изменения только в JS — доставка OTA

## Эталон визуала

- `designs/screens/transactions.html` — строка `.tx-amount-uah` под суммой
- `designs/screens/transaction-edit.html` — блок `#uahEquiv` под полем суммы

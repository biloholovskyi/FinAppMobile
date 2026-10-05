# Design — эквивалент транзакций в UAH

## Модель

- `Transaction` содержит `currency?: string | null`, `exchangeRate?: number | null`, `amountUah?: number | null`
- `src/entities/transaction/lib/transactionUah.ts` — единственный источник логики эквивалента:
  - `getTransactionCurrency(tx)` — `tx.currency ?? tx.wallet.currency ?? UAH`, в верхнем регистре
  - `isForeignCurrencyTransaction(tx)` — не перевод и валюта не UAH
  - `getTransactionAmountUah(tx)` — копейки UAH со знаком или `null`:
    - перевод → `null`
    - `amountUah` — конечное число → оно
    - валюта UAH → `amount`
    - иначе → `null` (не заполнено бэкфилом)
  - `getTransactionExchangeRate(tx)` — `exchangeRate`, если это конечное положительное число, иначе `null`
  - `getSignedUahAmount(tx)` — модуль `getTransactionAmountUah` со знаком по типу: доход `+`, расход `−`; `null`, если эквивалента нет
- Хелперы проверяют рантайм-тип (`typeof === 'number'`, `Number.isFinite`) — сгенерированный тип поля неточный (`{ [key]: unknown }`)
- Экспорт через `src/entities/transaction/index.ts`

## Лента операций

| Транзакция | Строка суммы | Строка эквивалента | Итог дня |
|------------|--------------|--------------------|----------|
| Расход/доход UAH | `−320 ₴` | нет | входит |
| Расход/доход в валюте | `−12,50 $` | `≈ −514 ₴` | входит по `amountUah` |
| Расход/доход в валюте без `amountUah` | `−12,50 $` | нет | не входит |
| Перевод | как сейчас | нет | не входит |

- Строка эквивалента — под суммой, над временем; моноширинный шрифт, 10–11px, цвет `text-secondary`, без акцентного цвета
- Итог дня = сумма `getSignedUahAmount` по видимым после фильтра транзакциям
- `DayGroup` получает `hasTotal`; итог не показывается, если в группе нет ни одной учтённой транзакции (например, фильтр «Переводы»)
- Форматирование итога — `formatDayTotal` через `KOPECK_DIVISOR`

## Расходы по категориям

- Агрегатор берёт сумму расхода через `getTransactionAmountUah` по модулю
- Расход без эквивалента в суммы не входит
- «Потрачено», суммы категорий, подкатегорий и проценты — в UAH; бюджеты уже в UAH
- Плоский режим (`flattenSpendingRows`) получает UAH-строки без изменений

## Экран редактирования

- Эквивалент виден, когда тип не перевод, кошелёк выбран и его валюта не UAH
- Курс:
  - редактирование транзакции, у которой есть `exchangeRate`, и тип остаётся не переводом → сохранённый `exchangeRate` (бэкенд пересчитает по нему же)
  - иначе (создание, бывший перевод) → текущий курс `useCurrencyRateControllerGetRate` + `pickSellRate`, запрос включён только когда эквивалент виден
- Значение = текущая сумма поля × курс, округление до копеек
- При активном разделении платежа считается от остатка, который показывает верхнее поле
- Отображение под полем суммы: `≈ 13 150,00 ₴` и подпись курса `1 $ = 41,10 ₴`
- Пока курс загружается или недоступен — блок не показывается, сохранение не блокируется
- Логика — хук `src/features/operations/EditTransactionScreen/useAmountUahEquivalent.ts`; отображение — компонент `AmountUahEquivalent.tsx`, который `AmountField` рендерит вместо или рядом с `hint`

## Поток данных

- Лента: `walletControllerGetAllTransactions` → `normalizeTransactionsPage` → `Transaction[]` → `useTransactionsDayGroups` и строка
- Расходы: `fetchTransactions` → `aggregateCategorySpending`
- Редактор: `transaction` + выбранный кошелёк + `amountStr` → `useAmountUahEquivalent` → `AmountField`
- Новых query-ключей и мутаций нет; инвалидации не меняются

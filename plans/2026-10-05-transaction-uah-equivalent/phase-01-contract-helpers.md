# Phase 01 — Контракт транзакции и UAH-хелперы

- Status: done
- Model tier: BALANCED
- Required rules: `ai/rules/common/patterns.md`, `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/projects/fin-app-mobile/state-management.md`

## Goal

Тип `Transaction` описывает валюту и эквивалент, а вся логика эквивалента живёт в одном модуле `entities/transaction`.

## Implementation Notes

- Сгенерированный клиент уже обновлён; фаза принимает diff `src/shared/api/generated/` как есть, ручных правок в нём нет
- Рантайм-тип полей проверяется в хелперах, а не приведением типов — сгенерированный тип неточный
- Сравнение валют — в верхнем регистре через `UAH_CURRENCY_CODE`
- `getSignedUahAmount` ставит знак по типу транзакции, а не по знаку `amountUah`, — так же устроена строка суммы

## Scope

- `src/entities/transaction/index.ts` — `Transaction` содержит `currency?: string | null`, `exchangeRate?: number | null`, `amountUah?: number | null`; реэкспорт хелперов
- `src/entities/transaction/lib/transactionUah.ts` — `getTransactionCurrency`, `isForeignCurrencyTransaction`, `getTransactionAmountUah`, `getSignedUahAmount`, `getTransactionExchangeRate` по `design.md`
- `src/shared/utils/dateAndTime.ts` — `formatDayTotal` делит на `KOPECK_DIVISOR`

## Checklist

- [x] Перевод → `getTransactionAmountUah` возвращает `null`
- [x] UAH-транзакция без `amountUah` → возвращается `amount`
- [x] Валютная транзакция без `amountUah` → `null`
- [x] Нечисловое или нефинитное значение поля трактуется как отсутствующее
- [x] Все экспортируемые функции с JSDoc, без `any`
- [x] `expo-router` не импортируется

## Verification Commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`

## Acceptance Criteria

- Оба гейта проходят
- `grep -rn "amountUah" src --include=*.ts* | grep -v generated` показывает обращения только в `entities/transaction`

## Evidence Note

Выполнено 05.10.2026.

- `src/entities/transaction/lib/transactionUah.ts` — `getTransactionCurrency`, `isForeignCurrencyTransaction`, `getTransactionExchangeRate`, `getTransactionAmountUah`, `getSignedUahAmount`; вход принимает поля валюты как `unknown` и проверяет `typeof === 'number' && Number.isFinite`
- `Transaction` получил `currency`, `exchangeRate`, `amountUah`; хелперы реэкспортированы из `src/entities/transaction/index.ts`
- `formatDayTotal` делит на `KOPECK_DIVISOR`
- Гейты: `rtk proxy yarn.cmd lint` — exit 0, 0 ошибок, 3 старых предупреждения вне scope; `rtk proxy yarn.cmd tsc --noEmit` — exit 0
- Grep `amountUah`: поле читается только в `entities/transaction`; совпадения в `src/features/dashboard/lib/aggregateExpenses.ts` — локальная переменная с тем же именем, не поле API (файл вне scope)
- `transactionUah.ts` импортирует `WalletTransactionType` из `../index` — цикл безопасен, enum читается только внутри функций

## Handoff Note

- Хелперы эквивалента — `@/entities/transaction`, других источников логики нет
- Фазы 02–04 используют `getSignedUahAmount` (итог дня), `getTransactionAmountUah` (категории), `getTransactionExchangeRate` (редактор)
- Сгенерированный клиент не правился

# Phase 02 — Лента операций: эквивалент и итог дня

- Status: done
- Model tier: BALANCED
- Required rules: `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/common/react.md`, `ai/rules/common/performance/_index.md`

## Goal

Строка валютной транзакции показывает `≈ ±N ₴`, итог дня считается в UAH без переводов.

## Implementation Notes

- Визуал — `.tx-amount-uah` из `designs/screens/transactions.html`
- Строку эквивалента вынести в отдельный компонент, чтобы не раздувать `OperationsScreen.tsx`; новый код — на `className`
- Формат эквивалента: `≈ ` + знак по типу + `formatAmount(abs)` + ` ₴`
- `DeleteTransactionModal` показывает сумму в валюте кошелька — не меняется

## Scope

- `src/features/operations/OperationsScreen/useTransactionsDayGroups.ts` — `total` = сумма `getSignedUahAmount`, `null` пропускается; `DayGroup.hasTotal` — есть хотя бы одна учтённая транзакция
- `src/features/operations/OperationsScreen/TransactionAmountUah.tsx` — строка эквивалента; `null`, если транзакция не валютная или эквивалента нет
- `src/features/operations/OperationsScreen/OperationsScreen.tsx` — строка транзакции рендерит `TransactionAmountUah` между суммой и временем; заголовок дня скрывает итог при `!hasTotal`

## Checklist

- [x] UAH-транзакция и перевод — без строки эквивалента
- [x] Перевод не меняет итог дня
- [x] Фильтр «Переводы» — итоги дней скрыты
- [x] Цвет строки — `text-secondary`, без hex-литералов
- [x] Перерендеры строки не растут: компонент без собственного состояния, вычисление из `tx`

## Verification Commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`

## Acceptance Criteria

- Оба гейта проходят
- Ручная проверка через `rtk npx expo start`: валютная транзакция показывает эквивалент, итог дня совпадает с суммой эквивалентов доходов и расходов

## Evidence Note

Выполнено 05.10.2026.

- `useTransactionsDayGroups.ts` — итог по `getSignedUahAmount`, поле `hasTotal`
- `TransactionAmountUah.tsx` — новый компонент, без состояния; `text-[#8888AA] text-[10px] font-[monospace]` — существующий токен экрана
- `OperationsScreen.tsx` — рендер строки эквивалента, символ валюты по `getTransactionCurrency`, итог дня скрыт при `!hasTotal`
- Гейты: `rtk proxy npx.cmd eslint src/features/operations src/shared/utils` — exit 0, 0/0; `rtk proxy yarn.cmd tsc --noEmit` — exit 0
- Ручная проверка через `expo start` не выполнялась — за пользователем

## Handoff Note

- Итог дня — сумма `getSignedUahAmount`, переводы не входят; `DayGroup.hasTotal` скрывает итог без учтённых транзакций
- `TransactionAmountUah.tsx` — строка `≈ ±N ₴` между суммой и временем
- Символ суммы строки берётся из `getTransactionCurrency(tx)`

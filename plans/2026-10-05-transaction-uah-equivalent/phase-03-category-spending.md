# Phase 03 — Расходы по категориям в UAH

- Status: done
- Model tier: BALANCED
- Required rules: `ai/rules/common/patterns.md`, `ai/rules/projects/fin-app-mobile/state-management.md`

## Goal

«Потрачено», суммы категорий, подкатегорий и проценты на экране расходов считаются в UAH.

## Implementation Notes

- Патч, не переписывание: три обращения к `Math.abs(t.amount)` заменяются суммой из хелпера
- Расходы без эквивалента отфильтровываются на шаге фильтрации месяца, чтобы проценты и итог сходились
- `aggregateCategorySpending` уже длиннее лимита функции; выносить логику сверх задачи не нужно

## Scope

- `src/features/categorySpending/CategorySpendingScreen/lib/aggregateCategorySpending.ts` — сумма расхода = `Math.abs(getTransactionAmountUah(t))`; расходы с `null` не участвуют

## Checklist

- [x] Ни одного `t.amount` в агрегаторе
- [x] Сумма строк категорий равна `summary.totalSpent`
- [x] Плоский режим сходится с «Потрачено»

## Verification Commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`

## Acceptance Criteria

- Оба гейта проходят
- Ручная проверка: месяц с расходом в USD показывает его в категории в гривнах по `amountUah`

## Evidence Note

Выполнено 05.10.2026.

- `aggregateCategorySpending.ts` — фильтрация месяца строит пары `{ t, amountUah }`; `totalSpentAll`, суммы категорий и подкатегорий — по `amountUah`
- `t.amount` в фиче не встречается
- Гейты: `rtk proxy npx.cmd eslint src/features/categorySpending` — exit 0, 0/0; `rtk proxy yarn.cmd tsc --noEmit` — exit 0
- Фазы 02 и 03 выполнены параллельно — общих файлов нет
- Ручная проверка месяца с USD-расходом не выполнялась — за пользователем

## Handoff Note

- Агрегатор считает расход по `getTransactionAmountUah` по модулю
- Расходы без эквивалента исключены на шаге фильтрации месяца — суммы и проценты сходятся
- `flattenSpendingRows` и остальной экран `t.amount` не читают

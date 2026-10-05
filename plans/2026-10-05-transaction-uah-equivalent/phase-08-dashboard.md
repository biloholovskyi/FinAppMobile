# Phase 08 — Расходы на дашборде в UAH и единые границы месяца

- Status: done
- Model tier: BALANCED
- Required rules: `ai/rules/common/patterns.md`, `ai/rules/projects/fin-app-mobile/architecture.md`

## Goal

Расход текущего месяца, сравнение с прошлым месяцем и график на дашборде считаются в UAH по `amountUah`, а дашборд и экран категорий относят транзакцию к одному и тому же месяцу по локальному времени устройства.

## Implementation Notes

- Патч, не переписывание: в `aggregateExpenses` меняется только источник суммы расхода
- Сумма расхода — `getTransactionAmountUah` по модулю, в гривнах через деление на `KOPECK_DIVISOR`; расход с `null` пропускается, как в `aggregateCategorySpending`
- `transactionTime` — реальный момент времени (клиент сохраняет `toISOString()` локальной даты), поэтому месяц транзакции определяется в локальном времени: `getFullYear()` / `getMonth()`
- Решение пользователя: выровнять границы месяца в этой фазе; экран категорий переходит с UTC на локальное время, дашборд остаётся на локальном
- Комментарий об UTC в `aggregateCategorySpending` заменяется пояснением о локальном месяце
- `ExpenseComparisonCard` и `ExpenseDynamicsCard` получают те же поля, что и раньше

## Scope

- `src/features/dashboard/lib/aggregateExpenses.ts` — дневные суммы текущего и прошлого месяца строятся из `getTransactionAmountUah`; литерал `100` заменён на `KOPECK_DIVISOR`
- `src/features/categorySpending/CategorySpendingScreen/lib/aggregateCategorySpending.ts` — фильтр месяца по `getFullYear()` / `getMonth()`

## Checklist

- [x] Ни одного `t.amount` в `aggregateExpenses.ts`
- [x] Валютный расход без эквивалента не входит ни в итоги, ни в график
- [x] Переводы и доходы по-прежнему не учитываются
- [x] Литерала `/ 100` в файле нет
- [x] Оба агрегатора определяют месяц транзакции в локальном времени, `getUTC*` в них нет

## Verification Commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`

## Acceptance Criteria

- Оба гейта проходят
- `grep -n "t\.amount\|/ 100" src/features/dashboard/lib/aggregateExpenses.ts` пуст
- `grep -n "getUTC" src/features/dashboard/lib/aggregateExpenses.ts src/features/categorySpending/CategorySpendingScreen/lib/aggregateCategorySpending.ts` пуст
- Ручная проверка: USD-расход текущего месяца входит в сумму дашборда по `amountUah`; без транзакций с будущей датой сумма дашборда совпадает с «Потрачено» экрана категорий

## Evidence Note

Выполнено 05.10.2026.

- `aggregateExpenses.ts` — сумма расхода `Math.abs(getTransactionAmountUah(t)) / KOPECK_DIVISOR`, `null` пропускается; выход по-прежнему в гривнах; локальные `getFullYear`/`getMonth`/`getDate` без изменений
- `aggregateCategorySpending.ts` — фильтр месяца на `getFullYear()`/`getMonth()`, комментарий о локальном месяце
- Критерий grep уточнён: `t\.amount` (неэкранированная точка давала ложное совпадение на `const amountUah`); `grep -n "t\.amount\|/ 100"` и `grep -n "getUTC"` по обоим файлам пусты
- Гейты: `rtk proxy yarn.cmd lint` — exit 0, 0 ошибок, 3 старых предупреждения; `rtk proxy yarn.cmd tsc --noEmit` — exit 0
- Ревью фазы — за пользователем; ручная проверка на устройстве не выполнялась

## Handoff Note

- Дашборд считает расход через `getTransactionAmountUah` / `KOPECK_DIVISOR`, валютные расходы без эквивалента пропускаются
- Дашборд и экран категорий определяют месяц транзакции по локальному времени
- Техдолг: группировка ленты по дням (`useTransactionsDayGroups`) режет дату по UTC (`transactionTime.slice(0, 10)`, `toISOString()`) — та же проблема у полуночи

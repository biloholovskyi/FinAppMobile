# Phase 01 — Модель фильтра и состояние экрана

- Status: done
- Model tier: BALANCED
- Required rules: `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/common/react.md`, `ai/rules/common/patterns.md`

## Goal

Хук экрана отдаёт отфильтрованный список, статистику превышения и состояние фильтра в обоих режимах.

## Implementation Notes

- Критерий превышения берётся только из `getBudgetProgress(...).isExceeded` — собственных расчётов процента нет
- `selectOverBudget` — один проход, порядок элементов сохраняется
- Если `useCategorySpendingScreen` выходит за 50 строк — сборка `allItems` выносится в `useSpendingListItems.ts`
- UI в этой фазе не меняется: экран продолжает рендерить `listItems`, при выключенном фильтре поведение идентично текущему

## Scope

Target state:

- `src/shared/constants/spendingViewMode.ts` — константы фильтра из `design.md`, раздел «Модель данных», каждая с JSDoc
- `src/shared/constants/index.ts` — ре-экспорт новых констант
- `src/features/categorySpending/CategorySpendingScreen/lib/filterOverBudget.ts` — `getListItemBudget`, `OverBudgetStats`, `selectOverBudget`
- `src/features/categorySpending/CategorySpendingScreen/useOverBudgetFilter.ts` — `isOverOnly`, `onToggleOverOnly`, `onResetOverOnly`
- `src/features/categorySpending/CategorySpendingScreen/useCategorySpendingScreen.ts` — `listItems` с учётом фильтра, `overStats`, `isOverOnly`, обработчики, `sectionLabel` с суффиксом

## Checklist

- [x] `getListItemBudget` разбирает `kind` исчерпывающим `switch` со стражем `never`
- [x] `overspend` — сумма `totalSpent − budget` в копейках по превышенным элементам
- [x] `budgetedCount` считает элементы с `hasBudget`
- [x] `selectOverBudget` обёрнут в `useMemo` от `allItems`
- [x] Обработчики фильтра стабилизированы `useCallback`
- [x] Смена режима и месяца не сбрасывает `isOverOnly`
- [x] Суффикс подписи секции — из `OVER_BUDGET_SECTION_SUFFIX`, не литерал в JSX
- [x] Каждый хук ≤ 50 строк
- [x] Новые файлы не импортируют `expo-router`

## Verification Commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`

## Acceptance Criteria

- Оба гейта проходят без ошибок
- При `isOverOnly = false` экран выглядит и ведёт себя как до фазы
- `overStats.overCount` равен числу элементов с `isExceeded` в текущем режиме

## Evidence Note

- Файлы: `shared/constants/spendingViewMode.ts` (+константы, JSDoc у каждой), `shared/constants/index.ts` (ре-экспорт), `lib/filterOverBudget.ts` (58 строк), `useOverBudgetFilter.ts` (23), `useSpendingListItems.ts` (48 строк, новый), `useCategorySpendingScreen.ts` (37 строк)
- Отклонение: сборка `allItems` и `selectOverBudget` вынесены в `useSpendingListItems.ts` — по правилу Implementation Notes, так как хук экрана выходил за 50 строк (52)
- `rtk yarn lint` — `rtk` не нашёл программу, выполнено `rtk proxy yarn.cmd lint`: exit 0, 0 ошибок, 3 предупреждения вне области фазы (`useDashboardScreen.ts`, `shared/api/base.ts`)
- `rtk yarn tsc --noEmit` — через `rtk proxy yarn.cmd tsc --noEmit`: exit 0
- UI не менялся: при `isOverOnly = false` `listItems` идентичен прежнему

## Handoff Note

- Хук экрана отдаёт `isOverOnly`, `onToggleOverOnly`, `onResetOverOnly`, `overStats`, `listItems` с учётом фильтра
- `sectionLabel` получает суффикс `OVER_BUDGET_SECTION_SUFFIX` при включённом фильтре
- Список собирается в `useSpendingListItems`; `selectOverBudget` — в `useMemo` от `allItems`
- Константы фильтра экспортируются из `@/shared/constants`
- Для Phase 02: экран пока скрывает подпись секции при пустом `listItems`

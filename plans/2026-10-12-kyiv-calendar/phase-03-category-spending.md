# Phase 03 — Расходы по категориям и шторка транзакций

- Status: done
- Model tier: BALANCED — замена `Date` на `MonthKey` по цепочке хуков
- Required rules: `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/projects/fin-app-mobile/state-management.md`, `ai/rules/common/react.md`

## Goal

Экран расходов, переключатель месяцев и шторка транзакций работают с киевским `MonthKey`, а ключ бюджета строится от киевского месяца.

## Implementation Notes

- Патч по таблице «Применение» в [design.md](design.md); `parseMonthStr.ts` удаляется, разбор параметра маршрута — `normalizeMonthParam` в `lib/normalizeMonthParam.ts`
- Формат `monthStr` (`YYYY-MM-01T00:00:00.000Z`), ключ запроса `QUERY_KEYS.budgets.month(monthStr)` и параметр маршрута `month` не меняются
- Сумма по экрану и по шторке за месяц совпадают — общий фильтр `selectMonthExpenses`
- Hex-литералы и inline `style` в `MonthSwitcher` и `SheetHeader` вне scope (техдолг прошлого плана)

## Scope

- `src/features/categorySpending/lib/selectMonthExpenses.ts`
- `src/features/categorySpending/lib/parseMonthStr.ts` — удалён
- `src/features/categorySpending/lib/normalizeMonthParam.ts` — новый
- `src/features/categorySpending/lib/spendingLeaf.ts`
- `src/features/categorySpending/CategorySpendingScreen/useMonthNavigation.ts`
- `src/features/categorySpending/CategorySpendingScreen/MonthSwitcher.tsx`
- `src/features/categorySpending/CategorySpendingScreen/CategorySpendingScreen.tsx`
- `src/features/categorySpending/CategorySpendingScreen/useCategorySpendingScreen.ts`
- `src/features/categorySpending/CategorySpendingScreen/useSpendingData.ts`
- `src/features/categorySpending/CategorySpendingScreen/lib/aggregateCategorySpending.ts`
- `src/features/categorySpending/SpendingTransactionsSheet/useSpendingLeafData.ts`
- `src/features/categorySpending/SpendingTransactionsSheet/SpendingTransactionsSheet.tsx`
- `src/features/categorySpending/SpendingTransactionsSheet/SheetHeader.tsx`
- `src/features/categorySpending/SpendingTransactionsSheet/lib/groupTransactionsByDay.ts`
- `src/app/spending/[leafKey].tsx` — проп `month` через `normalizeMonthParam`

## Checklist

- [x] Перечитан «Изменения design» в backend `history.md`; новые записи — план обновлён, пользователь уведомлён
- [x] Навигация хранит `MonthKey`; «вперёд» закрыт на текущем киевском месяце
- [x] Ключ бюджета — `toBudgetMonthKey`
- [x] Фильтр месяца и группировка шторки — по киевской дате момента
- [x] Подписи месяца и дня — через `formatMonthKey` / `formatDayKey`
- [x] `rg -n "parseMonthStr|selectedMonth" src` — пусто

## Verification Commands

- `rtk yarn calendar:check`
- `rtk yarn lint`
- `rtk yarn tsc --noEmit`
- `rg -n "getFullYear\(|getMonth\(|getDate\(|new Date\(\w+, |toLocaleDateString" src/features/categorySpending src/app/spending`

## Acceptance Criteria

- Lint и tsc — exit 0; `calendar:check` — PASS
- Оба `rg` — пусто
- Устройство (TZ `America/New_York`): транзакция `2026-09-30T21:30:00.000Z` в октябре и на экране, и в шторке; бюджет октября запрашивается с `2026-10-01T00:00:00.000Z`

## Evidence Note

- Backend «Изменения design» перечитан 12.10.2026 — новых записей нет
- Отклонения от design (внесены в `design.md`): `normalizeMonthStr` → `normalizeMonthParam` (возвращает `MonthKey`, а не строку); `useSpendingData(month)` строит ключ бюджета сам; шторка и `SheetHeader` получают `month: MonthKey`
- Параметр маршрута `month` и `QUERY_KEYS.budgets.month(monthStr)` — формат `YYYY-MM-01T00:00:00.000Z` без изменений
- `lint` exit 0 (3 warnings вне scope); `tsc --noEmit` exit 0; `calendar:check` exit 0; оба `rg` фазы — пусто
- Устройство (TZ `America/New_York`): пользователь подтвердил 12.10.2026 — всё ок

## Handoff Note

- Выбранный месяц статистики — `MonthKey`; `monthStr` (ключ бюджета) выводится из него
- `useSpendingData(month)`, `selectMonthExpenses(transactions, month)`, `filterLeafTransactions(..., month)` принимают `MonthKey`
- Параметр маршрута шторки разбирает `normalizeMonthParam`
- `DaySection.dayKey` — `DayKey`

# Phase 04 — Дашборд

- Status: done
- Model tier: BALANCED — локальная замена расчётов на ключи
- Required rules: `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/common/patterns.md`

## Goal

Сравнение расходов с прошлым месяцем по дням считается по киевским дням и месяцам.

## Implementation Notes

- Патч по таблице «Применение» в [design.md](design.md)
- `aggregateExpenses` принимает `today: DayKey`; форма результата (`AggregateResult`) не меняется
- Имена месяцев (`MONTH_NAMES`, `MONTH_NAMES_GENITIVE`) остаются в `useDashboardScreen.ts`, индекс — из `splitMonthKey`

## Scope

- `src/features/dashboard/lib/aggregateExpenses.ts`
- `src/features/dashboard/DashboardScreen/useDashboardScreen.ts`

## Checklist

- [x] Перечитан «Изменения design» в backend `history.md`; новые записи — план обновлён, пользователь уведомлён
- [x] Текущий и прошлый месяц — `MonthKey`, длины — `getDaysInMonth`
- [x] День транзакции — из `getKyivDayKey`
- [x] Январь корректно сравнивается с декабрём прошлого года (`shiftMonthKey`)

## Verification Commands

- `rtk yarn calendar:check`
- `rtk yarn lint`
- `rtk yarn tsc --noEmit`
- `rg -n "getFullYear\(|getMonth\(|getDate\(|new Date\(\w+, " src/features/dashboard`

## Acceptance Criteria

- Lint и tsc — exit 0; `calendar:check` — PASS
- `rg` — пусто
- Устройство (TZ `America/New_York`): номер текущего дня и месяц на дашборде — киевские

## Evidence Note

- Backend «Изменения design» перечитан 12.10.2026 — новых записей нет
- `aggregateExpenses(transactions, today: DayKey)`: месяцы — `MonthKey`, прошлый — `shiftMonthKey(current, -1)` (январь → декабрь прошлого года), длины — `getDaysInMonth`, день транзакции — `getKyivDayKey`
- `useDashboardScreen`: `today = getKyivToday()`, индексы имён месяцев — из `splitMonthKey`; ручной переход `0 → 11` удалён
- Вне scope: сеттер `setMonth` в `useMonthNavigation.ts` (фаза 03) переименован в `setSelectedMonth` — совпадал с шаблоном поиска `setMonth\(`
- Поиск из задачи по всему `src` — совпадения только в `src/shared/utils/kyivCalendar/` (`dayKey.ts`, `monthKey.ts`, `kyivParts.ts`)
- `lint` exit 0 (3 warnings вне scope); `tsc --noEmit` exit 0; `calendar:check` exit 0; `rg` фазы — пусто
- Устройства (TZ `America/New_York`): пользователь подтвердил 12.10.2026 — всё ок

## Handoff Note

- `aggregateExpenses` принимает `today: DayKey`
- Поиск из задачи по `src` — только утилита календаря; фаза 05 проверяет это повторно после ревью

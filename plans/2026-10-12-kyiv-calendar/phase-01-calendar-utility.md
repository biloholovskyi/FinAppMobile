# Phase 01 — Утилита календаря и скрипт сценариев

- Status: done
- Model tier: DEEP — ядро контракта календаря, DST и разбор `Intl` без фолбэков вслепую
- Required rules: `ai/rules/common/patterns.md`, `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/common/tooling.md`

## Goal

`src/shared/utils/kyivCalendar/` реализует контракт из [design.md](design.md), и `rtk yarn calendar:check` подтверждает все сценарии при TZ `UTC`, `America/New_York`, `Europe/Kyiv`.

## Implementation Notes

- Новый код с нуля; потребители в этой фазе не меняются
- Только стираемый синтаксис TypeScript — файлы исполняются Node 24 напрямую
- Импорт констант — по точному пути файла (`@/shared/constants/calendar`), не через `@/shared/constants`
- `kyivMidnightToUtc`: первое приближение `Date.UTC(y, m - 1, d)` минус смещение Киева в этой точке, затем пересчёт смещения в полученной точке
- Каждая функция короче FUNCTION_MAX_LINES, JSDoc у всех экспортов
- `getTransactionsDateWindow` в сценарии «Окно ленты» вызывается из текущего `dateWindows.ts` только после фазы 02; в этой фазе сценарий в скрипте есть, ожидаемые значения вычислены вручную и записаны в evidence, проверка окна включается в фазе 02

## Scope

- `src/shared/constants/calendar.ts` — `KYIV_TIME_ZONE`
- `src/shared/constants/index.ts` — реэкспорт `KYIV_TIME_ZONE`
- `src/shared/utils/kyivCalendar/kyivCalendar.types.ts` — `DayKey`, `MonthKey`, `IsoRange`
- `src/shared/utils/kyivCalendar/kyivParts.ts` — `getKyivParts`, `kyivMidnightToUtc`, `KyivCalendarError`
- `src/shared/utils/kyivCalendar/dayKey.ts`
- `src/shared/utils/kyivCalendar/monthKey.ts`
- `src/shared/utils/kyivCalendar/kyivFormat.ts`
- `src/shared/utils/kyivCalendar/kyivSelfCheck.ts` — `verifyKyivCalendar`
- `src/shared/utils/kyivCalendar/index.ts`
- `scripts/check-kyiv-calendar.mjs` — резолвер `module.registerHooks`, прогон сценариев по трём TZ, таблица PASS/FAIL, `exit 1` при FAIL
- `package.json` — скрипт `calendar:check`

## Checklist

- [x] Перечитан «Изменения design» в `../fin-app-backend/docs/plans/kyiv-calendar-unification/history.md`; новые записи — план обновлён, пользователь уведомлён
- [x] Константа объявлена один раз, JSDoc
- [x] `getKyivParts`: `formatToParts`, если доступен и полон, иначе строгий разбор `format()`; ошибка формата → `KyivCalendarError`
- [x] Кэш экземпляров `Intl.DateTimeFormat`
- [x] Все функции таблицы design реализованы, branded-типы на выходе
- [x] Скрипт покрывает все сценарии design, кроме «Окна ленты» (включается в фазе 02)
- [x] Без `any`, без магических чисел (кроме 0, 1, -1)

## Verification Commands

- `rtk yarn calendar:check`
- `rtk yarn lint`
- `rtk yarn tsc --noEmit`

## Acceptance Criteria

- `calendar:check` — все сценарии PASS при `UTC`, `America/New_York`, `Europe/Kyiv`, exit 0
- Lint и tsc — exit 0
- `rg -n "Europe/Kyiv" src` — только `src/shared/constants/calendar.ts`

## Evidence Note

- Backend «Изменения design» перечитан 12.10.2026 — новых записей нет
- `KYIV_TIME_ZONE` в `src/shared/constants/calendar.ts`, реэкспорт из `index.ts`; `rg "Europe/Kyiv" src` — только этот файл
- `src/shared/utils/kyivCalendar/`: `kyivCalendar.types.ts`, `kyivParts.ts`, `dayKey.ts`, `monthKey.ts`, `kyivFormat.ts`, `kyivSelfCheck.ts`, `index.ts`
- Отклонения от design (внесены в `design.md`): служебная локаль `en-GB` вместо `en-US` — 24-часовой вывод без опоры на `hourCycle`; добавлены `makeDayKey`, `splitDayKey`, `makeMonthKey`, `getMonthKeyOfDay`, `getKyivMonthStart`, экспорт `KyivCalendarError`; скрипт гоняет сценарии и в режиме фолбэка `format()` (без `formatToParts`)
- `rtk proxy yarn.cmd calendar:check` (`rtk yarn` даёт program not found) — exit 0: 9 сценариев PASS × 3 TZ × 2 режима
- Ожидания «Окна ленты» посчитаны утилитой и сверены вручную: окно 0 `dateFrom 2026-09-21T21:00:00.000Z`; окно 1 `2026-09-11T21:00:00.000Z` .. `2026-09-21T20:59:59.999Z`
- `lint` exit 0 (0 errors, 3 warnings вне scope); `tsc --noEmit` exit 0
- Реализация выполнена основным агентом, а не `finapp-mobile-expert`: DEEP-фаза, контекст design уже загружен; независимое ревью — фаза 05

## Handoff Note

- Публичный API — `@/shared/utils/kyivCalendar`; константы внутри утилиты импортируются по точному пути файла (нужно для Node-скрипта)
- Ключи `DayKey` / `MonthKey` — branded; литералы приводить через `makeDayKey` / `makeMonthKey` или `monthKeyFromStoredMonth`
- Форматирование для UI — `formatKyivMoment`, `formatKyivTime`, `formatDayKey`, `formatMonthKey`
- `dateWindows.ts` в фазе 02 импортирует пагинацию из `@/shared/constants/pagination`, затем в скрипт добавляется сценарий «Окно ленты»
- `verifyKyivCalendar()` пока не подключён — фаза 02, `src/app/_layout.tsx` под `__DEV__`

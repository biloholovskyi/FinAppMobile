# Phase 05 — Post-code, ревью и харденинг

- Status: done
- Model tier: DEEP — независимое ревью контракта календаря и границ FSD
- Required rules: `ai/rules/common/post-code-workflow.md`, `ai/rules/common/skills/refactor-security-audit.md`, `ai/rules/common/agent-workflow.md`

## Goal

Реализация проверена независимым ревьюером, находки закрыты, гейты и критерии готовности из [design.md](design.md) выполнены.

## Implementation Notes

- Ревью — агент `code-reviewer` (отдельный запуск, без правок); отчёт сохраняет основной агент в `review-kyiv-calendar.md`
- Фокус ревью: DST и границы месяцев, отсутствие локальных геттеров вне утилиты, `MonthKey` вместо `Date`, кэш `Intl`, фолбэк разбора `format()`, импорт-граница FSD
- После исправлений гейты повторяются

## Scope

- `plans/2026-10-12-kyiv-calendar/review-kyiv-calendar.md`
- Файлы фаз 01–04 — только исправления находок

## Checklist

- [x] Перечитан «Изменения design» в backend `history.md`; новые записи — план обновлён, пользователь уведомлён
- [x] `post-code`: lint, tsc
- [x] Ревью `code-reviewer`, отчёт сохранён
- [x] Находки critical и warning исправлены или явно отклонены с причиной в evidence
- [x] Финальный поиск из задачи и `calendar:check`
- [x] `agents:check --strict`

## Verification Commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`
- `rtk yarn calendar:check`
- `rtk yarn agents:check --strict`
- `rg -n "getFullYear\(|getMonth\(|getDate\(|getDay\(|getHours\(|setDate\(|setMonth\(|setHours\(|getUTC|Date\.UTC|toISOString\(\)\.slice|toLocaleDateString|toLocaleTimeString|new Date\(\w+, " src --glob "!**/generated/**"`
- `rg -n "Europe/Kyiv" src`

## Acceptance Criteria

- Все гейты — exit 0
- Поиск из задачи — совпадения только в `src/shared/utils/kyivCalendar/`
- `Europe/Kyiv` — только `src/shared/constants/calendar.ts`
- `review-kyiv-calendar.md` сохранён, открытых critical нет

## Evidence Note

- Backend «Изменения design» перечитан 12.10.2026 — новых записей нет
- Ревью `code-reviewer` (отдельный запуск): 0 critical, 5 warnings, 6 improvements; отчёт — [review-kyiv-calendar.md](review-kyiv-calendar.md), раздел Resolution
- Исправлены W1–W5, I1–I3; отклонены I4–I6 с причиной
- Новое: `KYIV_TIME_ZONE_LEGACY`, `kyivTimeZone.ts` (`getKyivTimeZone`), кэш ISO → `DayKey`, проверка невалидной даты и правдоподобия фолбэка, 4 новых сценария `calendar:check`
- `lint` exit 0 (0 errors, 3 warnings вне scope); `tsc --noEmit` exit 0; `calendar:check` exit 0 (14 × 3 TZ × 2 режима); `agents:check --strict` exit 0 (135 файлов)
- Поиск из задачи — только `src/shared/utils/kyivCalendar/` (`dayKey.ts`, `monthKey.ts`, `kyivParts.ts`); `Europe/Kyiv` — только `src/shared/constants/calendar.ts`
- Не проверено: путь `Europe/Kiev` на реальном устройстве со старой tzdata; после правок фазы 05 на устройствах не перепроверялось

## Handoff Note

- Имя зоны для `Intl` и пикера — только `getKyivTimeZone()`
- Невалидный момент бросает `KyivCalendarError`
- Фаза 06 описывает правило календаря в `architecture.md` (`## Dates`), включая `calendar:check`

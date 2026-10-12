# History

## 12.10.2026 — Phase 01: утилита календаря и скрипт сценариев
- `KYIV_TIME_ZONE` и `src/shared/utils/kyivCalendar/` по design; служебная локаль разбора `en-GB`
- `scripts/check-kyiv-calendar.mjs` (`calendar:check`): 9 сценариев × TZ `UTC`, `America/New_York`, `Europe/Kyiv` × режимы `formatToParts` и фолбэк `format()`
- Ожидания «Окна ленты» для фазы 02 записаны в design
- Гейты: calendar:check exit 0, lint exit 0, tsc exit 0

## 12.10.2026 — Phase 02: лента операций, окна, редактирование
- Окна ленты от киевской полуночи; группировка, «Сегодня» / «Вчера», время и пикер — по Киеву
- `verifyKyivCalendar()` в dev при старте приложения
- Устройства iOS и Android (TZ `America/New_York`) — подтверждено пользователем
- Гейты: calendar:check exit 0, lint exit 0, tsc exit 0

## 12.10.2026 — Phase 03: расходы по категориям и шторка
- Навигация, фильтр месяца, ключ бюджета, группировка и подписи шторки — по киевскому `MonthKey` / `DayKey`
- `parseMonthStr.ts` удалён, параметр маршрута — `normalizeMonthParam`
- Устройство (TZ `America/New_York`) — подтверждено пользователем
- Гейты: calendar:check exit 0, lint exit 0, tsc exit 0

## 12.10.2026 — Phase 04: дашборд
- Текущий и прошлый месяц, день транзакции и «сегодня» — по киевскому `DayKey` / `MonthKey`
- `setMonth` в `useMonthNavigation` переименован в `setSelectedMonth` (ложное совпадение поиска)
- Поиск из задачи по `src` — только `src/shared/utils/kyivCalendar/`
- Устройства (TZ `America/New_York`) — подтверждено пользователем
- Гейты: calendar:check exit 0, lint exit 0, tsc exit 0

## 12.10.2026 — Phase 05: ревью и харденинг
- Ревью `code-reviewer`: 0 critical, 5 warnings, 6 improvements — [review-kyiv-calendar.md](review-kyiv-calendar.md)
- Исправлены W1–W5, I1–I3: запасное имя зоны `Europe/Kiev`, `KyivCalendarError` на невалидную дату, кэш `DayKey`, `useMemo` дашборда, подписи «Сегодня» / «Вчера» от текущего дня, проверка правдоподобия фолбэка, 4 новых сценария
- Гейты: lint exit 0, tsc exit 0, calendar:check exit 0, agents:check --strict exit 0

## 12.10.2026 — Phase 06: docs sync
- Правило календаря — `## Dates` в `ai/rules/projects/fin-app-mobile/architecture.md`
- `AGENTS.md`, `tooling.md`, `post-code-workflow.md` ссылаются на канон и знают `calendar:check`
- Гейт: agents:check --strict exit 0

## 12.10.2026 — Phase 07: версия и CHANGELOG
- `package.json`, `app.json` — `1.12.0`; `runtimeVersion` без изменений
- `CHANGELOG.md` — `[1.12.0] 12.10.2026`, `- Kyiv calendar unification`; весь CHANGELOG переведён на английский по просьбе пользователя
- Гейты: lint exit 0, tsc exit 0

## 12.10.2026 — Phase 08: Reflect
- `reflect.md`: сверка с design, 14 сценариев PASS при `UTC` / `America/New_York` / `Europe/Kyiv`, список файлов для фазы 09 backend
- Техдолг: путь `Europe/Kiev` и правки фазы 05 не проверены на устройстве, смешанные локали, `getKyivDayRange` без потребителей

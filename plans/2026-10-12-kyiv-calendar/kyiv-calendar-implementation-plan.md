# Единый календарь Europe/Kyiv — Implementation Plan

Дата: 12.10.2026

## Goal

- Дни, месяцы и границы периодов в мобилке считаются по календарю `Europe/Kyiv` через одну утилиту; TZ устройства на результат не влияет
- Результаты совпадают с backend и frontend по модели `../fin-app-backend/docs/plans/kyiv-calendar-unification/design.md`; REST-контракт и Orval-клиенты не меняются

## Task Profile

`hybrid` — 2 bugfix-сигнала и 2 feature-сигнала.

Bugfix-сигналы:
1. Детерминированное воспроизведение: TZ устройства вне Киева или `00:00–03:00` по Киеву 1-го числа / каждый день — месяц и день расходятся с backend; лента группирует по UTC-дню
2. Корректирующее изменение без расширения контракта

Feature-сигналы:
1. Изменения в нескольких слоях — `shared`, `features/operations`, `features/categorySpending`, `features/dashboard`, `app`
2. Архитектурное решение — общая утилита календаря, ключи `DayKey` / `MonthKey` вместо `Date`

## Decisions Taken

- Целевая версия `1.12.0` (ветка `r-1.12.0`)
- Сценарии проверяются node-скриптом `scripts/check-kyiv-calendar.mjs` (`rtk yarn calendar:check`) без новых зависимостей, при TZ `UTC`, `America/New_York`, `Europe/Kyiv`
- Реализация на `Intl.DateTimeFormat`, без runtime-зависимостей; `KYIV_TIME_ZONE` объявлен в `src/shared/constants/calendar.ts`

## Assumptions

- Hermes V1 (RN 0.86.3) поддерживает `timeZone` в `Intl.DateTimeFormat` — подтверждено на iOS и Android в фазе 02
- `DateTimePicker` (`@react-native-community/datetimepicker` 9.1.0) с `timeZoneName` работает на iOS и Android — подтверждено в фазе 02
- Только JS — доставка OTA, `runtimeVersion` не меняется
- Локали UI (`ru-RU` / `uk-UA`) остаются как есть

## Sync with Backend

- Перед каждой фазой — перечитать раздел «Изменения design» в `../fin-app-backend/docs/plans/kyiv-calendar-unification/history.md`
- Новая запись — сначала обновить `design.md` и затронутые фазы этого плана, сообщить пользователю, затем продолжать
- Последняя сверка: 12.10.2026, перед фазой 05 — изменений нет; перед фазой 08 — изменений нет

## Artifacts

- [research.md](research.md)
- [design.md](design.md)
- [history.md](history.md)

## Phases

- Phase 01 (done) — Утилита календаря и скрипт сценариев [phase-01-calendar-utility.md](phase-01-calendar-utility.md)
- Phase 02 (done) — Лента операций, окна, редактирование и проверка Hermes [phase-02-operations-feed.md](phase-02-operations-feed.md)
- Phase 03 (done) — Расходы по категориям и шторка транзакций [phase-03-category-spending.md](phase-03-category-spending.md)
- Phase 04 (done) — Дашборд [phase-04-dashboard.md](phase-04-dashboard.md)
- Phase 05 (done) — Post-code, ревью и харденинг [phase-05-audit-hardening.md](phase-05-audit-hardening.md)
- Phase 06 (done) — Docs sync [phase-06-docs-sync.md](phase-06-docs-sync.md)
- Phase 07 (done) — Версия и CHANGELOG 1.12.0 [phase-07-changelog.md](phase-07-changelog.md)
- Phase 08 (done) — Reflect и передача в кросс-проектную проверку [phase-08-reflect.md](phase-08-reflect.md)

## Model Schedule

| Фазы | Тир | Обоснование |
|------|-----|-------------|
| 01 | DEEP | Контракт календаря, DST, разбор `Intl` |
| 02–04 | BALANCED | Перевод потребителей на утилиту |
| 05 | DEEP | Независимое ревью и харденинг |
| 06–08 | FAST | Документация, CHANGELOG, ретроспектива |

## Next Actions

1. Прогон на устройствах (лента, статистика, шторка, дашборд) после правок фазы 05
2. Пользователь коммитит изменения; перед мержем в `main` — skill `deploy-preflight`
3. Сообщить backend: mobile готов к фазе 09, материал — [reflect.md](reflect.md)
4. Решить по записи CHANGELOG шторки транзакций (план `2026-10-10-spending-transactions-sheet`)

## Out of Scope

- Изменения REST-контракта, Orval-клиентов, `api:generate`
- Унификация локалей `ru-RU` / `uk-UA`
- UI для `nextPaymentDate`, `targetDate`, `budget.month`, `monthly_report.month` — в мобилке их нет; утилита даёт функции для будущих потребителей
- Техдолг прошлого плана: hex-литералы, inline `style`, `expo-router` в `features/operations`
- Отложенная запись CHANGELOG плана `2026-10-10-spending-transactions-sheet`
- Тест-раннер — проверка node-скриптом
- Любые git-операции

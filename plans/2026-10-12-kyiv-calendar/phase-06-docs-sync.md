# Phase 06 — Docs sync

- Status: done
- Model tier: FAST — синхронизация правил и команд
- Required rules: `ai/rules/common/implementation-plans.md` (Documentation SoT), `ai/rules/common/tooling.md`, `ai/rules/common/token-economy.md`

## Goal

Правила проекта описывают календарь Europe/Kyiv в одном месте, а `calendar:check` указан среди команд.

## Implementation Notes

- Каноническое место правила — раздел `## Dates` в `ai/rules/projects/fin-app-mobile/architecture.md`: календарь только через `src/shared/utils/kyivCalendar/`, константа `KYIV_TIME_ZONE`, ключи `DayKey` / `MonthKey`, форматирование с `timeZone`, запрет локальных геттеров вне утилиты, ссылка на backend design
- `AGENTS.md` ссылается на правило, тело не дублирует
- Без примеров кода в правилах

## Scope

- `ai/rules/projects/fin-app-mobile/architecture.md` — раздел `## Dates`
- `AGENTS.md` — пункт про даты в Critical Constraints, `rtk yarn calendar:check` в Commands
- `ai/rules/common/post-code-workflow.md` — `calendar:check`, когда изменения касаются `kyivCalendar/` или его потребителей
- `ai/rules/common/tooling.md` — скрипт `calendar:check`, если там перечислены package scripts

## Checklist

- [x] Перечитан «Изменения design» в backend `history.md`; новые записи — план обновлён, пользователь уведомлён
- [x] Одно авторитетное место правила, остальные — ссылки
- [x] Упоминания `toLocaleDateString('uk-UA')` без `timeZone` в правилах заменены
- [x] Проверка целостности ссылок

## Verification Commands

- `rtk yarn agents:check --strict`
- `rg -n "toLocaleDateString|calendar:check|kyivCalendar" AGENTS.md ai`

## Acceptance Criteria

- `agents:check --strict` — exit 0
- Правило календаря описано только в `architecture.md`; `AGENTS.md` и `post-code-workflow.md` ссылаются на него

## Evidence Note

- Backend «Изменения design» перечитан 12.10.2026 — новых записей нет
- Канон — `## Dates` в `ai/rules/projects/fin-app-mobile/architecture.md`: утилита, константы зоны и `getKyivTimeZone`, ключи `DayKey` / `MonthKey`, моменты, диапазон месяца, ключ бюджета, хранимые месяцы и дни, форматирование, запрещённые API, `calendar:check`; пример кода с `toLocaleDateString('uk-UA')` удалён
- `AGENTS.md`: пункт про даты в Critical Constraints заменён ссылкой на канон; `calendar:check` в Commands
- `ai/rules/common/tooling.md` — `calendar:check` в Command Reference со ссылкой на канон; `ai/rules/common/post-code-workflow.md` — шаг `calendar:check` после tsc при изменениях календаря
- `rg toLocaleDateString` по `AGENTS.md` и `ai` (кроме данных `ui-ux-pro-max`) — пусто
- `agents:check --strict` exit 0 (135 файлов)
- `architecture.md` — 292 строки; превышение цели 250 было и раньше (287), вне scope

## Handoff Note

- Правило календаря — только `architecture.md`, `## Dates`; остальные файлы ссылаются на него
- Фаза 07: версия `1.12.0` и запись CHANGELOG

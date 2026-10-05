# Phase 05 — Post-code, ревью и харденинг

- Status: done
- Model tier: DEEP
- Required rules: `ai/rules/common/post-code-workflow.md`, `ai/rules/common/skills/refactor-security-audit.md`, `ai/rules/common/agent-workflow.md`

## Goal

Изменения фаз 01–04 прошли гейты и независимое ревью, находки исправлены.

## Implementation Notes

- Ревью выполняет роль `code-reviewer` отдельным запуском; отчёт сохраняет основной агент
- Фокус ревью: копеечная математика и знак, обработка `null` и нечисловых полей, исключение переводов, сходимость сумм, границы FSD, лишние запросы курса
- После исправлений гейты перезапускаются

## Scope

- Все файлы, изменённые в фазах 01–04
- `plans/2026-10-05-transaction-uah-equivalent/review-uah-equivalent.md` — отчёт ревью

## Checklist

- [x] `post-code` выполнен
- [x] Ревью `code-reviewer` выполнено, отчёт сохранён
- [x] Находки уровня bug исправлены или явно отложены пользователем
- [x] Гейты повторно пройдены

## Verification Commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`
- `rtk yarn agents:check --strict`

## Acceptance Criteria

- Все три команды проходят
- Файл отчёта ревью существует

## Evidence Note

Выполнено 05.10.2026.

- `post-code`: lint и tsc пройдены до и после исправлений
- Ревью `code-reviewer` (DEEP) — отдельный запуск; отчёт `plans/2026-10-05-transaction-uah-equivalent/review-uah-equivalent.md`; критичных находок нет, 7 warnings и 4 improvements исправлены
- Гейты после исправлений: `rtk proxy yarn.cmd lint` — exit 0, 0 ошибок, 3 старых предупреждения вне scope; `rtk proxy yarn.cmd tsc --noEmit` — exit 0; `rtk proxy yarn.cmd agents:check --strict` — exit 0, 135 файлов

## Handoff Note

- Отчёт ревью: `review-uah-equivalent.md`, критичных находок нет
- Типы транзакции живут в `src/entities/transaction/model/types.ts`, баррель реэкспортирует
- Курс редактора — `pickBackendRate` (как `resolveRate` бэкенда)
- Открыто: проверка `font-[monospace]` на iOS

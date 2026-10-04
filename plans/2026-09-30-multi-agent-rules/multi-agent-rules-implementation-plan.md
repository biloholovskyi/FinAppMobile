# Правила для Claude Code и Codex — Implementation Plan

Дата: 30.09.2026. Ревизия 3 — учтены ревью `plans/2026-09-30-multi-agent-rules/review-codex.md` и `plans/2026-09-30-multi-agent-rules/review-codex-2.md`; ответы — `plans/2026-09-30-multi-agent-rules/answer-codex-1.md`, `plans/2026-09-30-multi-agent-rules/answer-codex-2.md`.

## Goal

- Проект одинаково работает в Claude Code и Codex: одинаковые этапы, ограничения, места артефактов, условия остановки и критерии качества
- Общие правила, порядок работы, процедуры скиллов и роли агентов живут в `ai/`; инструмент-специфика — тонкие адаптеры в `CLAUDE.md` + `.claude/` и `.codex/` + `.agents/skills/`

## Task Profile

`feature` — 3 feature-сигнала против 0 bugfix-сигналов.

Feature-сигналы:

1. Новый контракт раскладки и выполнения: `AGENTS.md`, `ai/skills/`, `ai/agents/`, `agent-workflow.md`, `git-policy.md`, `.codex/`, `.agents/`
2. Кросс-слойные изменения: точки входа, правила, скиллы, агенты, конфиги и ограничения двух клиентов
3. Архитектурный трейд-офф: адаптеры против генератора и симлинков, асимметрия импорта правил, технические запреты против политики

## Decisions Taken

- CHANGELOG и версия не обновляются — правка тулинга
- Скиллы шарятся тонкими адаптерами: канон `ai/skills/<name>/procedure.md`, адаптеры в `.claude/skills/` и `.agents/skills/`
- Все 10 агентов портируются в Codex: канон `ai/agents/<name>.md`, адаптеры в `.claude/agents/` и `.codex/agents/`

## Assumptions

- `AGENTS.md` — общая точка входа; `CLAUDE.md` начинается с `@AGENTS.md` (установлен Claude Code 2.1.251, нативного чтения `AGENTS.md` нет)
- Симлинки не используются: Windows + git без `core.symlinks`
- `core-rules.md` поглощается `AGENTS.md`; `ai/rules/AGENTS.md` и `.claude/AGENTS.md` переименовываются в `INDEX.md`
- Порядок работы, приоритет над плагинными процессами и маршрутизация ролей — общий контракт в `ai/`, не Claude-only
- Политика вызова скиллов одинакова в обоих клиентах: ручными становятся только внешние действия `eas-build`, `eas-submit` — в Claude добавляется `disable-model-invocation: true`
- Контракт QA: после изменений кода tsc запускается всегда после lint — устранение противоречия внутри `post-code-workflow.md`, а не только перенос формулировок
- `code-reviewer` становится фактически read-only: без записи файлов, findings сохраняет основной агент в `plans/**`; остальные роли сохраняют исходные полномочия
- Технические git-запреты — страховка; в Claude закрываются найденные пробелы (`switch`, PowerShell-формы, широкий `rtk git branch:*`)
- Память агентов остаётся локальной оптимизацией Claude; обязательное состояние — только в `ai/**` и `plans/**`
- Родительский `C:\Projects\FinApp` не редактируется, но его влияние фиксируется в Phase 01 и учитывается в приёмке
- Codex-клиент — только расширение Codex для VS Code (встроенный CLI `0.155.0-alpha.16.3`); desktop-приложение не используется. Автоматические runtime-пробы — через `codex exec` этого CLI, интерактивные — вручную по `codex-close-phase.md`
- Runtime-проверки Codex требуют доступного клиента и trusted-проекта; при их отсутствии сценарий помечается непроверенным, а не пройденным
- `src/`, `app.json`, `eas.json` не меняются: нативная сборка не нужна

## Artifacts

- [research.md](plans/2026-09-30-multi-agent-rules/research.md)
- [design.md](plans/2026-09-30-multi-agent-rules/design.md)
- [review-codex.md](plans/2026-09-30-multi-agent-rules/review-codex.md), [answer-codex-1.md](plans/2026-09-30-multi-agent-rules/answer-codex-1.md)
- [review-codex-2.md](plans/2026-09-30-multi-agent-rules/review-codex-2.md), [answer-codex-2.md](plans/2026-09-30-multi-agent-rules/answer-codex-2.md)
- [history.md](plans/2026-09-30-multi-agent-rules/history.md) — создаётся с первой завершённой фазой
- `acceptance.md` — журнал сценариев, создаётся в Phase 09
- [codex-close-phase.md](plans/2026-09-30-multi-agent-rules/codex-close-phase.md) — ручные шаги в расширении Codex для VS Code и интерактивном Claude Code
- [runtime-report.md](plans/2026-09-30-multi-agent-rules/runtime-report.md) — фактическая автоматизированная приёмка 04.10.2026, включая неуспешные запуски и повторы
- [manual-remaining.md](plans/2026-09-30-multi-agent-rules/manual-remaining.md) — оставшиеся интерактивные действия с актуальным CLI-путём

## Phases

- Phase 01 (done) — Preflight окружения [phase-01-preflight.md](plans/2026-09-30-multi-agent-rules/phase-01-preflight.md)
- Phase 02 (done) — Общий контракт и нейтрализация `ai/rules` [phase-02-workflow-contract.md](plans/2026-09-30-multi-agent-rules/phase-02-workflow-contract.md)
- Phase 03 (done) — Скрипт проверки согласованности [phase-03-drift-check.md](plans/2026-09-30-multi-agent-rules/phase-03-drift-check.md)
- Phase 04 (done) — Скиллы: канон и адаптеры [phase-04-skills.md](plans/2026-09-30-multi-agent-rules/phase-04-skills.md)
- Phase 05 (done) — Агенты: канон и адаптеры [phase-05-agents.md](plans/2026-09-30-multi-agent-rules/phase-05-agents.md)
- Phase 06 (done) — Codex-конфигурация, git-политика и хуки [phase-06-codex-config.md](plans/2026-09-30-multi-agent-rules/phase-06-codex-config.md)
- Phase 07 (done) — Точки входа и Claude-слой [phase-07-entry-points.md](plans/2026-09-30-multi-agent-rules/phase-07-entry-points.md)
- Phase 08 (done) — Синхронизация документации и строгий режим [phase-08-docs-sync.md](plans/2026-09-30-multi-agent-rules/phase-08-docs-sync.md)
- Phase 09 (done) — Поведенческая приёмка в обоих клиентах [phase-09-behavior-acceptance.md](plans/2026-09-30-multi-agent-rules/phase-09-behavior-acceptance.md)
- Phase 10 (done) — Аудит и харденинг [phase-10-audit-hardening.md](plans/2026-09-30-multi-agent-rules/phase-10-audit-hardening.md)
- Phase 11 (done) — Reflect [phase-11-reflect.md](plans/2026-09-30-multi-agent-rules/phase-11-reflect.md)

Каждая фаза перечисляет prerequisites; её проверки проходят на дереве сразу после неё, без ожидания будущих фаз.

## Model Schedule

| Фазы  | Тир      | Обоснование                                      |
| ----- | -------- | ------------------------------------------------ |
| 01    | FAST     | Сбор фактов окружения                            |
| 02    | DEEP     | Общий контракт выполнения и граница нейтрального |
| 03–08 | BALANCED | Перенос тел, адаптеры, конфиги по документации   |
| 09    | BALANCED | Сценарии по сценарию, фиксация доказательств     |
| 10    | DEEP     | Аудит полноты, паритета и безопасности           |
| 11    | FAST     | Ретроспектива                                    |

Маппинг тиров на модели — в `CLAUDE.md` и `.codex/README.md`. Тир в плане не переключает модель автоматически. Эскалация — после двух неуспешных попыток и с письменной сводкой состояния.

## Next Actions

1. Завершить Phase 11: сверить Reflect и итоговую структуру, удалить исходный `fixture-np/`, выполнить `rtk yarn agents:check --strict` (Windows fallback — `rtk proxy yarn.cmd agents:check --strict`)
2. После успешной проверки отметить последний пункт Reflect, перевести Phase 11 и её строку индекса в `done`, добавить финальную запись в `history.md` и отметить завершение плана; Phase 07/09 уже закрыты по подтверждению пользователя

## Out of Scope

- Редактирование корня монорепо `C:\Projects\FinApp` и соседних проектов — кандидат в отдельную задачу (устаревший `../AGENTS.md`)
- Генератор адаптеров и симлинки
- Другие клиенты (Cursor, Copilot, Gemini)
- Перенос памяти агентов в Codex
- Изменение содержания правил сверх нейтрализации и выноса общего контракта
- Добавление `agents:check` в CI (`.github/workflows/deploy-expo.yml`)
- Тест-фреймворк и постоянные тестовые фикстуры
- `src/`, `app.json`, `eas.json`, `package-lock.json`, версия, CHANGELOG
- Мутирующие git-операции — выполняет пользователь

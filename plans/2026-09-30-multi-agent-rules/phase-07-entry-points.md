# Phase 07 — Точки входа и Claude-слой

- Status: done
- Model tier: BALANCED
- Required rules: `ai/rules/common/token-economy.md`, `ai/rules/common/agent-workflow.md`, `ai/rules/common/commit-message-and-crosslinks.md`
- Prerequisites: Phase 02, Phase 04, Phase 05, Phase 06 (`.codex/README.md` существует)

## Goal

`AGENTS.md` — общая точка входа; `CLAUDE.md` — импорт `AGENTS.md` плюс Claude-специфика; Claude-слой содержит только адаптеры и исключения из `design.md`.

## Implementation Notes

- `AGENTS.md` пишется с нуля по разделу «Точки входа» `design.md`; маршрутизация переносится из `core-rules.md`, файл удаляется
- `CLAUDE.md` переписывается: `@AGENTS.md`, импорты «Read first», снятие сдержанности на сабагенты, маппинг тиров, ссылка на `.claude/INDEX.md`; правило superpowers формулируется как ссылка на `agent-workflow.md` плюс Claude-имена навыков
- `.claude/AGENTS.md` → `.claude/INDEX.md`: `/skills`, агенты, стабы, память, settings; каталог правил — ссылкой на `ai/rules/INDEX.md`
- Стабы `.claude/rules/*.md` сверяются с путями; стаб `response-rules.md` без `paths` удаляется — правило импортируется из `CLAUDE.md`
- `.claude/agent-memory/README.md` — ссылки на `ai/agents/`; память — не источник обязательных договорённостей

## Scope

- `AGENTS.md` — создаётся; `CLAUDE.md` — переписывается (до 80 строк); `ai/rules/common/core-rules.md` — удаляется
- `.claude/INDEX.md` (бывший `.claude/AGENTS.md`), `.claude/rules/*.md`, `.claude/agent-memory/README.md`
- Ссылки на `core-rules.md` и `.claude/AGENTS.md` в `ai/**`, `.claude/**`, `.codex/**`, `.agents/**`

## Checklist

- [x] `AGENTS.md` до 150 строк и 12 KiB; нет синтаксиса вызова клиентов, имён моделей, `@`-импортов; навигационные ссылки на `.claude/INDEX.md` и `.codex/README.md` допустимы
- [x] `CLAUDE.md` начинается с `@AGENTS.md`; каждое правило бывшего `CLAUDE.md` находится ровно в одном месте
- [x] В `.claude/**` вне исключений (`agent-memory/`, `reviews/`, `settings.json`) нет тел правил, процедур и ролей

## Verification Commands

- `rtk yarn agents:check`
- `rtk grep -rnE "core-rules|\.claude/AGENTS.md" . --exclude-dir=node_modules --exclude-dir=plans` — пусто
- Claude Code, новая сессия: `/context` показывает `CLAUDE.md`, `AGENTS.md` и импорты по одному разу
- Codex, новая сессия из корня и из `src/`: загружен `AGENTS.md` проекта

## Acceptance Criteria

- Проверки проходят на дереве после фазы

## Evidence Note

Историческая запись 30.09.2026: выполнено, кроме Codex-runtime; на эту дату статус был `in_progress`, поскольку Codex был недоступен до конца лимита использования. Закрытие фазы — в разделе «Закрытие — 04.10.2026» ниже.

Изменено:
- `AGENTS.md` — создан: Read First, Stack, Critical Constraints, Commands, Task → Rule (из `core-rules.md`), Agent Tooling, Environment; 87 строк, 5 289 байт; без имён моделей, синтаксиса вызова клиентов, `@`-импортов
- `CLAUDE.md` — переписан: `@AGENTS.md` первой строкой, 6 импортов «Read first», приоритет в Claude Code, снятие сдержанности на сабагенты, имена навыков superpowers, маппинг тиров, `/skills`, enforcement; 55 строк
- `ai/rules/common/core-rules.md` — удалён; ссылки → `AGENTS.md` в `ai-models.md`, `commit-message-and-crosslinks.md`, `implementation-plans.md`, `token-economy.md`, `tooling.md`, `ai/rules/INDEX.md`, процедурах `implement-plan-step`, `start-task`
- `.claude/AGENTS.md` → `.claude/INDEX.md` — индекс Claude-слоя: скиллы, агенты, стабы с правилами, память, конфигурация; каталог правил — ссылкой
- `.claude/rules/response-rules.md` — удалён (стаб без `paths`; правило импортируется из `CLAUDE.md`)
- `.claude/agent-memory/README.md` — статус памяти, ссылки на `ai/agents/`, `.claude/INDEX.md`
- `docs/superpowers/specs/2026-04-09-ai-system-migration-design.md` — маркер «Historical»; содержание не переписывалось

Размещение правил бывшего `CLAUDE.md` (каждое — в одном месте):
- Instruction Precedence → `agent-workflow.md` Precedence + Claude-часть в `CLAUDE.md` «Precedence in Claude Code»
- Planning & Superpowers → `agent-workflow.md` Planning + имена навыков в `CLAUDE.md` «Plugins»
- Source of Truth, `.claude/` layout → `.claude/INDEX.md`
- Dependency Constraints → `architecture.md` (полная таблица) + кратко `AGENTS.md` Stack
- Load Rules By Task → `AGENTS.md` Task → Rule
- Quick Reference, FSD, money, locale → `AGENTS.md` Critical Constraints / Commands
- Skills, Agents → `AGENTS.md` Agent Tooling + `.claude/INDEX.md`
- Git → `git-policy.md` + `CLAUDE.md` Enforcement
- Environment → `AGENTS.md` Environment

Проверки:
- `yarn agents:check` → `passed: 135 files scanned`, код 0
- `grep "core-rules|\.claude/AGENTS.md"` вне `plans/`, `.git/` — только исторический spec в `docs/superpowers/specs/` (помечен); исключение записано
- Claude, новая сессия (`claude -p`): загружены по одному разу `C:\Projects\FinApp\.claude\rules\mobile.md`, `C:\Projects\FinApp\CLAUDE.md`, проектные `CLAUDE.md`, `AGENTS.md` и 6 импортов; `architecture.md` не загружен заранее. Прежде — 19 файлов и 104 689 байт
- Codex, новая сессия из корня и из `src/`: не проверено — лимит использования Codex до 20:10 30.09.2026; шаг в `codex-close-phase.md`
- Независимое ревью не выполнялось

Поправка Phase 10: `AGENTS.md` после Phase 09 — 89 строк, 5 780 байт (добавлены Windows fallback, остановка гейтов, правило review-отчётов); лимиты соблюдены

## Handoff Note

- Точка входа — `AGENTS.md`; `CLAUDE.md` — `@AGENTS.md` + 6 импортов + Claude-специфика; индексы: `ai/rules/INDEX.md`, `ai/agents/INDEX.md`, `.claude/INDEX.md`, `.codex/README.md`
- Claude теперь грузит 6 правил вместо 19; задачные правила — по таблице и стабам
- `core-rules.md`, `.claude/AGENTS.md`, `.claude/rules/response-rules.md` удалены
- CLI-проверки Codex из корня и `src/` и нативный `/context` Claude выполнены 04.10.2026; интерактивные проверки подтверждены пользователем, фаза закрыта
- Phase 08: `tooling.md` Agent Layout, `--strict` в `post-code`/`deploy-preflight`/`post-code-workflow.md`

## Runtime evidence — 04.10.2026

- Codex CLI `0.160.0`, свежие сессии с явным cwd корня и `src/`: все пять Read First путей и `rtk yarn agents:check --strict` возвращены без вызова инструментов. Evidence: `runtime-2026-10-04/agents-root.jsonl`, `agents-src.jsonl` и summary-файлы.
- Claude Code `2.1.288`, реальная встроенная команда `/context` через `claude -p`: `local_command: context`, ноль ходов модели; проектные `CLAUDE.md`, `AGENTS.md` и шесть импортов ровно по одному разу. `architecture.md` не загружен заранее. Evidence: `runtime-2026-10-04/claude-context.jsonl`.
- Контент runtime-точек входа подтверждён автоматизированными пробами; управление окнами VS Code исполнителем не выполнялось. Последующая ручная проверка пользователя записана ниже.

## Закрытие — 04.10.2026

- После инструкции только для Phase 07 пользователь сообщил: «Все выполнил закрой фазу 7».
- Это принято как подтверждение двух свежих чатов расширения Codex из корня и `src/` (пять Read First путей и команда строгой проверки без чтения файлов), а также `/context` в новой интерактивной сессии Claude Code (проектные `CLAUDE.md`, `AGENTS.md` и шесть импортов по одному разу).
- Тип доказательства — подтверждение пользователя; дословные ответы клиентов и скриншоты к сообщению не приложены. Автоматизированные журналы перечислены выше.
- Финальная проверка, Command Runner: `rtk proxy yarn.cmd agents:check --strict` → exit 0, `agents:check (strict) passed: 135 files scanned`.
- Повторный поиск `core-rules|\.claude/AGENTS\.md` в точках входа, каноне, адаптерах и `docs/` нашёл только ранее записанное исключение — исторический `docs/superpowers/specs/2026-04-09-ai-system-migration-design.md`; действующие инструкции старых ссылок не содержат.
- Phase 07 и строка индекса переведены в `done`; запись добавлена в `history.md`. Phase 09 и Phase 11 остаются `in_progress`; исходный fixture сохранён для приёмки Phase 09.

# Phase 02 — Общий контракт и нейтрализация `ai/rules`

- Status: done
- Model tier: DEEP
- Required rules: `ai/rules/common/implementation-plans.md`, `ai/rules/common/response-rules.md`, `ai/rules/common/token-economy.md`, `ai/rules/common/commit-message-and-crosslinks.md`
- Prerequisites: Phase 01 (маппинг тиров, список плагинов)

## Goal

`ai/rules/` содержит общий контракт выполнения и git-политику и читается одинаково любым агентом.

## Implementation Notes

- `agent-workflow.md` и `git-policy.md` пишутся с нуля по одноимённым разделам `design.md`
- Источник формулировок — разделы Instruction Precedence и Planning & Superpowers текущего `CLAUDE.md`: смысл сохраняется, приоритет уточняется рамкой «в пределах системных ограничений, прав и доступных инструментов»
- Нейтрализация остальных файлов — патч формулировок: алиасы моделей → тиры, `/skill` → имя скилла или команды гейтов
- Раздел раскладки клиентов в `tooling.md` в этой фазе не пишется (Phase 08) — целевых путей ещё нет; раздел «Claude Layout» сокращается до ссылки на `CLAUDE.md`
- `CLAUDE.md` в этой фазе не переписывается; ссылки в нём на переименованный индекс обновляются

## Scope

- `ai/rules/common/agent-workflow.md`, `ai/rules/common/git-policy.md` — создаются
- `ai/rules/common/post-code-workflow.md` — контракт QA из `design.md`: безусловный tsc после lint, место `agents:check`; это устранение противоречия в правилах, а не замена формулировок
- `ai/rules/common/ai-models.md` — только тиры и назначения тиров 10 агентам и 14 скиллам
- `ai/rules/common/{tooling,implementation-plans,core-rules,deployment,versioning-changelog,patterns,commit-message-and-crosslinks}.md` — без клиент-специфики
- `ai/rules/common/skills/{plan-audit,refactor-security-audit,agent-team-quality-gates}.md` — без клиент-специфики
- `ai/rules/AGENTS.md` → `ai/rules/INDEX.md`, ссылки обновлены во всём проекте, кроме `plans/`

## Checklist

- [x] `agent-workflow.md`: приоритет проектного процесса над плагинами, чтение правил при исполнении и возобновлении плана, восстановимость состояния из артефактов, делегирование с разделением исполнителя и проверяющего, поведение при отсутствии возможности
- [x] `agent-workflow.md`: контракт review-артефактов (findings возвращает проверяющий, пишет основной агент, пути в `plans/**`) и команды без записи для проверяющих
- [x] `post-code-workflow.md`: «Required Steps» и «One-Line Workflow» дают одну последовательность; условия «if suspected» нет
- [x] `git-policy.md`: разрешённое чтение, запрещённые мутации (включая `switch` и изменение веток), оговорка о пределах технических запретов
- [x] Каждое правило из Instruction Precedence и Planning & Superpowers отнесено либо в `agent-workflow.md`, либо в Claude-остаток для Phase 07 (список в evidence)
- [x] В `ai/rules` нет имён моделей, slash-команд, путей `.claude/` — кроме списка триггеров QA (см. Verification Commands)
- [x] Каждый файл до 250 строк

## Verification Commands

- `rtk grep -rniE "haiku|sonnet|opus|\.claude/|/post-code([^-]|$)|/start-task" ai/rules` — одно допустимое совпадение: список триггеров шага 2 в `post-code-workflow.md`, заданный `design.md`. Исходный шаблон `/post-code` совпадает с каждой ссылкой на `common/post-code-workflow.md` и не может быть пустым
- `rtk grep -rn "rules/AGENTS.md" . --exclude-dir=node_modules --exclude-dir=plans` — пусто
- `rtk grep -rniE "only if|if .*suspected" ai/rules/common/post-code-workflow.md` — пусто

## Acceptance Criteria

- Проверки проходят на дереве после фазы
- Смысл существующих правил не изменён, кроме двух записанных в evidence решений: безусловный tsc в `post-code-workflow.md` и новое место review-отчётов; новые файлы не противоречат `implementation-plans.md` и `response-rules.md`

## Evidence Note

Выполнено 30.09.2026. Prerequisite Phase 01 закрыт частично: маппинг тиров Claude и список плагинов есть в `research.md`; Codex-маппинг этой фазе не нужен — `ai-models.md` содержит только тиры.

Изменено:
- Созданы `ai/rules/common/agent-workflow.md` (80 строк) и `ai/rules/common/git-policy.md` (40 строк)
- `post-code-workflow.md`: шаги 1–3 из `design.md`; tsc безусловно после lint; `agents:check` при изменении конфигурации агентов
- `ai-models.md`: только тиры и назначения 10 ролей и 14 скиллов; алиасы, платформенный маппинг, `ultrathink`, ссылки на документацию Anthropic удалены
- `tooling.md`: раздел «Client Layout» — указатель на `CLAUDE.md` и `ai/rules/INDEX.md`
- `core-rules.md`: design-правила указывают на `ai/rules/design/*`; добавлены строки `agent-workflow`, `git-policy`, `INDEX.md`
- Нейтрализованы `commit-message-and-crosslinks.md`, `implementation-plans.md`, `deployment.md`, `skills/plan-audit.md`
- `ai/rules/AGENTS.md` → `ai/rules/INDEX.md` (+ записи `agent-workflow`, `git-policy`); ссылки обновлены, включая `docs/superpowers/specs/2026-04-09-ai-system-migration-design.md`
- Клиент-специфики не найдено, файлы не менялись: `patterns.md`, `versioning-changelog.md`, `skills/refactor-security-audit.md`, `skills/agent-team-quality-gates.md`

Решения, меняющие смысл правил:
- Безусловный tsc после lint в `post-code-workflow.md`
- Review-отчёты: findings возвращает проверяющий, сохраняет основной агент в `plans/**`

Распределение Instruction Precedence и Planning & Superpowers из `CLAUDE.md`:
- Приоритет над харнессом, описаниями инструментов и скиллов → `agent-workflow.md` Precedence, с рамкой системных ограничений
- «Не подчинять правила дефолтам; при сомнении — правила проекта» → `agent-workflow.md` Precedence
- Делегирование по таблице без отдельного вопроса → `agent-workflow.md` Delegation
- Снятие встроенной сдержанности Claude на сабагенты → Claude-остаток (Phase 07)
- Планы только по `implementation-plans.md` и `plans/` → `agent-workflow.md` Planning
- Запрет plan/spec-процессов плагинов, brainstorming до плана, без spec-файлов, плагины для прочей работы → `agent-workflow.md` Planning
- Имена `superpowers:writing-plans`, `superpowers:executing-plans`, `superpowers:brainstorming` → Claude-остаток (Phase 07)
- Маппинг тиров на алиасы Claude (`haiku`, `sonnet`, `opus`, `sonnet[1m]`, `opusplan`, `ultrathink`) → Claude-остаток (Phase 07); текущие значения — `research.md`, «Окружение (Phase 01)»

Проверки:
- Нейтральность `ai/rules`: одно допустимое совпадение (см. Verification Commands)
- `rules/AGENTS.md` вне `plans/` и `.git/`: пусто
- `only if|if .*suspected` в `post-code-workflow.md`: пусто
- Все `ai/...`-пути в `ai/rules` существуют, кроме `ai/agents/INDEX.md` (создаётся в Phase 05)
- Максимум строк: `patterns.md` 249, `implementation-plans.md` 209, `ai-models.md` 122
- Код не менялся — lint и tsc не требуются; `rtk yarn agents:check` ещё не существует (Phase 03)
- Независимое ревью не выполнялось

## Handoff Note

- Общий контракт — `ai/rules/common/agent-workflow.md`, git — `ai/rules/common/git-policy.md`
- `agent-workflow.md` ссылается на `ai/agents/INDEX.md` и `ai/agents/<name>.md` — появятся в Phase 05; переходный режим `agents:check` не должен считать их ошибкой до Phase 05
- `post-code-workflow.md` вызывает `rtk yarn agents:check` — скрипт и package-скрипт добавляет Phase 03
- Каталог правил — `ai/rules/INDEX.md`; `.claude/AGENTS.md` не переименован (Phase 07)
- Claude-остаток для Phase 07 перечислен в Evidence Note
- `CLAUDE.md` не менялся и по-прежнему @-импортирует `core-rules.md` и `ai-models.md`
- Родительский `C:\Projects\FinApp\.claude\rules\mobile.md` тоже грузится в сессию: он маршрутизирует на `finapp-mobile-expert` и `/post-code mobile` — учесть в приёмке Phase 09

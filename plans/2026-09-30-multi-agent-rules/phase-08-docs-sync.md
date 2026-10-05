# Phase 08 — Синхронизация документации и строгий режим

- Status: done
- Model tier: BALANCED
- Required rules: `ai/rules/common/implementation-plans.md`, `ai/rules/common/commit-message-and-crosslinks.md`
- Prerequisites: Phase 07

## Goal

Правила о правилах описывают новую раскладку, и строгая проверка проходит на полном дереве.

## Implementation Notes

- `tooling.md`: раздел «Agent Layout» — раскладка обоих клиентов и команда `rtk yarn agents:check --strict`
- `implementation-plans.md`: карта владения (`AGENTS.md`, `ai/skills`, `ai/agents`, два клиентских слоя), направление ссылок, Model schedule только тирами
- `commit-message-and-crosslinks.md`: где регистрируется новое правило — `AGENTS.md`, `ai/rules/INDEX.md`, `.claude/INDEX.md`
- `token-economy.md`: точка входа `AGENTS.md`
- С этой фазы `post-code`, `deploy-preflight` и `post-code-workflow.md` вызывают строгий режим
- Отрицательные пробы строгого режима — на копии полного дерева в scratch: baseline `--strict` с кодом 0, затем по одному дефекту с проверкой кода 1 и сообщения о нём, затем восстановление и снова 0; не коммитятся

## Scope

- `ai/rules/common/{tooling,implementation-plans,commit-message-and-crosslinks,token-economy}.md`
- `ai/rules/INDEX.md` — разделы `ai/skills/`, `ai/agents/`, новые правила
- `ai/skills/{post-code,deploy-preflight}/procedure.md`, `ai/rules/common/post-code-workflow.md` — флаг `--strict`

## Checklist

- [x] Нет ссылок на удалённые `core-rules.md`, `ai/rules/AGENTS.md`, `.claude/AGENTS.md`
- [x] Каждый файл до 250 строк

## Verification Commands

- `rtk yarn agents:check --strict`
- `rtk grep -rnE "core-rules|rules/AGENTS.md|\.claude/AGENTS.md" . --exclude-dir=node_modules --exclude-dir=plans` — пусто

## Acceptance Criteria

- Строгий режим проходит на реальном дереве без исключений переходного режима
- В evidence: baseline копии с кодом 0; для каждой пробы — дефект, код 1 и дословное сообщение; код 0 после восстановления
- Пробы: удалён весь комплект одного скилла (канон и оба адаптера), удалена одна роль целиком, удалён `.codex/README.md`, неверная политика вызова `eas-build`, `AGENTS.md` сверх лимита

## Evidence Note

Выполнено 30.09.2026.

Изменено:
- `ai/rules/common/tooling.md` — раздел «Agent Layout»: общий слой, Claude Code, Codex, команда `rtk yarn agents:check --strict`; требование запускать её после правок конфигурации агентов
- `ai/rules/common/implementation-plans.md` — карта владения (`AGENTS.md`, `ai/skills`, `ai/agents`, два клиентских слоя), направление ссылок (исключение — Agent Layout в `tooling.md`), Model schedule только тирами
- `ai/rules/common/commit-message-and-crosslinks.md` — регистрация нового правила: `AGENTS.md`, `ai/rules/INDEX.md`, `.claude/INDEX.md` (сделано в Phase 07)
- `ai/rules/common/token-economy.md` — Always Load: `AGENTS.md` с Read First и Task → Rule
- `ai/rules/INDEX.md` — разделы Skill Procedures и Agent Roles
- `--strict` во всех командах `agents:check`: `post-code-workflow.md`, `deployment.md`, процедуры `post-code`, `deploy-preflight`, `commit`, `implement-plan-step`, канон `command-runner`, `AGENTS.md`

Проверки:
- `yarn agents:check --strict` на реальном дереве → `agents:check (strict) passed: 135 files scanned`, код 0 — без исключений переходного режима
- `grep "core-rules|rules/AGENTS.md|\.claude/AGENTS.md"` вне `plans/`, `.git/` — только помеченный исторический spec `docs/superpowers/specs/2026-04-09-ai-system-migration-design.md`
- Максимум строк: `patterns.md` 249, `implementation-plans.md` 212
- Пробы на копии полного дерева в scratch; baseline `--strict` → `passed: 135 files scanned`, код 0:
  - удалён комплект скилла `typecheck` → код 1: `.agents/skills/typecheck/SKILL.md: adapter is missing`, `.claude/skills/typecheck/SKILL.md: adapter is missing`, `ai/skills/typecheck/procedure.md: canon is missing`
  - удалена роль `plan-auditor` → код 1: `.claude/agents/plan-auditor.md: adapter is missing`, `.codex/agents/plan-auditor.toml: adapter is missing`, `ai/agents/plan-auditor.md: canon is missing`
  - удалён `.codex/README.md` → код 1: `.codex/README.md: required entry point is missing` + `broken reference ".codex/README.md"` в `.codex/config.toml`, `.codex/hooks.json`, `.codex/rules/git.rules`, `AGENTS.md`, `tooling.md`
  - убран `disable-model-invocation` у `eas-build` → код 1: `.claude/skills/eas-build/SKILL.md: disable-model-invocation must be true`
  - `AGENTS.md` +70 строк → код 1: `AGENTS.md: 157 lines exceeds 150`
  - после каждого восстановления и в конце — код 0
- Нейтральность `ai/rules` из Phase 02 теперь даёт совпадения `.claude/` в Agent Layout `tooling.md` — разрешённое design исключение
- Независимое ревью не выполнялось

## Handoff Note

- Единственная команда проверки — `rtk yarn agents:check --strict`; переходный режим больше не используется
- Раскладка обоих клиентов описана в `tooling.md` «Agent Layout» — единственное место `ai/**`, где упоминаются клиентские каталоги
- Phase 09: сценарии Claude — через `claude -p`; Codex — лимит использования до 20:10, сценарии Codex вручную по `codex-close-phase.md`

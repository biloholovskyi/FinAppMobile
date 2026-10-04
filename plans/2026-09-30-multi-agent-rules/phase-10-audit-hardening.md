# Phase 10 — Аудит и харденинг

- Status: done
- Model tier: DEEP
- Required rules: `ai/rules/common/skills/plan-audit.md`, `ai/rules/common/skills/refactor-security-audit.md`, `ai/rules/common/post-code-workflow.md`
- Prerequisites: Phase 08, Phase 09

## Goal

Перенос полон, ничего не потеряно и не задвоено, ограничения эквивалентны, документация соответствует дереву.

## Implementation Notes

- Сравнить исходные тела (`rtk git show HEAD:<path>`, только чтение) с каноном: каждое правило, шаг процедуры и граница роли — ровно в одном файле `ai/**`
- Смешение слоёв проверяется по содержанию: в `ai/**` и `AGENTS.md` нет синтаксиса вызова, frontmatter и имён моделей клиентов; навигационные упоминания клиентов в «Agent tooling» и «Agent Layout» разрешены; в `CLAUDE.md` и `.claude/**` нет Codex-конфигурации
- Security: в `.codex/**`, `.agents/**`, хуках нет секретов; хуки только печатают напоминание — без записи файлов и внешних действий
- Бюджет Codex: `AGENTS.md` до 12 KiB, итог загрузки до 32 KiB
- Исправления — в этой фазе; после них повторяются гейты и затронутые сценарии Phase 09

## Scope

Все файлы, созданные и изменённые в Phase 02–09.

## Checklist

- [x] Потерь при переносе нет (сверка по инвентарю `research.md`)
- [x] Дублей тел нет
- [x] Паритет git-политики, MCP, хуков и политики вызова подтверждён доказательствами Phase 06 и 09
- [x] Секретов нет
- [x] Гейты перезапущены после исправлений

## Verification Commands

- `rtk yarn agents:check --strict`
- `rtk yarn lint`
- `rtk yarn tsc --noEmit`
- `rtk grep -rniE "haiku|sonnet|opus|\$ARGUMENTS|disable-model-invocation|allow_implicit" AGENTS.md ai` — пусто
- `rtk grep -rniE "\[mcp_servers|prefix_rule|developer_instructions" CLAUDE.md .claude` — пусто

## Acceptance Criteria

- Все команды проходят; CRITICAL и HIGH устранены, MEDIUM и LOW устранены или записаны в Reflect

## Evidence Note

Выполнено 30.09.2026. Prerequisite Phase 09 — `in_progress` (Codex-сценарии вручную); аудит проведён по дереву после исправлений Phase 09, затронутые сценарии повторены.

Независимый аудит — отдельные запуски ролей, отчёт — [review-phase-10.md](plans/2026-09-30-multi-agent-rules/review-phase-10.md):
- `plan-auditor`: 0 CRITICAL, 0 HIGH, 4 MEDIUM, 7 LOW; сверка с исходниками из `HEAD` (экспорт в scratch, только чтение)
- `code-reviewer`: 1 HIGH, 3 MEDIUM, 3 LOW
- Исправлены: HIGH, все MEDIUM, кроме принятого предела Codex sandbox, и LOW 1–4, 6, 7; принятые и отложенные пункты — в Reflect

Проверки после исправлений:
- `rtk proxy yarn.cmd -s agents:check` (строгий по умолчанию) → `agents:check (strict) passed: 135 files scanned`, код 0
- `rtk proxy yarn.cmd -s lint` → 0 ошибок, 3 прежних предупреждения в `src/`; `npx eslint scripts/check-agent-config.mjs .codex/hooks/*.mjs` — чисто
- `rtk proxy yarn.cmd -s tsc --noEmit` → код 0
- `grep "haiku|sonnet|opus|\$ARGUMENTS|disable-model-invocation|allow_implicit" AGENTS.md ai` — пусто (включая `ai/skills/**/data`)
- `grep "\[mcp_servers|prefix_rule|developer_instructions" CLAUDE.md .claude` — пусто
- Секреты в `.codex/**`, `.agents/**` — не найдены; хуки только печатают JSON (подтверждено ревью)
- Бюджет Codex: `AGENTS.md` 89 строк, 5 780 байт; с глобальным `~/.codex/AGENTS.md` — 11 964 байта из 32 KiB
- Проба регрессии HIGH: пустой `description: >` → код 1, `unsupported syntax: empty block scalar ">"`; baseline копии — код 0
- `execpolicy check`: `rtk proxy git branch -D x`, `rtk proxy git commit -m x` → `forbidden`; `rtk proxy git status` → без совпадений
- Claude: `rtk proxy git status` — выполнено; `rtk proxy git commit --dry-run` — отказ permissions
- Потерь при переносе нет после M1/M2; дублей тел нет после L7; паритет git-политики, MCP, хуков и политики вызова — доказательства Phase 06 и `acceptance.md`

## Handoff Note

- Аудит закрыт: CRITICAL/HIGH нет, MEDIUM исправлены или приняты с записью
- `agents:check` строгий по умолчанию в `package.json`
- В Reflect: предел read-only в Codex, пути с `\`, незакреплённый `context7`, широкие `rtk yarn:*`/`rtk npx:*`, `frontend-design` условный
- Codex-сценарии Phase 09 — ручные; при расхождениях повторить гейты этой фазы

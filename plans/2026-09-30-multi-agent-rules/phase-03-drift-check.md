# Phase 03 — Скрипт проверки согласованности

- Status: done
- Model tier: BALANCED
- Required rules: `ai/rules/common/patterns.md`, `ai/rules/common/tooling.md`
- Prerequisites: Phase 02

## Goal

`rtk yarn agents:check` проверяет согласованность на любой фазе, а `--strict` — полноту миграции.

## Implementation Notes

- Пишется с нуля: `scripts/check-agent-config.mjs`, Node ESM без зависимостей, стиль `scripts/start-android.mjs`
- Проверки и поддерживаемое подмножество YAML/TOML — раздел «Проверка согласованности» `design.md`; неподдерживаемый синтаксис — ошибка
- Ожидаемые наборы (14 скиллов, 10 ролей, классы вызова, обязательные entry points) — константы с JSDoc вверху файла
- Переходный режим не требует ещё не созданных файлов; строгий требует всё
- Отрицательные пробы переходного режима — на синтетической копии в scratch: к копии дерева добавляется минимальный валидный комплект (один канон скилла с обоими адаптерами, одна роль с обоими адаптерами); сначала baseline с кодом 0, затем по одному дефекту, затем восстановление и снова 0. Не коммитятся: тест-раннера в проекте нет, постоянные фикстуры не добавляются
- Пробы строгого режима переносятся в Phase 08, где есть полный комплект — на неполном дереве код 1 ничего не доказывает

## Scope

- `scripts/check-agent-config.mjs`
- `package.json` — скрипт `agents:check`

## Checklist

- [x] Пары канон ↔ адаптеры в обе стороны; адаптер ссылается на одноимённый канон
- [x] Декодированные `name`/`description` совпадают, включая многострочный `description`
- [x] Политика вызова соответствует классу скилла
- [x] Пути: обратные кавычки, голые `@`-импорты, Markdown-ссылки, пути в `.toml`/`.json`/`.yaml`; шаблонные пути (`<name>`, `*`, `YYYY`) пропускаются
- [x] `--strict`: полный ожидаемый набор и entry points, лимиты `AGENTS.md`
- [x] Вывод — одно нарушение на строку, код 1 при нарушениях

## Verification Commands

- `rtk yarn agents:check` — проходит на дереве после фазы
- `rtk yarn agents:check --strict` — ожидаемо падает, перечисляя недостающие файлы будущих фаз
- `rtk yarn lint`

## Acceptance Criteria

- Переходный режим проходит на реальном дереве; строгий падает только по отсутствующим целевым файлам (это не проба обнаружения дефектов)
- В evidence: baseline синтетической копии с кодом 0; для каждой пробы — внесённый дефект, код 1 и дословное сообщение о нём; код 0 после восстановления
- Пробы: удалён один адаптер, адаптер ссылается на чужой канон, битый `@`-импорт, битая repo-root ссылка, расходящийся многострочный `description`, неподдерживаемый синтаксис frontmatter

## Evidence Note

Выполнено 30.09.2026.

Изменено:
- `scripts/check-agent-config.mjs` — Node ESM без зависимостей; флаги `--strict`, `--root <dir>`
- `package.json` — скрипт `agents:check`

Устройство:
- YAML-подмножество: однострочные скаляры, строки в кавычках, `>`/`|` с `-`/`+`, вложенные маппинги, блочные списки скаляров. Ошибка: flow-коллекции, якоря, теги, табы, многострочные plain-скаляры, plain-скаляр с `: `
- TOML-подмножество: `[table]`, строки `"`/`'`/`"""`/`'''`, числа, булевы, однострочные массивы. Ошибка: dotted keys, inline tables, многострочные массивы
- Пара считается начатой, если есть канон или Codex-адаптер; до этого Claude-адаптер — легаси и не проверяется в переходном режиме
- Скан путей: `AGENTS.md`, `CLAUDE.md`, `ai/`, `.claude/`, `.codex/`, `.agents/`; исключены `agent-memory/`, `reviews/`, `settings.local.json`, `data/` скилла `ui-ux-pro-max`, fenced-блоки
- Путь ищется от корня, затем от файла; в переходном режиме допускаются отсутствующие цели будущих фаз (`PENDING_TARGETS`)
- `INTENTIONALLY_ABSENT`: `docs/plans/`, `src/shared/stores/`, `src/shared/utils/platform.ts` — правила называют их намеренно (запрет или будущее место кода)

Реальное дерево:
- `yarn agents:check` → `agents:check (transitional) passed: 81 files scanned`, код 0
- `--strict` → код 1, 84 нарушения: отсутствующие каноны, адаптеры и entry points будущих фаз, адаптеры без указателя на канон, политика `eas-build`/`eas-submit`, ссылки на `AGENTS.md` и `ai/agents/INDEX.md`
- Единственное strict-нарушение не из-за отсутствия файла — реальный дефект: `.claude/agents/finapp-mobile-expert.md: unsupported syntax: plain scalar contains ": " — quote it`. Это причина, по которой агент не загружается в Claude (Phase 01)

Синтетическая копия (scratch, дерево без `node_modules`/`.git` + скилл `lint` и роль `codebase-researcher` с каноном и обоими адаптерами; многострочный `description`: YAML `>` против TOML `"""` с `\`):
- Baseline: `passed: 85 files scanned`, код 0
- Удалён `.agents/skills/lint/SKILL.md` → код 1: `.agents/skills/lint/SKILL.md: adapter is missing`
- Адаптер указывает на `ai/skills/typecheck/procedure.md` → код 1: `.agents/skills/lint/SKILL.md: does not reference its canon for "lint"` и `.agents/skills/lint/SKILL.md: references a foreign canon "typecheck"`
- `@ai/rules/common/missing-rule.md` в `CLAUDE.md` → код 1: `CLAUDE.md: broken reference "ai/rules/common/missing-rule.md"`
- Markdown-ссылка на `plans/2026-01-01-missing/...` в `tooling.md` → код 1: `ai/rules/common/tooling.md: broken reference "plans/2026-01-01-missing/missing-implementation-plan.md"`
- Строка многострочного `description` в TOML изменена → код 1: `role codebase-researcher: decoded "description" differs between Claude and Codex adapters`
- `tools: [Read, Glob, Grep]` → код 1: `.claude/agents/codebase-researcher.md: unsupported syntax: unsupported scalar start in "[Read, Glob, Grep]"`
- После каждого восстановления и в конце — код 0

Гейты:
- `yarn lint` — 0 ошибок, 3 прежних предупреждения в `src/`; `src/` не изменён
- `npx eslint scripts/check-agent-config.mjs` — чисто (`yarn lint` покрывает только `src`)
- `yarn tsc --noEmit` — код 0 (изменён `package.json`)
- `rtk yarn …` на этой машине не работает: `[rtk: program not found]` — rtk 0.29.0 не находит Windows-шим `yarn`; команды выполнены без префикса
- Независимое ревью не выполнялось

## Handoff Note

- `yarn agents:check` — после каждой фазы 04–08; `--strict` обязателен с Phase 08
- Phase 04: новые скиллы проверяются, как только появился канон или `.agents/skills/<name>`; Claude-адаптер обязан ссылаться на `ai/skills/<name>/procedure.md`
- Phase 05: `description` у `finapp-mobile-expert` взять в кавычки — иначе strict падает, а Claude не загружает агента
- Phase 05: `name`/`description` Claude- и Codex-адаптеров сравниваются после декодирования — `name` может быть `"Codebase Researcher"`, но одинаковым в обоих
- Phase 05: модель `codebase-researcher` в Claude — `sonnet`, в `ai-models.md` — FAST; расхождение унаследовано из прежнего `ai-models.md`
- `rtk yarn` не находит `yarn` на машине — затрагивает все команды правил; решение за пользователем (обновить rtk или PATH)
- Пробы строгого режима — Phase 08, по той же схеме на копии полного дерева

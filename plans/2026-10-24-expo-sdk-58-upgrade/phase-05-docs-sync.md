# Phase 05 — Синхронизация документации

Status: done
Model tier: FAST — замена версий по списку файлов
Required rules: `ai/rules/common/implementation-plans.md` (Documentation SoT), `ai/rules/common/tooling.md`

## Goal

Правила, роли и адаптеры называют SDK 58, React Native 0.88 и фактические версии закреплённых пакетов.

## Implementation notes

- Источник истины по версиям — таблица в `ai/rules/projects/fin-app-mobile/architecture.md`; остальные файлы ссылаются на неё или называют только мажор.
- Минимум Node фиксируется в `ai/rules/common/tooling.md`.
- Описания ролей с «Expo SDK 57» в тексте обновляются и в canon, и в адаптере.

## Scope

- `AGENTS.md` — блок Stack
- `ai/rules/projects/fin-app-mobile/architecture.md`
- `ai/rules/common/react-19.md`, `ai/rules/common/react.md`, `ai/rules/common/patterns.md`, `ai/rules/common/tooling.md`, `ai/rules/common/skills/refactor-security-audit.md`
- `ai/agents/command-runner.md`, `ai/agents/dependency-analyst.md`, `ai/agents/eas-deployer.md`, `ai/agents/finapp-mobile-expert.md`, `ai/agents/react-performance-reviewer.md`
- `.claude/agents/dependency-analyst.md`

## Checklist

- [ ] Найти все упоминания SDK 57, RN 0.86 и старых версий пакетов
- [ ] Обновить таблицу версий
- [ ] Обновить остальные файлы
- [ ] Проверить целостность ссылок и согласованность canon ↔ адаптеры

## Verification commands

- `rtk grep -rnE "SDK 57|0\.86" AGENTS.md CLAUDE.md ai .claude`
- `rtk yarn agents:check --strict`

## Acceptance criteria

- Поиск не находит устаревших упоминаний вне `plans/` и `CHANGELOG.md`
- `agents:check --strict` проходит

## Evidence note

24.10.2026, done.
- SDK 57 → 58, RN 0.86 → 0.88, React 19.2 → 19.3, Expo Router 57 → 58 в `AGENTS.md`, `ai/rules/**`, `ai/agents/**`, `.claude/agents/dependency-analyst.md`
- Дополнительно синхронизирован `.codex/agents/dependency-analyst.toml` — без него `agents:check --strict` падал на расхождении description Claude ↔ Codex
- `architecture.md`: строка React Native дополнена требованиями Strict TypeScript API; ссылка совместимости — `versions/v58.0.0`
- `tooling.md`: `NODE_VERSION_MIN`, форма вызова `eas-cli` при отсутствии локального `eas`
- Поиск `SDK 57|0\.86|19\.2` по `AGENTS.md`, `CLAUDE.md`, `ai`, `.claude`, `.codex` — 0 совпадений
- `agents:check --strict` пройден

## Handoff note

- Правила и роли называют SDK 58 / RN 0.88 / React 19.3
- Codex-адаптеры входят в периметр docs sync — добавить в чек-лист будущих апгрейдов

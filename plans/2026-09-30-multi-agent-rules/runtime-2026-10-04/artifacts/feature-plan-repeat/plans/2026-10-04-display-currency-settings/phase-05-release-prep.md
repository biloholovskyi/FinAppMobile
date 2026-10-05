# Phase 05: docs and release preparation

- Status: `todo`
- Model tier: FAST — mechanical documentation and version alignment.
- Required rules: [versioning](../../ai/rules/common/versioning-changelog.md), [deployment](../../ai/rules/common/deployment.md), [implementation plans](../../ai/rules/common/implementation-plans.md), [post-code](../../ai/rules/common/post-code-workflow.md).

## Goal

Prepare documentation and version artifacts for target version `1.11.0`.

## Implementation notes

The user owns the branch change to `r-1.11.0`. A native storage dependency requires a new native build and runtimeVersion update; resolve its value under the release contract, separately from app version.

## Scope

- `package.json`, `app.json`, `CHANGELOG.md`; read-only release-config check of `eas.json`.
- `ai/rules/projects/fin-app-mobile/architecture.md` for the fifth tab and new shared store path; `ai/rules/projects/fin-app-mobile/state-management.md` as the single source of truth for persistence and dashboard conversion conventions, linked from architecture.
- `AGENTS.md`, `CLAUDE.md`, `.agents/skills/start-task/SKILL.md`, `.codex/README.md`, `.claude/INDEX.md`: read-only link and stale-reference inventory. No adapter edits are planned.

## Checklist

- [ ] Align `package.json` and `app.json` versions to `1.11.0`; set runtimeVersion for the native build.
- [ ] Add a dated, brief `1.11.0` changelog entry after feature completion.
- [ ] Inventory rule and adapter references; keep one authoritative behavior contract and explicit cross-links.
- [ ] Verify `eas.json` production profile and channel remain aligned with the native release path.
- [ ] Scan changed documentation links, commands, env keys, and currency examples for stale content.
- [ ] Report branch mismatch; do not change branches.

## Verification commands

- `rtk yarn lint`, then `rtk yarn tsc --noEmit` after package/app edits.
- `rtk yarn agents:check --strict` if agent configuration files change.
- `rtk read eas.json`; `rtk read package.json`; `rtk read app.json`; `rtk read CHANGELOG.md` for release consistency.
- `rtk rg --files plans/2026-10-04-display-currency-settings` and `rtk grep 'displayCurrencyStore|settings.tsx|EXPO_PUBLIC_' ai/rules AGENTS.md CLAUDE.md .agents .claude .codex src` for path, convention, and environment reference inspection; exclude `.env` and authorization files.

## Acceptance criteria

- Version files and changelog match `1.11.0`; runtimeVersion matches native impact; documentation links resolve.
- Required gates pass, or the first blocked gate and all skipped gates are recorded accurately.

## Evidence note

Pending.

## Handoff note

Pass final release artifacts and outstanding user actions to Phase 06.

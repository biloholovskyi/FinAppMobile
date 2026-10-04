# Phase 06 — version and changelog preparation

- Status: todo
- Model tier: BALANCED — release compatibility decision and consistency gates
- Required rules: `versioning-changelog.md`, `deployment.md`, `post-code-workflow.md`

## Goal

- Prepare version `1.11.0` metadata and a completed-task changelog entry after implementation and audit.

## Implementation notes

- Check branch naming, but never change branches.
- A new native dependency requires an explicit runtimeVersion and build decision from the user; stop before choosing a value without that decision.

## Scope

- `package.json` version field
- `app.json` expo.version and, if approved, expo.runtimeVersion
- `CHANGELOG.md`
- `eas.json` read-only unless a release configuration change is approved

## Checklist

- [ ] Confirm target `1.11.0` and report branch `r-1.11.0` mismatch if present.
- [ ] Determine actual native dependency impact and obtain the runtimeVersion decision.
- [ ] Set `package.json` and `app.json` versions to `1.11.0`.
- [ ] Add one concise task bullet under `[1.11.0] DD.MM.YYYY` only after the task is completed.
- [ ] Verify version consistency and release channel assumptions.

## Verification commands

- `rtk git branch --list`
- `rtk read package.json`
- `rtk read app.json`
- `rtk read CHANGELOG.md`
- `rtk yarn agents:check --strict`

## Acceptance criteria

- Version fields match the user target; runtimeVersion follows the approved native-build path; changelog follows project format.

## Evidence note

- Fill after verification.

## Handoff note

- Transfer final artifact status and user-owned release actions to phase 07; mirror in `history.md`.

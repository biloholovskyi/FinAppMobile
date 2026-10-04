# Phase 03 — post-code verification

- Status: todo
- Model tier: BALANCED — evaluate and resolve any gate failures
- Required rules: `post-code-workflow.md`, `tooling.md`

## Goal

- Complete the required project quality gates after feature edits.

## Implementation notes

- Follow the canonical gate order and stop on the first unresolved failure or unavailable command.

## Scope

- Feature files from phases 01 and 02; no unrelated source edits.

## Checklist

- [ ] Run lint and resolve its findings.
- [ ] Run TypeScript only after lint passes; resolve findings.
- [ ] Run agent configuration check only after TypeScript passes.
- [ ] Record actual command outcomes in the evidence note.

## Verification commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`
- `rtk yarn agents:check --strict`

## Acceptance criteria

- All three gates pass in order, or the first unresolved gate is explicitly recorded as failed or not run.

## Evidence note

- Fill after verification.

## Handoff note

- Transfer gate outputs and remaining risks to phase 04; mirror in `history.md`.

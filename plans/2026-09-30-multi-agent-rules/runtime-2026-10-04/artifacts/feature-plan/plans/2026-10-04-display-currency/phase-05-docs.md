# Phase 05 — documentation sync

- Status: todo
- Model tier: FAST — focused contract and link checks
- Required rules: `implementation-plans.md`, `agent-workflow.md`, `state-management.md`

## Goal

- Keep authoritative project documentation aligned with the implemented preference.

## Implementation notes

- Put any new behavior contract in its owning `ai/rules/**` file and link from plan artifacts; avoid duplicate instructions in entry points.

## Scope

- `ai/rules/projects/fin-app-mobile/state-management.md` if the implemented preference adds a reusable convention
- `ai/rules/projects/fin-app-mobile/architecture.md` if routing conventions change
- `AGENTS.md`, `.codex/README.md`, and client adapters only if their links or commands become stale
- `plans/2026-10-04-display-currency/design.md`

## Checklist

- [ ] Inventory affected `ai/rules/**`, entry points, and adapter references.
- [ ] Confirm one authoritative rule location; mark any superseded guidance explicitly.
- [ ] Scan route names, env keys, command examples, and `ai/**` links for stale references.
- [ ] Record verified no-op when no documentation changes are required.

## Verification commands

- `rtk rg -n "displayCurrency|settings|AsyncStorage|EXPO_PUBLIC_" ai/rules AGENTS.md .codex src`
- `rtk yarn agents:check --strict`

## Acceptance criteria

- Every changed convention has one owner, links resolve, and no stale command or env key remains.

## Evidence note

- Fill after verification.

## Handoff note

- Transfer final release impact to phase 06; mirror in `history.md`.

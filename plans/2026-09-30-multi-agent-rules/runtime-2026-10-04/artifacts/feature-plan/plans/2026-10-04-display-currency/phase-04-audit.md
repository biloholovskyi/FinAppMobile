# Phase 04 — audit and hardening

- Status: todo
- Model tier: DEEP — cross-layer correctness and release impact
- Required rules: `refactor-security-audit.md`, `plan-audit.md`, `post-code-workflow.md`

## Goal

- Review conversion correctness, persistence behavior, accessibility, and plan-to-code alignment.

## Implementation notes

- Save the independent review findings as `plans/2026-10-04-display-currency/review-implementation.md`.
- The implementer addresses findings, then reruns post-code checks in sequence.

## Scope

- All files changed in phases 01–03.
- `plans/2026-10-04-display-currency/review-implementation.md` (new)

## Checklist

- [ ] Review mixed-currency math, rate validity, missing wallet currency, and hydration behavior.
- [ ] Review FSD imports, accessibility, and security impact of persisted preferences.
- [ ] Compare code against design and record any deviations.
- [ ] Resolve findings and rerun lint, TypeScript, and agent configuration check in order.

## Verification commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`
- `rtk yarn agents:check --strict`

## Acceptance criteria

- Saved review report has actionable findings or an explicit clean result; fixes have gate evidence.

## Evidence note

- Fill after verification.

## Handoff note

- Transfer final behavior and rule changes to phase 05; mirror in `history.md`.

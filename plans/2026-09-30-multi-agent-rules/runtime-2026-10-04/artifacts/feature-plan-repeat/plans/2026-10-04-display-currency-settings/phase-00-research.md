# Phase 00 Research: discovery

- Status: `done`
- Model tier: FAST — read-only code and rule discovery.
- Required rules: [implementation plans](../../ai/rules/common/implementation-plans.md), [architecture](../../ai/rules/projects/fin-app-mobile/architecture.md).

## Goal

Map the route, dashboard, rates, persistence, and release boundaries.

## Implementation notes

Facts are recorded in `research.md`; unresolved choices are named explicitly.

## Scope

- `plans/2026-10-04-display-currency-settings/research.md`

## Checklist

- [x] Inspect route, dashboard, conversion, package, and release configuration files.
- [x] Record factual boundaries and open decisions without reading secrets.

## Verification commands

- `rtk read plans/2026-10-04-display-currency-settings/research.md`

## Acceptance criteria

- Research identifies touched layers, existing rate contract, missing storage dependency, and release impact.

## Evidence note

`research.md` records the inspected files and absence of a direct storage dependency; it was read back successfully. No `.env` or authorization files were read.

## Handoff note

The design uses the existing rate endpoint and names persistence as a prerequisite.

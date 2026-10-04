# Phase 00 Design: target state

- Status: `done`
- Model tier: DEEP — currency semantics and native dependency trade-off.
- Required rules: [architecture](../../ai/rules/projects/fin-app-mobile/architecture.md), [state management](../../ai/rules/projects/fin-app-mobile/state-management.md), [deployment](../../ai/rules/common/deployment.md).

## Goal

Describe the settings, persistence, conversion, and error behavior.

## Implementation notes

The design states reviewable assumptions rather than silently choosing product scope.

## Scope

- `plans/2026-10-04-display-currency-settings/design.md`

## Checklist

- [x] Describe context, containers, components, data flow, and sequence.
- [x] Describe minor-unit conversion, missing rates, hydration, and release impact.

## Verification commands

- `rtk read plans/2026-10-04-display-currency-settings/design.md`

## Acceptance criteria

- The design has explicit product assumptions and implementable data contracts.

## Evidence note

`design.md` records C4 context/container/component, DFD steps, sequence, currency units, error behavior, and native build impact.

## Handoff note

The planning phase carries each assumption into the approval gate.

# Phase 01: foundation

- Status: `todo`
- Model tier: DEEP — storage and conversion semantics affect release compatibility.
- Required rules: [architecture](../../ai/rules/projects/fin-app-mobile/architecture.md), [state management](../../ai/rules/projects/fin-app-mobile/state-management.md), [deployment](../../ai/rules/common/deployment.md), [tooling](../../ai/rules/common/tooling.md).

## Goal

Validate the approved currency contract and establish a supported persistent-storage dependency.

## Implementation notes

Resolve the Expo SDK 57 compatible AsyncStorage version from official package guidance at execution time. Package installation is prohibited in this acceptance copy, so execution stops at this prerequisite unless the user changes that constraint.

## Scope

- `package.json`, `yarn.lock`: direct SDK-compatible storage dependency when installation is authorized.
- `plans/2026-10-04-display-currency-settings/research.md`, `design.md`: record the approved choices and compatibility evidence.

## Checklist

- [ ] Confirm supported currencies, dashboard coverage, rate convention, and missing-rate behavior.
- [ ] Confirm SDK-compatible storage package and native build impact.
- [ ] Add the direct dependency only when installation is authorized.

## Verification commands

- `rtk yarn lint`, then `rtk yarn tsc --noEmit` after dependency availability; stop at the first failed or unavailable gate.
- Read-only package manifest and lockfile consistency check.

## Acceptance criteria

- All product choices are explicit and dependency metadata is consistent without touching `package-lock.json`.
- Native build and runtimeVersion impact are recorded for Phase 05.

## Evidence note

Pending.

## Handoff note

Pass approved currency choices and storage adapter to Phase 02.

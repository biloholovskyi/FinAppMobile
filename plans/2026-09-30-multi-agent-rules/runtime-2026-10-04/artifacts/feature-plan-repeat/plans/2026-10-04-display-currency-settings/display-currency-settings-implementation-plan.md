# Display currency settings — implementation plan

Date: 2026-10-04. Target version: `1.11.0`.

## Goal

- Offer a persistent default display currency and apply it consistently to dashboard summaries and charts.

## Task profile

`feature`: feature_signals=3 (new route, cross-layer state, conversion behavior); bugfix_signals=0. The work is a new user capability with multiple FSD boundaries.

## Decisions taken

- The user specified version `1.11.0`, Zustand with persistence, dashboard application, and this acceptance-copy-only scope.
- The user prohibited package installation, mutating git commands, and external publishing in this copy.

## Assumptions pending review

- UAH/USD/EUR choices; UAH default; a fifth Settings tab.
- All dashboard summary amounts and the chart change currency; individual wallet rows retain wallet currency.
- Buy/cross rate convention and retryable unavailable state as specified in [design](design.md).
- Native AsyncStorage is the storage adapter; its addition requires a native build and a runtimeVersion update.

## Artifacts and rule coverage

- [Research](research.md), [design](design.md), [history](history.md), and [pre-implementation review](review-plan.md).
- [Implementation plans](../../ai/rules/common/implementation-plans.md), [architecture](../../ai/rules/projects/fin-app-mobile/architecture.md), [state management](../../ai/rules/projects/fin-app-mobile/state-management.md), [post-code](../../ai/rules/common/post-code-workflow.md), [versioning](../../ai/rules/common/versioning-changelog.md), [deployment](../../ai/rules/common/deployment.md).

## Phases

- Phase 00 Research (`done`) — evidence and boundary discovery: [research phase](phase-00-research.md)
- Phase 00 Design (`done`) — target-state contract: [design phase](phase-00-design.md)
- Phase 00 Plan (`in_progress`) — plan audit and approval gate: [planning phase](phase-00-plan.md)
- Phase 01 (`todo`) — validate design and persistence prerequisite: [phase 01](phase-01-foundation.md)
- Phase 02 (`todo`) — settings route and persisted preference: [phase 02](phase-02-settings.md)
- Phase 03 (`todo`) — dashboard conversion and display: [phase 03](phase-03-dashboard.md)
- Phase 04 (`todo`) — post-code checks and hardening review: [phase 04](phase-04-quality.md)
- Phase 05 (`todo`) — docs, version, and changelog preparation: [phase 05](phase-05-release-prep.md)
- Phase 06 (`todo`) — reflect and plan alignment: [phase 06](phase-06-reflect.md)

## Model schedule

- Phase 00 Research: FAST; Phase 00 Design: DEEP; Phase 00 Plan: BALANCED.
- Phase 01: DEEP for storage and rate semantics.
- Phases 02–03: BALANCED for feature implementation.
- Phase 04: DEEP for independent audit and hardening.
- Phases 05–06: FAST for release preparation and reflection.

## Next actions

1. User reviews the design assumptions and approves or amends this plan.
2. Resolve the package-install prohibition before executing Phase 01; no package installation occurs in this acceptance run.
3. Release preparation reports the expected branch name `r-1.11.0` for the user-owned branch gate.

## Out of scope

- Backend contract changes, new API generation, exchange-rate editing, authentication, deployment, and git mutations.

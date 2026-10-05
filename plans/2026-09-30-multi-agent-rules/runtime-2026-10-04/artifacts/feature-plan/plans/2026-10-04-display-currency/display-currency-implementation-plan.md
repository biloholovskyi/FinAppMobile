# Display currency implementation plan — 2026-10-04

## Goal

- Add a settings screen with a persisted default display currency and apply it consistently to the dashboard for version `1.11.0`.

## Task profile

- `feature`: feature_signals = 3 (route, persisted preference, cross-feature dashboard flow); bugfix_signals = 0. A multi-layer plan is required.

## Decisions taken

- User specified target version `1.11.0` and restricted all work to this acceptance copy.
- User prohibited package installation, git mutation, and external publication in this run.

## Assumptions awaiting plan approval

- Currency choices are UAH, USD, and EUR. The full dashboard total and expense visuals use the selected currency; wallet rows retain native currency.
- The preference is local, and unavailable exchange rates hide affected aggregates with a retry state.
- AsyncStorage installation and the native release path are prerequisites to executing phase 01.

## Artifacts

- [Research](research.md)
- [Design](design.md)
- `history.md` is created when the first phase completes.
- [Pre-implementation review](review-plan.md)

## Rule coverage

- [Planning](../../ai/rules/common/implementation-plans.md)
- [Architecture](../../ai/rules/projects/fin-app-mobile/architecture.md)
- [State management](../../ai/rules/projects/fin-app-mobile/state-management.md)
- [Post-code gates](../../ai/rules/common/post-code-workflow.md)
- [Versioning and changelog](../../ai/rules/common/versioning-changelog.md)

## Phases

- Phase 01 (todo) — [Settings and persisted preference](phase-01-settings-store.md)
- Phase 02 (todo) — [Dashboard currency application](phase-02-dashboard.md)
- Phase 03 (todo) — [Post-code verification](phase-03-post-code.md)
- Phase 04 (todo) — [Audit and hardening](phase-04-audit.md)
- Phase 05 (todo) — [Documentation sync](phase-05-docs.md)
- Phase 06 (todo) — [Version and changelog preparation](phase-06-release-artifacts.md)
- Phase 07 (todo) — [Reflect](phase-07-reflect.md)

## Model schedule

- BALANCED: phases 01–03 and 06.
- DEEP: phase 04.
- FAST: phases 05 and 07.

## Next actions

1. User reviews and approves this plan and the assumptions in `design.md`.
2. User decides how to provide the AsyncStorage dependency and native release path; package installation remains outside this acceptance run.
3. Begin phase 01 only after plan approval and its dependency prerequisite is satisfied.

## Out of scope

- Backend settings synchronization, exchange-rate history, per-wallet display preferences, package installation in this run, and external release actions.

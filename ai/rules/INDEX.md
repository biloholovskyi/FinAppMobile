# Rules Index — fin-app-mobile

Full catalog of all rule files. Task-based routing: the Task → Rule table in `AGENTS.md`.

## Project SSoT

- `ai/rules/projects/fin-app-mobile/architecture.md` — tech stack, FSD, Expo Router, NativeWind, kopeck math, commands
- `ai/rules/projects/fin-app-mobile/state-management.md` — Axios, React Query v5, Zustand v5, error handling

## Common Rules

- `ai/rules/common/react.md` — React Native component rules (NativeWind, FlatList, Expo Router restrictions)
- `ai/rules/common/react-19.md` — React 19 addendum (Actions, `use`, ref as a prop, no React Compiler)
- `ai/rules/common/patterns.md` — TypeScript, async, error handling, anti-patterns
- `ai/rules/common/post-code-workflow.md` — mandatory QA after edits (lint + tsc + checklist)
- `ai/rules/common/tooling.md` — yarn as the only package manager, package scripts, client layout pointer
- `ai/rules/common/versioning-changelog.md` — version sync, CHANGELOG format, runtimeVersion policy
- `ai/rules/common/deployment.md` — EAS build vs OTA update, CI pipeline, secrets, rollback
- `ai/rules/common/commit-message-and-crosslinks.md` — crosslink style (commit text is user-owned)
- `ai/rules/common/token-economy.md` — context-loading strategy, token efficiency rules
- `ai/rules/common/ai-models.md` — model tiers (FAST / BALANCED / DEEP / LONG_CONTEXT), role and skill tier assignments
- `ai/rules/common/implementation-plans.md` — plan lifecycle, phase structure, two-stage flow
- `ai/rules/common/response-rules.md` — AI response style
- `ai/rules/common/agent-workflow.md` — shared execution contract: precedence, planning, state, delegation, review artifacts
- `ai/rules/common/git-policy.md` — allowed git reads, forbidden git mutations

## Performance

- `ai/rules/common/performance/_index.md` — **start here**: symptom → rule file routing (RN adapted)
- `ai/rules/common/performance/_sections.md` — full catalog with impact levels
- `ai/rules/common/performance/_template.md` — template for new performance rules
- `ai/rules/common/performance/async-waterfalls.md` — sequential await anti-pattern
- `ai/rules/common/performance/async-suspense-boundaries.md` — Suspense placement
- `ai/rules/common/performance/bundle-strategy.md` — bundle size, Metro bundler
- `ai/rules/common/performance/client-swr-dedup.md` — React Query deduplication
- `ai/rules/common/performance/rerender-strategy.md` — memo, useCallback, useTransition
- `ai/rules/common/performance/rerender-derived-state.md` — derived state patterns
- `ai/rules/common/performance/rendering-hoist-jsx.md` — static JSX hoisting
- `ai/rules/common/performance/rendering-conditional-render.md` — conditional render patterns
- `ai/rules/common/performance/rendering-content-visibility.md` — long lists (NOTE: web CSS not applicable in RN — use FlatList)
- `ai/rules/common/performance/rendering-hydration-no-flicker.md` — theme flicker (NOTE: hydration is web concept — in RN use NativeWind dark:)
- `ai/rules/common/performance/js-early-exit.md` — early return patterns
- `ai/rules/common/performance/js-set-map-lookups.md` — Set/Map for O(1) lookups

## Skills (Guidance Files)

- `ai/rules/common/skills/react-best-practices.md` — RN component + performance guidance, FlatList checklist
- `ai/rules/common/skills/plan-audit.md` — plan audit process
- `ai/rules/common/skills/refactor-security-audit.md` — refactor + RN security audit checklist
- `ai/rules/common/skills/agent-team-quality-gates.md` — multi-agent quality gates
- `ai/rules/common/skills/feature-bug-phase-profiles.md` — feature vs bug scope profiles

## Skill Procedures

- `ai/skills/<name>/procedure.md` — 14 procedures: `start-task`, `implement-plan-step`, `post-code`, `lint`, `typecheck`, `commit`, `audit-plan`, `audit-security`, `review-react-perf`, `deploy-preflight`, `eas-build`, `eas-submit`, `eas-status`, `ui-ux-pro-max`

## Agent Roles

- `ai/agents/INDEX.md` — task → role routing, permission matrix, implementer/reviewer separation
- `ai/agents/<name>.md` — 10 role definitions

## Design

- `ai/rules/design/design-system.md` — HTML screen prototypes: tokens, phone frame, components
- `ai/rules/design/charts.md` — chart conventions for HTML prototypes

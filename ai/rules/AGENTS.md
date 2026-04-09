# Rules Index — fin-app-mobile

Full catalog of all rule files. Use `ai/rules/common/core-rules.md` for task-based routing.

## Project SSoT

- `ai/rules/projects/fin-app-mobile/architecture.md` — tech stack, FSD, Expo Router, NativeWind, kopeck math, commands
- `ai/rules/projects/fin-app-mobile/state-management.md` — Axios, React Query v5, Zustand v4, error handling

## Common Rules

- `ai/rules/common/core-rules.md` — task-to-file routing table, quick reference
- `ai/rules/common/react.md` — React Native component rules (NativeWind, FlatList, Expo Router restrictions)
- `ai/rules/common/react-18.md` — React 18 addendum (startTransition, useDeferredValue, useId)
- `ai/rules/common/patterns.md` — TypeScript, async, error handling, testing, anti-patterns
- `ai/rules/common/post-code-workflow.md` — mandatory QA after edits (lint + tsc + checklist)
- `ai/rules/common/git-conventions.md` — commit format, branch naming, PR routing
- `ai/rules/common/commit-message-and-crosslinks.md` — commit policy, crosslink style
- `ai/rules/common/token-economy.md` — context-loading strategy, token efficiency rules
- `ai/rules/common/ai-models.md` — model tier selection (haiku/sonnet/opus), decision matrix
- `ai/rules/common/implementation-plans.md` — plan lifecycle, phase structure, two-stage flow

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
- `ai/rules/common/skills/agent-team-quality-gates.md` — multi-agent quality gates
- `ai/rules/common/skills/feature-bug-phase-profiles.md` — feature vs bug scope profiles
- `ai/rules/common/skills/git-branch-kickoff.md` — branch creation workflow (no Jira)
- `ai/rules/common/skills/git-release-flow.md` — release + EAS Build + App Store submit
- `ai/rules/common/skills/git-hotfix-flow.md` — hotfix workflow + EAS build

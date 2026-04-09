# AGENTS.md — fin-app-mobile

Full context index of all agents, skills, and rules.

## Agents

| Agent | File | Use When |
|-------|------|----------|
| finapp-mobile-expert | `agents/finapp-mobile-expert.md` | All mobile development: screens, hooks, API, navigation, styling, bug fixes |
| code-reviewer | `agents/code-reviewer.md` | After implementation — detect bugs, enforce conventions, find improvements |
| screen-designer | `agents/screen-designer.md` | Design/prototype app screens as HTML mockups |
| codebase-researcher | `agents/codebase-researcher.md` | Explore project structure, trace features, find relevant files |
| plan-auditor | `agents/plan-auditor.md` | Before/after implementation — verify plan completeness and alignment |
| react-performance-reviewer | `agents/react-performance-reviewer.md` | After implementing screens/hooks — catch re-render issues, FlatList problems |

## Skills

| Skill | Use When |
|-------|----------|
| `/commit` | Creating git commits with proper conventional format |
| `/lint` | Running ESLint and fixing errors |
| `/post-code` | Post-edit QA workflow (lint + tsc) |
| `/start-task` | Starting a new feature/fix branch |
| `/implement-plan-step` | Executing a single step from an implementation plan |
| `/audit-plan` | Reviewing an implementation plan for completeness |
| `/audit-security` | Security review of code changes |
| `/review-react-perf` | React Native performance review |

## Rules Index

### Project SSoT (load these for mobile dev tasks)

| File | Covers |
|------|--------|
| `ai/rules/projects/fin-app-mobile/architecture.md` | Tech stack, FSD structure, Expo Router v3, NativeWind v4, kopeck math, commands |
| `ai/rules/projects/fin-app-mobile/state-management.md` | Axios, React Query v5, Zustand v4, error handling |

### Common Rules

| File | Covers |
|------|--------|
| `ai/rules/common/core-rules.md` | Task routing table, quick reference |
| `ai/rules/common/react.md` | React Native component rules, FlatList, NativeWind |
| `ai/rules/common/react-18.md` | React 18 addendum (startTransition, useDeferredValue) |
| `ai/rules/common/patterns.md` | TypeScript, async, error handling, testing patterns |
| `ai/rules/common/post-code-workflow.md` | QA after edits (lint + tsc checklist) |
| `ai/rules/common/git-conventions.md` | Commit format, branch naming, PR routing |
| `ai/rules/common/commit-message-and-crosslinks.md` | Commit policy, crosslink style |
| `ai/rules/common/token-economy.md` | Context-loading strategy, token efficiency |
| `ai/rules/common/ai-models.md` | Model tier selection (haiku/sonnet/opus) |
| `ai/rules/common/implementation-plans.md` | Plan lifecycle, phase structure |

### Performance Rules

| File | Covers |
|------|--------|
| `ai/rules/common/performance/_index.md` | Symptom → rule file routing (React Native adapted) |
| `ai/rules/common/performance/async-waterfalls.md` | Sequential await anti-pattern |
| `ai/rules/common/performance/async-suspense-boundaries.md` | Suspense placement |
| `ai/rules/common/performance/bundle-strategy.md` | Bundle size, Metro bundler |
| `ai/rules/common/performance/client-swr-dedup.md` | React Query deduplication |
| `ai/rules/common/performance/rerender-strategy.md` | memo, useCallback, useTransition |
| `ai/rules/common/performance/rerender-derived-state.md` | Derived state patterns |
| `ai/rules/common/performance/rendering-hoist-jsx.md` | Static JSX hoisting |
| `ai/rules/common/performance/rendering-conditional-render.md` | Conditional render patterns |
| `ai/rules/common/performance/js-early-exit.md` | Early return patterns |
| `ai/rules/common/performance/js-set-map-lookups.md` | Set/Map for lookups |

### Skill Files

| File | Covers |
|------|--------|
| `ai/rules/common/skills/react-best-practices.md` | RN component + performance guidance |
| `ai/rules/common/skills/plan-audit.md` | Plan audit process |
| `ai/rules/common/skills/agent-team-quality-gates.md` | Multi-agent quality gates |
| `ai/rules/common/skills/feature-bug-phase-profiles.md` | Feature vs bug scope profiles |
| `ai/rules/common/skills/git-branch-kickoff.md` | Branch creation workflow |
| `ai/rules/common/skills/git-release-flow.md` | Release + EAS Build workflow |
| `ai/rules/common/skills/git-hotfix-flow.md` | Hotfix workflow |

### Path-Gated Stubs (auto-loaded by Claude Code)

| File | Auto-loaded when |
|------|-----------------|
| `.claude/rules/screens.md` | Editing `src/**/*.tsx`, `src/**/*.jsx` |
| `.claude/rules/api.md` | Editing `src/**/*.ts`, `src/**/*.tsx` |
| `.claude/rules/navigation.md` | Editing `src/app/**` or expo-router imports |
| `.claude/rules/post-code.md` | Editing `src/**/*.ts`, `src/**/*.tsx` |
| `.claude/rules/design-system.md` | Editing `designs/**/*.html` |
| `.claude/rules/charts.md` | Editing `designs/**/*.html` |
| `.claude/rules/response-rules.md` | Always |

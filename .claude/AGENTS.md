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
| command-runner | `agents/command-runner.md` | Run rtk-prefixed scripts (lint, tsc, codegen) and report the output |
| dependency-analyst | `agents/dependency-analyst.md` | Expo SDK 54 compatibility, version alignment, lockfile drift, native-vs-OTA impact |
| full-package-auditor | `agents/full-package-auditor.md` | Broad read-only audit: config, FSD, quality, security, release readiness |
| eas-deployer | `agents/eas-deployer.md` | EAS release work: OTA-vs-build decision, artifacts, failure diagnosis |

## Skills

| Skill | Use When |
|-------|----------|
| `/start-task` | Classifying a brief and initializing an implementation plan |
| `/lint` | Running ESLint and fixing errors |
| `/typecheck` | TypeScript check only (no emit) |
| `/post-code` | Post-edit QA workflow (lint + tsc) |
| `/commit` | Commit prep — gates, version sync, CHANGELOG entry (never commits) |
| `/implement-plan-step` | Executing a single step from an implementation plan |
| `/audit-plan` | Reviewing an implementation plan for completeness |
| `/audit-security` | Security review of code changes |
| `/review-react-perf` | React Native performance review |
| `/deploy-preflight` | Pre-merge gate before pushing to `main` (which auto-publishes an OTA update) |
| `/eas-build` | Running an EAS native build after confirming scope |
| `/eas-submit` | Submitting a build to the App Store or Play Store |
| `/eas-status` | Read-only snapshot of builds, channel, and runtimeVersion |
| `/ui-ux-pro-max` | UI/UX design intelligence |

## Rules Index

### Project SSoT (load these for mobile dev tasks)

| File | Covers |
|------|--------|
| `ai/rules/projects/fin-app-mobile/architecture.md` | Tech stack, FSD structure, Expo Router v6, NativeWind v4, kopeck math, commands |
| `ai/rules/projects/fin-app-mobile/state-management.md` | Axios, React Query v5, Zustand v5, error handling |

### Common Rules

| File | Covers |
|------|--------|
| `ai/rules/common/core-rules.md` | Task routing table, quick reference |
| `ai/rules/common/react.md` | React Native component rules, FlatList, NativeWind |
| `ai/rules/common/react-19.md` | React 19 addendum (Actions, `use`, ref as a prop, no React Compiler) |
| `ai/rules/common/patterns.md` | TypeScript, async, error handling patterns |
| `ai/rules/common/post-code-workflow.md` | QA after edits (lint + tsc checklist) |
| `ai/rules/common/tooling.md` | yarn as the only package manager, scripts, Claude layout |
| `ai/rules/common/versioning-changelog.md` | Version sync, CHANGELOG format, runtimeVersion policy |
| `ai/rules/common/deployment.md` | EAS build vs OTA, CI pipeline, secrets, rollback |
| `ai/rules/common/commit-message-and-crosslinks.md` | Crosslink style (commit text is user-owned) |
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
| `ai/rules/common/skills/refactor-security-audit.md` | Refactor + RN security audit checklist |
| `ai/rules/common/skills/agent-team-quality-gates.md` | Multi-agent quality gates |
| `ai/rules/common/skills/feature-bug-phase-profiles.md` | Feature vs bug scope profiles |

### Path-Gated Stubs (auto-loaded by Claude Code)

| File | Auto-loaded when |
|------|-----------------|
| `.claude/rules/screens.md` | Editing `src/**/*.tsx`, `src/**/*.jsx` |
| `.claude/rules/navigation.md` | Editing `src/app/**` |
| `.claude/rules/architecture.md` | Editing `src/**` |
| `.claude/rules/api.md` | Editing `src/shared/api/**` |
| `.claude/rules/react.md` | Editing `src/**/*.tsx`, `src/**/*.jsx` |
| `.claude/rules/patterns.md` | Editing `src/**/*.ts`, `src/**/*.tsx` |
| `.claude/rules/performance.md` | Editing `src/**` |
| `.claude/rules/post-code.md` | Editing `src/**/*.ts`, `src/**/*.tsx` |
| `.claude/rules/design-system.md` | Editing `designs/**/*.html` |
| `.claude/rules/charts.md` | Editing `designs/**/*.html` |
| `.claude/rules/tooling.md` | Editing `package.json`, `yarn.lock`, `orval.config.ts`, `eslint.config.js`, `tsconfig.json` |
| `.claude/rules/versioning-changelog.md` | Editing `CHANGELOG.md`, `package.json`, `app.json` |
| `.claude/rules/deployment.md` | Editing `eas.json`, `app.json`, `.github/workflows/**`, `.mcp.json` |
| `.claude/rules/response-rules.md` | Always |

## Agent Memory

Per-agent memory lives in `.claude/agent-memory/<agent>/MEMORY.md`. Six agents declare `memory: project`: `finapp-mobile-expert`, `code-reviewer`, `command-runner`, `dependency-analyst`, `full-package-auditor`, `eas-deployer`. Guidance: `.claude/agent-memory/README.md`.

## Claude Config

- `.claude/settings.json` — committed: permissions, plugins, MCP servers, hooks. Mutating git commands are denied here; the user owns all git operations.
- `.claude/settings.local.json` — machine-specific permissions only.
- `.mcp.json` — MCP servers (`context7`).

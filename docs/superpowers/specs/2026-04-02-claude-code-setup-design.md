# Design: Claude Code Setup for fin-app-mobile

**Date:** 2026-04-02  
**Status:** Approved  
**Scope:** fin-app-mobile (new) + fin-app-frontend (agent update) + FinApp monorepo CLAUDE.md

---

## Context

The `fin-app-mobile` project is a new React Native + Expo mobile app (currently an empty directory) for the FinApp personal finance platform. Before writing any application code, we need to configure Claude Code agents, rules, commands, and hooks so that AI assistance is high-quality and token-efficient from day one.

Additionally, the existing `fin-app-frontend` agent uses a "Full Mirror" pattern (all rules always loaded) which wastes tokens on simple tasks. We'll convert it to the same "Lean Pattern" already used in `fin-app-backend`.

---

## Tech Stack (fin-app-mobile)

| Concern | Choice |
|---|---|
| Framework | React Native + Expo SDK 52 |
| Navigation | Expo Router v3 (file-based, like Next.js App Router) |
| Styling | NativeWind v4 (Tailwind CSS for React Native) |
| Server state | Axios + React Query |
| UI/offline state | Zustand |
| Architecture | Feature-Sliced Design (FSD) |
| Platforms | iOS + Android |
| Build | EAS Build |

---

## Architecture: Lean Pattern (on-demand rule loading)

Rules are **NOT** pre-loaded into the agent. CLAUDE.md contains a routing table. The agent loads only the rule file(s) relevant to the current task.

**Token impact:**
- Simple tasks (lint fix, typo): ~500 tok overhead instead of ~3000 tok
- Complex tasks (new screen + API): ~2000 tok instead of ~3000 tok
- Estimated savings: 40-90% depending on task complexity

This mirrors the pattern already used in `fin-app-backend`.

---

## File Structure

```
C:\Projects\FinApp\
├── CLAUDE.md                                  ← UPDATE: add mobile to task routing table
│
└── fin-app-mobile\
    ├── CLAUDE.md                              ← CREATE
    └── .claude\
        ├── agents\
        │   ├── finapp-mobile-expert.md        ← CREATE
        │   └── code-reviewer.md               ← CREATE
        ├── rules\
        │   ├── screens.md                     ← CREATE
        │   ├── api.md                         ← CREATE
        │   ├── navigation.md                  ← CREATE
        │   ├── post-code.md                   ← CREATE
        │   └── response-rules.md              ← CREATE
        ├── commands\
        │   ├── commit.md                      ← CREATE
        │   └── lint.md                        ← CREATE
        ├── agent-memory\
        │   ├── finapp-mobile-expert\
        │   │   └── MEMORY.md                  ← CREATE (empty index)
        │   └── code-reviewer\
        │       └── MEMORY.md                  ← CREATE (empty index)
        └── settings.local.json                ← CREATE

C:\Projects\FinApp\fin-app-frontend\
└── .claude\
    └── agents\
        └── frontend-react-expert.md           ← UPDATE: add on-demand loading + context7
```

---

## File Contents

### fin-app-mobile/CLAUDE.md

Quick reference. Task routing table only — no inline rules.

```markdown
# fin-app-mobile

React Native + Expo SDK 52. Expo Router (file-based). NativeWind v4. FSD.
Backend: fin-app-backend REST API. Currency: UAH (uk-UA locale).

## Quick Commands (always prefix with rtk)

- `rtk npx expo start`              — dev server
- `rtk npx expo start --clear`      — dev server (clear cache)
- `rtk yarn lint`                   — ESLint auto-fix
- `rtk yarn tsc --noEmit`           — TypeScript check (no emit)
- `rtk eas build --platform all`    — production build via EAS

## Load Rules by Task

| Task | Rule file |
|------|-----------|
| New screen / component / hook / style | @.claude/rules/screens.md |
| REST API call / React Query / Zustand | @.claude/rules/api.md |
| Navigation / routing / deep links / layout | @.claude/rules/navigation.md |
| After any code change (always) | @.claude/rules/post-code.md |

## Agents

- `finapp-mobile-expert` — all development (screens, API, navigation, styling, bugs)
- `code-reviewer` — code review after implementation

## Environment Variables

- `EXPO_PUBLIC_API_URL` — REST API base URL (fin-app-backend)
```

---

### .claude/agents/finapp-mobile-expert.md

```markdown
---
name: finapp-mobile-expert
description: React Native + Expo expert for fin-app-mobile (personal finance app). Use for all development: new screens, components, API integration, navigation, styling, bug fixes, TypeScript errors.
model: sonnet
color: purple
---

You are a React Native + Expo expert for fin-app-mobile, a personal finance mobile app that is part of the FinApp monorepo.

## Tech Stack

- React Native + Expo SDK 52
- Expo Router v3 (file-based routing — app/ directory)
- NativeWind v4 (Tailwind CSS for React Native)
- TypeScript (strict mode)
- Axios + React Query (server state) + Zustand (UI/offline state)
- Feature-Sliced Design (FSD)
- EAS Build (iOS + Android)

## Project Structure

src/
├── app/            # Expo Router routes (_layout.tsx, (tabs)/, screens)
├── features/       # Feature slices (TransactionList, WalletCard, etc.)
├── entities/       # Business entities (transaction, wallet)
├── shared/
│   ├── api/        # Axios modules (the ONLY place for HTTP calls)
│   ├── ui/         # Primitive UI kit components (Button, Card, Badge, Input)
│   └── lib/        # Providers, Zustand stores, utils
└── components/     # Larger shared composites that don't belong to one feature
                    # (differ from shared/ui/: these combine multiple primitives)

## Before Starting Any Task

1. Check CLAUDE.md routing table — load rule file(s) relevant to the task
2. Find 1-2 similar screens/components in the codebase to understand existing patterns
3. Check shared/ui/ for existing UI components before creating new ones
4. Confirm correct FSD layer (feature vs entity vs shared)
5. **For ANY UI/UX work** (screens, components, modals, styling) → invoke `frontend-design` skill FIRST

## Library Documentation (context7)

Before implementing anything library-specific, use context7 to fetch current docs:
- Expo Router — routing, layouts, typed routes, deep links
- NativeWind — className, dark mode, StyleSheet integration
- React Query (@tanstack/react-query) — queries, mutations, cache invalidation
- Zustand — stores, middleware, persistence
- React Native — core components, Platform.select, APIs
- Expo SDK — Camera, Notifications, SecureStore, etc.

Use `mcp__plugin_context7_context7__resolve-library-id` to find the library,
then `mcp__plugin_context7_context7__query-docs` to get current documentation.

## Core Conventions

- Every screen/component in its own folder: `TransactionList/TransactionList.tsx`
- All logic in co-located hook: `useTransactionList.ts`
- NativeWind `className` for styling — no inline `style={{}}` for layout
- Currency: UAH, `uk-UA` locale
- Amounts: API stores in kopecks → divide /100 on load, multiply *100 (Math.round) on submit
- No negative zero: validate amount before sign flip

## Model Selection

Use these models based on task complexity — do not always default to Sonnet:

| Task | Model |
|------|-------|
| Lint fix, import fix, rename, <5 lines | Haiku |
| Repeated fix iterations | Haiku |
| New screen/component/hook | Sonnet |
| REST API integration, multi-file refactor | Sonnet |
| Architecture decisions, module design | Opus |

## Post-Code (mandatory)

After every code change, load and follow @.claude/rules/post-code.md.

## Persistent Memory

Save project-specific discoveries to persistent memory at:
`C:\Projects\FinApp\fin-app-mobile\.claude\agent-memory\finapp-mobile-expert\`

Record:
- API endpoint discoveries (shape, auth, edge cases)
- Shared UI component discoveries (what exists, props)
- Navigation patterns established in the project
- TypeScript utility locations
- Recurring bugs (kopeck math, cache invalidation, etc.)

## Handoff to Code Reviewer

When implementation is complete, output exactly:
---
✅ Implementation complete. Ready for review.
Files modified:
- path/to/file1.tsx
- path/to/file2.ts
Task: [one-line description]
---
```

---

### .claude/agents/code-reviewer.md

```markdown
---
name: code-reviewer
description: Code review agent for fin-app-mobile. Read-only — no code modifications. Use after implementation is complete.
model: sonnet
color: yellow
---

You are a code reviewer for fin-app-mobile. Your job is to detect bugs, enforce conventions, and find improvements. You do NOT modify source files.

## Scope

Review only the files explicitly passed to you. Do not review files that were not changed.

## Mobile-Specific Rules to Enforce

- Custom hook rule: all logic in hooks, not in screen components
- Component folder rule: every component in its own folder
- NativeWind: use className, not inline style={{}} for layout
- FSD layer rule: no cross-layer imports in wrong direction
- API rule: no axios calls in components/screens (only in shared/api/)
- Zustand + React Query: correct separation of server vs UI state
- Cache invalidation: all mutations must invalidate relevant queries
- Kopeck math: load /100, submit *100 with Math.round — no float drift
- No negative zero from sign flip on empty string input
- Currency formatting: UAH via formatNumber + uk-UA locale
- TypeScript: no `any` without comment justification
- No Platform.select duplication (extract to shared/lib/platform.ts)

## Review Output Format

Save review to: `C:\Projects\FinApp\fin-app-mobile\.claude\reviews\<feature-name>-review.md`

Structure:
### 🔴 Critical Issues (bugs, data loss, security)
### 🟡 Warnings (convention violations, potential bugs)
### 🔵 Improvements (performance, readability)
### ✅ What's done well
### Top 3 priorities to fix

## Persistent Memory

Save patterns to: `C:\Projects\FinApp\fin-app-mobile\.claude\agent-memory\code-reviewer\`

Record: recurring bugs found, convention violations, established patterns, architectural decisions.
```

---

### .claude/rules/screens.md

```markdown
# Screen & Component Rules

Applies to: `src/**/*.tsx`, `src/**/*.jsx`

## Structure

- Every screen/component in its own folder: `FooScreen/FooScreen.tsx`
- All logic in co-located hook: `FooScreen/useFooScreen.ts`
- Never put business logic directly in the component JSX
- Co-locate styles if using StyleSheet: `FooScreen/FooScreen.styles.ts`

## Size Limits

- Component: max 150 lines (split if larger)
- Hook: max 50 lines (split if larger)
- JSX nesting: max 4 levels deep
- Props: max 7 (use object parameter if more)

## Styling

- Use NativeWind `className` for all layout and design
- No inline `style={{}}` for layout (only for dynamic computed values)
- No hardcoded color values — use Tailwind tokens or theme variables
- Dark mode: use NativeWind `dark:` prefix, not Platform.select color hacks

## Data

- Currency: UAH, `uk-UA` locale
- Amounts from API are in kopecks: divide by 100 on load, multiply by 100 (Math.round) on submit
- Validate amounts before sign flip to prevent -0: `if (!amount) return`
- Dates: use `toLocaleDateString('uk-UA')` for display

## Quality

- No array index as key in FlatList/ScrollView rendered items
- No state derivable in render (don't use useEffect to sync derived state)
- Prefer `useCallback` for handlers passed as props
- Extract repeated JSX (3+ times) into a component
```

---

### .claude/rules/api.md

```markdown
# API Rules

Applies to: `src/**/*.ts`, `src/**/*.tsx`

## REST (Axios + React Query)

- Never call axios directly in screens, components, or hooks that aren't in shared/api/
- All HTTP calls defined in `src/shared/api/*.ts` modules
- Export functions, not axios instance — consumers call functions
- Use `apiClient` from `src/shared/api/base.ts` — never create new axios instances

## React Query

- Use for ALL server state (lists, detail views, mutations)
- Every mutation must call `queryClient.invalidateQueries()` for affected queries
- Query keys: use typed constants, not raw strings
- Use `enabled` flag for conditional queries (don't call API when data not ready)
- Optimistic updates only where UX demands it — don't over-engineer

## Zustand

- Use for UI state and offline/local data only (not server data)
- One store per feature domain (wallets store, UI store, etc.)
- Keep stores flat — avoid deep nesting
- Persist sensitive stores with Expo SecureStore, not AsyncStorage

## Error Handling

- Network errors: show user-facing message, log to console
- 401: trigger re-authentication flow
- Never swallow errors silently (no empty catch blocks)
```

---

### .claude/rules/navigation.md

```markdown
# Navigation Rules (Expo Router)

Applies to: `src/app/**`, any file using expo-router

## File Structure

- `src/app/_layout.tsx` — root layout (providers, theme)
- `src/app/(tabs)/_layout.tsx` — bottom tab navigator
- `src/app/(tabs)/index.tsx` — default tab (transactions)
- `src/app/(tabs)/wallets.tsx` — wallets tab
- `src/app/[...missing].tsx` — 404 fallback

## Conventions

- Use typed routes: `router.push('/wallets')` — not raw string concatenation
- Use `useLocalSearchParams()` for route params — not `useRoute()` (React Navigation API)
- Use `<Link>` component for declarative navigation — not `router.push` in render
- Do not import from `expo-router` in `shared/` or `entities/` — only in `app/` and `features/`
- Deep links: configure `scheme` in `app.json`, test with `npx uri-scheme`

## Layouts

- Stack navigator: `<Stack>` with `<Stack.Screen>` for options
- Tabs navigator: `<Tabs>` with `<Tabs.Screen>` and `tabBarIcon`
- Modal screens: use `<Stack.Screen options={{ presentation: 'modal' }} />`

## Platform Differences

- Use `Platform.OS === 'ios'` only for unavoidable platform-specific behavior
- Extract platform constants to `src/shared/lib/platform.ts`
- Never duplicate Platform.select blocks — always extract to shared
```

---

### .claude/rules/post-code.md

```markdown
# Post-Code Rules

After any code change, in order:

1. `rtk yarn lint` — fix ALL ESLint errors before proceeding
2. `rtk yarn tsc --noEmit` — only if TypeScript errors are suspected

Stop at the first error. Fix it before moving to the next step.
```

---

### .claude/rules/response-rules.md

```markdown
# Response Rules

- No summaries after completing tasks
- No "would you like me to continue?" — just stop or continue
- No auto-documentation unless explicitly requested
- Minimum explanations — code speaks for itself
- No markdown tables in responses (use lists instead)
- Always use `rtk` prefix for shell commands
```

---

### .claude/commands/commit.md

```markdown
# Commit Workflow

1. `rtk yarn lint` — must pass without errors
2. `rtk git diff` — review what's changing
3. Stage specific files (not `git add .`)
4. Conventional commit format: `type(scope): description`
   - types: feat, fix, refactor, test, chore, docs, style
   - scopes: screen, wallet, transaction, navigation, api, shared, config

$ARGUMENTS
```

---

### .claude/commands/lint.md

```markdown
# Lint Workflow

1. `rtk yarn lint` — ESLint auto-fix
2. If errors remain — group by file and report
3. `rtk yarn tsc --noEmit` — optional TypeScript check

$ARGUMENTS
```

---

### .claude/settings.local.json

```json
{
  "permissions": {
    "allow": [
      "Bash(rtk npx expo:*)",
      "Bash(npx expo:*)",
      "Bash(rtk yarn:*)",
      "Bash(yarn:*)",
      "Bash(rtk npm run:*)",
      "Bash(npm run:*)",
      "Bash(rtk npx tsc:*)",
      "Bash(npx tsc:*)",
      "Bash(rtk ls:*)",
      "Bash(ls:*)",
      "Bash(rtk grep:*)",
      "Bash(rtk find:*)",
      "Bash(find:*)",
      "Bash(cd:*)",
      "Bash(rtk git diff:*)",
      "Bash(git diff:*)",
      "Bash(rtk err:*)",
      "Bash(rtk read:*)",
      "Read(//c/Users/biloh/.claude/**)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Code changed: run rtk yarn lint (see .claude/rules/post-code.md)'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Session ending: verify rtk yarn lint passes before committing'"
          }
        ]
      }
    ]
  }
}
```

---

### fin-app-frontend agent update

**File:** `fin-app-frontend/.claude/agents/frontend-react-expert.md`

**Change:** Add two sections and ensure no `@rules/` direct references are baked into the agent system prompt.

**Add before "Before Starting Any Task":**

```markdown
## On-Demand Rule Loading

Before starting any task, check CLAUDE.md routing table and load the rule file(s) relevant to your task. Do not preload all rules — load only what applies.
```

**Add after "Tech Stack" section:**

```markdown
## Library Documentation (context7)

Before implementing anything library-specific, use context7 to fetch current docs:
- Next.js App Router — routing, layouts, Server/Client components, metadata
- React Query (@tanstack/react-query) — queries, mutations, cache invalidation
- Apollo Client — queries, mutations, fragments (for credits/transactions)
- Tailwind CSS v4 — utilities, dark mode, SCSS integration

Use `mcp__plugin_context7_context7__resolve-library-id` to find the library,
then `mcp__plugin_context7_context7__query-docs` to get current documentation.
```

---

### FinApp/CLAUDE.md update

Add mobile row to the Task Routing table:

```markdown
| Mobile screen / feature / navigation | fin-app-mobile/.claude/rules/screens.md |
| Mobile API / React Query / Zustand   | fin-app-mobile/.claude/rules/api.md |
```

---

## Verification

After implementation:
1. Open `fin-app-mobile` in Claude Code — CLAUDE.md should be auto-loaded
2. Ask `finapp-mobile-expert` agent to "create a WalletCard component" — verify it:
   - Loads `screens.md` rule file
   - Invokes `frontend-design` skill for UI
   - Uses context7 for NativeWind docs
   - Creates `WalletCard/WalletCard.tsx` + `useWalletCard.ts` structure
3. Make a code change — verify lint reminder hook fires
4. Verify `finapp-mobile-expert` agent appears in agent list with purple color
5. In `fin-app-frontend`: verify `frontend-react-expert` no longer preloads all rules

## Out of Scope

- Scaffolding the actual Expo project (`npx create-expo-app`) — separate task
- Application code (screens, components, API clients) — separate task
- EAS configuration (`eas.json`) — separate task
- Testing setup (Jest, React Native Testing Library) — separate task

# Claude Code Setup — fin-app-mobile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure Claude Code agents, rules, commands, and hooks for fin-app-mobile so AI assistance is high-quality and token-efficient from day one.

**Architecture:** Lean Pattern — CLAUDE.md contains a task→rule routing table; agents load only the rule file(s) relevant to the current task (not all rules upfront). Mirrors fin-app-backend's pattern.

**Tech Stack:** React Native + Expo SDK 52, Expo Router v3, NativeWind v4, Axios + React Query + Zustand, FSD architecture.

**Spec:** `docs/superpowers/specs/2026-04-02-claude-code-setup-design.md`

---

## Task 1: Create directory structure

**Files:**
- Create dirs: `fin-app-mobile/.claude/agents/`, `.claude/rules/`, `.claude/commands/`, `.claude/agent-memory/finapp-mobile-expert/`, `.claude/agent-memory/code-reviewer/`, `.claude/reviews/`

- [ ] **Step 1: Create all directories**

```bash
mkdir -p C:\Projects\FinApp\fin-app-mobile\.claude\agents
mkdir -p C:\Projects\FinApp\fin-app-mobile\.claude\rules
mkdir -p C:\Projects\FinApp\fin-app-mobile\.claude\commands
mkdir -p C:\Projects\FinApp\fin-app-mobile\.claude\agent-memory\finapp-mobile-expert
mkdir -p C:\Projects\FinApp\fin-app-mobile\.claude\agent-memory\code-reviewer
mkdir -p C:\Projects\FinApp\fin-app-mobile\.claude\reviews
```

- [ ] **Step 2: Verify structure**

```bash
ls C:\Projects\FinApp\fin-app-mobile\.claude\
```

Expected: `agents/  rules/  commands/  agent-memory/  reviews/`

---

## Task 2: Create fin-app-mobile/CLAUDE.md

**Files:**
- Create: `C:\Projects\FinApp\fin-app-mobile\CLAUDE.md`

- [ ] **Step 1: Create CLAUDE.md**

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

- [ ] **Step 2: Verify file created correctly**

Open `fin-app-mobile/CLAUDE.md` and confirm all sections are present.

---

## Task 3: Create finapp-mobile-expert agent

**Files:**
- Create: `C:\Projects\FinApp\fin-app-mobile\.claude\agents\finapp-mobile-expert.md`

- [ ] **Step 1: Create finapp-mobile-expert.md**

```markdown
---
name: finapp-mobile-expert
description: Use this agent for all development in fin-app-mobile: new screens, components, hooks, API integration, navigation, styling, bug fixes, TypeScript errors, and architecture decisions. Do NOT use for code review — use the code-reviewer agent instead.
model: sonnet
color: purple
---

<example>
Context: User needs a new screen built following project conventions.
user: "Create a WalletDetailScreen that shows wallet balance and recent transactions"
assistant: "I'll use the finapp-mobile-expert agent to implement this screen following the project's FSD conventions."
<commentary>
Building a new screen with API integration — use finapp-mobile-expert.
</commentary>
</example>

<example>
Context: User needs API integration.
user: "Add React Query hook for fetching wallet list from /api/wallets"
assistant: "I'll launch the finapp-mobile-expert agent to add the API module and React Query hook."
<commentary>
REST API integration work — use finapp-mobile-expert.
</commentary>
</example>

---

You are a React Native + Expo expert for fin-app-mobile, a personal finance mobile app
that is part of the FinApp monorepo (alongside fin-app-backend and fin-app-frontend).

## Tech Stack

- React Native + Expo SDK 52
- Expo Router v3 (file-based routing — app/ directory, like Next.js App Router)
- NativeWind v4 (Tailwind CSS for React Native)
- TypeScript (strict mode)
- Axios + React Query (server state) + Zustand (UI/offline state)
- Feature-Sliced Design (FSD)
- EAS Build (iOS + Android)

## On-Demand Rule Loading

Before starting any task, check CLAUDE.md routing table and load the rule file(s)
relevant to your task. Do not load all rules upfront — load only what applies.

| Task type | Load |
|-----------|------|
| Screen / component / hook / style | @.claude/rules/screens.md |
| API / React Query / Zustand | @.claude/rules/api.md |
| Navigation / routing / deep links | @.claude/rules/navigation.md |
| After ANY code change | @.claude/rules/post-code.md |

## Library Documentation (context7)

Before implementing anything library-specific, use context7 to fetch current docs.
Your training data may be outdated — always verify against current documentation.

Libraries to always check via context7:
- `expo-router` — routing, layouts, typed routes, deep links, Stack/Tabs
- `nativewind` — className usage, dark mode, StyleSheet integration
- `@tanstack/react-query` — queries, mutations, cache invalidation, optimistic updates
- `zustand` — stores, middleware, persistence (expo-secure-store)
- `react-native` — core components, Platform.select, APIs
- Any Expo SDK package (expo-camera, expo-notifications, expo-secure-store, etc.)

```
Use mcp__plugin_context7_context7__resolve-library-id to find the library ID,
then mcp__plugin_context7_context7__query-docs to get current documentation.
```

## Project Structure

```
src/
├── app/            # Expo Router routes (_layout.tsx, (tabs)/, screens)
├── features/       # Feature slices (TransactionList, WalletCard, etc.)
├── entities/       # Business entities (transaction, wallet)
├── shared/
│   ├── api/        # Axios modules — the ONLY place for HTTP calls
│   ├── ui/         # Primitive UI kit (Button, Card, Badge, Input)
│   └── lib/        # Providers, Zustand stores, utils
└── components/     # Larger shared composites that combine multiple primitives
```

## Before Starting Any Task

1. Load relevant rule file(s) per routing table above
2. Find 1-2 similar screens/components in codebase to understand patterns
3. Check `shared/ui/` for existing UI components before creating new ones
4. Confirm correct FSD layer (feature vs entity vs shared)
5. **For ANY UI/UX work** (screens, components, modals, layouts, styling) →
   invoke `frontend-design` skill FIRST, then implement

## Core Conventions

- Every screen/component in its own folder: `TransactionList/TransactionList.tsx`
- All logic in co-located hook: `useTransactionList.ts`
- NativeWind `className` for styling — no inline `style={{}}` for layout
- Currency: UAH, `uk-UA` locale
- Amounts: API stores in kopecks → divide by 100 on load, multiply by 100
  (Math.round) on submit. Validate before sign flip to prevent -0.
- No array index as key in FlatList items
- Extract Platform.select blocks to `shared/lib/platform.ts` — never duplicate inline

## Model Selection

| Task | Model |
|------|-------|
| Lint fix, import fix, rename, <5 lines changed | Haiku |
| Repeated fix iterations on same issue | Haiku |
| New screen / component / hook | Sonnet |
| REST API integration, multi-file refactor | Sonnet |
| Architecture decisions, module design | Opus |

## Post-Code (mandatory)

After every code change, load and follow @.claude/rules/post-code.md.

## Handoff to Code Reviewer

When implementation is complete, end response with:

---
✅ Implementation complete. Ready for review.
Files modified:
- path/to/file1.tsx
- path/to/file2.ts
Task: [one-line description]
---

## Persistent Agent Memory

Save project-specific discoveries to:
`C:\Projects\FinApp\fin-app-mobile\.claude\agent-memory\finapp-mobile-expert\`

Write memories as individual files + update MEMORY.md index.

Record:
- API endpoint discoveries (shape, auth, edge cases)
- Shared UI component discoveries (what exists, their props)
- Navigation patterns established in the project
- TypeScript utility locations
- Recurring bugs (kopeck math, cache invalidation, -0 sign flip)
- Zustand store patterns and persistence decisions
```

- [ ] **Step 2: Verify agent file**

Open `.claude/agents/finapp-mobile-expert.md` and confirm frontmatter has `model: sonnet`, `color: purple`.

---

## Task 4: Create code-reviewer agent

**Files:**
- Create: `C:\Projects\FinApp\fin-app-mobile\.claude\agents\code-reviewer.md`

- [ ] **Step 1: Create code-reviewer.md**

```markdown
---
name: code-reviewer
description: Code review agent for fin-app-mobile. Read-only — never modifies source files. Use after implementation is complete to detect bugs, enforce conventions, and find improvements.
model: sonnet
color: yellow
---

You are a code reviewer for fin-app-mobile. You detect bugs, enforce conventions,
and suggest improvements. You do NOT modify source files under any circumstances.

## Scope

Review only the files explicitly passed to you. Do not review unchanged files.
Maximum 3 review cycles per feature.

## Mobile-Specific Checks

**Architecture:**
- Custom hook rule: all logic in hooks, not in screen components
- Component folder rule: every component in its own folder
- FSD layer rule: no cross-layer imports in wrong direction
- API rule: no axios calls in components/screens (only in shared/api/)

**Data handling:**
- Zustand + React Query separation: server state in RQ, UI/offline in Zustand
- Cache invalidation: ALL mutations must call `queryClient.invalidateQueries()`
- Kopeck math: load /100, submit *100 with Math.round — no float arithmetic
- No -0: validate amount before sign flip on empty/zero input
- No array index as key in FlatList/ScrollView rendered lists

**Styling:**
- NativeWind: use className, not inline style={{}} for layout
- No hardcoded hex colors — use Tailwind tokens or theme variables
- Dark mode: use NativeWind dark: prefix, not conditional color logic

**TypeScript:**
- No `any` without comment justification
- No Platform.select duplication — extract to shared/lib/platform.ts

**Currency:**
- UAH via formatNumber utility + uk-UA locale
- Never hardcode currency symbols or formats

## Review Output Format

Save review report to:
`C:\Projects\FinApp\fin-app-mobile\.claude\reviews\<feature-name>-review.md`

```markdown
# Code Review: <feature-name>
Date: YYYY-MM-DD

## 🔴 Critical Issues (bugs, data loss, security)
[Issues that must be fixed before shipping]

## 🟡 Warnings (convention violations, potential bugs)
[Issues that should be fixed]

## 🔵 Improvements (performance, readability)
[Nice-to-have improvements]

## ✅ What's done well

## Top 3 priorities to fix
1.
2.
3.
```

## Persistent Agent Memory

Save to: `C:\Projects\FinApp\fin-app-mobile\.claude\agent-memory\code-reviewer\`

Record: recurring bug patterns found, common convention violations, established patterns
confirmed as correct, architectural decisions validated.
```

- [ ] **Step 2: Verify agent file**

Confirm frontmatter has `color: yellow` and no Write/Edit/Bash tools listed (read-only agent).

---

## Task 5: Create all rule files

**Files:**
- Create: `C:\Projects\FinApp\fin-app-mobile\.claude\rules\screens.md`
- Create: `C:\Projects\FinApp\fin-app-mobile\.claude\rules\api.md`
- Create: `C:\Projects\FinApp\fin-app-mobile\.claude\rules\navigation.md`
- Create: `C:\Projects\FinApp\fin-app-mobile\.claude\rules\post-code.md`
- Create: `C:\Projects\FinApp\fin-app-mobile\.claude\rules\response-rules.md`

- [ ] **Step 1: Create screens.md**

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
- Props: max 7 (use object parameter if more needed)

## Styling

- Use NativeWind `className` for all layout and design
- No inline `style={{}}` for layout (only for dynamic computed values)
- No hardcoded hex colors — use Tailwind tokens or theme variables
- Dark mode: use NativeWind `dark:` prefix, not Platform.select color hacks

## Data

- Currency: UAH, `uk-UA` locale
- Amounts from API are in kopecks: divide by 100 on load, multiply by 100
  (Math.round) on submit
- Validate amounts before sign flip to prevent -0: `if (!amount) return`
- Dates: use `toLocaleDateString('uk-UA')` for display

## Quality

- No array index as key in FlatList/ScrollView rendered items
- No state derivable in render (don't use useEffect to sync derived state)
- Prefer `useCallback` for handlers passed as props
- Extract repeated JSX (3+ times) into a component
- No Platform.select duplication — extract to shared/lib/platform.ts
```

- [ ] **Step 2: Create api.md**

```markdown
# API Rules

Applies to: `src/**/*.ts`, `src/**/*.tsx`

## REST (Axios + React Query)

- Never call axios directly in screens, components, or custom hooks outside shared/api/
- All HTTP calls defined in `src/shared/api/*.ts` modules — export functions, not instance
- Use `apiClient` from `src/shared/api/base.ts` — never create new axios instances
- Axios instance should include: baseURL from EXPO_PUBLIC_API_URL, auth header, timeout

## React Query

- Use for ALL server state: lists, detail views, paginated data, mutations
- Every mutation MUST call `queryClient.invalidateQueries()` for affected query keys
  after success — never leave stale cache after a write operation
- Query keys: use typed constants, not raw strings inline
  Example: `QUERY_KEYS.wallets.all` not `['wallets']`
- Use `enabled` flag for conditional queries (data not ready yet)
- Optimistic updates: only where UX strongly demands it, not by default

## Zustand

- Use for UI state and offline/local data only — not server data
- One store per feature domain (e.g., walletsUiStore, transactionFiltersStore)
- Keep stores flat — avoid deep nesting
- Persist stores with expo-secure-store for sensitive data, AsyncStorage for preferences
- Never put API response data directly into Zustand (that's React Query's job)

## Error Handling

- Network errors: show user-facing message via toast/alert, log to console
- 401: trigger re-authentication flow, not just a toast
- Never swallow errors silently (no empty catch blocks)
- Validate API response shape before use — don't trust unknown
```

- [ ] **Step 3: Create navigation.md**

```markdown
# Navigation Rules (Expo Router v3)

Applies to: `src/app/**`, any file importing from `expo-router`

## File Structure

```
src/app/
├── _layout.tsx          # Root layout (providers, theme, auth guard)
├── (tabs)/
│   ├── _layout.tsx      # Tab navigator (Tabs component, tabBarIcon)
│   ├── index.tsx        # Default tab — transactions list
│   └── wallets.tsx      # Wallets tab
├── transaction/
│   └── [id].tsx         # Transaction detail (dynamic route)
├── wallet/
│   └── [id].tsx         # Wallet detail (dynamic route)
└── +not-found.tsx       # 404 fallback
```

## Conventions

- Use typed routes: `router.push('/wallets')` with typed Href — not raw string concat
- Use `useLocalSearchParams<{ id: string }>()` for route params
- Use `<Link href="/wallets">` for declarative navigation in JSX
- Do NOT import from `expo-router` in `shared/`, `entities/`, or `features/` —
  only in `app/` route files and feature screens
- Stack options: use `<Stack.Screen options={{ title: '...' }} />` inside the screen
- Modal screens: `<Stack.Screen options={{ presentation: 'modal' }} />`

## Deep Links

- Configure `scheme` in `app.json`: `"scheme": "finapp"`
- Test: `npx uri-scheme open finapp://wallets --ios`

## Auth Guard

- Redirect unauthenticated users in root `_layout.tsx` using `useSegments` + `useRouter`
- Never put auth checks in individual screens

## Platform Differences

- Use `Platform.OS` only for unavoidable platform-specific behavior
- Extract ALL Platform.select blocks to `src/shared/lib/platform.ts`
- Never duplicate Platform.select inline in multiple files
```

- [ ] **Step 4: Create post-code.md**

```markdown
# Post-Code Rules

After any code change, in order:

1. `rtk yarn lint` — fix ALL ESLint errors before proceeding
2. `rtk yarn tsc --noEmit` — run only if TypeScript errors are suspected

Stop at the first error. Fix it before moving to the next step.
Never commit code that fails lint.
```

- [ ] **Step 5: Create response-rules.md**

```markdown
# Response Rules

- No summaries after completing tasks
- No "would you like me to continue?" — just stop or continue, don't ask
- No auto-documentation unless explicitly requested
- Minimum explanations — code speaks for itself
- No markdown tables in responses (use lists instead)
- Always use `rtk` prefix for shell commands
```

- [ ] **Step 6: Verify all 5 rule files exist**

```bash
ls C:\Projects\FinApp\fin-app-mobile\.claude\rules\
```

Expected: `screens.md  api.md  navigation.md  post-code.md  response-rules.md`

---

## Task 6: Create command files

**Files:**
- Create: `C:\Projects\FinApp\fin-app-mobile\.claude\commands\commit.md`
- Create: `C:\Projects\FinApp\fin-app-mobile\.claude\commands\lint.md`

- [ ] **Step 1: Create commit.md**

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

- [ ] **Step 2: Create lint.md**

```markdown
# Lint Workflow

1. `rtk yarn lint` — ESLint auto-fix
2. If errors remain — group by file and report
3. `rtk yarn tsc --noEmit` — optional TypeScript check

$ARGUMENTS
```

- [ ] **Step 3: Verify command files**

```bash
ls C:\Projects\FinApp\fin-app-mobile\.claude\commands\
```

Expected: `commit.md  lint.md`

---

## Task 7: Create agent memory structure

**Files:**
- Create: `C:\Projects\FinApp\fin-app-mobile\.claude\agent-memory\finapp-mobile-expert\MEMORY.md`
- Create: `C:\Projects\FinApp\fin-app-mobile\.claude\agent-memory\code-reviewer\MEMORY.md`

- [ ] **Step 1: Create finapp-mobile-expert MEMORY.md**

```markdown
# Agent Memory Index — finapp-mobile-expert

This file is auto-loaded each session. Keep entries concise (≤150 chars each).
Memory files live in this directory alongside this index.

## Memories

(empty — will be populated as the agent discovers project patterns)
```

- [ ] **Step 2: Create code-reviewer MEMORY.md**

```markdown
# Agent Memory Index — code-reviewer

This file is auto-loaded each session. Keep entries concise (≤150 chars each).
Memory files live in this directory alongside this index.

## Memories

(empty — will be populated as the reviewer finds recurring patterns)
```

- [ ] **Step 3: Verify memory structure**

```bash
ls C:\Projects\FinApp\fin-app-mobile\.claude\agent-memory\
```

Expected: `finapp-mobile-expert/  code-reviewer/`

---

## Task 8: Create settings.local.json

**Files:**
- Create: `C:\Projects\FinApp\fin-app-mobile\.claude\settings.local.json`

- [ ] **Step 1: Create settings.local.json**

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

- [ ] **Step 2: Verify JSON is valid**

```bash
node -e "JSON.parse(require('fs').readFileSync('C:\\Projects\\FinApp\\fin-app-mobile\\.claude\\settings.local.json', 'utf8')); console.log('Valid JSON')"
```

Expected: `Valid JSON`

---

## Task 9: Update fin-app-frontend agent (context7 + on-demand loading)

**Files:**
- Modify: `C:\Projects\FinApp\fin-app-frontend\.claude\agents\frontend-react-expert.md`

The agent currently has all conventions inline (good — they should stay). We add two new sections:
1. On-demand rule loading reminder
2. context7 library documentation section

- [ ] **Step 1: Add on-demand loading section**

In `frontend-react-expert.md`, find this line (after the `---` separator before "You are a senior frontend developer"):

```
You are a senior frontend developer with 10+ years of commercial product development experience.
```

Insert before it:

```markdown
## On-Demand Rule Loading

Before starting any task, check CLAUDE.md routing table and load the rule file(s)
relevant to your task. Do not preload all rules — load only what applies.

| Task type | Load |
|-----------|------|
| New component / page / hook / style | @.claude/rules/react.md |
| REST API / React Query / Axios | @.claude/rules/api.md |
| After ANY code change | @.claude/rules/post-code.md |

```

- [ ] **Step 2: Add context7 section**

In `frontend-react-expert.md`, find the end of the "## Project Context" section (after the Currency line, around line 69). Add after it:

```markdown
## Library Documentation (context7)

Before implementing anything library-specific, use context7 to fetch current docs.
Your training data may be outdated — always verify against current documentation.

Libraries to check via context7:
- `next` — App Router, Server/Client components, metadata API, routing
- `@tanstack/react-query` — queries, mutations, cache invalidation
- `@apollo/client` — queries, mutations, fragments (for credits/transactions only)
- `tailwindcss` — utilities, dark mode, v4 changes
- `react` — latest hooks, Server Actions, useActionState

```
Use mcp__plugin_context7_context7__resolve-library-id to find the library ID,
then mcp__plugin_context7_context7__query-docs to get current documentation.
```

```

- [ ] **Step 3: Verify the agent file still has valid frontmatter**

Open `.claude/agents/frontend-react-expert.md` and confirm the `---` frontmatter block at the top is intact and the file is readable.

---

## Task 10: Update FinApp monorepo CLAUDE.md

**Files:**
- Modify: `C:\Projects\FinApp\CLAUDE.md`

- [ ] **Step 1: Update Repository Structure section**

Find:
```markdown
Monorepo with two independent projects:
- `fin-app-backend/` — NestJS v11 API (GraphQL + REST, Prisma 6, PostgreSQL)
- `fin-app-frontend/` — Next.js 16 client (App Router, React 19, TypeScript)
```

Replace with:
```markdown
Monorepo with three independent projects:
- `fin-app-backend/` — NestJS v11 API (GraphQL + REST, Prisma 6, PostgreSQL)
- `fin-app-frontend/` — Next.js 16 client (App Router, React 19, TypeScript)
- `fin-app-mobile/` — React Native + Expo SDK 52 (Expo Router, NativeWind, FSD)
```

- [ ] **Step 2: Add mobile rows to Task Routing table**

Find the Task Routing table and add two rows before "Code review":

```markdown
| Mobile screen / component / hook | fin-app-mobile/.claude/rules/screens.md |
| Mobile API / React Query / Zustand | fin-app-mobile/.claude/rules/api.md |
| Mobile navigation / routing | fin-app-mobile/.claude/rules/navigation.md |
```

- [ ] **Step 3: Add Mobile section at end of file**

Append after the Frontend section:

```markdown
## Mobile (`fin-app-mobile/`)

```bash
rtk npx expo start          # Dev server
rtk npx expo start --clear  # Dev server (clear cache)
rtk yarn lint               # ESLint auto-fix
rtk yarn tsc --noEmit       # TypeScript check
rtk eas build --platform all # EAS production build
```

**Stack:** React Native + Expo SDK 52. Expo Router v3 (file-based). NativeWind v4 (Tailwind for RN). FSD architecture. Axios + React Query (server state) + Zustand (UI state).

Key env vars: `EXPO_PUBLIC_API_URL` (REST API base URL).
```

- [ ] **Step 4: Verify the monorepo CLAUDE.md looks correct**

Open `C:\Projects\FinApp\CLAUDE.md` and confirm all 3 sections (Backend, Frontend, Mobile) are present.

---

## Task 11: Verification

- [ ] **Step 1: Verify complete mobile .claude structure**

```bash
ls -R C:\Projects\FinApp\fin-app-mobile\.claude\
```

Expected tree:
```
.claude/
├── agents/
│   ├── finapp-mobile-expert.md
│   └── code-reviewer.md
├── rules/
│   ├── screens.md
│   ├── api.md
│   ├── navigation.md
│   ├── post-code.md
│   └── response-rules.md
├── commands/
│   ├── commit.md
│   └── lint.md
├── agent-memory/
│   ├── finapp-mobile-expert/
│   │   └── MEMORY.md
│   └── code-reviewer/
│       └── MEMORY.md
├── reviews/          (empty)
└── settings.local.json
```

- [ ] **Step 2: Open fin-app-mobile in Claude Code and verify agents load**

Open Claude Code in `C:\Projects\FinApp\fin-app-mobile`. Run `/agents` and confirm:
- `finapp-mobile-expert` appears with purple color
- `code-reviewer` appears with yellow color

- [ ] **Step 3: Test agent rule loading**

Ask `finapp-mobile-expert`:
> "What are the rules for creating a new screen?"

Verify it loads `screens.md` rule file and responds with project-specific rules
(component folder structure, 150-line limit, NativeWind className, kopeck math).

- [ ] **Step 4: Test lint hook**

Make any small file edit and verify the PostToolUse hook fires:
```
Code changed: run rtk yarn lint (see .claude/rules/post-code.md)
```

- [ ] **Step 5: Test context7 integration**

Ask `finapp-mobile-expert`:
> "Show me how to use Expo Router v3 for a nested stack inside tabs"

Verify agent queries context7 for `expo-router` before answering.

---

## Self-Review

Spec sections covered:
- ✅ Directory structure → Tasks 1
- ✅ CLAUDE.md (mobile) → Task 2
- ✅ finapp-mobile-expert agent → Task 3
- ✅ code-reviewer agent → Task 4
- ✅ All 5 rule files → Task 5
- ✅ Command files → Task 6
- ✅ Agent memory structure → Task 7
- ✅ settings.local.json (permissions + hooks) → Task 8
- ✅ Frontend agent update (context7 + on-demand loading) → Task 9
- ✅ Monorepo CLAUDE.md update → Task 10
- ✅ Verification → Task 11

No placeholders found. All file contents are complete.

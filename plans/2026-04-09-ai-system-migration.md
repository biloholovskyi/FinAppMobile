# AI System Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Мигрировать структуру AI-системы из AI_Rules_and_skills/ в проект, добавить hooks, path-gated stubs и SKILL.md для максимальной токен-эффективности.

**Architecture:** Создать `ai/rules/` иерархию со SSoT правилами (общие адаптированные + mobile-specific), добавить `CLAUDE.md` entry point с routing table, преобразовать `.claude/rules/` в path-gated stubs, добавить `SKILL.md` в пустые skill-папки, настроить PostToolUse hooks.

**Tech Stack:** Markdown файлы, JSON (settings.local.json), Claude Code rules system (paths: frontmatter, YAML agents)

---

## Файловая карта

**Создать (35 файлов):**
- `CLAUDE.md` — entry point, routing table, dependency constraints
- `.claude/AGENTS.md` — compiled index агентов и правил
- `ai/rules/AGENTS.md` — compiled index всех правил (полный)
- `ai/rules/common/core-rules.md` — task-to-file routing для mobile (адаптировать)
- `ai/rules/common/patterns.md` — TypeScript/async/error patterns (адаптировать: убрать dual-runtime, Biome)
- `ai/rules/common/react.md` — React/RN component rules (адаптировать: убрать CSS Modules/SSR, добавить NativeWind/FlatList)
- `ai/rules/common/react-18.md` — скопировать as-is
- `ai/rules/common/git-conventions.md` — Git workflow (адаптировать: убрать Jira/GitLab/stage)
- `ai/rules/common/commit-message-and-crosslinks.md` — commit policy (адаптировать: убрать GAINFRA)
- `ai/rules/common/post-code-workflow.md` — QA workflow (переписать для Expo/rtk yarn)
- `ai/rules/common/token-economy.md` — скопировать as-is
- `ai/rules/common/ai-models.md` — скопировать as-is
- `ai/rules/common/implementation-plans.md` — скопировать as-is
- `ai/rules/common/performance/_index.md` — адаптировать (убрать web-only симптомы)
- `ai/rules/common/performance/_sections.md` — скопировать as-is
- `ai/rules/common/performance/_template.md` — скопировать as-is
- `ai/rules/common/performance/async-waterfalls.md` — скопировать as-is
- `ai/rules/common/performance/async-suspense-boundaries.md` — скопировать as-is
- `ai/rules/common/performance/bundle-strategy.md` — скопировать as-is
- `ai/rules/common/performance/client-swr-dedup.md` — скопировать as-is
- `ai/rules/common/performance/js-early-exit.md` — скопировать as-is
- `ai/rules/common/performance/js-set-map-lookups.md` — скопировать as-is
- `ai/rules/common/performance/rendering-conditional-render.md` — скопировать as-is
- `ai/rules/common/performance/rendering-content-visibility.md` — скопировать as-is (с NOTE о RN)
- `ai/rules/common/performance/rendering-hoist-jsx.md` — скопировать as-is
- `ai/rules/common/performance/rendering-hydration-no-flicker.md` — скопировать as-is (с NOTE о RN)
- `ai/rules/common/performance/rerender-derived-state.md` — скопировать as-is
- `ai/rules/common/performance/rerender-strategy.md` — скопировать as-is
- `ai/rules/common/skills/react-best-practices.md` — адаптировать (убрать Next.js/admin-ui, добавить RN)
- `ai/rules/common/skills/plan-audit.md` — скопировать as-is
- `ai/rules/common/skills/agent-team-quality-gates.md` — скопировать as-is
- `ai/rules/common/skills/feature-bug-phase-profiles.md` — скопировать as-is
- `ai/rules/common/skills/git-branch-kickoff.md` — адаптировать (убрать Jira, stage→develop)
- `ai/rules/common/skills/git-release-flow.md` — адаптировать (EAS Build, GitHub PR)
- `ai/rules/common/skills/git-hotfix-flow.md` — адаптировать (EAS, rtk yarn, GitHub PR)
- `ai/rules/projects/fin-app-mobile/architecture.md` — новый SSoT
- `ai/rules/projects/fin-app-mobile/state-management.md` — новый (из .claude/rules/api.md)
- `.claude/skills/commit/SKILL.md`
- `.claude/skills/lint/SKILL.md`
- `.claude/skills/post-code/SKILL.md`
- `.claude/skills/start-task/SKILL.md`
- `.claude/skills/implement-plan-step/SKILL.md`
- `.claude/skills/audit-plan/SKILL.md`
- `.claude/skills/audit-security/SKILL.md`
- `.claude/skills/review-react-perf/SKILL.md`
- `ai/prompts/mobile-feature.md`
- `ai/prompts/mobile-bug.md`
- `ai/prompts/mobile-design.md`
- `ai/prompts/mobile-api.md`
- `ai/prompts/mobile-review.md`

**Изменить (9 файлов):**
- `.claude/settings.local.json` — добавить hooks
- `.claude/agents/finapp-mobile-expert.md` — обновить routing table
- `.claude/rules/api.md` — добавить paths: frontmatter, упростить до redirect
- `.claude/rules/screens.md` — добавить paths: frontmatter
- `.claude/rules/navigation.md` — добавить paths: frontmatter
- `.claude/rules/post-code.md` — добавить paths: frontmatter
- `.claude/rules/design-system.md` — добавить paths: frontmatter
- `.claude/rules/charts.md` — добавить paths: frontmatter
- `.claude/rules/response-rules.md` — без изменений (проверить)

---

## Task 1: Создать директории

**Files:** директории

- [ ] Создать структуру директорий:

```bash
mkdir -p ai/rules/common/performance
mkdir -p ai/rules/common/skills
mkdir -p ai/rules/projects/fin-app-mobile
mkdir -p ai/prompts
```

- [ ] Проверить:

```bash
ls ai/rules/common/
ls ai/rules/projects/
ls ai/prompts/
```

Expected: директории существуют

---

## Task 2: Скопировать as-is universal правила

**Files:**
- Create: `ai/rules/common/token-economy.md`
- Create: `ai/rules/common/ai-models.md`
- Create: `ai/rules/common/implementation-plans.md`
- Create: `ai/rules/common/react-18.md`

- [ ] Скопировать token-economy.md:

```bash
cp AI_Rules_and_skills/ai/rules/common/token-economy.md ai/rules/common/token-economy.md
```

- [ ] Скопировать ai-models.md:

```bash
cp AI_Rules_and_skills/ai/rules/common/ai-models.md ai/rules/common/ai-models.md
```

- [ ] Скопировать implementation-plans.md:

```bash
cp AI_Rules_and_skills/ai/rules/common/implementation-plans.md ai/rules/common/implementation-plans.md
```

- [ ] Скопировать react-18.md:

```bash
cp AI_Rules_and_skills/ai/rules/common/react-18.md ai/rules/common/react-18.md
```

- [ ] Проверить (4 файла существуют):

```bash
ls ai/rules/common/
```

---

## Task 3: Скопировать as-is performance файлы

**Files:** `ai/rules/common/performance/` (12 файлов as-is)

- [ ] Скопировать все performance файлы кроме `_index.md` (его адаптируем в Task 8):

```bash
cp AI_Rules_and_skills/ai/rules/common/performance/_sections.md ai/rules/common/performance/_sections.md
cp AI_Rules_and_skills/ai/rules/common/performance/_template.md ai/rules/common/performance/_template.md
cp AI_Rules_and_skills/ai/rules/common/performance/async-waterfalls.md ai/rules/common/performance/async-waterfalls.md
cp AI_Rules_and_skills/ai/rules/common/performance/async-suspense-boundaries.md ai/rules/common/performance/async-suspense-boundaries.md
cp AI_Rules_and_skills/ai/rules/common/performance/bundle-strategy.md ai/rules/common/performance/bundle-strategy.md
cp AI_Rules_and_skills/ai/rules/common/performance/client-swr-dedup.md ai/rules/common/performance/client-swr-dedup.md
cp AI_Rules_and_skills/ai/rules/common/performance/js-early-exit.md ai/rules/common/performance/js-early-exit.md
cp AI_Rules_and_skills/ai/rules/common/performance/js-set-map-lookups.md ai/rules/common/performance/js-set-map-lookups.md
cp AI_Rules_and_skills/ai/rules/common/performance/rendering-conditional-render.md ai/rules/common/performance/rendering-conditional-render.md
cp AI_Rules_and_skills/ai/rules/common/performance/rendering-content-visibility.md ai/rules/common/performance/rendering-content-visibility.md
cp AI_Rules_and_skills/ai/rules/common/performance/rendering-hoist-jsx.md ai/rules/common/performance/rendering-hoist-jsx.md
cp AI_Rules_and_skills/ai/rules/common/performance/rendering-hydration-no-flicker.md ai/rules/common/performance/rendering-hydration-no-flicker.md
cp AI_Rules_and_skills/ai/rules/common/performance/rerender-derived-state.md ai/rules/common/performance/rerender-derived-state.md
cp AI_Rules_and_skills/ai/rules/common/performance/rerender-strategy.md ai/rules/common/performance/rerender-strategy.md
```

- [ ] Проверить (14 файлов):

```bash
ls ai/rules/common/performance/
```

Expected: 14 файлов (без _index.md пока что)

---

## Task 4: Скопировать as-is skills

**Files:**
- Create: `ai/rules/common/skills/plan-audit.md`
- Create: `ai/rules/common/skills/agent-team-quality-gates.md`
- Create: `ai/rules/common/skills/feature-bug-phase-profiles.md`

- [ ] Скопировать:

```bash
cp AI_Rules_and_skills/ai/rules/common/skills/plan-audit.md ai/rules/common/skills/plan-audit.md
cp AI_Rules_and_skills/ai/rules/common/skills/agent-team-quality-gates.md ai/rules/common/skills/agent-team-quality-gates.md
cp AI_Rules_and_skills/ai/rules/common/skills/feature-bug-phase-profiles.md ai/rules/common/skills/feature-bug-phase-profiles.md
```

- [ ] Проверить:

```bash
ls ai/rules/common/skills/
```

---

## Task 5: Написать post-code-workflow.md (адаптирован)

**Files:**
- Create: `ai/rules/common/post-code-workflow.md`

- [ ] Создать файл:

```markdown
# Post-Code Workflow (fin-app-mobile)

Mandatory quality checks after any code change.

## Required Steps (In Order)

- Lint: `rtk yarn lint` — fix ALL ESLint errors before proceeding
- Type Check: `rtk yarn tsc --noEmit` — run only if TypeScript errors suspected

Stop at first error. Fix before moving to next step.
Never commit code that fails lint.

## One-Line Workflow

`rtk yarn lint && rtk yarn tsc --noEmit`

## Pre-Commit Checklist

- [ ] Lint passes (rtk yarn lint)
- [ ] No TypeScript errors (if tsc was run)
- [ ] No console.log in production code
- [ ] No hardcoded hex colors — use Tailwind tokens only
- [ ] No inline style={{}} for layout (only for computed dynamic values)
- [ ] kopeck math: divide by 100 on load, multiply by 100 (Math.round) on submit
- [ ] Cache invalidation: all mutations call queryClient.invalidateQueries()
- [ ] No array index as key in FlatList items
- [ ] Platform.select not duplicated inline — extracted to shared/lib/platform.ts

## Performance

Lint: <10s | TypeCheck: <30s

## Common Lint Errors

NativeWind: use className prop, not style={{}} for layout
Import order: run `rtk yarn lint --fix` first for auto-fixable issues
Unused vars: remove or prefix with _ if intentional
Missing deps in useCallback/useEffect: add to dependency array

## Related Rules

- `ai/rules/projects/fin-app-mobile/architecture.md` — project conventions
- `ai/rules/common/git-conventions.md` — commit format after QA passes
```

- [ ] Проверить что файл создан:

```bash
ls ai/rules/common/post-code-workflow.md
```

---

## Task 6: Написать core-rules.md (адаптирован)

**Files:**
- Create: `ai/rules/common/core-rules.md`

- [ ] Создать файл:

```markdown
# Core Rules — fin-app-mobile

Load this first. Then load task-specific rule(s) from the table below.

## Task → File Routing

| Task | Load |
|------|------|
| New screen / component / hook | `ai/rules/projects/fin-app-mobile/architecture.md` |
| API integration / React Query / Zustand | `ai/rules/projects/fin-app-mobile/state-management.md` |
| Navigation / routing / deep links | `ai/rules/projects/fin-app-mobile/architecture.md` |
| Styling / NativeWind / design tokens | `ai/rules/projects/fin-app-mobile/architecture.md` |
| HTML screen design (designs/) | `.claude/rules/design-system.md` + `.claude/rules/charts.md` |
| React patterns / component rules | `ai/rules/common/react.md` |
| TypeScript / async / error patterns | `ai/rules/common/patterns.md` |
| Post-code QA | `ai/rules/common/post-code-workflow.md` |
| Implementation planning | `ai/rules/common/implementation-plans.md` |
| Plan audit | `ai/rules/common/skills/plan-audit.md` |
| React / RN performance | `ai/rules/common/performance/_index.md` + `ai/rules/common/skills/react-best-practices.md` |
| Git commit | `ai/rules/common/git-conventions.md` + `ai/rules/common/commit-message-and-crosslinks.md` |
| Branch kickoff | `ai/rules/common/skills/git-branch-kickoff.md` |
| Release / EAS Build | `ai/rules/common/skills/git-release-flow.md` |
| Hotfix | `ai/rules/common/skills/git-hotfix-flow.md` |
| Quality gates (agent team) | `ai/rules/common/skills/agent-team-quality-gates.md` |
| Feature vs bug scope | `ai/rules/common/skills/feature-bug-phase-profiles.md` |
| Token budget | `ai/rules/common/token-economy.md` |
| Model selection | `ai/rules/common/ai-models.md` |
| Full context | `CLAUDE.md` (root) or `.claude/AGENTS.md` |

## Quick Reference

Commands:
- Dev: `rtk npx expo start`
- Lint: `rtk yarn lint`
- TypeCheck: `rtk yarn tsc --noEmit`
- EAS Build: `rtk npx eas build --profile production`

FSD layers (import direction: app → features → entities → shared):
- `src/app/` — Expo Router routes
- `src/features/` — feature slices
- `src/entities/` — business entities
- `src/shared/` — API modules, UI kit, stores, utils

Forbidden cross-layer imports:
- shared → features (NEVER)
- entities → features (NEVER)
- expo-router in shared/, entities/, features/ (NEVER)

Money: API in kopecks → /100 display, *100 Math.round submit
Locale: uk-UA | Currency: UAH
Dates: `toLocaleDateString('uk-UA')`

## Related

- Full routing and constraints: `CLAUDE.md` (project root)
- All agents and skills index: `.claude/AGENTS.md`
```

- [ ] Проверить:

```bash
ls ai/rules/common/core-rules.md
```

---

## Task 7: Написать patterns.md (адаптирован)

**Files:**
- Create: `ai/rules/common/patterns.md`

Берём оригинал из `AI_Rules_and_skills/ai/rules/common/patterns.md` и убираем:
- Всю секцию "Dual-Runtime Patterns (Node + Bun)" (строки 182-229)
- Decision Matrix строки с JSONB, @gis-tunnel, admin-ui, Sqids, Drizzle/SQL, RuntimeAdapter
- Error Handling: строки с @gis-tunnel/errors, ErrorCode.NOT_FOUND
- Testing: Biome, pnpm, vitest упоминания адаптируем под yarn/jest (Expo использует Jest)
- Code Quality Tools: убрать Biome, оставить только ESLint
- Decision Protocol: убрать ссылку на non-restrict-proxy architecture

- [ ] Создать файл `ai/rules/common/patterns.md`:

```markdown
# AI Rules (Consolidated)

TypeScript, testing, error handling, async patterns for fin-app-mobile.

## Mission

Deliver correct, secure, maintainable code while minimizing tokens. Obey repo rules hierarchy: Core Rules → Task Rules → Source Files → Heuristics.

## Priority Stack

1. Safety & compliance (no secrets, no data loss)
2. Correctness vs spec & tests
3. Architecture alignment (DRY, KISS, YAGNI, SOLID)
4. Token economy & latency
5. Style consistency

## Decision Protocol

- Load `ai/rules/projects/fin-app-mobile/architecture.md` and `ai/rules/common/post-code-workflow.md` before coding
- Resolve conflicts: newest explicit instruction > repo rules > general heuristics
- If requirements are ambiguous: proceed with documented assumptions unless risk is high (data loss, security)
- Document assumptions when acting on inferred intent
- Think as expert: Apply 10+ years experience, consider edge cases, performance, security, maintainability
- Plan first: Split tasks, identify dependencies, list assumptions and risks

## Constants

### Definition Rules

- Extract numeric literals >1 (except 0, 1, -1 which are OK inline)
- Always extract values 10+ (use underscores: 10_000)
- Extract when used in 2+ places
- Extract when value has semantic meaning

### Naming Rules

- SCREAMING_SNAKE_CASE
- Include units in name (MS, KB, PORT, COUNT, etc.)
- Descriptive: what it represents, not just the value
- Group related constants in same file

### Organization Rules

- Location: `src/shared/constants/` with logical grouping (timeouts.ts, limits.ts, etc.)
- Structure: Each category in separate file, export const objects with `as const`
- Export: Re-export all from `src/shared/constants/index.ts`
- Usage: Destructure at call sites
- JSDoc: Each constant MUST have JSDoc comment explaining purpose

### Standard Constants

Code Quality:
- FUNCTION_MAX_LINES = 20
- FUNCTION_REFACTOR_LINES = 30
- COMPONENT_MAX_LINES = 150
- HOOK_MAX_LINES = 50
- MAX_NESTING_DEPTH = 3
- DUPLICATION_THRESHOLD = 3
- MAX_PARAMS_WITHOUT_RO_RO = 5

Money (CRITICAL for fin-app-mobile):
- KOPECK_DIVISOR = 100
- All API amounts in kopecks (integers)
- Display: amount / KOPECK_DIVISOR
- Submit: Math.round(displayAmount * KOPECK_DIVISOR)
- Validate before sign flip: `if (!amount) return` — prevents -0

Retry/Backoff:
- MAX_RETRY_ATTEMPTS = 10
- INITIAL_BACKOFF_MS = 1_000
- MAX_BACKOFF_MS = 5_000
- BACKOFF_MULTIPLIER = 1.2

## Decision Matrix

| Need | Solution | When |
|------|----------|------|
| Error handling | Result pattern | Expected errors in business logic |
| Error handling | Throw exception | Unexpected errors, external I/O |
| Async parallel | Promise.all() | Independent tasks |
| Async sequential | for...of | Dependent tasks |
| Type safety | Branded types | Domain values (UserId, WalletId) |
| Magic numbers | Extract constant | 2+ (0,1,-1 OK inline) |
| Magic strings | Extract constant | Repeated protocol/domain literals |
| Type-only imports | Enforce import type | Type-only symbol usage |
| Security audit | ASVS v5 checklist | Refactor touches external input/auth |
| Testing | AAA pattern | All tests |
| Retry logic | Exponential backoff | Transient failures (5xx only) |
| Folder structure | Flat structure | Files < 7 |
| Folder structure | Nested structure | Files >= 7 |

## Preferred Paradigms

- Functional core, imperative shell: keep business logic pure; isolate I/O at boundaries
- Composition over inheritance: prefer small composable functions, hooks
- Explicit effects: model async, errors, external deps via parameters
- Immutability by default: avoid shared mutable state
- Declarative UI: describe what UI should look like, not step-by-step mutation

## Requirements

### Naming
- Components: PascalCase
- Hooks: `use` + camelCase
- Variables/Functions: camelCase
- Files and directories: kebab-case
- Constants: SCREAMING_SNAKE_CASE (include units)
- Environment Vars: UPPERCASE (EXPO_PUBLIC_ prefix for client-accessible)
- Booleans: Verb prefix (isX, hasX, canX)
- Abbreviations: i/j (loops), err, ctx
- English only

### Functions
- Length: <FUNCTION_MAX_LINES
- Naming: Verb+noun
- Pattern: RO-RO for MAX_PARAMS_WITHOUT_RO_RO+ params/returns
- Nesting: ≤MAX_NESTING_DEPTH
- Single responsibility
- Extract at DUPLICATION_THRESHOLD

### TypeScript
- Strict mode always
- No `any` (create types)
- Magic numbers: Extract 2+ (0,1,-1 OK inline, use underscores: 10_000)
- Prefer focused modules: one primary export per file
- JSDoc public classes/methods
- English only
- Branded: `type WalletId = string & { readonly __brand: 'WalletId' }`
- Discriminated unions: `{ status: 'success'; data: T } | { status: 'error'; error: string }`
- Union handling: Prefer exhaustive narrowing (switch + never guard)
- Satisfies: `const config = { ... } satisfies Config`
- Types/Interfaces: Exported types in `*.types.ts` files
- Import: Use `import type` for type-only imports
- Export: Use `export type` for type-only exports
- Prefer const objects over enums
- Path aliases: Use `@/*` pointing to `src/` in tsconfig

### Async
- Default: async/await
- Parallel: Promise.all() (independent) or Promise.allSettled() (partial failures)
- Sequential: for...of (dependent)
- Timeouts: AbortSignal
- Never: async void, forEach with async, unbounded parallelism, no timeout

### Error Handling (React Native / Expo)
- Network errors: show user-facing toast/alert + console.error
- 401 Unauthorized: trigger re-auth flow (redirect to login), not just a toast
- Expected: Result pattern `{ ok: true; value: T } | { ok: false; error: E }`
- Unexpected: Throw exceptions
- Never swallow errors (no empty catch blocks)
- Never log secrets, tokens, passwords
- Validate API response shape before use (Zod or manual check)

### Testing (Expo / Jest)
- Framework: Jest (Expo preset)
- Pattern: AAA
- Test file naming: `[component-name].test.ts` / `[component-name].test.tsx`
- Mock network at boundary (msw or manual mocks)
- Test behavior, not implementation details
- Types: Unit (business logic, hooks), Integration (API modules)

### Code Quality Tools
- ESLint (expo config): `rtk yarn lint`
- TypeScript: `rtk yarn tsc --noEmit`
- Workflow: After edits run `rtk yarn lint`, then `rtk yarn tsc --noEmit` if needed

## Anti-Patterns

- `any` types
- Functions >FUNCTION_MAX_LINES
- Multiple params without RO-RO (>MAX_PARAMS_WITHOUT_RO_RO)
- Nesting >MAX_NESTING_DEPTH
- Duplication >DUPLICATION_THRESHOLD without extraction
- Generic errors (`throw new Error('Failed')`)
- No error context
- async void
- forEach with async
- No timeout on async
- Retry terminal errors (400/401/404)
- Swallowing errors (`catch (err) { }`)
- Logging sensitive data
- Side effects in module imports
- Unbounded parallelism
- Magic numbers/strings without constants
- expo-router imports outside `src/app/`
- Amounts without kopeck conversion

## Token Discipline

- Summarize inputs before planning
- Cache extracted facts; avoid rereading unchanged files
- Prefer referencing constants over repeating values

## Output Expectations

- Updates: concise bullet lists (no post-task summary)
- Reference files/identifiers with backticks
- Call out assumptions, risks, required follow-up
```

- [ ] Проверить:

```bash
ls ai/rules/common/patterns.md
```

---

## Task 8: Написать react.md (адаптирован для React Native)

**Files:**
- Create: `ai/rules/common/react.md`

- [ ] Создать файл:

```markdown
# React / React Native (fin-app-mobile)

Shared rules for React Native + Expo SDK 52. This project uses React 18.

Load order:
- Always: `ai/rules/common/react.md`
- Then: `ai/rules/common/react-18.md` (React 18 addendum)

For project structure and FSD: `ai/rules/projects/fin-app-mobile/architecture.md`.

## Constants

- COMPONENT_MAX_LINES = 150
- HOOK_MAX_LINES = 50
- JSX_MAX_DEPTH = 4
- PROPS_MAX_COUNT = 7

## Requirements

Naming:
- Components: PascalCase
- Hooks: `use` + camelCase
- Functions and variables: camelCase
- Types and interfaces: PascalCase
- Files and directories: kebab-case

Components:
- One component per file
- Use named exports for reusable components and hooks
- Screen route files may use default exports
- Keep components at or under COMPONENT_MAX_LINES
- Keep JSX nesting at or under JSX_MAX_DEPTH
- Keep props at or under PROPS_MAX_COUNT
- For variant-based component APIs, use discriminated union props with required `variant` key
- Prefer composition over prop drilling
- Prefer stable keys

Hooks:
- Keep hooks at or under HOOK_MAX_LINES
- Keep hooks single-purpose
- All business logic goes in co-located hook (`useFooScreen.ts`), not in component JSX

Styling (React Native / NativeWind):
- Use NativeWind `className` prop for ALL layout and visual styles
- Never use inline `style={{}}` for layout (only for computed dynamic values e.g. `style={{ height: animatedValue }}`)
- Never hardcode hex colors — use Tailwind tokens from tailwind.config.js only
- Dark mode: use NativeWind `dark:` prefix
- Do NOT use CSS Modules, :global(), or web CSS-in-JS

State:
- Keep state local and colocated
- Lift state only when ownership is shared
- Prefer derived values over duplicated state
- Server state: TanStack Query v5 (see `ai/rules/projects/fin-app-mobile/state-management.md`)
- UI/local state: Zustand v4 (see `ai/rules/projects/fin-app-mobile/state-management.md`)
- Do NOT use useEffect to sync derived state

Lists:
- Always use FlatList for scrollable lists with more than ~10 items (NOT ScrollView)
- FlatList: always provide `keyExtractor={item => item.id}` — NEVER use array index
- FlatList: consider `getItemLayout` for fixed-height items
- FlatList: consider `initialNumToRender`, `maxToRenderPerBatch` for long lists

Navigation:
- expo-router imports ONLY in `src/app/` directory
- Typed routes: `router.push('/wallets')` with typed Href — not raw string concat
- Never put auth checks in individual screens (auth guard in root `_layout.tsx`)

Platform differences:
- Extract ALL Platform.select blocks to `src/shared/lib/platform.ts`
- Never duplicate Platform.select inline in multiple files

Testing:
- Unit/integration: `@testing-library/react-native`
- Test behavior, not implementation details
- Do NOT use Playwright (web only) — use Detox or Maestro for E2E

Performance:
- Measure before optimizing
- Use FlatList virtualization for long lists (not ScrollView)
- Avoid premature memoization (see react-18.md)
- useCallback for handlers passed as props to child components

## Anti-Patterns

- Default exports for shared components and hooks
- Array index as FlatList key (`keyExtractor={(_, i) => i}`)
- Deriving state with effects when it can be derived in render
- Mixing UI composition and data-access in the same component
- expo-router imports in shared/, entities/, features/
- Inline style={{}} for layout (use NativeWind className)
- Hardcoded hex colors in className or style
- Platform.select duplicated inline across files
- ScrollView for long lists (use FlatList)
- CSS Modules, :global(), web CSS-in-JS
```

- [ ] Проверить:

```bash
ls ai/rules/common/react.md
```

---

## Task 9: Написать git-conventions.md (адаптирован)

**Files:**
- Create: `ai/rules/common/git-conventions.md`

- [ ] Создать файл:

```markdown
# Git Conventions (fin-app-mobile)

Commit messages, branch naming, PR routing, and release conventions.

## Commit Message Format

`type(scope): short description`

Types:
- `feat`: New feature or capability
- `fix`: Bug fix
- `refactor`: Code change (no new feature, no fix)
- `perf`: Performance improvement
- `test`: Add or update tests
- `docs`: Documentation only
- `chore`: Build, CI, tooling, deps
- `style`: Formatting/whitespace (no logic change)
- `ci`: CI/CD pipeline changes
- `build`: Build system or dependency changes
- `revert`: Revert a previous commit

Scope examples:
- Screen/feature: `feat(transactions): add filter by category`
- Bug fix: `fix(wallet-card): kopeck math on zero balance`
- API: `feat(shared-api): add wallet detail endpoint`
- Config/deps: `chore(deps): bump expo to 52.x`

Rules:
- Subject line <= 72 chars, imperative mood, no period
- Explain why in body when needed
- Do NOT use `Co-authored-by:` trailers in commit messages
- One logical change per commit

## Branch Roles

- `main`: Production source of truth; AppStore/PlayStore releases tagged from here
- `develop`: Integration / development branch; equivalent to `develop` in GitFlow
- `release/*`: Release preparation branch, created from `develop`
- `feature/*`: New feature work, created from `develop`
- `fix/*`: Planned (non-incident) bugfix work, created from `develop`
- `hotfix/*`: Production incident fixes, created from `main` or release tag

## PR Routing Rules

- `feature/*`, `fix/*`, `docs/*`, `chore/*`, `refactor/*`, `test/*` → `develop`
- `develop` → `release/*`
- `release/*` → `main`
- `hotfix/*` → `main`, then mandatory back-merge into `develop`

Hotfix is the only normal path that bypasses `release/*` and `develop` before `main`.

Release gates:
- Merge `release/*` into `main` only after EAS Build + manual QA
- After merge to `main`, tag triggers AppStore/PlayStore submission

## Branch Naming

Pattern: `type/short-description`

Examples:
- `feature/wallet-detail-screen`
- `fix/transaction-negative-zero`
- `docs/update-architecture`
- `chore/bump-expo-sdk-52`
- `release/1.1.0`
- `hotfix/1.0.1`

Rules:
- Lowercase kebab-case slug
- Prefer <= 64 chars total
- No Jira ID required (project does not use Jira)
- Keep one feature per branch unless agreed otherwise

## Tags and Releases

- Create release tags only from `main`
- Use SemVer with `v` prefix: `vX.Y.Z`
- Mobile app versioning: also update `version` in `app.json`
- EAS Build: triggered after tag on `main` → submit to AppStore/PlayStore

## Post-Release Sync

- After every release (merge to `main`): back-merge `main` into `develop`
- After every hotfix (merge to `main`): back-merge `main` into `develop`

## Pull Request Rules

Title: conventional style (`type(scope): description`)

Description should include:
- Summary (1-3 bullets)
- Test evidence (manual QA, screenshots if UI changed)
- Breaking changes (if any)
- EAS Build link (if release PR)

## Anti-Patterns

- Direct commits to `main`/`develop` for regular development
- Opening feature PR directly to `main`
- Skipping back-merge to `develop` after hotfix
- Mixing unrelated concerns in one PR
- Force-pushing shared release/develop branches
- Committing generated artifacts (`dist/`, `coverage/`, `.expo/`) or secrets
- Using `Co-authored-by:` trailers in commit messages
```

- [ ] Проверить:

```bash
ls ai/rules/common/git-conventions.md
```

---

## Task 10: Написать commit-message-and-crosslinks.md (адаптирован)

**Files:**
- Create: `ai/rules/common/commit-message-and-crosslinks.md`

- [ ] Создать файл:

```markdown
# Commit Message and Crosslinks (fin-app-mobile)

Commit metadata and cross-reference policy for rules, prompts, and docs.

## Constants

- COMMIT_SUBJECT_MAX_CHARS = 72
- COMMIT_FORBIDDEN_TRAILER = `Co-authored-by:`
- CROSSLINK_INTERNAL_STYLE = repo-root path
- CROSSLINK_RULE_PREFIX = `ai/rules/`
- CROSSLINK_DOCS_PREFIX = `docs/`

## Requirements

Commit messages:
- Use Conventional Commit format from `ai/rules/common/git-conventions.md`
- Keep subject line <= COMMIT_SUBJECT_MAX_CHARS
- Do not include COMMIT_FORBIDDEN_TRAILER in commit body or footers

Crosslinks:
- Use CROSSLINK_INTERNAL_STYLE for internal markdown links
- Link rules with `ai/rules/...` paths (no `./` or `../` for rule links)
- Link docs with `docs/...` paths when referencing repository docs
- Keep references current when files move/rename; remove stale links
- When adding a new rule file, add a discoverable link from:
  - `ai/rules/common/core-rules.md`
  - `ai/rules/AGENTS.md`
  - `CLAUDE.md` (root) when applicable

## Anti-Patterns

- Any `Co-authored-by:` trailer in commit messages
- Relative rule links like `./common/file.md` or `../rules/file.md`
- Orphan rules not referenced by core indexes
- Keeping aliases to deleted/deprecated files without explicit migration intent

## Related Rules

- `ai/rules/common/git-conventions.md`
- `ai/rules/common/core-rules.md`
```

---

## Task 11: Написать performance/_index.md (адаптирован)

**Files:**
- Create: `ai/rules/common/performance/_index.md`

- [ ] Создать файл:

```markdown
# Performance Rules — Decision Tree (fin-app-mobile)

Use this to find the right rule for your problem. Load only the relevant file(s).

**Note:** This is React Native (Expo), not web React. SSR, hydration, and DOM-specific rules do not apply.

| Symptom | Load |
|---------|------|
| API response slow / sequential awaits | `async-waterfalls.md` |
| App starts slowly / heavy root render | `bundle-strategy.md` |
| React component loads blank then fills in | `async-suspense-boundaries.md` |
| Same data fetched by multiple components | `client-swr-dedup.md` |
| UI janky during filtering/search / FlatList scroll lag | `rerender-strategy.md` (useTransition section) |
| Component re-renders too often | `rerender-strategy.md` (memo/deps sections) |
| Derived state synced via useEffect | `rerender-derived-state.md` |
| Falsy value (0, NaN) rendered in JSX | `rendering-conditional-render.md` |
| Static JSX recreated every render | `rendering-hoist-jsx.md` |
| Array.includes in loop / hot path | `js-set-map-lookups.md` |
| Deeply nested if/else | `js-early-exit.md` |

Not applicable in React Native (skip these):
- `rendering-content-visibility.md` — web CSS only
- `rendering-hydration-no-flicker.md` — SSR/hydration (web only)

For full catalog with impact levels, see `_sections.md`.
```

---

## Task 12: Написать skills/react-best-practices.md (адаптирован)

**Files:**
- Create: `ai/rules/common/skills/react-best-practices.md`

- [ ] Создать файл:

```markdown
# Skill: React Native Best Practices (Performance + Component Guidance)

React Native + Expo performance optimization and component structure guide.

## Triggers

- Writing new React Native components or Expo screens
- Reviewing code for performance issues
- Refactoring existing React Native code
- "check performance", "optimize React", "component structure"

## Component Guidance

- Follow `ai/rules/common/react.md` and `ai/rules/common/react-18.md`
- Prefer small, focused components and explicit props
- For variant-driven components, model props as discriminated unions keyed by required `variant`/`kind`
- Keep state management minimal and colocated
- All business logic in co-located hook (`useFooScreen.ts`), not in component JSX
- Align file naming and folder structure with FSD (`ai/rules/projects/fin-app-mobile/architecture.md`)

## Performance Rules by Priority

| Priority | Category | Impact | Rule File |
|----------|----------|--------|-----------|
| 1 | Eliminating Waterfalls | CRITICAL | `async-waterfalls.md`, `async-suspense-boundaries.md` |
| 2 | FlatList / Long Lists | CRITICAL | `rerender-strategy.md` (virtualization section) |
| 3 | Client-Side Data | MEDIUM-HIGH | `client-swr-dedup.md` (TanStack Query dedup) |
| 4 | Re-render Prevention | MEDIUM | `rerender-strategy.md`, `rerender-derived-state.md` |
| 5 | Rendering | MEDIUM | `rendering-conditional-render.md`, `rendering-hoist-jsx.md` |
| 6 | JavaScript | LOW-MEDIUM | `js-set-map-lookups.md`, `js-early-exit.md` |

**NOT applicable in React Native (skip):**
- `bundle-strategy.md` Priority 2 — Metro bundler replaces webpack; apply Metro-specific splits only
- `rendering-content-visibility.md` — web CSS, not available in RN
- `rendering-hydration-no-flicker.md` — SSR/hydration is web-only

## Process

1. Identify performance issue category (see `ai/rules/common/performance/_index.md` for symptom-based routing)
2. Load relevant rule file(s) from `ai/rules/common/performance/`
3. Check code against rules in priority order
4. Apply fixes following correct patterns
5. Run post-code workflow (`ai/rules/common/post-code-workflow.md`)

## React Native Specific Checks

Always verify:
- FlatList has `keyExtractor={item => item.id}` (never index)
- Handlers passed as props wrapped in `useCallback`
- No inline object/array creation in JSX (`style={{ color: 'red' }}` → extract)
- No `Platform.select` duplicated inline — extract to `shared/lib/platform.ts`
- NativeWind `className` arrays not computed inline every render

## Output

- Issues found with rule file reference
- Code changes following correct patterns
- Verification that changes don't break functionality

## References

- Decision tree: `ai/rules/common/performance/_index.md`
- Section catalog: `ai/rules/common/performance/_sections.md`
- Individual rules: `ai/rules/common/performance/*.md`
- Project architecture: `ai/rules/projects/fin-app-mobile/architecture.md`
```

---

## Task 13: Написать skills/git-branch-kickoff.md (адаптирован)

**Files:**
- Create: `ai/rules/common/skills/git-branch-kickoff.md`

- [ ] Создать файл:

```markdown
# Skill: Git Branch Kickoff (fin-app-mobile)

Use when starting a new task: creating feature, fix, or other work branches.

## Triggers

- User asks to start a new task or feature
- User asks to create a branch
- User says "start task", "create branch", "new feature branch"

## Process

1. Determine branch type from task context:
   - New feature or capability → `feature/*`
   - Planned bugfix (non-incident) → `fix/*`
   - Documentation-only → `docs/*`
   - Tooling / CI / deps → `chore/*`
   - Refactoring → `refactor/*`
   - Tests-only → `test/*`
2. Choose the correct base branch:
   - If an active `release/*` branch exists **and** the task targets that release → branch from **`release/<version>`**
   - If no active release or the task is for the next cycle → branch from **`develop`**
   - `hotfix/*` → branch from **`main`** (use git-hotfix-flow skill instead)
3. Create the branch:

```bash
git switch develop
git pull --ff-only
git switch -c <type>/<short-description>
```

4. Verify naming rules (from `ai/rules/common/git-conventions.md`):
   - Pattern: `type/short-description` (no Jira ID required)
   - Lowercase kebab-case slug
   - Prefer <= 64 chars total

## Branch naming examples

- `feature/wallet-detail-screen`
- `fix/transaction-negative-zero`
- `docs/update-architecture`
- `chore/bump-expo-sdk-52`
- `refactor/extract-kopeck-utils`
- `test/add-wallet-hook-tests`

## Anti-patterns

- Branching from `main` for regular development (only `hotfix/*` branches from `main`)
- Branching from `develop` when an active `release/*` exists and the task targets that release
- Forgetting `git pull --ff-only` before branching (stale base)
- Mixing multiple features in one branch
- Using non-standard prefixes outside the typed set

## Output

- Branch created and checked out locally
- Report branch name and base branch used
```

---

## Task 14: Написать skills/git-release-flow.md (адаптирован)

**Files:**
- Create: `ai/rules/common/skills/git-release-flow.md`

- [ ] Создать файл:

```markdown
# Skill: Git Release Flow (fin-app-mobile)

Use when preparing, executing, or completing a release cycle.

## Triggers

- User asks to create a release branch
- User asks to prepare a release
- User says "start release", "release 1.2.0", "create release branch"

## Process

### Phase 1: Create release branch

1. Confirm the release version (e.g. `1.2.0`). If not provided, check recent tags.
2. Create release branch from **`develop`**:

```bash
git switch develop
git pull --ff-only
git switch -c release/<version>
```

3. Update `app.json` version field to match release version
4. Verify naming: `release/X.Y.Z`

### Phase 2: Collect features

- Ready `feature/*` and `fix/*` branches merge into `develop` via PRs
- Each PR must pass lint and TypeScript check
- After merging to `develop`, open PR `develop → release/*`

### Phase 3: QA and EAS Build

1. Trigger EAS Build for the release:

```bash
rtk npx eas build --profile production --platform all
```

2. Download build artifacts from EAS dashboard
3. Run manual QA on physical device / simulator
4. Quality gates:
   - All lint checks pass
   - TypeScript check passes
   - Manual QA signed off

### Phase 4: Promote to main

1. After successful QA, open PR `release/* → main`
2. Quality gates for PR:
   - EAS Build link attached
   - QA result noted
3. Merge to `main`

### Phase 5: Tag and submit

1. Create release tag on `main`:

```bash
git switch main
git pull --ff-only
git tag v<version>
rtk git push origin v<version>
```

2. Trigger EAS Submit for AppStore/PlayStore:

```bash
rtk npx eas submit --platform all --latest
```

### Phase 6: Post-release sync

1. Back-merge `main` into `develop`:

```bash
git switch develop
git pull --ff-only
git merge main
rtk git push
```

2. Verify `develop` and `main` are in sync

## PR routing summary

```
feature/*, fix/* → develop
develop           → release/*
release/*         → main
```

## Anti-patterns

- Creating `release/*` from `main` instead of `develop`
- Skipping post-release back-merge `main` → `develop`
- Merging to `main` without EAS Build QA
- Creating tags without actual release intent

## Output

- Release branch created, or release cycle advanced to next phase
- Report current phase, branch state, and next action
```

---

## Task 15: Написать skills/git-hotfix-flow.md (адаптирован)

**Files:**
- Create: `ai/rules/common/skills/git-hotfix-flow.md`

- [ ] Создать файл:

```markdown
# Skill: Git Hotfix Flow (fin-app-mobile)

Use when handling urgent production incident fixes that bypass the normal release cycle.

## Triggers

- User reports a production crash or critical bug
- User says "hotfix", "urgent prod fix", "production bug"

## When to use hotfix vs fix

- **`hotfix/*`**: Production is broken or degraded RIGHT NOW. Bypasses `release/*` and `develop`, goes straight to `main`.
- **`fix/*`**: Planned bugfix, not urgent. Follows normal flow: branch from `develop` → PR to `develop` → release cycle.

## Process

### Phase 1: Create hotfix branch

1. Create hotfix branch from **`main`**:

```bash
git switch main
git pull --ff-only
git switch -c hotfix/<version>
```

Example names: `hotfix/1.0.1`, `hotfix/crash-auth-token`

### Phase 2: Implement and validate

1. Implement the minimal fix (smallest possible change)
2. Run mandatory checks:

```bash
rtk yarn lint
rtk yarn tsc --noEmit
```

3. Commit with conventional format: `fix(scope): description`

### Phase 3: EAS Build hotfix

1. Trigger EAS Build for hotfix:

```bash
rtk npx eas build --profile production --platform all
```

2. Test on device — verify fix resolves the incident

### Phase 4: Merge to main

1. Push hotfix branch and create PR `hotfix/* → main`
2. Quality gates:
   - Fix is minimal and targeted
   - Lint and TypeScript pass
   - EAS Build confirmed working
3. Merge to `main`

### Phase 5: Tag and submit

1. Create next patch release tag:

```bash
git switch main
git pull --ff-only
git tag v<X.Y.Z+1>
rtk git push origin v<X.Y.Z+1>
```

2. Submit to AppStore/PlayStore:

```bash
rtk npx eas submit --platform all --latest
```

### Phase 6: Mandatory back-merge

**This step is NOT optional.** Skipping it causes `develop` to diverge from `main`.

```bash
git switch develop
git pull --ff-only
git merge main
rtk git push
```

## PR routing summary

```
hotfix/* → main (bypasses release/* and develop)
main     → develop (mandatory back-merge)
```

## Anti-patterns

- Using `hotfix/*` for non-urgent bugs (use `fix/*` instead)
- Branching hotfix from `develop` instead of `main`
- Skipping the back-merge to `develop` after hotfix
- Making large changes in a hotfix (keep it minimal)
- Forgetting to create a release tag and EAS Submit

## Output

- Hotfix branch created, or hotfix cycle advanced to next phase
- Report current phase, branch state, and next action
- Explicitly remind about mandatory back-merge to `develop`
```

---

## Task 16: Написать architecture.md (новый SSoT)

**Files:**
- Create: `ai/rules/projects/fin-app-mobile/architecture.md`

- [ ] Создать файл:

```markdown
# fin-app-mobile Architecture

React Native mobile app for personal finance management.
Part of FinApp monorepo (alongside fin-app-backend, fin-app-frontend).

## Tech Stack (pinned versions)

| Library | Version | Purpose |
|---------|---------|---------|
| Expo SDK | 52.x | React Native platform |
| React Native | 0.76.x | UI framework |
| NativeWind | 4.x | Tailwind CSS for RN |
| TanStack Query | 5.x | Server state management |
| Expo Router | 3.x | File-based routing (app/ dir) |
| TypeScript | 5.x | Type safety (strict mode) |
| Zustand | 4.x | UI/local state |
| Axios | 1.x | HTTP client (only in shared/api/) |
| EAS Build | latest | CI/CD — iOS + Android builds |

## Dependency Constraints (CRITICAL — do not violate)

NEVER upgrade without checking Expo SDK 52 compatibility matrix:
- expo-router MUST stay at v3 — v4 requires Expo SDK 53+
- NativeWind v4 requires `class-variance-authority` as peer dep
- React Native 0.76 uses new architecture (Fabric) — check lib support before installing
- TanStack Query v5 has breaking API changes from v4 — always use v5 API
- Expo SDK 52 bundles React 18 — do NOT install React 19 manually
- axios v1.x — do not use fetch API directly in shared/api/

Before installing ANY new library:
1. Check expo.fyi/packages for SDK 52 compatibility
2. Check library's React Native new architecture support (0.76)
3. Check peer dependencies (especially NativeWind + class-variance-authority)

## Project Structure (FSD)

```
src/
├── app/                    # Expo Router routes (ONLY place for expo-router imports)
│   ├── _layout.tsx         # Root layout — providers, auth guard (useSegments + useRouter)
│   ├── (tabs)/
│   │   ├── _layout.tsx     # Tab navigator
│   │   ├── index.tsx       # Transactions tab (default)
│   │   └── wallets.tsx     # Wallets tab
│   ├── transaction/
│   │   └── [id].tsx        # Transaction detail (dynamic route)
│   ├── wallet/
│   │   └── [id].tsx        # Wallet detail
│   └── +not-found.tsx
├── features/               # Feature slices (TransactionList, WalletCard, etc.)
├── entities/               # Business entities (transaction, wallet, category)
├── shared/
│   ├── api/                # ONLY place for HTTP calls (Axios modules)
│   ├── ui/                 # Primitive UI kit (Button, Card, Badge, Input)
│   ├── constants/          # Query keys, config constants
│   └── lib/                # Providers, Zustand stores, utils, platform.ts
└── components/             # Larger shared composites
```

## FSD Layer Rules

Import direction: app → features → entities → shared

FORBIDDEN cross-layer imports:
- shared → features (NEVER)
- entities → features (NEVER)
- features → app (NEVER)
- expo-router in shared/, entities/, features/ (NEVER — only in app/)

## Screen & Component Structure

Every screen/component in its own folder:
- `features/WalletList/WalletList.tsx` — component (max 150 lines)
- `features/WalletList/useWalletList.ts` — all logic in co-located hook (max 50 lines)
- `features/WalletList/WalletList.styles.ts` — styles if using StyleSheet

## Navigation (Expo Router v3)

- Typed routes only: `router.push('/wallets')` with typed Href
- `useLocalSearchParams<{ id: string }>()` for route params
- `<Link href="/wallets">` for declarative navigation in JSX
- Stack options: `<Stack.Screen options={{ title: '...' }} />` inside screen
- Modal screens: `<Stack.Screen options={{ presentation: 'modal' }} />`
- Auth guard in root `_layout.tsx` ONLY (useSegments + useRouter) — NEVER in individual screens
- Deep links scheme: "finapp" (configured in app.json)
- Test deep links: `npx uri-scheme open finapp://wallets --ios`

## Styling

- NativeWind v4 `className` for ALL layout and visual styles
- NEVER use inline `style={{}}` for layout
- ONLY use inline `style={{}}` for computed dynamic values (e.g. `style={{ width: animatedValue }}`)
- NEVER hardcode hex colors — use Tailwind tokens from tailwind.config.js
- Dark mode: use NativeWind `dark:` prefix
- No CSS Modules, :global(), CSS-in-JS

## Currency and Amounts

- Currency: UAH, locale: uk-UA
- API stores amounts in kopecks (integers)
- Load: `const displayAmount = apiAmount / 100`
- Submit: `const apiAmount = Math.round(displayAmount * 100)`
- ALWAYS validate before sign flip: `if (!amount) return` — prevents -0
- Format: `amount.toLocaleString('uk-UA', { style: 'currency', currency: 'UAH' })`

## Dates

- Display: `date.toLocaleDateString('uk-UA')`
- API: ISO 8601 strings

## Platform Differences

- Extract ALL Platform.select blocks to `src/shared/lib/platform.ts`
- NEVER duplicate Platform.select inline in multiple files

## Commands

| Task | Command |
|------|---------|
| Dev server | `rtk npx expo start` |
| Dev server (clear cache) | `rtk npx expo start --clear` |
| Lint | `rtk yarn lint` |
| TypeCheck | `rtk yarn tsc --noEmit` |
| EAS Build (dev) | `rtk npx eas build --profile development` |
| EAS Build (prod) | `rtk npx eas build --profile production` |
| EAS Submit | `rtk npx eas submit --platform all --latest` |
```

---

## Task 17: Написать state-management.md (новый SSoT)

**Files:**
- Create: `ai/rules/projects/fin-app-mobile/state-management.md`

- [ ] Создать файл:

```markdown
# State Management (fin-app-mobile)

## Architecture Decision

- Server state: TanStack Query v5 (useQuery, useMutation, queryClient)
- UI/local state: Zustand v4
- HTTP layer: Axios (ONLY in `src/shared/api/`)

## REST (Axios)

- `apiClient` ONLY from `src/shared/api/base.ts` — NEVER create new axios instances
- NEVER call axios directly in screens, components, or hooks
- HTTP calls defined ONLY in `src/shared/api/*.ts` modules — export functions, not instance
- apiClient config: baseURL from `EXPO_PUBLIC_API_URL`, auth header, timeout

```typescript
// src/shared/api/base.ts
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10_000,
})
```

## TanStack Query v5 (BREAKING CHANGES from v4)

v5 API — use this, NOT v4 patterns:
- `useQuery({ queryKey, queryFn })` — NOT `useQuery(key, fn)`
- `useMutation({ mutationFn })` — NOT `useMutation(fn)`
- Destructure from result: `const { data, isLoading, isError } = useQuery(...)`
- `onSuccess`/`onError` in `useQuery` REMOVED in v5 — use `useEffect` or mutation callbacks
- `queryClient.invalidateQueries({ queryKey: [...] })` — NOT `invalidateQueries(key)`

Rules:
- Use for ALL server state (lists, detail views, paginated data, mutations)
- EVERY mutation MUST call `queryClient.invalidateQueries({ queryKey: QUERY_KEYS.entity.all })` on success
- Query keys: typed constants ONLY (QUERY_KEYS.wallets.all NOT ['wallets'])
- `enabled` flag for conditional queries (data not ready yet)
- `staleTime`: set explicitly for each query (default 0 causes unnecessary refetches)
- Optimistic updates: only when UX strongly demands, not by default

```typescript
// src/shared/constants/query-keys.ts
export const QUERY_KEYS = {
  wallets: {
    all: ['wallets'] as const,
    detail: (id: string) => ['wallets', id] as const,
  },
  transactions: {
    all: ['transactions'] as const,
    byWallet: (walletId: string) => ['transactions', walletId] as const,
    detail: (id: string) => ['transactions', id] as const,
  },
} as const
```

## Zustand v4

- UI state and offline/local data ONLY — NEVER server data
- One store per feature domain: `walletsUiStore`, `transactionFiltersStore`
- Keep stores flat (no deep nesting)
- Persistence: expo-secure-store for sensitive data, AsyncStorage for preferences
- NEVER put API response data directly into Zustand (that's React Query's job)

## Error Handling

- Network errors: show user-facing message via toast/alert + `console.error`
- 401 Unauthorized: trigger re-authentication flow, not just a toast
- NEVER swallow errors (no empty catch blocks)
- Validate API response shape before use

```typescript
// Axios interceptor for 401
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // trigger re-auth, not just toast
      authStore.getState().logout()
    }
    return Promise.reject(error)
  }
)
```

## Anti-Patterns

- Calling axios in components or hooks outside shared/api/
- Creating new axios instances (not using apiClient)
- Using v4 TanStack Query API in v5 project
- Mutation without queryClient.invalidateQueries
- Raw string query keys (['wallets'] instead of QUERY_KEYS.wallets.all)
- Server data in Zustand stores
- Empty catch blocks
- 401 handled with only a toast
```

---

## Task 18: Написать CLAUDE.md (корень проекта)

**Files:**
- Create: `CLAUDE.md`

- [ ] Создать файл `CLAUDE.md` в корне проекта:

```markdown
# CLAUDE.md — fin-app-mobile

React Native + Expo SDK 52 personal finance mobile app.
Part of FinApp monorepo (alongside fin-app-backend, fin-app-frontend).

Use rules by task, not all at once. Load with `@path/to/file`.
SSoT for all rules: `ai/rules/` | Full index: `.claude/AGENTS.md`

## Core Rules

Load `ai/rules/common/core-rules.md` for task-to-file mapping.

## Task Routing (load ONLY what applies)

| Task | Load |
|------|------|
| New screen / component / hook | `@ai/rules/projects/fin-app-mobile/architecture.md` |
| API integration / React Query / Zustand | `@ai/rules/projects/fin-app-mobile/state-management.md` |
| Navigation / routing / deep links | `@ai/rules/projects/fin-app-mobile/architecture.md` |
| React patterns / component rules | `@ai/rules/common/react.md` |
| TypeScript / async / error patterns | `@ai/rules/common/patterns.md` |
| Post-code QA | `@ai/rules/common/post-code-workflow.md` |
| Implementation planning | `@ai/rules/common/implementation-plans.md` |
| Plan audit | `@ai/rules/common/skills/plan-audit.md` |
| React / RN performance | `@ai/rules/common/performance/_index.md` |
| Git commit | `@ai/rules/common/git-conventions.md` |
| Branch kickoff | `@ai/rules/common/skills/git-branch-kickoff.md` |
| Release / EAS Build | `@ai/rules/common/skills/git-release-flow.md` |
| Hotfix | `@ai/rules/common/skills/git-hotfix-flow.md` |
| Token economy | `@ai/rules/common/token-economy.md` |
| Model selection | `@ai/rules/common/ai-models.md` |
| Full context | `@.claude/AGENTS.md` |

## Dependency Constraints (CRITICAL)

| Library | Version | Notes |
|---------|---------|-------|
| Expo SDK | 52.x | Ecosystem anchor — everything must be SDK 52 compatible |
| React Native | 0.76.x | New architecture (Fabric) — check lib support |
| NativeWind | 4.x | NOT v2/v3 API — v4 uses Tailwind CSS config |
| TanStack Query | 5.x | NOT v4 API — breaking changes in useQuery/useMutation |
| Expo Router | 3.x | NOT v4 — requires SDK 53+ |
| TypeScript | 5.x | Strict mode required |
| Zustand | 4.x | Flat stores only |
| Axios | 1.x | Only in src/shared/api/ |

Before installing ANY new dependency:
1. Check expo.fyi/packages for Expo SDK 52 compatibility
2. Check React Native new architecture support (0.76)
3. Check peer dependencies (especially NativeWind)

## Skills

| Skill | Purpose |
|-------|---------|
| /post-code | Post-code QA: lint + tsc |
| /commit | Generate conventional commit |
| /start-task | Create work branch |
| /lint | Run ESLint |
| /implement-plan-step | Execute plan phase by phase |
| /audit-plan | Verify implementation plan |
| /audit-security | Security review |
| /review-react-perf | React Native performance review |
| /ui-ux-pro-max | UI/UX design intelligence |

## Agents

| Agent | When to Use |
|-------|------------|
| finapp-mobile-expert | All development: screens, hooks, API, navigation, styling, bugs, TypeScript |
| code-reviewer | Code review after implementation complete |
| screen-designer | HTML screen prototypes in designs/screens/ |
| codebase-researcher | Read-only: find files, trace patterns, map dependencies |
| plan-auditor | Verify implementation plans (pre/post) |
| react-performance-reviewer | React Native performance review |

## Post-Code (MANDATORY after every code change)

1. `rtk yarn lint` — fix ALL errors before proceeding
2. `rtk yarn tsc --noEmit` — if TypeScript errors suspected

Never commit code that fails lint.

## Hooks

PostToolUse hooks in `.claude/settings.local.json` remind about post-code after Write/Edit.
```

- [ ] Проверить:

```bash
ls CLAUDE.md
```

---

## Task 19: Написать .claude/AGENTS.md (compiled index)

**Files:**
- Create: `.claude/AGENTS.md`

- [ ] Создать файл:

```markdown
# AGENTS.md — fin-app-mobile AI System Index

Project: fin-app-mobile (React Native + Expo SDK 52, FSD architecture).
SSoT: `ai/rules/` | Entry point: `CLAUDE.md` (root) | Core routing: `ai/rules/common/core-rules.md`

## Agents

| Agent | When to Use | Model |
|-------|-------------|-------|
| finapp-mobile-expert | All dev: screens, hooks, API, nav, styling, bug fixes, TypeScript | sonnet |
| code-reviewer | Code review after implementation | sonnet |
| screen-designer | HTML screen prototypes in designs/screens/ | sonnet |
| codebase-researcher | Read-only: find files, trace patterns, map dependencies | sonnet |
| plan-auditor | Verify implementation plans (pre/post) | opus |
| react-performance-reviewer | React Native performance issues in components/hooks | opus |

## Rules Index

### Project-specific (load first for mobile tasks)

- `ai/rules/projects/fin-app-mobile/architecture.md` — tech stack, FSD structure, navigation, styling, dependency constraints
- `ai/rules/projects/fin-app-mobile/state-management.md` — Axios, TanStack Query v5, Zustand, error handling

### Common (load by task)

- `ai/rules/common/core-rules.md` — task-to-file routing, quick reference
- `ai/rules/common/patterns.md` — TypeScript, error handling, async patterns
- `ai/rules/common/react.md` — React Native component rules
- `ai/rules/common/react-18.md` — React 18 specific patterns
- `ai/rules/common/post-code-workflow.md` — QA: lint + tsc
- `ai/rules/common/git-conventions.md` — commit format, branch naming
- `ai/rules/common/commit-message-and-crosslinks.md` — commit policy, crosslinks
- `ai/rules/common/implementation-plans.md` — plan lifecycle
- `ai/rules/common/token-economy.md` — context loading strategy
- `ai/rules/common/ai-models.md` — model tier selection

### Common Skills (load by task)

- `ai/rules/common/skills/react-best-practices.md` — React Native performance + component guidance
- `ai/rules/common/skills/plan-audit.md` — plan completeness audit
- `ai/rules/common/skills/agent-team-quality-gates.md` — multi-agent quality gates
- `ai/rules/common/skills/feature-bug-phase-profiles.md` — feature vs bug depth
- `ai/rules/common/skills/git-branch-kickoff.md` — branch creation workflow
- `ai/rules/common/skills/git-release-flow.md` — release + EAS Build
- `ai/rules/common/skills/git-hotfix-flow.md` — hotfix workflow

### Performance Rules (load via _index.md by symptom)

- `ai/rules/common/performance/_index.md` — decision tree (symptom → rule file)
- `ai/rules/common/performance/rerender-strategy.md` — memo, useCallback, useTransition, FlatList
- `ai/rules/common/performance/rerender-derived-state.md` — derive in render, not useEffect
- `ai/rules/common/performance/async-waterfalls.md` — Promise.all, parallel fetching
- `ai/rules/common/performance/client-swr-dedup.md` — TanStack Query deduplication
- `ai/rules/common/performance/rendering-conditional-render.md` — falsy 0/NaN in JSX
- `ai/rules/common/performance/rendering-hoist-jsx.md` — static JSX outside render

### Path-Gated Stubs (auto-loaded by file context)

- `.claude/rules/api.md` → `src/**/*.ts`, `src/**/*.tsx` → points to state-management.md
- `.claude/rules/screens.md` → `src/**/*.tsx` → points to architecture.md + react.md
- `.claude/rules/navigation.md` → `src/app/**` → points to architecture.md
- `.claude/rules/post-code.md` → `src/**/*.ts`, `src/**/*.tsx` → points to post-code-workflow.md
- `.claude/rules/design-system.md` → `designs/**/*.html` → CSS design tokens (self-contained)
- `.claude/rules/charts.md` → `designs/**/*.html` → Chart.js for prototypes (self-contained)

## Skills

| Skill | Purpose | Model |
|-------|---------|-------|
| /post-code | QA after code changes (lint + tsc) | sonnet |
| /commit | Generate conventional commit | sonnet |
| /start-task | Create work branch | sonnet |
| /lint | Run ESLint | haiku |
| /implement-plan-step | Execute plan phase by phase | inherit |
| /audit-plan | Verify implementation plan | inherit |
| /audit-security | Security review | inherit |
| /review-react-perf | React Native performance review | opus |
| /ui-ux-pro-max | UI/UX design intelligence | inherit |

## Prompts (Playbooks)

- `ai/prompts/mobile-feature.md` — new screen/feature workflow
- `ai/prompts/mobile-bug.md` — bug debugging workflow
- `ai/prompts/mobile-design.md` — screen design workflow
- `ai/prompts/mobile-api.md` — API integration workflow
- `ai/prompts/mobile-review.md` — code review workflow
```

---

## Task 20: Написать ai/rules/AGENTS.md

**Files:**
- Create: `ai/rules/AGENTS.md`

- [ ] Создать файл (краткий compiled index всех правил):

```markdown
# AI Rules Index — fin-app-mobile

Full index of all rule files. For session index, see `.claude/AGENTS.md`.

## Core Entry Points

- `ai/rules/common/core-rules.md` — task-to-file routing, quick reference
- `CLAUDE.md` (root) — entry point, routing table, dependency constraints

## Project Rules

- `ai/rules/projects/fin-app-mobile/architecture.md` — tech stack, FSD, navigation, styling, dependency constraints
- `ai/rules/projects/fin-app-mobile/state-management.md` — Axios, TanStack Query v5, Zustand

## Common Rules

- `ai/rules/common/patterns.md` — TypeScript, async, error handling
- `ai/rules/common/react.md` — React Native component rules
- `ai/rules/common/react-18.md` — React 18 addendum
- `ai/rules/common/git-conventions.md` — commit messages, branch naming, PR routing
- `ai/rules/common/commit-message-and-crosslinks.md` — commit policy, crosslinks
- `ai/rules/common/post-code-workflow.md` — mandatory QA: lint + tsc
- `ai/rules/common/token-economy.md` — context loading strategy, file loading rules
- `ai/rules/common/ai-models.md` — model tier selection (haiku/sonnet/opus)
- `ai/rules/common/implementation-plans.md` — plan lifecycle and structure

## Performance Rules

- `ai/rules/common/performance/_index.md` — symptom → rule file routing
- `ai/rules/common/performance/_sections.md` — full catalog with impact levels
- `ai/rules/common/performance/async-waterfalls.md`
- `ai/rules/common/performance/async-suspense-boundaries.md`
- `ai/rules/common/performance/bundle-strategy.md`
- `ai/rules/common/performance/client-swr-dedup.md`
- `ai/rules/common/performance/js-early-exit.md`
- `ai/rules/common/performance/js-set-map-lookups.md`
- `ai/rules/common/performance/rendering-conditional-render.md`
- `ai/rules/common/performance/rendering-hoist-jsx.md`
- `ai/rules/common/performance/rerender-derived-state.md`
- `ai/rules/common/performance/rerender-strategy.md`

Not applicable in React Native (web only):
- `ai/rules/common/performance/rendering-content-visibility.md`
- `ai/rules/common/performance/rendering-hydration-no-flicker.md`

## Skills

- `ai/rules/common/skills/react-best-practices.md` — React Native performance + component guidance
- `ai/rules/common/skills/plan-audit.md` — plan completeness audit
- `ai/rules/common/skills/agent-team-quality-gates.md` — multi-agent quality gates
- `ai/rules/common/skills/feature-bug-phase-profiles.md` — feature vs bug depth
- `ai/rules/common/skills/git-branch-kickoff.md` — branch creation workflow
- `ai/rules/common/skills/git-release-flow.md` — release + EAS Build workflow
- `ai/rules/common/skills/git-hotfix-flow.md` — hotfix workflow
```

---

## Task 21: Преобразовать .claude/rules/ в path-gated stubs

**Files:**
- Modify: `.claude/rules/api.md`
- Modify: `.claude/rules/screens.md`
- Modify: `.claude/rules/navigation.md`
- Modify: `.claude/rules/post-code.md`
- Modify: `.claude/rules/design-system.md`
- Modify: `.claude/rules/charts.md`

- [ ] Заменить `.claude/rules/api.md` на path-gated stub:

```yaml
---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

Source of truth for API, React Query, Zustand:
`ai/rules/projects/fin-app-mobile/state-management.md`
```

- [ ] Заменить `.claude/rules/screens.md` на path-gated stub:

```yaml
---
paths:
  - "src/**/*.tsx"
  - "src/**/*.jsx"
---

Source of truth for screen/component structure:
- Component and hook rules: `ai/rules/common/react.md`
- FSD structure, styling, NativeWind: `ai/rules/projects/fin-app-mobile/architecture.md`
```

- [ ] Заменить `.claude/rules/navigation.md` на path-gated stub:

```yaml
---
paths:
  - "src/app/**"
  - "**/*_layout.tsx"
---

Source of truth for Expo Router v3 navigation:
`ai/rules/projects/fin-app-mobile/architecture.md` (Navigation section)
```

- [ ] Заменить `.claude/rules/post-code.md` на path-gated stub:

```yaml
---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

Source of truth for post-code QA workflow:
`ai/rules/common/post-code-workflow.md`

Quick reminder:
1. `rtk yarn lint` — fix ALL errors first
2. `rtk yarn tsc --noEmit` — if TypeScript errors suspected
```

- [ ] Добавить frontmatter к `.claude/rules/design-system.md` (добавить в начало файла перед существующим контентом):

```yaml
---
paths:
  - "designs/**/*.html"
---
```

- [ ] Добавить frontmatter к `.claude/rules/charts.md` (добавить в начало файла перед существующим контентом):

```yaml
---
paths:
  - "designs/**/*.html"
---
```

- [ ] Проверить что файлы начинаются с frontmatter:

```bash
head -5 .claude/rules/api.md
head -5 .claude/rules/screens.md
head -5 .claude/rules/design-system.md
```

Expected: каждый файл начинается с `---`

---

## Task 22: Написать SKILL.md (commit, lint, post-code, start-task)

**Files:**
- Create: `.claude/skills/commit/SKILL.md`
- Create: `.claude/skills/lint/SKILL.md`
- Create: `.claude/skills/post-code/SKILL.md`
- Create: `.claude/skills/start-task/SKILL.md`

- [ ] Создать `.claude/skills/commit/SKILL.md`:

```yaml
---
name: commit
description: Generate a conventional commit from staged changes
model: sonnet
---

# /commit

Generate a conventional commit.

## Instructions

1. Run `rtk git status` and `rtk git diff --cached`
2. If nothing staged, check `rtk git diff` and suggest what to stage
3. Determine type and scope from changed files:
   - Screen/feature → scope is feature name (e.g. `wallet-detail`)
   - Shared API → scope is `shared-api`
   - Navigation → scope is `navigation`
   - Config/deps → scope is `deps` or `config`
4. Follow `ai/rules/common/git-conventions.md` and `ai/rules/common/commit-message-and-crosslinks.md`:
   - Subject: `type(scope): imperative description` (max 72 chars)
   - Body: optional, explain why not what
   - Do NOT include `Co-authored-by:` trailers
5. Present message for confirmation before committing
6. Run `rtk git commit -m "message"` after approval
```

- [ ] Создать `.claude/skills/lint/SKILL.md`:

```yaml
---
name: lint
description: Run ESLint for fin-app-mobile
model: haiku
---

# /lint

Run ESLint for the project.

## Instructions

1. Run: `rtk yarn lint`
2. If errors found: attempt `rtk yarn lint --fix` for auto-fixable
3. Re-run after fix to confirm resolution
4. Report remaining manual fixes with file paths and rule names
```

- [ ] Создать `.claude/skills/post-code/SKILL.md`:

```yaml
---
name: post-code
description: Run mandatory post-code QA workflow (lint + optional tsc)
model: sonnet
---

# /post-code

Run mandatory post-code checks after any code change.

## Instructions

Follow `ai/rules/common/post-code-workflow.md`:
1. `rtk yarn lint` — fix ALL errors before proceeding
2. `rtk yarn tsc --noEmit` — run if TypeScript errors suspected

Stop on first failure. Fix before continuing.
Report failures first, then clean steps.
Never mark task complete if lint fails.
```

- [ ] Создать `.claude/skills/start-task/SKILL.md`:

```yaml
---
name: start-task
description: Create a correctly named work branch for a task
model: sonnet
---

# /start-task

Create a work branch for a new task.

## Instructions

Follow `ai/rules/common/skills/git-branch-kickoff.md`:
1. Determine branch type from task description:
   - New screen/feature → `feature/*`
   - Bug fix → `fix/*`
   - Documentation → `docs/*`
   - Tooling/deps → `chore/*`
   - Refactoring → `refactor/*`
2. Choose base branch:
   - Most work → `develop`
   - Targeting active release → `release/<version>`
   - Hotfix → `main` (use /hotfix workflow instead)
3. Create:
   ```bash
   rtk git switch develop && rtk git pull --ff-only && rtk git switch -c type/short-description
   ```
4. Naming: lowercase kebab-case, <= 64 chars, no Jira ID required
   - `feature/wallet-detail-screen`
   - `fix/transaction-negative-zero`
```

---

## Task 23: Написать SKILL.md (implement-plan-step, audit-plan, audit-security, review-react-perf)

**Files:**
- Create: `.claude/skills/implement-plan-step/SKILL.md`
- Create: `.claude/skills/audit-plan/SKILL.md`
- Create: `.claude/skills/audit-security/SKILL.md`
- Create: `.claude/skills/review-react-perf/SKILL.md`

- [ ] Создать `.claude/skills/implement-plan-step/SKILL.md`:

```yaml
---
name: implement-plan-step
description: Execute implementation plans one phase at a time with status tracking and user approval
model: inherit
---

# /implement-plan-step

Execute implementation plans one phase at a time.

## Instructions

Follow `ai/rules/common/implementation-plans.md`:
1. Read plan index file, identify current pending phase
2. Load ONLY: plan index + active phase file + required rule files for that phase
3. Implement scope from active phase checklist
4. Run post-code workflow after implementation: `rtk yarn lint && rtk yarn tsc --noEmit`
5. Self-audit: re-read scope, compare against acceptance criteria
6. Mark phase done with evidence note
7. Present results, wait for user approval before next phase

Never implement multiple phases in one cycle.
Never skip user gate even when asked to implement the whole plan.
```

- [ ] Создать `.claude/skills/audit-plan/SKILL.md`:

```yaml
---
name: audit-plan
description: Audit an implementation plan for completeness, risks, and plan-to-code drift
model: inherit
---

# /audit-plan

Audit an implementation plan.

## Instructions

Follow `ai/rules/common/skills/plan-audit.md`:
1. Read the plan file(s) provided
2. Check for: missing steps, ambiguous scope, stale file references, missing verification commands
3. For post-implementation audit: check plan steps against actual code changes (read relevant files)
4. Report findings with severity: CRITICAL / HIGH / MEDIUM / LOW
5. Do NOT modify any files — report only

Output: structured report with findings and recommended fixes.
```

- [ ] Создать `.claude/skills/audit-security/SKILL.md`:

```yaml
---
name: audit-security
description: Audit code for security issues following OWASP ASVS v5
model: inherit
---

# /audit-security

Security audit for React Native / Expo code.

## Instructions

1. Load files to audit (provided by user or inferred from context)
2. Check against OWASP ASVS v5 requirements:
   - Input validation at API boundaries
   - No secrets/tokens in code or logs
   - Auth: 401 triggers re-auth flow, not just toast
   - No eval(), no dynamic code execution
   - EXPO_PUBLIC_ vars are exposed to client — never put secrets there
   - expo-secure-store for sensitive data, not AsyncStorage
3. Check React Native specific:
   - No sensitive data in AsyncStorage (use expo-secure-store)
   - Deep link validation (scheme: "finapp")
   - No raw numeric IDs exposed in navigation params if sensitive
4. Report findings with ASVS requirement IDs where applicable
5. Suggest minimal fixes
```

- [ ] Создать `.claude/skills/review-react-perf/SKILL.md`:

```yaml
---
name: review-react-perf
description: React Native performance review using react-best-practices
model: opus
---

# /review-react-perf

Review React Native performance.

## Instructions

Follow `ai/rules/common/skills/react-best-practices.md`:
1. Use `ai/rules/common/performance/_index.md` to identify issue category by symptom
2. Load relevant rule file(s) from `ai/rules/common/performance/`
3. Check code in priority order:
   - Re-renders (missing useCallback, useMemo, React.memo)
   - FlatList issues (missing keyExtractor, no getItemLayout, too many re-renders)
   - Async waterfalls (sequential awaits instead of Promise.all)
   - Heavy computations on JS thread
   - Inline objects/arrays in JSX
4. This is React Native (Expo) — NOT web React. Do NOT suggest SSR, hydration, or DOM optimizations.
5. Report findings with file paths and expected impact

Output: issues list with rule file reference, code location, and fix suggestion.
```

---

## Task 24: Добавить hooks в settings.local.json

**Files:**
- Modify: `.claude/settings.local.json`

- [ ] Обновить `.claude/settings.local.json` — добавить секцию `hooks` после `permissions`:

```json
{
  "permissions": {
    "allow": [
      "Bash(mkdir -p \"C:\\\\Projects\\\\FinApp\\\\fin-app-mobile\\\\.claude\\\\agents\")",
      "Bash(mkdir -p \"C:\\\\Projects\\\\FinApp\\\\fin-app-mobile\\\\.claude\\\\rules\")",
      "Bash(mkdir -p \"C:\\\\Projects\\\\FinApp\\\\fin-app-mobile\\\\.claude\\\\commands\")",
      "Bash(mkdir -p \"C:\\\\Projects\\\\FinApp\\\\fin-app-mobile\\\\.claude\\\\reviews\")",
      "Bash(node:*)",
      "WebSearch",
      "mcp__plugin_context7_context7__resolve-library-id",
      "mcp__plugin_context7_context7__query-docs",
      "Bash(rtk git:*)",
      "Bash(rtk npx:*)",
      "Bash(/c/nvm4w/nodejs/npx expo:*)",
      "Bash(/c/nvm4w/nodejs/npm install:*)",
      "Bash(rtk yarn:*)",
      "Bash(yarn tsc:*)",
      "Bash(command -v rtk)",
      "Bash(yarn lint:*)",
      "Bash(npx expo:*)",
      "Bash(yarn add:*)",
      "Bash(node_modules/.bin/eslint:*)",
      "Bash(python3:*)",
      "Bash(find *)",
      "Bash(echo \"EXIT: $?\")",
      "Bash(python3.exe -c \"print\\('hello'\\)\")",
      "Bash(ls \"C:\\\\Users\\\\biloh\\\\.claude\\\\usage-data\\\\session-meta\"/*.json)",
      "Bash(echo:*)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "echo [post-edit] Code changed. Run /post-code before committing: rtk yarn lint"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo [session-end] Ensure post-code checks pass before pushing: rtk yarn lint"
          }
        ]
      }
    ]
  }
}
```

- [ ] Проверить что JSON валидный:

```bash
node -e "JSON.parse(require('fs').readFileSync('.claude/settings.local.json', 'utf8')); console.log('JSON valid')"
```

Expected: `JSON valid`

---

## Task 25: Обновить finapp-mobile-expert.md

**Files:**
- Modify: `.claude/agents/finapp-mobile-expert.md`

- [ ] Обновить секцию "On-Demand Rule Loading" в `.claude/agents/finapp-mobile-expert.md` — заменить старую routing table на:

```markdown
## On-Demand Rule Loading

Before starting any task, load the rule file(s) from CLAUDE.md routing table.
SSoT for all rules: `ai/rules/` | Full index: `.claude/AGENTS.md`

| Task type | Load |
|-----------|------|
| Screen / component / hook / style | `@ai/rules/projects/fin-app-mobile/architecture.md` |
| API / React Query / Zustand | `@ai/rules/projects/fin-app-mobile/state-management.md` |
| Navigation / routing / deep links | `@ai/rules/projects/fin-app-mobile/architecture.md` |
| React patterns / component rules | `@ai/rules/common/react.md` |
| TypeScript / async / error patterns | `@ai/rules/common/patterns.md` |
| After ANY code change | `@ai/rules/common/post-code-workflow.md` |
| Performance | `@ai/rules/common/performance/_index.md` |
| Git / commit | `@ai/rules/common/git-conventions.md` |
```

- [ ] Проверить что файл читается корректно:

```bash
head -60 .claude/agents/finapp-mobile-expert.md
```

---

## Task 26: Написать ai/prompts/ playbooks

**Files:**
- Create: `ai/prompts/mobile-feature.md`
- Create: `ai/prompts/mobile-bug.md`
- Create: `ai/prompts/mobile-design.md`
- Create: `ai/prompts/mobile-api.md`
- Create: `ai/prompts/mobile-review.md`

- [ ] Создать `ai/prompts/mobile-feature.md`:

```markdown
# Playbook: New Mobile Feature

Use when implementing a new screen, component, or feature slice.

## Workflow

1. Load: `@ai/rules/projects/fin-app-mobile/architecture.md`
2. Research: use codebase-researcher to find similar screens/components
3. For UI: invoke ui-ux-pro-max → plan screen layout
4. Plan: write implementation plan if 3+ files changed (`ai/rules/common/implementation-plans.md`)
5. Implement:
   - Create component folder: `features/FeatureName/FeatureName.tsx` + `useFeatureName.ts`
   - Add API module in `shared/api/` if needed
   - Add to Expo Router in `app/` if it's a new screen
6. Post-code: run `/post-code` (`rtk yarn lint`)
7. Review: invoke code-reviewer agent
8. For performance: invoke react-performance-reviewer

## Checklist

- [ ] FSD layer is correct (feature vs entity vs shared)
- [ ] Hook contains all logic (not in component JSX)
- [ ] NativeWind className only (no inline style for layout)
- [ ] No expo-router imports in features/ or shared/
- [ ] API calls only in shared/api/
- [ ] Query invalidation in all mutations
- [ ] kopeck math: /100 on load, Math.round(*100) on submit
- [ ] No array index as FlatList key
- [ ] Platform.select in shared/lib/platform.ts (not inline)
```

- [ ] Создать `ai/prompts/mobile-bug.md`:

```markdown
# Playbook: Bug Fix

Use when fixing a bug or unexpected behavior.

## Workflow

1. Load: `@ai/rules/common/core-rules.md`
2. Reproduce: find minimal reproduction, document expected vs actual behavior
3. Research: use codebase-researcher to find root cause
4. Fix: minimal corrective change only — do not refactor surrounding code
5. Verify: run `/post-code` (`rtk yarn lint && rtk yarn tsc --noEmit`)

## Common Mobile Bugs

- kopeck math: -0 on sign flip (fix: `if (!amount) return`), float drift (fix: Math.round)
- Cache stale: mutation without `queryClient.invalidateQueries`
- Re-auth loop: 401 not triggering auth flow (fix: axios interceptor)
- FlatList key: index as key causing reorder bugs (fix: `keyExtractor={item => item.id}`)
- Platform.select inline: duplicated across files (fix: extract to shared/lib/platform.ts)
- TanStack Query v4 API used instead of v5 (check: useQuery destructuring, invalidateQueries signature)
```

- [ ] Создать `ai/prompts/mobile-design.md`:

```markdown
# Playbook: Screen Design (HTML prototype)

Use when creating HTML screen prototypes for approval before implementation.

## Workflow

1. Load: `@.claude/rules/design-system.md`
2. If charts needed: load `@.claude/rules/charts.md`
3. Invoke ui-ux-pro-max: `--design-system` flag, finance sector, dark theme, mobile
4. Use screen-designer agent
5. Save to `designs/screens/<screen-name>.html`

## Requirements

- Dark theme only (no light mode)
- Phone frame 375×812px (required wrapper)
- CSS variables from design-system.md only (no hardcoded hex)
- Staggered fadeUp animation on cards/items
- Currency in UAH, `toLocaleString('uk-UA')`, amounts /100 (API in kopecks)
- Text in Russian (ru-RU locale for UI)
- Self-contained HTML (embedded style + script tags)
```

- [ ] Создать `ai/prompts/mobile-api.md`:

```markdown
# Playbook: API Integration

Use when integrating a new REST API endpoint.

## Workflow

1. Load: `@ai/rules/projects/fin-app-mobile/state-management.md`
2. Create API function in `src/shared/api/<domain>.ts` using `apiClient`
3. Add query keys in `src/shared/constants/query-keys.ts` (QUERY_KEYS constant)
4. Create `useQuery` or `useMutation` hook in feature or entity layer
5. Add mutation with `queryClient.invalidateQueries({ queryKey: QUERY_KEYS... })`
6. Handle 401 in apiClient interceptor (not per-request)
7. Run `/post-code`

## Key Rules

- `apiClient` from `src/shared/api/base.ts` ONLY (no new axios instances)
- TanStack Query v5 API (NOT v4)
- Query keys: QUERY_KEYS constants, not raw strings
- `staleTime`: set explicitly
- Error 401: triggers re-auth flow, not toast
- Amounts from API: divide by 100 for display, Math.round(*100) for submit
```

- [ ] Создать `ai/prompts/mobile-review.md`:

```markdown
# Playbook: Code Review

Use after implementation is complete.

## Workflow

1. Use code-reviewer agent with changed file paths
2. For performance issues: also use react-performance-reviewer agent
3. Maximum 3 review cycles per feature

## Review saves to

`.claude/reviews/<feature-name>-review.md`

## Common Review Checklist

- [ ] FSD layer violations (shared importing from features, etc.)
- [ ] expo-router imports outside app/
- [ ] inline style={{}} for layout
- [ ] hardcoded hex colors
- [ ] array index as FlatList key
- [ ] mutation without queryClient.invalidateQueries
- [ ] TanStack Query v4 API patterns in v5 codebase
- [ ] kopeck math errors (-0, float drift)
- [ ] Platform.select duplicated inline
- [ ] Hook > 50 lines or component > 150 lines
- [ ] Props > 7 without object parameter
- [ ] JSX nesting > 4 levels
```

---

## Verification: Финальная проверка структуры

- [ ] Проверить основные директории:

```bash
ls ai/rules/common/
ls ai/rules/common/performance/
ls ai/rules/common/skills/
ls ai/rules/projects/fin-app-mobile/
ls ai/prompts/
ls .claude/skills/commit/
```

- [ ] Проверить ключевые файлы:

```bash
ls CLAUDE.md
ls .claude/AGENTS.md
ls ai/rules/AGENTS.md
ls ai/rules/common/core-rules.md
ls ai/rules/projects/fin-app-mobile/architecture.md
ls ai/rules/projects/fin-app-mobile/state-management.md
```

- [ ] Проверить path-gated stubs:

```bash
head -4 .claude/rules/api.md
head -4 .claude/rules/screens.md
head -4 .claude/rules/design-system.md
```

Expected: каждый файл начинается с `---` (YAML frontmatter)

- [ ] Проверить hooks в settings.local.json:

```bash
node -e "const s = JSON.parse(require('fs').readFileSync('.claude/settings.local.json','utf8')); console.log('hooks:', JSON.stringify(s.hooks, null, 2))"
```

Expected: PostToolUse и Stop hooks

- [ ] Проверить SKILL.md файлы:

```bash
ls .claude/skills/commit/SKILL.md
ls .claude/skills/lint/SKILL.md
ls .claude/skills/post-code/SKILL.md
ls .claude/skills/start-task/SKILL.md
ls .claude/skills/implement-plan-step/SKILL.md
ls .claude/skills/audit-plan/SKILL.md
ls .claude/skills/audit-security/SKILL.md
ls .claude/skills/review-react-perf/SKILL.md
```

Expected: все 8 файлов существуют

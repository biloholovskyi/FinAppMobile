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
- CLASS_MAX_LINES = 200
- CLASS_MAX_METHODS = 10
- CLASS_MAX_PROPERTIES = 10
- MAX_NESTING_DEPTH = 3
- DUPLICATION_THRESHOLD = 3
- MAX_PARAMS_WITHOUT_RO_RO = 5
- FOLDER_FLAT_THRESHOLD = 7

Testing:
- DEFAULT_TEST_COVERAGE_TARGET = 0.8

Retry/Backoff:
- MAX_RETRY_ATTEMPTS = 10
- INITIAL_BACKOFF_MS = 1_000
- MAX_BACKOFF_MS = 5_000
- BACKOFF_MULTIPLIER = 1.2

Money (kopeck math):
- KOPECK_DIVISOR = 100 (divide on load)
- KOPECK_MULTIPLIER = 100 (Math.round on submit)

### Inline Exceptions

OK to use inline (no constant needed):
- count === 0
- index === -1
- array[0] (first element)
- HTTP status codes in tests (200, 404, 500)
- Single-use values in tests

## Decision Matrix

| Need | Solution | When |
|------|----------|------|
| Error handling | Result pattern | Expected errors in business logic |
| Error handling | Throw exception | Unexpected errors, external I/O |
| Async parallel | Promise.all() | Independent tasks |
| Async sequential | for...of | Dependent tasks |
| Type safety | Branded types | Domain values (UserId, Amount) |
| Magic numbers | Extract constant | 2+ (0,1,-1 OK inline) |
| Magic strings | Extract constant | Repeated protocol/domain literals |
| Type-only imports | Enforce import type | Type-only symbol usage |
| Security audit | ASVS v5 checklist | Refactor touches external input/auth/deps |
| Testing | AAA pattern | All tests |
| Retry logic | Exponential backoff | Transient failures (5xx only) |
| Concurrency control | Semaphores | Bounded parallelism needed |
| Code organization | Classes | Stateful, multiple methods |
| Code organization | Functions | Stateless, single purpose |
| Folder structure | Flat structure | Files < FOLDER_FLAT_THRESHOLD |
| Folder structure | Nested structure | Files >= FOLDER_FLAT_THRESHOLD |
| Money amounts | Kopeck math | API amounts in kopecks → /100 display, *100 Math.round submit |

## Preferred Paradigms

- Functional core, imperative shell: keep business logic pure; isolate I/O at boundaries
- Composition over inheritance: prefer small composable functions, objects, and hooks
- Explicit effects: model async and errors via parameters and Result types, not hidden globals
- Immutability by default: favor new values over in-place mutation
- Declarative UI and data flow: describe what UI/data should look like in React components

## Requirements

### Naming
- Classes: PascalCase
- Variables/Functions: camelCase
- Files: kebab-case
- Constants: SCREAMING_SNAKE_CASE (include units)
- Environment Vars: EXPO_PUBLIC_ prefix for client-side
- Booleans: Verb prefix (isX, hasX, canX)
- Abbreviations: i/j (loops), err, ctx
- English only

### Functions
- Length: <FUNCTION_MAX_LINES
- Refactor threshold: FUNCTION_REFACTOR_LINES
- Naming: Verb+noun
- Pattern: RO-RO for MAX_PARAMS_WITHOUT_RO_RO+ params/returns
- Nesting: ≤MAX_NESTING_DEPTH
- Single responsibility
- Extract at DUPLICATION_THRESHOLD
- Prefer pure; isolate side effects at boundaries

### TypeScript
- Strict mode always
- No `any` (create types)
- Magic numbers: Extract 2+ (0,1,-1 OK inline, use underscores: 10_000)
- Prefer focused modules: one primary export per file
- JSDoc public classes/methods
- English only
- Branded: `type UserId = string & { readonly __brand: 'UserId' }`
- Discriminated unions: `{ status: 'success'; data: T } | { status: 'error'; error: string }`
- Union handling: Prefer exhaustive narrowing (`switch` + `never` guard)
- Satisfies: `const config = { ... } satisfies Config` (type-check without widening)
- DTOs: Declare near usage; share via `shared/types` when cross-module
- Types/Interfaces: Exported types in `*.types.ts` files; co-locate with implementation when single-module
- Import: Use `import type` for type-only imports
- Export: Use `export type` for type-only exports
- Prefer const objects over enums
- Path aliases: Use `baseUrl: "."` and `paths` in tsconfig.json with `@shared/*`, `@features/*`

### Magic Numbers
- Extract 2+ (except 0,1,-1)
- Always extract 10+ (use underscores)
- Naming: Include units
- Organization: `src/shared/constants/` subfolder with logical grouping
- Export: Re-export all from `src/shared/constants/index.ts`
- Exceptions: count === 0, index === -1, array[0], HTTP status in tests

### Magic Strings
- Extract repeated string literals (2+) when they represent protocol/domain meaning (headers, query keys, event names, error codes)
- Security-sensitive strings (auth header names, token prefixes) belong in shared constants
- Exceptions: single-use test fixtures

### Async
- Default: async/await
- Promise.then(): Functional chaining
- Parallel: Promise.all() (independent) or Promise.allSettled() (partial failures)
- Sequential: for...of (dependent)
- Timeouts: AbortSignal (modern)
- Retry: Exponential backoff with jitter
- Never: async void, forEach with async, unbounded parallelism, no timeout

### Error Handling
- Expected: Result pattern `{ ok: true; value: T } | { ok: false; error: E }`
- Unexpected: Throw exceptions
- Hierarchy: Error → ApplicationError → ValidationError/NotFoundError/AuthError
- HTTP: NOT_FOUND→404, INVALID_INPUT→400, UNAUTHORIZED→401, FORBIDDEN→403, INTERNAL_ERROR→500
- Network errors: Show user-facing message via toast/alert, log to console
- 401: Trigger re-authentication flow, not just a toast
- Never swallow errors silently (no empty catch blocks)
- Retry: Only 5xx, max MAX_RETRY_ATTEMPTS, exponential backoff
- Logging: Always include context. Never passwords, tokens, API keys

### Testing
- Framework: Jest (Expo default)
- Pattern: AAA (Arrange, Act, Assert)
- Naming: inputX, mockX, actualX, expectedX
- Types: Unit (business logic), Integration (API), Snapshot (stable outputs only)
- Test Doubles: Mock (replace), Stub (predefined data), Spy (track calls)
- Mock only external services in integration tests

### Code Quality Tools
- ESLint: Primary linter (`rtk yarn lint`)
- TypeScript: `rtk yarn tsc --noEmit`
- No Biome — ESLint only
- Workflow: After edits run lint, then tsc if needed

### Dependency Hygiene
- Prefer existing utilities; add deps only when justified
- Modules side-effect free on import
- Respect Expo SDK 52 dependency constraints — check compatibility before adding packages
- Use `yarn add` not npm

### Security Audit
- Validate and sanitize all untrusted input at boundaries (API responses, user input)
- Prevent injection patterns
- Logging hygiene: never log tokens, secrets, passwords
- Supply-chain hygiene: audit dependencies, verify compatibility with Expo SDK 52

## Anti-Patterns

- Magic numbers 2+ without constants
- Magic strings 2+ without constants
- Constants without JSDoc comments
- `any` types
- Functions >FUNCTION_MAX_LINES
- Multiple params without RO-RO (>MAX_PARAMS_WITHOUT_RO_RO)
- Nesting >MAX_NESTING_DEPTH
- Generic errors (`throw new Error('Failed')`)
- async void
- forEach with async
- No timeout on async
- Retry terminal errors (400/401/404)
- Swallowing errors (`catch (err) { }`)
- Logging sensitive data
- Unbounded parallelism
- Array index as key in FlatList
- inline style={{}} for layout (use NativeWind className)
- Hardcoded hex colors (use Tailwind tokens)
- expo-router imports in shared/, entities/, features/
- API amounts displayed without /100 kopeck division

## Token Discipline

- Summarize inputs before planning
- Cache extracted facts; avoid rereading unchanged files
- Prefer referencing constants over repeating values

## Output Expectations

- Updates: concise bullet lists (no post-task summary)
- Reference files/identifiers with backticks
- Call out assumptions, risks, required follow-up

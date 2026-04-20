---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# API Rules

Source of truth: `ai/rules/projects/fin-app-mobile/state-management.md`

## Quick Rules

- Never call axios directly outside `src/shared/api/`
- Use `apiClient` from `src/shared/api/base.ts`
- Every mutation MUST call `queryClient.invalidateQueries()` after success
- Query keys: use `QUERY_KEYS.*` constants, never raw strings
- Zustand: UI state only — never API response data
- 401 errors: trigger re-auth flow, not just a toast
- Never swallow errors (no empty catch blocks)

## Generated API (Orval)

- New features: use hooks from `src/shared/api/generated/`
- Model types: import only from `src/shared/api/generated/models/` — never redeclare manually
- Manual files in `src/shared/api/*.ts` — legacy, do not extend
- After backend contract changes: run `npm run api:generate` before starting work
- Generated mutation hooks still require manual `queryClient.invalidateQueries()` in `onSuccess`

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

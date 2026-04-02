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

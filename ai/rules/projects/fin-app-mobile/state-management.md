# State Management — fin-app-mobile

SSoT for API integration, React Query, Zustand, and error handling conventions.

## REST (Axios + React Query)

### Axios Setup

- Never call Axios directly in screens, components, or hooks outside `src/shared/api/`
- All HTTP calls defined in `src/shared/api/*.ts` modules — export functions, not the instance
- Use `apiClient` from `src/shared/api/base.ts` — never create new Axios instances
- Axios instance must include: `baseURL` from `EXPO_PUBLIC_API_URL`, auth header, timeout

```typescript
// src/shared/api/base.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken(); // from secure storage
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### API Module Pattern

```typescript
// src/shared/api/transactions.ts
import { apiClient } from './base';
import type { Transaction, CreateTransactionDto } from '@entities/transaction';

export const fetchTransactions = (): Promise<Transaction[]> =>
  apiClient.get('/transactions').then((r) => r.data);

export const createTransaction = (dto: CreateTransactionDto): Promise<Transaction> =>
  apiClient.post('/transactions', dto).then((r) => r.data);
```

## TanStack Query v5 (CRITICAL)

### Query Keys

Use typed constants — never raw strings inline:

```typescript
// src/shared/constants/queryKeys.ts
export const QUERY_KEYS = {
  transactions: {
    all: ['transactions'] as const,
    byId: (id: string) => ['transactions', id] as const,
    filtered: (filters: TransactionFilters) => ['transactions', 'filtered', filters] as const,
  },
  wallets: {
    all: ['wallets'] as const,
    byId: (id: string) => ['wallets', id] as const,
  },
} as const;
```

### Queries (v5 syntax)

```typescript
// ✅ Correct v5 syntax
const { data, isLoading, error } = useQuery({
  queryKey: QUERY_KEYS.transactions.all,
  queryFn: fetchTransactions,
});

// Conditional query
const { data } = useQuery({
  queryKey: QUERY_KEYS.transactions.byId(id),
  queryFn: () => fetchTransactionById(id),
  enabled: !!id, // only run when id is available
});

// ❌ Wrong — v4 API
const { data } = useQuery(['transactions'], fetchTransactions, { onSuccess: () => {} });
```

### Mutations with Cache Invalidation

Every mutation MUST call `queryClient.invalidateQueries()` after success:

```typescript
const queryClient = useQueryClient();

const createMutation = useMutation({
  mutationFn: createTransaction,
  onSuccess: () => {
    // REQUIRED: invalidate affected query keys
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallets.all });
  },
  onError: (error) => {
    // Show user-facing error
    showToast(getErrorMessage(error));
  },
});
```

Optimistic updates: only where UX strongly demands it, not by default.

## Zustand v4 Stores

### When to Use Zustand

- UI state (filter values, selected items, modal open/close)
- Offline/local data (user preferences, draft data)
- Cross-screen UI state that doesn't come from the API

Do NOT use Zustand for:
- API response data (use React Query)
- Derived data (compute in render or useMemo)

### Store Pattern

```typescript
// src/shared/stores/transactionFiltersStore.ts
import { create } from 'zustand';

interface TransactionFiltersState {
  dateFrom: string | null;
  dateTo: string | null;
  categoryId: string | null;
  setDateFrom: (date: string | null) => void;
  setDateTo: (date: string | null) => void;
  setCategoryId: (id: string | null) => void;
  resetFilters: () => void;
}

const initialState = {
  dateFrom: null,
  dateTo: null,
  categoryId: null,
};

export const useTransactionFiltersStore = create<TransactionFiltersState>((set) => ({
  ...initialState,
  setDateFrom: (date) => set({ dateFrom: date }),
  setDateTo: (date) => set({ dateTo: date }),
  setCategoryId: (id) => set({ categoryId: id }),
  resetFilters: () => set(initialState),
}));
```

Rules:
- One store per feature domain (e.g., `walletsUiStore`, `transactionFiltersStore`)
- Keep stores flat — avoid deep nesting
- Persist with `expo-secure-store` for sensitive data, `AsyncStorage` for preferences
- Never put API response data directly into Zustand

## Error Handling

### Network Errors

```typescript
const { error } = useQuery({ queryKey, queryFn });

if (error) {
  // Show user-facing message
  return <ErrorView message="Не вдалося завантажити дані" onRetry={refetch} />;
}
```

Hierarchy:
- Network errors → show toast/alert, log to console
- 401 → trigger re-authentication flow (not just a toast)
- 4xx → show specific user message
- 5xx → show generic error + retry option

Never swallow errors silently (no empty catch blocks).

### API Response Validation

```typescript
// Validate shape before use — don't trust unknown
const transactions = data ?? [];
const amount = item.amount ?? 0; // handle missing fields defensively
```

## Hooks Pattern

```typescript
// src/features/transactions/TransactionList/useTransactionList.ts

export function useTransactionList() {
  const filters = useTransactionFiltersStore();

  const { data: transactions = [], isLoading, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.transactions.filtered(filters),
    queryFn: () => fetchTransactions(filters),
  });

  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all });
    },
  });

  return {
    transactions,
    isLoading,
    error,
    refetch,
    createTransaction: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
}
```

## Related Rules

- `ai/rules/projects/fin-app-mobile/architecture.md` — FSD structure, Expo Router, NativeWind
- `ai/rules/common/patterns.md` — TypeScript, async, error handling patterns

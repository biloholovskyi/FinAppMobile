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

// Auth interceptor
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

## Generated API (Orval)

`src/shared/api/generated/` — single source of hooks and types for new features. Generated from `../fin-app-backend/docs/openapi.json` via `rtk yarn api:generate`.

### Rules

- Use generated hooks for all new features — do NOT write manual API functions
- Import models only from `src/shared/api/generated/models/` — never redeclare types manually
- Manual files (`wallets.ts`, `transactions.ts`, `budgets.ts`, `categories.ts`) are legacy — read-only, do not extend
- Run `rtk yarn api:generate` when the backend OpenAPI contract changes
- Regeneration rewrites the whole generated tree, not just the touched tag — review the full diff and run `rtk yarn tsc --noEmit` before writing new code
- `WalletTransactionModel` does not declare `wallet`, `category`, `subCategory` although the endpoint returns them — a backend contract gap. Keep the render type in `src/entities/transaction` and localise the cast in one adapter

### Usage Examples

```typescript
// Hook import
import { useGetAllWallets } from '@/shared/api/generated/wallets/wallets';

// Type import
import type { WalletModel } from '@/shared/api/generated/models';
```

### Invalidation (still required)

Generated mutation hooks do NOT call `queryClient.invalidateQueries()` automatically — add `onSuccess` manually in the feature hook:

```typescript
const mutation = useCreateWallet({
  mutation: {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetAllWalletsQueryKey() });
    },
  },
});
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
    // REQUIRED: invalidate affected queries
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallets.all });
  },
  onError: (error) => {
    // Show user-facing error message
    showToast(getErrorMessage(error));
  },
});
```

Optimistic updates: only where UX strongly demands it, not by default.

## Windowed Infinite Loading

Reference implementation: `src/features/operations/OperationsScreen/`.

`GET /wallets/transactions` paginates only when `page` or `limit` is passed, and filters only when `dateFrom` or `dateTo` is passed. Both flags are independent.

`pagination.total` is `count()` over the SAME filter as the query — it is the global number of records only when no date bounds are sent. Never read a date-filtered `total` as the size of the whole collection: fetch the global count with a separate `page=1&limit=1` request without dates.

Rules:
- `pageParam` carries both coordinates: `{ windowIndex, page }`. `getNextPageParam` walks pages inside the window while `page < totalPages`, then advances the window
- Window math lives in `src/shared/utils/dateWindows.ts`. The first window has no upper bound so future-dated records still arrive; later windows end 1 ms before the previous window starts
- The stop condition is `loadedCount < total`, not `hasNextPage` — date windows are infinite by construction
- Back the counter with a fuse: a run of consecutive empty windows must stop the feed in case `total` disagrees with reality
- Merge pages with de-duplication by `id`; a repeat both breaks list keys and pushes `loadedCount` past `total`
- When a client-side filter hides whole windows, auto-load until the viewport is filled — a short list never fires `onEndReached`
- Pull-to-refresh trims the cache to the first page and refetches; resetting the query returns `isLoading` and replaces the refresh control with a full-screen loader

## Разделение расходной транзакции

Реализация: `src/features/operations/EditTransactionScreen/`. Прототип: `designs/screens/transaction-edit.html`.

Расходную транзакцию можно разделить на две: часть суммы уходит в новый платёж с собственной категорией, остаток остаётся в исходной.

Правила:
- Разделение доступно только для типа `expense` и только при редактировании существующей транзакции
- Одна дополнительная часть за раз; базовая сумма фиксируется в момент включения разделения
- Поле «Сумма» на время разделения read-only и показывает остаток; ввод новой части клампится диапазоном от нуля до базовой суммы
- Сохранение выполняет два запроса подряд: PATCH исходной транзакции с суммой-остатком, затем POST нового платежа
- Новый платёж копирует из исходной `walletId`, `type`, `description`, `transactionTime`; собственными остаются `categoryId`, `subCategoryId`, `amount`
- Кэш инвалидируется и экран закрывается только после успеха обоих запросов
- Атомарности нет: если PATCH прошёл, а POST упал, признак `isSourceUpdated` не даёт повторному сохранению вычесть сумму второй раз. Признак сбрасывается при успехе, при отключении разделения и при смене типа
- Суммы отправляются в единицах валюты, а не в копейках — этому контракту следует весь экран редактирования; в копейках приходят только ответы API
- Копеечная математика разделения живёт в `amountStrToKopecks` / `kopecksToAmountStr` из `src/shared/utils/currency.ts`; `parseAmountInput` для неё не подходит, так как считает ноль ошибкой

## Zustand v5 Stores

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
- No Zustand store exists yet — the first one creates `src/shared/stores/`

v5 selector rules (breaking vs v4):
- The equality-function second argument is removed — use `useShallow` from `zustand/react/shallow` for object/array selectors
- Prefer one field per call: `useStore((s) => s.dateFrom)` — returning a fresh object every render causes infinite re-renders
- Always `import { create } from 'zustand'` — the default export is gone

## Error Handling

### Network Errors

```typescript
const { error } = useQuery({ queryKey, queryFn });

if (error) {
  // Show user-facing message
  return <ErrorView message="Failed to load data" onRetry={refetch} />;
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
// Validate shape before use — never trust unknown
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

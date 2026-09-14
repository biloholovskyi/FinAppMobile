# Architecture — fin-app-mobile

SSoT for project conventions, tech stack, structure, and constraints.

## Dependency Constraints (CRITICAL)

These are PINNED versions — do NOT use APIs from other major versions:

| Package | Version | Notes |
|---------|---------|-------|
| Expo SDK | 57.x | Ecosystem anchor — all packages must be compatible |
| React Native | 0.86.x | New Architecture only — the Legacy Architecture was removed in SDK 55 |
| React | 19.2.x | NOT React 18 — Actions, `use`, ref as a prop are available |
| Expo Router | 57.x | File-based routing; versioned with the SDK since 55 — NOT the old 6.x numbering |
| NativeWind | 4.x | NOT v2/v3 API (`className` prop, not `style`) |
| TanStack Query | 5.x | NOT v4 API (no `onSuccess` in useQuery, `invalidateQueries({ queryKey })`) |
| Zustand | 5.x | NOT v4 — selectors must return stable references |
| Reanimated | 4.x | Requires `react-native-worklets`; NOT v3 API |
| TypeScript | 6.0.x | Strict mode required; `baseUrl` deprecated, `paths` resolve from the config directory |
| Axios | 1.20+ | Versions below 1.18 carry published advisories |

Before adding any new dependency: check Expo SDK 57 compatibility at https://docs.expo.dev/versions/v57.0.0/
Prefer `rtk npx expo install <pkg>` over `yarn add` — it resolves the SDK-compatible version.

## Tech Stack

- **Runtime**: React Native + Expo SDK 57 (managed workflow)
- **Routing**: Expo Router 57 (file-based, `src/app/`)
- **Styling**: NativeWind v4 (Tailwind CSS for RN) — `className` prop everywhere
- **Server state**: TanStack Query v5 (React Query)
- **UI state**: Zustand v5
- **HTTP**: Axios v1 via `src/shared/api/base.ts`
- **Animation**: Reanimated v4 + `react-native-worklets`
- **Charts**: `react-native-gifted-charts`
- **Icons**: `lucide-react-native`
- **Language**: TypeScript 6.0 strict
- **Architecture**: FSD (Feature-Sliced Design)
- **Build / OTA**: EAS Build + `expo-updates`

## FSD Layer Structure

```
src/
├── app/          # Expo Router routes — ONLY layer that imports expo-router
│   ├── _layout.tsx
│   ├── +not-found.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx        # Dashboard tab
│   │   ├── operations.tsx   # Transactions tab
│   │   ├── categories.tsx   # Categories tab
│   │   └── statistics.tsx   # Statistics tab
│   ├── transaction/[id].tsx
│   ├── transaction/create.tsx
│   ├── category/[id].tsx
│   └── category/create.tsx
├── features/     # Feature slices (UI + logic for one feature)
├── entities/     # Business entities (models, API calls per entity)
├── shared/       # Shared across all layers
│   ├── api/          # Axios instance + generated Orval hooks
│   ├── ui/           # Reusable UI components
│   ├── lib/          # Infrastructure setup (queryClient)
│   ├── utils/        # Pure helpers (currency, dates, colors, icons)
│   └── constants/    # App-wide constants (queryKeys, pagination) + index.ts barrel
```

`src/shared/stores/` does not exist yet — create it there when the first Zustand store is needed.

### Import Direction (STRICT)

```
app → features → entities → shared
```

Forbidden cross-layer imports:
- `shared` importing from `features` or `entities` → NEVER
- `entities` importing from `features` → NEVER
- `expo-router` imported in `shared/`, `entities/`, `features/` → NEVER

## Component Structure

Every screen and component in its own folder:
```
src/features/dashboard/
└── DashboardScreen/
    ├── DashboardScreen.tsx   # JSX only — no business logic
    └── useDashboardScreen.ts # All logic here
```

Rules:
- Component: max 150 lines
- Hook: max 50 lines (split to sub-hooks if larger)
- JSX nesting: max 4 levels
- Props: max 7 (use object param if more)
- Never put business logic directly in JSX

## Expo Router Conventions

```typescript
// Typed navigation
import { router } from 'expo-router';
router.push('/operations'); // typed Href

// Route params
import { useLocalSearchParams } from 'expo-router';
const { id } = useLocalSearchParams<{ id: string }>();

// Declarative navigation
import { Link } from 'expo-router';
<Link href="/transaction/create">New transaction</Link>
```

Stack screen options (inside screen component):
```tsx
import { Stack } from 'expo-router';
<Stack.Screen options={{ title: 'Operations' }} />
```

Auth guard: placed in root `src/app/_layout.tsx` using `useSegments` + `useRouter`. Never in individual screens.

## NativeWind v4 Styling

```tsx
// ✅ Correct — NativeWind v4
<View className="flex-1 bg-background p-4">
  <Text className="text-foreground text-lg font-semibold">Balance</Text>
</View>

// ❌ Wrong — inline style for layout
<View style={{ flex: 1, backgroundColor: '#0A0A12', padding: 16 }}>

// ✅ OK — style only for dynamic computed values
<View style={{ transform: [{ translateX: animatedValue }] }}>
```

Dark mode:
```tsx
// ✅ Correct
<Text className="text-foreground dark:text-gray-100">

// ❌ Wrong — Platform.select color hack
<Text style={{ color: Platform.select({ ... }) }}>
```

No hardcoded hex colors — use Tailwind tokens only.

## Money / Kopeck Math (CRITICAL)

API amounts are in KOPECKS (integer). Always:

```typescript
// On load (display): divide by 100
const displayAmount = apiAmount / 100; // 15000 → 150.00

// On submit (write): multiply by 100, Math.round
const apiAmount = Math.round(displayAmount * 100); // 150.00 → 15000

// Prevent -0 bug
if (!amount) return; // validate before sign operations

// Format for display
amount.toLocaleString('uk-UA', { style: 'currency', currency: 'UAH' })
```

Constants to use:
```typescript
export const KOPECK_DIVISOR = 100;
export const KOPECK_MULTIPLIER = 100;
```

## Экран статистики: режимы отображения

Реализация: `src/features/categorySpending/CategorySpendingScreen/`. Прототип: `designs/screens/category-spending.html`.

Список расходов за месяц показывается в одном из двух режимов, переключаемых сегмент-контролом между карточкой бюджета и подписью секции.

Правила:
- Режимы, подписи сегментов и подписи секции живут в `src/shared/constants/spendingViewMode.ts` — единственный источник этих строк
- Режим `categories` показывает карточки категорий с раскрытием подкатегорий
- Режим `subcategories` показывает плоский список: подкатегории всех категорий плюс категории, у которых подкатегорий нет. Категория, имеющая хотя бы одну подкатегорию, собственной строкой не показывается
- Расходы категории, не отнесённые ни к одной подкатегории, дают в плоском списке синтетическую строку `UNCATEGORIZED_SUB_LABEL` с суммой остатка и без бюджета. Без неё сумма плоского списка расходится с «Потрачено»
- Сумма строк плоского списка равна `summary.totalSpent` в любом наборе данных
- Сортировка обоих режимов — по `totalSpent` по убыванию, что совпадает с порядком по доле затрат: знаменатель у всех строк общий
- Оба режима рендерятся одним `FlatList`, параметризованным дискриминированным union `SpendingListItem`; ключ выдаёт `getSpendingListItemKey`
- Режим хранится локальным состоянием экрана, без персиста и без Zustand
- Смена режима не порождает запросов: пересобирается только производный список

## Dates

```typescript
// Display
date.toLocaleDateString('uk-UA') // '09.04.2026'

// Date + time
date.toLocaleString('uk-UA')
```

## Commands

```bash
rtk npx expo start           # Dev server
rtk npx expo start --clear   # Dev server (clear Metro cache)
rtk yarn lint                # ESLint with auto-fix
rtk yarn tsc --noEmit        # TypeScript check
rtk npx eas build --profile preview --platform all   # Preview build
rtk npx eas build --profile production --platform all # Production build
rtk npx eas submit --platform ios     # Submit to App Store
rtk npx eas submit --platform android # Submit to Play Store
```

## Environment Variables

All mobile env vars must have `EXPO_PUBLIC_` prefix for client-side access:
```
EXPO_PUBLIC_API_URL=https://api.example.com
```

Never put secrets in EXPO_PUBLIC_ variables — they're bundled in the app.

## FlatList Requirements

Always use FlatList for dynamic lists (never ScrollView + .map):
```tsx
<FlatList
  data={transactions}
  keyExtractor={(item) => item.id}  // Never array index
  renderItem={({ item }) => <TransactionItem item={item} />}
  getItemLayout={(_, index) => ({ length: 72, offset: 72 * index, index })}
/>
```

## Platform Differences

```typescript
// Extract ALL Platform.select to src/shared/utils/platform.ts
// NEVER inline Platform.select in multiple files

// src/shared/utils/platform.ts
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
```

## TanStack Query v5 API (CRITICAL)

```typescript
// v5 syntax — do NOT use v4 API
const { data } = useQuery({
  queryKey: QUERY_KEYS.transactions.all,
  queryFn: () => fetchTransactions(),
});

// Mutations with cache invalidation
const mutation = useMutation({
  mutationFn: createTransaction,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all });
  },
});

// NO onSuccess in useQuery (v5 removed it)
// NO queryKey as first arg (v5 uses object syntax only)
```

## Zustand v5 Stores

```typescript
// One store per feature domain
// src/shared/stores/transactionFiltersStore.ts
interface TransactionFiltersState {
  dateFrom: string | null;
  dateTo: string | null;
  setDateFrom: (date: string | null) => void;
}

export const useTransactionFiltersStore = create<TransactionFiltersState>((set) => ({
  dateFrom: null,
  dateTo: null,
  setDateFrom: (date) => set({ dateFrom: date }),
}));
```

v5 breaking changes to respect:
- The equality-function second argument is removed — for object/array selectors use `useShallow` from `zustand/react/shallow`
- Select one field per call (`useStore((s) => s.dateFrom)`) instead of returning a new object every render
- No default export from `zustand` — always `import { create } from 'zustand'`

Never put API response data in Zustand — that's React Query's job.

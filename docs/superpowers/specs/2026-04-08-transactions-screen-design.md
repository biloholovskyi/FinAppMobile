# Design Spec: Transactions Screen + Transaction Edit Screen

**Date:** 2026-04-08  
**Branch:** r-1.1.0  
**Design references:** `designs/screens/transactions.html`, `designs/screens/transaction-edit.html`

---

## Context

The mobile app currently has a placeholder `OperationsScreen`. This spec covers implementing:
1. The transactions list screen with type filters and grouped-by-date layout
2. The transaction edit screen as a stack route

---

## Architecture

### Files Modified

| File | Change |
|------|--------|
| `src/entities/transaction/index.ts` | Add populated `wallet`, `category`, `subCategory` objects to `Transaction` type |
| `src/shared/api/transactions.ts` | Add `createTransaction`, `updateTransaction`, `deleteTransaction` |
| `src/shared/constants/queryKeys.ts` | Add `categories` key |

### Files Created

| File | Purpose |
|------|---------|
| `src/shared/api/categories.ts` | `getCategories()` → `CategoryDto[]` |
| `src/features/operations/OperationsScreen/useOperationsScreen.ts` | Transactions data, filter state, navigation |
| `src/features/operations/OperationsScreen/OperationsScreen.tsx` | Rewrite placeholder |
| `src/features/transaction-edit/TransactionEditScreen/useTransactionEditScreen.ts` | Edit form logic |
| `src/features/transaction-edit/TransactionEditScreen/TransactionEditScreen.tsx` | Edit form UI |
| `src/app/transaction/[id].tsx` | Stack route — renders TransactionEditScreen |

---

## Entity Types

### Updated `Transaction`

```typescript
export type TransactionCategoryRef = {
  id: string
  name: string
  color?: string
  icon?: string
}

export type Transaction = {
  id: string
  walletId: string
  type: WalletTransactionType | null
  categoryId: string | null
  subCategoryId: string | null
  amount: number             // in kopecks
  description: string
  transactionTime: string    // ISO date
  externalId: string | null
  createdAt: string
  updatedAt: string
  wallet: { id: string; name: string; currency: string }
  category: TransactionCategoryRef | null
  subCategory: TransactionCategoryRef | null
}
```

### Category Types (`src/shared/api/categories.ts`)

```typescript
export type SubCategoryDto = {
  id: string
  name: string
  color?: string
  icon?: string
}

export type CategoryDto = {
  id: string
  name: string
  color?: string
  icon?: string
  subCategory: SubCategoryDto[]
}
```

---

## Shared API

### `src/shared/api/transactions.ts` — additions

```typescript
createTransaction(body: CreateTransactionDto): POST /wallets/transactions
updateTransaction(id, body: UpdateTransactionDto): PATCH /wallets/transactions/{id}
deleteTransaction(id): DELETE /wallets/transactions/{id}
```

DTOs mirror the frontend — `walletId`, `amount`, `type`, `categoryId`, `subCategoryId`, `targetWalletId?`, `description?`, `transactionTime`.

### `src/shared/api/categories.ts`

```typescript
getCategories(): GET /categories → CategoryDto[]
```

### `src/shared/constants/queryKeys.ts` — additions

```typescript
categories: { all: ['categories'] as const }
```

---

## Operations Screen (Transactions List)

### Data Flow

```
OperationsScreen
  └── useOperationsScreen
       ├── useQuery(QUERY_KEYS.transactions.all, fetchTransactions)
       ├── useQuery(QUERY_KEYS.wallets.all, getWallets)   ← for wallet name fallback
       ├── filterType: 'all' | 'expense' | 'income' | 'transfer'  (useState)
       ├── filtered = transactions.filter(by type)
       └── grouped = groupByDate(filtered)  ← pure function, local lib
```

### Grouping logic (`lib/groupTransactionsByDate.ts`)

Groups by `transactionTime` date (day), returns `{ label: string, total: number, items: Transaction[] }[]`.

Label logic:
- Today → "Сегодня"
- Yesterday → "Вчера"
- Else → `toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })`

### Category display in list item

```
subCategory?.name ?? category?.name ?? null
```

If null — no badge rendered.

### Actions per list item

- Tap → `router.push('/transaction/${id}')`
- Swipe left (or long press) → reveal Edit / Delete buttons
- Delete → `deleteTransaction(id)` → `invalidateQueries(QUERY_KEYS.transactions.all)`

### UX additions (improvements over bare design)

- `RefreshControl` on ScrollView for pull-to-refresh
- `ActivityIndicator` during initial load
- Empty state message when no transactions match filter

---

## Transaction Edit Screen

### Navigation

Route: `src/app/transaction/[id].tsx`  
Stack screen with `options={{ title: '' }}` (no visible title, nav bar has custom back button per design).

### Data Flow

```
TransactionEditScreen
  └── useTransactionEditScreen({ id })
       ├── id = useLocalSearchParams<{ id: string }>()
       ├── transactions = useQuery(QUERY_KEYS.transactions.all)  ← from cache, no extra request
       ├── transaction = transactions.find(t => t.id === id)
       ├── wallets = useQuery(QUERY_KEYS.wallets.all)
       ├── categories = useQuery(QUERY_KEYS.categories.all, getCategories)
       ├── form state: type, amount, walletId, targetWalletId, categoryId, subCategoryId,
       │              description, transactionTime
       ├── isDatePickerVisible: boolean
       ├── isCategoryPickerVisible: boolean
       ├── isWalletPickerVisible: boolean
       ├── handleSave() → updateTransaction → invalidate → router.back()
       └── handleDelete() → deleteTransaction → invalidate → router.back()
```

### Amount Sign Logic

```typescript
// On type change:
if (type === 'expense') amount = -Math.abs(amount)
if (type === 'income')  amount =  Math.abs(amount)
if (type === 'transfer') amount = Math.abs(amount)

// On display:
displayAmount = Math.abs(amount).toString()
prefix = type === 'expense' ? '−' : type === 'income' ? '+' : ''
```

Amount is stored internally as a positive number in the form state; sign is applied on submit based on type.

### Category / SubCategory Logic

```
- Type === 'transfer' → hide category rows entirely
- Type !== 'transfer':
    - Show Category row (opens CategoryPickerModal)
    - If selectedCategory.subCategory.length > 0 → show SubCategory row
    - If categoryId changes → clear subCategoryId
```

### Date Picker

Package: `react-native-ui-datepicker` (pure JS, Expo compatible, no native build needed).

Displayed in a Modal (bottom sheet style) with dark theme styles:
- Background: `#10101C` (--bg-surface)
- Selected date highlight: `#4F9EFF` (--accent-blue)
- Text: `#F2F2FF` (--text-primary)
- Inactive text: `#8888AA` (--text-secondary)
- Border radius: 16px on the modal container

### Category / Wallet Pickers

Rendered as Modal with FlatList. Each item is a tappable row matching the design system. No external library needed.

---

## Design System Alignment

All colors via hardcoded constants matching the design system (no Tailwind tokens for these — RN StyleSheet):

```typescript
const DS = {
  bgBase: '#0A0A12',
  bgSurface: '#10101C',
  bgElevated: '#181828',
  borderDefault: 'rgba(255,255,255,0.08)',
  borderSubtle: 'rgba(255,255,255,0.04)',
  accentBlue: '#4F9EFF',
  accentGreen: '#00E089',
  accentRed: '#FF4B6B',
  accentAmber: '#FFB020',
  accentPurple: '#A374FF',
  textPrimary: '#F2F2FF',
  textSecondary: '#8888AA',
  textMuted: '#44445A',
}
```

NativeWind `className` for layout, `StyleSheet` / inline styles for colors and dynamic values.

---

## Verification

1. `rtk yarn tsc --noEmit` — no TypeScript errors
2. `rtk yarn lint` — no ESLint errors
3. `rtk npx expo start` — app launches, transactions list visible on Operations tab
4. Filter pills switch correctly (Все/Расходы/Доходы/Переводы)
5. Pull-to-refresh reloads transactions
6. Tap transaction → edit screen opens with pre-filled data
7. Change type → amount sign updates, category rows show/hide correctly
8. Category with subcategories → subcategory row appears
9. Category without subcategories → subcategory row hidden
10. Save → navigates back, list updates
11. Delete → navigates back, item removed from list
12. Date picker opens in dark-themed modal

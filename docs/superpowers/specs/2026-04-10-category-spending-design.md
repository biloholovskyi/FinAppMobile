# Category Spending Screen — Design Spec
_Date: 2026-04-10_

## Overview

New "Статистика" tab screen that shows expense transactions grouped by category for a selected month, overlaid with monthly budget data. Users can navigate between months, see a total budget summary, and drill into per-category and per-subcategory breakdowns.

---

## Navigation

- New third tab in `(tabs)/_layout.tsx`: name `statistics`, title `Статистика`, icon `PieChart` from `lucide-react-native`
- Route file: `src/app/(tabs)/statistics.tsx`
- No back button (it is a root tab screen)
- `headerShown: false` (consistent with other tabs)

---

## Data Sources

### 1. Transactions
- Reuse existing query: `QUERY_KEYS.transactions.all` → `fetchTransactions()`
- No new API call; filter client-side

### 2. Monthly Budget
- New API function: `getMonthBudget(month: string): Promise<MonthBudgetResponse>` in `src/shared/api/budgets.ts`
- Endpoint: `GET /budgets/month/<encodeURIComponent(month)>`
- Month string format: `YYYY-MM-01 00:00:00` (e.g. `"2026-04-01 00:00:00"`)
- Types copied from frontend: `MonthBudgetRow`, `MonthBudgetResponse`
- Query key: `QUERY_KEYS.budgets.month(monthStr)` — added to `queryKeys.ts`

---

## Architecture (Approach C — thin hook + pure lib)

```
src/shared/api/budgets.ts
src/shared/constants/queryKeys.ts          ← add budgets.month(m)

src/features/categorySpending/
└── CategorySpendingScreen/
    ├── CategorySpendingScreen.tsx          max 150 lines
    ├── useCategorySpendingScreen.ts        max 50 lines
    ├── lib/
    │   └── aggregateCategorySpending.ts    pure function
    ├── MonthSwitcher.tsx
    ├── BudgetSummaryCard.tsx
    └── CategoryCard.tsx                    includes SubCategoryItem inline

src/app/(tabs)/
├── _layout.tsx                             add tab
└── statistics.tsx                          new route
```

---

## Hook: `useCategorySpendingScreen`

State:
- `selectedMonth: Date` — initialized to `new Date()` (current month, day forced to 1)

Derived:
- `monthStr: string` — `format(selectedMonth, 'yyyy-MM-01 00:00:00')`  
  (use manual formatting, no date-fns dependency needed)

Queries (parallel):
- `useQuery({ queryKey: QUERY_KEYS.transactions.all, queryFn: fetchTransactions })`
- `useQuery({ queryKey: QUERY_KEYS.budgets.month(monthStr), queryFn: () => getMonthBudget(monthStr) })`

Handlers:
- `handlePrevMonth()` — subtract 1 month from `selectedMonth`
- `handleNextMonth()` — add 1 month; disabled if `selectedMonth >= startOfMonth(today)`

Returns:
- `selectedMonth`, `handlePrevMonth`, `handleNextMonth`, `isNextDisabled`
- `isLoading`, `isError`
- `rows: CategorySpendingRow[]` — result of `aggregateCategorySpending(...)`
- `summary: { totalBudget, totalSpent, remaining, percent }`

---

## Pure Function: `aggregateCategorySpending`

Signature:
```ts
aggregateCategorySpending(
  transactions: Transaction[],
  budgetRows: MonthBudgetRow[],
  selectedMonth: Date,
): { rows: CategorySpendingRow[]; summary: BudgetSummary }
```

Steps:
1. Filter transactions: `type === WalletTransactionType.expense` AND `transactionTime` falls within `selectedMonth` (same year + month)
2. Compute `totalSpentAllCategories` (sum of all filtered, in kopecks)
3. Group by `categoryId` (null key = "Без категории")
4. For each group, sub-group by `subCategoryId`
5. Match category-level budget: `budgetRows.find(r => r.category?.id === categoryId && r.subCategory === null)`
6. Match subcategory-level budget: `budgetRows.find(r => r.subCategory?.id === subCategoryId)`
7. Budget value = `row.baseBudget + row.additionalBudget` (in kopecks)
8. Sort all rows by `totalSpent` descending (including "Без категории")
9. Compute `totalBudget` = sum of all category-level budget rows (not subcategory rows)

Types:
```ts
type SubCategorySpendingRow = {
  subCategoryId: string | null
  subCategoryName: string
  totalSpent: number        // kopecks
  budget: number | null     // kopecks, null = no budget
  percentOfTotal: number    // % of all expenses
}

type CategorySpendingRow = {
  categoryId: string | null
  categoryName: string
  categoryIcon: string | null
  categoryColor: string | null
  totalSpent: number        // kopecks
  budget: number | null     // kopecks, null = no budget
  percentOfTotal: number    // % of all expenses
  subCategories: SubCategorySpendingRow[]
}

type BudgetSummary = {
  totalBudget: number       // kopecks
  totalSpent: number        // kopecks
}
```

---

## Components

### `CategorySpendingScreen`
- `SafeAreaView` wrapper
- `MonthSwitcher` at top
- `BudgetSummaryCard` (hidden if `totalBudget === 0`)
- `FlatList` of `CategoryCard` (key = `categoryId ?? 'uncategorized'`)
- Loading: `ActivityIndicator`
- Error: error text
- Empty (no expenses): placeholder text "Нет расходов за этот месяц"

### `MonthSwitcher`
- Left `TouchableOpacity` with `ChevronLeft`
- Center: month name (lowercase, nominative case) + year
- Right `TouchableOpacity` with `ChevronRight`, `disabled={isNextDisabled}`
- Month names array in Russian (nominative): январь…декабрь

### `BudgetSummaryCard`
- Three-column stat row: Бюджет / Потрачено / Остаток
- Amounts displayed in UAH (kopecks ÷ 100), formatted with `uk-UA` locale
- Progress bar below: overall % used
- Progress color: < 80% blue gradient, 80–100% amber, > 100% dim-blue + red overflow

### `CategoryCard`
Props: `row: CategorySpendingRow`, `totalExpenses: number`
- Icon box: uses `row.categoryColor` for background tint; falls back to `#44445A` if null; uses `row.categoryIcon` as Lucide icon name, falls back to `tag`
- Subcategory count badge (hidden if 0)
- Tap toggles expanded state (local `useState`) — only if `subCategories.length > 0`
- Chevron hidden (`opacity: 0`) if no subcategories
- Progress bar with same color logic as summary card
- Expanded: renders inline `SubCategoryItem` list

### `SubCategoryItem`
Props: `row: SubCategorySpendingRow`, `totalExpenses: number`
- Dot indicator (red tinted if exceeded)
- Name, amount (red if exceeded), % of total
- Small progress bar
- Budget meta row (italic "бюджет не установлен" if `budget === null`)

---

## Progress Bar Color Logic

```
pct = totalSpent / budget * 100
if budget === null     → empty track (no fill)
if pct < 80            → fill-normal  (accent-blue)
if pct >= 80 && <=100  → fill-warning (accent-amber)
if pct > 100           → fill-exceeded (dim blue at 100%) + overflow fill (red at min((pct-100)/100 * width, 100%))
```

For overflow bar width: `overflowPct = Math.min((pct - 100) / 100, 1)` → maps visually to track width.

---

## Edge Cases

| Situation | Behavior |
|-----------|----------|
| No expenses this month | Empty list, BudgetSummaryCard hidden, placeholder text shown |
| Category has no budget row | Progress track empty, budget label hidden |
| `totalBudget === 0` | BudgetSummaryCard hidden entirely |
| Transaction `category` is null | Grouped under "Без категории", icon=`tag`, color=muted |
| Both queries loading | Single `ActivityIndicator` |
| Budget query error | Show error state (don't block showing transactions) |

---

## Design Reference

`designs/screens/category-spending.html` — authoritative visual spec. All colors, spacing, typography from design system tokens (NativeWind / inline colors matching `--accent-*` CSS vars).

Amounts: API in kopecks → divide by 100 for display.
Locale: `uk-UA` for number formatting.

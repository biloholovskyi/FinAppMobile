# Category Spending Screen — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Статистика" tab that shows expense transactions grouped by category for a selected month, overlaid with monthly budget data and progress bars.

**Architecture:** Thin hook (`useCategorySpendingScreen`) handles month state + parallel queries; pure function `aggregateCategorySpending` handles filtering, grouping, sorting, and budget matching; UI components are dumb and receive pre-computed data. Matches the existing dashboard pattern.

**Tech Stack:** React Native, Expo Router v3, NativeWind v4, TanStack Query v5, lucide-react-native, TypeScript strict.

**Spec:** `docs/superpowers/specs/2026-04-10-category-spending-design.md`
**Design:** `designs/screens/category-spending.html`

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/shared/api/budgets.ts` | `getMonthBudget` API call + types |
| Modify | `src/shared/constants/queryKeys.ts` | Add `budgets.month(m)` key |
| Create | `src/features/categorySpending/CategorySpendingScreen/lib/aggregateCategorySpending.ts` | Pure aggregation function + types |
| Create | `src/features/categorySpending/CategorySpendingScreen/useCategorySpendingScreen.ts` | Month state + queries |
| Create | `src/features/categorySpending/CategorySpendingScreen/MonthSwitcher.tsx` | Month navigation UI |
| Create | `src/features/categorySpending/CategorySpendingScreen/BudgetSummaryCard.tsx` | Total budget summary |
| Create | `src/features/categorySpending/CategorySpendingScreen/CategoryCard.tsx` | Per-category card + subcategory items |
| Create | `src/features/categorySpending/CategorySpendingScreen/CategorySpendingScreen.tsx` | Root screen component |
| Create | `src/app/(tabs)/statistics.tsx` | Expo Router route |
| Modify | `src/app/(tabs)/_layout.tsx` | Add Statistics tab |

---

## Task 1: Budget API + Query Keys

**Files:**
- Create: `src/shared/api/budgets.ts`
- Modify: `src/shared/constants/queryKeys.ts`

- [ ] **Step 1: Create `src/shared/api/budgets.ts`**

```ts
import { apiClient } from './base'

type CategoryRef = {
  id: string
  name: string
}

export type MonthBudgetRow = {
  id: string
  baseBudget: number
  additionalBudget: number
  category: CategoryRef | null
  subCategory: CategoryRef | null
}

export type MonthBudgetResponse = {
  budgetRows: MonthBudgetRow[]
}

export const getMonthBudget = async (month: string): Promise<MonthBudgetResponse> => {
  const { data } = await apiClient.get<MonthBudgetResponse>(
    '/budgets/month/' + encodeURIComponent(month),
  )
  return data
}
```

- [ ] **Step 2: Update `src/shared/constants/queryKeys.ts`**

Replace the entire file:

```ts
export const QUERY_KEYS = {
  transactions: {
    all: ['transactions'] as const,
  },
  wallets: {
    all: ['wallets'] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  budgets: {
    month: (month: string) => ['budgets', 'month', month] as const,
  },
} as const
```

- [ ] **Step 3: Run lint**

```bash
rtk yarn lint
```

Expected: no errors.

---

## Task 2: Aggregation Library + Types

**Files:**
- Create: `src/features/categorySpending/CategorySpendingScreen/lib/aggregateCategorySpending.ts`

- [ ] **Step 1: Create `src/features/categorySpending/CategorySpendingScreen/lib/aggregateCategorySpending.ts`**

```ts
import type { Transaction } from '@/entities/transaction'
import { WalletTransactionType } from '@/entities/transaction'
import type { MonthBudgetRow } from '@/shared/api/budgets'

export type SubCategorySpendingRow = {
  subCategoryId: string
  subCategoryName: string
  totalSpent: number       // kopecks
  budget: number | null    // kopecks, null = no budget row
  percentOfTotal: number   // % of all expenses this month
}

export type CategorySpendingRow = {
  categoryId: string | null
  categoryName: string
  categoryIcon: string | null
  categoryColor: string | null
  totalSpent: number       // kopecks
  budget: number | null    // kopecks, null = no budget row
  percentOfTotal: number   // % of all expenses this month
  subCategories: SubCategorySpendingRow[]
}

export type BudgetSummary = {
  totalBudget: number      // kopecks — sum of all category-level budget rows
  totalSpent: number       // kopecks — sum of all expense transactions this month
}

export type AggregateResult = {
  rows: CategorySpendingRow[]
  summary: BudgetSummary
}

export function aggregateCategorySpending(
  transactions: Transaction[],
  budgetRows: MonthBudgetRow[],
  selectedMonth: Date,
): AggregateResult {
  const year = selectedMonth.getFullYear()
  const month = selectedMonth.getMonth()

  // 1. Filter: expense type + correct month
  const expenses = transactions.filter((t) => {
    if (t.type !== WalletTransactionType.expense) return false
    const d = new Date(t.transactionTime)
    return d.getFullYear() === year && d.getMonth() === month
  })

  if (expenses.length === 0) {
    const totalBudget = budgetRows
      .filter((r) => r.category !== null && r.subCategory === null)
      .reduce((sum, r) => sum + r.baseBudget + r.additionalBudget, 0)
    return { rows: [], summary: { totalBudget, totalSpent: 0 } }
  }

  const totalSpentAll = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0)

  // 2. Group by categoryId
  type SubAccum = { name: string; total: number }
  type CatAccum = {
    name: string
    icon: string | null
    color: string | null
    total: number
    subMap: Map<string, SubAccum>
  }
  const categoryMap = new Map<string | null, CatAccum>()

  for (const t of expenses) {
    const catKey = t.categoryId ?? null

    if (!categoryMap.has(catKey)) {
      categoryMap.set(catKey, {
        name: t.category?.name ?? 'Без категории',
        icon: t.category?.icon ?? null,
        color: t.category?.color ?? null,
        total: 0,
        subMap: new Map(),
      })
    }

    const catEntry = categoryMap.get(catKey)!
    catEntry.total += Math.abs(t.amount)

    if (t.subCategoryId) {
      if (!catEntry.subMap.has(t.subCategoryId)) {
        catEntry.subMap.set(t.subCategoryId, {
          name: t.subCategory?.name ?? t.subCategoryId,
          total: 0,
        })
      }
      catEntry.subMap.get(t.subCategoryId)!.total += Math.abs(t.amount)
    }
  }

  // 3. Build result rows
  const rows: CategorySpendingRow[] = []

  for (const [catId, catData] of categoryMap) {
    // Match category-level budget (subCategory must be null)
    const catBudgetRow = catId
      ? budgetRows.find((r) => r.category?.id === catId && r.subCategory === null)
      : null
    const catBudget = catBudgetRow
      ? catBudgetRow.baseBudget + catBudgetRow.additionalBudget
      : null

    // Build subcategory rows
    const subCategories: SubCategorySpendingRow[] = []
    for (const [subId, subData] of catData.subMap) {
      const subBudgetRow = budgetRows.find((r) => r.subCategory?.id === subId)
      const subBudget = subBudgetRow
        ? subBudgetRow.baseBudget + subBudgetRow.additionalBudget
        : null

      subCategories.push({
        subCategoryId: subId,
        subCategoryName: subData.name,
        totalSpent: subData.total,
        budget: subBudget,
        percentOfTotal: (subData.total / totalSpentAll) * 100,
      })
    }

    subCategories.sort((a, b) => b.totalSpent - a.totalSpent)

    rows.push({
      categoryId: catId,
      categoryName: catData.name,
      categoryIcon: catData.icon,
      categoryColor: catData.color,
      totalSpent: catData.total,
      budget: catBudget,
      percentOfTotal: (catData.total / totalSpentAll) * 100,
      subCategories,
    })
  }

  // 4. Sort all rows by totalSpent descending (including "Без категории")
  rows.sort((a, b) => b.totalSpent - a.totalSpent)

  // 5. Total budget = sum of category-level rows only
  const totalBudget = budgetRows
    .filter((r) => r.category !== null && r.subCategory === null)
    .reduce((sum, r) => sum + r.baseBudget + r.additionalBudget, 0)

  return { rows, summary: { totalBudget, totalSpent: totalSpentAll } }
}
```

- [ ] **Step 2: Run lint**

```bash
rtk yarn lint
```

Expected: no errors.

---

## Task 3: Hook

**Files:**
- Create: `src/features/categorySpending/CategorySpendingScreen/useCategorySpendingScreen.ts`

- [ ] **Step 1: Create `useCategorySpendingScreen.ts`**

```ts
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchTransactions } from '@/shared/api/transactions'
import { getMonthBudget } from '@/shared/api/budgets'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import { aggregateCategorySpending } from './lib/aggregateCategorySpending'
import type { AggregateResult } from './lib/aggregateCategorySpending'

function toMonthStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}-01 00:00:00`
}

export function useCategorySpendingScreen(): {
  selectedMonth: Date
  monthStr: string
  handlePrevMonth: () => void
  handleNextMonth: () => void
  isNextDisabled: boolean
  isLoading: boolean
  isError: boolean
  rows: AggregateResult['rows']
  summary: AggregateResult['summary']
} {
  const today = new Date()
  const [selectedMonth, setSelectedMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  )

  const monthStr = toMonthStr(selectedMonth)
  const todayMonthStr = toMonthStr(new Date(today.getFullYear(), today.getMonth(), 1))

  const { data: transactions = [], isLoading: txLoading, isError: txError } = useQuery({
    queryKey: QUERY_KEYS.transactions.all,
    queryFn: fetchTransactions,
  })

  const { data: budgetData, isLoading: budgetLoading, isError: budgetError } = useQuery({
    queryKey: QUERY_KEYS.budgets.month(monthStr),
    queryFn: () => getMonthBudget(monthStr),
  })

  const { rows, summary } = aggregateCategorySpending(
    transactions,
    budgetData?.budgetRows ?? [],
    selectedMonth,
  )

  const handlePrevMonth = () => {
    setSelectedMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setSelectedMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }

  return {
    selectedMonth,
    monthStr,
    handlePrevMonth,
    handleNextMonth,
    isNextDisabled: monthStr >= todayMonthStr,
    isLoading: txLoading || budgetLoading,
    isError: txError || budgetError,
    rows,
    summary,
  }
}
```

- [ ] **Step 2: Run lint + TypeScript check**

```bash
rtk yarn lint && rtk yarn tsc --noEmit
```

Expected: no errors.

---

## Task 4: MonthSwitcher Component

**Files:**
- Create: `src/features/categorySpending/CategorySpendingScreen/MonthSwitcher.tsx`

- [ ] **Step 1: Create `MonthSwitcher.tsx`**

```tsx
import { View, Text, TouchableOpacity } from 'react-native'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'

const MONTH_NAMES_RU = [
  'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь',
]

type Props = {
  selectedMonth: Date
  onPrev: () => void
  onNext: () => void
  isNextDisabled: boolean
}

export function MonthSwitcher({ selectedMonth, onPrev, onNext, isNextDisabled }: Props) {
  return (
    <View className="flex-row items-center justify-between bg-[#10101C] border border-white/[0.08] rounded-2xl px-3.5 py-2.5">
      <TouchableOpacity
        onPress={onPrev}
        className="w-8 h-8 items-center justify-center bg-[#181828] border border-white/[0.08] rounded-lg"
        activeOpacity={0.7}
      >
        <ChevronLeft size={16} color="#F2F2FF" />
      </TouchableOpacity>

      <View className="items-center gap-0.5">
        <Text className="text-[#F2F2FF] text-[15px] font-bold capitalize" style={{ fontFamily: 'Syne_700Bold' }}>
          {MONTH_NAMES_RU[selectedMonth.getMonth()]}
        </Text>
        <Text className="text-[#8888AA] text-[11px]">
          {selectedMonth.getFullYear()}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onNext}
        disabled={isNextDisabled}
        className="w-8 h-8 items-center justify-center bg-[#181828] border border-white/[0.08] rounded-lg"
        activeOpacity={0.7}
        style={{ opacity: isNextDisabled ? 0.3 : 1 }}
      >
        <ChevronRight size={16} color="#F2F2FF" />
      </TouchableOpacity>
    </View>
  )
}
```

- [ ] **Step 2: Run lint**

```bash
rtk yarn lint
```

Expected: no errors.

---

## Task 5: BudgetSummaryCard Component

**Files:**
- Create: `src/features/categorySpending/CategorySpendingScreen/BudgetSummaryCard.tsx`

- [ ] **Step 1: Create `BudgetSummaryCard.tsx`**

```tsx
import { View, Text } from 'react-native'
import type { BudgetSummary } from './lib/aggregateCategorySpending'

function formatUah(kopecks: number): string {
  return (kopecks / 100).toLocaleString('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 })
}

function getProgressColor(pct: number): string {
  if (pct > 100) return 'rgba(79,158,255,0.35)'
  if (pct >= 80) return '#FFB020'
  return '#4F9EFF'
}

type Props = {
  summary: BudgetSummary
}

export function BudgetSummaryCard({ summary }: Props) {
  const { totalBudget, totalSpent } = summary

  if (totalBudget === 0) return null

  const remaining = totalBudget - totalSpent
  const pct = (totalSpent / totalBudget) * 100
  const fillPct = Math.min(pct, 100)
  const overflowPct = pct > 100 ? Math.min((pct - 100) / 100, 1) * 100 : 0
  const fillColor = getProgressColor(pct)

  return (
    <View className="bg-[#10101C] border border-white/[0.08] rounded-2xl p-3.5 gap-3">
      <Text className="text-[#8888AA] text-[11px] font-medium uppercase tracking-widest">
        Бюджет на месяц
      </Text>

      <View className="flex-row justify-between">
        <View className="gap-0.5">
          <Text className="text-[#8888AA] text-[11px]">Бюджет</Text>
          <Text className="text-[#F2F2FF] text-[14px] font-bold" style={{ fontFamily: 'SpaceMono_700Bold' }}>
            {formatUah(totalBudget)}
          </Text>
        </View>
        <View className="items-center gap-0.5">
          <Text className="text-[#8888AA] text-[11px]">Потрачено</Text>
          <Text className="text-[#F2F2FF] text-[14px] font-bold" style={{ fontFamily: 'SpaceMono_700Bold' }}>
            {formatUah(totalSpent)}
          </Text>
          <Text className="text-[#8888AA] text-[11px]">{pct.toFixed(1)}%</Text>
        </View>
        <View className="items-end gap-0.5">
          <Text className="text-[#8888AA] text-[11px]">Остаток</Text>
          <Text
            className="text-[14px] font-bold"
            style={{ fontFamily: 'SpaceMono_700Bold', color: remaining >= 0 ? '#00E089' : '#FF4B6B' }}
          >
            {formatUah(Math.abs(remaining))}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View className="gap-1">
        <View className="h-[7px] bg-[#181828] rounded-full overflow-hidden">
          <View
            style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fillPct}%`, backgroundColor: fillColor, borderRadius: 99 }}
          />
          {overflowPct > 0 && (
            <View
              style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${overflowPct}%`, backgroundColor: '#FF4B6B', borderRadius: 99 }}
            />
          )}
        </View>
        <View className="flex-row justify-between">
          <Text className="text-[#44445A] text-[10px]">₴0</Text>
          <Text className="text-[#44445A] text-[10px]">{pct.toFixed(1)}% использовано</Text>
          <Text className="text-[#44445A] text-[10px]">{formatUah(totalBudget)}</Text>
        </View>
      </View>
    </View>
  )
}
```

- [ ] **Step 2: Run lint**

```bash
rtk yarn lint
```

Expected: no errors.

---

## Task 6: CategoryCard Component

**Files:**
- Create: `src/features/categorySpending/CategorySpendingScreen/CategoryCard.tsx`

- [ ] **Step 1: Create `CategoryCard.tsx`**

```tsx
import { useState, useCallback } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import {
  ShoppingCart, Car, Gamepad2, Zap, HeartPulse, Shirt, Tag, Home,
  UtensilsCrossed, Plane, Coffee, Dumbbell, Baby, Gift, BookOpen,
  Music, Smartphone, Banknote, ShoppingBag, Pill, Wrench, GraduationCap,
} from 'lucide-react-native'
import { ChevronDown } from 'lucide-react-native'
import type { CategorySpendingRow, SubCategorySpendingRow } from './lib/aggregateCategorySpending'

// ── Icon resolution ──────────────────────────────────────────────────────────
type LucideIcon = React.ComponentType<{ size?: number; color?: string }>

const ICON_MAP: Record<string, LucideIcon> = {
  'shopping-cart': ShoppingCart,
  'car': Car,
  'gamepad-2': Gamepad2,
  'zap': Zap,
  'heart-pulse': HeartPulse,
  'shirt': Shirt,
  'home': Home,
  'utensils-crossed': UtensilsCrossed,
  'plane': Plane,
  'coffee': Coffee,
  'dumbbell': Dumbbell,
  'baby': Baby,
  'gift': Gift,
  'book-open': BookOpen,
  'music': Music,
  'smartphone': Smartphone,
  'banknote': Banknote,
  'shopping-bag': ShoppingBag,
  'pill': Pill,
  'wrench': Wrench,
  'graduation-cap': GraduationCap,
}

function resolveIcon(name: string | null): LucideIcon {
  if (!name) return Tag
  return ICON_MAP[name] ?? Tag
}

// ── Progress helpers ─────────────────────────────────────────────────────────
function getProgressColor(pct: number): string {
  if (pct > 100) return 'rgba(79,158,255,0.35)'
  if (pct >= 80) return '#FFB020'
  return '#4F9EFF'
}

function formatUah(kopecks: number): string {
  return (kopecks / 100).toLocaleString('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 })
}

function formatPct(n: number): string {
  return n.toFixed(1) + '%'
}

// ── SubCategoryItem ──────────────────────────────────────────────────────────
function SubCategoryItem({ row, totalExpenses }: { row: SubCategorySpendingRow; totalExpenses: number }) {
  const hasBudget = row.budget !== null && row.budget > 0
  const pct = hasBudget ? (row.totalSpent / row.budget!) * 100 : 0
  const fillPct = Math.min(pct, 100)
  const overflowPct = pct > 100 ? Math.min((pct - 100) / 100, 1) * 100 : 0
  const isExceeded = pct > 100
  const fillColor = getProgressColor(pct)

  return (
    <View className="gap-1.5">
      <View className="flex-row items-center gap-2">
        <View
          className="w-[5px] h-[5px] rounded-full"
          style={{ backgroundColor: isExceeded ? 'rgba(255,75,107,0.6)' : '#44445A' }}
        />
        <Text className="text-[#8888AA] text-[13px] flex-1">{row.subCategoryName}</Text>
        <Text
          className="text-[12px] font-bold"
          style={{ fontFamily: 'SpaceMono_700Bold', color: isExceeded ? '#FF4B6B' : '#F2F2FF' }}
        >
          {formatUah(row.totalSpent)}
        </Text>
        <Text className="text-[#44445A] text-[11px] w-[34px] text-right">
          {formatPct((row.totalSpent / totalExpenses) * 100)}
        </Text>
      </View>

      <View className="pl-[13px]">
        <View
          className="h-[5px] rounded-full overflow-hidden"
          style={{ backgroundColor: hasBudget ? '#181828' : 'rgba(255,255,255,0.03)' }}
        >
          {hasBudget && (
            <View
              style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fillPct}%`, backgroundColor: fillColor, borderRadius: 99 }}
            />
          )}
          {overflowPct > 0 && (
            <View
              style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${overflowPct}%`, backgroundColor: '#FF4B6B', borderRadius: 99 }}
            />
          )}
        </View>
      </View>

      <View className="flex-row justify-between pl-[13px]">
        {hasBudget ? (
          <>
            <Text className="text-[#44445A] text-[10px]">
              {formatUah(row.totalSpent)} из {formatUah(row.budget!)}
              {pct > 0 ? ` · ${pct.toFixed(0)}%` : ''}
            </Text>
            {isExceeded ? (
              <Text className="text-[#FF4B6B] text-[10px] font-semibold">
                +{formatUah(row.totalSpent - row.budget!)}
              </Text>
            ) : (
              <Text className="text-[#44445A] text-[10px]">{pct.toFixed(0)}%</Text>
            )}
          </>
        ) : (
          <Text className="text-[#44445A] text-[10px] italic">бюджет не установлен</Text>
        )}
      </View>
    </View>
  )
}

// ── CategoryCard ─────────────────────────────────────────────────────────────
type Props = {
  row: CategorySpendingRow
  totalExpenses: number
}

export function CategoryCard({ row, totalExpenses }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const hasSubCategories = row.subCategories.length > 0

  const handlePress = useCallback(() => {
    if (hasSubCategories) setIsOpen((v) => !v)
  }, [hasSubCategories])

  const hasBudget = row.budget !== null && row.budget > 0
  const pct = hasBudget ? (row.totalSpent / row.budget!) * 100 : 0
  const fillPct = Math.min(pct, 100)
  const overflowPct = pct > 100 ? Math.min((pct - 100) / 100, 1) * 100 : 0
  const isExceeded = pct > 100
  const fillColor = getProgressColor(pct)

  const IconComponent = resolveIcon(row.categoryIcon)
  const iconColor = row.categoryColor ?? '#44445A'
  const iconBg = iconColor + '26' // 15% opacity hex

  return (
    <View
      className="bg-[#10101C] rounded-2xl overflow-hidden"
      style={{ borderWidth: 1, borderColor: isOpen ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)' }}
    >
      {/* Header */}
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={hasSubCategories ? 0.7 : 1}
        className="p-3.5 gap-2.5"
      >
        {/* Top row */}
        <View className="flex-row items-center gap-2.5">
          <View className="w-9 h-9 rounded-lg items-center justify-center" style={{ backgroundColor: iconBg }}>
            <IconComponent size={18} color={iconColor} />
          </View>

          <View className="flex-1 min-w-0">
            <View className="flex-row items-center gap-1.5 flex-wrap">
              <Text className="text-[#F2F2FF] text-[14px] font-semibold">{row.categoryName}</Text>
              {hasSubCategories && (
                <View className="bg-[#181828] rounded-full px-1.5 py-[1px]">
                  <Text className="text-[#44445A] text-[10px]">{row.subCategories.length}</Text>
                </View>
              )}
            </View>
            {hasBudget && (
              <Text className="text-[#44445A] text-[11px] mt-0.5">
                Бюджет: {formatUah(row.budget!)}
              </Text>
            )}
          </View>

          <View className="items-end gap-1 shrink-0">
            <Text
              className="text-[13px] font-bold"
              style={{ fontFamily: 'SpaceMono_700Bold', color: isExceeded ? '#FF4B6B' : '#F2F2FF' }}
            >
              {formatUah(row.totalSpent)}
            </Text>
            <View
              className="rounded-full px-[7px] py-[2px]"
              style={{ backgroundColor: isExceeded ? 'rgba(255,75,107,0.2)' : 'rgba(79,158,255,0.25)' }}
            >
              <Text
                className="text-[11px] font-medium"
                style={{ color: isExceeded ? '#FF4B6B' : '#4F9EFF' }}
              >
                {formatPct(row.percentOfTotal)}
              </Text>
            </View>
          </View>

          <View style={{ opacity: hasSubCategories ? 1 : 0 }}>
            <ChevronDown
              size={15}
              color={isOpen ? '#4F9EFF' : '#44445A'}
              style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
            />
          </View>
        </View>

        {/* Progress bar */}
        {hasBudget && (
          <View className="gap-1.5">
            <View className="h-[7px] bg-[#181828] rounded-full overflow-hidden">
              <View
                style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fillPct}%`, backgroundColor: fillColor, borderRadius: 99 }}
              />
              {overflowPct > 0 && (
                <View
                  style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${overflowPct}%`, backgroundColor: '#FF4B6B', borderRadius: 99 }}
                />
              )}
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[#8888AA] text-[10px]">
                {formatUah(row.totalSpent)} из {formatUah(row.budget!)} · {pct.toFixed(0)}%
              </Text>
              {isExceeded ? (
                <Text className="text-[#FF4B6B] text-[10px] font-semibold">
                  +{formatUah(row.totalSpent - row.budget!)} превышение
                </Text>
              ) : (
                <Text className="text-[#FFB020] text-[10px]" style={{ color: pct >= 80 ? '#FFB020' : '#8888AA' }}>
                  осталось {formatUah(row.budget! - row.totalSpent)}
                </Text>
              )}
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Subcategory list */}
      {isOpen && hasSubCategories && (
        <View className="border-t border-white/[0.04] px-3.5 pb-3.5 pt-2 gap-3">
          {row.subCategories.map((sub) => (
            <SubCategoryItem key={sub.subCategoryId} row={sub} totalExpenses={totalExpenses} />
          ))}
        </View>
      )}
    </View>
  )
}
```

- [ ] **Step 2: Run lint**

```bash
rtk yarn lint
```

Expected: no errors.

---

## Task 7: CategorySpendingScreen

**Files:**
- Create: `src/features/categorySpending/CategorySpendingScreen/CategorySpendingScreen.tsx`

- [ ] **Step 1: Create `CategorySpendingScreen.tsx`**

```tsx
import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCategorySpendingScreen } from './useCategorySpendingScreen'
import { MonthSwitcher } from './MonthSwitcher'
import { BudgetSummaryCard } from './BudgetSummaryCard'
import { CategoryCard } from './CategoryCard'
import type { CategorySpendingRow } from './lib/aggregateCategorySpending'

export function CategorySpendingScreen() {
  const {
    selectedMonth,
    handlePrevMonth,
    handleNextMonth,
    isNextDisabled,
    isLoading,
    isError,
    rows,
    summary,
  } = useCategorySpendingScreen()

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A12]">
      <View className="px-4 py-3">
        <Text className="text-[#F2F2FF] text-xl font-bold" style={{ fontFamily: 'Syne_700Bold' }}>
          Статистика
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#4F9EFF" size="large" />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-[#8888AA] text-center text-[14px]">
            Не удалось загрузить данные
          </Text>
        </View>
      ) : (
        <FlatList<CategorySpendingRow>
          data={rows}
          keyExtractor={(item) => item.categoryId ?? 'uncategorized'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 10 }}
          ListHeaderComponent={
            <View className="gap-2.5 pb-2.5">
              <MonthSwitcher
                selectedMonth={selectedMonth}
                onPrev={handlePrevMonth}
                onNext={handleNextMonth}
                isNextDisabled={isNextDisabled}
              />
              <BudgetSummaryCard summary={summary} />
              {rows.length > 0 && (
                <Text className="text-[#8888AA] text-[11px] font-medium uppercase tracking-widest px-0.5">
                  По категориям
                </Text>
              )}
            </View>
          }
          ListEmptyComponent={
            <View className="items-center py-12">
              <Text className="text-[#8888AA] text-[14px]">Нет расходов за этот месяц</Text>
            </View>
          }
          renderItem={({ item }) => (
            <CategoryCard row={item} totalExpenses={summary.totalSpent} />
          )}
        />
      )}
    </SafeAreaView>
  )
}
```

- [ ] **Step 2: Run lint**

```bash
rtk yarn lint
```

Expected: no errors.

---

## Task 8: Route + Tab

**Files:**
- Create: `src/app/(tabs)/statistics.tsx`
- Modify: `src/app/(tabs)/_layout.tsx`

- [ ] **Step 1: Create `src/app/(tabs)/statistics.tsx`**

```tsx
import { CategorySpendingScreen } from '@/features/categorySpending/CategorySpendingScreen/CategorySpendingScreen'

export default function StatisticsRoute() {
  return <CategorySpendingScreen />
}
```

- [ ] **Step 2: Update `src/app/(tabs)/_layout.tsx`** — add Statistics tab

```tsx
import { Tabs } from 'expo-router'
import { Home, List, PieChart } from 'lucide-react-native'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#10101C',
          borderTopColor: 'rgba(255,255,255,0.04)',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#4F9EFF',
        tabBarInactiveTintColor: '#44445A',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Главная',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Статистика',
          tabBarIcon: ({ color, size }) => <PieChart color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="operations"
        options={{
          title: 'Операции',
          tabBarIcon: ({ color, size }) => <List color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}
```

- [ ] **Step 3: Run lint + TypeScript check**

```bash
rtk yarn lint && rtk yarn tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Manual smoke test**

Start the dev server and verify:
```bash
rtk npx expo start --clear
```

Check:
- "Статистика" tab appears between "Главная" and "Операции"
- Tapping the tab opens the screen
- Month switcher shows current month; "→" button is disabled
- "←" navigates to previous months; budget query fires per month
- Expense transactions appear grouped by category, sorted by amount
- Categories with budget show progress bar (correct color at <80%, 80-100%, >100%)
- Categories with subcategories expand on tap
- "Без категории" group appears if uncategorized expenses exist
- BudgetSummaryCard is hidden when no budget rows for the month
- Empty state shown when no expenses for the selected month

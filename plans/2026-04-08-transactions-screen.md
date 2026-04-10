# Transactions Screen + Transaction Edit Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the operations (transactions list) screen and a stack-based transaction edit screen for fin-app-mobile.

**Architecture:** Feature-per-screen pattern matching DashboardScreen. `features/operations/` handles the list, `features/transaction-edit/` handles the edit form. Shared infrastructure (entity types, API functions, query keys) updated first. Navigation via Expo Router stack: `/transaction/[id]`.

**Tech Stack:** React Native 0.81, Expo Router v6, NativeWind v4, TanStack React Query v5, `react-native-ui-datepicker` + `dayjs`, TypeScript 5.9

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Install | `package.json` | Add `react-native-ui-datepicker`, `dayjs` |
| Modify | `src/entities/transaction/index.ts` | Add `TransactionCategoryRef`, extend `Transaction` with populated `wallet`/`category`/`subCategory` |
| Modify | `src/shared/api/transactions.ts` | Add `createTransaction`, `updateTransaction`, `deleteTransaction`, `TransactionDto` |
| Create | `src/shared/api/categories.ts` | `getCategories()` → `CategoryDto[]` |
| Modify | `src/shared/constants/queryKeys.ts` | Add `categories.all` key |
| Create | `src/features/operations/lib/groupTransactionsByDate.ts` | Pure grouping function |
| Create | `src/features/operations/OperationsScreen/useOperationsScreen.ts` | Data, filter state, navigation handlers |
| Modify | `src/features/operations/OperationsScreen/OperationsScreen.tsx` | Replace placeholder |
| Create | `src/features/operations/OperationsScreen/TransactionItem.tsx` | Single transaction row component |
| Modify | `src/app/_layout.tsx` | Register `transaction/[id]` in root Stack |
| Create | `src/app/transaction/[id].tsx` | Route file — renders TransactionEditScreen |
| Create | `src/features/transaction-edit/TransactionEditScreen/useTransactionEditScreen.ts` | Edit form state + actions |
| Create | `src/features/transaction-edit/TransactionEditScreen/WalletPickerModal.tsx` | Modal for wallet selection |
| Create | `src/features/transaction-edit/TransactionEditScreen/CategoryPickerModal.tsx` | Modal for category + subcategory |
| Create | `src/features/transaction-edit/TransactionEditScreen/DatePickerModal.tsx` | Modal wrapping react-native-ui-datepicker |
| Create | `src/features/transaction-edit/TransactionEditScreen/TransactionEditScreen.tsx` | Main edit form component |

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add packages**

```bash
yarn add react-native-ui-datepicker dayjs
```

`react-native-ui-datepicker` is pure JavaScript — no native linking, works in Expo Go.

- [ ] **Step 2: Verify install**

```bash
rtk yarn tsc --noEmit
```

Expected: no errors.

---

## Task 2: Update Transaction Entity

**Files:**
- Modify: `src/entities/transaction/index.ts`

- [ ] **Step 1: Replace file contents**

```typescript
// src/entities/transaction/index.ts
export enum WalletTransactionType {
  expense = 'expense',
  income = 'income',
  transfer = 'transfer',
}

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
  amount: number             // in kopecks (integer)
  description: string
  transactionTime: string    // ISO 8601
  externalId: string | null
  createdAt: string
  updatedAt: string
  wallet: { id: string; name: string; currency: string }
  category: TransactionCategoryRef | null
  subCategory: TransactionCategoryRef | null
}
```

- [ ] **Step 2: Verify**

```bash
rtk yarn tsc --noEmit
```

Expected: 0 errors (the added fields are non-breaking additions).

---

## Task 3: Update Shared API + Query Keys

**Files:**
- Modify: `src/shared/api/transactions.ts`
- Create: `src/shared/api/categories.ts`
- Modify: `src/shared/constants/queryKeys.ts`

- [ ] **Step 1: Replace `src/shared/api/transactions.ts`**

```typescript
// src/shared/api/transactions.ts
import { apiClient } from './base'
import type { Transaction, WalletTransactionType } from '@/entities/transaction'

export type TransactionDto = {
  walletId: string
  amount: number
  type?: WalletTransactionType
  categoryId?: string | null
  subCategoryId?: string | null
  targetWalletId?: string
  description?: string | null
  transactionTime: string
}

export const fetchTransactions = (): Promise<Transaction[]> =>
  apiClient.get<Transaction[]>('/wallets/transactions').then(r => r.data)

export const createTransaction = (body: TransactionDto): Promise<Transaction> =>
  apiClient.post<Transaction>('/wallets/transactions', body).then(r => r.data)

export const updateTransaction = (id: string, body: TransactionDto): Promise<Transaction> =>
  apiClient.patch<Transaction>(`/wallets/transactions/${id}`, body).then(r => r.data)

export const deleteTransaction = (id: string): Promise<void> =>
  apiClient.delete(`/wallets/transactions/${id}`).then(() => undefined)
```

- [ ] **Step 2: Create `src/shared/api/categories.ts`**

```typescript
// src/shared/api/categories.ts
import { apiClient } from './base'

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

export const getCategories = (): Promise<CategoryDto[]> =>
  apiClient.get<CategoryDto[]>('/categories').then(r => r.data)
```

- [ ] **Step 3: Update `src/shared/constants/queryKeys.ts`**

```typescript
// src/shared/constants/queryKeys.ts
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
} as const
```

- [ ] **Step 4: Verify**

```bash
rtk yarn tsc --noEmit
```

Expected: 0 errors.

---

## Task 4: Group-By-Date Utility

**Files:**
- Create: `src/features/operations/lib/groupTransactionsByDate.ts`

- [ ] **Step 1: Create utility**

```typescript
// src/features/operations/lib/groupTransactionsByDate.ts
import type { Transaction } from '@/entities/transaction'

export type TransactionGroup = {
  date: string    // YYYY-MM-DD (local), used as SectionList key
  label: string   // "Сегодня" / "Вчера" / "8 апреля 2026"
  total: number   // kopecks, net signed sum for the day
  items: Transaction[]
}

function getLocalDateKey(isoString: string): string {
  // toLocaleDateString('sv-SE') returns YYYY-MM-DD in local timezone
  return new Date(isoString).toLocaleDateString('sv-SE')
}

function getDayLabel(dateKey: string): string {
  const today = new Date().toLocaleDateString('sv-SE')
  const yesterday = new Date(Date.now() - 86_400_000).toLocaleDateString('sv-SE')
  if (dateKey === today) return 'Сегодня'
  if (dateKey === yesterday) return 'Вчера'
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function groupTransactionsByDate(transactions: Transaction[]): TransactionGroup[] {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.transactionTime).getTime() - new Date(a.transactionTime).getTime(),
  )

  const map = new Map<string, Transaction[]>()
  for (const tx of sorted) {
    const key = getLocalDateKey(tx.transactionTime)
    const group = map.get(key) ?? []
    group.push(tx)
    map.set(key, group)
  }

  return Array.from(map.entries()).map(([date, items]) => ({
    date,
    label: getDayLabel(date),
    total: items.reduce((sum, tx) => sum + tx.amount, 0),
    items,
  }))
}
```

- [ ] **Step 2: Verify**

```bash
rtk yarn tsc --noEmit
```

Expected: 0 errors.

---

## Task 5: useOperationsScreen Hook

**Files:**
- Create: `src/features/operations/OperationsScreen/useOperationsScreen.ts`

- [ ] **Step 1: Create hook**

```typescript
// src/features/operations/OperationsScreen/useOperationsScreen.ts
import { useState, useCallback } from 'react'
import { Alert } from 'react-native'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { fetchTransactions, deleteTransaction } from '@/shared/api/transactions'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import { WalletTransactionType } from '@/entities/transaction'
import { groupTransactionsByDate } from '../lib/groupTransactionsByDate'

export type FilterType = 'all' | WalletTransactionType

export const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'Все', value: 'all' },
  { label: 'Расходы', value: WalletTransactionType.expense },
  { label: 'Доходы', value: WalletTransactionType.income },
  { label: 'Переводы', value: WalletTransactionType.transfer },
]

export function useOperationsScreen() {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<FilterType>('all')

  const { data: transactions = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: QUERY_KEYS.transactions.all,
    queryFn: fetchTransactions,
  })

  const filtered =
    filter === 'all' ? transactions : transactions.filter(tx => tx.type === filter)

  const groups = groupTransactionsByDate(filtered)

  const handleEdit = useCallback((id: string) => {
    router.push(`/transaction/${id}` as never)
  }, [])

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert('Удалить транзакцию?', 'Это действие нельзя отменить.', [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            await deleteTransaction(id)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all })
          },
        },
      ])
    },
    [queryClient],
  )

  return { groups, isLoading, isRefetching, filter, setFilter, refetch, handleEdit, handleDelete }
}
```

- [ ] **Step 2: Verify**

```bash
rtk yarn tsc --noEmit
```

Expected: 0 errors.

---

## Task 6: TransactionItem Component

**Files:**
- Create: `src/features/operations/OperationsScreen/TransactionItem.tsx`

- [ ] **Step 1: Create component**

```typescript
// src/features/operations/OperationsScreen/TransactionItem.tsx
import { Pressable, Text, View } from 'react-native'
import type { Transaction } from '@/entities/transaction'
import { WalletTransactionType } from '@/entities/transaction'

type Props = {
  transaction: Transaction
  onPress: () => void
}

function formatAmount(kopecks: number): string {
  return (Math.abs(kopecks) / 100).toLocaleString('uk-UA', { maximumFractionDigits: 2 })
}

function getAmountPrefix(type: WalletTransactionType | null): string {
  if (type === WalletTransactionType.income) return '+'
  if (type === WalletTransactionType.expense) return '−'
  return ''
}

// Converts "#RRGGBB" to "rgba(r,g,b,alpha)"
function hexToRgba(hex: string, alpha: number): string {
  if (!hex?.startsWith('#') || hex.length < 7) return `rgba(79,158,255,${alpha})`
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export function TransactionItem({ transaction: tx, onPress }: Props) {
  const isPositive = tx.amount >= 0
  const amountColor = isPositive ? '#00E089' : '#FF4B6B'
  const prefix = getAmountPrefix(tx.type)

  // List: show subCategory name if set, else category name
  const categoryLabel = tx.subCategory?.name ?? tx.category?.name ?? null
  const categoryColor = tx.subCategory?.color ?? tx.category?.color ?? '#4F9EFF'

  const time = new Date(tx.transactionTime).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      className="flex-row items-center gap-3 py-2.5"
    >
      <View className="flex-1 min-w-0">
        <Text className="text-[13px] font-medium text-[#F2F2FF]" numberOfLines={1}>
          {tx.description || '—'}
        </Text>
        <View className="flex-row items-center gap-1.5 mt-0.5 flex-wrap">
          {categoryLabel ? (
            <View
              style={{
                backgroundColor: hexToRgba(categoryColor, 0.15),
                borderRadius: 999,
                paddingHorizontal: 7,
                paddingVertical: 2,
              }}
            >
              <Text style={{ color: categoryColor, fontSize: 10, fontWeight: '500' }}>
                {categoryLabel}
              </Text>
            </View>
          ) : null}
          <Text className="text-[10px] text-[#44445A]" numberOfLines={1}>
            {tx.wallet?.name ?? ''}
          </Text>
        </View>
      </View>
      <View className="items-end gap-0.5">
        <Text style={{ color: amountColor, fontSize: 13, fontWeight: '700', letterSpacing: -0.3 }}>
          {prefix}{formatAmount(tx.amount)} ₴
        </Text>
        <Text className="text-[10px] text-[#44445A]">{time}</Text>
      </View>
    </Pressable>
  )
}
```

- [ ] **Step 2: Verify**

```bash
rtk yarn tsc --noEmit
```

Expected: 0 errors.

---

## Task 7: OperationsScreen Component

**Files:**
- Modify: `src/features/operations/OperationsScreen/OperationsScreen.tsx`

- [ ] **Step 1: Replace file contents**

```typescript
// src/features/operations/OperationsScreen/OperationsScreen.tsx
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Plus } from 'lucide-react-native'
import { FILTERS, useOperationsScreen } from './useOperationsScreen'
import { TransactionItem } from './TransactionItem'
import type { TransactionGroup } from '../lib/groupTransactionsByDate'
import type { Transaction } from '@/entities/transaction'

function formatTotal(kopecks: number): string {
  const sign = kopecks >= 0 ? '+' : '−'
  const value = (Math.abs(kopecks) / 100).toLocaleString('uk-UA', { maximumFractionDigits: 2 })
  return `${sign}${value} ₴`
}

function DayHeader({ group }: { group: TransactionGroup }) {
  const color = group.total >= 0 ? '#00E089' : '#FF4B6B'
  return (
    <View className="flex-row justify-between items-center py-2.5 bg-[#0A0A12]">
      <Text className="text-[11px] font-semibold text-[#8888AA] uppercase tracking-wider">
        {group.label}
      </Text>
      {group.total !== 0 && (
        <Text style={{ color, fontSize: 12, fontWeight: '700', letterSpacing: -0.3 }}>
          {formatTotal(group.total)}
        </Text>
      )}
    </View>
  )
}

export function OperationsScreen() {
  const { groups, isLoading, isRefetching, filter, setFilter, refetch, handleEdit } =
    useOperationsScreen()

  const sections = groups.map(g => ({ ...g, key: g.date, data: g.items }))

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A12]">
      {/* Header */}
      <View className="flex-row justify-between items-end px-5 pt-4 pb-2.5">
        <View>
          <Text className="text-[22px] font-bold text-[#F2F2FF]" style={{ letterSpacing: -0.4 }}>
            Транзакции
          </Text>
        </View>
        <TouchableOpacity
          className="w-[34px] h-[34px] rounded-2xl bg-[#4F9EFF] items-center justify-center"
          activeOpacity={0.8}
        >
          <Plus size={18} color="#080810" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 12 }}
      >
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.value}
            onPress={() => setFilter(f.value)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: filter === f.value ? '#4F9EFF' : 'rgba(255,255,255,0.08)',
              backgroundColor: filter === f.value ? 'rgba(79,158,255,0.25)' : '#181828',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: filter === f.value ? '#4F9EFF' : '#8888AA',
              }}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#4F9EFF" />
        </View>
      ) : sections.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-[#8888AA] text-sm">Нет транзакций</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item: Transaction) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}
          renderSectionHeader={({ section }) => <DayHeader group={section as TransactionGroup} />}
          renderItem={({ item }: { item: Transaction }) => (
            <TransactionItem transaction={item} onPress={() => handleEdit(item.id)} />
          )}
          stickySectionHeadersEnabled={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#4F9EFF"
            />
          }
        />
      )}
    </SafeAreaView>
  )
}
```

- [ ] **Step 2: Run lint and type check**

```bash
rtk yarn lint
rtk yarn tsc --noEmit
```

Expected: 0 errors.

---

## Task 8: Root Layout + Transaction Route

**Files:**
- Modify: `src/app/_layout.tsx`
- Create: `src/app/transaction/[id].tsx`

- [ ] **Step 1: Update `src/app/_layout.tsx`** — add transaction route to Stack

```typescript
// src/app/_layout.tsx
import "../../global.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { queryClient } from "@/shared/lib/queryClient";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="transaction/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
```

- [ ] **Step 2: Create `src/app/transaction/[id].tsx`**

```typescript
// src/app/transaction/[id].tsx
import { useLocalSearchParams } from 'expo-router'
import { TransactionEditScreen } from '@/features/transaction-edit/TransactionEditScreen/TransactionEditScreen'

export default function TransactionRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return <TransactionEditScreen id={id} />
}
```

- [ ] **Step 3: Verify**

```bash
rtk yarn tsc --noEmit
```

Expected: error about missing `TransactionEditScreen` module — this is expected until Task 11 completes.

---

## Task 9: useTransactionEditScreen Hook

**Files:**
- Create: `src/features/transaction-edit/TransactionEditScreen/useTransactionEditScreen.ts`

- [ ] **Step 1: Create hook**

```typescript
// src/features/transaction-edit/TransactionEditScreen/useTransactionEditScreen.ts
import { useState, useCallback } from 'react'
import { Alert } from 'react-native'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import dayjs, { type Dayjs } from 'dayjs'
import {
  fetchTransactions,
  updateTransaction,
  deleteTransaction,
  type TransactionDto,
} from '@/shared/api/transactions'
import { getCategories } from '@/shared/api/categories'
import { getWallets } from '@/shared/api/wallets'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import { WalletTransactionType } from '@/entities/transaction'

function inferType(amount: number, type: WalletTransactionType | null): WalletTransactionType {
  if (type) return type
  return amount >= 0 ? WalletTransactionType.income : WalletTransactionType.expense
}

export function useTransactionEditScreen(id: string) {
  const queryClient = useQueryClient()

  const { data: transactions = [] } = useQuery({
    queryKey: QUERY_KEYS.transactions.all,
    queryFn: fetchTransactions,
  })
  const { data: wallets = [] } = useQuery({
    queryKey: QUERY_KEYS.wallets.all,
    queryFn: getWallets,
  })
  const { data: categories = [] } = useQuery({
    queryKey: QUERY_KEYS.categories.all,
    queryFn: getCategories,
  })

  const transaction = transactions.find(t => t.id === id)

  const [type, setTypeState] = useState<WalletTransactionType>(
    () => inferType(transaction?.amount ?? 0, transaction?.type ?? null),
  )
  const [amountStr, setAmountStr] = useState<string>(
    () => (transaction ? (Math.abs(transaction.amount) / 100).toString() : ''),
  )
  const [walletId, setWalletId] = useState<string>(() => transaction?.walletId ?? '')
  const [targetWalletId, setTargetWalletId] = useState<string>('')
  const [categoryId, setCategoryIdState] = useState<string | null>(
    () => transaction?.categoryId ?? null,
  )
  const [subCategoryId, setSubCategoryId] = useState<string | null>(
    () => transaction?.subCategoryId ?? null,
  )
  const [description, setDescription] = useState<string>(() => transaction?.description ?? '')
  const [date, setDate] = useState<Dayjs>(
    () => dayjs(transaction?.transactionTime ?? new Date()),
  )

  // Modal visibility
  const [isDatePickerVisible, setDatePickerVisible] = useState(false)
  const [isWalletPickerVisible, setWalletPickerVisible] = useState(false)
  const [isTargetWalletPickerVisible, setTargetWalletPickerVisible] = useState(false)
  const [isCategoryPickerVisible, setCategoryPickerVisible] = useState(false)
  const [isSubCategoryPickerVisible, setSubCategoryPickerVisible] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const selectedCategory = categories.find(c => c.id === categoryId) ?? null
  const hasSubCategories = (selectedCategory?.subCategory?.length ?? 0) > 0

  const handleTypeChange = useCallback((newType: WalletTransactionType) => {
    setTypeState(newType)
    if (newType === WalletTransactionType.transfer) {
      setCategoryIdState(null)
      setSubCategoryId(null)
    }
  }, [])

  const setCategoryId = useCallback((id: string | null) => {
    setCategoryIdState(id)
    setSubCategoryId(null)
  }, [])

  const handleSave = useCallback(async () => {
    const parsed = parseFloat(amountStr || '0')
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert('Ошибка', 'Укажите корректную сумму')
      return
    }
    const kopecks = Math.round(parsed * 100)
    const signedAmount =
      type === WalletTransactionType.expense ? -Math.abs(kopecks) : Math.abs(kopecks)

    const body: TransactionDto = {
      walletId,
      amount: signedAmount,
      type,
      categoryId: type === WalletTransactionType.transfer ? null : categoryId,
      subCategoryId: type === WalletTransactionType.transfer ? null : subCategoryId,
      targetWalletId:
        type === WalletTransactionType.transfer ? targetWalletId || undefined : undefined,
      description: description || null,
      transactionTime: date.toISOString(),
    }

    setIsSaving(true)
    try {
      await updateTransaction(id, body)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all })
      router.back()
    } catch {
      Alert.alert('Ошибка', 'Не удалось сохранить транзакцию')
    } finally {
      setIsSaving(false)
    }
  }, [id, type, amountStr, walletId, targetWalletId, categoryId, subCategoryId, description, date, queryClient])

  const handleDelete = useCallback(() => {
    Alert.alert('Удалить транзакцию?', 'Это действие нельзя отменить.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          await deleteTransaction(id)
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all })
          router.back()
        },
      },
    ])
  }, [id, queryClient])

  return {
    transaction,
    wallets,
    categories,
    selectedCategory,
    hasSubCategories,
    type, handleTypeChange,
    amountStr, setAmountStr,
    walletId, setWalletId,
    targetWalletId, setTargetWalletId,
    categoryId, setCategoryId,
    subCategoryId, setSubCategoryId,
    description, setDescription,
    date, setDate,
    isDatePickerVisible, setDatePickerVisible,
    isWalletPickerVisible, setWalletPickerVisible,
    isTargetWalletPickerVisible, setTargetWalletPickerVisible,
    isCategoryPickerVisible, setCategoryPickerVisible,
    isSubCategoryPickerVisible, setSubCategoryPickerVisible,
    isSaving, handleSave, handleDelete,
  }
}
```

> **Note:** This hook exceeds the 50-line guideline due to inherent complexity (3 data sources, 8 form fields, 5 modal states). If splitting is needed later, extract modal visibility into `useTransactionEditModals.ts`.

- [ ] **Step 2: Verify**

```bash
rtk yarn tsc --noEmit
```

Expected: 0 errors (or only the missing component file error from Task 8).

---

## Task 10: Picker Modals

**Files:**
- Create: `src/features/transaction-edit/TransactionEditScreen/WalletPickerModal.tsx`
- Create: `src/features/transaction-edit/TransactionEditScreen/CategoryPickerModal.tsx`
- Create: `src/features/transaction-edit/TransactionEditScreen/DatePickerModal.tsx`

- [ ] **Step 1: Create `WalletPickerModal.tsx`**

```typescript
// src/features/transaction-edit/TransactionEditScreen/WalletPickerModal.tsx
import { FlatList, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'
import { X } from 'lucide-react-native'
import type { Wallet } from '@/entities/wallet'

type Props = {
  visible: boolean
  wallets: Wallet[]
  selectedId: string
  onSelect: (id: string) => void
  onClose: () => void
  title?: string
}

export function WalletPickerModal({
  visible, wallets, selectedId, onSelect, onClose, title = 'Кошелёк',
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}
        onPress={onClose}
      />
      <View style={{ backgroundColor: '#10101C', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 32 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: '#F2F2FF', fontSize: 17, fontWeight: '700' }}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={20} color="#8888AA" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={wallets}
          keyExtractor={w => w.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => { onSelect(item.id); onClose() }}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(255,255,255,0.04)',
                backgroundColor: item.id === selectedId ? 'rgba(79,158,255,0.1)' : 'transparent',
              }}
            >
              <Text style={{ color: '#F2F2FF', fontSize: 15 }}>{item.name}</Text>
              {item.id === selectedId && (
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#4F9EFF' }} />
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  )
}
```

- [ ] **Step 2: Create `CategoryPickerModal.tsx`**

```typescript
// src/features/transaction-edit/TransactionEditScreen/CategoryPickerModal.tsx
import { FlatList, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'
import { X } from 'lucide-react-native'
import type { CategoryDto, SubCategoryDto } from '@/shared/api/categories'

type NoneItem = { id: null; name: string; color: string }
type CategoryItem = CategoryDto | NoneItem
type SubCatItem = SubCategoryDto | NoneItem

function PickerShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} onPress={onClose} />
      <View style={{ backgroundColor: '#10101C', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 32, maxHeight: '60%' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: '#F2F2FF', fontSize: 17, fontWeight: '700' }}>{title}</Text>
          <TouchableOpacity onPress={onClose}><X size={20} color="#8888AA" /></TouchableOpacity>
        </View>
        {children}
      </View>
    </Modal>
  )
}

function PickerRow({ label, selected, color, onPress }: { label: string; selected: boolean; color?: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingVertical: 14,
        borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)',
        backgroundColor: selected ? 'rgba(79,158,255,0.1)' : 'transparent',
      }}
    >
      <Text style={{ color: color ?? '#F2F2FF', fontSize: 15 }}>{label}</Text>
      {selected && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#4F9EFF' }} />}
    </TouchableOpacity>
  )
}

export function CategoryPickerModal({ visible, categories, selectedId, onSelect, onClose }: {
  visible: boolean; categories: CategoryDto[]; selectedId: string | null
  onSelect: (id: string | null) => void; onClose: () => void
}) {
  const data: CategoryItem[] = [{ id: null, name: 'Без категории', color: '#8888AA' }, ...categories]
  return (
    <PickerShell title="Категория" onClose={onClose}>
      <FlatList
        data={data}
        keyExtractor={item => item.id ?? '__none__'}
        renderItem={({ item }) => (
          <PickerRow label={item.name} selected={selectedId === item.id} color={item.color}
            onPress={() => { onSelect(item.id); onClose() }} />
        )}
      />
    </PickerShell>
  )
}

export function SubCategoryPickerModal({ visible, subCategories, selectedId, onSelect, onClose }: {
  visible: boolean; subCategories: SubCategoryDto[]; selectedId: string | null
  onSelect: (id: string | null) => void; onClose: () => void
}) {
  const data: SubCatItem[] = [{ id: null, name: 'Без подкатегории', color: '#8888AA' }, ...subCategories]
  return (
    <PickerShell title="Подкатегория" onClose={onClose}>
      <FlatList
        data={data}
        keyExtractor={item => item.id ?? '__none__'}
        renderItem={({ item }) => (
          <PickerRow label={item.name} selected={selectedId === item.id} color={item.color}
            onPress={() => { onSelect(item.id); onClose() }} />
        )}
      />
    </PickerShell>
  )
}
```

- [ ] **Step 3: Create `DatePickerModal.tsx`**

```typescript
// src/features/transaction-edit/TransactionEditScreen/DatePickerModal.tsx
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'
import DateTimePicker from 'react-native-ui-datepicker'
import type { Dayjs } from 'dayjs'

type Props = {
  visible: boolean
  date: Dayjs
  onChange: (date: Dayjs) => void
  onClose: () => void
}

export function DatePickerModal({ visible, date, onChange, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} onPress={onClose} />
      <View style={{ backgroundColor: '#10101C', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: '#F2F2FF', fontSize: 17, fontWeight: '700' }}>Дата и время</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: '#4F9EFF', fontSize: 15 }}>Готово</Text>
          </TouchableOpacity>
        </View>
        <DateTimePicker
          mode="single"
          date={date}
          timePicker
          onChange={({ date: d }) => { if (d) onChange(d as Dayjs) }}
          locale="ru"
          calendarTextStyle={{ color: '#F2F2FF' }}
          headerTextStyle={{ color: '#F2F2FF', fontWeight: '700' }}
          headerButtonColor="#4F9EFF"
          weekDaysTextStyle={{ color: '#8888AA' }}
          selectedItemColor="#4F9EFF"
          selectedTextStyle={{ color: '#080810', fontWeight: '700' }}
          todayTextStyle={{ color: '#4F9EFF' }}
          todayContainerStyle={{ borderColor: '#4F9EFF', borderWidth: 1 }}
          timePickerTextStyle={{ color: '#F2F2FF' }}
          timePickerIndicatorStyle={{ backgroundColor: 'rgba(79,158,255,0.15)' }}
        />
      </View>
    </Modal>
  )
}
```

> **Note:** `react-native-ui-datepicker` style prop names may vary between versions. Check `node_modules/react-native-ui-datepicker/README.md` if visual adjustments are needed.

- [ ] **Step 4: Verify**

```bash
rtk yarn tsc --noEmit
```

Expected: 0 errors.

---

## Task 11: TransactionEditScreen Component

**Files:**
- Create: `src/features/transaction-edit/TransactionEditScreen/TransactionEditScreen.tsx`

- [ ] **Step 1: Create component**

```typescript
// src/features/transaction-edit/TransactionEditScreen/TransactionEditScreen.tsx
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'
import { WalletTransactionType } from '@/entities/transaction'
import { useTransactionEditScreen } from './useTransactionEditScreen'
import { WalletPickerModal } from './WalletPickerModal'
import { CategoryPickerModal, SubCategoryPickerModal } from './CategoryPickerModal'
import { DatePickerModal } from './DatePickerModal'

const TYPES = [
  { label: 'Расход', value: WalletTransactionType.expense },
  { label: 'Доход', value: WalletTransactionType.income },
  { label: 'Перевод', value: WalletTransactionType.transfer },
]

const TYPE_COLORS = {
  [WalletTransactionType.expense]: { active: '#FF4B6B', bg: 'rgba(255,75,107,0.2)', prefix: '−' },
  [WalletTransactionType.income]:  { active: '#00E089', bg: 'rgba(0,224,137,0.2)',  prefix: '+' },
  [WalletTransactionType.transfer]:{ active: '#4F9EFF', bg: 'rgba(79,158,255,0.25)', prefix: '' },
}

function FormRow({ label, value, onPress }: { label: string; value: string; onPress?: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)', gap: 12 }}
    >
      <View style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: '#181828', alignItems: 'center', justifyContent: 'center' }}>
        <ChevronRight size={14} color="#8888AA" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#8888AA', fontSize: 11, fontWeight: '500' }}>{label}</Text>
        <Text style={{ color: value ? '#F2F2FF' : '#44445A', fontSize: 14, fontWeight: '500', marginTop: 1 }}>
          {value || 'Не выбрано'}
        </Text>
      </View>
      {onPress && <ChevronRight size={16} color="#44445A" />}
    </TouchableOpacity>
  )
}

export function TransactionEditScreen({ id }: { id: string }) {
  const s = useTransactionEditScreen(id)
  const tc = TYPE_COLORS[s.type]
  const selectedWallet = s.wallets.find(w => w.id === s.walletId)
  const selectedTargetWallet = s.wallets.find(w => w.id === s.targetWalletId)
  const selectedSubCat = s.selectedCategory?.subCategory?.find(sc => sc.id === s.subCategoryId)

  if (!s.transaction) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A12', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#4F9EFF" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A12' }}>
      {/* Nav bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <ChevronLeft size={18} color="#4F9EFF" />
          <Text style={{ color: '#4F9EFF', fontSize: 14, fontWeight: '500' }}>Назад</Text>
        </TouchableOpacity>
        <Text style={{ color: '#F2F2FF', fontSize: 17, fontWeight: '700', letterSpacing: -0.3 }}>Редактировать</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Type segment */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
          <View style={{ flexDirection: 'row', backgroundColor: '#181828', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', padding: 4, gap: 2 }}>
            {TYPES.map(t => {
              const isActive = s.type === t.value
              const color = TYPE_COLORS[t.value]
              return (
                <TouchableOpacity
                  key={t.value}
                  onPress={() => s.handleTypeChange(t.value)}
                  style={{ flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', backgroundColor: isActive ? color.bg : 'transparent' }}
                >
                  <Text style={{ color: isActive ? color.active : '#44445A', fontSize: 13, fontWeight: '600' }}>{t.label}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Amount */}
        <View style={{ alignItems: 'center', paddingBottom: 24, paddingHorizontal: 20 }}>
          <Text style={{ color: '#8888AA', fontSize: 11, fontWeight: '500', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Сумма</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', borderBottomWidth: 2, borderBottomColor: tc.active, paddingBottom: 10, width: '100%', justifyContent: 'center' }}>
            {tc.prefix ? <Text style={{ color: tc.active, fontSize: 42, fontWeight: '700' }}>{tc.prefix}</Text> : null}
            <TextInput
              value={s.amountStr}
              onChangeText={s.setAmountStr}
              keyboardType="decimal-pad"
              style={{ color: '#F2F2FF', fontSize: 42, fontWeight: '700', letterSpacing: -2, minWidth: 40, textAlign: 'center' }}
            />
            <Text style={{ color: '#8888AA', fontSize: 24, fontWeight: '700', marginLeft: 4 }}>₴</Text>
          </View>
        </View>

        {/* Form card */}
        <View style={{ marginHorizontal: 20, backgroundColor: '#10101C', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <FormRow label="Кошелёк" value={selectedWallet?.name ?? ''} onPress={() => s.setWalletPickerVisible(true)} />
          {s.type === WalletTransactionType.transfer && (
            <FormRow label="Кошелёк-получатель" value={selectedTargetWallet?.name ?? ''} onPress={() => s.setTargetWalletPickerVisible(true)} />
          )}
          {s.type !== WalletTransactionType.transfer && (
            <FormRow label="Категория" value={s.selectedCategory?.name ?? 'Без категории'} onPress={() => s.setCategoryPickerVisible(true)} />
          )}
          {s.type !== WalletTransactionType.transfer && s.hasSubCategories && (
            <FormRow label="Подкатегория" value={selectedSubCat?.name ?? 'Без подкатегории'} onPress={() => s.setSubCategoryPickerVisible(true)} />
          )}
          {/* Description inline input */}
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 }}>
            <View style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: '#181828', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={14} color="#8888AA" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#8888AA', fontSize: 11, fontWeight: '500' }}>Описание</Text>
              <TextInput
                value={s.description}
                onChangeText={s.setDescription}
                placeholder="Добавить описание..."
                placeholderTextColor="#44445A"
                style={{ color: '#F2F2FF', fontSize: 14, marginTop: 1 }}
              />
            </View>
          </View>
          <FormRow label="Дата и время" value={s.date.format('DD.MM.YYYY, HH:mm')} onPress={() => s.setDatePickerVisible(true)} />
        </View>

        {/* Action buttons */}
        <View style={{ padding: 20, gap: 10 }}>
          <TouchableOpacity
            onPress={s.handleSave}
            disabled={s.isSaving}
            style={{ backgroundColor: tc.active, borderRadius: 16, paddingVertical: 15, alignItems: 'center', opacity: s.isSaving ? 0.6 : 1 }}
          >
            <Text style={{ color: '#080810', fontSize: 15, fontWeight: '600' }}>
              {s.isSaving ? 'Сохранение...' : 'Сохранить'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={s.handleDelete} style={{ paddingVertical: 12, alignItems: 'center' }}>
            <Text style={{ color: '#FF4B6B', fontSize: 14, fontWeight: '500' }}>Удалить транзакцию</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Picker modals */}
      <WalletPickerModal visible={s.isWalletPickerVisible} wallets={s.wallets} selectedId={s.walletId} onSelect={s.setWalletId} onClose={() => s.setWalletPickerVisible(false)} />
      <WalletPickerModal visible={s.isTargetWalletPickerVisible} wallets={s.wallets.filter(w => w.id !== s.walletId)} selectedId={s.targetWalletId} onSelect={s.setTargetWalletId} onClose={() => s.setTargetWalletPickerVisible(false)} title="Кошелёк-получатель" />
      <CategoryPickerModal visible={s.isCategoryPickerVisible} categories={s.categories} selectedId={s.categoryId} onSelect={s.setCategoryId} onClose={() => s.setCategoryPickerVisible(false)} />
      <SubCategoryPickerModal visible={s.isSubCategoryPickerVisible} subCategories={s.selectedCategory?.subCategory ?? []} selectedId={s.subCategoryId} onSelect={s.setSubCategoryId} onClose={() => s.setSubCategoryPickerVisible(false)} />
      <DatePickerModal visible={s.isDatePickerVisible} date={s.date} onChange={s.setDate} onClose={() => s.setDatePickerVisible(false)} />
    </SafeAreaView>
  )
}
```

- [ ] **Step 2: Full lint + type check**

```bash
rtk yarn lint
rtk yarn tsc --noEmit
```

Expected: 0 errors.

---

## Task 12: Manual Verification

- [ ] **Step 1: Start dev server**

```bash
rtk npx expo start --clear
```

- [ ] **Step 2: Checklist**

1. Operations tab shows transactions grouped by date (Сегодня / Вчера / дата)
2. Filter pills (Все / Расходы / Доходы / Переводы) filter correctly
3. Pull-to-refresh reloads data
4. Empty state message when filter matches 0 transactions
5. Tapping a transaction navigates to edit screen with pre-filled data
6. Type segment changes prefix (− / + / blank) and save button color
7. Switching to Перевод hides category rows; switching back shows them
8. Selecting a category with subcategories → subcategory row appears
9. Selecting a category without subcategories → subcategory row hidden
10. Wallet picker lists wallets, selection updates the row
11. Category picker shows "Без категории" + all categories
12. Date picker opens dark-themed calendar + time selector
13. Save → navigates back, transaction updated in list
14. Delete → confirmation alert → navigates back, item removed

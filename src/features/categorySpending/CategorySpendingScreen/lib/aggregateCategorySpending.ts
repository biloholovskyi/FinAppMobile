import type { Transaction } from '@/entities/transaction'
import { WalletTransactionType } from '@/entities/transaction'
import type { MonthBudgetRow } from '@/shared/api/budgets'

export type SubCategorySpendingRow = {
  subCategoryId: string
  subCategoryName: string
  totalSpent: number // kopecks
  budget: number | null // kopecks, null = no budget row
  percentOfTotal: number // % of all expenses this month
}

export type CategorySpendingRow = {
  categoryId: string | null
  categoryName: string
  categoryIcon: string | null
  categoryColor: string | null
  totalSpent: number // kopecks
  budget: number | null // kopecks, null = no budget row
  percentOfTotal: number // % of all expenses this month
  subCategories: SubCategorySpendingRow[]
}

export type BudgetSummary = {
  totalBudget: number // kopecks — sum of all category-level budget rows
  totalSpent: number // kopecks — sum of all expense transactions this month
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

  // 1. Filter: expense type + correct month (UTC to avoid local-timezone shift)
  const expenses = transactions.filter((t) => {
    if (t.type !== WalletTransactionType.expense) return false
    const d = new Date(t.transactionTime)
    return d.getUTCFullYear() === year && d.getUTCMonth() === month
  })

  const totalBudget =
    budgetRows.reduce((sum, r) => sum + r.baseBudget + r.additionalBudget, 0) *
    100

  if (expenses.length === 0) {
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
    // Build subcategory rows first (needed for category budget calculation)
    const subCategories: SubCategorySpendingRow[] = []
    for (const [subId, subData] of catData.subMap) {
      const subBudgetRow = budgetRows.find((r) => r.subCategory?.id === subId)
      // Budgets from API are in hryvnias → convert to kopecks
      const subBudget = subBudgetRow
        ? (subBudgetRow.baseBudget + subBudgetRow.additionalBudget) * 100
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

    // Category budget:
    // - If budget rows exist for subcategories of this category → sum them
    //   (subcategory rows have category: null, subCategory.categoryId === catId)
    // - Otherwise → use the category-level budget row (subCategory: null)
    let catBudget: number | null
    const catSubBudgetRows = catId
      ? budgetRows.filter((r) => r.subCategory?.categoryId === catId)
      : []
    if (catSubBudgetRows.length > 0) {
      const totalUah = catSubBudgetRows.reduce(
        (sum, r) => sum + r.baseBudget + r.additionalBudget,
        0,
      )
      catBudget = totalUah > 0 ? totalUah * 100 : null
    } else if (catId) {
      const catBudgetRow = budgetRows.find(
        (r) => r.category?.id === catId && r.subCategory === null,
      )
      catBudget = catBudgetRow
        ? (catBudgetRow.baseBudget + catBudgetRow.additionalBudget) * 100 ||
          null
        : null
    } else {
      catBudget = null
    }

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

  return { rows, summary: { totalBudget, totalSpent: totalSpentAll } }
}

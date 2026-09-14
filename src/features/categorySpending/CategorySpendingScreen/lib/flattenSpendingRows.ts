import {
  PERCENT_MULTIPLIER,
  UNCATEGORIZED_SUB_LABEL,
} from '@/shared/constants'
import type {
  CategorySpendingRow,
  SubCategorySpendingRow,
} from './aggregateCategorySpending'

/** Ключ категории, к которой транзакции не отнесены. */
const UNCATEGORIZED_CATEGORY_KEY = 'uncategorized'

/**
 * Строка плоского списка расходов: подкатегория, остаток категории
 * или категория, у которой нет ни одной подкатегории.
 */
export type FlatSpendingRow = {
  /** Уникальный ключ строки для списка. */
  id: string
  name: string
  /** Имя родительской категории; `null` у категории без подкатегорий. */
  parentName: string | null
  icon: string | null
  color: string | null
  /** Сумма расходов в копейках. */
  totalSpent: number
  /** Бюджет в копейках; `null` — бюджет не установлен. */
  budget: number | null
  /** Доля в процентах от всех расходов месяца. */
  percentOfTotal: number
}

/** Ключ строки категории, общий для плоского и иерархического режимов. */
export function buildCategoryRowId(categoryId: string | null): string {
  return `cat:${categoryId ?? UNCATEGORIZED_CATEGORY_KEY}`
}

function sumSubCategorySpending(row: CategorySpendingRow): number {
  return row.subCategories.reduce((sum, sub) => sum + sub.totalSpent, 0)
}

function toCategoryRow(row: CategorySpendingRow): FlatSpendingRow {
  return {
    id: buildCategoryRowId(row.categoryId),
    name: row.categoryName,
    parentName: null,
    icon: row.categoryIcon,
    color: row.categoryColor,
    totalSpent: row.totalSpent,
    budget: row.budget,
    percentOfTotal: row.percentOfTotal,
  }
}

function toSubCategoryRow(
  row: CategorySpendingRow,
  sub: SubCategorySpendingRow,
): FlatSpendingRow {
  return {
    id: `sub:${sub.subCategoryId}`,
    name: sub.subCategoryName,
    parentName: row.categoryName,
    icon: row.categoryIcon,
    color: row.categoryColor,
    totalSpent: sub.totalSpent,
    budget: sub.budget,
    percentOfTotal: sub.percentOfTotal,
  }
}

function toRemainderRow(
  row: CategorySpendingRow,
  remainder: number,
  totalSpent: number,
): FlatSpendingRow {
  return {
    id: `rest:${row.categoryId ?? UNCATEGORIZED_CATEGORY_KEY}`,
    name: UNCATEGORIZED_SUB_LABEL,
    parentName: row.categoryName,
    icon: row.categoryIcon,
    color: row.categoryColor,
    totalSpent: remainder,
    budget: null,
    percentOfTotal: (remainder / totalSpent) * PERCENT_MULTIPLIER,
  }
}

/**
 * Разворачивает агрегированные категории в плоский список.
 *
 * Категория с подкатегориями отдаёт строку на каждую подкатегорию и,
 * при положительном остатке, строку нераспределённых расходов.
 * Категория без подкатегорий отдаёт одну собственную строку.
 * Сумма результата всегда равна `totalSpent`.
 *
 * @param rows Агрегированные категории месяца.
 * @param totalSpent Сумма всех расходов месяца в копейках.
 */
export function flattenSpendingRows(
  rows: CategorySpendingRow[],
  totalSpent: number,
): FlatSpendingRow[] {
  if (totalSpent === 0) return []

  const flatRows: FlatSpendingRow[] = []

  for (const row of rows) {
    if (row.subCategories.length === 0) {
      flatRows.push(toCategoryRow(row))
      continue
    }

    for (const sub of row.subCategories) {
      flatRows.push(toSubCategoryRow(row, sub))
    }

    const remainder = row.totalSpent - sumSubCategorySpending(row)
    if (remainder > 0) {
      flatRows.push(toRemainderRow(row, remainder, totalSpent))
    }
  }

  return flatRows.sort((a, b) => b.totalSpent - a.totalSpent)
}

/** Элемент списка расходов: карточка категории либо строка плоского списка. */
export type SpendingListItem =
  | { kind: 'category'; row: CategorySpendingRow }
  | { kind: 'flat'; row: FlatSpendingRow }

/** Ключ элемента списка, уникальный в обоих режимах отображения. */
export function getSpendingListItemKey(item: SpendingListItem): string {
  switch (item.kind) {
    case 'category':
      return buildCategoryRowId(item.row.categoryId)
    case 'flat':
      return item.row.id
    default: {
      const unreachable: never = item
      return unreachable
    }
  }
}

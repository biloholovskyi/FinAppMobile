import type { Transaction } from '@/entities/transaction'
import type { MonthKey } from '@/shared/utils/kyivCalendar'
import { selectMonthExpenses } from './selectMonthExpenses'
import type { FlatSpendingRow } from '../CategorySpendingScreen/lib/flattenSpendingRows'

/** Ключ категории, к которой транзакции не отнесены. */
const UNCATEGORIZED_CATEGORY_KEY = 'uncategorized'

/** Префиксы ключей листов; совпадают с id строк `flattenSpendingRows`. */
const LEAF_PREFIX = {
  category: 'cat',
  subCategory: 'sub',
  remainder: 'rest',
} as const

/** Вид листа: категория без подкатегорий, подкатегория или остаток категории. */
export type SpendingLeafKind = keyof typeof LEAF_PREFIX

/** Разобранный ключ листа. `targetId === null` — категория «Без категории». */
export type SpendingLeafKey = {
  kind: SpendingLeafKind
  targetId: string | null
}

/** Ключ листа-категории (`cat:<id|uncategorized>`). */
export function buildCategoryLeafKey(categoryId: string | null): string {
  return `${LEAF_PREFIX.category}:${categoryId ?? UNCATEGORIZED_CATEGORY_KEY}`
}

/** Ключ листа-подкатегории (`sub:<id>`). */
export function buildSubCategoryLeafKey(subCategoryId: string): string {
  return `${LEAF_PREFIX.subCategory}:${subCategoryId}`
}

/** Ключ листа-остатка категории (`rest:<id|uncategorized>`). */
export function buildRemainderLeafKey(categoryId: string | null): string {
  return `${LEAF_PREFIX.remainder}:${categoryId ?? UNCATEGORIZED_CATEGORY_KEY}`
}

/**
 * Разбирает ключ листа.
 *
 * @returns `null`, если префикс неизвестен или идентификатор пуст.
 */
export function parseSpendingLeafKey(leafKey: string): SpendingLeafKey | null {
  const separatorIndex = leafKey.indexOf(':')
  if (separatorIndex === -1) return null
  const prefix = leafKey.slice(0, separatorIndex)
  const id = leafKey.slice(separatorIndex + 1)
  if (!id) return null

  const kind = (Object.keys(LEAF_PREFIX) as SpendingLeafKind[]).find(
    (k) => LEAF_PREFIX[k] === prefix,
  )
  if (!kind) return null

  const isCategoryScoped = kind !== 'subCategory'
  const targetId = isCategoryScoped && id === UNCATEGORIZED_CATEGORY_KEY ? null : id
  return { kind, targetId }
}

function matchesLeaf(transaction: Transaction, leaf: SpendingLeafKey): boolean {
  switch (leaf.kind) {
    case 'category':
      return (transaction.categoryId ?? null) === leaf.targetId
    case 'subCategory':
      return transaction.subCategoryId === leaf.targetId
    case 'remainder':
      return (transaction.categoryId ?? null) === leaf.targetId && !transaction.subCategoryId
    default: {
      const unreachable: never = leaf.kind
      return unreachable
    }
  }
}

/**
 * Транзакции листа за месяц: тот же отбор расходов, что у агрегатора,
 * поэтому сумма листа равна сумме его строки. Порядок не гарантируется.
 *
 * @param transactions Все загруженные транзакции.
 * @param leaf Разобранный ключ листа.
 * @param month Выбранный киевский месяц.
 */
export function filterLeafTransactions(
  transactions: Transaction[],
  leaf: SpendingLeafKey,
  month: MonthKey,
): Transaction[] {
  return selectMonthExpenses(transactions, month)
    .map((expense) => expense.transaction)
    .filter((transaction) => matchesLeaf(transaction, leaf))
}

/** Строка листа среди строк плоского списка; `null`, если листа нет в месяце. */
export function findLeafRow(
  flatRows: FlatSpendingRow[],
  leafKey: string,
): FlatSpendingRow | null {
  return flatRows.find((row) => row.id === leafKey) ?? null
}

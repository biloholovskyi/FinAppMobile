import type { WalletControllerGetAllTransactions200 } from '@/shared/api/generated/models'
import type { Transaction } from '../index'

export type TransactionsPage = {
  items: Transaction[]
  total: number
  totalPages: number
}

/** Плоский ответ без пагинации считается единственной страницей. */
const SINGLE_PAGE_COUNT = 1

const EMPTY_PAGE: TransactionsPage = { items: [], total: 0, totalPages: 0 }

/**
 * Рантайм-ответ содержит `wallet`, `category` и `subCategory`, а
 * `WalletTransactionModel` в OpenAPI их не описывает — контрактный разрыв на
 * стороне бэкенда. Приведение к рендер-типу локализовано здесь.
 */
function toTransactions(items: unknown): Transaction[] {
  return items as Transaction[]
}

/**
 * Сужает union-ответ `GET /wallets/transactions` до одной формы и дефолтит
 * отсутствующие поля пагинации.
 */
export function normalizeTransactionsPage(
  response: WalletControllerGetAllTransactions200 | undefined,
): TransactionsPage {
  if (!response) {
    return EMPTY_PAGE
  }

  if (Array.isArray(response)) {
    const items = toTransactions(response)
    return { items, total: items.length, totalPages: SINGLE_PAGE_COUNT }
  }

  const items = toTransactions(response.data ?? [])
  const pagination = response.pagination

  return {
    items,
    total: pagination?.total ?? items.length,
    totalPages: pagination?.totalPages ?? SINGLE_PAGE_COUNT,
  }
}

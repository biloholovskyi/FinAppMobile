import type { InfiniteData } from '@tanstack/react-query'
import { walletControllerGetAllTransactions } from '@/shared/api/generated/wallets/wallets'
import {
  normalizeTransactionsPage,
  type Transaction,
  type TransactionsPage,
} from '@/entities/transaction'
import { getTransactionsDateWindow } from '@/shared/utils/dateWindows'
import {
  TRANSACTIONS_MAX_EMPTY_WINDOWS_COUNT,
  TRANSACTIONS_TOTAL_PROBE_LIMIT,
  TRANSACTIONS_WINDOW_PAGE_LIMIT,
} from '@/shared/constants'

/** Бэкенд нумерует страницы с единицы. */
const FIRST_PAGE_NUMBER = 1

/** Сколько страниц фида переживает pull-to-refresh. */
const KEPT_PAGES_ON_REFRESH = 1

export type TransactionsFeedPageParam = {
  windowIndex: number
  page: number
}

export type TransactionsFeedPage = TransactionsPage & TransactionsFeedPageParam

export type TransactionsFeedData = InfiniteData<TransactionsFeedPage, TransactionsFeedPageParam>

export const TRANSACTIONS_FEED_FIRST_PAGE: TransactionsFeedPageParam = {
  windowIndex: 0,
  page: FIRST_PAGE_NUMBER,
}

export async function fetchTransactionsFeedPage(
  { windowIndex, page }: TransactionsFeedPageParam,
  signal?: AbortSignal,
): Promise<TransactionsFeedPage> {
  const response = await walletControllerGetAllTransactions(
    { ...getTransactionsDateWindow(windowIndex), page, limit: TRANSACTIONS_WINDOW_PAGE_LIMIT },
    signal,
  )

  return { ...normalizeTransactionsPage(response), windowIndex, page }
}

/** Запрос без дат: `pagination.total` в нём — количество всех транзакций. */
export async function fetchTransactionsTotal(signal?: AbortSignal): Promise<number> {
  const response = await walletControllerGetAllTransactions(
    { page: FIRST_PAGE_NUMBER, limit: TRANSACTIONS_TOTAL_PROBE_LIMIT },
    signal,
  )

  return normalizeTransactionsPage(response).total
}

function countTrailingEmptyPages(pages: TransactionsFeedPage[]): number {
  let count = 0
  for (let i = pages.length - 1; i >= 0 && pages[i].items.length === 0; i -= 1) {
    count += 1
  }
  return count
}

/**
 * Пока в окне остались страницы — берётся следующая, иначе фид переходит к следующему окну.
 * Серия пустых окон подряд гасит фид: значит `total` разошёлся с реальностью.
 */
export function getNextTransactionsFeedPageParam(
  lastPage: TransactionsFeedPage,
  allPages: TransactionsFeedPage[],
): TransactionsFeedPageParam | undefined {
  if (lastPage.page < lastPage.totalPages) {
    return { windowIndex: lastPage.windowIndex, page: lastPage.page + 1 }
  }

  if (countTrailingEmptyPages(allPages) >= TRANSACTIONS_MAX_EMPTY_WINDOWS_COUNT) {
    return undefined
  }

  return { windowIndex: lastPage.windowIndex + 1, page: FIRST_PAGE_NUMBER }
}

/** Склеивает страницы в плоский список, отбрасывая повторы по `id`. */
export function mergeTransactionsFeedPages(
  pages: TransactionsFeedPage[] | undefined,
): Transaction[] {
  const seen = new Set<string>()
  const merged: Transaction[] = []

  for (const page of pages ?? []) {
    for (const item of page.items) {
      if (seen.has(item.id)) continue
      seen.add(item.id)
      merged.push(item)
    }
  }

  return merged
}

/** Откатывает фид к первому окну, чтобы refetch не перезапрашивал все загруженные страницы. */
export function trimFeedToFirstPage(
  data: TransactionsFeedData | undefined,
): TransactionsFeedData | undefined {
  if (!data) return data

  return {
    pages: data.pages.slice(0, KEPT_PAGES_ON_REFRESH),
    pageParams: data.pageParams.slice(0, KEPT_PAGES_ON_REFRESH),
  }
}

import { useCallback, useMemo } from 'react'
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants'
import {
  TRANSACTIONS_FEED_FIRST_PAGE,
  fetchTransactionsFeedPage,
  fetchTransactionsTotal,
  getNextTransactionsFeedPageParam,
  mergeTransactionsFeedPages,
  trimFeedToFirstPage,
  type TransactionsFeedData,
} from './transactionsFeed'

export function useTransactionsFeed() {
  const queryClient = useQueryClient()

  const { data, hasNextPage, fetchNextPage, isFetching, isFetchingNextPage, isLoading, isRefetching, refetch } =
    useInfiniteQuery({
      queryKey: QUERY_KEYS.transactions.feed,
      queryFn: ({ pageParam, signal }) => fetchTransactionsFeedPage(pageParam, signal),
      initialPageParam: TRANSACTIONS_FEED_FIRST_PAGE,
      getNextPageParam: getNextTransactionsFeedPageParam,
    })

  const { data: total } = useQuery({
    queryKey: QUERY_KEYS.transactions.total,
    queryFn: ({ signal }) => fetchTransactionsTotal(signal),
  })

  const transactions = useMemo(() => mergeTransactionsFeedPages(data?.pages), [data])

  // Конец списка определяется счётчиком, а не отсутствием следующей страницы:
  // окна конечны только по `total`, `hasNextPage` гаснет лишь на предохранителе.
  const hasMore = hasNextPage && (total === undefined || transactions.length < total)

  const loadMore = useCallback(() => {
    if (!hasMore || isFetching) return
    void fetchNextPage()
  }, [hasMore, isFetching, fetchNextPage])

  const refresh = useCallback(() => {
    queryClient.setQueryData<TransactionsFeedData>(QUERY_KEYS.transactions.feed, trimFeedToFirstPage)
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.total })
    void refetch()
  }, [queryClient, refetch])

  return {
    transactions,
    total,
    hasMore,
    loadMore,
    refresh,
    isLoading,
    isLoadingMore: isFetchingNextPage,
    isRefreshing: isRefetching,
  }
}

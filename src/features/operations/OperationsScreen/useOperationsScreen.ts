import { useEffect, useState } from 'react'
import { TRANSACTIONS_MIN_VISIBLE_ITEMS_COUNT } from '@/shared/constants'
import { useTransactionsFeed } from './useTransactionsFeed'
import { useTransactionsDayGroups, type FilterType } from './useTransactionsDayGroups'
import { useDeleteTransactionModal } from './useDeleteTransactionModal'

export { FILTERS } from './useTransactionsDayGroups'
export type { DayGroup, FilterType } from './useTransactionsDayGroups'

export function useOperationsScreen() {
  const [filter, setFilter] = useState<FilterType>('all')

  const { transactions, hasMore, loadMore, refresh, isLoading, isLoadingMore, isRefreshing } =
    useTransactionsFeed()
  const { sections, visibleCount } = useTransactionsDayGroups(transactions, filter)
  const deleteModal = useDeleteTransactionModal(transactions)

  // Короткий после фильтра список не даёт `onEndReached` — фид догружается сам.
  useEffect(() => {
    if (visibleCount < TRANSACTIONS_MIN_VISIBLE_ITEMS_COUNT) loadMore()
  }, [visibleCount, loadMore])

  return {
    filter,
    setFilter,
    grouped: sections,
    hasMore,
    loadMore,
    isLoading,
    isLoadingMore,
    refresh,
    isRefreshing,
    ...deleteModal,
  }
}

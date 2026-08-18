import { useCallback, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTransaction } from '@/shared/api/transactions'
import { QUERY_KEYS } from '@/shared/constants'
import type { Transaction } from '@/entities/transaction'

/** Состояние модалки удаления поверх уже загруженного фида. */
export function useDeleteTransactionModal(transactions: Transaction[]) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all })
      setPendingDeleteId(null)
    },
    onError: (error) => {
      console.error('Failed to delete transaction', error)
    },
  })

  const requestDelete = useCallback((tx: Transaction) => setPendingDeleteId(tx.id), [])
  const confirmDelete = useCallback(() => {
    if (pendingDeleteId) deleteMutate(pendingDeleteId)
  }, [pendingDeleteId, deleteMutate])
  const cancelDelete = useCallback(() => {
    if (!isDeleting) setPendingDeleteId(null)
  }, [isDeleting])

  return {
    pendingDelete: transactions.find((tx) => tx.id === pendingDeleteId) ?? null,
    requestDelete,
    confirmDelete,
    cancelDelete,
    isDeleting,
  }
}

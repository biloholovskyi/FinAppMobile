import { router } from 'expo-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTransaction, deleteTransaction } from '@/shared/api/transactions'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import { WalletTransactionType } from '@/entities/transaction'

type SavePayload = {
  type: WalletTransactionType
  amountStr: string
  description: string
  transactionTime: string
  categoryId: string | null
  subCategoryId: string | null
  targetWalletId: string | null
}

export function useEditTransactionActions(transactionId: string) {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all })
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallets.all })
  }

  const updateMutation = useMutation({
    mutationFn: (payload: SavePayload) =>
      updateTransaction(transactionId, {
        type: payload.type,
        amount: Math.round(parseFloat(payload.amountStr) * 100),
        description: payload.description || undefined,
        transactionTime: payload.transactionTime,
        categoryId: payload.categoryId,
        subCategoryId: payload.subCategoryId,
        targetWalletId: payload.targetWalletId,
      }),
    onSuccess: () => {
      invalidate()
      router.back()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteTransaction(transactionId),
    onSuccess: () => {
      invalidate()
      router.back()
    },
  })

  return {
    handleSave: updateMutation.mutate,
    handleDelete: deleteMutation.mutate,
    isSaving: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

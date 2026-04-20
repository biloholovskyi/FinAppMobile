import { router } from 'expo-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useWalletControllerCreateTransaction } from '@/shared/api/generated/wallets/wallets'
import { updateTransaction, deleteTransaction } from '@/shared/api/transactions'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import { WalletTransactionType } from '@/entities/transaction'

type SavePayload = {
  walletId?: string
  type: WalletTransactionType
  amountStr: string
  description: string
  transactionTime: string
  categoryId: string | null
  subCategoryId: string | null
  targetWalletId: string | null
}

export function useEditTransactionActions(transactionId: string | undefined) {
  const queryClient = useQueryClient()

  const invalidateAndBack = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all })
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallets.all })
    router.back()
  }

  const { mutate: create, isPending: isCreating } = useWalletControllerCreateTransaction({
    mutation: { onSuccess: invalidateAndBack },
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: (p: SavePayload) =>
      updateTransaction(transactionId!, {
        type: p.type,
        amount: p.amountStr,
        description: p.description || undefined,
        transactionTime: p.transactionTime,
        categoryId: p.categoryId,
        subCategoryId: p.subCategoryId,
        targetWalletId: p.targetWalletId,
      }),
    onSuccess: invalidateAndBack,
  })

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteTransaction(transactionId!),
    onSuccess: invalidateAndBack,
  })

  const handleSave = (payload: SavePayload) => {
    if (transactionId) {
      update(payload)
    } else {
      create({
        data: {
          walletId: payload.walletId,
          type: payload.type,
          amount: payload.amountStr,
          description: payload.description || undefined,
          transactionTime: payload.transactionTime,
          categoryId: payload.categoryId,
          subCategoryId: payload.subCategoryId,
          targetWalletId: payload.targetWalletId,
        },
      })
    }
  }

  return {
    handleSave,
    handleDelete: remove,
    isSaving: isCreating || isUpdating,
    isDeleting,
  }
}

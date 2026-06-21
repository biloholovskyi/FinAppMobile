import { useState } from 'react'
import { router } from 'expo-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useWalletControllerCreateTransaction } from '@/shared/api/generated/wallets/wallets'
import { updateTransaction, deleteTransaction } from '@/shared/api/transactions'
import { getApiErrorMessage } from '@/shared/api/errors'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import { WalletTransactionType } from '@/entities/transaction'

const SAVE_ERROR_FALLBACK = 'Не удалось сохранить. Попробуйте ещё раз'
const DELETE_ERROR_FALLBACK = 'Не удалось удалить транзакцию. Попробуйте ещё раз'

type SavePayload = {
  walletId?: string
  type: WalletTransactionType
  amount: number
  description: string
  transactionTime: string
  categoryId: string | null
  subCategoryId: string | null
  targetWalletId: string | null
  targetAmount: number | null
}

export function useEditTransactionActions(transactionId: string | undefined) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const invalidateAndBack = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all })
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallets.all })
    router.back()
  }

  const onSaveError = (error: unknown) =>
    setErrorMessage(getApiErrorMessage(error, SAVE_ERROR_FALLBACK))

  const { mutate: create, isPending: isCreating } = useWalletControllerCreateTransaction({
    mutation: { onSuccess: invalidateAndBack, onError: onSaveError },
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: (p: SavePayload) =>
      updateTransaction(transactionId!, {
        type: p.type,
        amount: p.amount,
        description: p.description || undefined,
        transactionTime: p.transactionTime,
        categoryId: p.categoryId,
        subCategoryId: p.subCategoryId,
        targetWalletId: p.targetWalletId,
        targetAmount: p.targetAmount ?? undefined,
      }),
    onSuccess: invalidateAndBack,
    onError: onSaveError,
  })

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteTransaction(transactionId!),
    onSuccess: invalidateAndBack,
    onError: (error: unknown) =>
      setErrorMessage(getApiErrorMessage(error, DELETE_ERROR_FALLBACK)),
  })

  const handleSave = (payload: SavePayload) => {
    setErrorMessage(null)
    if (transactionId) {
      update(payload)
    } else {
      create({
        data: {
          walletId: payload.walletId,
          type: payload.type,
          amount: payload.amount,
          description: payload.description || undefined,
          transactionTime: payload.transactionTime,
          categoryId: payload.categoryId,
          subCategoryId: payload.subCategoryId,
          targetWalletId: payload.targetWalletId,
          targetAmount: payload.targetAmount ?? undefined,
        },
      })
    }
  }

  const handleDelete = () => {
    setErrorMessage(null)
    remove()
  }

  const clearError = () => setErrorMessage(null)

  const setValidationError = (message: string) => setErrorMessage(message)

  return {
    handleSave,
    handleDelete,
    setValidationError,
    isSaving: isCreating || isUpdating,
    isDeleting,
    errorMessage,
    clearError,
  }
}

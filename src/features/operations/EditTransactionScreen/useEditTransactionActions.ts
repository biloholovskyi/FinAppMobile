import { useState } from 'react'
import { router } from 'expo-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useWalletControllerCreateTransaction } from '@/shared/api/generated/wallets/wallets'
import { updateTransaction, deleteTransaction } from '@/shared/api/transactions'
import { getApiErrorMessage } from '@/shared/api/errors'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import { TRANSACTION_SPLIT_MESSAGES } from '@/shared/constants/transactionSplit'
import type { SavePayload } from './savePayloads'

const SAVE_ERROR_FALLBACK = 'Не удалось сохранить. Попробуйте ещё раз'
const DELETE_ERROR_FALLBACK = 'Не удалось удалить транзакцию. Попробуйте ещё раз'

function toCreateData(p: SavePayload) {
  return {
    walletId: p.walletId,
    type: p.type,
    amount: p.amount,
    description: p.description || undefined,
    transactionTime: p.transactionTime,
    categoryId: p.categoryId,
    subCategoryId: p.subCategoryId,
    targetWalletId: p.targetWalletId,
    targetAmount: p.targetAmount ?? undefined,
  }
}

export function useEditTransactionActions(transactionId: string | undefined) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  /** Исходная транзакция уже уменьшена, а новый платёж ещё не создан — не вычитать повторно. */
  const [isSourceUpdated, setIsSourceUpdated] = useState(false)

  const invalidateAndBack = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all })
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallets.all })
    router.back()
  }

  const { mutateAsync: create, isPending: isCreating } = useWalletControllerCreateTransaction()

  const { mutateAsync: update, isPending: isUpdating } = useMutation({
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
  })

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteTransaction(transactionId!),
    onSuccess: invalidateAndBack,
    onError: (error: unknown) =>
      setErrorMessage(getApiErrorMessage(error, DELETE_ERROR_FALLBACK)),
  })

  const handleSave = async (payload: SavePayload, splitPayload?: SavePayload) => {
    setErrorMessage(null)
    // Локальный дубль признака: состояние React не обновится внутри этого же вызова.
    let sourceUpdated = isSourceUpdated
    try {
      if (!transactionId) {
        await create({ data: toCreateData(payload) })
      } else if (!splitPayload) {
        await update(payload)
      } else {
        if (!sourceUpdated) {
          await update(payload)
          sourceUpdated = true
          setIsSourceUpdated(true)
        }
        await create({ data: toCreateData(splitPayload) })
        setIsSourceUpdated(false)
      }
      invalidateAndBack()
    } catch (error) {
      setErrorMessage(
        splitPayload && sourceUpdated
          ? TRANSACTION_SPLIT_MESSAGES.partialSave
          : getApiErrorMessage(error, SAVE_ERROR_FALLBACK),
      )
    }
  }

  const handleDelete = () => {
    setErrorMessage(null)
    remove()
  }

  return {
    handleSave,
    handleDelete,
    setValidationError: (message: string) => setErrorMessage(message),
    resetSplitProgress: () => setIsSourceUpdated(false),
    isSaving: isCreating || isUpdating,
    isDeleting,
    errorMessage,
    clearError: () => setErrorMessage(null),
  }
}

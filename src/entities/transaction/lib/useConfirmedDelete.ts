import { useCallback, useRef, useState } from 'react'
import { getApiErrorMessage } from '@/shared/api/errors'
import type { Transaction } from '../model/types'
import { useDeleteTransaction } from './useDeleteTransaction'

/** Заголовок сообщения об ошибке удаления транзакции. */
export const DELETE_ERROR_TITLE = 'Не удалось удалить транзакцию'

/** Текст ошибки удаления, когда API не вернул своего сообщения. */
export const DELETE_ERROR_FALLBACK = 'Попробуйте ещё раз'

type Params = {
  /** Транзакции, среди которых ищется удаляемая (для показа в модалке). */
  transactions: Transaction[]
  /** Вызывается с текстом ошибки; вызывающий решает, показать Alert или баннер. */
  onError: (message: string) => void
  /** Вызывается после успешного удаления. */
  onDeleted?: () => void
  /** Не закрывать модалку при успехе (экран закроется сам). */
  keepOpenOnSuccess?: boolean
  /** Закрывать модалку при ошибке (по умолчанию остаётся открытой). */
  closeOnError?: boolean
}

/**
 * Удаление транзакции с подтверждением: состояние модалки, защита от двойного
 * нажатия (синхронный ref) и единая обработка ошибки.
 */
export function useConfirmedDelete({
  transactions,
  onError,
  onDeleted,
  keepOpenOnSuccess = false,
  closeOnError = false,
}: Params) {
  const [pendingId, setPendingId] = useState<string | null>(null)
  const inFlightRef = useRef(false)
  const { deleteById, isDeleting } = useDeleteTransaction()

  const requestDelete = useCallback((tx: Transaction) => setPendingId(tx.id), [])
  const cancelDelete = useCallback(() => {
    if (!inFlightRef.current) setPendingId(null)
  }, [])

  const confirmDelete = useCallback(async () => {
    if (!pendingId || inFlightRef.current) return
    inFlightRef.current = true
    try {
      await deleteById(pendingId)
      if (!keepOpenOnSuccess) setPendingId(null)
      onDeleted?.()
    } catch (error) {
      console.error('Failed to delete transaction', error)
      if (closeOnError) setPendingId(null)
      onError(getApiErrorMessage(error, DELETE_ERROR_FALLBACK))
    } finally {
      inFlightRef.current = false
    }
  }, [pendingId, deleteById, keepOpenOnSuccess, closeOnError, onDeleted, onError])

  return {
    pendingDelete: transactions.find((tx) => tx.id === pendingId) ?? null,
    requestDelete,
    confirmDelete,
    cancelDelete,
    isDeleting,
  }
}

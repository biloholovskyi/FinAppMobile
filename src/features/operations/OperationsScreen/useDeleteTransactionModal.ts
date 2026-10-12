import { Alert } from 'react-native'
import { useConfirmedDelete, DELETE_ERROR_TITLE, type Transaction } from '@/entities/transaction'

const showDeleteError = (message: string) => Alert.alert(DELETE_ERROR_TITLE, message)

/** Состояние модалки удаления поверх уже загруженного фида. */
export function useDeleteTransactionModal(transactions: Transaction[]) {
  return useConfirmedDelete({ transactions, onError: showDeleteError })
}

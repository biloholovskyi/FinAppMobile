import { Alert } from 'react-native'
import { useConfirmedDelete, DELETE_ERROR_TITLE, type Transaction } from '@/entities/transaction'

const showDeleteError = (message: string) => Alert.alert(DELETE_ERROR_TITLE, message)

/** Состояние модалки подтверждения удаления транзакции шторки. */
export function useSheetDelete(transactions: Transaction[]) {
  return useConfirmedDelete({ transactions, onError: showDeleteError })
}

import { apiClient } from './base'
import type { Transaction, WalletTransactionType } from '@/entities/transaction'

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const { data } = await apiClient.get<Transaction[]>('/wallets/transactions')
  return data
}

type UpdateTransactionDto = {
  type?: WalletTransactionType
  targetWalletId?: string | null
  categoryId?: string | null
  subCategoryId?: string | null
  description?: string
  amount?: number
  transactionTime?: string
}

export const updateTransaction = (id: string, dto: UpdateTransactionDto): Promise<Transaction> =>
  apiClient.patch(`wallets/transactions/${id}`, dto).then(r => r.data)

export const deleteTransaction = (id: string): Promise<void> =>
  apiClient.delete(`wallets/transactions/${id}`).then(() => undefined)

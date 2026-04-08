import { apiClient } from './base'
import type { Transaction } from '@/entities/transaction'

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const { data } = await apiClient.get<Transaction[]>('/wallets/transactions')
  return data
}

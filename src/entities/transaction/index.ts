export enum WalletTransactionType {
  expense = 'expense',
  income = 'income',
  transfer = 'transfer',
}

export type Transaction = {
  id: string
  walletId: string
  type: WalletTransactionType | null
  categoryId: string | null
  subCategoryId: string | null
  amount: number
  description: string
  transactionTime: string
  externalId: string | null
  createdAt: string
  updatedAt: string
}

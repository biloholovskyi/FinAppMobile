export enum WalletTransactionType {
  expense = 'expense',
  income = 'income',
  transfer = 'transfer',
}

export type TransactionCategory = {
  id: string
  name: string
  icon: string | null
  color: string | null
}

export type Transaction = {
  id: string
  walletId: string
  wallet: {
    name: string
  }
  type: WalletTransactionType | null
  categoryId: string | null
  subCategoryId: string | null
  category?: TransactionCategory | null
  subCategory?: TransactionCategory | null
  amount: number
  description: string
  transactionTime: string
  externalId: string | null
  createdAt: string
  updatedAt: string
}

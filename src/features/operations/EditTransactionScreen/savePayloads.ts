import type { WalletTransactionType } from '@/entities/transaction'

export type SavePayload = {
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

type BuildSavePayloadsInput = {
  form: {
    type: WalletTransactionType
    description: string
    transactionTime: string
    categoryId: string | null
    subCategoryId: string | null
    sourceWalletId: string | null
    targetWalletId: string | null
  }
  split: {
    isSplitActive: boolean
    splitCategoryId: string | null
    splitSubCategoryId: string | null
    splitAmount: number
  }
  /** Сумма исходной транзакции со знаком; при разделении это уже остаток. */
  signedAmount: number
  isTransfer: boolean
  targetAmount: number | null
  /** Кошелёк исходной транзакции — на него же записывается новый платёж. */
  walletId: string
}

/**
 * Payload исходной транзакции и, при активном разделении, payload нового платежа.
 * Новый платёж копирует из исходной всё, кроме категории, подкатегории и суммы.
 */
export function buildSavePayloads({
  form,
  split,
  signedAmount,
  isTransfer,
  targetAmount,
  walletId,
}: BuildSavePayloadsInput): { payload: SavePayload; splitPayload?: SavePayload } {
  const payload: SavePayload = {
    walletId: form.sourceWalletId ?? undefined,
    type: form.type,
    amount: signedAmount,
    description: form.description,
    transactionTime: form.transactionTime,
    categoryId: form.categoryId,
    subCategoryId: form.subCategoryId,
    targetWalletId: isTransfer ? form.targetWalletId : null,
    targetAmount: isTransfer ? targetAmount : null,
  }

  if (!split.isSplitActive) return { payload }

  return {
    payload,
    splitPayload: {
      ...payload,
      walletId,
      amount: -split.splitAmount,
      categoryId: split.splitCategoryId,
      subCategoryId: split.splitSubCategoryId,
      targetWalletId: null,
      targetAmount: null,
    },
  }
}

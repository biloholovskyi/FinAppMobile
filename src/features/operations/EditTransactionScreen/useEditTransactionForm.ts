import { useState } from 'react'
import { WalletTransactionType, type Transaction } from '@/entities/transaction'

export function useEditTransactionForm(transaction: Transaction | undefined) {
  const [type, setType] = useState<WalletTransactionType>(WalletTransactionType.expense)
  const [amountStr, setAmountStr] = useState('')
  const [description, setDescription] = useState('')
  const [transactionTime, setTransactionTime] = useState(() => new Date().toISOString())
  const [sourceWalletId, setSourceWalletId] = useState<string | null>(null)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [subCategoryId, setSubCategoryId] = useState<string | null>(null)
  const [targetWalletId, setTargetWalletId] = useState<string | null>(null)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false)
  const [isSourceWalletModalOpen, setIsSourceWalletModalOpen] = useState(false)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  // Seeds the form from the loaded transaction. Adjusting state during render is React's
  // documented alternative to a syncing effect: it avoids the extra render pass and, unlike
  // the previous effect keyed on object identity, a refetch of the same transaction no
  // longer overwrites edits in progress.
  const [seededTransactionId, setSeededTransactionId] = useState<string | null>(null)
  if (transaction && transaction.id !== seededTransactionId) {
    setSeededTransactionId(transaction.id)
    setType(transaction.type ?? WalletTransactionType.expense)
    setAmountStr(String(Math.abs(transaction.amount) / 100))
    setDescription(transaction.description ?? '')
    setTransactionTime(transaction.transactionTime)
    setCategoryId(transaction.categoryId)
    setSubCategoryId(transaction.subCategoryId)
    setTargetWalletId(transaction.targetWalletId ?? null)
  }

  return {
    type, setType,
    amountStr, setAmountStr,
    description, setDescription,
    transactionTime, setTransactionTime,
    sourceWalletId, setSourceWalletId,
    categoryId, setCategoryId,
    subCategoryId, setSubCategoryId,
    targetWalletId, setTargetWalletId,
    isCategoryModalOpen, setIsCategoryModalOpen,
    isSubCategoryModalOpen, setIsSubCategoryModalOpen,
    isSourceWalletModalOpen, setIsSourceWalletModalOpen,
    isWalletModalOpen, setIsWalletModalOpen,
    isDatePickerOpen, setIsDatePickerOpen,
    showCategoryRows: type !== WalletTransactionType.transfer,
    showTargetWalletRow: type === WalletTransactionType.transfer,
  }
}

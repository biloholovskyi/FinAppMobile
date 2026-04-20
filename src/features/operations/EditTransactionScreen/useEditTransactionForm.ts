import { useState, useEffect } from 'react'
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

  useEffect(() => {
    if (!transaction) return
    setType(transaction.type ?? WalletTransactionType.expense)
    setAmountStr(String(Math.abs(transaction.amount) / 100))
    setDescription(transaction.description ?? '')
    setTransactionTime(transaction.transactionTime)
    setCategoryId(transaction.categoryId)
    setSubCategoryId(transaction.subCategoryId)
    setTargetWalletId(transaction.targetWalletId ?? null)
  }, [transaction, transaction?.id])

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

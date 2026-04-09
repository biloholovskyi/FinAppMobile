import { useState, useEffect } from 'react'
import { WalletTransactionType, type Transaction } from '@/entities/transaction'

export function useEditTransactionForm(transaction: Transaction | undefined) {
  const [type, setType] = useState<WalletTransactionType>(WalletTransactionType.expense)
  const [amountStr, setAmountStr] = useState('0')
  const [description, setDescription] = useState('')
  const [transactionTime, setTransactionTime] = useState('')
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [subCategoryId, setSubCategoryId] = useState<string | null>(null)
  const [targetWalletId, setTargetWalletId] = useState<string | null>(null)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

  useEffect(() => {
    if (!transaction) return
    setType(transaction.type ?? WalletTransactionType.expense)
    setAmountStr(String(Math.abs(transaction.amount) / 100))
    setDescription(transaction.description ?? '')
    setTransactionTime(transaction.transactionTime)
    setCategoryId(transaction.categoryId)
    setSubCategoryId(transaction.subCategoryId)
    setTargetWalletId(transaction.targetWalletId ?? null)
  }, [transaction?.id])

  const showCategoryRows = type !== WalletTransactionType.transfer
  const showTargetWalletRow = type === WalletTransactionType.transfer

  return {
    type, setType,
    amountStr, setAmountStr,
    description, setDescription,
    transactionTime, setTransactionTime,
    categoryId, setCategoryId,
    subCategoryId, setSubCategoryId,
    targetWalletId, setTargetWalletId,
    isCategoryModalOpen, setIsCategoryModalOpen,
    isSubCategoryModalOpen, setIsSubCategoryModalOpen,
    isWalletModalOpen, setIsWalletModalOpen,
    showCategoryRows,
    showTargetWalletRow,
  }
}

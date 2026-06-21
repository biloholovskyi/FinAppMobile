import { useEditTransactionData } from './useEditTransactionData'
import { useEditTransactionForm } from './useEditTransactionForm'
import { useEditTransactionActions } from './useEditTransactionActions'
import type { CategoryModel } from '@/entities/category'
import type { Wallet } from '@/entities/wallet'
import { WalletTransactionType, useTransferTargetAmount } from '@/entities/transaction'
import { parseAmountInput } from '@/shared/utils/currency'

export function useEditTransactionScreen() {
  const { transaction, categories, wallets, isLoading, isCreateMode } = useEditTransactionData()
  const form = useEditTransactionForm(transaction)
  const actions = useEditTransactionActions(transaction?.id)

  const isTransfer = form.type === WalletTransactionType.transfer
  const walletId = isCreateMode ? (form.sourceWalletId ?? '') : (transaction?.walletId ?? '')

  const transfer = useTransferTargetAmount({
    isTransfer,
    amount: form.amountStr,
    walletId,
    targetWalletId: form.targetWalletId ?? '',
    wallets,
  })

  const selectedCategory: CategoryModel | null = categories.find((c) => c.id === form.categoryId) ?? null
  const selectedSubCategory: CategoryModel | null =
    selectedCategory?.subCategory?.find((sc) => sc.id === form.subCategoryId) ?? null
  const selectedSourceWallet: Wallet | null = wallets.find((w) => w.id === form.sourceWalletId) ?? null
  const selectedTargetWallet: Wallet | null = wallets.find((w) => w.id === form.targetWalletId) ?? null
  const hasSubCategories = (selectedCategory?.subCategory?.length ?? 0) > 0

  const sourceWalletName = isCreateMode ? (selectedSourceWallet?.name ?? '') : (transaction?.wallet?.name ?? '')

  const onSave = () => {
    if (!isCreateMode && !transaction) return
    if (isCreateMode && !form.sourceWalletId) return

    const amount = parseAmountInput(form.amountStr)
    if (amount === null) {
      actions.setValidationError('Введите корректную сумму')
      return
    }
    const signedAmount = form.type === WalletTransactionType.expense ? -amount : amount

    if (isTransfer) {
      if (!form.targetWalletId) {
        actions.setValidationError('Выберите кошелёк-получатель')
        return
      }
      if (!(transfer.targetAmountNumber > 0)) {
        actions.setValidationError('Укажите сумму зачисления')
        return
      }
    }

    actions.handleSave({
      walletId: form.sourceWalletId ?? undefined,
      type: form.type,
      amount: signedAmount,
      description: form.description,
      transactionTime: form.transactionTime,
      categoryId: form.categoryId,
      subCategoryId: form.subCategoryId,
      targetWalletId: isTransfer ? form.targetWalletId : null,
      targetAmount: isTransfer ? transfer.targetAmountNumber : null,
    })
  }

  return {
    isLoading,
    isSaving: actions.isSaving,
    isDeleting: actions.isDeleting,
    isCreateMode,
    sourceWalletName,
    walletId,
    selectedCategory,
    selectedSubCategory,
    selectedSourceWallet,
    selectedTargetWallet,
    hasSubCategories,
    categories,
    wallets,
    showCreditedRow: isTransfer && transfer.isCrossCurrency,
    creditedValue: transfer.targetAmountValue,
    onCreditedChange: transfer.handleTargetAmountChange,
    sourceCurrency: transfer.sourceCurrency,
    targetCurrency: transfer.targetCurrency,
    conversionRate: transfer.conversionRate,
    ...form,
    onSave,
    handleDelete: actions.handleDelete,
    errorMessage: actions.errorMessage,
    clearError: actions.clearError,
  }
}

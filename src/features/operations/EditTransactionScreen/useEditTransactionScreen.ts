import { useEditTransactionData } from './useEditTransactionData'
import { useEditTransactionForm } from './useEditTransactionForm'
import { useEditTransactionActions } from './useEditTransactionActions'
import type { CategoryModel } from '@/entities/category'
import type { Wallet } from '@/entities/wallet'
import { WalletTransactionType } from '@/entities/transaction'
import { parseAmountInput } from '@/shared/utils/currency'

export function useEditTransactionScreen() {
  const { transaction, categories, wallets, isLoading, isCreateMode } = useEditTransactionData()
  const form = useEditTransactionForm(transaction)
  const actions = useEditTransactionActions(transaction?.id)

  const selectedCategory: CategoryModel | null = categories.find((c) => c.id === form.categoryId) ?? null
  const selectedSubCategory: CategoryModel | null =
    selectedCategory?.subCategory?.find((sc) => sc.id === form.subCategoryId) ?? null
  const selectedSourceWallet: Wallet | null = wallets.find((w) => w.id === form.sourceWalletId) ?? null
  const selectedTargetWallet: Wallet | null = wallets.find((w) => w.id === form.targetWalletId) ?? null
  const hasSubCategories = (selectedCategory?.subCategory?.length ?? 0) > 0

  const walletId = isCreateMode ? (form.sourceWalletId ?? '') : (transaction?.walletId ?? '')
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

    actions.handleSave({
      walletId: form.sourceWalletId ?? undefined,
      type: form.type,
      amount: signedAmount,
      description: form.description,
      transactionTime: form.transactionTime,
      categoryId: form.categoryId,
      subCategoryId: form.subCategoryId,
      targetWalletId: form.targetWalletId,
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
    ...form,
    onSave,
    handleDelete: actions.handleDelete,
    errorMessage: actions.errorMessage,
    clearError: actions.clearError,
  }
}

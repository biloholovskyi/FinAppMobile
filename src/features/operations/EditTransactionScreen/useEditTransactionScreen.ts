import { useEditTransactionData } from './useEditTransactionData'
import { useEditTransactionForm } from './useEditTransactionForm'
import { useEditTransactionActions } from './useEditTransactionActions'
import type { CategoryModel } from '@/entities/category'
import type { Wallet } from '@/entities/wallet'
import { WalletTransactionType } from '@/entities/transaction'

export function useEditTransactionScreen() {
  const { transaction, categories, wallets, isLoading } =
    useEditTransactionData()
  const form = useEditTransactionForm(transaction)
  const actions = useEditTransactionActions(transaction?.id ?? '')

  const selectedCategory: CategoryModel | null =
    categories.find((c) => c.id === form.categoryId) ?? null
  const selectedSubCategory: CategoryModel | null =
    selectedCategory?.subCategory?.find((sc) => sc.id === form.subCategoryId) ??
    null
  const selectedTargetWallet: Wallet | null =
    wallets.find((w) => w.id === form.targetWalletId) ?? null
  const sourceWalletName = transaction?.wallet?.name ?? ''
  const hasSubCategories = (selectedCategory?.subCategory?.length ?? 0) > 0

  const onSave = () => {
    if (!transaction) return

    const transformedAmount =
      form.type === WalletTransactionType.expense
        ? `-${form.amountStr}`
        : form.amountStr

    actions.handleSave({
      type: form.type,
      amountStr: transformedAmount,
      description: form.description,
      transactionTime: form.transactionTime,
      categoryId: form.categoryId,
      subCategoryId: form.subCategoryId,
      targetWalletId: form.targetWalletId,
    })
  }

  return {
    // Loading/saving state
    isLoading,
    isSaving: actions.isSaving,
    isDeleting: actions.isDeleting,
    // Source info (read-only)
    sourceWalletName,
    walletId: transaction?.walletId ?? '',
    // Derived values
    selectedCategory,
    selectedSubCategory,
    selectedTargetWallet,
    hasSubCategories,
    // Data for pickers
    categories,
    wallets,
    // Form state + setters (spread from form)
    ...form,
    // Actions
    onSave,
    handleDelete: actions.handleDelete,
  }
}

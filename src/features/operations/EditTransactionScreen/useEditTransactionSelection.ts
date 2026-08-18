import type { CategoryModel } from '@/entities/category'
import type { Wallet } from '@/entities/wallet'

type UseEditTransactionSelectionParams = {
  categories: CategoryModel[]
  wallets: Wallet[]
  categoryId: string | null
  subCategoryId: string | null
  sourceWalletId: string | null
  targetWalletId: string | null
}

/** Производные сущности формы: выбранные категория, подкатегория и кошельки. */
export function useEditTransactionSelection({
  categories,
  wallets,
  categoryId,
  subCategoryId,
  sourceWalletId,
  targetWalletId,
}: UseEditTransactionSelectionParams) {
  const selectedCategory = categories.find((c) => c.id === categoryId) ?? null
  const selectedSubCategory = selectedCategory?.subCategory?.find((sc) => sc.id === subCategoryId) ?? null

  return {
    selectedCategory,
    selectedSubCategory,
    selectedSourceWallet: wallets.find((w) => w.id === sourceWalletId) ?? null,
    selectedTargetWallet: wallets.find((w) => w.id === targetWalletId) ?? null,
    hasSubCategories: (selectedCategory?.subCategory?.length ?? 0) > 0,
  }
}

import { useState } from 'react'
import type { CategoryModel } from '@/entities/category'

type UseSplitPaymentCardParams = {
  categories: CategoryModel[]
  categoryId: string | null
  subCategoryId: string | null
}

export function useSplitPaymentCard({ categories, categoryId, subCategoryId }: UseSplitPaymentCardParams) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false)

  const selectedCategory = categories.find((c) => c.id === categoryId) ?? null
  const subCategories = selectedCategory?.subCategory ?? []
  const selectedSubCategory = subCategories.find((sc) => sc.id === subCategoryId) ?? null

  return {
    selectedCategory,
    selectedSubCategory,
    subCategories,
    hasSubCategories: subCategories.length > 0,
    isCategoryModalOpen,
    openCategoryModal: () => setIsCategoryModalOpen(true),
    closeCategoryModal: () => setIsCategoryModalOpen(false),
    isSubCategoryModalOpen,
    openSubCategoryModal: () => setIsSubCategoryModalOpen(true),
    closeSubCategoryModal: () => setIsSubCategoryModalOpen(false),
  }
}

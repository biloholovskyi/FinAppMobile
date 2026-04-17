import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchCategories } from '@/shared/api/categories'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import type { CategoryModel } from '@/entities/category'

export function useCategoriesScreen() {
  const { data = [], isLoading, refetch, isRefetching } = useQuery<CategoryModel[]>({
    queryKey: QUERY_KEYS.categories.all,
    queryFn: fetchCategories,
  })

  const handleAddCategory = useCallback(() => {
    // TODO: navigate to create category screen
  }, [])

  const handleEdit = useCallback((_id: string) => {
    // TODO: navigate to edit category screen
  }, [])

  const handleDelete = useCallback((_id: string) => {
    // TODO: show delete confirmation
  }, [])

  return {
    categories: data,
    isLoading,
    refetch,
    isRefetching,
    handleAddCategory,
    handleEdit,
    handleDelete,
  }
}

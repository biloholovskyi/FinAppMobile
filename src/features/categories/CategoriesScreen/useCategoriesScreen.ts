import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { fetchCategories } from '@/shared/api/categories'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import type { CategoryModel } from '@/entities/category'

export function useCategoriesScreen() {
  const router = useRouter()

  const { data = [], isLoading, refetch, isRefetching } = useQuery<CategoryModel[]>({
    queryKey: QUERY_KEYS.categories.all,
    queryFn: fetchCategories,
  })

  const handleAddCategory = useCallback(() => {
    router.push('/category/create')
  }, [router])

  const handleEdit = useCallback(
    (id: string, isSubcategory?: boolean) => {
      router.push({
        pathname: '/category/[id]',
        params: { id, ...(isSubcategory && { isSubcategory: 'true' }) },
      })
    },
    [router],
  )

  const handleAddSubcategory = useCallback(
    (parentId: string) => {
      router.push({
        pathname: '/category/create',
        params: { parentId },
      })
    },
    [router],
  )

  const handleDelete = useCallback((_id: string) => {
    // TODO: показать подтверждение удаления
  }, [])

  return {
    categories: data,
    isLoading,
    refetch,
    isRefetching,
    handleAddCategory,
    handleEdit,
    handleDelete,
    handleAddSubcategory,
  }
}

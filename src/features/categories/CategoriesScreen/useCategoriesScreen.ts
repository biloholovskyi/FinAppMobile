import { useCallback } from 'react'
import { Alert } from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { fetchCategories, deleteCategory, deleteSubcategory } from '@/shared/api/categories'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import type { CategoryModel } from '@/entities/category'

export function useCategoriesScreen() {
  const router = useRouter()
  const queryClient = useQueryClient()

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

  const { mutate: removeMutation } = useMutation({
    mutationFn: ({ id, isSubcategory }: { id: string; isSubcategory?: boolean }) =>
      isSubcategory ? deleteSubcategory(id) : deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all })
    },
  })

  const handleDelete = useCallback((id: string, isSubcategory?: boolean) => {
    Alert.alert(
      'Удалить?',
      isSubcategory ? 'Подкатегория будет удалена.' : 'Категория и все подкатегории будут удалены.',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: () => removeMutation({ id, isSubcategory }) },
      ],
    )
  }, [removeMutation])

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

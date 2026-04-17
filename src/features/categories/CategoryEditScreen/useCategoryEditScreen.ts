import { useState, useCallback, useMemo, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import {
  fetchCategories,
  createCategory,
  createSubcategory,
  updateCategory,
  updateSubcategory,
} from '@/shared/api/categories'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import { CategoryPriority } from '@/entities/category'
import type { CategoryPriorityValue } from '@/entities/category'

type Params = { id?: string; parentId?: string; isSubcategory?: string }

export function useCategoryEditScreen({ id, parentId, isSubcategory }: Params) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const isEditMode = !!id
  const isSubMode = isSubcategory === 'true' || !!parentId

  const [name, setName] = useState('')
  const [priority, setPriority] = useState<CategoryPriorityValue>(CategoryPriority.low)
  const [color, setColor] = useState('#4F9EFF')
  const [icon, setIcon] = useState('zap')
  const [isSubToggle, setIsSubToggle] = useState(!isEditMode && isSubMode)
  const [selectedParentId, setSelectedParentId] = useState(parentId ?? '')

  const { data: categories = [] } = useQuery({
    queryKey: QUERY_KEYS.categories.all,
    queryFn: fetchCategories,
    enabled: isEditMode || isSubToggle,
  })

  const existing = useMemo(() => {
    if (!isEditMode) return null
    if (isSubMode) {
      for (const cat of categories) {
        const sub = cat.subCategory?.find(s => s.id === id)
        if (sub) return sub
      }
      return null
    }
    return categories.find(c => c.id === id) ?? null
  }, [categories, id, isEditMode, isSubMode])

  useEffect(() => {
    if (existing) {
      setName(existing.name)
      setPriority((existing.priority as CategoryPriorityValue) ?? CategoryPriority.low)
      setColor(existing.color ?? '#4F9EFF')
      setIcon(existing.icon ?? 'zap')
    }
  }, [existing?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const dto = { name, priority, color, icon }
      if (isEditMode) {
        return isSubMode ? updateSubcategory(id!, dto) : updateCategory(id!, dto)
      }
      return isSubToggle && selectedParentId
        ? createSubcategory(selectedParentId, dto)
        : createCategory(dto)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all })
      router.back()
    },
  })

  const handleSubmit = useCallback(() => mutate(), [mutate])

  const title = useMemo(() => {
    if (isEditMode) return existing?.name ?? (isSubMode ? 'Подкатегория' : 'Категория')
    return isSubToggle ? 'Новая подкатегория' : 'Новая категория'
  }, [isEditMode, existing?.name, isSubMode, isSubToggle])

  return {
    name, setName,
    priority, setPriority,
    color, setColor,
    icon, setIcon,
    isSubToggle, setIsSubToggle,
    selectedParentId, setSelectedParentId,
    categories,
    isEditMode,
    isSubMode,
    title,
    handleSubmit,
    isPending,
  }
}

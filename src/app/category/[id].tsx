import { useLocalSearchParams } from 'expo-router'
import { CategoryEditScreen } from '@/features/categories/CategoryEditScreen/CategoryEditScreen'

export default function CategoryEditRoute() {
  const { id, isSubcategory } = useLocalSearchParams<{ id: string; isSubcategory?: string }>()
  return <CategoryEditScreen id={id} isSubcategory={isSubcategory} />
}

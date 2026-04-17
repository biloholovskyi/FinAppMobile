import { useLocalSearchParams } from 'expo-router'
import { CategoryEditScreen } from '@/features/categories/CategoryEditScreen/CategoryEditScreen'

export default function CategoryCreateRoute() {
  const { parentId } = useLocalSearchParams<{ parentId?: string }>()
  return <CategoryEditScreen parentId={parentId} />
}

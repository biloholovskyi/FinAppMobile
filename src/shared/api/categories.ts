import { apiClient } from './base'
import type { CategoryModel } from '@/entities/category'

export const fetchCategories = (): Promise<CategoryModel[]> =>
  apiClient.get('/categories').then(r => r.data)

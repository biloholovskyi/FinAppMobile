import { apiClient } from './base'
import type { CategoryModel, CategoryPriorityValue } from '@/entities/category'

export type CategoryBaseDto = {
  name: string
  priority?: CategoryPriorityValue
  color?: string
  icon?: string
}

export type UpdateCategoryDto = Partial<CategoryBaseDto>

export const fetchCategories = (): Promise<CategoryModel[]> =>
  apiClient.get('/categories').then(r => r.data)

export const createCategory = (dto: CategoryBaseDto): Promise<CategoryModel> =>
  apiClient.post('/categories', dto).then(r => r.data)

export const createSubcategory = (
  parentId: string,
  dto: CategoryBaseDto,
): Promise<CategoryModel> =>
  apiClient.post(`/categories/${parentId}/subcategories`, dto).then(r => r.data)

export const updateCategory = (
  id: string,
  dto: UpdateCategoryDto,
): Promise<CategoryModel> =>
  apiClient.put(`/categories/${id}`, dto).then(r => r.data)

export const updateSubcategory = (
  id: string,
  dto: UpdateCategoryDto,
): Promise<CategoryModel> =>
  apiClient.put(`/subcategories/${id}`, dto).then(r => r.data)

export const deleteCategory = (id: string): Promise<void> =>
  apiClient.delete(`/categories/${id}`).then(r => r.data)

export const deleteSubcategory = (id: string): Promise<void> =>
  apiClient.delete(`/subcategories/${id}`).then(r => r.data)

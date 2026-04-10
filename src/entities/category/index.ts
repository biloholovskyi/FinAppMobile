export type CategoryModel = {
  id: string
  name: string
  priority: string
  color?: string
  icon?: string
  subCategory?: CategoryModel[]
  createdAt: string
  updatedAt: string
}

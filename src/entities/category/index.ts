export const CategoryPriority = {
  hight: 'hight',
  low: 'low',
} as const

export type CategoryPriorityValue = typeof CategoryPriority[keyof typeof CategoryPriority]

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

import { apiClient } from './base'

type CategoryRef = {
  id: string
  name: string
}

type SubCategoryRef = {
  id: string
  name: string
  categoryId: string
}

export type MonthBudgetRow = {
  id: string
  baseBudget: number
  additionalBudget: number
  category: CategoryRef | null
  subCategory: SubCategoryRef | null
}

export type MonthBudgetResponse = {
  budgetRows: MonthBudgetRow[]
}

export const getMonthBudget = async (month: string): Promise<MonthBudgetResponse> => {
  const { data } = await apiClient.get<MonthBudgetResponse>(
    '/budgets/month/' + encodeURIComponent(month),
  )
  return data
}

import { router } from 'expo-router'
import { CategorySpendingScreen } from '@/features/categorySpending/CategorySpendingScreen/CategorySpendingScreen'

export default function StatisticsRoute() {
  return (
    <CategorySpendingScreen
      onOpenLeaf={(leafKey, month) =>
        router.push({ pathname: '/spending/[leafKey]', params: { leafKey, month } })
      }
    />
  )
}

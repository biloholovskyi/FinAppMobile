import { View, Text } from 'react-native'
import {
  BUDGET_WARNING_PERCENT,
  formatKopecksUah,
  getBudgetProgress,
} from './lib/spendingFormat'

type BudgetMetaRowProps = {
  /** Сумма расходов в копейках. */
  totalSpent: number
  /** Бюджет в копейках; `null` — бюджет не установлен. */
  budget: number | null
}

/** Подпись под полосой бюджета: использование и остаток либо превышение. */
export function BudgetMetaRow({ totalSpent, budget }: BudgetMetaRowProps) {
  const { pct, isExceeded } = getBudgetProgress(totalSpent, budget)
  const budgetValue = budget ?? 0

  return (
    <View className="flex-row justify-between">
      <Text className="text-[10px] text-[#8888AA]">
        {formatKopecksUah(totalSpent)} из {formatKopecksUah(budgetValue)} ·{' '}
        {pct.toFixed(0)}%
      </Text>
      {isExceeded ? (
        <Text className="text-[10px] font-semibold text-[#FF4B6B]">
          +{formatKopecksUah(totalSpent - budgetValue)} превышение
        </Text>
      ) : (
        <Text
          className="text-[10px]"
          style={{
            color: pct >= BUDGET_WARNING_PERCENT ? '#FFB020' : '#8888AA',
          }}
        >
          осталось {formatKopecksUah(budgetValue - totalSpent)}
        </Text>
      )}
    </View>
  )
}

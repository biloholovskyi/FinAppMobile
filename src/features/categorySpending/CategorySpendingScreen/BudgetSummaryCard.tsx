import { View, Text } from 'react-native'
import { PERCENT_MULTIPLIER } from '@/shared/constants'
import { BudgetProgress, BUDGET_PROGRESS_HEIGHT } from './BudgetProgress'
import { formatKopecksUah, formatPct } from './lib/spendingFormat'
import type { BudgetSummary } from './lib/aggregateCategorySpending'

type Props = {
  summary: BudgetSummary
}

export function BudgetSummaryCard({ summary }: Props) {
  const { totalBudget, totalSpent } = summary

  if (totalBudget === 0) return null

  const remaining = totalBudget - totalSpent
  const pct = (totalSpent / totalBudget) * PERCENT_MULTIPLIER

  return (
    <View className="gap-3 rounded-2xl border border-white/[0.08] bg-[#10101C] p-3.5">
      <Text className="text-[11px] font-medium uppercase tracking-widest text-[#8888AA]">
        Бюджет на месяц
      </Text>

      <View className="flex-row justify-between">
        <View className="gap-0.5">
          <Text className="text-[11px] text-[#8888AA]">Бюджет</Text>
          <Text
            className="text-[14px] font-bold text-[#F2F2FF]"
            style={{ fontFamily: 'SpaceMono_700Bold' }}
          >
            {formatKopecksUah(totalBudget)}
          </Text>
        </View>
        <View className="items-center gap-0.5">
          <Text className="text-[11px] text-[#8888AA]">Потрачено</Text>
          <Text
            className="text-[14px] font-bold text-[#F2F2FF]"
            style={{ fontFamily: 'SpaceMono_700Bold' }}
          >
            {formatKopecksUah(totalSpent)}
          </Text>
          <Text className="text-[11px] text-[#8888AA]">{formatPct(pct)}</Text>
        </View>
        <View className="items-end gap-0.5">
          <Text className="text-[11px] text-[#8888AA]">Остаток</Text>
          <Text
            className="text-[14px] font-bold"
            style={{
              fontFamily: 'SpaceMono_700Bold',
              color: remaining >= 0 ? '#00E089' : '#FF4B6B',
            }}
          >
            {formatKopecksUah(Math.abs(remaining))}
          </Text>
        </View>
      </View>

      <View className="gap-1">
        <BudgetProgress
          totalSpent={totalSpent}
          budget={totalBudget}
          height={BUDGET_PROGRESS_HEIGHT.row}
        />
        <View className="flex-row justify-between">
          <Text className="text-[10px] text-[#44445A]">₴0</Text>
          <Text className="text-[10px] text-[#44445A]">
            {formatPct(pct)} использовано
          </Text>
          <Text className="text-[10px] text-[#44445A]">
            {formatKopecksUah(totalBudget)}
          </Text>
        </View>
      </View>
    </View>
  )
}

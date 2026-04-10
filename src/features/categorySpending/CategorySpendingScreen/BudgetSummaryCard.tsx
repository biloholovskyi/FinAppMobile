import { View, Text } from 'react-native'
import type { BudgetSummary } from './lib/aggregateCategorySpending'

function formatUah(value: number): string {
  return (value / 100).toLocaleString('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  })
}

function getProgressColor(pct: number): string {
  if (pct > 100) return 'rgba(79,158,255,0.35)'
  if (pct >= 80) return '#FFB020'
  return '#4F9EFF'
}

type Props = {
  summary: BudgetSummary
}

export function BudgetSummaryCard({ summary }: Props) {
  const { totalBudget, totalSpent } = summary

  if (totalBudget === 0) return null

  const remaining = totalBudget - totalSpent
  const pct = (totalSpent / totalBudget) * 100
  const fillPct = Math.min(pct, 100)
  const overflowPct = pct > 100 ? Math.min((pct - 100) / 100, 1) * 100 : 0
  const fillColor = getProgressColor(pct)

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
            {formatUah(totalBudget)}
          </Text>
        </View>
        <View className="items-center gap-0.5">
          <Text className="text-[11px] text-[#8888AA]">Потрачено</Text>
          <Text
            className="text-[14px] font-bold text-[#F2F2FF]"
            style={{ fontFamily: 'SpaceMono_700Bold' }}
          >
            {formatUah(totalSpent)}
          </Text>
          <Text className="text-[11px] text-[#8888AA]">{pct.toFixed(1)}%</Text>
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
            {formatUah(Math.abs(remaining))}
          </Text>
        </View>
      </View>

      <View className="gap-1">
        <View className="h-[7px] overflow-hidden rounded-full bg-[#181828]">
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${fillPct}%`,
              backgroundColor: fillColor,
              borderRadius: 99,
            }}
          />
          {overflowPct > 0 && (
            <View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${overflowPct}%`,
                backgroundColor: '#FF4B6B',
                borderRadius: 99,
              }}
            />
          )}
        </View>
        <View className="flex-row justify-between">
          <Text className="text-[10px] text-[#44445A]">₴0</Text>
          <Text className="text-[10px] text-[#44445A]">
            {pct.toFixed(1)}% использовано
          </Text>
          <Text className="text-[10px] text-[#44445A]">
            {formatUah(totalBudget)}
          </Text>
        </View>
      </View>
    </View>
  )
}

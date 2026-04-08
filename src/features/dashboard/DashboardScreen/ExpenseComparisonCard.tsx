import { View, Text } from 'react-native'
import { TrendingUp, TrendingDown } from 'lucide-react-native'

type Props = {
  totalCurrent: number
  totalPrev: number
  diff: number
  percentChange: number
  currentDayOfMonth: number
  currentMonthName: string
  currentMonthNameGenitive: string
  prevMonthName: string
  prevMonthNameGenitive: string
}

function formatAmount(amount: number): string {
  return amount.toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function ExpenseComparisonCard({
  totalCurrent,
  totalPrev,
  diff,
  percentChange,
  currentDayOfMonth,
  currentMonthName,
  currentMonthNameGenitive,
  prevMonthName,
  prevMonthNameGenitive,
}: Props) {
  const isOver = diff > 0
  const isUnder = diff < 0
  const diffColor = isOver
    ? 'text-[#FF4B6B]'
    : isUnder
      ? 'text-[#00E089]'
      : 'text-[#F2F2FF]'
  const trendColor = isOver ? '#FF4B6B' : isUnder ? '#00E089' : '#8888AA'

  const diffLabel = isOver
    ? `+₴${formatAmount(Math.abs(diff))}`
    : isUnder
      ? `-₴${formatAmount(Math.abs(diff))}`
      : '₴0,00'

  const trendText = isOver
    ? `↑ ${Math.abs(percentChange).toFixed(1)}% больше`
    : isUnder
      ? `↓ ${Math.abs(percentChange).toFixed(1)}% меньше`
      : 'Без изменений'

  const label =
    `РАСХОДЫ · ${currentMonthNameGenitive.toUpperCase()} vs ` +
    `${prevMonthNameGenitive.toUpperCase()} (1–${currentDayOfMonth})`

  return (
    <View className="bg-[#10101C] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 mx-3 mb-2.5">
      <Text className="text-[#8888AA] text-[11px] font-medium tracking-widest uppercase mb-3">
        {label}
      </Text>

      <Text className={`font-bold text-[30px] text-center mb-1.5 ${diffColor}`}>
        {diffLabel}
      </Text>

      <View className="flex-row items-center justify-center gap-1.5 mb-3">
        {isOver ? (
          <TrendingUp size={14} color={trendColor} />
        ) : isUnder ? (
          <TrendingDown size={14} color={trendColor} />
        ) : null}
        <Text style={{ color: trendColor }} className="text-[13px] font-medium">
          {trendText}
        </Text>
      </View>

      <View className="h-px bg-[rgba(255,255,255,0.04)] mb-3" />

      <View className="flex-row justify-between items-center py-1">
        <Text className="text-[#F2F2FF] text-[13px]">{currentMonthName}</Text>
        <Text className="text-[#F2F2FF] text-[13px] font-bold">
          ₴{formatAmount(totalCurrent)}
        </Text>
      </View>
      <View className="flex-row justify-between items-center py-1">
        <Text className="text-[#8888AA] text-[13px]">{prevMonthName}</Text>
        <Text className="text-[#8888AA] text-[13px] font-bold">
          ₴{formatAmount(totalPrev)}
        </Text>
      </View>
    </View>
  )
}

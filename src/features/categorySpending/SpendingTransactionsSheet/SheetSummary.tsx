import { View, Text } from 'react-native'
import { BudgetProgress, BUDGET_PROGRESS_HEIGHT } from '../CategorySpendingScreen/BudgetProgress'
import { BudgetMetaRow } from '../CategorySpendingScreen/BudgetMetaRow'
import { formatKopecksUah, getBudgetProgress } from '../CategorySpendingScreen/lib/spendingFormat'

type SheetSummaryProps = {
  /** Потрачено по листу, копейки. */
  spent: number
  count: number
  /** Бюджет листа, копейки; `null` — бюджет не установлен. */
  budget: number | null
}

/** Подпись и значение одного показателя сводки. */
function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View className="gap-0.5">
      <Text className="text-[10px] uppercase tracking-widest text-[#44445A]">{label}</Text>
      <Text
        className="text-[14px] font-bold"
        style={{ fontFamily: 'SpaceMono_700Bold', color: color ?? '#F2F2FF' }}
      >
        {value}
      </Text>
    </View>
  )
}

/** Сводка шторки: потрачено, число операций, прогресс бюджета. */
export function SheetSummary({ spent, count, budget }: SheetSummaryProps) {
  const { hasBudget, isExceeded } = getBudgetProgress(spent, budget)

  return (
    <View className="mb-2 gap-3 rounded-2xl border border-white/[0.08] bg-[#181828] p-3.5">
      <View className="flex-row justify-between">
        <Stat label="Потрачено" value={formatKopecksUah(spent)} color={isExceeded ? '#FF4B6B' : undefined} />
        <Stat label="Операций" value={String(count)} />
        <Stat label="Бюджет" value={hasBudget ? formatKopecksUah(budget ?? 0) : '—'} />
      </View>
      <View className="gap-1.5">
        <BudgetProgress totalSpent={spent} budget={budget} height={BUDGET_PROGRESS_HEIGHT.row} />
        {hasBudget ? (
          <BudgetMetaRow totalSpent={spent} budget={budget} />
        ) : (
          <Text className="text-[10px] italic text-[#44445A]">бюджет не установлен</Text>
        )}
      </View>
    </View>
  )
}

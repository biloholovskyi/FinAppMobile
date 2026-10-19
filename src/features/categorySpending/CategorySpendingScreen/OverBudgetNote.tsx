import { View, Text } from 'react-native'
import { TrendingUp } from 'lucide-react-native'
import type { SpendingViewMode } from '@/shared/constants'
import { formatKopecksUah } from './lib/spendingFormat'
import { formatOverBudgetNote } from './lib/formatOverBudgetNote'
import type { OverBudgetStats } from './lib/filterOverBudget'

/** Размер иконки плашки. */
const NOTE_ICON_SIZE = 15

/** Цвет иконки плашки. */
const NOTE_ICON_COLOR = '#FF4B6B'

/** Шрифт суммы превышения. */
const AMOUNT_FONT_FAMILY = 'SpaceMono_700Bold'

type OverBudgetNoteProps = {
  viewMode: SpendingViewMode
  stats: OverBudgetStats
}

/** Плашка с итогом превышения по видимым элементам при включённом фильтре. */
export function OverBudgetNote({ viewMode, stats }: OverBudgetNoteProps) {
  const { overCount, budgetedCount, overspend } = stats

  return (
    <View className="flex-row items-center gap-2 rounded-xl border border-spending-red-line bg-spending-red-soft px-3 py-2.5">
      <TrendingUp size={NOTE_ICON_SIZE} color={NOTE_ICON_COLOR} />
      <Text className="min-w-0 flex-1 text-[12px] text-spending-secondary">
        {formatOverBudgetNote({ overCount, budgetedCount, viewMode })}
      </Text>
      <Text
        className="text-[13px] text-spending-red"
        style={{ fontFamily: AMOUNT_FONT_FAMILY }}
      >
        {`+${formatKopecksUah(overspend)}`}
      </Text>
    </View>
  )
}

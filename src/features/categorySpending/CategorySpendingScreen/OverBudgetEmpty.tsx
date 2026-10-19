import { View, Text, Pressable } from 'react-native'
import { CheckCircle } from 'lucide-react-native'
import {
  OVER_BUDGET_EMPTY_TEXT,
  OVER_BUDGET_EMPTY_TITLE,
  OVER_BUDGET_RESET_LABEL,
} from '@/shared/constants'
import type { SpendingViewMode } from '@/shared/constants'

/** Размер иконки пустого состояния. */
const EMPTY_ICON_SIZE = 26

/** Цвет иконки пустого состояния. */
const EMPTY_ICON_COLOR = '#00E089'

type OverBudgetEmptyProps = {
  viewMode: SpendingViewMode
  /** Выключает фильтр превышения. */
  onReset: () => void
}

/** Пустое состояние фильтра: в месяце нет превышений бюджета. */
export function OverBudgetEmpty({ viewMode, onReset }: OverBudgetEmptyProps) {
  return (
    <View className="items-center gap-2.5 px-4 pb-4 pt-9">
      <View className="h-14 w-14 items-center justify-center rounded-3xl bg-spending-green-tint">
        <CheckCircle size={EMPTY_ICON_SIZE} color={EMPTY_ICON_COLOR} />
      </View>
      <Text className="text-[15px] font-semibold text-spending-primary">
        {OVER_BUDGET_EMPTY_TITLE}
      </Text>
      <Text className="max-w-[220px] text-center text-[12px] font-light text-spending-secondary">
        {OVER_BUDGET_EMPTY_TEXT[viewMode]}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={onReset}
        className="mt-1 rounded-full border border-spending-border bg-spending-elevated px-4 py-2 active:opacity-80"
      >
        <Text className="text-[12px] font-medium text-spending-primary">
          {OVER_BUDGET_RESET_LABEL}
        </Text>
      </Pressable>
    </View>
  )
}

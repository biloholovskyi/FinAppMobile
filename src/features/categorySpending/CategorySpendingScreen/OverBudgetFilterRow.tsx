import { View, Text } from 'react-native'
import { OverBudgetChip } from './OverBudgetChip'

type OverBudgetFilterRowProps = {
  /** Подпись секции списка. */
  sectionLabel: string
  isOverOnly: boolean
  /** Число превышенных элементов текущего режима. */
  overCount: number
  onToggleOverOnly: () => void
}

/** Строка фильтра: подпись секции слева, чип «Превышен бюджет» справа. */
export function OverBudgetFilterRow({
  sectionLabel,
  isOverOnly,
  overCount,
  onToggleOverOnly,
}: OverBudgetFilterRowProps) {
  return (
    <View className="flex-row items-center justify-between gap-2">
      <Text className="flex-1 px-0.5 text-[11px] font-medium uppercase tracking-widest text-spending-secondary">
        {sectionLabel}
      </Text>
      <OverBudgetChip
        isOverOnly={isOverOnly}
        overCount={overCount}
        onPress={onToggleOverOnly}
      />
    </View>
  )
}

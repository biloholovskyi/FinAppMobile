import { Pressable, Text, View } from 'react-native'
import { AlertTriangle } from 'lucide-react-native'
import {
  OVER_BUDGET_CHIP_A11Y_HINT,
  OVER_BUDGET_CHIP_A11Y_LABEL,
  OVER_BUDGET_CHIP_A11Y_VALUE_PREFIX,
  OVER_BUDGET_FILTER_LABEL,
} from '@/shared/constants'

/** Размер иконки чипа. */
const CHIP_ICON_SIZE = 13

/** Цвет иконки чипа в нейтральном состоянии. */
const ICON_COLOR_SECONDARY = '#8888AA'

/** Цвет иконки чипа при наличии превышений и при включённом фильтре. */
const ICON_COLOR_RED = '#FF4B6B'

/** Расширение зоны нажатия чипа: высота чипа ~28pt + 2 × 8 даёт не меньше 44pt. */
const CHIP_HIT_SLOP = 8

/** Шрифт счётчика в чипе. */
const COUNT_FONT_FAMILY = 'SpaceMono_700Bold'

type ChipTone = 'idle' | 'hasOver' | 'active'

type ChipStyle = {
  container: string
  text: string
  badge: string
  badgeText: string
  iconColor: string
}

const CHIP_STYLE: Record<ChipTone, ChipStyle> = {
  idle: {
    container: 'border-spending-border bg-spending-surface',
    text: 'text-spending-secondary',
    badge: 'bg-spending-elevated',
    badgeText: 'text-spending-secondary',
    iconColor: ICON_COLOR_SECONDARY,
  },
  hasOver: {
    container: 'border-spending-border bg-spending-surface',
    text: 'text-spending-primary',
    badge: 'bg-spending-red-glow',
    badgeText: 'text-spending-red',
    iconColor: ICON_COLOR_RED,
  },
  active: {
    container: 'border-spending-red-line bg-spending-red-glow',
    text: 'text-spending-red',
    badge: 'bg-spending-red',
    badgeText: 'text-spending-inverse',
    iconColor: ICON_COLOR_RED,
  },
}

function getChipTone(isOverOnly: boolean, overCount: number): ChipTone {
  if (isOverOnly) return 'active'
  return overCount > 0 ? 'hasOver' : 'idle'
}

type OverBudgetChipProps = {
  isOverOnly: boolean
  /** Число превышенных элементов текущего режима. */
  overCount: number
  onPress: () => void
}

/** Чип-переключатель фильтра «Превышен бюджет» со счётчиком превышений. */
export function OverBudgetChip({
  isOverOnly,
  overCount,
  onPress,
}: OverBudgetChipProps) {
  const tone = CHIP_STYLE[getChipTone(isOverOnly, overCount)]

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isOverOnly }}
      accessibilityLabel={OVER_BUDGET_CHIP_A11Y_LABEL}
      accessibilityValue={{
        text: `${OVER_BUDGET_CHIP_A11Y_VALUE_PREFIX}${overCount}`,
      }}
      accessibilityHint={OVER_BUDGET_CHIP_A11Y_HINT}
      hitSlop={CHIP_HIT_SLOP}
      onPress={onPress}
      className={`shrink flex-row items-center gap-1.5 rounded-full border py-1 pl-2.5 pr-1.5 active:opacity-80 ${tone.container}`}
    >
      <AlertTriangle size={CHIP_ICON_SIZE} color={tone.iconColor} />
      <Text className={`shrink text-[12px] font-medium ${tone.text}`}>
        {OVER_BUDGET_FILTER_LABEL}
      </Text>
      <View
        className={`h-5 min-w-5 items-center justify-center rounded-full px-1.5 ${tone.badge}`}
      >
        <Text
          className={`text-[11px] ${tone.badgeText}`}
          style={{ fontFamily: COUNT_FONT_FAMILY }}
        >
          {overCount}
        </Text>
      </View>
    </Pressable>
  )
}

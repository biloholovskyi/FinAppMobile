import { View, Text, TouchableOpacity } from 'react-native'
import {
  SPENDING_VIEW_MODE,
  SPENDING_VIEW_MODE_LABEL,
  type SpendingViewMode,
} from '@/shared/constants'
import { hexToRgba } from '@/shared/utils/colors'

/** Цвет активного сегмента. */
const ACTIVE_COLOR = '#4F9EFF'

/** Прозрачность подложки активного сегмента. */
const ACTIVE_BG_OPACITY = 0.2

/** Цвет текста неактивного сегмента. */
const INACTIVE_COLOR = '#44445A'

const VIEW_MODES = [
  SPENDING_VIEW_MODE.categories,
  SPENDING_VIEW_MODE.subcategories,
] as const

type ViewModeSegmentProps = {
  viewMode: SpendingViewMode
  onChange: (mode: SpendingViewMode) => void
}

/** Переключатель режимов отображения списка расходов. */
export function ViewModeSegment({ viewMode, onChange }: ViewModeSegmentProps) {
  return (
    <View className="flex-row gap-0.5 rounded-2xl border border-white/[0.08] bg-[#181828] p-1">
      {VIEW_MODES.map((mode) => {
        const isActive = mode === viewMode
        return (
          <TouchableOpacity
            key={mode}
            className="flex-1 items-center rounded-lg py-2"
            style={
              isActive
                ? { backgroundColor: hexToRgba(ACTIVE_COLOR, ACTIVE_BG_OPACITY) }
                : undefined
            }
            onPress={() => onChange(mode)}
            activeOpacity={0.7}
          >
            <Text
              className="text-[13px] font-semibold"
              style={{ color: isActive ? ACTIVE_COLOR : INACTIVE_COLOR }}
            >
              {SPENDING_VIEW_MODE_LABEL[mode]}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

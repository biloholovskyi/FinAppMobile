import { View, Text, TouchableOpacity } from 'react-native'
import { X } from 'lucide-react-native'
import { SpendingIcon } from '../CategorySpendingScreen/SpendingIcon'
import type { FlatSpendingRow } from '../CategorySpendingScreen/lib/flattenSpendingRows'
import { formatMonthKey, type MonthKey } from '@/shared/utils/kyivCalendar'

/** Прозрачность в hex для подложки иконки. */
const ICON_BG_ALPHA = '26'

/** Цвет иконки, когда у листа нет собственного цвета. */
const ICON_COLOR_FALLBACK = '#44445A'

const FALLBACK_TITLE = 'Транзакции'
const NO_SUBCATEGORIES_SUBTITLE = 'Категория без подкатегорий'

type SheetHeaderProps = {
  row: FlatSpendingRow | null
  month: MonthKey
  onClose: () => void
}

/** Шапка шторки: иконка, имя листа, родитель и месяц. */
export function SheetHeader({ row, month, onClose }: SheetHeaderProps) {
  const iconColor = row?.color ?? ICON_COLOR_FALLBACK
  const monthLabel = formatMonthKey(month, 'uk-UA', { month: 'long', year: 'numeric' })

  return (
    <View className="gap-2.5 border-b border-white/[0.08] px-4 pb-3 pt-4">
      <View className="flex-row items-center gap-3">
        <View
          className="h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconColor + ICON_BG_ALPHA }}
        >
          <SpendingIcon name={row?.icon ?? null} size={18} color={iconColor} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-[17px] font-bold text-[#F2F2FF]" numberOfLines={1}>
            {row?.name ?? FALLBACK_TITLE}
          </Text>
          {row && (
            <Text className="mt-0.5 text-[12px] text-[#8888AA]" numberOfLines={1}>
              {row.parentName ?? NO_SUBCATEGORIES_SUBTITLE}
            </Text>
          )}
        </View>
        <TouchableOpacity
          className="h-8 w-8 items-center justify-center rounded-lg border border-white/[0.12] bg-[#181828]"
          activeOpacity={0.7}
          onPress={onClose}
          accessibilityLabel="Закрыть"
        >
          <X size={15} color="#8888AA" />
        </TouchableOpacity>
      </View>
      <View className="self-start rounded-full bg-[rgba(79,158,255,0.15)] px-2.5 py-1">
        <Text className="text-[11px] font-medium capitalize text-[#4F9EFF]">{monthLabel}</Text>
      </View>
    </View>
  )
}

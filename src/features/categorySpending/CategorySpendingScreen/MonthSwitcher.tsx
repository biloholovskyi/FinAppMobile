import { View, Text, TouchableOpacity } from 'react-native'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'
import { splitMonthKey, type MonthKey } from '@/shared/utils/kyivCalendar'

const MONTH_NAMES_RU = [
  'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь',
]

type Props = {
  /** Выбранный киевский месяц. */
  month: MonthKey
  onPrev: () => void
  onNext: () => void
  isNextDisabled: boolean
}

export function MonthSwitcher({ month, onPrev, onNext, isNextDisabled }: Props) {
  const { year, month: monthNumber } = splitMonthKey(month)

  return (
    <View className="flex-row items-center justify-between bg-[#10101C] border border-white/[0.08] rounded-2xl px-3.5 py-2.5">
      <TouchableOpacity
        onPress={onPrev}
        className="w-8 h-8 items-center justify-center bg-[#181828] border border-white/[0.08] rounded-lg"
        activeOpacity={0.7}
      >
        <ChevronLeft size={16} color="#F2F2FF" />
      </TouchableOpacity>

      <View className="items-center">
        <Text className="text-[#F2F2FF] text-[15px] font-bold capitalize">
          {MONTH_NAMES_RU[monthNumber - 1]}
        </Text>
        <Text className="text-[#8888AA] text-[11px]">
          {year}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onNext}
        disabled={isNextDisabled}
        className="w-8 h-8 items-center justify-center bg-[#181828] border border-white/[0.08] rounded-lg"
        activeOpacity={0.7}
        style={{ opacity: isNextDisabled ? 0.3 : 1 }}
      >
        <ChevronRight size={16} color="#F2F2FF" />
      </TouchableOpacity>
    </View>
  )
}

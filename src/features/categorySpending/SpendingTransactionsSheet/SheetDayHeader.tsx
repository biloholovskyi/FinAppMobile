import { View, Text } from 'react-native'
import { formatKopecksUah } from '../CategorySpendingScreen/lib/spendingFormat'
import type { DaySection } from './lib/groupTransactionsByDay'

type SheetDayHeaderProps = { section: DaySection }

/** Заголовок дня: дата и сумма расходов дня в UAH. */
export function SheetDayHeader({ section }: SheetDayHeaderProps) {
  return (
    <View className="flex-row items-center justify-between bg-[#10101C] py-2.5">
      <Text className="text-[12px] font-semibold uppercase tracking-[0.3px] text-[#8888AA]">
        {section.title}
      </Text>
      <Text className="text-[12px] font-bold text-[#FF4B6B]">
        {`−${formatKopecksUah(section.totalUah)}`}
      </Text>
    </View>
  )
}

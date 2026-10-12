import { View, Text } from 'react-native'
import { ReceiptText } from 'lucide-react-native'

/** Пустое состояние шторки: у листа нет транзакций за месяц. */
export function SheetEmptyState() {
  return (
    <View className="items-center gap-2 py-12">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-[#181828]">
        <ReceiptText size={26} color="#44445A" />
      </View>
      <Text className="text-[15px] font-semibold text-[#F2F2FF]">Операций нет</Text>
      <Text className="px-8 text-center text-[12px] text-[#8888AA]">
        За выбранный месяц по этой категории расходов не было
      </Text>
    </View>
  )
}

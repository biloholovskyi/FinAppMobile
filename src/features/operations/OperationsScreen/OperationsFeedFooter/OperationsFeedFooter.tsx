import { View, Text, ActivityIndicator } from 'react-native'
import { CheckCircle2 } from 'lucide-react-native'
import { TRANSACTIONS_SKELETON_ROWS_COUNT } from '@/shared/constants'
import { SkeletonRow } from './SkeletonRow'

/** Ключи скелетон-строк считаются один раз: список статичен, позиции не меняются. */
const SKELETON_ROW_KEYS = Array.from(
  { length: TRANSACTIONS_SKELETON_ROWS_COUNT },
  (_, index) => `skeleton-row-${index}`,
)

type OperationsFeedFooterProps = {
  isLoadingMore: boolean
  hasMore: boolean
  isEmpty: boolean
}

export function OperationsFeedFooter({
  isLoadingMore,
  hasMore,
  isEmpty,
}: OperationsFeedFooterProps) {
  if (isLoadingMore) {
    return (
      <View className="items-center gap-2.5 pt-[18px] pb-2">
        <ActivityIndicator size="small" color="#4F9EFF" />
        <Text className="text-[#8888AA] text-[11px] font-medium tracking-[0.2px]">
          Загружаем ещё…
        </Text>
        <View className="w-full gap-0.5 mt-1.5">
          {SKELETON_ROW_KEYS.map((key) => (
            <SkeletonRow key={key} />
          ))}
        </View>
      </View>
    )
  }

  if (hasMore || isEmpty) return null

  return (
    <View className="items-center gap-2.5 pt-5 pb-[26px]">
      <View className="w-[60px] h-px bg-white/[0.08]" />
      <View className="flex-row items-center gap-1.5">
        <CheckCircle2 size={15} color="#44445A" />
        <Text className="text-[#44445A] text-[11px] font-medium">Это все транзакции</Text>
      </View>
    </View>
  )
}

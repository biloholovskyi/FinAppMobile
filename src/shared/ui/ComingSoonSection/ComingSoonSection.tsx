import type { ReactNode } from 'react'
import { View, Text } from 'react-native'
import { Clock } from 'lucide-react-native'

type Props = {
  title: string
  message: string | ReactNode
}

export function ComingSoonSection({ title, message }: Props) {
  return (
    <View className="mt-3">
      <Text className="text-[11px] font-semibold tracking-widest uppercase text-[#44445A] px-1 pb-2">
        {title}
      </Text>
      <View className="bg-[#10101C] border border-white/[0.08] rounded-2xl p-6 items-center gap-3">
        <Clock size={32} color="#44445A" />
        {typeof message === 'string' ? (
          <Text className="text-[#44445A] text-[13px] text-center leading-5">{message}</Text>
        ) : (
          message
        )}
      </View>
    </View>
  )
}

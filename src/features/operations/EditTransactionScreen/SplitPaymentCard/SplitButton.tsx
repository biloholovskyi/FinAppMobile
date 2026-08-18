import { Text, TouchableOpacity } from 'react-native'
import * as icons from 'lucide-react-native'

type SplitButtonProps = {
  onPress: () => void
}

export function SplitButton({ onPress }: SplitButtonProps) {
  return (
    <TouchableOpacity
      className="w-full flex-row items-center justify-center gap-2 py-3.5 rounded-2xl border border-white/[0.08] bg-[#10101C]"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <icons.Split size={16} color="#8888AA" />
      <Text className="text-[#8888AA] text-sm font-medium">Разделить платёж</Text>
    </TouchableOpacity>
  )
}

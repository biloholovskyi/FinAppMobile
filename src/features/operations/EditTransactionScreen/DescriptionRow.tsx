import { View, Text, TextInput } from 'react-native'
import * as icons from 'lucide-react-native'

type DescriptionRowProps = {
  value: string
  onChangeText: (value: string) => void
}

export function DescriptionRow({ value, onChangeText }: DescriptionRowProps) {
  return (
    <View className="flex-row items-center gap-3 px-4 py-3.5 border-b border-white/[0.04]">
      <View className="w-[30px] h-[30px] rounded-lg bg-[#181828] border border-white/[0.04] items-center justify-center flex-shrink-0">
        <icons.PencilLine size={14} color="#8888AA" />
      </View>
      <View className="flex-1 gap-[1px]">
        <Text className="text-[#8888AA] text-[11px] font-medium">Описание</Text>
        <TextInput
          className="text-[#F2F2FF] text-sm"
          value={value}
          onChangeText={onChangeText}
          placeholder="Добавить описание..."
          placeholderTextColor="#44445A"
          maxLength={512}
        />
      </View>
    </View>
  )
}

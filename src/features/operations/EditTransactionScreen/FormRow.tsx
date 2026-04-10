import { View, Text, TouchableOpacity } from 'react-native'
import * as icons from 'lucide-react-native'
import { resolveIcon } from '@/shared/utils/icons'
import { hexToRgba } from '@/shared/utils/colors'

type FormRowProps = {
  icon: string
  label: string
  value?: string | null
  categoryColor?: string
  isEmpty?: boolean
  onPress?: () => void
  showChevron?: boolean
}

export function FormRow({ icon, label, value, categoryColor, isEmpty, onPress, showChevron }: FormRowProps) {
  const IconComponent = resolveIcon(icon)

  return (
    <TouchableOpacity
      className="flex-row items-center gap-3 px-4 py-3.5 border-b border-white/[0.04]"
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View className="w-[30px] h-[30px] rounded-lg bg-[#181828] border border-white/[0.04] items-center justify-center flex-shrink-0">
        <IconComponent size={14} color="#8888AA" />
      </View>
      <View className="flex-1 min-w-0 gap-[1px]">
        <Text className="text-[#8888AA] text-[11px] font-medium">{label}</Text>
        {categoryColor ? (
          <View className="flex-row">
            <View
              className="rounded-full px-[7px] py-[2px]"
              style={{ backgroundColor: hexToRgba(categoryColor, 0.15) }}
            >
              <Text style={{ color: categoryColor, fontSize: 12, fontWeight: '500' }}>{value}</Text>
            </View>
          </View>
        ) : (
          <Text className={`text-sm font-medium ${isEmpty ? 'text-[#44445A]' : 'text-[#F2F2FF]'}`}>
            {value || '—'}
          </Text>
        )}
      </View>
      {showChevron && <icons.ChevronRight size={16} color="#44445A" />}
    </TouchableOpacity>
  )
}

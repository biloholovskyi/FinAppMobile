import { Modal, View, Text, FlatList, TouchableOpacity, Pressable } from 'react-native'
import type { ListRenderItem } from 'react-native'
import * as icons from 'lucide-react-native'
import { resolveIcon } from '@/shared/utils/icons'
import { hexToRgba } from '@/shared/utils/colors'
import type { CategoryModel } from '@/entities/category'

type Props = {
  visible: boolean
  title: string
  categories: CategoryModel[]
  selectedId: string | null
  onSelect: (id: string) => void
  onClose: () => void
}

export function CategoryPickerModal({ visible, title, categories, selectedId, onSelect, onClose }: Props) {
  const renderItem: ListRenderItem<CategoryModel> = ({ item }) => {
    const color = item.color ?? '#8888AA'
    const IconComponent = resolveIcon(item.icon ?? '')
    const isSelected = item.id === selectedId

    return (
      <TouchableOpacity
        className="flex-row items-center gap-3 py-3 px-4 border-b border-white/[0.04]"
        onPress={() => { onSelect(item.id); onClose() }}
        activeOpacity={0.7}
      >
        <View
          className="w-8 h-8 rounded-lg items-center justify-center"
          style={{ backgroundColor: hexToRgba(color, 0.15) }}
        >
          <IconComponent size={15} color={color} />
        </View>
        <Text className="flex-1 text-[#F2F2FF] text-sm font-medium">{item.name}</Text>
        {isSelected && <icons.Check size={16} color="#4F9EFF" />}
      </TouchableOpacity>
    )
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50" onPress={onClose} />
      <View className="bg-[#10101C] rounded-t-3xl border-t border-white/[0.08]" style={{ maxHeight: '65%' }}>
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <Text className="text-[#F2F2FF] text-base font-semibold">{title}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={8}>
            <icons.X size={20} color="#8888AA" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={categories}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-6"
        />
      </View>
    </Modal>
  )
}

import { ScrollView, View, Text, TextInput, TouchableOpacity, Switch, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChevronLeft, Check, Tag, Layers } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { resolveIcon } from '@/shared/utils/icons'
import { hexToRgba } from '@/shared/utils/colors'
import { CategoryPriority } from '@/entities/category'
import type { CategoryPriorityValue } from '@/entities/category'
import { useCategoryEditScreen } from './useCategoryEditScreen'

const COLORS = [
  '#FF4B6B', '#FB923C', '#FFB020', '#EAB308',
  '#84CC16', '#00E089', '#2DD4BF', '#22D3EE',
  '#4F9EFF', '#818CF8', '#A374FF', '#F472B6',
]

const ICONS = [
  'shopping-cart', 'coffee', 'car', 'home', 'heart',
  'zap', 'music', 'film', 'book', 'briefcase',
  'plane', 'utensils', 'dumbbell', 'gift', 'smartphone',
  'globe', 'credit-card', 'trending-up', 'shield', 'star',
]

const PRIORITIES: { value: CategoryPriorityValue; label: string }[] = [
  { value: CategoryPriority.low, label: 'Низкий' },
  { value: CategoryPriority.hight, label: 'Высокий' },
]

type Props = { id?: string; parentId?: string; isSubcategory?: string }

export function CategoryEditScreen({ id, parentId, isSubcategory }: Props) {
  const router = useRouter()
  const {
    name, setName,
    priority, setPriority,
    color, setColor,
    icon, setIcon,
    isSubToggle, setIsSubToggle,
    selectedParentId, setSelectedParentId,
    categories,
    isEditMode,
    title,
    handleSubmit,
    isPending,
  } = useCategoryEditScreen({ id, parentId, isSubcategory })

  const IconComponent = resolveIcon(icon)

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A12]">
      <View className="flex-row items-center justify-between px-5 pt-3 pb-2">
        <TouchableOpacity className="flex-row items-center gap-1" activeOpacity={0.7} onPress={() => router.back()}>
          <ChevronLeft size={18} color="#4F9EFF" />
          <Text className="text-[#4F9EFF] text-[14px] font-medium">Назад</Text>
        </TouchableOpacity>
        <Text className="text-[#F2F2FF] text-[17px] font-bold">{title}</Text>
        <View className="w-16" />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="pb-6" showsVerticalScrollIndicator={false}>
        <View className="items-center py-4 gap-2">
          <View className="w-[68px] h-[68px] rounded-[20px] items-center justify-center" style={{ backgroundColor: hexToRgba(color, 0.14) }}>
            <IconComponent size={32} color={color} />
          </View>
          <Text className="text-[#F2F2FF] text-[22px] font-bold tracking-[-0.5px]">{name || 'Новая'}</Text>
          <View className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-[#181828] border border-white/[0.08]">
            {isSubToggle ? <Layers size={10} color="#8888AA" /> : <Tag size={10} color="#8888AA" />}
            <Text className="text-[#8888AA] text-[11px] font-medium">{isSubToggle ? 'Подкатегория' : 'Категория'}</Text>
          </View>
        </View>

        <View className="px-5 mb-4">
          <Text className="text-[#8888AA] text-[11px] font-semibold uppercase tracking-[0.8px] mb-2">Название</Text>
          <TextInput
            className="bg-[#181828] border border-white/[0.08] rounded-2xl px-4 py-3.5 text-[#F2F2FF] text-[15px]"
            placeholder="Введите название"
            placeholderTextColor="#44445A"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="px-5 mb-4">
          <Text className="text-[#8888AA] text-[11px] font-semibold uppercase tracking-[0.8px] mb-2">Приоритет</Text>
          <View className="flex-row bg-[#181828] border border-white/[0.08] rounded-2xl p-1 gap-1">
            {PRIORITIES.map(p => (
              <TouchableOpacity
                key={p.value}
                className="flex-1 py-2.5 rounded-lg items-center"
                style={priority === p.value ? { backgroundColor: hexToRgba('#4F9EFF', 0.2) } : undefined}
                activeOpacity={0.7}
                onPress={() => setPriority(p.value)}
              >
                <Text className="text-[13px] font-semibold" style={{ color: priority === p.value ? '#4F9EFF' : '#44445A' }}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {!isEditMode && !parentId && (
          <View className="px-5 mb-4">
            <Text className="text-[#8888AA] text-[11px] font-semibold uppercase tracking-[0.8px] mb-2">Тип</Text>
            <View className="bg-[#181828] border border-white/[0.08] rounded-2xl overflow-hidden">
              <View className="flex-row items-center px-4 py-3.5 gap-3">
                <View className="flex-1">
                  <Text className="text-[#F2F2FF] text-[15px] font-medium">Подкатегория</Text>
                  <Text className="text-[#8888AA] text-[12px] mt-0.5">Вложена в другую категорию</Text>
                </View>
                <Switch
                  value={isSubToggle}
                  onValueChange={setIsSubToggle}
                  trackColor={{ false: '#1E1E35', true: '#4F9EFF' }}
                  thumbColor="#ffffff"
                  disabled={!!parentId}
                />
              </View>
              {isSubToggle && (
                <View className="border-t border-white/[0.04]">
                  <Text className="text-[#44445A] text-[11px] font-semibold uppercase tracking-[0.8px] px-4 pt-3 pb-2">
                    Родительская категория
                  </Text>
                  {categories.map(cat => {
                    const CatIcon = resolveIcon(cat.icon ?? '')
                    const catColor = cat.color ?? '#8888AA'
                    const isSelected = selectedParentId === cat.id
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        className="flex-row items-center gap-3 px-4 py-2.5 border-t border-white/[0.04]"
                        activeOpacity={0.7}
                        onPress={() => setSelectedParentId(cat.id)}
                      >
                        <View
                          className="w-8 h-8 rounded-[10px] items-center justify-center"
                          style={{ backgroundColor: hexToRgba(catColor, 0.12) }}
                        >
                          <CatIcon size={15} color={catColor} />
                        </View>
                        <Text className="flex-1 text-[#F2F2FF] text-[14px] font-medium" numberOfLines={1}>
                          {cat.name}
                        </Text>
                        {isSelected && (
                          <View className="w-5 h-5 rounded-full bg-[#4F9EFF] items-center justify-center">
                            <Check size={12} color="#080810" />
                          </View>
                        )}
                      </TouchableOpacity>
                    )
                  })}
                </View>
              )}
            </View>
          </View>
        )}

        <View className="px-5 mb-4">
          <Text className="text-[#8888AA] text-[11px] font-semibold uppercase tracking-[0.8px] mb-2">Цвет</Text>
          <View className="flex-row flex-wrap gap-2.5">
            {COLORS.map(c => (
              <TouchableOpacity
                key={c}
                className="w-10 h-10 rounded-full"
                style={{ backgroundColor: c, borderWidth: color === c ? 2 : 0, borderColor: '#ffffff', opacity: color === c ? 1 : 0.85 }}
                activeOpacity={0.8}
                onPress={() => setColor(c)}
              />
            ))}
          </View>
        </View>

        <View className="px-5 mb-4">
          <Text className="text-[#8888AA] text-[11px] font-semibold uppercase tracking-[0.8px] mb-2">Иконка</Text>
          <View className="flex-row flex-wrap gap-2">
            {ICONS.map(ic => {
              const Ic = resolveIcon(ic)
              return (
                <TouchableOpacity
                  key={ic}
                  className="w-[52px] h-[52px] rounded-2xl items-center justify-center border"
                  style={{ backgroundColor: icon === ic ? hexToRgba('#4F9EFF', 0.2) : '#181828', borderColor: icon === ic ? '#4F9EFF' : 'rgba(255,255,255,0.08)' }}
                  activeOpacity={0.7}
                  onPress={() => setIcon(ic)}
                >
                  <Ic size={22} color={icon === ic ? '#4F9EFF' : '#8888AA'} />
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </ScrollView>

      <View className="px-5 py-3.5 border-t border-white/[0.04]">
        <TouchableOpacity
          className="w-full py-4 bg-[#4F9EFF] rounded-2xl flex-row items-center justify-center gap-2"
          activeOpacity={0.85}
          onPress={handleSubmit}
          disabled={isPending || !name.trim()}
        >
          {isPending ? <ActivityIndicator color="#080810" size="small" /> : <Check size={18} color="#080810" />}
          <Text className="text-[#080810] text-[16px] font-bold">Сохранить</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

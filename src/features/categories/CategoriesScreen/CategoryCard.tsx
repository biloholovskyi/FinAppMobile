import { useState, useCallback } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Pencil, Trash2, ChevronDown, Plus } from 'lucide-react-native'
import { resolveIcon } from '@/shared/utils/icons'
import { hexToRgba } from '@/shared/utils/colors'
import type { CategoryModel } from '@/entities/category'

const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
  hight: { label: 'Высокий', color: '#FF4B6B' },
  medium: { label: 'Средний', color: '#FFB020' },
  low: { label: 'Низкий', color: '#4F9EFF' },
}

type Props = {
  category: CategoryModel
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

type SubRowProps = { sub: CategoryModel; onEdit: (id: string) => void; onDelete: (id: string) => void }

function SubRow({ sub, onEdit, onDelete }: SubRowProps) {
  const color = sub.color ?? '#8888AA'
  const priority = PRIORITY_MAP[sub.priority] ?? { label: sub.priority, color: '#8888AA' }
  const IconComponent = resolveIcon(sub.icon ?? '')
  return (
    <View className="flex-row items-center gap-2 pl-8 pr-3.5 py-2.5 border-b border-white/[0.04]">
      <View className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <View
        className="w-[26px] h-[26px] rounded-lg items-center justify-center flex-shrink-0"
        style={{ backgroundColor: hexToRgba(color, 0.12) }}
      >
        <IconComponent size={12} color={color} />
      </View>
      <Text className="flex-1 text-[#8888AA] text-[13px] font-medium" numberOfLines={1}>
        {sub.name}
      </Text>
      <View className="rounded-full px-2 py-[3px]" style={{ backgroundColor: hexToRgba(priority.color, 0.15) }}>
        <Text style={{ color: priority.color, fontSize: 10, fontWeight: '700' }}>{priority.label}</Text>
      </View>
      <View className="flex-row gap-1">
        <TouchableOpacity
          className="w-7 h-7 rounded-lg border border-white/[0.04] items-center justify-center"
          activeOpacity={0.7}
          hitSlop={6}
          onPress={() => onEdit(sub.id)}
        >
          <Pencil size={12} color="#4F9EFF" />
        </TouchableOpacity>
        <TouchableOpacity
          className="w-7 h-7 rounded-lg border border-white/[0.04] items-center justify-center"
          activeOpacity={0.7}
          hitSlop={6}
          onPress={() => onDelete(sub.id)}
        >
          <Trash2 size={12} color="#FF4B6B" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export function CategoryCard({ category, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false)
  const hasSubs = (category.subCategory?.length ?? 0) > 0
  const color = category.color ?? '#8888AA'
  const priority = PRIORITY_MAP[category.priority] ?? { label: category.priority, color: '#8888AA' }
  const IconComponent = resolveIcon(category.icon ?? '')
  const toggle = useCallback(() => { if (hasSubs) setExpanded(v => !v) }, [hasSubs])

  return (
    <View className="bg-[#10101C] border border-white/[0.08] rounded-2xl mb-2 overflow-hidden">
      <View className="flex-row items-center px-3.5 py-3">
        <TouchableOpacity
          className="flex-row items-center gap-2.5 flex-1 min-w-0"
          activeOpacity={hasSubs ? 0.7 : 1}
          onPress={toggle}
        >
          <View className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
          <View
            className="w-[34px] h-[34px] rounded-[10px] items-center justify-center flex-shrink-0"
            style={{ backgroundColor: hexToRgba(color, 0.12) }}
          >
            <IconComponent size={16} color={color} />
          </View>
          <Text className="flex-1 text-[#F2F2FF] text-[14px] font-semibold" numberOfLines={1}>
            {category.name}
          </Text>
        </TouchableOpacity>
        <View className="rounded-full px-2 py-[3px] ml-2" style={{ backgroundColor: hexToRgba(priority.color, 0.15) }}>
          <Text style={{ color: priority.color, fontSize: 10, fontWeight: '700' }}>{priority.label}</Text>
        </View>
        <View className="flex-row gap-1 ml-1.5">
          <TouchableOpacity
            className="w-7 h-7 rounded-lg border border-white/[0.04] items-center justify-center"
            activeOpacity={0.7}
            hitSlop={6}
            onPress={() => onEdit(category.id)}
          >
            <Pencil size={13} color="#4F9EFF" />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-7 h-7 rounded-lg border border-white/[0.04] items-center justify-center"
            activeOpacity={0.7}
            hitSlop={6}
            onPress={() => onDelete(category.id)}
          >
            <Trash2 size={13} color="#FF4B6B" />
          </TouchableOpacity>
        </View>
        {hasSubs && (
          <TouchableOpacity onPress={toggle} hitSlop={8} className="ml-1">
            <View style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}>
              <ChevronDown size={18} color={expanded ? '#4F9EFF' : '#44445A'} />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {expanded && hasSubs && (
        <View className="border-t border-white/[0.04] bg-black/20">
          {category.subCategory!.map(sub => (
            <SubRow key={sub.id} sub={sub} onEdit={onEdit} onDelete={onDelete} />
          ))}
          <TouchableOpacity
            className="flex-row items-center gap-2 pl-8 pr-3.5 py-2.5 opacity-70"
            activeOpacity={0.8}
            onPress={() => {}}
          >
            <Plus size={13} color="#4F9EFF" />
            <Text className="text-[#4F9EFF] text-[12px] font-semibold">Добавить подкатегорию</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

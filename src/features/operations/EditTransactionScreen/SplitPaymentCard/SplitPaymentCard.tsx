import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import * as icons from 'lucide-react-native'
import type { CategoryModel } from '@/entities/category'
import { getCurrencySymbol } from '@/shared/utils/currency'
import { FormRow } from '../FormRow'
import { CategoryPickerModal } from '../CategoryPickerModal/CategoryPickerModal'
import { useSplitPaymentCard } from './useSplitPaymentCard'

const EXPENSE_COLOR = '#FF4B6B'

type SplitPart = {
  categoryId: string | null
  subCategoryId: string | null
  amountStr: string
}

type SplitPaymentCardProps = {
  categories: CategoryModel[]
  part: SplitPart
  currency: string
  onSelectCategory: (id: string | null) => void
  onSelectSubCategory: (id: string | null) => void
  onChangeAmount: (value: string) => void
  onRemove: () => void
}

export function SplitPaymentCard({
  categories,
  part,
  currency,
  onSelectCategory,
  onSelectSubCategory,
  onChangeAmount,
  onRemove,
}: SplitPaymentCardProps) {
  const card = useSplitPaymentCard({
    categories,
    categoryId: part.categoryId,
    subCategoryId: part.subCategoryId,
  })

  return (
    <View className="mx-5 mt-3 bg-[#10101C] border border-white/[0.08] rounded-2xl overflow-hidden">
      <View className="flex-row items-center justify-between px-4 pt-3.5 pb-2.5">
        <View className="flex-1 min-w-0 gap-[1px]">
          <Text className="text-[#F2F2FF] text-sm font-semibold">Новый платёж</Text>
          <Text className="text-[#44445A] text-[11px]">Сумма вычитается из исходной</Text>
        </View>
        <TouchableOpacity className="p-1.5" onPress={onRemove} activeOpacity={0.7}>
          <icons.Trash2 size={16} color={EXPENSE_COLOR} />
        </TouchableOpacity>
      </View>

      <FormRow
        icon="tag"
        label="Категория"
        value={card.selectedCategory?.name}
        categoryColor={card.selectedCategory?.color ?? undefined}
        isEmpty={!card.selectedCategory}
        onPress={card.openCategoryModal}
        showChevron
      />
      {card.hasSubCategories && (
        <FormRow
          icon="tag"
          label="Подкатегория"
          value={card.selectedSubCategory?.name}
          categoryColor={card.selectedSubCategory?.color ?? undefined}
          isEmpty={!card.selectedSubCategory}
          onPress={card.openSubCategoryModal}
          showChevron
        />
      )}

      <View className="flex-row items-center gap-3 px-4 py-3.5">
        <View className="w-[30px] h-[30px] rounded-lg bg-[#181828] border border-white/[0.04] items-center justify-center flex-shrink-0">
          <icons.Coins size={14} color="#8888AA" />
        </View>
        <View className="flex-1 min-w-0 gap-[1px]">
          <Text className="text-[#8888AA] text-[11px] font-medium">Сумма нового платежа</Text>
          <View className="flex-row items-baseline">
            <TextInput
              className="text-[#FF4B6B]"
              style={{ fontSize: 17, fontWeight: '700', minWidth: 60, padding: 0 }}
              value={part.amountStr}
              onChangeText={onChangeAmount}
              keyboardType="decimal-pad"
              maxLength={10}
              placeholder="0"
              placeholderTextColor="#44445A"
            />
            <Text className="text-[#FF4B6B] ml-1" style={{ fontSize: 17, fontWeight: '700' }}>
              {getCurrencySymbol(currency)}
            </Text>
          </View>
        </View>
      </View>

      <CategoryPickerModal
        visible={card.isCategoryModalOpen}
        title="Категория"
        categories={categories}
        selectedId={part.categoryId}
        onSelect={onSelectCategory}
        onClose={card.closeCategoryModal}
      />
      <CategoryPickerModal
        visible={card.isSubCategoryModalOpen}
        title="Подкатегория"
        categories={card.subCategories}
        selectedId={part.subCategoryId}
        onSelect={onSelectSubCategory}
        onClose={card.closeSubCategoryModal}
      />
    </View>
  )
}

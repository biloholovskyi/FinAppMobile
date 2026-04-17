import { useCallback } from 'react'
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Plus } from 'lucide-react-native'
import type { CategoryModel } from '@/entities/category'
import { ComingSoonSection } from '@/shared/ui/ComingSoonSection/ComingSoonSection'
import { CategoryCard } from './CategoryCard'
import { useCategoriesScreen } from './useCategoriesScreen'

function ExpenseHeader() {
  return (
    <Text className="text-[11px] font-semibold tracking-widest uppercase text-[#44445A] px-1 pb-2">
      Расходы
    </Text>
  )
}

export function CategoriesScreen() {
  const {
    categories,
    isLoading,
    refetch,
    isRefetching,
    handleAddCategory,
    handleEdit,
    handleDelete,
  } = useCategoriesScreen()

  const renderItem = useCallback(
    ({ item }: { item: CategoryModel }) => (
      <CategoryCard category={item} onEdit={handleEdit} onDelete={handleDelete} />
    ),
    [handleEdit, handleDelete],
  )

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A12]">
      <View className="flex-row items-center justify-between px-5 pt-4 pb-4">
        <Text className="text-[#F2F2FF] text-[24px] font-bold tracking-[-0.5px]">
          Категории
        </Text>
        <TouchableOpacity
          className="w-[34px] h-[34px] rounded-xl bg-[#4F9EFF] items-center justify-center"
          activeOpacity={0.8}
          onPress={handleAddCategory}
        >
          <Plus size={18} color="#080810" />
        </TouchableOpacity>
      </View>

      <FlatList
        className="flex-1"
        contentContainerClassName="px-4 pb-4"
        data={categories}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<ExpenseHeader />}
        ListEmptyComponent={
          <View className="py-10 items-center">
            <Text className="text-[#44445A] text-[13px]">
              {isLoading ? 'Загрузка...' : 'Нет категорий'}
            </Text>
          </View>
        }
        ListFooterComponent={
          <ComingSoonSection
            title="Доходы"
            message={'Категории доходов\nскоро будут добавлены'}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#4F9EFF"
            colors={['#4F9EFF']}
          />
        }
      />
    </SafeAreaView>
  )
}

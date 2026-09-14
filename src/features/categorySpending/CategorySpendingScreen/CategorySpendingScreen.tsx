import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCategorySpendingScreen } from './useCategorySpendingScreen'
import { MonthSwitcher } from './MonthSwitcher'
import { BudgetSummaryCard } from './BudgetSummaryCard'
import { CategoryCard } from './CategoryCard'
import { SpendingRowCard } from './SpendingRowCard'
import { ViewModeSegment } from './ViewModeSegment'
import { getSpendingListItemKey } from './lib/flattenSpendingRows'
import type { SpendingListItem } from './lib/flattenSpendingRows'

function renderSpendingItem({ item }: { item: SpendingListItem }) {
  switch (item.kind) {
    case 'category':
      return <CategoryCard row={item.row} />
    case 'flat':
      return <SpendingRowCard row={item.row} />
    default: {
      const unreachable: never = item
      void unreachable
      return null
    }
  }
}

export function CategorySpendingScreen() {
  const {
    selectedMonth,
    handlePrevMonth,
    handleNextMonth,
    isNextDisabled,
    viewMode,
    onViewModeChange,
    sectionLabel,
    isLoading,
    isError,
    listItems,
    summary,
  } = useCategorySpendingScreen()

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A12]">
      <View className="px-4 py-3">
        <Text className="text-xl font-bold text-[#F2F2FF]">Статистика</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#4F9EFF" size="large" />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center text-[14px] text-[#8888AA]">
            Не удалось загрузить данные
          </Text>
        </View>
      ) : (
        <FlatList<SpendingListItem>
          data={listItems}
          keyExtractor={getSpendingListItemKey}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 24,
            gap: 10,
          }}
          ListHeaderComponent={
            <View className="gap-2.5 pb-2.5">
              <MonthSwitcher
                selectedMonth={selectedMonth}
                onPrev={handlePrevMonth}
                onNext={handleNextMonth}
                isNextDisabled={isNextDisabled}
              />
              <BudgetSummaryCard summary={summary} />
              <ViewModeSegment
                viewMode={viewMode}
                onChange={onViewModeChange}
              />
              {listItems.length > 0 && (
                <Text className="px-0.5 text-[11px] font-medium uppercase tracking-widest text-[#8888AA]">
                  {sectionLabel}
                </Text>
              )}
            </View>
          }
          ListEmptyComponent={
            <View className="items-center py-12">
              <Text className="text-[14px] text-[#8888AA]">
                Нет расходов за этот месяц
              </Text>
            </View>
          }
          renderItem={renderSpendingItem}
        />
      )}
    </SafeAreaView>
  )
}

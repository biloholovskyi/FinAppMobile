import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCategorySpendingScreen } from './useCategorySpendingScreen'
import { MonthSwitcher } from './MonthSwitcher'
import { BudgetSummaryCard } from './BudgetSummaryCard'
import { CategoryCard } from './CategoryCard'
import type { CategorySpendingRow } from './lib/aggregateCategorySpending'

export function CategorySpendingScreen() {
  const {
    selectedMonth,
    handlePrevMonth,
    handleNextMonth,
    isNextDisabled,
    isLoading,
    isError,
    rows,
    summary,
  } = useCategorySpendingScreen()

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A12]">
      <View className="px-4 py-3">
        <Text className="text-[#F2F2FF] text-xl font-bold">Статистика</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#4F9EFF" size="large" />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-[#8888AA] text-center text-[14px]">
            Не удалось загрузить данные
          </Text>
        </View>
      ) : (
        <FlatList<CategorySpendingRow>
          data={rows}
          keyExtractor={(item) => item.categoryId ?? 'uncategorized'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 10 }}
          ListHeaderComponent={
            <View className="gap-2.5 pb-2.5">
              <MonthSwitcher
                selectedMonth={selectedMonth}
                onPrev={handlePrevMonth}
                onNext={handleNextMonth}
                isNextDisabled={isNextDisabled}
              />
              <BudgetSummaryCard summary={summary} />
              {rows.length > 0 && (
                <Text className="text-[#8888AA] text-[11px] font-medium uppercase tracking-widest px-0.5">
                  По категориям
                </Text>
              )}
            </View>
          }
          ListEmptyComponent={
            <View className="items-center py-12">
              <Text className="text-[#8888AA] text-[14px]">
                Нет расходов за этот месяц
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <CategoryCard row={item} totalExpenses={summary.totalSpent} />
          )}
        />
      )}
    </SafeAreaView>
  )
}

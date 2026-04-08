import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useDashboardScreen } from './useDashboardScreen'
import { ExpenseComparisonCard } from './ExpenseComparisonCard'
import { ExpenseDynamicsCard } from './ExpenseDynamicsCard'

export function DashboardScreen() {
  const {
    isLoading,
    totalCurrent,
    totalPrev,
    diff,
    percentChange,
    currentDayOfMonth,
    currentMonthName,
    currentMonthNameGenitive,
    prevMonthName,
    prevMonthNameGenitive,
    chartDataCurrent,
    chartDataProjected,
    chartDataPrev,
  } = useDashboardScreen()

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A12]">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#4F9EFF" size="large" />
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
          <View className="flex-row items-center justify-between px-5 py-4">
            <Text className="text-[#F2F2FF] text-xl font-bold">Дашборд</Text>
            <LinearGradient
              colors={['#4F9EFF', '#A374FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text className="text-[#F2F2FF] text-[13px] font-bold">DB</Text>
            </LinearGradient>
          </View>

          <ExpenseComparisonCard
            totalCurrent={totalCurrent}
            totalPrev={totalPrev}
            diff={diff}
            percentChange={percentChange}
            currentDayOfMonth={currentDayOfMonth}
            currentMonthName={currentMonthName}
            currentMonthNameGenitive={currentMonthNameGenitive}
            prevMonthName={prevMonthName}
            prevMonthNameGenitive={prevMonthNameGenitive}
          />

          <ExpenseDynamicsCard
            chartDataCurrent={chartDataCurrent}
            chartDataProjected={chartDataProjected}
            chartDataPrev={chartDataPrev}
            currentDayOfMonth={currentDayOfMonth}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

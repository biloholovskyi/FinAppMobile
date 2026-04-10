import { View, Text, Dimensions } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'
import Svg, { Line as SvgLine } from 'react-native-svg'

type DailyPoint = { value: number }

type Props = {
  chartDataCurrent: DailyPoint[]
  chartDataProjected: DailyPoint[]
  chartDataPrev: DailyPoint[]
  currentDayOfMonth: number
}

const SCREEN_WIDTH = Dimensions.get('window').width
const Y_AXIS_LABEL_WIDTH = 38
// mx-3 (12*2=24) + px-4 (16*2=32) = 56px card horizontal space
const CHART_DRAW_WIDTH = SCREEN_WIDTH - 56 - Y_AXIS_LABEL_WIDTH
const CHART_HEIGHT = 150

const LABEL_DAYS = new Set([1, 7, 14, 21, 28])

function buildXLabels(count: number): string[] {
  return Array.from({ length: count }, (_, i) =>
    LABEL_DAYS.has(i + 1) ? String(i + 1) : '',
  )
}

export function ExpenseDynamicsCard({
  chartDataCurrent,
  chartDataProjected,
  chartDataPrev,
  currentDayOfMonth,
}: Props) {
  const hasData = chartDataCurrent.length > 0 || chartDataPrev.length > 0

  // startIndex for projected line: render only from today onwards
  const projectedStartIndex = Math.max(currentDayOfMonth - 1, 0)

  if (!hasData) {
    return (
      <View className="bg-[#10101C] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 mx-3 mb-2.5">
        <Text className="text-[#8888AA] text-[11px] font-medium tracking-widest uppercase mb-3">
          ДИНАМИКА РАСХОДОВ
        </Text>
        <View style={{ height: CHART_HEIGHT }} className="items-center justify-center">
          <Text className="text-[#44445A] text-sm">Нет данных</Text>
        </View>
      </View>
    )
  }

  const allValues = [
    ...chartDataCurrent.map((p) => p.value),
    ...chartDataPrev.map((p) => p.value),
    ...chartDataProjected.map((p) => p.value),
  ]
  const rawMax = allValues.length > 0 ? Math.max(...allValues) : 1000
  const maxValue = Math.ceil((rawMax * 1.15) / 1000) * 1000 || 1000

  const dataLen = Math.max(chartDataCurrent.length, chartDataPrev.length, 1)
  const todayRatio = dataLen > 1 ? (currentDayOfMonth - 1) / (dataLen - 1) : 0
  const todayLineX = Y_AXIS_LABEL_WIDTH + todayRatio * CHART_DRAW_WIDTH

  const xLabels = buildXLabels(dataLen)

  return (
    <View className="bg-[#10101C] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 mx-3 mb-2.5">
      <Text className="text-[#8888AA] text-[11px] font-medium tracking-widest uppercase mb-3">
        ДИНАМИКА РАСХОДОВ
      </Text>

      <View style={{ marginTop: 10, position: 'relative' }}>
        <Text
          style={{
            position: 'absolute',
            top: -14,
            left: todayLineX - 22,
            color: '#FFB020',
            fontSize: 9,
            zIndex: 10,
          }}
        >
          сегодня
        </Text>

        <LineChart
          data={chartDataCurrent}
          endIndex1={currentDayOfMonth - 1}
          data2={chartDataPrev}
          data3={chartDataProjected}
          startIndex3={projectedStartIndex}
          strokeDashArray3={[5, 4]}
          color3="#4F9EFF"
          thickness3={1.5}
          hideDataPoints3
          height={CHART_HEIGHT}
          width={CHART_DRAW_WIDTH}
          yAxisLabelWidth={Y_AXIS_LABEL_WIDTH}
          initialSpacing={0}
          endSpacing={0}
          spacing={(CHART_DRAW_WIDTH) / Math.max(dataLen - 1, 1)}
          color1="#4F9EFF"
          color2="#555570"
          thickness1={2}
          thickness2={2}
          curved
          hideDataPoints
          hideDataPoints2
          disableScroll
          xAxisLabelTexts={xLabels}
          xAxisLabelTextStyle={{ color: '#8888AA', fontSize: 9, width: 20, textAlign: 'center' }}
          yAxisTextStyle={{ color: '#8888AA', fontSize: 9 }}
          backgroundColor="#10101C"
          yAxisColor="transparent"
          xAxisColor="rgba(255,255,255,0.06)"
          rulesColor="rgba(255,255,255,0.04)"
          noOfSections={4}
          maxValue={maxValue}
          formatYLabel={(v) => {
            const n = Number(v)
            return n >= 1000 ? `${n / 1000}к` : String(n)
          }}
        />

        <View
          style={{
            position: 'absolute',
            left: todayLineX,
            top: 0,
            width: 2,
            height: CHART_HEIGHT,
            zIndex: 5,
          }}
          pointerEvents="none"
        >
          <Svg width={2} height={CHART_HEIGHT}>
            <SvgLine
              x1={1}
              y1={0}
              x2={1}
              y2={CHART_HEIGHT}
              stroke="#FFB020"
              strokeWidth={1.5}
              strokeDasharray="4,4"
              strokeOpacity={0.85}
            />
          </Svg>
        </View>
      </View>
    </View>
  )
}

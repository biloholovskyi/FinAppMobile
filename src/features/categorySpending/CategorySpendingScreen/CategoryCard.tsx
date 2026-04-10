import { useState, useCallback } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import {
  ShoppingCart,
  Car,
  Gamepad2,
  Zap,
  HeartPulse,
  Shirt,
  Tag,
  Home,
  UtensilsCrossed,
  Plane,
  Coffee,
  Dumbbell,
  Baby,
  Gift,
  BookOpen,
  Music,
  Smartphone,
  Banknote,
  ShoppingBag,
  Pill,
  Wrench,
  GraduationCap,
  ChevronDown,
} from 'lucide-react-native'
import type {
  CategorySpendingRow,
  SubCategorySpendingRow,
} from './lib/aggregateCategorySpending'

// ── Icon resolution ──────────────────────────────────────────────────────────
type LucideIcon = React.ComponentType<{ size?: number; color?: string }>

const ICON_MAP: Record<string, LucideIcon> = {
  'shopping-cart': ShoppingCart,
  car: Car,
  'gamepad-2': Gamepad2,
  zap: Zap,
  'heart-pulse': HeartPulse,
  shirt: Shirt,
  home: Home,
  'utensils-crossed': UtensilsCrossed,
  plane: Plane,
  coffee: Coffee,
  dumbbell: Dumbbell,
  baby: Baby,
  gift: Gift,
  'book-open': BookOpen,
  music: Music,
  smartphone: Smartphone,
  banknote: Banknote,
  'shopping-bag': ShoppingBag,
  pill: Pill,
  wrench: Wrench,
  'graduation-cap': GraduationCap,
}

function resolveIcon(name: string | null): LucideIcon {
  if (!name) return Tag
  return ICON_MAP[name] ?? Tag
}

// ── Progress helpers ─────────────────────────────────────────────────────────
function getProgressColor(pct: number): string {
  if (pct > 100) return 'rgba(79,158,255,0.35)'
  if (pct >= 80) return '#FFB020'
  return '#4F9EFF'
}

function formatUah(kopecks: number): string {
  return (kopecks / 100).toLocaleString('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  })
}

function formatPct(n: number): string {
  return n.toFixed(1) + '%'
}

// ── SubCategoryItem ──────────────────────────────────────────────────────────
function SubCategoryItem({
  row,
  totalExpenses,
}: {
  row: SubCategorySpendingRow
  totalExpenses: number
}) {
  const hasBudget = row.budget !== null && row.budget > 0
  const pct = hasBudget ? (row.totalSpent / row.budget!) * 100 : 0
  const fillPct = Math.min(pct, 100)
  const overflowPct = pct > 100 ? Math.min((pct - 100) / 100, 1) * 100 : 0
  const isExceeded = pct > 100
  const fillColor = getProgressColor(pct)

  return (
    <View className="gap-1.5">
      <View className="flex-row items-center gap-2">
        <View
          className="h-[5px] w-[5px] rounded-full"
          style={{
            backgroundColor: isExceeded ? 'rgba(255,75,107,0.6)' : '#44445A',
          }}
        />
        <Text className="flex-1 text-[13px] text-[#8888AA]">
          {row.subCategoryName}
        </Text>
        <Text
          className="text-[12px] font-bold"
          style={{
            fontFamily: 'SpaceMono_700Bold',
            color: isExceeded ? '#FF4B6B' : '#F2F2FF',
          }}
        >
          {formatUah(row.totalSpent)}
        </Text>
        <Text className="w-[38px] text-right text-[11px] text-[#44445A]">
          {formatPct((row.totalSpent / totalExpenses) * 100)}
        </Text>
      </View>

      <View className="pl-[13px]">
        <View
          className="h-[5px] overflow-hidden rounded-full"
          style={{
            backgroundColor: hasBudget ? '#181828' : 'rgba(255,255,255,0.03)',
          }}
        >
          {hasBudget && (
            <View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${fillPct}%`,
                backgroundColor: fillColor,
                borderRadius: 99,
              }}
            />
          )}
          {overflowPct > 0 && (
            <View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${overflowPct}%`,
                backgroundColor: '#FF4B6B',
                borderRadius: 99,
              }}
            />
          )}
        </View>
      </View>

      <View className="flex-row justify-between pl-[13px]">
        {hasBudget ? (
          <>
            <Text className="text-[10px] text-[#44445A]">
              {formatUah(row.totalSpent)} из {formatUah(row.budget!)}
              {pct > 0 ? ` · ${pct.toFixed(0)}%` : ''}
            </Text>
            {isExceeded ? (
              <Text className="text-[10px] font-semibold text-[#FF4B6B]">
                +{formatUah(row.totalSpent - row.budget!)}
              </Text>
            ) : (
              <Text className="text-[10px] text-[#44445A]">
                {pct.toFixed(0)}%
              </Text>
            )}
          </>
        ) : (
          <Text className="text-[10px] italic text-[#44445A]">
            бюджет не установлен
          </Text>
        )}
      </View>
    </View>
  )
}

// ── CategoryCard ─────────────────────────────────────────────────────────────
type Props = {
  row: CategorySpendingRow
  totalExpenses: number
}

export function CategoryCard({ row, totalExpenses }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const hasSubCategories = row.subCategories.length > 0

  const handlePress = useCallback(() => {
    if (hasSubCategories) setIsOpen((v) => !v)
  }, [hasSubCategories])

  const hasBudget = row.budget !== null && row.budget > 0
  const pct = hasBudget ? (row.totalSpent / row.budget!) * 100 : 0
  const fillPct = Math.min(pct, 100)
  const overflowPct = pct > 100 ? Math.min((pct - 100) / 100, 1) * 100 : 0
  const isExceeded = pct > 100
  const fillColor = getProgressColor(pct)

  const IconComponent = resolveIcon(row.categoryIcon)
  const iconColor = row.categoryColor ?? '#44445A'
  const iconBg = iconColor + '26'

  return (
    <View
      className="overflow-hidden rounded-2xl bg-[#10101C]"
      style={{
        borderWidth: 1,
        borderColor: isOpen
          ? 'rgba(255,255,255,0.12)'
          : 'rgba(255,255,255,0.08)',
      }}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={hasSubCategories ? 0.7 : 1}
        className="gap-2.5 p-3.5"
      >
        <View className="flex-row items-center gap-2.5">
          <View
            className="h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: iconBg }}
          >
            <IconComponent size={18} color={iconColor} />
          </View>

          <View className="min-w-0 flex-1">
            <View className="flex-row flex-wrap items-center gap-1.5">
              <Text className="text-[14px] font-semibold text-[#F2F2FF]">
                {row.categoryName}
              </Text>
              {hasSubCategories && (
                <View className="rounded-full bg-[#181828] px-1.5 py-[1px]">
                  <Text className="text-[10px] text-[#44445A]">
                    {row.subCategories.length}
                  </Text>
                </View>
              )}
            </View>
            {hasBudget && (
              <Text className="mt-0.5 text-[11px] text-[#44445A]">
                Бюджет: {formatUah(row.budget!)}
              </Text>
            )}
          </View>

          <View className="shrink-0 items-end gap-1">
            <Text
              className="text-[13px] font-bold"
              style={{
                fontFamily: 'SpaceMono_700Bold',
                color: isExceeded ? '#FF4B6B' : '#F2F2FF',
              }}
            >
              {formatUah(row.totalSpent)}
            </Text>
            <View
              className="rounded-full px-[7px] py-[2px]"
              style={{
                backgroundColor: isExceeded
                  ? 'rgba(255,75,107,0.2)'
                  : 'rgba(79,158,255,0.25)',
              }}
            >
              <Text
                className="text-[11px] font-medium"
                style={{ color: isExceeded ? '#FF4B6B' : '#4F9EFF' }}
              >
                {formatPct(row.percentOfTotal)}
              </Text>
            </View>
          </View>

          <View style={{ opacity: hasSubCategories ? 1 : 0 }}>
            <View
              style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
            >
              <ChevronDown size={15} color={isOpen ? '#4F9EFF' : '#44445A'} />
            </View>
          </View>
        </View>

        {hasBudget && (
          <View className="gap-1.5">
            <View className="h-[7px] overflow-hidden rounded-full bg-[#181828]">
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${fillPct}%`,
                  backgroundColor: fillColor,
                  borderRadius: 99,
                }}
              />
              {overflowPct > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${overflowPct}%`,
                    backgroundColor: '#FF4B6B',
                    borderRadius: 99,
                  }}
                />
              )}
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[10px] text-[#8888AA]">
                {formatUah(row.totalSpent)} из {formatUah(row.budget!)} ·{' '}
                {pct.toFixed(0)}%
              </Text>
              {isExceeded ? (
                <Text className="text-[10px] font-semibold text-[#FF4B6B]">
                  +{formatUah(row.totalSpent - row.budget!)} превышение
                </Text>
              ) : (
                <Text
                  className="text-[10px]"
                  style={{ color: pct >= 80 ? '#FFB020' : '#8888AA' }}
                >
                  осталось {formatUah(row.budget! - row.totalSpent)}
                </Text>
              )}
            </View>
          </View>
        )}
      </TouchableOpacity>

      {isOpen && hasSubCategories && (
        <View className="gap-3 border-t border-white/[0.04] px-3.5 pb-3.5 pt-2">
          {row.subCategories.map((sub) => (
            <SubCategoryItem
              key={sub.subCategoryId}
              row={sub}
              totalExpenses={totalExpenses}
            />
          ))}
        </View>
      )}
    </View>
  )
}

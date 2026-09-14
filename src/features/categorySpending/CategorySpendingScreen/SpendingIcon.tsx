import { createElement } from 'react'
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
} from 'lucide-react-native'

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

type SpendingIconProps = { name: string | null; size: number; color: string }

/**
 * Renders a category icon from ICON_MAP.
 *
 * Declared at module level on purpose: resolving the component inside a caller's
 * render reads to `react-hooks/static-components` as a component created during render.
 */
export function SpendingIcon({ name, size, color }: SpendingIconProps) {
  return createElement(resolveIcon(name), { size, color })
}

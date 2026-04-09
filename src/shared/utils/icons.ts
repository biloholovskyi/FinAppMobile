import * as icons from 'lucide-react-native'
import type { LucideIcon } from 'lucide-react-native'

export function resolveIcon(name: string): LucideIcon {
  const pascal = name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
  return (icons as unknown as Record<string, LucideIcon>)[pascal] ?? icons.CircleHelp
}

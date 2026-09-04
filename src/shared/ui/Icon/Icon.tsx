import { createElement } from 'react'

import { resolveIcon } from '@/shared/utils/icons'

type IconProps = {
  /** Kebab-case Lucide icon name, e.g. `arrow-right-left`. Unknown names fall back to a placeholder. */
  name: string
  size: number
  color: string
}

/**
 * Renders a Lucide icon by name.
 *
 * The lookup lives here rather than at call sites on purpose: binding a resolved
 * component to a local variable and rendering it as JSX reads to
 * `react-hooks/static-components` as a component created during render.
 */
export function Icon({ name, size, color }: IconProps) {
  return createElement(resolveIcon(name), { size, color })
}

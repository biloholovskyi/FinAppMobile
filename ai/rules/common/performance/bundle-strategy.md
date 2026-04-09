---
title: Bundle Size Optimization Strategy
impact: CRITICAL
impactDescription: Reduces initial bundle, improves TTI and LCP
tags: bundle, imports, tree-shaking, dynamic-import, lazy-loading, preload
---

## Bundle Size Optimization Strategy

Reduce initial JavaScript bundle by loading code at the right time: direct imports for tree-shaking, dynamic imports for heavy components, deferred loading for non-critical libraries, and preloading for perceived speed.

### 1. Avoid barrel file imports (tree-shaking)

```tsx
// Bad: loads 1,583 modules (200-800ms cold start)
import { Check, X, Menu } from 'lucide-react'

// Good: loads only 3 modules (~2KB)
import Check from 'lucide-react/dist/esm/icons/check'
import X from 'lucide-react/dist/esm/icons/x'
import Menu from 'lucide-react/dist/esm/icons/menu'
```

Commonly affected: `lucide-react`, `@mui/material`, `@tabler/icons-react`, `react-icons`, `lodash`, `date-fns`.

### 2. Dynamic imports for heavy components

```tsx
// React
const LineChart = lazy(() =>
  import('recharts').then(mod => ({ default: mod.LineChart }))
)

function Dashboard() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <LineChart data={data} />
    </Suspense>
  )
}
```

Good candidates: chart libraries, rich text editors, PDF viewers, map components, syntax highlighters.

### 3. Conditional module loading (on activation)

```tsx
function ExportButton({ data }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = async () => {
    setIsLoading(true)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const doc = await PDFDocument.create()
      // ...
    } finally {
      setIsLoading(false)
    }
  }

  return <button onClick={handleExport} disabled={isLoading}>Export PDF</button>
}
```

Use for: export functionality, admin-only features, debug tools, rarely used modals.

### 4. Defer non-critical third-party libraries

```tsx
useEffect(() => {
  const loadAnalytics = () => { import('@vercel/analytics') }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadAnalytics)
  } else {
    setTimeout(loadAnalytics, 1)
  }
}, [])
```

Defer: analytics, error tracking, feature flags, chat widgets, heatmaps.

### 5. Preload on hover/focus

```tsx
const SettingsModal = dynamic(() => import('./SettingsModal'))
const preloadSettingsModal = () => { import('./SettingsModal') }

function SettingsButton() {
  const [showModal, setShowModal] = useState(false)
  return (
    <button
      onClick={() => setShowModal(true)}
      onMouseEnter={preloadSettingsModal}
      onFocus={preloadSettingsModal}
    >
      Settings
    </button>
  )
}
```

Average hover-to-click: ~300-400ms — enough to load most modules.

**When NOT to optimize:**
- Small modules (<5KB) — overhead of dynamic import exceeds savings
- Components always visible on initial render
- SSR-critical content (must be in initial bundle)

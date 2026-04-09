---
title: Strategic Suspense Boundaries
impact: CRITICAL
impactDescription: Enables streaming and progressive loading
tags: async, suspense, react, streaming
---

## Strategic Suspense Boundaries

Use Suspense boundaries to stream content progressively. Place boundaries around slow data fetches to show fast content immediately.

**Incorrect (single boundary blocks everything):**

```tsx
function Page() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <Header />
      <SlowDataComponent />
      <Footer />
    </Suspense>
  )
}
```

**Correct (granular boundaries):**

```tsx
function Page() {
  return (
    <>
      <Header />
      <Suspense fallback={<DataSkeleton />}>
        <SlowDataComponent />
      </Suspense>
      <Footer />
    </>
  )
}
```

**Best (nested boundaries for progressive reveal):**

```tsx
function Dashboard() {
  return (
    <>
      <Header />
      <div className="grid">
        <Suspense fallback={<StatsSkeleton />}>
          <StatsPanel />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <SlowChart />
        </Suspense>
        <Suspense fallback={<TableSkeleton />}>
          <DataTable />
        </Suspense>
      </div>
    </>
  )
}
```

**Key principles:**
- Wrap slow async components individually
- Use meaningful skeleton/loading states
- Don't wrap synchronous components
- Consider user experience: what should load first?

# Rule Sections

Defines all sections, ordering, impact levels, and descriptions.
Section ID (in parentheses) is the filename prefix for grouping rules.

---

## 1. Eliminating Waterfalls (async)

**Impact:** CRITICAL
**Files:** `async-waterfalls.md` (Promise.all, start-early/await-late, phased parallelization, API routes), `async-suspense-boundaries.md` (React streaming)

## 2. Bundle Size Optimization (bundle)

**Impact:** CRITICAL
**Files:** `bundle-strategy.md` (barrel imports, dynamic imports, conditional loading, deferred third-party, preload on hover)

## 3. Client-Side Data Fetching (client)

**Impact:** MEDIUM-HIGH
**Files:** `client-swr-dedup.md` (SWR/React Query request deduplication)

## 4. Re-render Optimization (rerender)

**Impact:** MEDIUM
**Files:** `rerender-strategy.md` (memo, functional setState, lazy init, primitive deps, useTransition), `rerender-derived-state.md` (derive during render, derived booleans)

## 5. Rendering Performance (rendering)

**Impact:** MEDIUM
**Files:** `rendering-conditional-render.md` (ternary vs &&), `rendering-hoist-jsx.md` (static JSX), `rendering-content-visibility.md` (CSS), `rendering-hydration-no-flicker.md` (SSR)

## 6. JavaScript Performance (js)

**Impact:** LOW-MEDIUM
**Files:** `js-set-map-lookups.md` (O(1) lookups), `js-early-exit.md` (guard clauses)

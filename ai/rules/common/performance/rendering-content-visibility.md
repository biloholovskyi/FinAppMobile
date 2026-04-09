---
title: Use content-visibility for Long Lists
impact: MEDIUM
impactDescription: Skips rendering of off-screen content
tags: rendering, css, content-visibility, performance
---

## Use content-visibility for Long Lists

Use CSS `content-visibility: auto` to skip rendering of off-screen content. The browser will only render items as they scroll into view.

**Basic usage:**

```css
.list-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px; /* Estimated height */
}
```

**In React:**

```tsx
function VirtualizedList({ items }) {
  return (
    <ul className="list">
      {items.map(item => (
        <li
          key={item.id}
          style={{
            contentVisibility: 'auto',
            containIntrinsicSize: '0 80px'
          }}
        >
          <ItemCard item={item} />
        </li>
      ))}
    </ul>
  )
}
```

**With CSS modules:**

```css
/* styles.module.css */
.listItem {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

```tsx
import styles from './styles.module.css'

function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} className={styles.listItem}>
          <ItemCard item={item} />
        </li>
      ))}
    </ul>
  )
}
```

**When to use:**
- Lists with 50+ items
- Cards/tiles that are mostly off-screen
- Tabbed content (hidden tabs)

**Considerations:**
- Set `contain-intrinsic-size` to avoid layout shifts
- Not a replacement for virtualization with 1000+ items
- May cause issues with `position: sticky`

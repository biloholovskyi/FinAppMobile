---
title: Prevent Hydration Flicker
impact: MEDIUM
impactDescription: Eliminates flash of incorrect content
tags: rendering, hydration, ssr, flicker
---

## Prevent Hydration Flicker

Use inline scripts or CSS to set client-only values before React hydrates. This prevents a flash of incorrect content.

**Problem - theme flickers on load:**

```tsx
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    // This runs after hydration - causes flicker
    setTheme(localStorage.getItem('theme') || 'light')
  }, [])

  return <div data-theme={theme}>{children}</div>
}
```

**Solution - inline script in head:**

```tsx
// In _document.tsx or layout.tsx
<head>
  <script
    dangerouslySetInnerHTML={{
      __html: `
        (function() {
          var theme = localStorage.getItem('theme') || 'light';
          document.documentElement.setAttribute('data-theme', theme);
        })();
      `
    }}
  />
</head>
```

**For color scheme:**

```tsx
<head>
  <script
    dangerouslySetInnerHTML={{
      __html: `
        (function() {
          var theme = localStorage.getItem('theme');
          if (!theme) {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark' : 'light';
          }
          document.documentElement.classList.add(theme);
        })();
      `
    }}
  />
  <style>{`
    .dark { --bg: #000; --text: #fff; }
    .light { --bg: #fff; --text: #000; }
  `}</style>
</head>
```

**With cookies (SSR-safe):**

```tsx
// Server can read cookie and render correct theme
export async function getServerSideProps({ req }) {
  const theme = req.cookies.theme || 'light'
  return { props: { theme } }
}
```

Reference: [Josh Comeau - The Quest for the Perfect Dark Mode](https://www.joshwcomeau.com/react/dark-mode/)

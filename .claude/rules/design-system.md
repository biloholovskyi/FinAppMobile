---
paths:
  - "designs/**/*.html"
---

# Design System

Applies to: `designs/**/*.html`

## CDN (always include, in this order)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
```

## CSS Variables (always declare in `:root`)

```css
:root {
  /* Backgrounds */
  --bg-void: #050508;
  --bg-base: #0A0A12;
  --bg-surface: #10101C;
  --bg-elevated: #181828;
  --bg-overlay: #1E1E35;

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.04);
  --border-default: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.16);

  /* Accents */
  --accent-blue: #4F9EFF;
  --accent-blue-glow: rgba(79, 158, 255, 0.25);
  --accent-green: #00E089;
  --accent-green-glow: rgba(0, 224, 137, 0.2);
  --accent-red: #FF4B6B;
  --accent-red-glow: rgba(255, 75, 107, 0.2);
  --accent-amber: #FFB020;
  --accent-purple: #A374FF;

  /* Text */
  --text-primary: #F2F2FF;
  --text-secondary: #8888AA;
  --text-muted: #44445A;
  --text-inverse: #080810;

  /* Shadows & Glows */
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.4);
  --glow-blue: 0 0 20px rgba(79, 158, 255, 0.3), 0 0 60px rgba(79, 158, 255, 0.1);
  --glow-green: 0 0 20px rgba(0, 224, 137, 0.3);
  --glow-red: 0 0 20px rgba(255, 75, 107, 0.3);

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-full: 9999px;

  /* Transitions */
  --ease-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --t-fast: 150ms;
  --t-base: 280ms;
  --t-slow: 500ms;
}
```

## Typography

| Usage | Font | Weight |
|-------|------|--------|
| Screen titles, display | `Syne` | 700, 800 |
| Section headers | `Syne` | 600 |
| Currency amounts, numbers | `Space Mono` | 700 |
| Small numbers, codes | `Space Mono` | 400 |
| Body text, labels, UI | `Outfit` | 400, 500 |
| Captions, hints | `Outfit` | 300 |

## Keyframe Animations (always include)

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes glowPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
}

@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.85); }
  to   { opacity: 1; transform: scale(1); }
}
```

**Staggered load pattern** — apply to cards/list items:
```css
.card { animation: fadeUp var(--t-slow) var(--ease-out) both; }
.card:nth-child(1) { animation-delay: 0ms; }
.card:nth-child(2) { animation-delay: 60ms; }
.card:nth-child(3) { animation-delay: 120ms; }
/* etc. — 60ms increment per item */
```

## Phone Frame (required wrapper)

```html
<!-- Page background -->
<body style="background: radial-gradient(ellipse at top, #0A0612 0%, #02020A 60%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px;">

  <!-- Phone shell -->
  <div class="phone">
    <!-- Status bar -->
    <div class="status-bar">
      <span class="status-time">9:41</span>
      <div class="status-icons">
        <i data-lucide="signal" width="14" height="14"></i>
        <i data-lucide="wifi" width="14" height="14"></i>
        <i data-lucide="battery" width="14" height="14"></i>
      </div>
    </div>

    <!-- Screen content -->
    <div class="screen">
      <!-- YOUR CONTENT HERE -->
    </div>

    <!-- Home indicator -->
    <div class="home-indicator"></div>
  </div>

</body>
```

**Phone frame CSS:**
```css
.phone {
  width: 375px;
  height: 812px;
  background: var(--bg-base);
  border-radius: 44px;
  overflow: hidden;
  position: relative;
  box-shadow:
    0 0 0 1px var(--border-default),
    0 40px 80px rgba(0, 0, 0, 0.7),
    inset 0 0 0 1px rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px 0;
  color: var(--text-primary);
  flex-shrink: 0;
}

.status-time {
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  font-size: 15px;
}

.status-icons {
  display: flex;
  gap: 6px;
  align-items: center;
  color: var(--text-primary);
}

.screen {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  padding: 0;
}

.screen::-webkit-scrollbar { display: none; }

.home-indicator {
  width: 134px;
  height: 5px;
  background: var(--text-primary);
  border-radius: var(--radius-full);
  margin: 8px auto 8px;
  opacity: 0.3;
  flex-shrink: 0;
}
```

**Lucide init (always at end of `<body>`):**
```html
<script>lucide.createIcons();</script>
```

## Component Patterns

### Card
```css
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 16px;
  box-shadow: var(--shadow-card);
  transition: transform var(--t-base) var(--ease-out),
              box-shadow var(--t-base) var(--ease-out);
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card), var(--glow-blue);
}
```

### Amount (positive / negative)
```css
.amount-positive { color: var(--accent-green); font-family: 'Space Mono', monospace; font-weight: 700; }
.amount-negative { color: var(--accent-red);   font-family: 'Space Mono', monospace; font-weight: 700; }
.amount-neutral  { color: var(--text-primary);  font-family: 'Space Mono', monospace; font-weight: 700; }
```

### Pill / Badge
```css
.pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
  font-weight: 500;
}
.pill-blue   { background: var(--accent-blue-glow);  color: var(--accent-blue);  }
.pill-green  { background: var(--accent-green-glow); color: var(--accent-green); }
.pill-red    { background: var(--accent-red-glow);   color: var(--accent-red);   }
```

### Primary Button
```css
.btn-primary {
  background: var(--accent-blue);
  color: var(--text-inverse);
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  border: none;
  border-radius: var(--radius-md);
  padding: 14px 24px;
  cursor: pointer;
  transition: transform var(--t-fast) var(--ease-spring),
              box-shadow var(--t-base) var(--ease-out);
}
.btn-primary:hover {
  transform: scale(1.02);
  box-shadow: var(--glow-blue);
}
.btn-primary:active { transform: scale(0.98); }
```

### Tab Bar (bottom navigation)
```css
.tab-bar {
  display: flex;
  justify-content: space-around;
  padding: 12px 0 4px;
  background: var(--bg-surface);
  border-top: 1px solid var(--border-subtle);
  flex-shrink: 0;
}
.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
  font-family: 'Outfit', sans-serif;
  font-size: 10px;
  transition: color var(--t-fast) var(--ease-out);
  cursor: pointer;
}
.tab-item.active { color: var(--accent-blue); }
```

## Rules

- Dark theme only — no light mode, no `prefers-color-scheme`
- No inline `style=""` for layout — only for dynamic JS-computed values
- No hardcoded hex colors in CSS — CSS variables only
- Each HTML file is self-contained (embedded `<style>` and `<script>`)
- Always use phone frame wrapper
- Currency: UAH, format with `uk-UA` locale (`toLocaleString('uk-UA')`)
- Amounts from API are in kopecks — divide by 100 for display
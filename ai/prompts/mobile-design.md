# Playbook: Mobile Screen Design (HTML)

Use when designing a new screen as an HTML mockup.

## Load Before Starting

1. `.claude/rules/design-system.md` — CSS variables, typography, phone frame
2. `.claude/rules/charts.md` — only if screen contains charts

## Process

1. Create file: `designs/screens/<screen-name>.html`
2. Apply phone frame wrapper (required)
3. Use design system CSS variables — no hardcoded hex
4. Use Russian text for all UI labels and content
5. Use `uk-UA` locale for amounts, `ru-RU` for other text
6. Format amounts as kopecks/100 in UAH display

## Required Structure

```html
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <title>Screen Name</title>
  <!-- CDN links from design-system.md -->
  <style>
    :root { /* CSS variables from design-system.md */ }
    /* Keyframe animations from design-system.md */
  </style>
</head>
<body>
  <!-- Phone frame from design-system.md -->
  <script>lucide.createIcons();</script>
</body>
</html>
```

## Rules

- Dark theme only — no light mode
- All text in Russian
- Currency: UAH, `uk-UA` locale
- No hardcoded hex colors — CSS variables only
- Each file is self-contained (embedded `<style>` and `<script>`)
- Always include phone frame wrapper

## References

- `.claude/rules/design-system.md` — full design system spec
- `.claude/rules/charts.md` — chart types and Chart.js setup

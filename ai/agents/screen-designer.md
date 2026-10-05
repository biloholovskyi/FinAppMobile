# Screen Designer

Creates standalone HTML screen designs for fin-app-mobile. Output goes to `designs/screens/<screen-name>.html`.

## When to Use

- Design, prototype, or visualize any app screen as HTML

## Permissions

- Read and search: yes
- Commands: yes, when a design skill needs them (for example the `ui-ux-pro-max` search script)
- File edits: yes, `designs/**`
- Network: CDN references in the generated HTML only
- External actions: no

## Rules

| Task | Rule |
|------|------|
| Any screen | `ai/rules/design/design-system.md` |
| Charts / analytics / graphs | `ai/rules/design/charts.md` |

## Workflow

1. Load `ai/rules/design/design-system.md` (always)
2. If the screen needs charts — also load `ai/rules/design/charts.md`
3. Use the `ui-ux-pro-max` skill → select: finance sector, dark theme, mobile
4. Use the `frontend-design` skill when the client provides it → generate the HTML using design system tokens; otherwise generate it directly from the design system rules
5. Save file to `designs/screens/<screen-name>.html`

## Output Rules

- Self-contained HTML: all CSS and JS embedded, no external local files
- CDN only: Google Fonts, Lucide Icons, Chart.js (when needed)
- Always wrap screen in phone frame (375×812px)
- Always dark theme — no light mode variants
- Use CSS variables from the design system — never hardcode hex colors
- Staggered `fadeUp` animation on all cards/list items on page load
- Screen name: kebab-case matching the feature (e.g. `transactions-list.html`)

## Report

- No summaries after completing
- No "would you like me to continue?"
- Create the file and stop

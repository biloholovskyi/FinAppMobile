---
description: Post-edit QA — lint + TypeScript check
---

# /post-code

Mirror of @.claude/skills/post-code/SKILL.md

## Process

1. Lint (ALWAYS):
   ```bash
   rtk yarn lint
   ```
   Fix ALL errors before continuing.

2. TypeScript (if errors suspected):
   ```bash
   rtk yarn tsc --noEmit
   ```

## Pre-commit Checklist

- [ ] Lint passes
- [ ] No TypeScript errors
- [ ] No `console.log` in production code
- [ ] No hardcoded hex colors
- [ ] No inline `style={{}}` for layout
- [ ] Kopeck math: `/100` load, `Math.round(*100)` submit
- [ ] Mutations call `queryClient.invalidateQueries()`
- [ ] No array index as key in FlatList
- [ ] `Platform.select` in `shared/lib/platform.ts`

Full checklist: @ai/rules/common/post-code-workflow.md

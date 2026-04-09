---
name: post-code
description: Run post-edit QA workflow for fin-app-mobile — lint + TypeScript check
model: haiku
---

# Skill: Post-Code

Mandatory quality checks after any code change.

## Process

1. Run lint (ALWAYS):
   ```bash
   rtk yarn lint
   ```
   Fix ALL errors before continuing.

2. Run TypeScript check (if TypeScript errors are suspected):
   ```bash
   rtk yarn tsc --noEmit
   ```

3. Checklist before committing:
   - [ ] Lint passes
   - [ ] No TypeScript errors
   - [ ] No `console.log` in production code
   - [ ] No hardcoded hex colors (use Tailwind tokens)
   - [ ] No inline `style={{}}` for layout
   - [ ] Kopeck math correct: `/100` on load, `Math.round(*100)` on submit
   - [ ] Mutations call `queryClient.invalidateQueries()`
   - [ ] No array index as key in FlatList
   - [ ] `Platform.select` extracted to `shared/lib/platform.ts`

## References

- `ai/rules/common/post-code-workflow.md` — full checklist

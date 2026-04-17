---
description: Run ESLint and fix all errors
---

# /lint

Mirror of @.claude/skills/lint/SKILL.md

## Process

1. Run lint with auto-fix:
   ```bash
   rtk yarn lint
   ```

2. Fix remaining errors manually.

3. Re-run to confirm clean:
   ```bash
   rtk yarn lint
   ```

4. If TS errors suspected:
   ```bash
   rtk yarn tsc --noEmit
   ```

## Common Errors

- NativeWind: use `className`, not `style={{}}` for layout
- Unused vars: remove or prefix with `_`
- Missing deps in `useCallback`/`useEffect`
- Forbidden imports: `expo-router` in `shared/`, `entities/`, `features/`

Full rules: @ai/rules/common/post-code-workflow.md

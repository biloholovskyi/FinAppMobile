---
name: lint
description: Run ESLint and fix all errors in fin-app-mobile
model: haiku
---

# Skill: Lint

Run ESLint and fix all errors.

## Process

1. Run lint with auto-fix:
   ```bash
   rtk yarn lint
   ```

2. If errors remain after auto-fix, fix them manually.

3. Re-run to confirm clean:
   ```bash
   rtk yarn lint
   ```

4. If TypeScript errors are suspected, also run:
   ```bash
   rtk yarn tsc --noEmit
   ```

## Common Errors

- NativeWind: use `className` prop, not `style={{}}` for layout
- Import order: auto-fixed by `--fix`
- Unused vars: remove or prefix with `_` if intentional
- Missing deps in `useCallback`/`useEffect`: add to dependency array
- Forbidden imports: `expo-router` in `shared/`, `entities/`, `features/`

## References

- `ai/rules/common/post-code-workflow.md`

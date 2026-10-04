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

4. If code changed during this run, the type check follows — always, per `ai/rules/common/post-code-workflow.md`:
   ```bash
   rtk yarn tsc --noEmit
   ```

## Common Errors

- NativeWind: use `className` prop, not `style={{}}` for layout
- Import order: auto-fixed by `--fix`
- Unused vars: remove or prefix with `_` if intentional
- Missing deps in `useCallback`/`useEffect`: add to dependency array
- Forbidden imports: `expo-router` in `shared/`, `entities/`, `features/`

## Notes

- `rtk yarn lint` applies `--fix` and writes files — reviewing roles use `rtk npx eslint src` instead (`ai/rules/common/agent-workflow.md`)
- For the full QA gate use the `post-code` skill

## References

- `ai/rules/common/post-code-workflow.md`

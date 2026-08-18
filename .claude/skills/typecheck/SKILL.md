---
name: typecheck
description: Run TypeScript type checking only (no emit) for fin-app-mobile
model: haiku
---

# Skill: Typecheck

Type-only check, no lint, no emit.

## Process

No `typecheck` script is defined in `package.json` — run the compiler directly:

```bash
rtk yarn tsc --noEmit
```

Report errors grouped by file, most-blocking first.

## Notes

- This is the same check CI runs on every push to `main` (`.github/workflows/deploy-expo.yml`) — a failure here blocks the OTA publish
- For the full QA gate (lint + typecheck) use `/post-code` instead
- Do not fix errors as a side effect unless asked — report them

## References

- `ai/rules/common/post-code-workflow.md`
- `ai/rules/common/tooling.md`

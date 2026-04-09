---
name: commit
description: Create a git commit with proper conventional format for fin-app-mobile
model: haiku
---

# Skill: Commit

Create a conventional commit for fin-app-mobile.

## Process

1. Check status:
   ```bash
   rtk git status
   rtk git diff --staged
   ```

2. Verify post-code checks passed (run if not done):
   ```bash
   rtk yarn lint
   ```

3. Stage files (specific files, not `git add -A`):
   ```bash
   rtk git add src/path/to/changed/file.ts
   ```

4. Create commit:
   ```bash
   rtk git commit -m "type(scope): description"
   ```

## Commit Format

`type(scope): short description` (max 72 chars, imperative mood, no period)

Types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `style`, `ci`, `build`, `revert`

Examples:
- `feat(transactions): add filter by category`
- `fix(dashboard): correct kopeck division on balance`
- `chore(deps): upgrade expo-router to 3.5`

## Rules

- Do NOT use `Co-authored-by:` trailers
- One logical change per commit
- Never commit: generated artifacts, secrets, `.env` files
- Never use `git add -A` or `git add .` — stage specific files

## References

- `ai/rules/common/commit-message-and-crosslinks.md`

---
description: Create a conventional commit for fin-app-mobile
---

# /commit

Mirror of @.claude/skills/commit/SKILL.md

## Process

1. Check status:
   ```bash
   rtk git status
   rtk git diff --staged
   ```

2. Verify lint passed (run if not done):
   ```bash
   rtk yarn lint
   ```

3. Stage specific files (never `git add -A`):
   ```bash
   rtk git add src/path/to/file.ts
   ```

4. Commit:
   ```bash
   rtk git commit -m "type(scope): description"
   ```

## Format

`type(scope): short description` (max 72 chars, imperative mood, no period)

Types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `style`, `ci`, `build`, `revert`

## Rules

- No `Co-authored-by:` trailers
- One logical change per commit
- Never commit generated artifacts, secrets, `.env`

Full rules: @ai/rules/common/commit-message-and-crosslinks.md

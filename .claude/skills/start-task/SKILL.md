---
name: start-task
description: Create a correctly named work branch from the right base for fin-app-mobile
model: haiku
---

# Skill: Start Task

Create a work branch for a new feature or fix.

## Process

1. Confirm ticket ID (e.g. `FAM-42`) and task type
2. Determine branch type:
   - New feature → `feature/`
   - Planned bugfix → `fix/`
   - Docs only → `docs/`
   - Tooling/deps → `chore/`
3. Choose base branch:
   - Active `release/*` exists and task targets that release → branch from `release/<version>`
   - Otherwise → branch from `develop`
   - Hotfix → use `/hotfix` skill instead
4. Create branch:
   ```bash
   rtk git switch develop
   rtk git pull --ff-only
   rtk git switch -c feature/FAM-42-short-description
   ```

## Branch Naming

Pattern: `type/FAM-ID-short-description`
- Lowercase kebab-case
- Max 64 chars
- One ticket per branch

Examples:
- `feature/FAM-42-transaction-filter`
- `fix/FAM-50-balance-kopeck-bug`
- `chore/FAM-60-expo-sdk-upgrade`

## References

- `ai/rules/common/skills/git-branch-kickoff.md`
- `ai/rules/common/git-conventions.md`

# Skill: Git Branch Kickoff (AI-driven)

Use when starting a new task: creating feature, fix, or other work branches.

## Triggers

- User asks to start a new task or feature
- User asks to create a branch for a ticket (FAM-XXX)
- User says "start task", "create branch", "new feature branch"

## Process

1. Confirm the ticket ID (e.g. `FAM-42`). If not provided, ask the user or proceed without it.
2. Determine branch type from task context:
   - New feature or capability → `feature/*`
   - Planned bugfix (non-incident) → `fix/*`
   - Documentation-only → `docs/*`
   - Tooling / CI / deps → `chore/*`
   - Refactoring → `refactor/*`
   - Tests-only → `test/*`
3. Choose the correct base branch:
   - If an active `release/*` branch exists and the task targets that release → branch from **`release/<version>`**
   - If no active release → branch from **`develop`**
   - `hotfix/*` → branch from **`main`** or last release tag (use `git-hotfix-flow` skill instead)
4. Create the branch:
   ```bash
   rtk git switch <base>
   rtk git pull --ff-only
   rtk git switch -c <type>/<FAM-KEY>-<short-description>
   ```
5. Verify naming rules (from `ai/rules/common/git-conventions.md`):
   - Pattern: `type/FAM-ID-short-description`
   - Lowercase kebab-case slug
   - Prefer <= 64 chars total
   - One ticket per branch

## Branch naming examples

- `feature/FAM-42-transaction-list-screen`
- `fix/FAM-50-dashboard-balance-display`
- `docs/FAM-55-api-integration-readme`
- `chore/FAM-60-upgrade-expo-sdk`
- `refactor/FAM-65-extract-shared-types`

## Anti-patterns

- Branching from `main` for regular development (only `hotfix/*` branches from `main`)
- Branching from `develop` when an active `release/*` exists and task targets that release
- Forgetting `git pull --ff-only` before branching (stale base)
- Mixing multiple tickets in one branch

## Output

- Branch created and checked out locally
- Report branch name and base branch used

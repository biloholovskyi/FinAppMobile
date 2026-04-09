# Git Conventions (fin-app-mobile)

Commit messages, branch naming, PR routing, and release conventions.

## Commit Message Format

`type(scope): short description`

Types:
- `feat`: New feature or capability
- `fix`: Bug fix
- `refactor`: Code change (no new feature, no fix)
- `perf`: Performance improvement
- `test`: Add or update tests
- `docs`: Documentation only
- `chore`: Build, CI, tooling, deps
- `style`: Formatting/whitespace (no logic change)
- `ci`: CI/CD pipeline changes
- `build`: Build system or dependency changes
- `revert`: Revert a previous commit

Scope examples:
- Feature: `feat(transactions): add filter by category`
- Fix: `fix(dashboard): correct kopeck division on balance display`
- Chore: `chore(deps): upgrade expo-router to 3.5`

Rules:
- Subject line <= 72 chars, imperative mood, no period
- Explain why in body when needed
- Include ticket ID in footer when applicable: `Closes FAM-XXX`
- Do NOT use `Co-authored-by:` trailers in commit messages
- One logical change per commit

## Branch Roles

- `main`: Production source of truth; releases are tagged from `main`
- `develop`: Integration/development branch; base for feature branches
- `release/*`: Release preparation branch, created from `develop`
- `feature/*`: New feature work, created from `develop`
- `fix/*`: Planned bugfix work, created from `develop`
- `hotfix/*`: Production incident fixes, created from `main` or release tag

## PR Routing Rules

- `feature/*`, `fix/*`, `docs/*`, `chore/*`, `refactor/*`, `test/*` → `develop`
- `develop` → `main` (via release branch)
- `hotfix/*` → `main`, then mandatory back-merge into `develop`

## Branch Naming

Pattern: `type/ticket-short-description`

Examples:
- `feature/FAM-42-transaction-list-screen`
- `fix/FAM-50-dashboard-balance-display`
- `hotfix/1.0.1`
- `release/1.1.0`
- `r-1.1.0` (short release branch format, accepted)

Rules:
- Lowercase kebab-case slug
- Include ticket ID when available (FAM-XXX)
- Prefer <= 64 chars total
- One ticket per feature/fix branch

## Tags and Releases

- Create release tags only from `main`
- Use SemVer with `v` prefix: `v1.0.0`
- EAS Build triggered by release flow — see `ai/rules/common/skills/git-release-flow.md`

## Post-Release Sync

- After every release (merge to `main`): back-merge `main` into `develop`
- After every hotfix: back-merge `main` into `develop`

## Pull Request Rules

Title: conventional style (`type(scope): description`)

Description should include:
- Summary (1-3 bullets)
- Ticket link (`FAM-XXX`)
- Test evidence (manual smoke test on device/simulator)
- Breaking changes (if any)

## Anti-Patterns

- Direct commits to `main`/`develop` for regular development
- Opening feature PR directly to `main`
- Skipping back-merge to `develop` after hotfix
- Mixing unrelated concerns in one PR
- Force-pushing shared branches
- Committing generated artifacts or secrets
- Using `Co-authored-by:` trailers in commit messages

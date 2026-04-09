# Skill: Git Hotfix Flow (AI-driven)

Use when handling urgent production incident fixes that bypass the normal release cycle.

## Triggers

- User asks to create a hotfix
- User reports a production incident requiring immediate fix
- User says "hotfix", "urgent prod fix", "production bug"
- User asks to fix something on `main` directly

## When to use hotfix vs fix

- **`hotfix/*`**: Production is broken or degraded RIGHT NOW. Bypasses `release/*` and `develop`, goes straight to `main`.
- **`fix/*`**: Planned bugfix, not urgent. Follows normal flow: branch from `develop` → PR to `develop` → `main`.

If the issue is not a production incident, redirect to the normal `fix/*` flow using `git-branch-kickoff` skill.

## Process

### Phase 1: Create hotfix branch

1. Confirm the ticket ID and issue description.
2. Create hotfix branch from **`main`**:
   ```bash
   rtk git switch main
   rtk git pull --ff-only
   rtk git switch -c hotfix/<version-or-ticket>
   ```
   Or from a specific **release tag**:
   ```bash
   rtk git switch -c hotfix/<version> v<X.Y.Z>
   ```
   Example names: `hotfix/1.0.1`, `hotfix/FAM-99-crash-on-launch`

### Phase 2: Implement and validate

1. Implement the minimal fix (smallest possible change to resolve the incident)
2. Run mandatory checks:
   ```bash
   rtk yarn lint && rtk yarn tsc --noEmit
   ```
3. Commit with conventional format: `fix(scope): description`
4. Include ticket in footer: `Closes FAM-XXX`

### Phase 3: Merge to main

1. Push hotfix branch and open PR `hotfix/* → main` on GitHub
2. Quality gates for `hotfix/* → main`:
   - Fix is minimal and targeted
   - Lint and TypeScript check pass
   - Tested on device/simulator
   - Back-merge to `develop` is tracked in PR checklist
3. After approval, merge to `main`

### Phase 4: Tag and EAS build

1. Create patch release tag on `main`:
   ```bash
   rtk git switch main
   rtk git pull --ff-only
   rtk git tag v<X.Y.Z>
   rtk git push origin v<X.Y.Z>
   ```
   Find last tag: `rtk git for-each-ref --sort=-creatordate --count=3 --format="%(refname:strip=2)" refs/tags`
2. Trigger EAS production build:
   ```bash
   rtk npx eas build --profile production --platform all
   ```
3. Submit update to stores after QA passes

### Phase 5: Mandatory back-merge

**This step is NOT optional.**

1. Back-merge `main` into `develop`:
   ```bash
   rtk git switch develop
   rtk git pull --ff-only
   rtk git merge main
   rtk git push
   ```
2. Resolve merge conflicts carefully if present
3. Verify `develop` is in sync with `main`

## PR routing summary

```
hotfix/* → main (bypasses release/* and develop)
main     → develop (mandatory back-merge)
```

## Anti-patterns

- Using `hotfix/*` for non-urgent bugs (use `fix/*` instead)
- Branching hotfix from `develop` instead of `main`
- Skipping the back-merge to `develop` after hotfix
- Making large changes in a hotfix (keep it minimal)
- Forgetting to create release tag and EAS build after merging

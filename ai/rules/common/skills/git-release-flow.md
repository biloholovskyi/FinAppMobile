# Skill: Git Release Flow (AI-driven)

Use when preparing, executing, or completing a release cycle for fin-app-mobile.

## Triggers

- User asks to create a release branch
- User asks to prepare a release
- User says "start release", "release 1.2.0", "create release branch"
- User asks about release process or next steps after QA

## Process

### Phase 1: Create release branch

1. Confirm the release version (e.g. `1.2.0`). If not provided, check recent tags and suggest next version.
2. Create release branch from **`develop`**:
   ```bash
   rtk git switch develop
   rtk git pull --ff-only
   rtk git switch -c release/<version>
   ```
3. Bump version in `app.json` and `package.json`:
   ```bash
   # Update "version" field in app.json
   # Update "version" field in package.json
   rtk git commit -m "chore(release): bump version to <version>"
   ```

### Phase 2: Collect features

- Ready `feature/*` and `fix/*` branches merge into `release/*` via PRs
- Each PR must pass lint and TypeScript check

### Phase 3: QA on device/simulator

1. Build for testing:
   ```bash
   rtk npx eas build --profile preview --platform all
   ```
2. Test on physical device or simulator
3. Fix any issues in `release/*` branch directly

### Phase 4: Promote to main

1. Open PR `release/* → main` on GitHub
2. Merge after QA approval
3. Tag on `main`:
   ```bash
   rtk git switch main
   rtk git pull --ff-only
   rtk git tag v<version>
   rtk git push origin v<version>
   ```

### Phase 5: EAS Production Build

1. Trigger production build:
   ```bash
   rtk npx eas build --profile production --platform all
   ```
2. Submit to stores (when ready):
   ```bash
   rtk npx eas submit --platform ios
   rtk npx eas submit --platform android
   ```

### Phase 6: Post-release sync

1. Back-merge `main` into `develop`:
   ```bash
   rtk git switch develop
   rtk git pull --ff-only
   rtk git merge main
   rtk git push
   ```

## PR routing summary

```
feature/*, fix/* → develop (or release/* if targeting active release)
release/*        → main
hotfix/*         → main (then back-merge to develop)
```

## Anti-patterns

- Creating `release/*` from `main` instead of `develop`
- Skipping post-release back-merge `main` → `develop`
- Creating tags without actual release intent
- Skipping device QA before merging to `main`

## Output

- Release branch created, or release cycle advanced to next phase
- Report current phase, branch state, and next action

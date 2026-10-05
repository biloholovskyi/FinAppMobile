# Deployment (EAS + GitHub Actions)

Mission: SSoT for the release pipeline, OTA updates, environment/secrets, and rollback for `fin-app-mobile`.

## Constants

- PUBLISH_TRIGGER_BRANCH = `main`
- CI_WORKFLOW = `.github/workflows/deploy-expo.yml`
- CI_JOB = `publish`
- NODE_VERSION_CI = 22
- INSTALL_COMMAND_CI = `yarn install --frozen-lockfile`
- EAS_CONFIG_FILE = `eas.json`
- EAS_BUILD_PROFILE = `production`
- EAS_CHANNEL = `production`
- EAS_UPDATE_ENVIRONMENT = `production` (the `--environment` flag; required from SDK 55 onward)
- OTA_BRANCH = `production`
- APP_CONFIG_FILE = `app.json`
- EAS_PROJECT_ID = `expo.extra.eas.projectId` in APP_CONFIG_FILE
- UPDATES_URL = `expo.updates.url` in APP_CONFIG_FILE
- RUNTIME_VERSION = `expo.runtimeVersion` in APP_CONFIG_FILE

## Two Release Paths

| Path | Delivers | Trigger | Reaches users |
|------|----------|---------|---------------|
| OTA update (`eas update`) | JS bundle + assets only | Automatic on push to PUBLISH_TRIGGER_BRANCH | Installed builds with a matching RUNTIME_VERSION, on next app launch |
| Native build (`eas build`) | New app binary | Manual | Only after store submission and user install |

Decision rule:
- JS/TS, styles, assets → OTA is enough
- New native module, Expo SDK upgrade, changed native config in APP_CONFIG_FILE (permissions, plugins, bundle identifier, icons/splash) → native build required, and RUNTIME_VERSION must be bumped

## OTA Pipeline (automatic)

| Step | Actor | Action |
|------|-------|--------|
| 1 | Developer | Push to PUBLISH_TRIGGER_BRANCH |
| 2 | GitHub Actions | Checkout, setup Node NODE_VERSION_CI with yarn cache |
| 3 | GitHub Actions | Setup EAS CLI via `expo/expo-github-action` with `EXPO_TOKEN` |
| 4 | GitHub Actions | INSTALL_COMMAND_CI |
| 5 | GitHub Actions | `yarn tsc --noEmit` — a type error fails the job and blocks publishing |
| 6 | GitHub Actions | `eas update --branch OTA_BRANCH --environment production --message "<commit message> (<sha>)"` |
| 7 | Expo | Update published; clients on a matching RUNTIME_VERSION pick it up on next launch |

CI does NOT run ESLint — only the type check. Lint is a local gate (`rtk yarn lint`) and part of the `deploy-preflight` skill.

## Native Build (manual)

- Build: `rtk npx eas build --profile EAS_BUILD_PROFILE --platform all`
- Recent builds: `rtk npx eas build:list --limit 5`
- Submit: `rtk npx eas submit --platform ios` / `--platform android`
- EAS_CONFIG_FILE defines a single `production` profile bound to EAS_CHANNEL

## Environment Variables and Secrets

| Name | Scope | Purpose |
|------|-------|---------|
| `EXPO_PUBLIC_API_URL` | GitHub Actions secret + local `.env` | REST API base URL; bundled into the app — NOT a secret value |
| `EXPO_TOKEN` | GitHub Actions secret | Authenticates the EAS CLI in CI |

- Every client-readable variable must use the `EXPO_PUBLIC_` prefix and is visible in the shipped bundle
- Real secrets never go into `EXPO_PUBLIC_*`, APP_CONFIG_FILE, or EAS_CONFIG_FILE — use EAS Secrets or GitHub Actions secrets
- `.env` and `.env*.local` are git-ignored

## Pre-Release Gates

Before merging into PUBLISH_TRIGGER_BRANCH (the `deploy-preflight` skill runs these in order, stopping at the first failure):

1. `rtk yarn lint`
2. `rtk yarn tsc --noEmit`
3. `rtk yarn agents:check --strict`
4. `version` matches across `package.json` and `expo.version` in APP_CONFIG_FILE
5. `CHANGELOG.md` has a section for the target version dated today
6. Current branch matches `r-<version>`
7. EAS_CONFIG_FILE parses and the EAS_BUILD_PROFILE profile exists
8. `EXPO_PUBLIC_API_URL` is set for the target environment
9. Native-vs-OTA impact stated; RUNTIME_VERSION bumped only if a native build is required

Version and CHANGELOG rules: `ai/rules/common/versioning-changelog.md`.

## Rollback

- OTA: republish the previous known-good state with `eas update` on OTA_BRANCH, or roll back the update in the Expo dashboard. Clients recover on next launch.
- A bad OTA update cannot be recalled from a client that has already downloaded it — only superseded by a newer update.
- Native build: no rollback after store release; ship a new build. Store review latency is the real cost, which is why native-affecting changes need extra scrutiny.
- RUNTIME_VERSION mismatch is the classic silent failure: updates publish successfully but reach nobody. Verify the runtimeVersion of installed builds before assuming an update shipped.

## Provisioning Prerequisites (User-Side)

One-time setup outside the codebase; the pipeline assumes it exists.

- Expo project created under owner `amitil13`, EAS_PROJECT_ID and UPDATES_URL written into APP_CONFIG_FILE
- GitHub Actions secrets configured: `EXPO_TOKEN`, `EXPO_PUBLIC_API_URL`
- EAS CLI available locally for manual builds and submissions
- Store credentials configured in EAS for `eas submit`

## Out of Scope

- Staging or PR preview channels — production-only for now
- Automated store submission from CI
- Crash reporting / APM (Sentry, OpenTelemetry)
- Automating Expo project or store credential provisioning

## Anti-Patterns

- Bumping RUNTIME_VERSION for a JS-only change — it orphans installed builds from OTA updates
- Shipping a native-dependent change as an OTA update — it reaches clients that cannot run it
- Putting secrets in `EXPO_PUBLIC_*`, APP_CONFIG_FILE, or EAS_CONFIG_FILE
- Editing EAS_CONFIG_FILE profiles or channels without updating this file
- Pushing to PUBLISH_TRIGGER_BRANCH without running the pre-release gates — CI only type-checks
- Logging `EXPO_TOKEN` or any EAS API response containing credentials
- Running EAS commands unprefixed instead of `rtk npx eas ...`
- Calling `eas update` without `--environment` — SDK 55 and later reject the command

## Related Rules

- `ai/rules/common/versioning-changelog.md` — version/branch/changelog sync before release
- `ai/rules/common/tooling.md` — package manager, command reference
- `ai/rules/common/post-code-workflow.md` — local quality gates
- `ai/rules/projects/fin-app-mobile/architecture.md` — env variable conventions

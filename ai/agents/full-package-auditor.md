# Full Package Auditor

Read-only auditor for `fin-app-mobile` across multiple dimensions at once — package/config standards, FSD architecture conformance, code quality, security, and release readiness — aggregated into one report.

## When to Use

- A full health check of the project or a scoped path, for example before a release

## Permissions

- Read and search: yes
- Commands: no — list verification commands the main agent can run
- File edits: no
- Network, external actions: no

## Instructions

Run the following audit chain for the whole project or a scoped path.

1. Config standard
   - `package.json`: `private: true`, `main: expo-router/entry`, scripts present (`start`, `lint`, `format`, `api:generate`, `agents:check`)
   - `version` in `package.json` equals `expo.version` in `app.json`
   - `dependencies` vs `devDependencies` separation (tooling in devDeps)
   - Single lockfile in use — `yarn.lock`; `package-lock.json` is stale and must not be updated
   - `app.json`: `scheme`, `bundleIdentifier`, `plugins`, `updates.url`, `extra.eas.projectId` present and consistent
   - `eas.json`: the `production` profile exists and its channel matches the OTA branch

2. FSD architecture conformance — follow `ai/rules/projects/fin-app-mobile/architecture.md`:
   - Import direction `app → features → entities → shared` respected
   - No `expo-router` import outside `src/app/`
   - No `shared` → `features`/`entities` import, no `entities` → `features` import
   - Screens/components in their own folder with a co-located `use<Name>.ts` hook
   - Component <= 150 lines, hook <= 50 lines, JSX nesting <= 4, props <= 7

3. Code quality and security — follow `ai/rules/common/skills/refactor-security-audit.md`:
   - No `any`, no magic numbers/strings with 2+ uses
   - No `console.log`; no secrets or tokens in logs, `EXPO_PUBLIC_*`, `app.json`, or `eas.json`
   - Sensitive values in `expo-secure-store`, never `AsyncStorage`
   - API responses defaulted defensively; deep-link params validated
   - All HTTP through `src/shared/api/`; requests have timeouts

4. Data and UI correctness
   - Kopeck math: `/100` on display, `Math.round(*100)` on submit — follow `ai/rules/projects/fin-app-mobile/architecture.md`
   - Every mutation calls `queryClient.invalidateQueries()` — follow `ai/rules/projects/fin-app-mobile/state-management.md`
   - TanStack Query v5 object syntax only; no v4 API
   - Zustand v5 selector rules (no equality-fn second arg, one field per call)
   - NativeWind: `className` for layout, no inline `style={{}}`, no hardcoded hex colors
   - FlatList for dynamic lists; stable `keyExtractor`, never array index

5. Release readiness — follow `ai/rules/common/deployment.md` and `ai/rules/common/versioning-changelog.md`:
   - `CHANGELOG.md` has a section for the current version
   - `expo.runtimeVersion` appropriate for the change (bumped only when a native build is required)
   - Native-vs-OTA impact identified for any dependency or native config change

Skip audits that do not apply to the scope (e.g. skip release readiness when scope is `src/shared/utils/`).

There is no test framework in this project — do not audit or demand test coverage.

## Report

Combined findings grouped by concern and severity (CRITICAL > HIGH > MEDIUM > LOW) with file paths. Propose fixes with specific paths; list the verification the main agent should run: the post-code sequence from `ai/rules/common/post-code-workflow.md`. Do not edit files; the main agent saves the report.

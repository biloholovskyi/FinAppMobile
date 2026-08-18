---
name: deploy-preflight
description: Pre-merge checks before pushing to main — lint, typecheck, version sync, CHANGELOG, EAS config, OTA-vs-native impact
model: sonnet
---

# Skill: Deploy Preflight

Run before merging into `main` to confirm the branch is safe to publish. Every push to `main` publishes an OTA update automatically, so this is the last human-controlled gate.

SSoT: `ai/rules/common/deployment.md`, `ai/rules/common/versioning-changelog.md`.

## Process

Run in order, stop at the first failure:

1. Lint — CI does NOT run ESLint, so this is the only place it is caught:
   ```bash
   rtk yarn lint
   ```

2. Type check — the same gate CI runs:
   ```bash
   rtk yarn tsc --noEmit
   ```

3. Version sync:
   - Ask the user for the target version if it was not stated this session
   - `version` in `package.json` equals `expo.version` in `app.json` equals the target version

4. CHANGELOG (`CHANGELOG.md`):
   - A section `[<version>] DD.MM.YYYY` exists at the top with today's date
   - Completed work is listed as short bullets, newest first

5. Branch:
   - Current branch is `r-<version>` — report a mismatch, do not switch branches

6. EAS config:
   - `eas.json` parses and the `production` profile exists with its channel
   - `app.json` has `expo.updates.url`, `expo.extra.eas.projectId`, and `expo.runtimeVersion`

7. OTA-vs-native impact — the judgment call that matters most:
   - Review the diff for new native modules, Expo SDK changes, or changed native config in `app.json` (permissions, plugins, bundle identifier, icons/splash)
   - JS-only change → OTA is sufficient, `runtimeVersion` must stay untouched
   - Native-affecting change → a new EAS build is required and `runtimeVersion` must be bumped; publishing it as OTA reaches clients that cannot run it
   - State the verdict explicitly in the report

8. Environment:
   - `EXPO_PUBLIC_API_URL` is set for the target environment
   - No secrets in `EXPO_PUBLIC_*`, `app.json`, or `eas.json`

## Reporting

- Report each step pass/fail in order; stop at the first failure with the exact command output
- End with the OTA-vs-native verdict and what it implies for shipping
- This skill never pushes, merges, deploys, builds, or commits — it only verifies readiness

## Arguments

- `$ARGUMENTS` — optional scope hint used only to narrow which output to highlight

## References

- `ai/rules/common/deployment.md`
- `ai/rules/common/versioning-changelog.md`
- `ai/rules/common/post-code-workflow.md`

---
name: eas-status
description: Report recent EAS builds, the active OTA channel, and runtimeVersion for fin-app-mobile
model: haiku
---

# Skill: EAS Status

Read-only snapshot of the release state. Runs no mutating commands.

SSoT: `ai/rules/common/deployment.md`.

## Process

1. Recent builds:
   ```bash
   rtk npx eas build:list --limit 5
   ```

2. Local release config — read, do not modify:
   - `app.json`: `expo.version`, `expo.runtimeVersion`, `expo.updates.url`
   - `eas.json`: `production` profile and its channel
   - `package.json`: `version`

3. Recent OTA updates, when needed:
   ```bash
   rtk npx eas update:list --branch production --limit 5
   ```

## Reporting

Lead with the release picture, then the details:
- Latest build per platform: status, version, timestamp
- Active channel/branch and the `runtimeVersion` those builds expect
- Whether `package.json` `version` and `app.json` `expo.version` agree — flag a mismatch
- Flag a `runtimeVersion` mismatch between the latest builds and the current `app.json` value: updates published now would not reach those builds

## Hard Rules

- Read-only — never run `eas build`, `eas update`, or `eas submit`
- Never print token values or credentials
- No git operations

## References

- `ai/rules/common/deployment.md`
- `ai/rules/common/versioning-changelog.md`

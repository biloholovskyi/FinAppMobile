# Skill: EAS Submit

Send a built binary to a store. This is outward-facing and cannot be undone — a submitted build enters review and, once released, can only be superseded by a new build.

SSoT: `ai/rules/common/deployment.md`.

## Before Running

1. Confirm the `deploy-preflight` skill passed.
2. Identify the exact build to submit:
   ```bash
   rtk npx eas build:list --limit 5
   ```
   Confirm the build ID, platform, version, and that its status is finished.
3. Confirm with the user, explicitly and separately:
   - Which platform (`ios` or `android`)
   - Which build ID
   - That they intend a real store submission now

Do not proceed on an implied or blanket approval from an earlier step.

## Process

```bash
rtk npx eas submit --platform <ios|android>
```

## Reporting

- Report the submission ID and status
- State clearly that the build is now in store review and cannot be recalled
- On failure: report the exact error (credentials, missing metadata, duplicate version) and hand off to the `eas-deployer` agent

## Hard Rules

- Never run without explicit, specific confirmation for this submission
- Never submit a build the user has not identified by ID or platform
- Never bump versions or edit store metadata as a side effect
- No git operations

## Arguments

- Optional platform hint from the invoking message (`ios`, `android`)

## References

- `ai/rules/common/deployment.md`
- `ai/rules/common/versioning-changelog.md`

# Skill: EAS Build

Produce a new native binary. This costs build credits and produces an artifact intended for store release — confirm scope before running.

SSoT: `ai/rules/common/deployment.md`. Delegate diagnosis of failures to the `eas-deployer` agent.

## Before Running

1. Confirm the `deploy-preflight` skill passed. If it has not run this session, run it first.
2. Confirm a native build is actually needed. A JS-only change ships as an OTA update — a build is wasted effort:
   - New native module, Expo SDK upgrade, or changed native config in `app.json` → build required
   - Otherwise → stop and tell the user an OTA update suffices
3. Confirm with the user: profile (`production`) and platform (`ios`, `android`, or `all`). Do not assume.
4. Confirm `expo.runtimeVersion` in `app.json` was bumped if this build changes native compatibility.

## Process

```bash
rtk npx eas build --profile production --platform <ios|android|all>
```

Then:
```bash
rtk npx eas build:list --limit 3
```

## Reporting

- Report the build ID, platform, status, and artifact/dashboard link
- Never infer success from the CLI exit code alone — confirm the terminal state via `build:list`
- On failure: report the failing stage and hand off to the `eas-deployer` agent for diagnosis; do not retry blindly

## Hard Rules

- Never run without an explicit user request for this specific action
- Never run `eas submit` as a follow-up unless separately asked — use the `eas-submit` skill
- Never bump versions yourself — the user decides (`ai/rules/common/versioning-changelog.md`)
- No git operations

## Arguments

- Optional platform hint from the invoking message (`ios`, `android`, `all`)

## References

- `ai/rules/common/deployment.md`
- `ai/rules/common/versioning-changelog.md`

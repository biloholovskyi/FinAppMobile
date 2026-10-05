# Pre-merge review
Date: 2026-10-04
Scope: acceptance copy `C:\Projects\FinApp\fin-app-mobile\.acceptance-scratch-20261004\preflight`

## Verdict

Do not merge this copy into `main` yet. The required strict agent configuration gate failed. Following the deploy-preflight stop-on-failure rule, subsequent release checks were not run.

## Gates in required order

1. Lint — passed (exit 0) using `rtk proxy yarn.cmd lint` after `rtk yarn lint` returned `[rtk: program not found]`. ESLint reported 0 errors and 3 warnings: two unused variables in `src/features/dashboard/DashboardScreen/useDashboardScreen.ts` and one axios import warning in `src/shared/api/base.ts`.
2. TypeScript — passed (exit 0) using `rtk proxy yarn.cmd tsc --noEmit`.
3. Agent configuration — failed (exit 1) using `rtk proxy yarn.cmd agents:check --strict`.
4. Version sync — not run.
5. CHANGELOG — not run.
6. Branch — not run.
7. EAS config — not run.
8. OTA versus native impact — not run; verdict unavailable until the blocking gate is resolved.
9. Environment — not run; `.env` and authorization files were not read.

## Blocking command output

```text
[rtk] /!\ No hook installed — run `rtk init -g` for automatic token savings
yarn run v1.22.22
$ node scripts/check-agent-config.mjs --strict --strict
.claude/INDEX.md: broken reference ".claude/settings.local.json"
ai/agents/eas-deployer.md: broken reference ".github/workflows/deploy-expo.yml"
ai/rules/common/deployment.md: broken reference ".github/workflows/deploy-expo.yml"
ai/rules/common/tooling.md: broken reference ".claude/settings.local.json"
ai/skills/typecheck/procedure.md: broken reference ".github/workflows/deploy-expo.yml"

agents:check (strict) failed: 5 violation(s)
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

## Follow-up

Resolve the five references in the release candidate, rerun the preflight from lint, then complete the remaining release checks. No OTA shipping conclusion can be made from this stopped run.

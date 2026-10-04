# Agent Roles — fin-app-mobile

Canonical roles shared by every client. Each role's instructions live in `ai/agents/<name>.md`; client adapters only point here and add client metadata. Execution contract: `ai/rules/common/agent-workflow.md`.

## Task → Role

| Task | Role |
|------|------|
| Screen / component / hook / navigation / styling / bug fix | `finapp-mobile-expert` |
| Code review after implementation | `code-reviewer` |
| Implementation plan audit (pre or post) | `plan-auditor` |
| Read-only codebase exploration | `codebase-researcher` |
| HTML screen prototype in `designs/` | `screen-designer` |
| React Native performance review | `react-performance-reviewer` |
| Run project scripts and report output | `command-runner` |
| Dependency / Expo SDK compatibility analysis | `dependency-analyst` |
| Broad read-only project audit | `full-package-auditor` |
| EAS build, OTA update, release diagnosis | `eas-deployer` |

Delegation along this table needs no separate permission. When delegation is unavailable, the main agent executes the role canon directly.

## Separation

- Implementer and reviewer are separate runs; a role never reviews its own output
- Reviewing roles return findings; the main agent saves them per the review-artifact contract in `ai/rules/common/agent-workflow.md`
- Reviewing roles never run `rtk yarn lint` (it applies `--fix`); they use `rtk yarn tsc --noEmit` and `rtk npx eslint src`

## Permission Matrix

| Role | Read / search | Commands | File edits | Network | External actions |
|------|---------------|----------|------------|---------|------------------|
| `codebase-researcher` | yes | no | no | no | no |
| `plan-auditor` | yes | no | no | no | no |
| `react-performance-reviewer` | yes | no | no | no | no |
| `full-package-auditor` | yes | no — proposes verification commands to the main agent | no | no | no |
| `code-reviewer` | yes | read-only checks: `rtk yarn tsc --noEmit`, `rtk npx eslint src` | no | no | no |
| `dependency-analyst` | yes | diagnostics without writes: `expo install --check`, `yarn why`, `yarn outdated`, `yarn audit`, `yarn info` | no — install and upgrade are proposed as commands | registry reads for diagnostics only | no |
| `command-runner` | yes | `rtk` scripts from `ai/rules/common/tooling.md` | only as a side effect of a requested script (`lint --fix`, `api:generate`) | as required by the requested script | no |
| `finapp-mobile-expert` | yes | yes | yes | documentation lookup | no |
| `screen-designer` | yes | yes | yes, `designs/**` | CDN references only | no |
| `eas-deployer` | yes | yes | yes, release artifacts | yes | only on explicit user request |

"no" in the matrix is binding even where a client cannot enforce it technically; each adapter states which limits its client enforces.

## Tiers

Tier per role: `ai/rules/common/ai-models.md`.

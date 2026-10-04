# Skill: Post-Code

Mandatory quality checks after any change. The sequence is owned by `ai/rules/common/post-code-workflow.md`; this procedure executes it.

## Process

Stop at the first failure and fix it before the next step. A failed step is never reported as a passed QA.

1. Code or build config changed (`src/**`, `*.ts`, `*.tsx`, `tsconfig.json`, `eslint.config.js`, `package.json`):
   ```bash
   rtk yarn lint
   rtk yarn tsc --noEmit
   ```
   Fix ALL lint errors first; the type check always runs right after lint.

2. Agent configuration changed (`AGENTS.md`, `CLAUDE.md`, `ai/**`, client adapter directories):
   ```bash
   rtk yarn agents:check --strict
   ```

3. Both sets changed: step 1, then step 2. If any command in step 1 fails, step 2 does not run — report it as not run.

4. Walk the Pre-Commit Checklist in `ai/rules/common/post-code-workflow.md`.

## Reporting

- Each step that ran, with pass/fail and the exact failing output
- Which steps were skipped because their file set was untouched

## References

- `ai/rules/common/post-code-workflow.md` — sequence and full checklist

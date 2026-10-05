# Skill: Commit Prep

Prepare the working tree so the user can commit. The user writes every commit message and runs every git command themselves.

Authoritative rules: `ai/rules/common/versioning-changelog.md`, `ai/rules/common/post-code-workflow.md`.

## Hard Rules

- Never run a git mutation — the forbidden list is in `ai/rules/common/git-policy.md`
- Never write or suggest a commit message
- Read-only git is fine for reporting: `rtk git status`, `rtk git diff`

## Process

1. Report scope:
   ```bash
   rtk git status
   rtk git diff --stat
   ```

2. Quality gates in the order of `ai/rules/common/post-code-workflow.md` (stop at the first failure):
   ```bash
   rtk yarn lint
   rtk yarn tsc --noEmit
   rtk yarn agents:check --strict
   ```
   `agents:check` runs when agent configuration files changed.

3. Ask the user for the target version if it was not stated in this session. Never infer or auto-bump it.

4. Version sync — both must equal the target version:
   - `version` in `package.json`
   - `expo.version` in `app.json`

   Do not touch `expo.runtimeVersion` unless the change requires a new native build.

5. CHANGELOG entry in `CHANGELOG.md`:
   ```
   [1.7.0] 05.08.2026

   - Delete transaction
   - Some task
   ```
   - Header is a plain line `[version] DD.MM.YYYY` with today's date — no `#`
   - New bullet goes at the top of that version's list
   - New version section goes at the top of the file
   - Short task description, no ticket links

6. Report to the user:
   - Gate results
   - Files changed
   - Branch vs expected `r-<version>` (report a mismatch, do not fix it)
   - That the tree is ready to commit — then stop

## References

- `ai/rules/common/versioning-changelog.md`
- `ai/rules/common/post-code-workflow.md`
- `ai/rules/common/commit-message-and-crosslinks.md`

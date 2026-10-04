# Git Policy

Mission: agents read the repository freely and never change it; every git mutation and every commit message belongs to the user.

## Constants

- GIT_READ_COMMANDS = `status` | `diff` | `log` | `show` | `ls-files` | `rev-parse` | `branch` without arguments | `branch --list` | `branch -a` | `branch -v`
- GIT_FORBIDDEN_COMMANDS = `commit` | `push` | `add` | `checkout` | `switch` | `reset` | `rebase` | `merge` | `revert` | `cherry-pick` | `stash` | `clean` | `restore` | `rm` | `mv` | `tag` | `branch` with create, delete, or rename arguments

## Requirements

- Agents may run GIT_READ_COMMANDS, with the `rtk` prefix (or `rtk proxy git …` where the Windows fallback applies)
- Agents never run GIT_FORBIDDEN_COMMANDS, directly, through `rtk`, or through `rtk proxy`
- Creating, switching, renaming, or deleting branches is a user action; when a branch is needed, report the expected name and stop
- The user writes every commit message; agents never propose or dictate a commit-message format
- Plans and procedures never contain git steps
- The policy holds regardless of whether a client blocks the command technically

## Technical Limits

- Client-side deny rules are a safety net, not full coverage
- Global options (`git -C <path>`), shell wrappers (`bash -lc`, `sh -c`, `powershell -Command`), and other indirect calls can slip past prefix-based rules
- Branch creation by bare name (`git branch <name>`) cannot be told apart from a read by prefix; only the flag forms are blocked technically
- A command that is not blocked is not thereby allowed; this file decides

## Anti-Patterns

- Running a forbidden subcommand because the client did not block it
- Wrapping a git mutation in another shell or a global option
- Creating a branch to satisfy a release gate
- Writing commit text for the user

## Related Rules

- `ai/rules/common/versioning-changelog.md` — branch gate reports, never switches
- `ai/rules/common/commit-message-and-crosslinks.md` — commit text is user-owned
- `ai/rules/common/agent-workflow.md` — shared execution contract

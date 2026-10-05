# Codex Layer — fin-app-mobile

Codex-specific adapters only. Rules, procedures, and roles live in `ai/`; this folder and `.agents/skills/` point there.

## Trust

Target client: the Codex extension for VS Code (bundled CLI `0.155.0-alpha.16.3` on 30.09.2026).

Everything here (`config.toml`, `hooks.json`, `rules/`) loads only when the project is trusted. Project hooks also need persisted hook trust: until they are approved once in an interactive session, they are skipped silently.

## Instructions

- Codex reads `AGENTS.md` files from the git root down to the session cwd and concatenates them; there are no `@` imports
- The "Read first" files listed in `AGENTS.md` are not preloaded — the agent reads them itself. Claude gets the same files inlined through `CLAUDE.md` imports; this asymmetry is expected
- A global `~/.codex/AGENTS.md` also applies and is outside the project's control

## Skills

- Adapters: `.agents/skills/<name>/SKILL.md` → canon `ai/skills/<name>/procedure.md`
- Explicit call: `$<name>`; list: `/skills`
- Arguments come from the invoking message — Codex has no argument placeholders
- `eas-build` and `eas-submit` are explicit-only (`agents/openai.yaml`, `policy.allow_implicit_invocation: false`) and still ask for confirmation before any external action

## Roles

- Adapters: `.codex/agents/<name>.toml` → canon `ai/agents/<name>.md`; task routing in `ai/agents/INDEX.md`
- `sandbox_mode` follows the permission matrix: `read-only` for reviewing and research roles, `workspace-write` for implementers
- A spawned role inherits the writable sandbox of the parent session: with the parent in `workspace-write`, a role declared `read-only` still wrote a file through `apply_patch` (verified 30.09.2026, with and without `-s`). For reviewing and research roles, never writing files holds by instruction only — the same situation as `memory` in Claude

## Model Tiers

| Tier | `model_reasoning_effort` | `model` |
|------|--------------------------|---------|
| FAST | `low` | `gpt-6-luna` |
| BALANCED | `medium` | `gpt-6-sol` |
| DEEP | `high` | `gpt-6-astra` |

Tier per role and skill: `ai/rules/common/ai-models.md`. These model/effort pairs were accepted by the spawn tool and completed real tasks on 30.09.2026; the native `Codebase Researcher` role was spawned from its TOML the same day. The full model list of the account is visible in the model picker of the extension.

## Git Policy

`rules/git.rules` forbids every mutation listed in `ai/rules/common/git-policy.md`, for `git …` and `rtk git …`. There are no `allow` rules: `allow` would run a command outside the sandbox without asking.

Forms that prefix rules cannot cover are listed in `ai/rules/common/git-policy.md`, Technical Limits. `rtk proxy git …` mutations are forbidden as well.

Runtime, 30.09.2026: `git commit --dry-run`, `rtk git switch`, `git branch -D` were blocked with the justification text; `git status` ran. `bash -lc "git commit --dry-run …"` and `git -C . commit --dry-run …` were not caught by the rules — bash failed to start and the sandbox denied `.git/index.lock`, so the workspace sandbox is a second layer, not a guarantee.

Check: `codex execpolicy check --pretty --rules .codex/rules/git.rules -- <command>`.

## Hooks

- `hooks.json`: PostToolUse (`apply_patch|Edit|Write`) → `hooks/post-edit.mjs` returns `hookSpecificOutput.additionalContext`; Stop → `hooks/stop.mjs` returns `systemMessage` without `decision`, so the turn ends normally
- Hooks run with the session cwd; the command resolves the git root with `git rev-parse --show-toplevel` inside `node -e`, so it works from `src/` and from paths with spaces
- The command uses only double quotes outside and single quotes inside, with no `$` — the same string runs under cmd, PowerShell, and bash
- Hook commands are client configuration, not agent shell commands — the `rtk` prefix does not apply to them
- Verified 30.09.2026 with one-off trust bypass: the reminder reaches the agent in sessions from the root and from `src/`; the Stop hook ends the turn without an error or continuation
- Hooks only remind; QA passes only when the gates actually ran (`ai/rules/common/post-code-workflow.md`)

## MCP

`config.toml` declares `context7` (`npx -y @upstash/context7-mcp`). A user-level `context7` plugin may provide the same server; `codex mcp list` shows the effective entry. Verified 30.09.2026: `resolve-library-id` and the docs query ran from a Codex session.

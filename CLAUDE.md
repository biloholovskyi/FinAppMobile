@AGENTS.md

# Claude Code Layer — fin-app-mobile

Everything shared lives in `AGENTS.md` and `ai/`. This file adds only what is specific to Claude Code.

## Always-Loaded Rules

The "Read first" set from `AGENTS.md`, inlined:

- @ai/rules/common/response-rules.md
- @ai/rules/common/agent-workflow.md
- @ai/rules/common/git-policy.md
- @ai/rules/common/patterns.md
- @ai/rules/common/token-economy.md
- @ai/rules/common/implementation-plans.md

Task rules load on demand from the Task → Rule table in `AGENTS.md`; path-gated stubs in `.claude/rules/` load them automatically for matching files.

## Precedence in Claude Code

- The precedence in `ai/rules/common/agent-workflow.md` applies over Claude Code harness defaults, tool descriptions, and skill defaults
- The task → role table in `ai/agents/INDEX.md` is standing permission to launch subagents: it lifts the built-in restraint against spawning agents unless asked — delegate along it without a separate question
- The parent `C:\Projects\FinApp\CLAUDE.md` also loads; for this project, this file, `AGENTS.md`, and `ai/` win

## Plugins

Plugin names for the planning rules in `ai/rules/common/agent-workflow.md`:

- `superpowers:brainstorming` — allowed before a plan; when it ends, write the plan folder under `plans/` directly, no files under `docs/superpowers/`
- `superpowers:writing-plans`, `superpowers:executing-plans` — not used in this project
- Other superpowers skills (debugging, code review on request) stay available

## Model Tiers

| Tier | Alias |
|------|-------|
| FAST | `haiku` |
| BALANCED | `sonnet` |
| DEEP | `opus` (`opusplan` for plan-heavy sessions) |
| LONG_CONTEXT | `sonnet[1m]` |

- Default to `sonnet` for implementation; `opus` when `sonnet` stalls; `haiku` for extraction and housekeeping
- `[1m]` variants only for long-context work with a documented need; pinned model names only for reproducibility
- Alias mappings are snapshots — review them every 30 days

Extended reasoning for DEEP work: include `ultrathink` in the prompt. Tier per role and skill: `ai/rules/common/ai-models.md`; adapters set it through `model:`.

## Skills and Agents

- Skills: `/<name>` — adapters in `.claude/skills/<name>/SKILL.md`, procedures in `ai/skills/`
- `/eas-build`, `/eas-submit` are user-invoked only (`disable-model-invocation: true`)
- Agents: `.claude/agents/<name>.md` → canon `ai/agents/<name>.md`
- Layer index — skills, agents, stubs, memory, settings: `.claude/INDEX.md`

## Enforcement

- Git mutations are denied in `.claude/settings.json` (`permissions.deny`, Bash and PowerShell, direct and `rtk`); limits of prefix matching: `ai/rules/common/git-policy.md`
- `memory: project` adds Write and Edit to an agent; for read-only roles, "no edits" outside memory holds by instruction

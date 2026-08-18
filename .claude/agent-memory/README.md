# Agent Memory

This folder is the single memory home for fin-app-mobile Claude Code agents. Each agent has its own `<agent>/MEMORY.md` index for project-scoped, persistent memories.

Use memory only for information that is not derivable from source code, git history, or documented project rules:

- User collaboration preferences.
- Long-lived project decisions and constraints.
- External system references (Expo dashboard, EAS project, TickTick tasks).
- Feedback that should shape future agent behavior.

Do not store:

- Code structure facts — read `src/` instead.
- Package versions — read `package.json` instead.
- Anything already written in `ai/rules/**` or `CLAUDE.md`.
- File path inventories.
- Debugging recipes that belong in code or commits.
- Temporary task state.
- Secrets, tokens, credentials (`EXPO_TOKEN`, API keys), or personal data unrelated to project work.

## Layout

- `<agent>/MEMORY.md` — per-agent memory index, auto-loaded when that agent runs. When saving a new memory, add a one-line pointer in the relevant section (User / Feedback / Project / Reference) with a link to the memory file.
- `<agent>/<slug>.md` — the memory itself, one fact per file.

Keep index entries under 150 characters.

## Agents With Memory

Agents that declare `memory: project` in their frontmatter:

- `code-reviewer` — recurring review findings, accepted deviations
- `finapp-mobile-expert` — implementation conventions confirmed with the user
- `command-runner` — command quirks and timings
- `dependency-analyst` — confirmed compatibility findings, dependency decisions
- `full-package-auditor` — recurring audit findings, accepted deviations
- `eas-deployer` — EAS project layout, release decisions, failure causes

## Related

- `.claude/AGENTS.md` — full agent and skill index
- `ai/rules/common/ai-models.md` — model tier per agent

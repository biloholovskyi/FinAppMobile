# Crosslinks (AI Optimized)

Cross-reference policy for rules, plans, and docs.

## Commit Messages — Not Your Scope

Commit messages are written by the user, who makes all commits in this project. Do not propose a commit-message format, do not write commit text, and do not run git commands without an explicit request. Release preparation (version files, CHANGELOG) is covered by `ai/rules/common/versioning-changelog.md`.

## Constants

- CROSSLINK_INTERNAL_STYLE = repo-root path
- CROSSLINK_RULE_PREFIX = `ai/rules/`
- CROSSLINK_PLAN_PREFIX = `plans/`

## Requirements

- Use CROSSLINK_INTERNAL_STYLE for internal markdown links
- Link rules with `ai/rules/...` paths (no `./` or `../` for rule links)
- Link plans with `plans/...` paths
- Keep references current when files move/rename; remove stale links
- When adding a new rule file, add a discoverable link from:
  - `ai/rules/common/core-rules.md`
  - `ai/rules/AGENTS.md`
  - `CLAUDE.md` when applicable
  - `.claude/AGENTS.md`

## Anti-Patterns

- Writing or dictating commit messages
- Relative rule links like `./common/file.md` or `../rules/file.md`
- Orphan rules that are not referenced by core indexes
- Linking to `docs/plans/` — plans live in `plans/`
- Keeping aliases to deleted/deprecated files without explicit migration intent

## Related Rules

- `ai/rules/common/core-rules.md`
- `ai/rules/common/versioning-changelog.md`

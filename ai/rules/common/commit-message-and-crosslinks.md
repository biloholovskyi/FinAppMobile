# Crosslinks (AI Optimized)

Cross-reference policy for rules, plans, and docs.

## Commit Messages — Not Your Scope

Commit messages are written by the user, who makes all commits in this project. Do not propose a commit-message format and do not write commit text. Git operations follow `ai/rules/common/git-policy.md`. Release preparation (version files, CHANGELOG) is covered by `ai/rules/common/versioning-changelog.md`.

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
  - `AGENTS.md` (Task → Rule table) when the rule is task-scoped
  - `ai/rules/INDEX.md`
  - the client layer index when a client path stub points to it (`ai/rules/common/tooling.md`, Agent Layout)

## Anti-Patterns

- Writing or dictating commit messages
- Relative rule links like `./common/file.md` or `../rules/file.md`
- Orphan rules that are not referenced by core indexes
- Linking to `docs/plans/` — plans live in `plans/`
- Keeping aliases to deleted/deprecated files without explicit migration intent

## Related Rules

- `AGENTS.md`
- `ai/rules/common/versioning-changelog.md`

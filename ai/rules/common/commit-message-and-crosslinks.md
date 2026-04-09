# Commit Message and Crosslinks (AI Optimized)

Commit metadata and cross-reference policy for rules, prompts, and docs.

## Constants

- COMMIT_SUBJECT_MAX_CHARS = 72
- COMMIT_FORBIDDEN_TRAILER = `Co-authored-by:`
- CROSSLINK_INTERNAL_STYLE = repo-root path
- CROSSLINK_RULE_PREFIX = `ai/rules/`
- CROSSLINK_DOCS_PREFIX = `docs/`

## Requirements

Commit messages:
- Use Conventional Commit format from `ai/rules/common/git-conventions.md`
- Keep subject line <= COMMIT_SUBJECT_MAX_CHARS
- Do not include COMMIT_FORBIDDEN_TRAILER in commit body or footers

Crosslinks:
- Use CROSSLINK_INTERNAL_STYLE for internal markdown links
- Link rules with `ai/rules/...` paths (no `./` or `../` for rule links)
- Link docs with `docs/...` paths when referencing repository docs
- Keep references current when files move/rename; remove stale links
- When adding a new rule file, add a discoverable link from:
  - `ai/rules/common/core-rules.md`
  - `ai/rules/AGENTS.md`
  - Root `CLAUDE.md` when applicable

## Anti-Patterns

- Any `Co-authored-by:` trailer in commit messages
- Relative rule links like `./common/file.md` or `../rules/file.md`
- Orphan rules that are not referenced by core indexes
- Keeping aliases to deleted/deprecated files without explicit migration intent

## Related Rules

- `ai/rules/common/git-conventions.md`
- `ai/rules/common/core-rules.md`

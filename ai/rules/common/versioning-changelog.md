# Versioning and Changelog

Mission: keep the target version consistent across `package.json`, `app.json`, the git branch, and `CHANGELOG.md`, and record every completed task in the changelog — as preparation only, never as an automatic commit.

## Constants

- CHANGELOG_FILE = `CHANGELOG.md`
- VERSION_FILES = `package.json` (`version`) + `app.json` (`expo.version`)
- RUNTIME_VERSION_FIELD = `app.json` (`expo.runtimeVersion`)
- VERSION_BRANCH_PREFIX = `r-`
- VERSION_FORMAT = `X.Y.Z`
- CHANGELOG_VERSION_HEADER = `[X.Y.Z] DD.MM.YYYY`
- CHANGELOG_DATE_FORMAT = `DD.MM.YYYY` (today's date)
- CHANGELOG_ENTRY_FORMAT = `- <task name>`
- CHANGELOG_ENTRY_MAX_WORDS = 5
- CHANGELOG_ENTRY_ORDER = newest completed task at the top of the version's bullet list
- CHANGELOG_SECTION_ORDER = newest version section at the top of the file

## Ownership

- Commit messages are written by the user. Never propose, dictate, or enforce a commit-message format.
- Version numbers are decided by the user. Always ask for the target version — never infer or auto-bump it.
- Everything in this rule is preparation: edit files, then stop. Git operations require an explicit request.

## Changelog Format

```
[1.7.0] 05.08.2026

- Transactions infinite scroll
- Delete transaction
```

Rules:
- Header is a plain line: `[version] DD.MM.YYYY` — no `#`, no `###`
- Blank line between the header and the bullet list
- One bullet per completed task: the task name only, at most CHANGELOG_ENTRY_MAX_WORDS words
- The bullet names WHAT was done, never how, why, or what it consists of
- No colons, dashes, or commas introducing an explanation — if a bullet needs punctuation to fit, it is too long
- Sub-details, mechanics, and rationale belong in the plan and `history.md`, not here
- No ticket links in new entries — historical entries that contain them stay untouched
- Newest task at the top of the version's list (CHANGELOG_ENTRY_ORDER)
- Newest version section at the top of the file (CHANGELOG_SECTION_ORDER)
- Match the surrounding language style; keep code identifiers as-is

## When These Checks Run

- Before planning: ask the user for the target version (VERSION_FORMAT) before writing the plan.
- During a plan: the CHANGELOG update is one of the last implementation steps (see `ai/rules/common/implementation-plans.md`).
- Before an out-of-plan commit: run the consistency check below when the user asks to prepare a commit.

## Consistency Check (Four Gates)

Run all four against the target version.

1. Version gate
   - Ask the user for the target version if it was not stated in this session.

2. Branch gate
   - Current branch should be VERSION_BRANCH_PREFIX + version (e.g. `r-1.7.0` for `1.7.0`).
   - On mismatch: report it and propose `rtk git checkout -b r-{version}`. Do not create or switch branches yourself.

3. Version-file gate
   - `version` in `package.json` and `expo.version` in `app.json` must both equal the target version.
   - On mismatch: update both fields (prep edit).
   - RUNTIME_VERSION_FIELD is separate — see below.

4. Changelog gate
   - If a `[version] ...` header already exists: ensure its date is today in CHANGELOG_DATE_FORMAT, then prepend the new bullet at the top of that version's list.
   - If no header for the target version exists: add a new `[version] DD.MM.YYYY` section at the TOP of CHANGELOG_FILE, with the task bullet.

## runtimeVersion

`expo.runtimeVersion` gates OTA compatibility — an `eas update` only reaches builds with a matching runtimeVersion. It is intentionally decoupled from `expo.version`.

- Do NOT bump runtimeVersion for JS-only changes — that would orphan installed builds from OTA updates
- Bump it only when the change requires a new native build: new native module, Expo SDK upgrade, changed native config in `app.json`
- When a change requires a native build, state that explicitly in the plan — not in the CHANGELOG bullet, which stays a bare task name

## Anti-Patterns

- Choosing or bumping a version without asking the user
- Running `git commit`, `git checkout -b`, or `git push` on your own
- Adding a commit or branch step to a plan
- Writing a commit message for the user
- Version out of sync between `package.json` and `app.json`
- Stale changelog date on an existing version header
- Appending a new task bullet to the bottom instead of the top
- Adding a `#`/`###` heading marker to the changelog version header
- Bumping runtimeVersion for a JS-only change
- Explaining a task in the bullet instead of naming it
- Listing what a task consists of after a colon, dash, or comma
- Writing a bullet longer than CHANGELOG_ENTRY_MAX_WORDS words

## Related Rules

- `ai/rules/common/implementation-plans.md` — changelog step placement in the plan lifecycle
- `ai/rules/common/post-code-workflow.md` — quality gates before commit prep
- `ai/rules/common/deployment.md` — build vs OTA, release channels
- `ai/rules/common/commit-message-and-crosslinks.md` — crosslink style

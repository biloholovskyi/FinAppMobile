# Implementation Plans (AI Optimized)

Mission: structure plans as target-state-only file artifacts; enforce plan-then-implement with user gates and self-audit at every stage.

## Constants

- PLAN_ROOT = `plans/` (project root — NOT `docs/plans/`)
- PLAN_FOLDER_LAYOUT = `plans/YYYY-MM-DD-{slug}/` (the only layout for new plans)
- PLAN_INDEX_NAMING = `{slug}-implementation-plan.md`
- PLAN_PHASE_FILE_NAMING = `phase-XX-{slug}.md`
- PLAN_MAX_LINES = 250
- PLAN_STATUS_VALUES = todo | in_progress | done | deferred
- PLAN_MAX_NEXT_ACTIONS = 5
- PLAN_SIMPLE_MAX_PHASES = 4
- PLAN_ACTIVE_PHASE_LIMIT = 1 (2 when parallel, no shared files/state)
- PLAN_AUDIT_MIN_RECHECKS = lint | typecheck
- PLAN_FIVE_PHASE_FLOW = Research > Design > Plan > Implement > Reflect
- PLAN_TASK_PROFILES = feature | bugfix | hybrid

Folder contents:
- `{slug}-implementation-plan.md` — index (required)
- `research.md`, `design.md` — pre-code artifacts (required)
- `history.md` — handoff notes per phase (required, created with the first completed phase)
- `phase-XX-{slug}.md` — one file per phase (required)
- `adr-{slug}.md` — optional, for high-risk decisions

Plans created before this layout are single `plans/YYYY-MM-DD-{slug}.md` files. They stay as they are — historical record, not a template.

## Plan Content Rules

- Target-state only: describe how it should be, not how it is now
- No before/after comparisons, no migration diffs, no "current state" sections
- No code examples (type defs in backticks OK, reference paths instead)
- `research.md`: facts-only discovery — affected files, boundaries, constraints, open questions
- `design.md` and phase files: describe the end state the model should build
- When existing code is far from target, note "write from scratch" as implementation hint
- The model should verify existing code and decide: patch if close to target, rewrite if not
- Tables over prose for decision matrices and field mappings
- Each file < PLAN_MAX_LINES
- Plans record decisions and evidence, never git commands (see `ai/rules/common/commit-message-and-crosslinks.md`)

## Documentation SoT and Cross-Link Governance

Behavior contracts (API shapes, money/locale handling, layer boundaries) must have one canonical source and explicit cross-links.

Ownership map:
- `ai/rules/**` = rule and convention source of truth
- `CLAUDE.md` + `.claude/**` = Claude entry point, agents, skills, path stubs
- `plans/**` = implementation history, gates, and evidence (one folder per plan)
- `designs/**` = HTML screen prototypes (design intent, not behavior contracts)

Mandatory link direction:
1. `CLAUDE.md` links to the owning `ai/rules/**` file, never duplicates its body.
2. `.claude/rules/*.md` stubs point back to `ai/rules/**` only.
3. Plan files link to the `ai/rules/**` files whose contracts they change.

Feature/hybrid plan stale-doc checklist:
- Inventory touched files across `ai/rules/**`, `CLAUDE.md`, `.claude/**`.
- Mark one authoritative location per changed convention.
- Add explicit historical/deprecated markers for superseded content.
- Verify env keys (`EXPO_PUBLIC_*`) and command examples are consistent across rules and code.
- Include a link-integrity scan in the phase verification command list.

## Lifecycle

Two-stage: Plan (generate, audit, approve) then Execute (implement phases one at a time).

Multi-phase tasks follow PLAN_FIVE_PHASE_FLOW:
- Research: facts-only, no solutioning
- Design: target-state description; diagrams only when they clarify a non-obvious flow
- Plan: executable phases with model tier, verification, acceptance
- Implement: one phase at a time with quality gates
- Reflect: lessons learned, design alignment check, tech debt capture

Artifact mapping: Research -> `research.md`, Design -> `design.md`, Plan -> index + phase files, Implement -> phase files + `history.md`, Reflect -> its own phase file.

No implementation code until the plan folder exists and is user-approved.

## Task Profile Classifier

| Signal Type | Criteria | Threshold |
|------------|---------|-----------|
| Feature | New screen/route/API contract, cross-layer changes, architecture trade-offs | >= 2 signals -> `feature` |
| Bugfix | Deterministic repro, minimal corrective change, no contract expansion | >= 2 signals -> `bugfix` |
| Mixed | Both above thresholds met | -> `hybrid` |

Record `profile`, signal counts, and rationale in the plan.
Apply depth from `ai/rules/common/skills/feature-bug-phase-profiles.md`.

## Plan Structure

Every plan is a folder (PLAN_FOLDER_LAYOUT). Never collapse a plan into one file, regardless of phase count or size.

Index (PLAN_INDEX_NAMING) — sections in order:
- Title + date
- Goal (1-2 bullets)
- Task profile with signal counts
- Decisions taken (from the user)
- Assumptions
- Artifact links: `research.md`, `design.md`, `history.md`
- Phase list: `Phase X (status) - description [link]`
- Model schedule (group phases by tier)
- Next actions (up to PLAN_MAX_NEXT_ACTIONS)
- Out of scope

Phase files (PLAN_PHASE_FILE_NAMING):
- Status (PLAN_STATUS_VALUES), model tier, required rules
- Goal (1 sentence)
- Implementation notes (write-from-scratch hints, patch hints)
- Scope (target state only, exact file paths)
- Checklist
- Verification commands
- Acceptance criteria
- Evidence note (filled when the phase is marked done)
- Handoff note (max 7 bullets, mirrored into `history.md`)

Depth by phase count:
- Phases <= PLAN_SIMPLE_MAX_PHASES — `research.md` and `design.md` may be short (facts and target state only), one phase file each
- Phases > PLAN_SIMPLE_MAX_PHASES — split high-risk work into separate phase files, add `adr-{slug}.md` for one-way-door decisions
- Bugfix profile — the folder still applies; research and design may be a few bullets each

## Plan Generation

Step 1: Write the plan to files
- Exploration first: search the codebase, validate assumptions against `package.json` and `src/`
- Create the plan folder, then `research.md` and `design.md`
- Create the index and one phase file per phase; every phase file is linked from the index

Step 2: Self-audit
- All required lifecycle phases present, each with its own phase file
- Each phase file has scope, model tier, verification, acceptance
- Every index link resolves; no phase file is orphaned
- Each file within PLAN_MAX_LINES and within token-economy limits
- Target-state-only language verified (no comparison language)

Step 3: User gate
- Present the plan for review; do not start implementation until approved

## Phase Execution Loop

For each phase (no step skipped):

1. Implement: execute scope and checklist, load only the index + active phase file + required rules
2. Self-audit: re-read scope, run verification commands, compare against acceptance criteria
3. Update history: handoff note (max 7 bullets) in `history.md`, dated
4. Mark done: update status in the phase file and in the index phase list, with an evidence note
5. User gate: present results, wait for approval before the next phase. The user shortcut `np` is that approval and also authorises continuing into the following phase without a new gate (`ai/rules/common/response-rules.md`)

## Model Protocol

| Phase Type | Default Tier |
|-----------|-------------|
| Exploration, docs sync, index updates | FAST |
| Screen/feature implementation | BALANCED |
| Audit, hardening, architecture, rule contracts | DEEP |

- Include model tier and rationale in each phase
- After approval, group consecutive same-tier phases into a model schedule
- Escalate only when blocked; record the reason before switching

## Required Lifecycle Phases

For multi-phase plans with code changes:

Pre-code: Research > Design > Plan

Implement macro-phase (recommended order):
- Ticket setup (TickTick, when tracked)
- Feature phases
- Post-code workflow (`ai/rules/common/post-code-workflow.md`)
- Audit and hardening (`ai/rules/common/skills/refactor-security-audit.md`)
- Docs sync (when rules, commands, or env keys changed)
- Docs sync must apply the Documentation SoT ownership map and mandatory link direction
- CHANGELOG entry for the target version (`ai/rules/common/versioning-changelog.md`)

Post-code: Reflect

- The audit phase must rerun post-code checks after fixes
- Commit-prep only after the audit is done
- Move high-risk phases earlier to fail fast

The project has no test framework — PLAN_AUDIT_MIN_RECHECKS is `rtk yarn lint` plus `rtk yarn tsc --noEmit`. Do not add test phases or coverage gates until a test runner exists.

## Anti-Patterns

- Do not implement before the plan folder is written and user-approved
- Do not collapse a plan into a single file — every plan is a folder with an index and phase files
- Do not skip Research or Design for multi-phase work
- Do not write code during Research, Design, or Plan phases
- Do not implement multiple phases in one cycle
- Do not skip the user gate even when asked to "implement the whole plan" — the `np` shortcut is the only standing exception
- Do not mark a phase done without verification evidence
- Do not load all phase files — only the index + active phase
- Do not leave a phase without its own `phase-XX-{slug}.md` file
- Do not add comparison language (before/after, current vs target) to plan files
- Do not embed code snippets; reference file paths
- Do not persist state only in conversation; write to plan files
- Do not put plans under `docs/plans/` — PLAN_ROOT is `plans/`
- Do not add git steps (commit, branch, push) to a plan

## Cross-References

- `ai/rules/common/core-rules.md` — entry point, task routing
- `ai/rules/common/token-economy.md` — file loading, token budget
- `ai/rules/common/ai-models.md` — model tier selection
- `ai/rules/common/post-code-workflow.md` — quality checks
- `ai/rules/common/skills/feature-bug-phase-profiles.md` — profile depth
- `ai/rules/common/skills/refactor-security-audit.md` — audit checklist
- `ai/rules/common/versioning-changelog.md` — version and CHANGELOG gates

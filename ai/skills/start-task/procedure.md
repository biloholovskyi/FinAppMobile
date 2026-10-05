# Skill: Start Task

Classify the brief, decide whether it needs a plan, and initialize the plan file.

Authoritative rules: `ai/rules/common/implementation-plans.md`, `ai/rules/common/skills/feature-bug-phase-profiles.md`.

## Process

1. Read the user brief.

2. Classify the task profile per `ai/rules/common/implementation-plans.md`:
   - `feature` — new screen/route/API contract, cross-layer changes, architecture trade-offs
   - `bugfix` — deterministic repro, minimal corrective change, no contract expansion
   - `hybrid` — both thresholds met

   Record the signal counts, not just the verdict.

3. Estimate atomic steps. Require a plan when any holds:
   - 3+ atomic steps
   - The task spans multiple FSD layers or touches the backend contract
   - Non-trivial architecture trade-offs

4. No plan needed (simple 1-2 step task):
   - State assumptions
   - Load only the rule files matching the task from the Task → Rule table in `AGENTS.md`
   - Proceed

5. Plan needed:
   - Ask the user for the target version — never infer it (`ai/rules/common/versioning-changelog.md`)
   - Create the plan folder `plans/YYYY-MM-DD-<slug>/` — never a single file
   - `research.md` — facts-only discovery: affected files, contracts, constraints, open questions
   - `design.md` — target state only
   - `<slug>-implementation-plan.md` (index) with, in order:
     - Title + date
     - Goal (1-2 bullets)
     - Task profile with signal counts
     - Decisions taken (from the user)
     - Assumptions
     - Artifact links (`research.md`, `design.md`, `history.md`)
     - Phase list: `Phase X (todo) - description [link]`
     - Model schedule
     - Next actions
     - Out of scope
   - One `phase-XX-<slug>.md` per phase with: status, model tier, required rules, goal, implementation notes, scope, checklist, verification commands, acceptance criteria
   - `history.md` is created when the first phase completes
   - Include the mandatory lifecycle phases: post-code, audit/hardening, docs sync, CHANGELOG
   - Self-audit the plan using `ai/rules/common/skills/plan-audit.md`
   - Present the plan and wait for approval — do NOT start coding

## Hard Rules

- Plans live in `plans/` at the project root — never `docs/plans/`
- Every plan is a folder with an index and one file per phase — never one file for the whole plan
- No git steps in a plan (no commit, branch, or push)
- No test phases or coverage gates — this project has no test runner
- No implementation code before the plan folder exists and the user approves it

## Arguments

- The task brief from the invoking message

## References

- `ai/rules/common/implementation-plans.md`
- `ai/rules/common/skills/plan-audit.md`
- `ai/rules/common/versioning-changelog.md`
- `ai/rules/common/ai-models.md`

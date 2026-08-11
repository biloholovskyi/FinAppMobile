---
name: start-task
description: Classify a user task and initialize an implementation plan when needed
model: sonnet
---

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
   - Load only the rule files matching the task from `ai/rules/common/core-rules.md`
   - Proceed

5. Plan needed:
   - Ask the user for the target version — never infer it (`ai/rules/common/versioning-changelog.md`)
   - Create a single file `plans/YYYY-MM-DD-<slug>.md` with, in order:
     - Title + date
     - Goal (1-2 bullets)
     - Task profile with signal counts
     - Decisions taken (from the user)
     - Assumptions
     - Phases (`## Фаза N — description`) with scope, checklist, verification commands
     - Model schedule
     - Out of scope
   - Escalate to the folder layout `plans/<slug>/` only when the complexity check in `ai/rules/common/implementation-plans.md` trips
   - Include the mandatory lifecycle phases: post-code, audit/hardening, docs sync, CHANGELOG
   - Self-audit the plan using `ai/rules/common/skills/plan-audit.md`
   - Present the plan and wait for approval — do NOT start coding

## Hard Rules

- Plans live in `plans/` at the project root — never `docs/plans/`
- No git steps in a plan (no commit, branch, or push)
- No test phases or coverage gates — this project has no test runner
- No implementation code before the plan file exists and the user approves it

## Arguments

- `$ARGUMENTS` — the task brief from the user

## References

- `ai/rules/common/implementation-plans.md`
- `ai/rules/common/skills/plan-audit.md`
- `ai/rules/common/versioning-changelog.md`
- `ai/rules/common/ai-models.md`

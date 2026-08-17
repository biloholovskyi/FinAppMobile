# Skill: Implementation Plan Audit (AI-driven)

Use when auditing an implementation plan for completeness, risks, and implementation drift — both before coding starts (pre-implementation) and after all phases are done (post-implementation).
Complements the planning lifecycle in `ai/rules/common/implementation-plans.md`.

Triggers:
- User asks to audit, review, or validate an implementation plan
- A plan reaches Phase 00 (exploration) and needs a pre-implementation quality gate
- All implementation phases are done and the plan needs a post-implementation completeness check
- User wants to verify plan-to-code alignment before committing

## Pre-Implementation Audit

Run before any code is written. The plan must exist as a folder `plans/YYYY-MM-DD-<slug>/` with the index `<slug>-implementation-plan.md`, `research.md`, `design.md`, and one `phase-XX-<slug>.md` per phase.

### Plan Completeness Checklist

- [ ] Mission statement is clear and scoped (one sentence)
- [ ] Task profile is classified (feature / bugfix / hybrid) with signal counts
- [ ] Pre-code artifacts section exists with crosslinks to research, design files, and prompt references
- [ ] Rule coverage section lists all rules needed during implementation
- [ ] Phase list is complete (Exploration through Reflect) and the index links one file per phase
- [ ] Docs ownership map and cross-link direction follow `ai/rules/common/implementation-plans.md`
- [ ] `research.md` exists with facts-only discovery
- [ ] `design.md` exists and matches research facts
- [ ] Resolved questions section addresses all open decisions
- [ ] No phase file is missing or has a broken crosslink

### Plan Quality Checklist

- [ ] Every phase has: Goal, Model Tier, Scope, Checklist, Verification Commands, Acceptance Criteria
- [ ] Required Rules are listed in phases that need them (audit, docs, changelog)
- [ ] Scope sections specify exact file paths, not vague descriptions
- [ ] Checklist items are atomic and verifiable (not "implement the feature")
- [ ] Acceptance criteria are verifiable (grep scans, command outputs)
- [ ] Mandatory lifecycle phases are present: Post-code, Audit/Hardening, Docs, CHANGELOG
- [ ] Phase dependencies are explicit (handoff notes say what the next phase needs)
- [ ] Docs phase checklist includes stale-doc prevention checks across `ai/rules/**`, `CLAUDE.md`, and `.claude/**`

### Risk Assessment Checklist

- [ ] Breaking changes are identified (env var renames, backend contract changes, route renames)
- [ ] Release artifacts are in scope (`app.json`, `eas.json`, `CHANGELOG.md`, generated Orval output)
- [ ] Native-vs-OTA impact is stated (does the change require a new build or is it OTA-safe?)
- [ ] All affected consumers are identified (screens, features, entities, rules, designs)
- [ ] Security-sensitive paths are flagged (auth, tokens, secure storage, deep links)
- [ ] No implicit assumptions — every assumption is stated and validated in research

### Anti-Patterns to Flag

- Vague scope: "update all files" without listing them
- Missing release artifacts: plan touches app behavior but skips `app.json`, `eas.json`, or `CHANGELOG.md`
- Deferred-and-forgotten: items deferred to later phases that have no phase entry
- Docs-blind: no docs sync phase for user-facing behavior or rule changes
- One-way door: destructive changes (env var removal, route removal) with no fallback
- Git steps inside the plan (commit, branch, push)

## Post-Implementation Audit

Run after all implementation phases are done but before final commit.

### Completeness Verification

- [ ] Every phase is marked `done` in the plan index
- [ ] Every phase has an Evidence Note documenting what was actually done
- [ ] Every phase has a Handoff Note for the next phase
- [ ] History file captures all significant decisions and discoveries
- [ ] Reflect phase exists with lessons learned and tech debt capture

### Plan-to-Code Drift Detection

- [ ] All files listed in research "Affected Files" section were actually modified
- [ ] No planned changes were silently skipped or deferred without documentation
- [ ] Grep scan confirms zero stale references for removed/renamed identifiers
- [ ] Generated Orval output is fresh when the backend contract changed (`rtk yarn api:generate`)
- [ ] `rtk yarn lint` and `rtk yarn tsc --noEmit` pass
- [ ] Documentation matches implemented behavior (no stale examples or versions)
- [ ] Documentation cross-links follow direction: `CLAUDE.md -> ai/rules/** -> plan artifacts`

### Stale Artifact Sweep

- [ ] No old env var names (`EXPO_PUBLIC_*`), route paths, or query keys left in: `src/`, `ai/rules/`, `.claude/`, `CLAUDE.md`
- [ ] No stale package versions claimed in rules — they must match `package.json`
- [ ] No TODO/FIXME comments from the plan remain unresolved
- [ ] No "deferred to Phase X" items left unaddressed

### Release Readiness

- [ ] `version` matches across `package.json` and `app.json`
- [ ] `CHANGELOG.md` has an entry for the target version
- [ ] `app.json` `runtimeVersion` is correct for the change (native change vs OTA-safe)
- [ ] `eas.json` profiles and channels are consistent with the release intent

## Process

1. **Identify plan path**: the folder `plans/YYYY-MM-DD-<slug>/` and its index `<slug>-implementation-plan.md`
2. **Read all plan files**: index, all phase files, research, design artifacts, history
3. **Choose audit type**: pre-implementation (plan not yet executed) or post-implementation (all phases done)
4. **Run applicable checklists** from above, recording PASS/FAIL for each item
5. **Cross-reference with codebase**: use grep/glob to verify claims in evidence notes and docs cross-link direction
6. **For post-implementation**: run stale artifact sweep across entire repo (exclude `node_modules`, `dist`, `.turbo`)
7. **Report findings** grouped by severity: CRITICAL > HIGH > MEDIUM > LOW
8. **Propose fixes** for each finding with specific file paths and changes

## Output

- Summary table: `| Check | Status | Notes |`
- Findings grouped by severity with file paths and line context
- Recommended actions with priority ordering
- For post-implementation: draft reflect.md content if missing

## Related Rules

- `ai/rules/common/implementation-plans.md` — plan lifecycle and phase structure
- `ai/rules/common/post-code-workflow.md` — quality gate sequence (lint, typecheck)
- `ai/rules/common/skills/refactor-security-audit.md` — code-level audit checklist
- `ai/rules/common/skills/agent-team-quality-gates.md` — agent-team execution quality gates

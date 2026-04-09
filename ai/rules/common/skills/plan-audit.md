# Skill: Implementation Plan Audit (AI-driven)

Use when auditing an implementation plan for completeness, risks, and implementation drift — both before coding starts (pre-implementation) and after all phases are done (post-implementation).
Complements the planning lifecycle in `ai/rules/common/implementation-plans.md`.

Triggers:
- User asks to audit, review, or validate an implementation plan
- A plan reaches Phase 00 (exploration) and needs a pre-implementation quality gate
- All implementation phases are done and the plan needs a post-implementation completeness check
- User wants to verify plan-to-code alignment before committing

## Pre-Implementation Audit

Run before any code is written. The plan must exist at `docs/plans/<plan-name>/<plan-name>-implementation-plan.md`.

### Plan Completeness Checklist

- [ ] Mission statement is clear and scoped (one sentence)
- [ ] Task profile is classified (feature / bugfix / hybrid) with signal counts
- [ ] Pre-code artifacts section exists with crosslinks to research, design files, and prompt references
- [ ] Rule coverage section lists all rules needed during implementation
- [ ] Phase list is complete (00-Exploration through Reflect), each with a linked phase file
- [ ] Docs ownership map and cross-link direction follow `ai/rules/common/implementation-plans.md`
- [ ] Research file (`research.md`) exists and contains facts-only current-state discovery
- [ ] Design artifacts exist (C4, DFD, Sequence) and match research facts
- [ ] Resolved questions section addresses all open decisions
- [ ] No phase file is missing or has a broken crosslink

### Plan Quality Checklist

- [ ] Every phase has: Goal, Model Tier, Scope, Checklist, Verification Commands, Acceptance Criteria
- [ ] Required Rules are listed in phases that need them (tests, audit, docs, commit)
- [ ] Scope sections specify exact file paths, not vague descriptions
- [ ] Checklist items are atomic and verifiable (not "implement the feature")
- [ ] Acceptance criteria are testable (grep scans, command outputs, test counts)
- [ ] Mandatory lifecycle phases are present: Test, Post-code, Audit/Hardening, Docs, Commit-prep
- [ ] Phase dependencies are explicit (handoff notes say what the next phase needs)
- [ ] Docs phase checklist includes stale-doc prevention checks across `docs/system-overview`, `apps/*/docs`, and `docs/plans`

### Risk Assessment Checklist

- [ ] Breaking changes are identified (env var renames, API changes, schema migrations)
- [ ] Deployment artifacts are in scope (K8s manifests, Docker files, CI configs, generated files)
- [ ] Rollback strategy exists for destructive changes (DB migrations, config removals)
- [ ] All affected consumers are identified (apps, packages, infra, docs, tests)
- [ ] Security-sensitive paths are flagged (auth, tokens, secrets, network config)
- [ ] No implicit assumptions — every assumption is stated and validated in research

### Anti-Patterns to Flag

- Vague scope: "update all files" without listing them
- Missing infra: plan touches app code but skips K8s manifests, Docker, CI, monitoring
- Deferred-and-forgotten: items deferred to later phases that have no phase file
- Test-blind: no test phase or test coverage audit for changed modules
- Docs-blind: no docs sync phase for user-facing behavior changes
- One-way door: destructive changes (env var removal, schema drop) with no rollback plan

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
- [ ] Generated files are fresh (`config:generate --check` or equivalent passes)
- [ ] Deployment artifacts (K8s, Docker, compose, CI) match the new code behavior
- [ ] Test suites pass for all affected packages
- [ ] Documentation matches implemented behavior (no stale examples or port numbers)
- [ ] Documentation cross-links follow direction: `system-overview -> app docs -> plan artifacts`

### Stale Artifact Sweep

- [ ] No old env var names, port numbers, or paths in: source code, tests, Docker files, K8s manifests, compose files, CI configs, monitoring configs, docs
- [ ] Generated `.env` / `.env.example` files are current
- [ ] No TODO/FIXME comments from the plan remain unresolved
- [ ] No "deferred to Phase X" items left unaddressed

### Deployment Readiness

- [ ] All Dockerfiles use correct env vars, ports, and healthcheck URLs
- [ ] K8s manifests (deployments, services, ingress) match new container ports
- [ ] Docker compose port mappings are correct
- [ ] Monitoring/observability configs (scrape targets, dashboards) use new ports
- [ ] CI pipeline configs reference correct ports and env vars

## Process

1. **Identify plan path**: `docs/plans/<plan-name>/<plan-name>-implementation-plan.md`
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
- `ai/rules/common/post-code-workflow.md` — quality gate sequence (typecheck, lint, test)
- `ai/rules/common/skills/refactor-security-audit.md` — code-level audit checklist
- `ai/rules/common/skills/test-coverage-audit.md` — test coverage gap analysis
- `ai/rules/common/docs.md` — documentation sync expectations
- `ai/rules/common/skills/agent-team-quality-gates.md` — agent-team execution quality gates

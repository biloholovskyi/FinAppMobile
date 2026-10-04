# AI Model Selection

Mission
- Pick the cheapest and fastest model tier that still produces correct, secure code.

## Constants

- PLAN_MAX_TOKENS = 500
- RULES_BUDGET_TOKENS = 2_000
- ESCALATE_AFTER_FAILED_ATTEMPTS = 2
- SMALL_CHANGE_MAX_FILES = 2
- LARGE_CHANGE_MIN_FILES = 9

## Model Tiers (Capability First)

- FAST: low latency and low cost for small edits, extraction, and mechanical updates.
- BALANCED: default for most coding tasks, moderate multi-file changes, and fixes.
- DEEP: highest reasoning reliability for architecture, risky refactors, and hard debugging.
- LONG_CONTEXT: use only when task quality depends on a very large context window.

Tier-to-model mapping is client-specific and lives in the client entry points, not here. Writing a tier into a plan does not switch the model: switching is a user action or a subagent adapter setting.

## Decision Matrix

| Task | Default Tier | Escalate To |
|------|--------------|-------------|
| Rename across a few files | FAST | BALANCED |
| Small bugfix in one module | FAST | BALANCED |
| Medium feature (3-8 files) | BALANCED | DEEP |
| Large refactor (>= LARGE_CHANGE_MIN_FILES) | DEEP | LONG_CONTEXT |
| Architecture trade-offs | DEEP | LONG_CONTEXT |
| Flaky/race debugging | DEEP | LONG_CONTEXT |
| Docs cleanup | FAST | BALANCED |
| Large logs/stack traces | FAST | LONG_CONTEXT |

Notes:
- Flaky/race debugging: require a repro and logs before escalating context
- Docs cleanup: prefer mechanical edits and verification searches
- Large logs: chunk logs first; escalate context only if chunking fails

## Canonical Multi-Phase Mapping

For tasks split into `Research -> Design -> Plan -> Implement -> Reflect`:

- Research: FAST (or BALANCED when repo/domain is unfamiliar)
- Design: DEEP (architecture trade-offs, boundaries, and risk analysis)
- Plan: BALANCED (escalate to DEEP if phase decomposition is unstable)
- Implement: BALANCED for coding; DEEP reviewer for architecture/security-sensitive phases
- Reflect: FAST (BALANCED for complex feature profiles)

Rules:
- Do not skip phases by jumping from Research directly to Implement.
- Record tier choice per phase in plan artifacts.
- Escalate one tier at a time using the escalation protocol.

## Requirements

Selection:
- Default to FAST for local work scoped to <= SMALL_CHANGE_MAX_FILES.
- Default to BALANCED for most feature work and moderate multi-file edits.
- Use DEEP for concurrency, architecture, security, and high-risk refactors.
- Use LONG_CONTEXT only for genuinely large-context tasks.

Escalation protocol:
- Start with FAST or BALANCED.
- Escalate after ESCALATE_AFTER_FAILED_ATTEMPTS unsuccessful attempts.
- Before escalation, write a short state summary: known facts, attempted fixes, and blockers.
- Escalate one tier at a time; do not jump directly to LONG_CONTEXT without evidence.

Context discipline:
- Prefer targeted search and selective reads over broad file loading.
- Load only the file sections needed to decide and implement.
- Keep planning output under PLAN_MAX_TOKENS.
- Keep total loaded rule budget under RULES_BUDGET_TOKENS.

Safety:
- Never paste secrets (tokens, keys, cookies) into prompts.
- Redact secrets and PII in logs, configs, and traces.
- Treat production traffic captures as sensitive by default.

## Extended Reasoning

Enable (through the client's own mechanism) for:
- Design phase: architecture trade-offs, boundary decisions, risk analysis.
- Security audit: injection analysis, authz review.
- Complex debugging: concurrency, race conditions, state machine issues.
- Plan generation: multi-domain decomposition, dependency ordering.

Do not enable for renames, formatting, docs sync, running commands, simple extraction, or commit prep. Extended reasoning roughly doubles output cost.

## Role and Skill Tier Assignments

Adapters declare the tier through their client's model setting so they do not inherit a more expensive session model.

| Criterion | FAST | BALANCED | DEEP | Session tier |
|-----------|------|----------|------|--------------|
| Task complexity | Single command / extraction | Multi-step workflow | Architecture / security reasoning | Depends on parent context |
| File scope | 0-1 files | 1-8 files | 9+ files or cross-cutting | Varies |
| Reasoning depth | None (mechanical) | Moderate | Deep (trade-offs, risk) | Parent decides |

Roles (10):
- FAST: `command-runner`
- BALANCED: `codebase-researcher`, `finapp-mobile-expert`, `code-reviewer`, `screen-designer`, `dependency-analyst`, `eas-deployer`
- DEEP: `plan-auditor`, `react-performance-reviewer`, `full-package-auditor`

Skills (14):
- FAST: `lint`, `typecheck`, `post-code`, `commit`, `eas-status`
- BALANCED: `start-task`, `deploy-preflight`, `eas-build`, `eas-submit`, `implement-plan-step`, `audit-plan`, `audit-security`, `review-react-perf`
- Session tier (no declared model): `ui-ux-pro-max`

Open question: `review-react-perf` is a deep-reasoning audit and the criteria argue for DEEP, but it is assigned BALANCED. Escalate deliberately rather than drifting.

Review assignments when role or skill responsibilities change.

## Anti-Patterns

- Using DEEP or LONG_CONTEXT for trivial edits.
- Escalating tiers without writing a state summary.
- Stuffing full files/logs into prompts when targeted excerpts are enough.
- Writing client model names into shared rules instead of tiers.
- Assuming model availability is identical across clients, plans, and regions.
- Running every subagent and skill on the session model when FAST or BALANCED suffices.
- Enabling extended reasoning for mechanical or command-execution tasks.

## Related Rules

- `ai/rules/common/token-economy.md` — file loading strategy and token budget
- `ai/rules/common/post-code-workflow.md` — required verification steps
- `ai/rules/common/implementation-plans.md` — phase-level tier usage
- `AGENTS.md` — task-to-rule table

# AI Model Selection (Mar 2026)

Mission
- Pick the cheapest and fastest model that still produces correct, secure code.

## Constants

- PLAN_MAX_TOKENS = 500
- RULES_BUDGET_TOKENS = 2_000
- ESCALATE_AFTER_FAILED_ATTEMPTS = 2
- SMALL_CHANGE_MAX_FILES = 2
- LARGE_CHANGE_MIN_FILES = 9
- MODEL_CATALOG_VERIFIED_AT = 2026-03-02
- MODEL_CATALOG_REVIEW_DAYS = 30

## Model Tiers (Capability First)

Tier meanings (provider names vary):

- FAST: low latency and low cost for small edits, extraction, and mechanical updates.
- BALANCED: default for most coding tasks, moderate multi-file changes, and test fixes.
- DEEP: highest reasoning reliability for architecture, risky refactors, and hard debugging.
- LONG_CONTEXT: use only when task quality depends on very large context windows.

## Platform Mapping (Feb 2026)

Cursor IDE (dynamic catalog, verify in model picker/docs):
- Available frontier set includes models such as Claude Sonnet 4.5, Claude Opus 4.6, GPT-5.2, GPT-5.3 Codex, Gemini 3 Flash/Pro, Grok Code, and Composer 1.5.
- Prefer `Auto` for general coding when deterministic model selection is not required.
- Use explicit model selection for reproducibility, benchmarking, or incident analysis.
- Cost-optimal picks by tier: FAST = Grok Code ($0.2/$1.5) or Gemini 3 Flash ($0.5/$3). BALANCED = GPT-5.2 ($1.75/$14) or Composer 1.5 ($3.5/$17.5). DEEP = Claude Opus 4.6 ($5/$25).
- Context: GPT-5.2/5.3 Codex = 272k, Grok Code = 256k, rest = 200k default. Max mode (1M) available for Claude Sonnet 4.5, Claude Opus 4.6, Gemini 3 Flash, and Gemini 3 Pro.
- Claude Opus 4.6 supports adaptive thinking (auto-scales reasoning depth) and 1M context (beta). Prefer Opus 4.6 for DEEP tier when extended reasoning or large context is needed.

Claude Code (alias-first workflow):
- Use aliases instead of pinned versions for day-to-day work: `default`, `sonnet`, `opus`, `haiku`, `sonnet[1m]`, `opusplan`.
- As of verification date: `sonnet` maps to Sonnet 4.5, `opus` maps to Opus 4.6, `haiku` maps to Haiku 4.5.
- Use pinned model names only when reproducibility is required (for example, regression triage).

## Decision Matrix

| Task | Default Tier | Escalate To | Cursor / Claude Code Guidance |
|------|--------------|-------------|-------------------------------|
| Rename across a few files | FAST | BALANCED | Cursor: Grok Code or Gemini 3 Flash. Claude Code: `haiku` or `sonnet` |
| Small bugfix in one module | FAST | BALANCED | Cursor: Auto or Grok Code. Claude Code: `sonnet` |
| Medium feature (3-8 files) | BALANCED | DEEP | Cursor: explicit balanced model if reproducibility needed. Claude Code: `sonnet` |
| Large refactor (>= LARGE_CHANGE_MIN_FILES) | DEEP | LONG_CONTEXT | Cursor: Claude Opus 4.6 (adaptive thinking). Claude Code: `opus` |
| Architecture trade-offs | DEEP | LONG_CONTEXT | Claude Code: prefer `opusplan` for plan-heavy tasks |
| Flaky/race debugging | DEEP | LONG_CONTEXT | Require repro, logs, and failing test before escalating context |
| Docs cleanup | FAST | BALANCED | Prefer mechanical edits and verification searches |
| Large logs/stack traces | FAST | LONG_CONTEXT | Chunk logs first, escalate context only if chunking fails |

## Canonical Multi-Phase Mapping

For tasks split into `Research -> Design -> Plan -> Implement -> Reflect`, use these default tiers:

- Research: FAST (or BALANCED when repo/domain is unfamiliar)
- Design: DEEP (architecture trade-offs, boundaries, and risk analysis)
- Plan: BALANCED (escalate to DEEP if phase decomposition is unstable)
- Implement: BALANCED for coding; DEEP reviewer for architecture/security-sensitive phases
- Reflect: FAST (lightweight retrospective; BALANCED for complex feature profiles)

Rules:
- Do not skip phases by jumping from Research directly to Implement.
- Record tier choice per phase in plan artifacts.
- Escalate one tier at a time using the standard escalation protocol.

## Requirements

Selection:
- Default to FAST for local work scoped to <= SMALL_CHANGE_MAX_FILES.
- Default to BALANCED for most feature work and moderate multi-file edits.
- Use DEEP for concurrency, architecture, security, and high-risk refactors.
- Use LONG_CONTEXT only for genuinely large-context tasks.

Cursor IDE usage:
- Prefer `Auto` for normal coding flow and reliability under changing provider conditions.
- Switch to explicit model when exact repeatability matters.
- Enable Max/extended context only when phase requirements cannot be met in standard context.

Claude Code usage:
- Default to `sonnet` for implementation phases.
- Use `opus` for complex planning/debugging when `sonnet` stalls.
- Use `opusplan` for plan-heavy sessions that need strong reasoning plus efficient execution.
- Use `haiku` for simple extraction, summarization, and low-risk housekeeping.
- Use `[1m]` variants only for long-context phases with documented need.

Escalation protocol:
- Start with FAST or BALANCED.
- Escalate after ESCALATE_AFTER_FAILED_ATTEMPTS unsuccessful attempts.
- Before escalation, write a short state summary: known facts, attempted fixes, and blockers.
- Escalate one tier at a time; do not jump directly to LONG_CONTEXT without evidence.

Context discipline:
- Prefer targeted search and selective reads over broad file loading.
- Load only file sections needed to decide and implement.
- Keep planning output under PLAN_MAX_TOKENS.
- Keep total loaded rule budget under RULES_BUDGET_TOKENS.

Governance:
- Review this rule at least every MODEL_CATALOG_REVIEW_DAYS days.
- Update model examples when official docs change aliases, defaults, or availability.
- Treat provider examples as snapshots, not hard guarantees across plans/regions.

Safety:
- Never paste secrets (tokens, keys, cookies) into prompts.
- Redact secrets and PII in logs, configs, and traces.
- Treat production traffic captures as sensitive by default.

## Thinking Mode (Extended Reasoning)

When to enable:
- Design phase: architecture trade-offs, boundary decisions, risk analysis.
- Security audit: OWASP checks, injection analysis, authz review.
- Complex debugging: concurrency, race conditions, state machine issues.
- Plan generation: multi-domain decomposition, dependency ordering.

When not to enable:
- Mechanical edits: renames, formatting, docs sync.
- Command execution: running tests, linting, building.
- Simple extraction: reading files, searching codebase.
- Commit-prep: message generation, push notes.

Platform activation:
- Claude Code: include "ultrathink" in skill/phase prompt content. Thinking depth auto-scales with Opus 4.6.
- Cursor: select thinking variant in model picker for the session. Available for Claude Opus 4.6, GPT-5.2, Gemini 3 Pro.

Cost impact:
- Thinking mode uses ~2x output tokens (thinking tokens count toward output billing).
- Use only when reasoning quality justifies the cost.

## Subagent and Skill Model Assignments

Agents and skills should specify `model:` in frontmatter to avoid inheriting the main session model (which may be opus) for tasks that only need haiku or sonnet.

Selection criteria for assigning model tiers:

| Criterion | haiku | sonnet | opus | inherit |
|-----------|-------|--------|------|---------|
| Task complexity | Single command / extraction | Multi-step workflow | Architecture / security reasoning | Depends on parent context |
| File scope | 0-1 files | 1-8 files | 9+ files or cross-cutting | Varies |
| Reasoning depth | None (mechanical) | Moderate (pattern matching) | Deep (trade-offs, risk) | Parent decides |
| Cost sensitivity | Lowest priority | Default choice | Use only when quality requires it | N/A |
| Examples | build, lint, test, deploy | commit, MR, migrations, fix | plan audit, full audit, perf review | deep MR review, implement-plan |

Agent tier assignments:
- haiku: codebase-researcher, command-runner, parallel-tester, vercel-deploy-runner.
- sonnet: dependency-analyst, dual-runtime-package-auditor, dual-runtime-package-remediator, test-coverage-auditor.
- opus: plan-auditor, full-package-auditor, react-performance-reviewer, ui-guidelines-reviewer.

Skill tier assignments:
- haiku: lint, test, build-all, check-circular, affected, typecheck-all, deploy-vercel-preview.
- sonnet: commit, post-code, mr, release, release-flow, hotfix, fix-dual-runtime, db-migrate, extend-api-tester.
- opus: audit-dual-runtime, audit-ui, audit-package-json, review-react-perf.
- inherit: implement-plan-step, audit-plan, audit-security, deep-mr-review-backend-db, deep-mr-review-frontend.

Review and update assignments when agent/skill responsibilities change.

## Anti-Patterns

- Pinning stale model versions in everyday workflows.
- Assuming model availability is identical across all plans, regions, and providers.
- Using DEEP or LONG_CONTEXT for trivial edits.
- Escalating tiers without writing a state summary.
- Stuffing full files/logs into prompts when targeted excerpts are enough.
- Treating aliases as permanently mapped to one exact snapshot.
- Running all subagents and skills on the main session model (opus) when haiku or sonnet suffices.
- Enabling thinking mode for mechanical or command-execution tasks.

## Validation Sources (Checked 2026-02-10)

- Cursor model catalog: `https://cursor.com/docs/models`
- Claude Code model config and aliases: `https://docs.anthropic.com/en/docs/claude-code/model-config`
- Anthropic models overview: `https://docs.anthropic.com/en/docs/about-claude/models/overview`

## Related Rules

- See `ai/rules/common/token-economy.md` for file loading strategy and token budget.
- See `ai/rules/common/post-code-workflow.md` for required verification steps.
- See `ai/rules/common/implementation-plans.md` for phase-level model tier usage.
- See `ai/rules/common/core-rules.md` for task-to-rule mapping.

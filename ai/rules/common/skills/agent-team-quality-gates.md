# Skill: Agent Team Implementation and Quality Gates

Use when implementation is phase-based and requires strict multi-agent responsibility split.
Complements `ai/rules/common/implementation-plans.md` for `Research -> Design -> Plan -> Implement -> Reflect`.

Triggers:
- User asks to implement in phases with agent collaboration
- User asks for stronger quality control during implementation
- Task is medium/complex with architecture, security, or contract risk

Preconditions:
- Research artifact approved (facts-only, no solutioning)
- Design artifact approved (C4 + DFD + Sequence; ADR when needed)
- Plan artifact approved with phase checklist and acceptance criteria

Roles (strict separation):
- Lead:
  - Owns phase orchestration, task decomposition, and gate decisions
  - Assigns work and consolidates reviewer findings
  - Must not write or patch implementation code
- Implementer:
  - Writes and updates code only within active phase scope
  - Runs local phase verification commands before handoff
- Architecture Reviewer:
  - Verifies implementation matches approved design and boundaries
  - Checks layer boundaries, contracts, and dependency direction
  - Must not patch implementation code directly
- Security Reviewer:
  - Validates input boundaries, authz/authn paths, secrets handling, and injection risks
  - Flags supply-chain or transport risks relevant to scope
  - Must not patch implementation code directly
- QA Reviewer:
  - Verifies build, tests, lint, and behavioral acceptance criteria
  - Confirms regression and edge-case coverage for changed behavior
  - Must not patch implementation code directly

Handoff Contract (required between roles):
- Phase id and objective
- Changed paths (added/updated/deleted)
- Commands run and pass/fail outputs
- Findings with severity and exact path references
- Open risks, blockers, and explicit next action

Quality Gates (per implementation phase):
1. Scope Gate:
  - Changes are limited to approved active phase scope
  - No undeclared scope expansion
2. Build Gate:
  - Target build succeeds for touched package/app
3. Test Gate:
  - Relevant tests pass; changed behavior has adequate coverage
4. Lint/Type Gate:
  - Lint/type checks pass for changed scope
5. Architecture Gate:
  - Conforms to approved C4/DFD/Sequence intent and boundary rules
6. Security Gate:
  - No new high-risk issues; boundary validation and sensitive-data handling verified
7. Contract Gate (when API/events/config contracts change):
  - Contract updates and compatibility checks are complete
8. Performance Gate (when latency/throughput path is affected):
  - No unreviewed regressions in critical path
9. Evidence Gate:
  - Phase evidence note is written with command results and reviewer verdicts

Gate Failure Policy:
- Any failed gate returns phase to Implementer with specific actionable findings.
- Lead cannot advance phase status to `done` until all required gates pass.
- Re-review is mandatory after fixes.

Completion Policy:
- Lead marks phase `done` only after:
  - All required gates pass
  - Evidence note is attached to phase artifact
  - User gate is received for phase transition

Anti-Patterns:
- Lead writing implementation code
- Reviewers silently fixing code instead of issuing findings
- Advancing phase with known failed gates
- Running architecture/security checks only at the end of all phases
- Missing evidence notes or missing command outputs

Related Rules:
- `ai/rules/common/implementation-plans.md` - phase lifecycle and user gates
- `ai/rules/common/ai-models.md` - model tier choice per phase
- `ai/rules/projects/non-restrict-proxy/architecture.md` - C4 and architecture boundaries
- `ai/rules/common/post-code-workflow.md` - full verification sequence
- `ai/rules/common/skills/refactor-security-audit.md` - hardening and security audit patterns
- `ai/rules/common/skills/test-coverage-audit.md` - test coverage gap checks

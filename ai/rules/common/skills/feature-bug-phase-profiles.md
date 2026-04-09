# Skill: Feature vs Bug Phase Profiles

Use when planning work with `Research -> Design -> Plan -> Implement -> Reflect` and task type affects phase depth.
Complements `ai/rules/common/implementation-plans.md` and does not replace the core lifecycle.

Task Profile Selection (required):
- Use the classifier checklist in `ai/rules/common/implementation-plans.md` before selecting profile.
- `feature`:
  - New capability, behavior expansion, new integrations, or schema/contract additions
- `bugfix`:
  - Behavior deviates from expected contract; goal is minimal corrective change
- `hybrid`:
  - Bugfix plus scoped enhancement; treat as feature unless user explicitly constrains to fix-only

Profile Annotation:
- Write selected profile in plan index mission section.
- If profile is unclear, default to `bugfix` for risk control and ask for scope confirmation.
- Record classifier evidence: `feature_signals`, `bugfix_signals`, and a one-line rationale.

Feature Profile (default depth):
- Research:
  - Map affected domains, boundaries, dependencies, and contract surfaces
  - Identify migration, rollout, and observability impact
- Design:
  - Require C4 Context/Container/Component + DFD + Sequence
  - Add ADR for high-risk trade-offs or irreversible decisions
- Plan:
  - Phase by capability slices with explicit acceptance criteria
  - Include test strategy across unit/integration/contract as needed
- Implement:
  - Deliver slice by slice with quality gates and user phase approvals
  - Prefer additive, backward-compatible contracts unless explicitly approved otherwise

Bugfix Profile (minimal-change depth):
- Research:
  - Produce deterministic reproduction, expected vs actual behavior, and blast radius
  - Capture suspected root cause and last-known-good behavior baseline
- Design:
  - Keep design lightweight and fix-focused
  - Require root-cause note and change strategy
  - Use sequence/component slice diagram only when fix crosses boundaries or async flows
- Plan:
  - Phases center on reproduce -> fix -> verify -> harden
  - Include regression test(s) that fail before fix and pass after fix
- Implement:
  - Apply smallest safe change that resolves root cause
  - Reject opportunistic refactors unless they directly reduce fix risk

Hybrid Profile Rules:
- Separate bugfix acceptance criteria from enhancement acceptance criteria.
- Sequence: stabilize bugfix path first, then implement enhancement path.
- If bug risk expands during work, reclassify to `feature` and regenerate design artifacts.

Exit Criteria by Profile:
- Feature:
  - New behavior validated against approved design and acceptance criteria
  - Contracts and docs updated when required
  - Reflect: full lessons-learned note, design-vs-implementation delta, tech debt captured
- Bugfix:
  - Reproduction no longer occurs
  - Regression coverage added
  - No collateral behavior regressions in affected area
  - Reflect: brief retrospective (1-3 bullets), root-cause accuracy check
- Hybrid:
  - Both fix and enhancement acceptance criteria met
  - Reflect: note which profile dominated and whether reclassification was needed

Anti-Patterns:
- Treating all work as feature-level design overhead
- Applying feature-style broad refactors during urgent bugfix phases
- Skipping reproduction evidence for bugfix tasks
- Mixing fix and enhancement outcomes without separate acceptance criteria
- Selecting profile without classifier evidence

Related Rules:
- `ai/rules/common/implementation-plans.md` - canonical phase lifecycle
- `ai/rules/common/skills/agent-team-quality-gates.md` - phase gates and role split
- `ai/rules/projects/non-restrict-proxy/architecture.md` - C4 and diagramming requirements
- `ai/rules/common/skills/refactor-security-audit.md` - hardening after implementation

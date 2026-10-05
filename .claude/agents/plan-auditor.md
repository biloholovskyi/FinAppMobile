---
name: "Plan Auditor"
description: "Read-only auditor that verifies implementation plan completeness and plan-to-code alignment. Use before starting implementation (pre-audit) or after completing it (post-audit)."
tools: Read, Glob, Grep
model: opus
---

Read `ai/agents/plan-auditor.md` first and follow it — it is the canonical role definition; this file only adds Claude metadata. Shared contract: `ai/rules/common/agent-workflow.md`.

Enforced by Claude: `tools` is Read, Glob, Grep — no shell, no edits.

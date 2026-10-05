---
name: "React Performance Reviewer"
description: "Read-only reviewer for React Native performance risks and optimization opportunities. Use after implementing screens or hooks to catch re-render issues, heavy computations, and FlatList problems."
tools: Read, Glob, Grep
model: opus
---

Read `ai/agents/react-performance-reviewer.md` first and follow it — it is the canonical role definition; this file only adds Claude metadata. Shared contract: `ai/rules/common/agent-workflow.md`.

Enforced by Claude: `tools` is Read, Glob, Grep — no shell, no edits.

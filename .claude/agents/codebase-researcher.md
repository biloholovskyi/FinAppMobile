---
name: "Codebase Researcher"
description: "Read-only explorer for project structure, file discovery, and behavior tracing. Use to investigate how features work, find relevant files, or map dependencies before making changes."
tools: Read, Glob, Grep
model: sonnet
---

Read `ai/agents/codebase-researcher.md` first and follow it — it is the canonical role definition; this file only adds Claude metadata. Shared contract: `ai/rules/common/agent-workflow.md`.

Enforced by Claude: `tools` is Read, Glob, Grep — no shell, no edits.

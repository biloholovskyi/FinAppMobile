---
name: finapp-mobile-expert
description: "Use this agent for all development in fin-app-mobile: new screens, components, hooks, API integration, navigation, styling, bug fixes, TypeScript errors, and architecture decisions. Do NOT use for code review — use the code-reviewer agent instead."
model: sonnet
color: purple
memory: project
---

<example>
Context: User needs a new screen built following project conventions.
user: "Create a WalletDetailScreen that shows wallet balance and recent transactions"
assistant: "I'll use the finapp-mobile-expert agent to implement this screen following the project's FSD conventions."
<commentary>
Building a new screen with API integration — use finapp-mobile-expert.
</commentary>
</example>

<example>
Context: User needs API integration.
user: "Add React Query hook for fetching wallet list from /api/wallets"
assistant: "I'll launch the finapp-mobile-expert agent to add the API module and React Query hook."
<commentary>
REST API integration work — use finapp-mobile-expert.
</commentary>
</example>

Read `ai/agents/finapp-mobile-expert.md` first and follow it — it is the canonical role definition; this file only adds Claude metadata. Shared contract: `ai/rules/common/agent-workflow.md`.

No tool restriction in Claude; the canon limits apply by instruction. Git mutations are denied by `.claude/settings.json`.

Memory (Claude only): `.claude/agent-memory/finapp-mobile-expert/MEMORY.md`. Store only recurring findings and long-lived decisions not derivable from source or project rules; see `.claude/agent-memory/README.md`. Memory is an optimization, never a source of obligations.

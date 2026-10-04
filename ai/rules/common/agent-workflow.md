# Agent Workflow

Mission: one execution contract for every coding agent working in `fin-app-mobile`, independent of the client that runs it.

## Constants

- WORKFLOW_FLOW = Research > Design > Plan > Implement > Reflect
- PLAN_ROOT = `plans/`
- ROLE_TABLE = `ai/agents/INDEX.md`
- REVIEW_FILE_IN_PLAN = `plans/<plan-folder>/review-<scope>.md`
- REVIEW_FILE_NO_PLAN = `plans/reviews/YYYY-MM-DD-<slug>-review.md`
- REVIEWER_COMMANDS = `rtk yarn tsc --noEmit` | `rtk npx eslint src` (no `--fix`)

## Decision Matrix

| Situation | Action |
|-----------|--------|
| Creating, executing, or resuming a plan | Read `ai/rules/common/implementation-plans.md` and `ai/rules/common/response-rules.md` first |
| A plugin or external skill offers its own spec/plan process | Use the project process and PLAN_ROOT format instead |
| Exploring intent before a plan exists | Brainstorming skills are allowed; the output goes straight into a plan folder |
| Task type matches a row of ROLE_TABLE | Delegate to that role without a separate question |
| Required skill, role, model, or delegation mechanism is missing | Execute the canonical procedure directly |
| Mandatory independent review cannot run | Record that in the phase evidence; do not mark the work reviewed |
| Project rule conflicts with a client default | Follow the project rule within system limits |

## Requirements

Precedence:
- Project rules (`ai/**`, `AGENTS.md`, plan files) define the workflow and override default behavior of the client, tool descriptions, skills, and plugins
- Precedence applies within system constraints, permissions, sandbox, and the tools actually available
- A rule file never lifts a sandbox, grants a permission, or creates a missing capability
- When unsure which instruction wins, the project rule wins inside those limits

Planning:
- Plans follow WORKFLOW_FLOW and the folder format from `ai/rules/common/implementation-plans.md`
- Plugin processes for writing or executing plans are not used; their spec and plan files are not created
- Brainstorming is allowed before the plan; when it ends, write the plan folder directly
- Plugin skills stay available for work outside planning (debugging, review on request, docs lookup)
- The `np` shortcut semantics live in `ai/rules/common/response-rules.md`

State:
- Task state is recovered only from `ai/**` and plan files: phase status, evidence notes, `history.md`
- No mandatory agreement lives only in agent memory or in the chat
- Agent memory is an optional client-side optimization, never a source of obligations

Delegation:
- ROLE_TABLE maps task types to roles; delegation along it needs no extra permission
- Implementer and reviewer are separate runs; the implementer never reviews its own work
- Each role follows its canon in `ai/agents/<name>.md`

Review artifacts:
- Every requested review — code, plan, performance, or security, delegated or done directly — ends with the report saved to a file; a review answered only in chat is incomplete
- A reviewing role writes no files; it returns structured findings
- The main agent saves the findings: REVIEW_FILE_IN_PLAN for a task with a plan, REVIEW_FILE_NO_PLAN otherwise, and names the saved path in its reply
- The report format is defined by the `code-reviewer` canon
- Reviewing roles run only REVIEWER_COMMANDS; `rtk yarn lint` applies `--fix` and stays with the implementer
- A reviewer may take gate results from the implementer instead of rerunning them

Git:
- Git operations follow `ai/rules/common/git-policy.md`

## Anti-Patterns

- Creating plugin spec or plan files next to a project plan
- Keeping a decision only in chat or agent memory
- Reviewing your own implementation and marking it reviewed
- A reviewer patching code or writing its own report file
- Treating a rule file as permission to bypass a sandbox or a denied command
- Asking for permission to delegate along ROLE_TABLE

## Related Rules

- `ai/rules/common/implementation-plans.md` — plan lifecycle and folder format
- `ai/rules/common/response-rules.md` — response style and the `np` shortcut
- `ai/rules/common/git-policy.md` — allowed and forbidden git operations
- `ai/rules/common/post-code-workflow.md` — QA sequence after changes
- `ai/rules/common/ai-models.md` — model tiers per phase and role

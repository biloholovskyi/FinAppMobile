---
name: implement-plan-step
description: Execute one phase/step from an implementation plan in fin-app-mobile
model: sonnet
---

# Skill: Implement Plan Step

Execute a single phase from an implementation plan.

## Process

1. Read the plan:
   - Location: `plans/YYYY-MM-DD-<slug>/`
   - Read the index `<slug>-implementation-plan.md` and pick the first phase whose status is not `done`
   - Load only that phase file plus the rules it lists — never all phase files
   - Find the next unchecked `- [ ]` step in it

2. Load relevant rules for the task type:
   - Screen/component: `ai/rules/projects/fin-app-mobile/architecture.md`
   - API/state: `ai/rules/projects/fin-app-mobile/state-management.md`
   - See full routing: `ai/rules/common/core-rules.md`

3. Execute the step exactly as written in the plan

4. After code changes, run post-code checks:
   ```bash
   rtk yarn lint
   rtk yarn tsc --noEmit
   ```

5. Mark step as complete (`- [x]`) in the phase file

6. When the whole phase is done:
   - Add the evidence note to the phase file and set its status to `done`
   - Mirror the status in the index phase list
   - Append a dated handoff note (max 7 bullets) to `history.md`

7. Report: what was done, any deviations from plan, next step

## Stop When

- A step is blocked or unclear
- Tests/lint fail and can't be fixed
- Plan has gaps — raise them, don't guess

## References

- `ai/rules/common/implementation-plans.md`
- `ai/rules/common/post-code-workflow.md`

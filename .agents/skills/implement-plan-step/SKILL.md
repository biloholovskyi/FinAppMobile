---
name: implement-plan-step
description: Execute one phase/step from an implementation plan in fin-app-mobile
model: sonnet
---

# Skill: Implement Plan Step

Execute a single phase from an implementation plan.

## Process

1. Read the plan:
   - Location: `plans/YYYY-MM-DD-feature-name.md`
   - Find the next unchecked `- [ ]` step

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

5. Mark step as complete (`- [x]`) in the plan

6. Report: what was done, any deviations from plan, next step

## Stop When

- A step is blocked or unclear
- Tests/lint fail and can't be fixed
- Plan has gaps — raise them, don't guess

## References

- `ai/rules/common/implementation-plans.md`
- `ai/rules/common/post-code-workflow.md`

---
description: Execute one phase/step from an implementation plan
---

# /implement-plan-step

Mirror of @.claude/skills/implement-plan-step/SKILL.md

## Process

1. Read the plan at `plans/YYYY-MM-DD-feature-name.md`
2. Find next unchecked `- [ ]` step
3. Load relevant rules for the task type:
   - Screen/component: @ai/rules/projects/fin-app-mobile/architecture.md
   - API/state: @ai/rules/projects/fin-app-mobile/state-management.md
   - Full routing: @ai/rules/common/core-rules.md
4. Execute the step exactly as written
5. After changes:
   ```bash
   rtk yarn lint
   rtk yarn tsc --noEmit
   ```
6. Mark step complete (`- [x]`) in the plan
7. Report: what was done, deviations, next step

## Stop When

- Step is blocked or unclear
- Tests/lint fail and can't be fixed
- Plan has gaps — raise them, don't guess

Full rules: @ai/rules/common/implementation-plans.md

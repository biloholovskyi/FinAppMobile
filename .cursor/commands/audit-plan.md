---
description: Audit an implementation plan for completeness and fin-app-mobile alignment
---

# /audit-plan

Mirror of @.claude/skills/audit-plan/SKILL.md

## Process

1. Read the plan file (in `plans/`)
2. Load @ai/rules/common/skills/plan-audit.md
3. Check against:
   - @ai/rules/projects/fin-app-mobile/architecture.md — FSD, tech constraints
   - @ai/rules/projects/fin-app-mobile/state-management.md — React Query v5, Zustand
   - @ai/rules/common/react.md — components, NativeWind
4. Report findings

## Checks

- All plan tasks have complete code (no "TBD" or "implement later")
- File paths follow FSD structure
- React Query v5 syntax (not v4)
- NativeWind `className` (not `style={{}}`)
- Kopeck math handled correctly
- No `expo-router` imports in `shared/`, `entities/`, `features/`
- Post-code steps (lint + tsc) included

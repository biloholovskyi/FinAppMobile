---
name: audit-plan
description: Audit an implementation plan for completeness, gaps, and alignment with fin-app-mobile architecture
model: sonnet
---

# Skill: Audit Plan

Review an implementation plan before or after implementation.

## Process

1. Read the plan file (in `plans/` directory)
2. Load: `ai/rules/common/skills/plan-audit.md`
3. Check against:
   - `ai/rules/projects/fin-app-mobile/architecture.md` — FSD structure, tech constraints
   - `ai/rules/projects/fin-app-mobile/state-management.md` — React Query v5 syntax, Zustand
   - `ai/rules/common/react.md` — component rules, NativeWind
4. Report findings

## What to Check

- All plan tasks have complete code (no "TBD" or "implement later")
- File paths follow FSD structure
- React Query v5 syntax (not v4)
- NativeWind className (not style={{}})
- Kopeck math handled correctly
- No expo-router in shared/, entities/, features/
- Post-code steps (lint + tsc) included

## References

- `ai/rules/common/skills/plan-audit.md` — full audit process
- `ai/rules/projects/fin-app-mobile/architecture.md`

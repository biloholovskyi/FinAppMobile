---
description: Security review of fin-app-mobile code changes
---

# /audit-security

Mirror of @.claude/skills/audit-security/SKILL.md

## Process

1. Load @ai/rules/common/patterns.md (Security Audit section)
2. Review changed files for:
   - Input validation at system boundaries (API responses, user input)
   - Injection patterns (no dynamic string construction with untrusted input)
   - Sensitive data logging (never log tokens, passwords, API keys)
   - Auth header exposure (never in logs, never in `EXPO_PUBLIC_` vars)
   - Token storage (`expo-secure-store`, not AsyncStorage for sensitive data)
   - 401 handling (triggers re-auth flow, not just toast)

## Checks

- No `EXPO_PUBLIC_` env vars for secrets (bundled into app)
- Tokens in `expo-secure-store`
- No hardcoded credentials
- API responses validated before use
- No empty catch blocks swallowing errors
- Axios timeout set

Full rules: @ai/rules/common/patterns.md

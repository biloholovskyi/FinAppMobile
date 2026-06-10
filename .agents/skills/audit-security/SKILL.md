---
name: audit-security
description: Security audit for fin-app-mobile code changes
model: sonnet
---

# Skill: Audit Security

Security review of code changes in fin-app-mobile.

## Process

1. Load: `ai/rules/common/patterns.md` (Security Audit section)
2. Review changed files for:
   - Input validation at system boundaries (API responses, user input)
   - Injection patterns (no dynamic string construction with untrusted input)
   - Sensitive data logging (never log tokens, passwords, API keys)
   - Auth header exposure (never in logs, never in EXPO_PUBLIC_ vars)
   - Token storage (use expo-secure-store, not AsyncStorage for sensitive data)
   - 401 handling (triggers re-auth flow, not just toast)

## Checks

- No `EXPO_PUBLIC_` env vars for secrets (they're bundled in the app)
- Tokens stored in `expo-secure-store`, not AsyncStorage
- No hardcoded credentials in source
- API responses validated before use (not trusted as unknown)
- Empty catch blocks that swallow errors
- Axios timeout set (prevents hanging requests)

## References

- `ai/rules/common/patterns.md` — Security Audit section
- `ai/rules/projects/fin-app-mobile/state-management.md` — Error handling

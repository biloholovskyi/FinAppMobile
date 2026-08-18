# Token Economy (AI Optimized)

Optimize AI context: load only what's needed, when needed.

## Core Rules

- Zero code examples: AI generates code, doesn't need examples
- Task-based loading: Load files for specific task only
- Single source: Cross-link, don't duplicate
- Tables over prose: Decision matrices for patterns
- Tables in AI responses: Use lists (no markdown tables). Rule files and indexes may use tables for readability.
- One rule per bullet: No pipe-separated strings
- Constants by name: Reference, don't inline
- Model choice: Use the smallest tier that works; escalate only when needed (see `ai/rules/common/ai-models.md`)
- Audit-first loading: For refactor/security tasks, load the task skill first, then only relevant sections from large rule files

## File Loading

Always Load (~200 tokens):
- `ai/rules/common/core-rules.md` - Entry point with task map

Load by Task:
- TypeScript/async/errors: `ai/rules/common/patterns.md` (~900 tokens)
- Screen / component / navigation / styling: `ai/rules/projects/fin-app-mobile/architecture.md` (~900 tokens)
- API / React Query / Zustand: `ai/rules/projects/fin-app-mobile/state-management.md` (~800 tokens)
- React patterns: `ai/rules/common/react.md` + `ai/rules/common/react-19.md` (~700 tokens)
- Refactor/Security Audit: `ai/rules/common/skills/refactor-security-audit.md` first, then targeted sections from `ai/rules/common/patterns.md`
- Performance: `ai/rules/common/performance/_index.md` first, then one symptom file
- HTML screen design: `ai/rules/design/design-system.md` (+ `charts.md` when charts are involved)
- AI Model Selection: `ai/rules/common/ai-models.md` (~300 tokens)

Load Examples When Coding:
- Reference implementations in `src/features/**` and `designs/screens/*.html`
- Load only when implementing, not when planning

## Rule File Structure

Standard Order:
1. Mission (1 sentence)
2. Constants (all numeric values)
3. Decision Matrix (table format)
4. Requirements (bullets, one per line)
5. Anti-Patterns (explicit list)

Format Rules:
- Target <250 lines per file (exceptions allowed for consolidated rules like `ai/rules/common/patterns.md`)
- Zero code examples (type defs in backticks OK)
- Reference constants by name
- No bold formatting
- No explanations (what, not why)

## Anti-Patterns

| Bad | Good |
|-----|------|
| Code examples in rules | Zero examples, link to `examples/` |
| Pipe-separated strings | One rule per bullet |
| Inline numeric values | Constants section |
| Multiple files for same topic | Consolidate and cross-link |
| Load all files | Task-based loading |
| Duplicate sections | Single source of truth |

## Metrics

Targets:
- Rule files: <250 lines
- Code examples: Zero
- Planning phase: <500 tokens
- Per-task load: <2,500 tokens (multi-rule skills like implementation-plans may exceed; load only when phase requires them)


# Response Rules

- No summaries after completing tasks
- No "would you like me to continue?" — just stop or continue, don't ask
- No auto-documentation unless explicitly requested
- Minimum explanations — code speaks for itself
- No markdown tables in responses (use lists instead)
- Always use `rtk` prefix for shell commands

## User Shortcuts

- `np` — execute the next phase of the active plan that is not `done`, end to end: implement the scope, run the phase verification commands, mark the phase `done` with an evidence note, append the handoff note to `history.md`, mirror the status in the plan index
- After finishing that phase, immediately start the next one — `np` is the approval for the phase gate, so do not stop to ask
- The `np` chain runs until one of: the plan has no phases left, a verification gate fails and cannot be fixed, the phase scope is ambiguous, or a decision belongs to the user
- Report the stop reason explicitly when the chain ends early
- `np` never authorises git commands or anything the active plan places out of scope

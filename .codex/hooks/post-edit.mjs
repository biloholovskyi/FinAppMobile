/**
 * Codex PostToolUse hook: reminds the agent to run the post-code sequence after
 * a file edit. Codex ignores plain stdout for this event, so the reminder goes
 * out as `hookSpecificOutput.additionalContext`. Writes no files.
 */
const REMINDER =
  '[post-edit] Files changed. Before reporting the work as done, run the sequence from ' +
  'ai/rules/common/post-code-workflow.md: rtk yarn lint, then rtk yarn tsc --noEmit after code changes; ' +
  'rtk yarn agents:check --strict after agent configuration changes.'

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: REMINDER },
  }),
)

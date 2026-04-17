#!/bin/bash
# afterFileEdit hook — remind agent to run /post-code after code edits
cat > /dev/null
cat <<'EOF'
{"agentMessage": "[post-edit] Code changed — run /post-code before committing (rtk yarn lint && rtk yarn tsc --noEmit)"}
EOF
exit 0

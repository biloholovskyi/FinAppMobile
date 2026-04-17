#!/bin/bash
# stop hook — remind to run /post-code if any code was changed during the turn
cat > /dev/null
cat <<'EOF'
{"agentMessage": "[session-end] Remember: run /post-code if any code was changed this session"}
EOF
exit 0

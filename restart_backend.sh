#!/bin/bash

# Navigate to project root
cd "$(dirname "$0")"

echo "========================================"
echo "    LxwyerUp Backend Restarter"
echo "========================================"

# Run the python check script
echo "Checking API Keys..."
python3 check_backend_keys.py
if [ $? -ne 0 ]; then
    echo "❌ API Key check failed. Aborting restart."
    exit 1
fi

echo ""
echo "Stopping existing backend processes..."
# Find and kill the process
pids=$(ps aux | grep "uvicorn backend.main:app" | grep -v grep | awk '{print $2}')
if [ -z "$pids" ]; then
    echo "No running backend found."
else
    echo "Killing processes: $pids"
    echo "$pids" | xargs kill -9
fi

echo ""
echo "Starting backend server in a new Terminal window..."
# Use osascript to run it cleanly in a new macOS Terminal tab to avoid nohup/stdin uvicorn crashes
osascript <<EOF
tell application "Terminal"
    do script "cd \"$(pwd)\" && source backend/venv/bin/activate && python3 -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000"
    activate
end tell
EOF

echo "✅ Backend terminal launched successfully."
echo "Your API and the automated Background Scheduler (which checks missed appointments) are now running in the newly opened Terminal window!"
echo "========================================"

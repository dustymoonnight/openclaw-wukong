#!/bin/bash
# Screenshot - Capture screen and output base64 PNG

export DISPLAY=:99

# Ensure Xvfb is running
if ! ps aux | grep -v grep | grep -q "Xvfb :99"; then
    echo "Error: Xvfb not running. Run start-desktop.sh first." >&2
    exit 1
fi

# Wait for any pending operations
sleep 0.5

# Capture screenshot
import -window root /tmp/screenshot.png 2>/dev/null || xwd -root -out /tmp/screenshot.xwd 2>/dev/null && convert /tmp/screenshot.xwd /tmp/screenshot.png 2>/dev/null

# Output base64
if [ -f /tmp/screenshot.png ]; then
    base64 -w 0 /tmp/screenshot.png
    echo
else
    echo "Error: Failed to capture screenshot" >&2
    exit 1
fi

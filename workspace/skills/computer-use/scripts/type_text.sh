#!/bin/bash
# Type text - Type text with proper delays
# Usage: ./type_text.sh "text to type"

export DISPLAY=:99

TEXT="$1"

# Type with 12ms delay between keystrokes
xdotool type --delay 12 "$TEXT"

# Wait and screenshot
sleep 2
scrot -q 85 /tmp/screenshot.png
base64 -w 0 /tmp/screenshot.png
echo

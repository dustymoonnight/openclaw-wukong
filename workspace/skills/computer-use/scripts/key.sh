#!/bin/bash
# Key - Press key or key combo
# Usage: ./key.sh "Return" or ./key.sh "ctrl+s"

export DISPLAY=:99

COMBO="$1"

xdotool key "$COMBO"

# Wait and screenshot
sleep 2
scrot -q 85 /tmp/screenshot.png
base64 -w 0 /tmp/screenshot.png
echo

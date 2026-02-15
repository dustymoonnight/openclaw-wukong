#!/bin/bash
# Wait - Wait specified seconds then screenshot
# Usage: ./wait.sh seconds

export DISPLAY=:99

SECS=${1:-2}

sleep $SECS

scrot -q 85 /tmp/screenshot.png
base64 -w 0 /tmp/screenshot.png
echo

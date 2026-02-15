#!/bin/bash
# Scroll - Scroll in a direction
# Usage: ./scroll.sh [up|down|left|right] amount [x y]

export DISPLAY=:99

DIR=$1
AMT=${2:-3}
X=${3:-512}
Y=${4:-384}

# Move to position first
xdotool mousemove $X $Y

# Scroll
case $DIR in
    up)
        xdotool scroll $AMT
        ;;
    down)
        xdotool scroll -$AMT
        ;;
    left)
        xdotool hscroll -$AMT
        ;;
    right)
        xdotool hscroll $AMT
        ;;
esac

# Wait and screenshot
sleep 2
scrot -q 85 /tmp/screenshot.png
base64 -w 0 /tmp/screenshot.png
echo

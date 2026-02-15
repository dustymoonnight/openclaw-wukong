#!/bin/bash
# Click - Mouse click at coordinates
# Usage: ./click.sh x y [left|right|middle|double|triple]

export DISPLAY=:99

X=$1
Y=$2
BUTTON=${3:-left}

# Move cursor
xdotool mousemove $X $Y

# Perform click based on type
case $BUTTON in
    left)
        xdotool click 1
        ;;
    right)
        xdotool click 3
        ;;
    middle)
        xdotool click 2
        ;;
    double)
        xdotool click --repeat 2 1
        ;;
    triple)
        xdotool click --repeat 3 1
        ;;
esac

# Wait and screenshot
sleep 2
scrot -q 85 /tmp/screenshot.png
base64 -w 0 /tmp/screenshot.png
echo

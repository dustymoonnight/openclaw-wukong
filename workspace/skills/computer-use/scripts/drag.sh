#!/bin/bash
# Drag - Click and drag from one point to another
# Usage: ./drag.sh x1 y1 x2 y2

export DISPLAY=:99

X1=$1
Y1=$2
X2=$3
Y2=$4

xdotool mousemove $X1 $Y1 mousedown 1 mousemove $X2 $Y2 mouseup 1

# Wait and screenshot
sleep 2
scrot -q 85 /tmp/screenshot.png
base64 -w 0 /tmp/screenshot.png
echo

#!/bin/bash
# Mouse move - Move cursor to coordinates
# Usage: ./mouse_move.sh x y

export DISPLAY=:99

X=$1
Y=$2

xdotool mousemove $X $Y

# Output position
xdotool getmouselocation

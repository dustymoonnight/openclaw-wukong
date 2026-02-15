#!/bin/bash
# Cursor position - Get current mouse position
# Usage: ./cursor_position.sh

export DISPLAY=:99

xdotool getmouselocation

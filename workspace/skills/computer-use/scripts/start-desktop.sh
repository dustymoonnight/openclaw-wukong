#!/bin/bash
# Start virtual desktop for computer-use skill

export DISPLAY=:99

# Start Xvfb if not already running
if ! pgrep -x "Xvfb" > /dev/null; then
    echo "Starting Xvfb..."
    Xvfb :99 -screen 0 1024x768x24 -ac +extension GLX +render -noreset &
    sleep 3
fi

# Start window manager
if ! pgrep -x "xfwm4" > /dev/null; then
    echo "Starting xfwm4..."
    DISPLAY=:99 xfwm4 &
    sleep 2
fi

echo "Virtual desktop ready on DISPLAY=:99"

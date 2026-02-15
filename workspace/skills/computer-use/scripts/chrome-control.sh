#!/bin/bash
# Robust Chrome automation script for Xvfb

export DISPLAY=:99

# Function to check if Chrome is running
check_chrome() {
    pgrep -x "google-chrome" > /dev/null
}

# Function to start Chrome
start_chrome() {
    echo "Starting Chrome..."
    
    # Clean up any existing Chrome processes
    pkill -9 google-chrome 2>/dev/null
    sleep 1
    
    # Create user data directory
    mkdir -p /tmp/chrome-user-data
    
    # Start Chrome with robust flags
    google-chrome \
        --no-sandbox \
        --disable-gpu \
        --disable-dev-shm-usage \
        --disable-software-rasterizer \
        --no-first-run \
        --no-default-browser-check \
        --disable-extensions \
        --disable-sync \
        --disable-background-networking \
        --disable-background-timer-throttling \
        --disable-backgrounding-occluded-windows \
        --disable-breakpad \
        --disable-component-extensions-with-background-pages \
        --disable-features=TranslateUI \
        --disable-ipc-flooding-protection \
        --disable-renderer-backgrounding \
        --enable-features=NetworkService,NetworkServiceInProcess \
        --force-color-profile=srgb \
        --metrics-recording-only \
        --mute-audio \
        --window-size=1024,768 \
        --window-position=0,0 \
        --user-data-dir=/tmp/chrome-user-data \
        "https://www.baidu.com" &
    
    CHROME_PID=$!
    
    # Wait for Chrome to initialize
    sleep 6
    
    # Check if Chrome is still running
    if check_chrome; then
        echo "Chrome started successfully (PID: $CHROME_PID)"
        return 0
    else
        echo "Chrome failed to start"
        return 1
    fi
}

# Function to take screenshot
screenshot() {
    local output_file="${1:-/tmp/screenshot.png}"
    
    if ! check_chrome; then
        echo "Error: Chrome is not running" >&2
        return 1
    fi
    
    # Take screenshot using ImageMagick
    import -window root "$output_file" 2>/dev/null
    
    if [ -f "$output_file" ] && [ -s "$output_file" ]; then
        local size=$(ls -lh "$output_file" | awk '{print $5}')
        echo "Screenshot saved: $output_file ($size)"
        return 0
    else
        echo "Error: Screenshot failed" >&2
        return 1
    fi
}

# Function to navigate to URL
navigate() {
    local url="$1"
    
    if ! check_chrome; then
        echo "Error: Chrome is not running" >&2
        return 1
    fi
    
    # Focus Chrome window and navigate
    xdotool search --onlyvisible --class "google-chrome" windowactivate 2>/dev/null || true
    sleep 0.5
    xdotool key "ctrl+l" 2>/dev/null
    sleep 0.3
    xdotool type "$url" 2>/dev/null
    sleep 0.3
    xdotool key "Return" 2>/dev/null
    sleep 4
    
    echo "Navigated to: $url"
}

# Function to click at coordinates
click_at() {
    local x="$1"
    local y="$2"
    
    xdotool mousemove "$x" "$y" 2>/dev/null
    sleep 0.2
    xdotool click 1 2>/dev/null
    sleep 0.5
}

# Function to type text
type_text() {
    local text="$1"
    xdotool type "$text" 2>/dev/null
    sleep 0.5
}

# Function to press key
press_key() {
    local key="$1"
    xdotool key "$key" 2>/dev/null
    sleep 0.5
}

# Main command handler
case "$1" in
    start)
        start_chrome
        ;;
    screenshot)
        screenshot "$2"
        ;;
    navigate)
        navigate "$2"
        ;;
    click)
        click_at "$2" "$3"
        ;;
    type)
        type_text "$2"
        ;;
    key)
        press_key "$2"
        ;;
    status)
        if check_chrome; then
            echo "Chrome is running"
        else
            echo "Chrome is not running"
        fi
        ;;
    *)
        echo "Usage: $0 {start|screenshot|navigate|click|type|key|status}"
        echo ""
        echo "Commands:"
        echo "  start                    - Start Chrome"
        echo "  screenshot [file]        - Take screenshot"
        echo "  navigate URL             - Navigate to URL"
        echo "  click X Y                - Click at coordinates"
        echo "  type TEXT                - Type text"
        echo "  key KEY                  - Press key (e.g., Return, ctrl+s)"
        echo "  status                   - Check Chrome status"
        ;;
esac

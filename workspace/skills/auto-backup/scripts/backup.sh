#!/bin/bash
# Auto-backup script for OpenClaw configuration
# Generates privacy-safe commit messages

set -e

BACKUP_DIR="/home/admin/.openclaw"
cd "$BACKUP_DIR"

# Check if there are changes
if git diff --quiet && git diff --cached --quiet; then
    echo "No changes to backup"
    exit 0
fi

# Get summary of changes
CHANGED_FILES=$(git diff --name-only 2>/dev/null | head -10)
FILE_COUNT=$(git diff --name-only 2>/dev/null | wc -l)

# Generate commit message based on changes
generate_message() {
    local msg=""
    
    # Check for specific file patterns
    if echo "$CHANGED_FILES" | grep -q "fitness.log"; then
        msg="Update fitness log"
    elif echo "$CHANGED_FILES" | grep -q "memory/"; then
        msg="Update memory logs"
    elif echo "$CHANGED_FILES" | grep -q "SKILL.md\|skills/"; then
        msg="Update skills and configurations"
    elif echo "$CHANGED_FILES" | grep -q "agents/"; then
        msg="Update agent configurations"
    elif echo "$CHANGED_FILES" | grep -q "cron/"; then
        msg="Update scheduled tasks"
    else
        msg="Routine backup"
    fi
    
    # Add file count if multiple files
    if [ "$FILE_COUNT" -gt 3 ]; then
        msg="$msg ($FILE_COUNT files)"
    fi
    
    # Add timestamp (short format)
    msg="$msg - $(date '+%m-%d %H:%M')"
    
    # Ensure under 200 chars
    if [ ${#msg} -gt 200 ]; then
        msg="Routine backup ($(date '+%m-%d'))"
    fi
    
    echo "$msg"
}

COMMIT_MSG=$(generate_message)

# Stage and commit
git add .
git commit -m "$COMMIT_MSG"

# Push to remote
if git remote get-url origin >/dev/null 2>&1; then
    git push origin master
    echo "Backup completed: $COMMIT_MSG"
else
    echo "No remote configured. Commit created locally: $COMMIT_MSG"
fi

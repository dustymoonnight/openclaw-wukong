---
name: auto-backup
description: Automatically backup OpenClaw configuration to GitHub. Use when user wants to backup their OpenClaw setup, or when significant changes have been made that should be preserved. Generates privacy-safe commit messages under 200 characters.
---

# Auto-Backup Skill

Automatically backup OpenClaw configuration with intelligent, privacy-safe commit messages.

## When to Use

- User explicitly requests backup
- After making significant configuration changes
- Before system updates or maintenance
- Periodically to ensure data safety

## How to Use

### Manual Backup

```bash
bash workspace/skills/auto-backup/scripts/backup.sh
```

### What Gets Backed Up

- `workspace/` - All configurations, memories, skills, fitness logs
- `agents/` - Agent configurations and sessions
- `extensions/` - Plugin configurations
- `cron/` - Scheduled tasks
- Excludes: `credentials/` (security sensitive files)

### Commit Message Rules

Messages are automatically generated and:
- ✅ Describe change type (fitness log, memory, skills, etc.)
- ✅ Include file count if multiple files changed
- ✅ Include timestamp (MM-DD HH:MM format)
- ❌ Never contain personal information or conversation content
- ❌ Never exceed 200 characters

### Message Examples

- `Update fitness log (3 files) - 02-14 11:30`
- `Update skills and configurations - 02-14 10:15`
- `Routine backup (5 files) - 02-13 18:00`

## Automation

To enable automatic backups:

1. Add to cron (runs daily at 2 AM):
```bash
0 2 * * * cd /home/admin/.openclaw && bash workspace/skills/auto-backup/scripts/backup.sh
```

2. Or add to HEARTBEAT.md for periodic checks

## Privacy Guarantee

This skill guarantees:
- No user messages or conversation content in commit messages
- No personal identifiers in commit messages
- Only generic change descriptions (file types, counts, timestamps)

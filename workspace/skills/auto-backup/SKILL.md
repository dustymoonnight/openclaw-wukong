---
name: auto-backup
description: Automatically backup OpenClaw configuration to GitHub. Use when user wants to backup their OpenClaw setup, or when significant changes have been made that should be preserved. Generates privacy-safe commit messages under 200 characters.
---

# Auto-Backup Skill

定时自动备份 OpenClaw 配置到 GitHub，生成隐私安全的提交信息。

## 备份模式

**定时备份**（默认）：仅在每周一凌晨 4:00 的 Gateway 维护重启前自动执行
- 整合在 Weekly Gateway Restart 任务中
- 先分层保存记忆，再执行备份，最后重启
- 避免频繁提交，保持仓库历史简洁

**手动备份**：用户可随时手动触发

## 使用方式

### 手动触发

```bash
bash workspace/skills/auto-backup/scripts/backup.sh
```

### 定时自动备份流程（每周一 04:00）

1. **记忆分层保存** - 压缩短期记忆到长期记忆
2. **自动备份** - 执行本 skill 的 backup.sh
3. **检查运行任务** - 确保无任务中断
4. **Gateway 重启** - 完成维护

## 提交信息规则

- ✅ 描述变更类型（fitness log、memory、skills 等）
- ✅ 多文件时显示文件数
- ✅ 包含时间戳（MM-DD HH:MM 格式）
- ❌ 不包含任何个人信息或对话内容
- ❌ 不超过 200 字符

### 示例

- `Update fitness log (3 files) - 02-14 11:30`
- `Update skills and configurations - 02-14 10:15`
- `Routine backup (5 files) - 02-13 18:00`

## 备份内容

- `workspace/` - 配置、记忆、skills、fitness logs
- `agents/` - Agent 配置和会话
- `extensions/` - 插件配置
- `cron/` - 定时任务
- 排除: `credentials/`（安全敏感文件）

## 隐私保证

- 提交信息不含用户消息或对话内容
- 不含个人身份信息
- 仅显示通用变更描述（文件类型、数量、时间戳）

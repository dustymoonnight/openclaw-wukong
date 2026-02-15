---
name: computer-use
description: Desktop automation for headless Linux servers. Control GUI applications via virtual display (Xvfb + XFCE). Supports screenshots, mouse clicks, keyboard input, scrolling, dragging. Best for local app automation, NOT recommended for web browsing due to stability issues in virtual display environment.
version: 1.2.0
metadata: {"openclaw":{"emoji":"🖥️","requires":{"bins":["xdotool","Xvfb","chromium-browser"],"config":["computer-use.enabled"]}}}
---

# Computer Use - 桌面自动化控制

为无头 Linux 服务器提供桌面 GUI 控制能力。创建虚拟显示器 (Xvfb + XFCE)，无需物理显示器即可运行和控制桌面应用程序。

## ⚠️ 重要说明

### 适用场景 ✅
- **本地 GUI 应用程序自动化** - 如终端、文件管理器、本地工具
- **远程桌面管理** - VNC 连接查看和操作
- **截图监控** - 本地应用界面截图
- **自动化测试** - 本地应用的 UI 测试

### 不适用场景 ❌
- **网页浏览** - Chrome/Chromium 在 Xvfb 中不稳定，容易崩溃
- **网页自动化** - 建议使用 `web_search` 或 Playwright

### 替代方案
| 需求 | 推荐工具 |
|------|----------|
| 网页搜索 | `web_search` (searxng) |
| 获取网页内容 | `web_fetch` |
| 稳定网页自动化 | Playwright / Puppeteer |
| 本地 GUI 自动化 | **本 skill** |

## 环境配置

- **Display**: `:99`
- **Resolution**: 1024x768 (XGA)
- **Desktop**: XFCE4 (xfwm4 + panel)
- **浏览器**: Chromium 133.0.6943.141 (已安装，但不稳定)

## 已安装组件

```bash
# 虚拟显示
Xvfb :99 -screen 0 1024x768x24 -ac +extension GLX +render -noreset

# 窗口管理器
xfwm4

# 浏览器（可选，不稳定）
chromium-browser --no-sandbox --disable-gpu

# 控制工具
xdotool - 鼠标键盘控制
import (ImageMagick) - 截图
```

## 使用脚本

所有脚本位于 `~/.openclaw/workspace/skills/computer-use/scripts/`

| 脚本 | 功能 | 示例 |
|------|------|------|
| `start-desktop.sh` | 启动虚拟桌面 | `./start-desktop.sh` |
| `screenshot.sh` | 屏幕截图 | `DISPLAY=:99 ./screenshot.sh` |
| `click.sh x y [left/right/double]` | 鼠标点击 | `DISPLAY=:99 ./click.sh 512 384 left` |
| `mouse_move.sh x y` | 移动鼠标 | `DISPLAY=:99 ./mouse_move.sh 100 200` |
| `type_text.sh "text"` | 输入文本 | `DISPLAY=:99 ./type_text.sh "Hello"` |
| `key.sh "combo"` | 按键/快捷键 | `DISPLAY=:99 ./key.sh "ctrl+s"` |
| `scroll.sh [up/down] amt` | 滚动 | `DISPLAY=:99 ./scroll.sh down 5` |
| `drag.sh x1 y1 x2 y2` | 拖拽 | `DISPLAY=:99 ./drag.sh 100 100 200 200` |
| `wait.sh seconds` | 等待后截图 | `DISPLAY=:99 ./wait.sh 2` |
| `chrome-control.sh` | Chrome 控制 | `./chrome-control.sh start` |

## 使用示例

### 1. 启动虚拟桌面

```bash
# 确保 Xvfb 运行
Xvfb :99 -screen 0 1024x768x24 -ac +extension GLX +render -noreset &

# 启动窗口管理器
export DISPLAY=:99
xfwm4 &
```

### 2. 截图

```bash
cd ~/.openclaw/workspace/skills/computer-use/scripts
export DISPLAY=:99
./screenshot.sh
```

### 3. 自动化操作

```bash
export DISPLAY=:99

# 移动鼠标并点击
./mouse_move.sh 512 384
./click.sh 512 384 left

# 输入文本
./type_text.sh "Hello World"

# 按快捷键
./key.sh "ctrl+s"

# 截图验证
./screenshot.sh
```

## 工作流程

1. **启动环境**
   ```bash
   Xvfb :99 -screen 0 1024x768x24 &
   DISPLAY=:99 xfwm4 &
   ```

2. **启动目标应用**（如终端）
   ```bash
   DISPLAY=:99 xfce4-terminal &
   ```

3. **自动化操作**
   - 截图查看当前状态
   - 点击、输入、滚动
   - 再次截图验证

4. **关闭环境**
   ```bash
   pkill xfwm4
   pkill Xvfb
   ```

## VNC 远程查看（可选）

```bash
# 启动 VNC 服务器
x11vnc -display :99 -noxdamage -nopw -shared -forever &

# SSH 隧道（本地运行）
ssh -L 5900:localhost:5900 your-server

# VNC 客户端连接 localhost:5900
```

## 故障排除

### 截图是黑色的
- 确保 xfwm4 窗口管理器在运行
- 确保目标应用已启动

### Chrome/Chromium 崩溃
- 这是已知问题，建议使用 `web_search` 代替
- 如需网页自动化，考虑安装 Playwright

### 鼠标点击无效
- 确保目标窗口已激活
- 使用 `./mouse_move.sh` 先移动鼠标到目标位置

## 提示

- 所有操作需要设置 `export DISPLAY=:99`
- 屏幕分辨率 1024x768，原点 (0,0) 在左上角
- 长文本输入会分块（50字符），避免丢失
- 大多数操作后自动等待 2 秒再截图

## 更新记录

- 2026-02-14: 初始安装，更新文档明确网页浏览限制

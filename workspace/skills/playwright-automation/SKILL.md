---
name: playwright-automation
description: Stable browser automation using Playwright. Supports screenshots, clicking, typing, scrolling, and search. More reliable than Xvfb+Chrome for web automation.
version: 1.0.0
metadata: {"openclaw":{"emoji":"🎭","requires":{"bins":["node","npx"]}}}
---

# Playwright 浏览器自动化

使用 Playwright 进行稳定的浏览器自动化操作。比 Xvfb + Chrome 更可靠，支持截图、点击、输入、滚动、搜索等功能。

## 已安装组件

- Node.js v24.13.0
- Playwright
- Chromium 145.0.7632.6

## 使用方法

### 命令格式

```bash
cd ~/.openclaw/workspace/skills/playwright-automation
node pw.js <command> [args]
```

### 可用命令

| 命令 | 功能 | 示例 |
|------|------|------|
| `screenshot <url> [filename]` | 截图网页 | `node pw.js screenshot https://example.com` |
| `search-baidu <query>` | 百度搜索 | `node pw.js search-baidu "拳皇97"` |
| `search-google <query>` | Google搜索 | `node pw.js search-google "query"` |
| `click <url> <selector>` | 点击元素 | `node pw.js click https://example.com "button#submit"` |
| `type <url> <selector> <text>` | 输入文字 | `node pw.js type https://example.com "input#name" "text"` |
| `scroll <url> [up|down] [amount]` | 滚动页面 | `node pw.js scroll https://example.com down 800` |

### 使用示例

**截图网页**
```bash
node pw.js screenshot https://www.baidu.com baidu.png
```

**百度搜索**
```bash
node pw.js search-baidu "拳皇97"
```

**点击元素**
```bash
node pw.js click "https://example.com" "button#submit"
```

**输入文字**
```bash
node pw.js type "https://example.com" "input#username" "myname"
```

## 注意事项

1. **Google 搜索限制** - 从云服务器访问 Google 可能触发 reCAPTCHA
2. **百度搜索** - 通常可以正常工作
3. **截图保存位置** - `/tmp/playwright-screenshots/`
4. **超时设置** - 默认 30 秒页面加载超时

## 与 computer-use skill 的区别

| 功能 | computer-use | playwright-automation |
|------|--------------|----------------------|
| 网页自动化 | ❌ 不稳定 | ✅ 稳定 |
| 本地 GUI 应用 | ✅ 可用 | ❌ 不支持 |
| 截图 | ✅ 可用 | ✅ 可用 |
| 点击/输入 | ✅ 可用 | ✅ 可用 |
| 依赖 | Xvfb, xfwm4 | Node.js, Playwright |

## 故障排除

**浏览器启动失败**
```bash
# 检查 Playwright 安装
npx playwright install chromium
```

**网络超时**
- 检查服务器网络连接
- 某些网站可能限制云服务器访问

**截图失败**
- 确保 `/tmp/playwright-screenshots/` 目录可写
- 检查页面是否正确加载

## 文件位置

- 脚本：`~/.openclaw/workspace/skills/playwright-automation/pw.js`
- 截图：`/tmp/playwright-screenshots/`
- 配置：`~/.openclaw/workspace/skills/playwright-automation/package.json`

#!/bin/bash
# 安装 Playwright 用于稳定的网页自动化

# 安装 Node.js 和 Playwright
if ! which npx > /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo yum install -y nodejs
fi

# 创建项目目录
mkdir -p ~/.openclaw/workspace/skills/web-automation
cd ~/.openclaw/workspace/skills/web-automation

# 初始化项目
npm init -y
npm install playwright

# 安装浏览器
npx playwright install chromium

echo "Playwright installed successfully"

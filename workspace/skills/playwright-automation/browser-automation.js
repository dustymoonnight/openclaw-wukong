const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 默认截图保存路径
const SCREENSHOT_DIR = process.env.SCREENSHOT_DIR || '/tmp/playwright-screenshots';

// 确保截图目录存在
if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

/**
 * 浏览器自动化工具
 * 支持：截图、点击、输入、导航、等待
 */

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    if (!command) {
        console.log('Usage: node browser-automation.js <command> [options]');
        console.log('');
        console.log('Commands:');
        console.log('  screenshot <url> [filename]    - 访问网页并截图');
        console.log('  navigate <url>                 - 导航到指定URL');
        console.log('  click <url> <selector>         - 点击元素');
        console.log('  type <url> <selector> <text>   - 在输入框输入文字');
        console.log('  search <query>                 - 在Google搜索');
        console.log('');
        console.log('Examples:');
        console.log('  node browser-automation.js screenshot https://www.baidu.com baidu.png');
        console.log('  node browser-automation.js search "拳皇97"');
        process.exit(1);
    }

    let browser;
    let page;

    try {
        // 启动浏览器
        browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        page = await browser.newPage({
            viewport: { width: 1280, height: 720 }
        });

        switch (command) {
            case 'screenshot':
                await handleScreenshot(page, args);
                break;
            case 'navigate':
                await handleNavigate(page, args);
                break;
            case 'click':
                await handleClick(page, args);
                break;
            case 'type':
                await handleType(page, args);
                break;
            case 'search':
                await handleSearch(page, args);
                break;
            default:
                console.error(`Unknown command: ${command}`);
                process.exit(1);
        }

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// 截图功能
async function handleScreenshot(page, args) {
    const url = args[1];
    const filename = args[2] || `screenshot-${Date.now()}.png`;
    
    if (!url) {
        console.error('Usage: screenshot <url> [filename]');
        process.exit(1);
    }

    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
    const filepath = path.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ path: filepath, fullPage: false });
    
    console.log(`Screenshot saved: ${filepath}`);
    console.log(`MEDIA: ${filepath}`);
}

// 导航功能
async function handleNavigate(page, args) {
    const url = args[1];
    
    if (!url) {
        console.error('Usage: navigate <url>');
        process.exit(1);
    }

    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
    const title = await page.title();
    console.log(`Page loaded: ${title}`);
}

// 点击功能
async function handleClick(page, args) {
    const url = args[1];
    const selector = args[2];
    
    if (!url || !selector) {
        console.error('Usage: click <url> <selector>');
        process.exit(1);
    }

    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
    console.log(`Clicking on ${selector}...`);
    await page.click(selector);
    await page.waitForTimeout(2000);
    
    const filename = `click-result-${Date.now()}.png`;
    const filepath = path.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ path: filepath });
    
    console.log(`Screenshot saved: ${filepath}`);
    console.log(`MEDIA: ${filepath}`);
}

// 输入功能
async function handleType(page, args) {
    const url = args[1];
    const selector = args[2];
    const text = args[3];
    
    if (!url || !selector || !text) {
        console.error('Usage: type <url> <selector> <text>');
        process.exit(1);
    }

    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
    console.log(`Typing "${text}" into ${selector}...`);
    await page.fill(selector, text);
    await page.waitForTimeout(1000);
    
    const filename = `type-result-${Date.now()}.png`;
    const filepath = path.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ path: filepath });
    
    console.log(`Screenshot saved: ${filepath}`);
    console.log(`MEDIA: ${filepath}`);
}

// 搜索功能
async function handleSearch(page, args) {
    const query = args.slice(1).join(' ');
    
    if (!query) {
        console.error('Usage: search <query>');
        process.exit(1);
    }

    console.log(`Searching for "${query}" on Google...`);
    
    // 访问 Google
    await page.goto('https://www.google.com', { waitUntil: 'networkidle', timeout: 30000 });
    
    // 处理可能的 cookie 提示
    try {
        const acceptButton = await page.$('button:has-text("Accept all")');
        if (acceptButton) {
            await acceptButton.click();
            await page.waitForTimeout(1000);
        }
    } catch (e) {
        // 忽略错误
    }
    
    // 在搜索框输入
    await page.fill('textarea[name="q"], input[name="q"]', query);
    await page.waitForTimeout(500);
    
    // 按回车搜索
    await page.press('textarea[name="q"], input[name="q"]', 'Enter');
    await page.waitForTimeout(3000);
    
    const filename = `search-${query.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}.png`;
    const filepath = path.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ path: filepath, fullPage: true });
    
    // 获取搜索结果标题
    const titles = await page.$$eval('h3', elements => elements.slice(0, 5).map(e => e.textContent));
    
    console.log(`\nSearch results for "${query}":`);
    titles.forEach((title, i) => {
        console.log(`${i + 1}. ${title}`);
    });
    
    console.log(`\nScreenshot saved: ${filepath}`);
    console.log(`MEDIA: ${filepath}`);
}

main();

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
 * Playwright 浏览器自动化
 * 
 * 功能：
 * - screenshot: 截图网页
 * - search-baidu: 百度搜索
 * - search-google: Google搜索（可能被拦截）
 * - click: 点击元素
 * - type: 输入文字
 * - scroll: 滚动页面
 * 
 * 用法: node pw.js <command> [args]
 */

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    if (!command || command === 'help') {
        showHelp();
        process.exit(0);
    }

    let browser, page;

    try {
        browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        page = await browser.newPage({
            viewport: { width: 1280, height: 800 }
        });

        switch (command) {
            case 'screenshot':
                await cmdScreenshot(page, args);
                break;
            case 'search-baidu':
                await cmdSearchBaidu(page, args);
                break;
            case 'search-google':
                await cmdSearchGoogle(page, args);
                break;
            case 'click':
                await cmdClick(page, args);
                break;
            case 'type':
                await cmdType(page, args);
                break;
            case 'scroll':
                await cmdScroll(page, args);
                break;
            default:
                console.error(`Unknown command: ${command}`);
                showHelp();
                process.exit(1);
        }

    } catch (error) {
        console.error('Error:', error.message);
        if (browser) await browser.close();
        process.exit(1);
    }

    await browser.close();
}

function showHelp() {
    console.log('Playwright Browser Automation');
    console.log('');
    console.log('Commands:');
    console.log('  screenshot <url> [filename]       - 截图网页');
    console.log('  search-baidu <query>              - 百度搜索');
    console.log('  search-google <query>             - Google搜索（可能被验证码拦截）');
    console.log('  click <url> <selector>            - 点击元素');
    console.log('  type <url> <selector> <text>     - 输入文字');
    console.log('  scroll <url> [up|down] [amount]   - 滚动页面');
    console.log('');
    console.log('Examples:');
    console.log('  node pw.js screenshot https://www.baidu.com baidu.png');
    console.log('  node pw.js search-baidu "拳皇97"');
    console.log('  node pw.js click https://example.com "button#submit"');
    console.log('  node pw.js type https://example.com "input#name" "John Doe"');
}

// 截图
async function cmdScreenshot(page, args) {
    const url = args[1];
    const filename = args[2] || `screenshot-${Date.now()}.png`;
    
    if (!url) {
        console.error('Error: URL required');
        process.exit(1);
    }

    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
    const filepath = path.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ path: filepath, fullPage: true });
    
    console.log(`Screenshot saved: ${filepath}`);
    console.log(`MEDIA: ${filepath}`);
}

// 百度搜索
async function cmdSearchBaidu(page, args) {
    const query = args.slice(1).join(' ');
    if (!query) {
        console.error('Error: Search query required');
        process.exit(1);
    }

    console.log(`Searching "${query}" on Baidu...`);
    
    await page.goto('https://www.baidu.com', { waitUntil: 'networkidle', timeout: 30000 });
    
    // 输入搜索词
    await page.fill('#kw', query);
    await page.waitForTimeout(500);
    
    // 点击搜索按钮
    await page.click('#su');
    await page.waitForTimeout(3000);
    
    // 截图
    const filename = `baidu-search-${Date.now()}.png`;
    const filepath = path.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ path: filepath, fullPage: false });
    
    // 获取结果标题
    try {
        const results = await page.$$eval('.result .title', elems => 
            elems.slice(0, 5).map(e => e.textContent.trim()).filter(Boolean)
        );
        
        console.log('\nTop results:');
        results.forEach((title, i) => console.log(`${i + 1}. ${title}`));
    } catch (e) {
        // 忽略错误
    }
    
    console.log(`\nScreenshot: ${filepath}`);
    console.log(`MEDIA: ${filepath}`);
}

// Google搜索
async function cmdSearchGoogle(page, args) {
    const query = args.slice(1).join(' ');
    if (!query) {
        console.error('Error: Search query required');
        process.exit(1);
    }

    console.log(`Searching "${query}" on Google...`);
    console.log('Note: Google may show reCAPTCHA from cloud servers');
    
    await page.goto('https://www.google.com', { waitUntil: 'networkidle', timeout: 30000 });
    
    // 处理 cookie 提示
    try {
        await page.click('button:has-text("Accept all")', { timeout: 5000 });
        await page.waitForTimeout(1000);
    } catch (e) {}
    
    // 输入搜索词
    await page.fill('textarea[name="q"], input[name="q"]', query);
    await page.press('textarea[name="q"], input[name="q"]', 'Enter');
    await page.waitForTimeout(3000);
    
    const filename = `google-search-${Date.now()}.png`;
    const filepath = path.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ path: filepath, fullPage: false });
    
    console.log(`Screenshot: ${filepath}`);
    console.log(`MEDIA: ${filepath}`);
}

// 点击元素
async function cmdClick(page, args) {
    const url = args[1];
    const selector = args[2];
    
    if (!url || !selector) {
        console.error('Usage: click <url> <selector>');
        process.exit(1);
    }

    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
    console.log(`Clicking: ${selector}`);
    await page.click(selector);
    await page.waitForTimeout(2000);
    
    const filename = `click-${Date.now()}.png`;
    const filepath = path.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ path: filepath });
    
    console.log(`Screenshot: ${filepath}`);
    console.log(`MEDIA: ${filepath}`);
}

// 输入文字
async function cmdType(page, args) {
    const url = args[1];
    const selector = args[2];
    const text = args[3];
    
    if (!url || !selector || !text) {
        console.error('Usage: type <url> <selector> <text>');
        process.exit(1);
    }

    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
    console.log(`Typing "${text}" into ${selector}`);
    await page.fill(selector, text);
    await page.waitForTimeout(1000);
    
    const filename = `type-${Date.now()}.png`;
    const filepath = path.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ path: filepath });
    
    console.log(`Screenshot: ${filepath}`);
    console.log(`MEDIA: ${filepath}`);
}

// 滚动页面
async function cmdScroll(page, args) {
    const url = args[1];
    const direction = args[2] || 'down';
    const amount = parseInt(args[3]) || 800;
    
    if (!url) {
        console.error('Usage: scroll <url> [up|down] [amount]');
        process.exit(1);
    }

    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
    const scrollAmount = direction === 'up' ? -amount : amount;
    await page.evaluate((y) => window.scrollBy(0, y), scrollAmount);
    await page.waitForTimeout(1000);
    
    const filename = `scroll-${Date.now()}.png`;
    const filepath = path.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ path: filepath });
    
    console.log(`Scrolled ${direction} by ${amount}px`);
    console.log(`Screenshot: ${filepath}`);
    console.log(`MEDIA: ${filepath}`);
}

main();

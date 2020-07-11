const puppeteer = require('puppeteer');
const { record } = require('puppeteer-recorder');

(async() => {
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    const page = await browser.newPage();
    page.setViewport({width: 2000, height: 2000, deviceScaleFactor: 2});

    await page.goto('file:///app/network-animator.svg', {waitUntil: 'domcontentloaded'});

    await record({
        browser: browser, // Optional: a puppeteer Browser instance,
        page: page, // Optional: a puppeteer Page instance,
        output: 'output/output1.webm',
        fps: 60,
        frames: 60 * 1, // 5 seconds at 60 fps
        pipeOutput: true,
        logEachFrame: true,
        prepare: function (browser, page) { /* executed before first capture */ },
        render: function (browser, page, frame) { /* executed before each capture */ }
    });

    browser.close();
})();
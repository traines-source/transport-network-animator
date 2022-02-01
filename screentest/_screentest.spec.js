const puppeteer = require('puppeteer')
const ScreenshotTester = require('puppeteer-screenshot-tester')

describe('screentest', () => {

  const tests = ['ice-network.svg#2022', 'travel-times-fernverkehr.svg#2030-12', 'trains.svg#1000', 'cologne-sbahn.svg#1000'];

  tests.forEach(test => {

    it(test, async () => {
      const tester = await ScreenshotTester(0.1);
      const browser = await puppeteer.launch({
          args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--allow-file-access-from-files'
          ]
      });
      const page = await browser.newPage();
      await page.setViewport({width: 1920, height: 1080});
      await page.goto('file:///app/examples/'+test, { waitUntil: 'networkidle0' });
      await page.waitFor(2000);
  
      const result = await tester(page, test.replace('#', '_'), {saveNewImageOnError : true});
      await browser.close();
      expect(result).toBe(true);
    }, 60000);

  });
  
})
import { chromium, devices } from 'playwright';

const URL = process.env.PYXORA_URL || `file:///${process.cwd().replace(/\\/g,'/')}/index.html`;
const OUT = './test-results';

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 12 Pro'] });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  const sections = ['about', 'values', 'story', 'contact'];
  for (const id of sections) {
    await page.evaluate(s => document.querySelector(`#${s}`)?.scrollIntoView({ block: 'start' }), id);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/m-ip12-new-${id}.png`, fullPage: false });
  }

  // Desktop
  await ctx.close();
  const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dpage = await dctx.newPage();
  await dpage.goto(URL, { waitUntil: 'networkidle' });
  await dpage.waitForTimeout(400);
  for (const id of sections) {
    await dpage.evaluate(s => document.querySelector(`#${s}`)?.scrollIntoView({ block: 'start' }), id);
    await dpage.waitForTimeout(700);
    await dpage.screenshot({ path: `${OUT}/d-1440-new-${id}.png`, fullPage: false });
  }

  await browser.close();
  console.log('done');
})();

import { chromium, devices } from 'playwright';
import fs from 'fs';

const URL = process.env.PYXORA_URL || `file:///${process.cwd().replace(/\\/g,'/')}/index.html`;
const OUT = './test-results';
fs.mkdirSync(OUT, { recursive: true });

const targets = [
  { name: 'iphone12',  device: devices['iPhone 12 Pro'] },
  { name: 'iphonese',  device: devices['iPhone SE'] },
  { name: 'pixel5',    device: devices['Pixel 5'] },
];

(async () => {
  const browser = await chromium.launch();
  for (const t of targets) {
    const ctx = await browser.newContext({ ...t.device });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    // Hero
    await page.screenshot({ path: `${OUT}/m-${t.name}-1-hero.png`, fullPage: false });

    // Services
    await page.evaluate(() => document.querySelector('#services')?.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/m-${t.name}-2-services.png`, fullPage: false });

    // Featured projects
    await page.evaluate(() => document.querySelector('#featured')?.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/m-${t.name}-3-featured.png`, fullPage: false });

    // Brand / colors
    await page.evaluate(() => document.querySelector('#brand')?.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/m-${t.name}-4-brand.png`, fullPage: false });

    // Ecosystem
    await page.evaluate(() => document.querySelector('#ecosystem')?.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/m-${t.name}-5-ecosystem.png`, fullPage: false });

    // Drawer open (force click to bypass overlap detection)
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.evaluate(() => document.getElementById('navToggle')?.click());
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/m-${t.name}-6-drawer.png`, fullPage: false });

    // Close drawer
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    // Full-page scroll
    await page.screenshot({ path: `${OUT}/m-${t.name}-FULL.png`, fullPage: true });

    await ctx.close();
    console.log(`${t.name}: done (${t.device.viewport.width}x${t.device.viewport.height})`);
  }
  await browser.close();
})();

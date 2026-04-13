import { chromium, devices } from 'playwright';
import fs from 'fs';

const URL = process.env.PYXORA_URL || 'https://pyxora-site.pages.dev';
const OUT = './test-results';
fs.mkdirSync(OUT, { recursive: true });

const issues = [];
const logIssue = (level, msg) => { issues.push({ level, msg }); console.log(`[${level}] ${msg}`); };

const viewports = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet',  width: 768,  height: 1024 },
  { name: 'mobile',  width: 375,  height: 812  },
];

(async () => {
  const browser = await chromium.launch();
  const consoleErrors = [];
  const networkFails = [];

  for (const vp of viewports) {
    console.log(`\n=== ${vp.name} (${vp.width}x${vp.height}) ===`);
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();

    page.on('console', m => {
      if (m.type() === 'error') {
        consoleErrors.push(`[${vp.name}] ${m.text()}`);
        logIssue('CONSOLE', `${vp.name}: ${m.text()}`);
      }
    });
    page.on('requestfailed', r => {
      networkFails.push(`[${vp.name}] ${r.url()} ${r.failure()?.errorText}`);
      logIssue('NETWORK', `${vp.name}: ${r.url()}`);
    });

    const resp = await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    if (!resp || !resp.ok()) logIssue('HTTP', `status ${resp?.status()}`);

    // --- Basic checks ---
    const title = await page.title();
    console.log('title:', title);
    if (!title.includes('Pyxora')) logIssue('TITLE', `unexpected title: ${title}`);

    // --- Hero title chars visible ---
    const chars = await page.$$eval('.hero h1 .char', els =>
      els.map(e => ({
        text: e.textContent,
        w: e.offsetWidth,
        h: e.offsetHeight,
        color: getComputedStyle(e).webkitTextFillColor || getComputedStyle(e).color,
        bg: getComputedStyle(e).backgroundImage,
      }))
    );
    console.log('hero chars:', chars.length, chars.map(c => c.text).join(''));
    if (chars.length === 0) logIssue('HERO', 'no .char spans found in hero title');
    const joined = chars.map(c => c.text).join('');
    if (!joined.includes('Pyxora')) logIssue('HERO', `title text wrong: "${joined}"`);
    chars.forEach((c, i) => {
      if (c.w === 0 || c.h === 0) logIssue('HERO', `char[${i}] "${c.text}" has zero size`);
      if (!c.bg || c.bg === 'none') logIssue('HERO', `char[${i}] "${c.text}" has no gradient bg`);
    });

    // --- Hover y char test ---
    if (vp.name === 'desktop' && chars.length > 0) {
      const yChar = await page.$('.hero h1 .char:nth-child(2)'); // y
      if (yChar) {
        await yChar.hover();
        await page.waitForTimeout(600);
        const afterHover = await yChar.evaluate(e => ({
          opacity: getComputedStyle(e).opacity,
          visibility: getComputedStyle(e).visibility,
          w: e.offsetWidth,
          textFill: getComputedStyle(e).webkitTextFillColor,
          rect: e.getBoundingClientRect(),
        }));
        console.log('y char after hover:', afterHover);
        if (afterHover.opacity === '0' || afterHover.visibility === 'hidden' || afterHover.w === 0) {
          logIssue('HERO', 'y char disappears on hover');
        }
        await page.screenshot({ path: `${OUT}/${vp.name}-hero-hover-y.png`, fullPage: false });
      }
    }

    // --- Element counts ---
    const counts = await page.evaluate(() => ({
      services: document.querySelectorAll('.service').length,
      features: document.querySelectorAll('.feature-card').length,
      colors:   document.querySelectorAll('.color-card').length,
      subs:     document.querySelectorAll('.subdomain').length,
      nav:      document.querySelectorAll('.nav-links a').length,
    }));
    console.log('counts:', counts);
    if (counts.services < 6) logIssue('CONTENT', `expected 6 services, got ${counts.services}`);
    if (counts.features < 3) logIssue('CONTENT', `expected 3 features, got ${counts.features}`);
    if (counts.colors < 4)   logIssue('CONTENT', `expected 4 colors, got ${counts.colors}`);
    if (counts.subs < 8)     logIssue('CONTENT', `expected 8 subdomains, got ${counts.subs}`);

    // --- Cursor existence (only on hover-capable) ---
    if (vp.name === 'desktop') {
      const hasCursor = await page.$('.cursor');
      if (!hasCursor) logIssue('CURSOR', 'custom cursor element missing');
    }

    // --- Scroll navigation ---
    const navLinks = await page.$$('.nav-links a');
    if (vp.name === 'desktop' && navLinks.length > 0) {
      await navLinks[0].click();
      await page.waitForTimeout(800);
      const scrollY = await page.evaluate(() => window.scrollY);
      if (scrollY < 100) logIssue('NAV', 'first nav link did not scroll');
      await page.evaluate(() => window.scrollTo(0, 0));
    }

    // --- Scroll reveal: scroll gradually and check sections got .in ---
    const totalHeight = await page.evaluate(() => document.body.scrollHeight);
    const steps = 12;
    for (let s = 1; s <= steps; s++) {
      await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), (totalHeight / steps) * s);
      await page.waitForTimeout(180);
    }
    await page.waitForTimeout(400);
    const revealStats = await page.evaluate(() => {
      const all = document.querySelectorAll('.reveal');
      const lit = document.querySelectorAll('.reveal.in');
      return { all: all.length, lit: lit.length };
    });
    console.log('reveal:', revealStats);
    if (revealStats.all > 0 && revealStats.lit / revealStats.all < 0.85) {
      logIssue('REVEAL', `only ${revealStats.lit}/${revealStats.all} reveals triggered after gradual scroll`);
    }

    // --- Full page screenshot ---
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/${vp.name}-full.png`, fullPage: true });

    // --- Performance metrics ---
    const perf = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      return {
        loadTime: nav?.loadEventEnd - nav?.startTime,
        domContentLoaded: nav?.domContentLoadedEventEnd - nav?.startTime,
        fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
      };
    });
    console.log('perf:', perf);
    if (perf.fcp > 3000) logIssue('PERF', `FCP too slow: ${perf.fcp}ms`);

    await ctx.close();
  }

  await browser.close();

  // --- Summary ---
  console.log('\n=== SUMMARY ===');
  console.log(`Console errors: ${consoleErrors.length}`);
  console.log(`Network fails:  ${networkFails.length}`);
  console.log(`Issues:         ${issues.length}`);
  if (issues.length) {
    console.log('\nIssues:');
    issues.forEach(i => console.log(`  - [${i.level}] ${i.msg}`));
  }
  fs.writeFileSync(`${OUT}/report.json`, JSON.stringify({ issues, consoleErrors, networkFails }, null, 2));
  process.exit(issues.length > 0 ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });

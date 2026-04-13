import { chromium } from 'playwright';
import fs from 'fs';

const URL = process.env.PYXORA_URL || 'https://pyxora-site.pages.dev';
const OUT = './test-results';
fs.mkdirSync(OUT, { recursive: true });

const report = { critical: [], warning: [], info: [] };
const add = (sev, area, msg) => { report[sev].push({ area, msg }); };

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });

  // ===== 1. SEO / META =====
  const meta = await page.evaluate(() => {
    const get = n => document.querySelector(`meta[name="${n}"]`)?.content
              || document.querySelector(`meta[property="${n}"]`)?.content;
    return {
      description: get('description'),
      ogTitle:    get('og:title'),
      ogDesc:     get('og:description'),
      ogImage:    get('og:image'),
      ogUrl:      get('og:url'),
      twitter:    get('twitter:card'),
      canonical:  document.querySelector('link[rel="canonical"]')?.href,
      favicon:    document.querySelector('link[rel="icon"]')?.href
               || document.querySelector('link[rel="shortcut icon"]')?.href,
      lang:       document.documentElement.lang,
      themeColor: get('theme-color'),
    };
  });
  console.log('META:', meta);
  if (!meta.description) add('warning', 'SEO', 'missing meta description');
  if (!meta.ogTitle)     add('warning', 'SEO', 'missing og:title (social sharing)');
  if (!meta.ogImage)     add('warning', 'SEO', 'missing og:image (social preview)');
  if (!meta.canonical)   add('info',    'SEO', 'missing canonical link');
  if (!meta.favicon)     add('warning', 'UX',  'missing favicon');
  if (!meta.themeColor)  add('info',    'UX',  'missing theme-color (mobile browser UI)');

  // ===== 2. DEAD LINKS =====
  const links = await page.$$eval('a[href]', els => els.map(e => ({
    href: e.getAttribute('href'),
    text: (e.textContent || '').trim().slice(0, 40),
  })));
  const deadHash = links.filter(l => l.href === '#');
  if (deadHash.length) {
    add('warning', 'LINKS', `${deadHash.length} dead "#" links: ${deadHash.map(l => l.text).filter(Boolean).join(', ')}`);
  }
  const anchors = links.filter(l => l.href.startsWith('#') && l.href !== '#');
  for (const a of anchors) {
    const target = await page.$(a.href);
    if (!target) add('critical', 'LINKS', `anchor ${a.href} target not found`);
  }

  // ===== 3. ACCESSIBILITY =====
  const a11y = await page.evaluate(() => {
    const results = [];
    document.querySelectorAll('img').forEach(img => {
      if (!img.alt) results.push({ type: 'img-no-alt', src: img.src });
    });
    document.querySelectorAll('button, a').forEach(el => {
      const t = (el.textContent || '').trim();
      const aria = el.getAttribute('aria-label');
      if (!t && !aria) results.push({ type: 'empty-link', html: el.outerHTML.slice(0, 80) });
    });
    // h1 count
    const h1s = document.querySelectorAll('h1').length;
    return { results, h1Count: h1s };
  });
  if (a11y.h1Count !== 1) add('warning', 'A11Y', `page has ${a11y.h1Count} <h1> (should be 1)`);
  if (a11y.results.length) add('warning', 'A11Y', `${a11y.results.length} items: ${a11y.results[0].type}`);

  // ===== 4. MOBILE NAV =====
  await ctx.close();
  const mctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const mpage = await mctx.newPage();
  await mpage.goto(URL, { waitUntil: 'networkidle' });
  const mobileNav = await mpage.evaluate(() => {
    const links = document.querySelector('.nav-links');
    const style = links ? getComputedStyle(links) : null;
    const hamburger = document.querySelector('.nav-toggle, .hamburger, [aria-label*="menu" i]');
    return {
      linksDisplay: style?.display,
      linksVisible: style?.display !== 'none' && style?.visibility !== 'hidden',
      hasHamburger: !!hamburger,
    };
  });
  console.log('MOBILE NAV:', mobileNav);
  if (!mobileNav.linksVisible && !mobileNav.hasHamburger) {
    add('critical', 'MOBILE', 'nav links hidden on mobile with no hamburger menu fallback');
  }

  // CTA button check on mobile
  const ctaWorks = await mpage.evaluate(() => {
    const cta = document.querySelector('.nav-cta');
    return { exists: !!cta, href: cta?.getAttribute('href') };
  });
  console.log('CTA:', ctaWorks);

  // ===== 5. HTTPS + HEADERS =====
  const resp = await mpage.goto(URL);
  const headers = resp.headers();
  if (!headers['content-security-policy']) add('info', 'SECURITY', 'no CSP header');
  if (!headers['strict-transport-security']) add('info', 'SECURITY', 'no HSTS header (auto on .app TLD)');
  console.log('HEADERS sample:', {
    ctype: headers['content-type'],
    server: headers['server'],
    cache: headers['cache-control'],
  });

  // ===== 6. IMAGE / RESOURCE SIZE =====
  const resources = await mpage.evaluate(() =>
    performance.getEntriesByType('resource').map(r => ({
      name: r.name,
      size: r.transferSize,
      type: r.initiatorType,
      duration: Math.round(r.duration),
    })).sort((a, b) => b.size - a.size).slice(0, 10)
  );
  console.log('\nTOP 10 RESOURCES BY SIZE:');
  resources.forEach(r => console.log(`  ${Math.round(r.size/1024)}KB ${r.duration}ms ${r.name.slice(0, 80)}`));
  const totalSize = resources.reduce((s, r) => s + r.size, 0);
  if (totalSize > 500 * 1024) add('info', 'PERF', `total top-10 resources ~${Math.round(totalSize/1024)}KB`);

  // ===== 7. VISUAL CHECK - scrollTo various sections =====
  await mpage.screenshot({ path: `${OUT}/mobile-hero.png`, fullPage: false });
  await mpage.evaluate(() => document.querySelector('#services')?.scrollIntoView());
  await mpage.waitForTimeout(600);
  await mpage.screenshot({ path: `${OUT}/mobile-services.png`, fullPage: false });
  await mpage.evaluate(() => document.querySelector('#ecosystem')?.scrollIntoView());
  await mpage.waitForTimeout(600);
  await mpage.screenshot({ path: `${OUT}/mobile-ecosystem.png`, fullPage: false });

  await mctx.close();
  await browser.close();

  // ===== REPORT =====
  console.log('\n========================================');
  console.log(`CRITICAL: ${report.critical.length}`);
  console.log(`WARNING:  ${report.warning.length}`);
  console.log(`INFO:     ${report.info.length}`);
  console.log('========================================');
  for (const sev of ['critical', 'warning', 'info']) {
    if (report[sev].length) {
      console.log(`\n${sev.toUpperCase()}:`);
      report[sev].forEach(r => console.log(`  [${r.area}] ${r.msg}`));
    }
  }
  fs.writeFileSync(`${OUT}/audit.json`, JSON.stringify(report, null, 2));
})().catch(e => { console.error(e); process.exit(2); });

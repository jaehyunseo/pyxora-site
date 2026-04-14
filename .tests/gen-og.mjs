import { chromium } from 'playwright';
import fs from 'fs';

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@700;900&family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{
  width:1200px;height:630px;
  background:#06060f;
  font-family:'Pretendard','Space Grotesk',sans-serif;
  color:#f5f5f7;
  position:relative;
  overflow:hidden;
  display:flex;
  align-items:center;
  padding:0 100px;
}
.mesh{
  position:absolute;inset:0;
  background:
    radial-gradient(ellipse 60% 50% at 20% 0%, rgba(124,58,237,.4), transparent 60%),
    radial-gradient(ellipse 60% 60% at 90% 80%, rgba(6,182,212,.25), transparent 60%),
    radial-gradient(ellipse 50% 50% at 60% 50%, rgba(251,191,36,.15), transparent 60%);
}
.grid{
  position:absolute;inset:0;
  background-image:
    linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);
  background-size:60px 60px;
  mask-image:radial-gradient(ellipse at center,#000 30%,transparent 80%);
}
.content{position:relative;z-index:2}
.eyebrow{
  font-family:'JetBrains Mono',monospace;
  font-size:16px;letter-spacing:3px;color:#fbbf24;
  padding:10px 20px;
  border:1px solid rgba(251,191,36,.3);
  background:rgba(251,191,36,.05);
  border-radius:100px;
  display:inline-block;
  margin-bottom:36px;
}
h1{
  font-family:'Space Grotesk',sans-serif;
  font-size:200px;font-weight:700;line-height:.85;letter-spacing:-.05em;
  background:linear-gradient(180deg,#fff 20%,#a855f7 70%,#fbbf24 100%);
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
  margin-bottom:20px;
}
.sub{
  font-family:'Pretendard',sans-serif;
  font-size:36px;font-weight:500;color:#c4c4d0;
  letter-spacing:-.01em;
  margin-bottom:32px;
}
.tags{display:flex;gap:14px;font-family:'JetBrains Mono',monospace;font-size:14px;color:#9ca3b8;letter-spacing:1.5px}
.tags span{padding:8px 16px;border:1px solid rgba(255,255,255,.12);border-radius:100px}
.orb{
  position:absolute;right:-60px;top:50%;transform:translateY(-50%);
  width:560px;height:560px;
  z-index:1;
  filter:drop-shadow(0 0 80px rgba(124,58,237,.4));
}
</style></head><body>
<div class="mesh"></div>
<div class="grid"></div>
<div class="content">
  <div class="eyebrow">· DIGITAL FORGE · MMXXVI</div>
  <h1>Pyxora</h1>
  <div class="sub">파이조라 — 기술과 호기심의 작업실</div>
  <div class="tags"><span>RETRO ARCADE</span><span>MICRO APPS</span><span>EXPERIMENT LAB</span></div>
</div>
<svg class="orb" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="50%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#fbbf24"/>
    </linearGradient>
  </defs>
  <polygon points="300,40 520,170 520,430 300,560 80,430 80,170" fill="none" stroke="url(#g1)" stroke-width="2" opacity=".3"/>
  <polygon points="300,100 470,195 470,405 300,500 130,405 130,195" fill="none" stroke="url(#g1)" stroke-width="2" opacity=".5"/>
  <g stroke="url(#g1)" stroke-width="2.5" fill="none" opacity=".8">
    <line x1="300" y1="180" x2="220" y2="270"/>
    <line x1="300" y1="180" x2="380" y2="270"/>
    <line x1="220" y1="270" x2="170" y2="360"/>
    <line x1="220" y1="270" x2="260" y2="360"/>
    <line x1="380" y1="270" x2="340" y2="360"/>
    <line x1="380" y1="270" x2="430" y2="360"/>
  </g>
  <g fill="url(#g1)">
    <circle cx="300" cy="180" r="18"/>
    <circle cx="220" cy="270" r="13"/>
    <circle cx="380" cy="270" r="13"/>
    <circle cx="170" cy="360" r="9"/>
    <circle cx="260" cy="360" r="9"/>
    <circle cx="340" cy="360" r="9"/>
    <circle cx="430" cy="360" r="9"/>
  </g>
  <text x="300" y="330" font-family="Space Grotesk" font-size="96" font-weight="700" fill="#fbbf24" text-anchor="middle">P</text>
</svg>
</body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: './og.png', fullPage: false, omitBackground: false });
  await browser.close();
  const size = fs.statSync('./og.png').size;
  console.log(`og.png generated: ${Math.round(size/1024)}KB`);
})();

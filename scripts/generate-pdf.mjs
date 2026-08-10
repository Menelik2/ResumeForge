/**
 * Headless browser PDF generation (Puppeteer)
 *
 * Usage:
 *   npm install puppeteer
 *   node scripts/generate-pdf.mjs [url] [output.pdf]
 *
 * Example:
 *   node scripts/generate-pdf.mjs http://localhost:5500/builder.html ./resume.pdf
 */

import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const url = process.argv[2] || 'http://127.0.0.1:5500/builder.html';
const out = process.argv[3] || path.resolve('resume.pdf');

async function main() {
  console.log('Launching headless Chromium…');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

    console.log('Navigating to', url);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

    await page.waitForSelector('#resume-paper', { timeout: 30000 });
    await page.waitForFunction(() => {
      const el = document.getElementById('resume-paper');
      return el && el.innerHTML.trim().length > 20;
    }, { timeout: 30000 });

    await page.addStyleTag({
      content: `
        .builder-header, .editor-panel, .preview-toolbar, .mobile-nav,
        .toast-container, .splash, .no-print { display: none !important; }
        .builder-main, .preview-panel {
          display: block !important; padding: 0 !important;
          background: #fff !important; overflow: visible !important;
        }
        .resume-paper {
          transform: none !important; box-shadow: none !important;
          margin: 0 auto !important; width: 210mm !important;
        }
        body { background: #fff !important; }
      `
    });

    await page.pdf({
      path: out,
      format: 'A4',
      printBackground: true,
      margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
      preferCSSPageSize: true
    });

    const size = fs.statSync(out).size;
    console.log(`Saved ${out} (${Math.round(size / 1024)} KB)`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

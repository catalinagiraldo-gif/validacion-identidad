#!/usr/bin/env node

// Captures screenshots of each prototype route for Hub card thumbnails.
// Requires: dev server running on localhost:4200 (yarn start)
// Usage: yarn generate-thumbnails

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '..', 'src', 'app', 'config', 'prototypes.registry.ts');
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'thumbnails');
const BASE_URL = process.env.BASE_URL || 'http://localhost:4200';
const VIEWPORT = { width: 1280, height: 720 };

function parseRegistry() {
  const content = fs.readFileSync(REGISTRY_PATH, 'utf8');
  const entries = [];
  const regex = /slug:\s*"([^"]+)"[\s\S]*?route:\s*"([^"]+)"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    entries.push({ slug: match[1], route: match[2] });
  }
  return entries;
}

function hasManualOverride(slug) {
  const markerPath = path.join(OUTPUT_DIR, `${slug}.manual`);
  return fs.existsSync(markerPath);
}

async function main() {
  const entries = parseRegistry();
  if (entries.length === 0) {
    console.error('No prototypes found in registry. Run yarn generate-registry first.');
    process.exit(1);
  }

  console.log(`Found ${entries.length} prototypes in registry`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT });
  let captured = 0;
  let skipped = 0;

  for (const entry of entries) {
    if (hasManualOverride(entry.slug)) {
      console.log(`Skipped: ${entry.slug}.png (manual override)`);
      skipped++;
      continue;
    }

    const page = await context.newPage();

    // Bypass auth guards by injecting storage state
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.setItem('dropi_hub_user', JSON.stringify({
        uid: 'thumbnail-bot',
        email: 'producto@dropi.co',
        displayName: 'Thumbnail Bot',
        photoURL: '',
        createdAt: new Date().toISOString()
      }));
      sessionStorage.setItem('dropi_hub_profile', 'admin');
    });

    await page.goto(`${BASE_URL}${entry.route}`, { waitUntil: 'networkidle', timeout: 15000 });
    // Allow animations to settle
    await page.waitForTimeout(500);

    const outputPath = path.join(OUTPUT_DIR, `${entry.slug}.png`);
    await page.screenshot({ path: outputPath, type: 'png' });
    console.log(`Captured: ${entry.slug}.png`);
    captured++;

    await page.close();
  }

  await browser.close();
  console.log(`\nGenerated ${captured} thumbnails in src/assets/thumbnails/ (${skipped} skipped)`);
}

main().catch((err) => {
  console.error('Thumbnail generation failed:', err.message);
  process.exit(1);
});

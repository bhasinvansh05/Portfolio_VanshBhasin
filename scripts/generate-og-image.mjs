#!/usr/bin/env node
/**
 * Renders scripts/og-image.template.html to public/og.png at 1200x630.
 *
 * Deliberately kept out of `npm run build`: CI would otherwise need a browser
 * just to reproduce a static asset. Run it locally after editing the template
 * and commit the resulting PNG.
 *
 *   npm run og:image
 */
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, statSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATE = path.join(ROOT, 'scripts', 'og-image.template.html');
const OUTPUT = path.join(ROOT, 'public', 'og.png');

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'google-chrome',
  'google-chrome-stable',
  'chromium',
  'chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

function resolveChrome() {
  for (const candidate of CHROME_CANDIDATES) {
    try {
      execFileSync(candidate, ['--version'], { stdio: 'ignore' });
      return candidate;
    } catch {
      // Try the next candidate.
    }
  }
  throw new Error(
    `No Chrome binary found. Tried: ${CHROME_CANDIDATES.join(', ')}. ` +
      'Set CHROME_PATH to override.',
  );
}

/** Resolves once the PNG exists and has stopped growing. */
async function waitForStableOutput(deadlineMs) {
  const startedAt = Date.now();
  let lastSize = -1;

  while (Date.now() - startedAt < deadlineMs) {
    await sleep(300);
    if (!existsSync(OUTPUT)) continue;

    const { size } = statSync(OUTPUT);
    if (size > 0 && size === lastSize) return size;
    lastSize = size;
  }

  return 0;
}

const chrome = resolveChrome();
// Chrome refuses to reuse a live profile and writes junk into the cwd without
// an explicit user data dir.
const profile = mkdtempSync(path.join(tmpdir(), 'og-image-'));

// Start from a clean slate so a stale file cannot be mistaken for a fresh render.
if (existsSync(OUTPUT)) unlinkSync(OUTPUT);

// `--screenshot` writes the PNG and then, in several Chrome builds, never
// exits. The screenshot is the only thing wanted here, so wait for the file to
// settle and then stop the process rather than waiting on exit.
const child = spawn(
  chrome,
  [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--window-size=1200,630',
    '--virtual-time-budget=4000',
    `--user-data-dir=${profile}`,
    `--screenshot=${OUTPUT}`,
    `file://${TEMPLATE}`,
  ],
  { stdio: 'ignore' },
);

let bytes = 0;
try {
  bytes = await waitForStableOutput(60_000);
} finally {
  child.kill('SIGKILL');
  // Chrome's helper processes need a moment to let go of the profile before it
  // can be removed; a leftover temp directory is not worth failing over.
  await sleep(500);
  try {
    rmSync(profile, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 200,
    });
  } catch {
    console.warn(`Left behind temporary Chrome profile at ${profile}`);
  }
}

if (!bytes) {
  throw new Error(`Chrome did not write ${OUTPUT} within 60s`);
}

console.log(
  `Wrote ${path.relative(ROOT, OUTPUT)} (1200x630, ${bytes.toLocaleString()} bytes)`,
);

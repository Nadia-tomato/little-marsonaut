import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('HTML game keeps the original standalone entry and mission briefing', () => {
  assert.match(html, /<div id="root"><\/div>/);
  assert.match(html, /Start Mission/);
  assert.match(html, /Survive 20 Sols/);
  assert.match(html, /TEST_CLOCK_PARAM/);
});

test('HTML game has continuous-time and four-zone hooks', () => {
  assert.match(html, /DEFAULT_SOL_SECONDS = 120/);
  assert.match(html, /Mission Control/);
  assert.match(html, /Power Station/);
  assert.match(html, /Plant seeds to grow tomatoes/);
  assert.match(html, /BATTERY_SAMPLE_LIMITS/);
  assert.match(html, /NASA_FALLBACK_PHOTO/);
});

test('HTML game does not use the React app entry as its root page', () => {
  assert.doesNotMatch(html, /src\s*=\s*["']src\/main\./);
  assert.doesNotMatch(html, /<App\s*\/>\s*<\/div>/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('UI update 01 keeps the standalone HTML game and adds the launch flow', () => {
  assert.match(html, /function MarsLaunchTransition/);
  assert.match(html, /MARS_FACTS/);
  assert.match(html, /const IS_LOCAL_TEST_HOST/);
  assert.match(html, /TEST_CLOCK_SECONDS/);
  assert.match(html, /const DAY_DURATION_SECONDS = TEST_CLOCK_SECONDS \|\| 120/);
  assert.match(html, /Skip/);
  assert.match(html, /animate-approach-mars/);
  assert.match(html, /animate-launch-fade/);
});

test('UI update 01 removes the manual End Day action', () => {
  assert.doesNotMatch(html, /End Day/);
  assert.doesNotMatch(html, /onRequestEndSol/);
  assert.match(html, /executeEndSolRef/);
});

test('UI update 01 includes rover unread state, rare discovery, and Mission Control tabs', () => {
  assert.match(html, /roverResultUnread/);
  assert.match(html, /Rare Discovery!/);
  assert.match(html, /Return to Earth/);
  assert.match(html, /MissionControlModule/);
  assert.match(html, /DISCOVERIES/);
  assert.match(html, /PHOTOS/);
  assert.match(html, /STATUS/);
});

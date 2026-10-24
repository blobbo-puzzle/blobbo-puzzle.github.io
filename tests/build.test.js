import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { LEVELS, CHAPTERS } from '../src/levels.js';
import { CHALLENGE_LEVELS } from '../src/challenges.js';

const project = fileURLToPath(new URL('../', import.meta.url));
execFileSync(process.execPath, ['scripts/build.mjs'], { cwd: project, stdio: 'pipe' });
const html = await readFile(new URL('../release/Blobbo.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)];

test('the offline edition contains one complete, parseable game script', () => {
  assert.equal(scripts.length, 1);
  assert.doesNotMatch(scripts[0][1], /\bsrc\s*=/i);
  const script = scripts[0][2];
  assert.doesNotMatch(script, /^\s*(?:import|export)\s/m);
  assert.doesNotThrow(() => new vm.Script(script, { filename: 'Blobbo.html' }));
});

test('the offline edition embeds its styles, icon, and runtime dependencies', () => {
  assert.ok(styles.length > 0);
  for (const [, css] of styles) {
    assert.doesNotMatch(css, /@import\b/i);
    for (const [, url] of css.matchAll(/url\(\s*['"]?([^)'"\s]+)/gi)) {
      assert.ok(url.startsWith('data:') || url.startsWith('#'), `External CSS resource: ${url}`);
    }
  }
  assert.doesNotMatch(html, /<link\b[^>]*rel=["'](?:stylesheet|preload|modulepreload)["']/i);
  assert.match(html, /rel="icon" href="data:image\/svg\+xml,/);
  // Reference hyperlinks may remain online; assets needed to play may not.
  for (const [, tag, source] of html.matchAll(/<(script|img|audio|video|source|iframe)\b[^>]*\bsrc=["']([^"']+)["']/gi)) {
    assert.ok(source.startsWith('data:'), `${tag} requires an external asset: ${source}`);
  }
  assert.doesNotMatch(scripts[0][2], /\b(?:fetch|import)\s*\(|\bXMLHttpRequest\b|\bWebSocket\b/);
});

test('offline edition includes exactly the Regular and Extra hard room collections', () => {
  const script = scripts[0][2];
  for (const chapter of CHAPTERS) assert.ok(script.includes(chapter.name));
  for (const level of [...LEVELS, ...CHALLENGE_LEVELS]) assert.ok(script.includes(level.name), `Missing room: ${level.id}`);
  assert.match(html, /value="regular">Regular/);
  assert.match(html, /value="challenge">Extra hard/);
  assert.doesNotMatch(html, /value="(?:practice|campaign)"/);
  assert.doesNotMatch(script, /Clockwise Clearing|PRACTICE_LEVELS|CAMPAIGN_ROOMS/);
});

test('all built-in solutions and walkthroughs stay outside the browser bundle', async () => {
  for (const group of ['regular', 'challenge']) {
    const keys = JSON.parse(await readFile(new URL(`./fixtures/${group}-solutions.json`, import.meta.url), 'utf8'));
    for (const [id, key] of Object.entries(keys)) {
      assert.ok(!scripts[0][2].includes(key.solution), `Leaked solution: ${id}`);
      for (const line of key.plan) assert.ok(!scripts[0][2].includes(line), `Leaked walkthrough: ${id}`);
    }
  }
});

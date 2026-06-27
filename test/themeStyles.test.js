import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const stylesheet = readFileSync(new URL('../src/styles/input.css', import.meta.url), 'utf8');

test('app shell has light and dark page backgrounds', () => {
  assert.match(stylesheet, /html,\s*body,\s*#app/);
  assert.match(stylesheet, /min-height:\s*100%/);
  assert.match(stylesheet, /#app\s*{[\s\S]*min-height:\s*100vh/);
  assert.match(stylesheet, /html\.dark #app\s*{[\s\S]*background-color:\s*#020617/);
});

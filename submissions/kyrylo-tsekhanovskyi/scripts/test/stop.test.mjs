import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sidesToCheck } from '../lib/stop.mjs';

const both = { be: true, fe: true };

test('a maker subagent is checked only on its own side', () => {
  assert.deepEqual(sidesToCheck('be-maker', both), ['be']);
  assert.deepEqual(sidesToCheck('fe-maker', both), ['fe']);
});

test('a maker with no changes on its side is not checked', () => {
  assert.deepEqual(sidesToCheck('be-maker', { be: false, fe: true }), []);
});

test('the main session and other agents are checked on every changed side', () => {
  assert.deepEqual(sidesToCheck(null, both), ['be', 'fe']);
  assert.deepEqual(sidesToCheck('Explore', { be: false, fe: true }), ['fe']);
});

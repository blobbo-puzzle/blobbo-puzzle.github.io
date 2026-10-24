import test from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS } from './fixtures/legacy-levels.js';
import { CAMPAIGN_ORDER, LEGACY_CAMPAIGN_ORDER, campaignIndex } from './fixtures/legacy-campaign.js';
import { auditLevel, replay, shortenWitness } from '../scripts/audit-levels.mjs';

test('every old campaign room appears exactly once in the new order', () => {
  assert.deepEqual([...CAMPAIGN_ORDER].sort(), [...LEGACY_CAMPAIGN_ORDER].sort());
  assert.deepEqual(LEVELS.map(level => level.id), CAMPAIGN_ORDER);
});

test('reordering preserves the current room in every legacy campaign save', () => {
  for (const [index, id] of LEGACY_CAMPAIGN_ORDER.entries()) {
    assert.equal(LEVELS[campaignIndex({campaignCurrent: index}, LEVELS)].id, id);
  }
  assert.equal(campaignIndex({}, LEVELS), 0);
  assert.equal(campaignIndex({campaignCurrent: -1}, LEVELS), 0);
  assert.equal(campaignIndex({campaignCurrent: 1000}, LEVELS), 0);
});

test('a stable saved room ID takes precedence over its obsolete position', () => {
  for (const level of LEVELS) {
    assert.equal(LEVELS[campaignIndex({campaignRoomId: level.id, campaignCurrent: 0}, LEVELS)].id, level.id);
  }
});

test('the audit rejects blocked and incomplete witnesses and removes a redundant excursion', () => {
  const level = {id: 'audit-fixture', name: 'Audit fixture', rows: ['#######','#@.$.E#','#######'], solution: 'RLRRRR'};
  assert.equal(replay(level, 'L'), null);
  assert.throws(() => auditLevel({...level, solution: 'R'}, 'fixture'));
  assert.throws(() => auditLevel({...level, solution: 'LRRRR'}, 'fixture'));
  const route = shortenWitness(level);
  assert.equal(route, 'RRRR');
  assert.equal(replay(level, route).state.status, 'won');
});

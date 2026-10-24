import {generateLevel} from '../src/levels.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { PRACTICE_CHAPTERS as CHAPTERS, PRACTICE_LEVELS as LEVELS, CHAPTERS as CAMPAIGN_CHAPTERS, LEVELS as CAMPAIGN_LEVELS } from './fixtures/legacy-levels.js';
import { createState, step, validateLevel, solveLevel, stateKey } from '../src/engine.js';

function replay(level, actions = level.solution) {
  let state = createState(level);
  const events = [];
  for (const [index, action] of [...actions].entries()) {
    const next = step(state, action);
    assert.notEqual(next.status, 'dead', `${level.id}, move ${index + 1}: ${next.message}`);
    assert.equal(next.moves, state.moves + 1, `${level.id}, move ${index + 1} is blocked`);
    events.push(...next.events);
    state = next;
  }
  return { state, events };
}

test('the original 24 practice rooms remain intact beside labeled prototype experiments', () => {
  const originals = LEVELS.filter(level => /^\d{2}$/.test(level.id));
  const originalChapters = CHAPTERS.filter(chapter => chapter.id !== 'prototype-water');
  assert.equal(originals.length, 24);
  assert.equal(originalChapters.length, 6);
  assert.equal(new Set(LEVELS.map(level => level.id)).size, LEVELS.length);
  assert.equal(new Set(LEVELS.map(level => level.rows.join('\n'))).size, LEVELS.length);
  for (const chapter of originalChapters) {
    assert.equal(originals.filter(level => level.chapter === chapter.id).length, 4, chapter.name);
  }
  for (const level of LEVELS) {
    assert.ok(CHAPTERS.some(chapter => chapter.id === level.chapter));
    assert.ok(level.name && level.description && level.hint);
  }
  const experiments = LEVELS.filter(level => level.chapter === 'prototype-water');
  assert.equal(experiments.length, 2);
  for (const level of experiments) {
    assert.equal(level.prototype, true);
    assert.match(level.description, /^Prototype water rule:/);
  }
});

for (const level of LEVELS) {
  test(`practice ${level.id}: ${level.name} has a working saved solution`, () => {
    const validation = validateLevel(level);
    assert.deepEqual(validation.errors, []);
    assert.deepEqual(validation.warnings, []);
    assert.match(level.solution, /^[UDLRWX]+$/);
    const before = JSON.stringify(level);
    const { state } = replay(level);
    assert.equal(state.status, 'won');
    assert.equal(state.collected, state.total);
    assert.equal(JSON.stringify(level), before, 'playing must preserve the saved map');
  });
}

test('the key teaching rooms exercise their advertised mechanic', () => {
  const expected = {
    '05': ['fall:O'],
    '06': ['push:O'],
    '07': ['fall:O'],
    '08': ['push:O', 'splash:O'],
    '09': ['arrow:>'],
    '10': ['push:>'],
    '11': ['arrow:>'],
    '12': ['arrow:>', 'fall:O'],
    '13': ['push:M', 'splash:M'],
    '14': ['push:M'],
    '15': ['push:M', 'splash:M'],
    '16': ['push:M'],
    '17': ['grow:'],
    '18': ['tool:S'],
    '19': ['tool:A', 'sail:'],
    '20': ['tool:S', 'drop:S', 'tool:A', 'sail:'],
    '21': ['splash:C'],
    '22': ['tool:K'],
    '23': ['tool:S', 'drop:S', 'splash:C', 'tool:K'],
    '24': ['tool:S', 'splash:M', 'tool:A', 'sail:', 'tool:K', 'splash:C'],
  };
  for (const [id, mechanics] of Object.entries(expected)) {
    const level = LEVELS.find(candidate => candidate.id === id);
    const { events } = replay(level);
    const seen = new Set(events.map(event => `${event.type}:${event.tile ?? ''}`));
    for (const mechanic of mechanics) assert.ok(seen.has(mechanic), `${id} should use ${mechanic}`);
  }
});

test('the under-ball lesson requires a sideways departure', () => {
  const level = LEVELS.find(candidate => candidate.id === '05');
  const { state } = replay(level, 'RRRU');
  assert.equal(state.collected, 1);
  assert.equal(step(state, 'D').status, 'dead');
  assert.equal(step(state, 'R').status, 'playing');
});

test('the saving-turn ramp keeps the remote chest pocket recoverable', () => {
  const level = LEVELS.find(candidate => candidate.id === '11');
  const { events } = replay(level);
  assert.ok(events.some(event => event.type === 'arrow' &&
    event.to.x === event.from.x + 1 && event.to.y === event.from.y + 1),
  'the ramp should shift a rightward arrow diagonally, preserving its direction');
  const withoutRamp = { ...level, rows: level.rows.map(row => row.replace('\\', '.')) };
  assert.equal(solveLevel(withoutRamp, { maxStates: 1000 }).solved, false);
});

test('the garden lesson can seal its own route if approached too early', () => {
  const level = LEVELS.find(candidate => candidate.id === '17');
  let state = createState(level);
  state = step(state, 'L');
  state = step(state, 'L');
  assert.equal(state.tiles[3][3], 'P');
  assert.equal(step(state, 'L').moves, state.moves, 'the new vine blocks the only crossing');
});

test('generated maps reproduce the same seed exactly and differ across seeds', () => {
  assert.deepEqual(generateLevel('garden-party'), generateLevel('garden-party'));
  assert.deepEqual(generateLevel(0), generateLevel(0));
  assert.notDeepEqual(generateLevel('garden-party').rows, generateLevel('toy-cupboard').rows);
  assert.equal(generateLevel('saved seed').generator.seed, 'saved seed');
});

test('100 generated mazes are valid, connected, and replay to a win', () => {
  const layouts = new Set();
  for (let seed = 0; seed < 100; seed++) {
    const level = generateLevel(seed);
    assert.equal(validateLevel(level).valid, true, `seed ${seed}`);
    assert.equal(level.rows.length, 13);
    assert.ok(level.rows.every(row => row.length === 17));
    const { state } = replay(level);
    assert.equal(state.status, 'won', `seed ${seed}`);
    assert.ok(state.total >= 3, `seed ${seed} needs several treasures`);
    assert.ok(level.solution.length < 400, `seed ${seed} should remain a small maze`);
    layouts.add(level.rows.join('\n'));
  }
  assert.equal(layouts.size, 100);
});

test('generated rooms survive JSON export/import without losing their solution', () => {
  const original = generateLevel('october picnic');
  const restored = JSON.parse(JSON.stringify(original));
  assert.equal(replay(restored).state.status, 'won');
  assert.deepEqual(restored.generator, original.generator);
});

// Campaign size remains open-ended; only verified candidates are included.
test('campaign IDs, chapters, and design notes remain separate from practice', () => {
  assert.ok(CAMPAIGN_LEVELS.length > 0);
  const ids = new Set(LEVELS.map(level => level.id)), layouts = new Set();
  for (const level of CAMPAIGN_LEVELS) {
    assert.match(level.id, /^campaign-\d+$/);
    assert.ok(!ids.has(level.id), `Duplicate room ID: ${level.id}`); ids.add(level.id);
    assert.ok(CAMPAIGN_CHAPTERS.some(chapter => chapter.id === level.chapter));
    assert.ok(level.description && level.hint && level.synopsis && level.difficulty);
    assert.ok(level.design?.counterfactual || level.design?.counterfactuals,
      `${level.name} needs a documented consequential choice`);
    const layout = level.rows.join('\n');
    assert.ok(!layouts.has(layout), 'Campaign rooms must have distinct layouts'); layouts.add(layout);
  }
  for (const chapter of CAMPAIGN_CHAPTERS) assert.ok(CAMPAIGN_LEVELS.some(level => level.chapter === chapter.id));
});

for (const level of CAMPAIGN_LEVELS) {
  test(`campaign ${level.id}: ${level.name} replays every saved move to completion`, () => {
    assert.deepEqual(validateLevel(level).errors, []);
    assert.match(level.solution, /^[UDLRWX]+$/);
    const before = JSON.stringify(level), { state, events } = replay(level);
    assert.equal(state.status, 'won'); assert.equal(state.collected, state.total);
    assert.equal(JSON.stringify(level), before);
    assert.equal(level.prototype, undefined);
    // Launching a canoe preserves water; sinking another object fills it.
    for (const event of events.filter(event => event.type === 'splash' && event.tile !== 'B')) {
      assert.notEqual(level.rows[event.to.y][event.to.x], '~',
        `${level.name} must not rely on the prototype water-filling rule`);
    }
    for (const mechanic of level.design?.mechanics ?? []) {
      const used = mechanic.startsWith('gate:') ? events.some(event => event.type === 'move' &&
        level.rows[event.to.y][event.to.x] === mechanic.at(-1)) :
        events.some(event => `${event.type}:${event.tile ?? ''}` === mechanic);
      assert.ok(used,
        `${level.name} no longer exercises ${mechanic}`);
    }
  });
}

function canReach(start, target) {
  const queue = [start], seen = new Set([stateKey(start)]);
  for (let i = 0; i < queue.length; i++) {
    if (target(queue[i])) return true;
    for (const action of 'UDLRWX') {
      const next = step(queue[i], action);
      if (next.status === 'dead' || next.moves === queue[i].moves) continue;
      const key = stateKey(next); if (seen.has(key)) continue;
      seen.add(key); queue.push(next);
      assert.ok(seen.size < 30000, 'The dead-end proof must exhaust its state space');
    }
  }
  return false;
}

for (const level of CAMPAIGN_LEVELS) {
  for (const proof of [level.design?.counterfactual, level.design?.additionalCounterfactual]) {
    if (!proof || proof.solvedAfterMistake !== false) continue;
    test(`${level.name}: the documented premature commitment has no recovery`, () => {
      const { state } = replay(level, proof.prefix);
      assert.equal(state.status, 'playing', 'The trap is a live dead end, not instant death');
      assert.equal(canReach(state, candidate => candidate.status === 'won'), false);
    });
  }
}

test('the counterweight changes the same shared gateway several times', () => {
  const level = CAMPAIGN_LEVELS.find(level => level.name === 'The counterweight');
  const { events } = replay(level);
  const eventAt = (type, tile, x, y) => events.findIndex(event =>
    event.type === type && event.tile === tile && event.to?.x === x && event.to?.y === y);
  const caught = eventAt('fall', 'O', 8, 9), staged = eventAt('push', 'O', 9, 9);
  const parked = eventAt('push', '>', 8, 10), reused = eventAt('fall', 'O', 12, 13);
  assert.ok(caught >= 0 && staged > caught && parked > staged && reused > parked);
  const { state } = replay(level, level.design.counterfactual.prefix);
  assert.equal(state.tiles[9][13], '>'); assert.equal(state.tiles[9][14], '$');
  for (const x of [13, 14]) { assert.equal(state.tiles[8][x], '#'); assert.equal(state.tiles[10][x], '#'); }
  // Even granting access to its far side, the chest offers no safe exit.
  state.player = { x: 15, y: 9, onBoat: false };
  const collected = step(state, 'L');
  assert.equal(collected.status, 'playing'); assert.equal(step(collected, 'R').status, 'dead');
  for (const action of ['U', 'D', 'L']) assert.equal(step(collected, action).moves, collected.moves);
});

test('the island exchange requires tool returns and preserves the canoe parking trap', () => {
  const level = CAMPAIGN_LEVELS.find(level => level.name === 'The island exchange');
  const { events } = replay(level);
  for (const tile of ['S', 'K']) assert.equal(events.filter(event => event.type === 'pickup' && event.tile === tile).length, 2);
  assert.equal(events.filter(event => event.type === 'tool' && event.tile === 'K').length, 3);
  const { state } = replay(level, level.design.counterfactual.prefix);
  assert.equal(state.tiles[12][14], 'B'); assert.equal(state.tiles[11][14], '#');
  assert.equal(state.tiles[13][14], '#'); assert.equal(state.tiles[12][15], 'p');
  // Grant every tool and free water access. The wrongly parked canoe still
  // separates its far-side pushing square and three chests from every shore.
  const queue = [state.player], seen = new Set([`${state.player.x},${state.player.y}`]);
  for (let i = 0; i < queue.length; i++) {
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const next = { x: queue[i].x + dx, y: queue[i].y + dy }, key = `${next.x},${next.y}`;
      if (seen.has(key) || ['#', 'B'].includes(state.tiles[next.y]?.[next.x] ?? '#')) continue;
      seen.add(key); queue.push(next);
    }
  }
  assert.ok(!seen.has('15,12'));
  for (const chest of level.design.counterfactual.unreachableChests) {
    assert.equal(state.tiles[chest.y][chest.x], '$'); assert.ok(!seen.has(`${chest.x},${chest.y}`));
  }
});

test('Clockwise Clearing cannot recover its shared gate after the wrong releases', () => {
  const level = CAMPAIGN_LEVELS.find(level => level.name === 'Clockwise Clearing');
  const proof = level.design.counterfactuals.gate, { state } = replay(level, proof.prefix);
  assert.equal(canReach(state, candidate => candidate.player.x === proof.attemptTarget[0] &&
    candidate.player.y === proof.attemptTarget[1]), false);
  const { state: nook } = replay(level, level.design.counterfactuals.nook.prefix);
  assert.equal(nook.tiles[2][9], '$'); assert.equal(nook.tiles[3][9], '>');
  for (const [x, y] of [[8, 2], [10, 2], [9, 1], [10, 3]]) assert.equal(nook.tiles[y][x], '#');
});

function assertCells(state, cells) {
  for (const [x, y, tile] of cells) assert.equal(state.tiles[y][x], tile, `Expected ${tile} at ${x},${y}`);
}

test('the double closing has three remote locks behind its single release', () => {
  const level = CAMPAIGN_LEVELS.find(level => level.name === 'The double closing');
  for (const [index, proof] of level.design.counterfactuals.entries()) {
    const { state } = replay(level, proof.prefix);
    assertCells(state, [[15,5,'>'],[15,6,'$'],[14,6,'#'],[16,6,'#'],[15,7,'#']]);
    if (index === 0) {
      assertCells(state, [[6,11,'O'],[5,11,'#'],[7,11,'#'],[6,12,'r'],
        [1,7,'<'],[1,6,'$'],[0,6,'#'],[2,6,'#'],[1,5,'#']]);
    }
  }
});

test('the freight door arrows can permanently seal two separate destinations', () => {
  const level = CAMPAIGN_LEVELS.find(level => level.name === 'The Freight Door');
  const { state: exit } = replay(level, level.design.counterfactuals.exit.prefix);
  assertCells(exit, [[19,8,'>'],[19,9,'E'],[18,9,'#'],[20,9,'#'],[19,10,'#']]);
  const { state: nook } = replay(level, level.design.counterfactuals.nook.prefix);
  assertCells(nook, [[1,12,'<'],[1,13,'$'],[0,13,'#'],[2,13,'#'],[1,14,'#']]);
});

test('the living shield must preserve access to its own shears before being cut', () => {
  const level = CAMPAIGN_LEVELS.find(level => level.name === 'The living shield');
  const held = level.design.milestones.find(m => m.label === 'Arrow held against the living shield');
  const { state: shield } = replay(level, level.solution.slice(0, held.move));
  assertCells(shield, [[6,6,'p'],[7,6,'<'],[1,4,'S']]);
  const { state: trapped } = replay(level, level.design.counterfactual.prefix);
  assertCells(trapped, [[2,6,'<'],[2,5,'#'],[2,7,'#'],[1,6,'$'],[1,4,'S']]);
  const { events } = replay(level);
  const pickup = events.findIndex(e => e.type === 'pickup' && e.tile === 'S');
  const recut = events.findIndex(e => e.type === 'arrow' && e.from.x === 7 && e.from.y === 6);
  assert.ok(pickup >= 0 && recut > pickup, 'The same arrow launches again only after retrieving shears');
});

test('the cork depot reuses its arrow stop only after repairing the delivery route', () => {
  const level = CAMPAIGN_LEVELS.find(level => level.name === 'The cork depot');
  const { events } = replay(level);
  const plugs = events.filter(e => e.type === 'splash' && e.tile === 'C');
  assert.deepEqual(plugs.map(e => [e.to.x,e.to.y]), [[7,8],[12,11]]);
  const { state } = replay(level, level.design.counterfactual.prefix);
  assertCells(state, [[12,6,'>'],[12,5,'\\'],[12,7,'d'],[13,6,'$'],[14,6,'$'],[14,7,'$'],
    [13,5,'#'],[13,7,'#'],[14,5,'#'],[15,6,'#'],[15,7,'#'],[14,8,'#']]);
});

test('the tool relay exchanges two tools as successive stops for the same arrow', () => {
  const level = CAMPAIGN_LEVELS.find(level => level.name === 'The tool relay');
  const first = level.design.milestones[0], second = level.design.milestones[1];
  assertCells(replay(level, level.solution.slice(0, first.move)).state, [[7,5,'>'],[8,5,'S']]);
  assertCells(replay(level, level.solution.slice(0, second.move)).state, [[8,5,'>'],[9,5,'K']]);
  const { state } = replay(level, level.design.counterfactual.prefix);
  assertCells(state, [[13,5,'>'],[13,4,'#'],[13,6,'#'],[14,5,'$'],[14,4,'#'],[14,6,'#']]);
  state.player = { x: 15, y: 5, onBoat: false };
  const trapped = step(state, 'L'); assert.equal(trapped.status, 'playing');
  assert.equal(step(trapped, 'R').status, 'dead');
});

test('Reed Channels closes a direct approach but preserves water after shearing', () => {
  const level = CAMPAIGN_LEVELS.find(level => level.name === 'Reed Channels');
  const proof = level.design.counterfactuals.closedChannel;
  const { state } = replay(level, proof.prefix);
  assert.equal(state.player.onBoat, true);
  assert.equal(step(state, proof.blockedAction).moves, state.moves);
  assert.match(state.tiles[proof.vine[1]][proof.vine[0]], /^[PQNVp]$/);
  let current = createState(level), cutWater = false;
  for (const action of level.solution) {
    const next = step(current, action);
    assert.ok(!next.events.some(e => e.type === 'splash'), 'The canoe route must not consume objects as bridges');
    for (const [key, underlay] of Object.entries(current.underlays)) {
      if (underlay !== '~' || key in next.underlays) continue;
      const [x,y] = key.split(',').map(Number);
      if (['~','b'].includes(next.tiles[y][x])) cutWater = true;
    }
    current = next;
  }
  assert.ok(cutWater, 'At least one cut water vine must reveal water, not floor');
  assert.equal(current.status, 'won');
});

test('the green jack catches the ball high enough to transfer, then removes its living support', () => {
  const level = CAMPAIGN_LEVELS.find(level => level.name === 'The green jack');
  const { events } = replay(level);
  assert.ok(events.some(e => e.type === 'push' && e.tile === 'O' && e.from.x === 8 && e.from.y === 3));
  assert.ok(events.some(e => e.type === 'fall' && e.tile === 'O' && e.to.x === 9 && e.to.y === 7));
  const { state } = replay(level, level.design.counterfactual.prefix);
  assertCells(state, [[8,12,'O'],[8,13,'$'],[8,14,'E'],[9,12,'#'],[7,13,'#'],[9,13,'#']]);
  // The only downward move for the ball is occupied by the uncollectable chest.
  for (const y of [9,10,11,12,13]) assert.equal(state.tiles[y][9], '#');
});

test('the stack switch keeps one chest as support through delivery and arrow release', () => {
  const level = CAMPAIGN_LEVELS.find(level => level.name === 'The stack switch');
  const full = level.design.milestones.find(m => m.label === 'Stack raised into the arrow lane');
  const { state: tower } = replay(level, level.solution.slice(0, full.move));
  for (const y of [5,6,7,8,9]) assert.equal(tower.tiles[y][8], 'O');
  assert.equal(tower.tiles[10][8], '$');
  const { events } = replay(level);
  assert.ok(events.some(e => e.type === 'arrow' && e.from.x === 7 && e.from.y === 5 && e.to.x === 8 && e.to.y === 4));
  const { state: low } = replay(level, level.design.counterfactual.prefix);
  assertCells(low, [[14,5,'>'],[14,6,'E'],[14,4,'#'],[13,6,'#'],[15,6,'#'],[14,7,'#']]);
  const { state: jam } = replay(level, level.design.additionalCounterfactual.prefix);
  for (const x of [10,11,12]) assertCells(jam, [[x,5,'O'],[x,6,'#']]);
});

for (const level of CAMPAIGN_LEVELS.filter(l => Array.isArray(l.design?.checkpoints))) {
  test(`${level.name}: the saved route performs each documented role change`, () => {
    for (const checkpoint of level.design.checkpoints) {
      assertCells(replay(level, level.solution.slice(0, checkpoint.moves)).state, checkpoint.tiles);
    }
    for (const proof of level.design.counterfactuals) {
      let state = createState(level);
      for (const action of proof.prefix) state = step(state, action);
      assert.equal(state.status, proof.expectedStatus);
      if (proof.expectedStatus === 'dead') assert.ok(state.events.some(e => e.type === 'dead' && e.cause === proof.cause));
      if (proof.tiles) assertCells(state, proof.tiles);
    }
  });
}

test('Opposing Traffic changes which return squares are safe after removing support', () => {
  const level = CAMPAIGN_LEVELS.find(level => level.name === 'Opposing Traffic');
  const death = level.design.counterfactuals.exposedReturn;
  const exposed = step(replay(level, death.prefix).state, death.action);
  assert.equal(exposed.status, 'dead'); assert.ok(exposed.events.some(e => e.type === 'dead' && e.cause === 'spike'));
  const blocked = level.design.counterfactuals.prematureShield;
  const { state } = replay(level, blocked.prefix);
  assert.equal(step(state, blocked.action).moves, state.moves);
});

test('the ball causeway prepares both the buried chest and the final arrow stop', () => {
  const level = CAMPAIGN_LEVELS.find(level => level.name === 'The Ball Causeway');
  const { state: loaded } = replay(level, level.solution.slice(0, 86));
  for (const y of [10, 11, 12, 13]) assert.equal(loaded.tiles[y][9], 'O');
  assert.equal(loaded.tiles[10][10], 'O', 'The fifth ball must roll beside the stack');
  const { events } = replay(level);
  assert.ok(events.some(e => e.type === 'fall' && e.from.x === 9 && e.from.y === 9 &&
    e.to.x === 10 && e.to.y === 10));
  assert.ok(events.some(e => e.type === 'arrow' && e.to.x === 11 && e.to.y === 10));
  const { state: shaft } = replay(level, level.design.counterfactuals.shaft.prefix);
  assertCells(shaft, [[9,12,'O'],[9,13,'$'],[8,12,'#'],[10,12,'#'],
    [8,13,'#'],[10,13,'#'],[9,14,'#']]);
  const { state: exit } = replay(level, level.design.counterfactuals.exit.prefix);
  assertCells(exit, [[1,10,'<'],[1,11,'E'],[0,11,'#'],[2,11,'#'],[1,12,'#']]);
});

test('the escapement transfers support between an arrow, a chest, and two balls', () => {
  const level = CAMPAIGN_LEVELS.find(level => level.name === 'The Escapement');
  const { state: supported } = replay(level, level.solution.slice(0, 32));
  assertCells(supported, [[2,9,'O'],[2,10,'$'],[14,3,'O'],[14,4,'>']]);
  const { state: reused } = replay(level, level.solution.slice(0, 161));
  assertCells(reused, [[16,11,'O'],[17,11,'<']]);
  const { state: nook } = replay(level, level.design.counterfactuals.rightAlcove.prefix);
  assertCells(nook, [[19,5,'>'],[19,6,'$'],[18,6,'#'],[20,6,'#'],[19,7,'#']]);
  for (const [key, tile] of [['blockedExit','O'], ['earlyLowerArrow','<']]) {
    const { state: exit } = replay(level, level.design.counterfactuals[key].prefix);
    assertCells(exit, [[4,11,tile],[3,11,'#'],[4,12,'E'],[3,12,'#'],[5,12,'#'],[4,13,'#']]);
  }
});

test('the borrowed shield recovers its cork after the ball takes over protection', () => {
  const level = CAMPAIGN_LEVELS.find(level => level.name === 'The borrowed shield');
  const caught = level.design.milestones.find(m => m.label === 'Upper ball diverted into the spike line');
  const { state: shield } = replay(level, level.solution.slice(0, caught.move));
  assertCells(shield, [[10,6,'C'],[11,7,'O'],[12,12,'O'],[10,12,'!'],[7,10,'h']]);
  const { events } = replay(level);
  const plugs = events.filter(e => e.type === 'splash');
  assert.deepEqual(plugs.map(e => [e.tile,e.to.x,e.to.y]), [['C',7,10]]);
  const { state: lost } = replay(level, level.design.counterfactual.prefix);
  assertCells(lost, [[10,7,'h'],[11,7,'O'],[12,12,'.'],[10,12,'!']]);
});

test('the shutters permanently close the marshmallow delivery lane after early release', () => {
  const level = CAMPAIGN_LEVELS.find(level => level.name === 'Before the shutters fall');
  const { state } = replay(level, level.design.counterfactuals[0].prefix);
  assertCells(state, [[4,8,'M'],[7,8,'O'],[8,8,'O'],[7,9,'#'],[8,9,'#'],
    [12,3,'#'],[14,3,'#'],[15,6,'<'],[15,7,'#']]);
  // Both balls support each other against lateral pushing. Their floors prevent
  // downward pushing, and a ball can never be pushed upward.
  for (const [x, action] of [[6,'R'],[9,'L']]) {
    state.player = { x, y: 8, onBoat: false };
    assert.equal(step(state, action).moves, state.moves);
  }
});

test('the living railway leaves no route around the arrow-pinned exit plant', () => {
  const level = CAMPAIGN_LEVELS.find(level => level.name === 'A living railway');
  const early = level.design.counterfactuals.find(proof => proof.tiles.some(([x,y,tile]) =>
    x === 14 && y === 9 && tile === '>'));
  const { state } = replay(level, early.prefix);
  assertCells(state, [[14,9,'>'],[15,9,'N'],[16,9,'E'],[15,8,'#'],[15,10,'#'],[16,8,'#'],[16,10,'#']]);
});

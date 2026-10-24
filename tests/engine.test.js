import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, step, solveLevel, validateLevel, stateKey, TILE_INFO } from '../src/engine.js';

const level = rows => ({ id: 'test', name: 'Test room', rows });
const start = rows => createState(level(rows));
const play = (state, actions) => [...actions].reduce((current, action) => step(current, action), state);

test('level validation catches malformed maps and accepts multiple original-style stairs', () => {
  assert.equal(validateLevel(level(['###', '#@#', '###'])).valid, false);
  assert.equal(validateLevel(level(['####', '#@@E#', '####'])).valid, false);
  assert.equal(validateLevel(level(['#####', '#@?E#', '#####'])).valid, false);
  assert.equal(validateLevel(level(['#####', '#@EE#', '#####'])).valid, true);
  assert.equal(new Set(TILE_INFO.map(tile => tile.id)).size, TILE_INFO.length);
});

test('step leaves its input untouched, collects chests and opens the exit', () => {
  const initial = start(['######', '#@$E.#', '######']);
  const snapshot = JSON.stringify(initial);
  const collected = step(initial, 'R');
  assert.equal(JSON.stringify(initial), snapshot);
  assert.equal(collected.collected, 1);
  assert.equal(collected.tiles[1][2], '.');
  assert.equal(step(collected, 'R').status, 'won');
});

test('locked exits and walls do not spend a turn or release hazards', () => {
  const initial = start(['#######', '#@E$O.#', '#.....#', '#######']);
  assert.equal(step(initial, 'R').moves, 0);
  assert.equal(step(initial, 'U').moves, 0);
  assert.equal(step(initial, 'U').tiles[1][4], 'O');
});

const overhead = ['#######', '#..O..#', '#.@$..#', '#.....#', '#.....#', '#....E#', '#######'];

test('original help scenario: collecting a chest under a ball is safe, waiting is safe', () => {
  const under = step(start(overhead), 'R');
  assert.equal(under.status, 'playing');
  assert.equal(under.collected, 1);
  assert.equal(under.tiles[1][3], 'O');
  assert.equal(step(under, 'W').tiles[1][3], 'O');
});

test('original help scenario: moving down from under that ball is fatal', () => {
  const dead = play(start(overhead), 'RD');
  assert.equal(dead.status, 'dead');
  assert.equal(dead.events.at(-1).cause, 'ball');
});

test('departing sideways releases a ball all the way to the floor', () => {
  const escaped = play(start(overhead), 'RR');
  assert.equal(escaped.status, 'playing');
  assert.equal(escaped.tiles[5][3], 'O');
  assert.equal(escaped.tiles[1][3], '.');
});

test('arrows stay safe when adjacent, then launch to rest after perpendicular departure', () => {
  const initial = start(['########', '#......#', '#.>@...#', '#.....E#', '########']);
  assert.equal(step(initial, 'W').tiles[2][2], '>');
  const escaped = step(initial, 'U');
  assert.equal(escaped.status, 'playing');
  assert.equal(escaped.tiles[2][6], '>');
  assert.equal(step(initial, 'R').status, 'dead');
});

test('a perpendicular push releases an arrow immediately, while shaft pushes are blocked', () => {
  const initial = start(['#######', '#..@..#', '#..>..#', '#.....#', '#....E#', '#######']);
  const pushed = step(initial, 'D');
  assert.equal(pushed.player.y, 2);
  assert.equal(pushed.tiles[3][5], '>');
  assert.ok(pushed.events.some(event => event.type === 'arrow'));
  const blocked = step(start(['#######', '#@>..E#', '#######']), 'R');
  assert.equal(blocked.moves, 0);
});

test('a ball pushed into water makes a traversable stepping stone', () => {
  const pushed = step(start(['#######', '#@O~$E#', '#######']), 'R');
  assert.equal(pushed.tiles[1][3], '.');
  assert.equal(pushed.player.x, 2);
  assert.equal(play(pushed, 'RRR').status, 'won');
});

test('balls can be pushed downward and launch immediately, but cannot be pushed upward', () => {
  const initial = start(['#######', '#..@..#', '#..O..#', '#.....#', '#.....#', '#....E#', '#######']);
  const snapshot = JSON.stringify(initial);
  const down = step(initial, 'D');
  assert.equal(down.status, 'playing');
  assert.equal(down.player.y, 2);
  assert.equal(down.tiles[5][3], 'O');
  assert.ok(down.events.some(event => event.type === 'push' && event.to.y === 3));
  assert.ok(down.events.some(event => event.type === 'fall' && event.to.y === 5));
  assert.equal(JSON.stringify(initial), snapshot);
  const upward = step(start(['#######', '#.....#', '#..O..#', '#..@.E#', '#######']), 'U');
  assert.equal(upward.moves, 0);
  assert.equal(upward.tiles[2][3], 'O');
});

test('a downward ball push still requires an empty destination and respects solid doors', () => {
  const state = step(start(['#######', '#..@..#', '#..O..#', '#..d.E#', '#######']), 'D');
  assert.equal(state.moves, 0);
  assert.equal(state.tiles[2][3], 'O');
});

test('a ramp shifts an arrow diagonally without changing its facing or being consumed', () => {
  const state = step(start(['#########', '#.......#', '#@.....E#', '#>.../..#', '#########']), 'U');
  assert.equal(state.tiles[2][6], '>');
  assert.equal(state.tiles[3][5], '/');
  assert.ok(state.events.some(event => event.type === 'arrow' && event.from.x === 4 && event.from.y === 3 && event.to.x === 5 && event.to.y === 2));
});

test('a falling ball rolls left off a slash ramp', () => {
  const state = step(start(['#######', '#.@O..#', '#.....#', '#../..#', '#....E#', '#######']), 'L');
  assert.equal(state.tiles[4][2], 'O');
  assert.equal(state.tiles[3][3], '/');
});

test('each horizontal ramp approach preserves arrow facing and shifts to the correct lane', () => {
  for (const [arrow, ramp, rampX, finishX, finishY] of [
    ['>', '/', 4, 5, 2], ['>', '\\', 4, 5, 4],
    ['<', '/', 2, 1, 4], ['<', '\\', 2, 1, 2],
  ]) {
    const rows = ['#######', '#.....#', '#..@..#', '#.....#', '#.....#', '#....E#', '#######'].map(row => [...row]);
    rows[3][3] = arrow; rows[3][rampX] = ramp;
    const state = step(start(rows.map(row => row.join(''))), 'U');
    assert.equal(state.tiles[finishY][finishX], arrow, `${arrow} at ${ramp}`);
    assert.equal(state.tiles[3][rampX], ramp);
  }
});

test('a ramp slide can pass beside the player, but cannot pass through a solid side cell', () => {
  const state = step(start(['########', '#......#', '#@.....#', '#>./...#', '#.....E#', '########']), 'R');
  assert.equal(state.status, 'playing');
  assert.equal(state.tiles[2][6], '>');
  // The player at 2,2 is the clearance cell when the arrow leaves 2,3.
  assert.ok(state.events.some(event => event.type === 'arrow' && event.from.x === 2 && event.from.y === 3 && event.to.x === 3 && event.to.y === 2));
});

test('a player blocks a ball’s rounded left slide so it rolls diagonally right instead', () => {
  const state = step(start(['#######', '#.@O..#', '#.....#', '#..O..#', '#..#.E#', '#######']), 'D');
  assert.equal(state.status, 'playing');
  assert.equal(state.tiles[4][4], 'O');
  assert.equal(state.tiles[2][2], '.');
  assert.ok(state.events.some(event => event.type === 'fall' && event.from.x === 3 && event.from.y === 2 && event.to.x === 4 && event.to.y === 3));
});

test('distant unsupported hazards remain dormant during unrelated moves and waiting', () => {
  const initial = start(['#########', '#@....O.#', '#.......#', '#....>..#', '#......E#', '#########']);
  const state = play(initial, 'RWDW');
  assert.equal(state.tiles[1][6], 'O');
  assert.equal(state.tiles[3][5], '>');
  assert.equal(state.events.filter(event => ['fall', 'arrow'].includes(event.type)).length, 0);
});

test('a diagonal ramp destination occupied by the player prevents launch but a later cell is lethal', () => {
  const initial = start(['########', '#.@....#', '#.>/...#', '#.....E#', '########']);
  const safe = step(initial, 'R');
  assert.equal(safe.status, 'playing');
  assert.equal(safe.tiles[2][2], '>');
  const dead = step(safe, 'R');
  assert.equal(dead.status, 'dead');
  assert.equal(dead.events.at(-1).cause, 'arrow');
});

test('releasing an arrow wakes the ball whose support it vacates', () => {
  const initial = start(['#######', '#..O..#', '#..>$.#', '#...@.#', '#.....#', '#....E#', '#######']);
  const safe = step(initial, 'U');
  assert.equal(safe.collected, 1);
  assert.equal(safe.tiles[1][3], 'O');
  const chain = step(safe, 'D');
  assert.equal(chain.status, 'playing');
  assert.equal(chain.tiles[2][5], '>');
  assert.equal(chain.tiles[5][3], 'O');
  assert.ok(chain.events.findIndex(event => event.type === 'arrow') < chain.events.findIndex(event => event.type === 'fall'));
});

test('ramps require the side-clearance square as well as the diagonal destination', () => {
  const state = step(start(['########', '#......#', '#.@#...#', '#.>./..#', '#.....E#', '########']), 'L');
  // Moving away from above the arrow launches it until the blocked corner.
  assert.equal(state.tiles[3][3], '>');
  assert.equal(state.tiles[3][4], '/');
});

test('an arrow slides above a rounded ball before continuing in its original direction', () => {
  const state = step(start(['#########', '#.@.....#', '#.......#', '#.>.O...#', '#...#..E#', '#########']), 'D');
  const released = step(state, 'U');
  assert.equal(released.status, 'playing');
  assert.equal(released.tiles[2][7], '>');
  assert.ok(released.events.some(event => event.type === 'arrow' && event.from.x === 3 && event.from.y === 3 && event.to.x === 4 && event.to.y === 2));
});

test('optional animation tracing captures movement before hazards and the complete final board', () => {
  const initial = play(start(overhead), 'R');
  const snapshot = JSON.stringify(initial);
  const traced = step(initial, 'R', { trace: true });
  assert.equal(JSON.stringify(initial), snapshot);
  assert.ok(traced.frames.length >= 5);
  assert.deepEqual(traced.frames[0].player, traced.player);
  assert.equal(traced.frames[0].tiles[1][3], 'O');
  assert.deepEqual(traced.frames.at(-1).tiles, traced.tiles);
  assert.deepEqual(traced.frames.at(-1).underlays, traced.underlays);
  assert.equal(traced.frames[0].width, traced.width);
  assert.equal(traced.frames[0].height, traced.height);
  const untraced = step(traced, 'W');
  assert.equal(Object.hasOwn(untraced, 'frames'), false);
  const originalFirstTile = traced.frames[0].tiles[0][0];
  traced.tiles[0][0] = '.';
  assert.equal(traced.frames[0].tiles[0][0], originalFirstTile);
});

test('marshmallows push vertically and remain suspended without gravity', () => {
  const state = step(start(['#######', '#..@..#', '#..M..#', '#.....#', '#....E#', '#######']), 'D');
  assert.equal(state.tiles[3][3], 'M');
  assert.equal(step(state, 'L').tiles[3][3], 'M');
});

test('vines grow one square when aligned, leave stems, and never hurt the player', () => {
  const initial = start(['########', '#......#', '#P...@E#', '########']);
  const grown = play(initial, 'WWWWWW');
  assert.equal(grown.tiles[2][1], 'p');
  assert.equal(grown.tiles[2][4], 'P');
  assert.equal(grown.status, 'playing');
  assert.equal(grown.player.x, 5);
});

test('vines do not grow toward a player hidden by a chest', () => {
  const initial = start(['########', '#......#', '#P.$.@E#', '########']);
  assert.equal(step(initial, 'W').tiles[2][1], 'P');
});

test('vines span water and preserve it under both stems and growing tips', () => {
  const initial = start(['########', '#......#', '#P~~.@E#', '########']);
  const snapshot = JSON.stringify(initial);
  const grown = play(initial, 'WW');
  assert.equal(grown.tiles[2][2], 'p');
  assert.equal(grown.tiles[2][3], 'P');
  assert.deepEqual(grown.underlays, { '2,2': '~', '3,2': '~' });
  assert.equal(JSON.stringify(initial), snapshot);
  assert.notEqual(stateKey(grown), stateKey({ ...grown, underlays: {} }));
});

test('cutting a vine over water restores water instead of making a land bridge', () => {
  let state = start(['########', '#..S...#', '#P~~.@E#', '#......#', '########']);
  state = play(state, 'WW');
  // Reach the tip from the shore above while carrying the shears.
  state = play(state, 'ULLD');
  assert.equal(state.carrying, 'S');
  assert.equal(state.status, 'dead');
  assert.equal(state.tiles[2][3], '~');
  assert.equal(state.underlays['3,2'], undefined);
  assert.equal(state.underlays['2,2'], '~');
});

test('a canoe passenger can shear a water-spanning vine and sail through', () => {
  let state = start(['#########', '#..S....#', '#P~~~.@E#', '#...b...#', '#########']);
  state = play(state, 'WW');
  // Walk around the growing tips, collect shears, then approach by canoe.
  state = play(state, 'ULLLRRDDL');
  assert.equal(state.carrying, 'S');
  assert.equal(state.status, 'playing');
  assert.equal(state.player.x, 4);
  assert.equal(state.player.onBoat, true);
  state = play(state, 'UL');
  assert.equal(state.status, 'playing');
  assert.equal(state.player.x, 3);
  assert.equal(state.player.onBoat, true);
  assert.equal(state.tiles[2][3], 'b');
});

test('shears clear vine stems and tips while held', () => {
  const initial = start(['########', '#@SpP$E#', '########']);
  const won = play(initial, 'RRRRR');
  assert.equal(won.status, 'won');
  assert.equal(won.carrying, 'S');
});

test('only one tool can be carried; dropping uses the last successful movement direction', () => {
  const initial = start(['########', '#@AS..E#', '#......#', '########']);
  const held = step(initial, 'R');
  assert.equal(held.carrying, 'A');
  assert.equal(step(held, 'R').moves, 1);
  const dropped = play(held, 'DRX');
  assert.equal(dropped.carrying, null);
  assert.equal(dropped.tiles[2][4], 'A');
  assert.equal(dropped.inventory.axe, 0);
  assert.equal(step(dropped, 'U').carrying, 'S');
});

test('an extinguisher permits walking through and removing multiple fires', () => {
  const won = play(start(['########', '#@KFF$E#', '########']), 'RRRRR');
  assert.equal(won.status, 'won');
  assert.equal(won.carrying, 'K');
  assert.equal(won.tiles[1][3], '.');
  assert.equal(won.tiles[1][4], '.');
});

test('axe carves a canoe, which launches, carries the player, and remains when disembarking', () => {
  let state = start(['#########', '#@AT~~$E#', '#########']);
  state = play(state, 'RR');
  assert.equal(state.player.x, 2);
  assert.equal(state.tiles[1][3], 'B');
  state = step(state, 'R');
  assert.equal(state.tiles[1][4], 'b');
  state = play(state, 'RR');
  assert.equal(state.player.x, 5);
  assert.equal(state.player.onBoat, true);
  assert.equal(state.tiles[1][4], '~');
  state = play(state, 'RR');
  assert.equal(state.status, 'won');
  assert.equal(state.tiles[1][5], 'b');
  assert.equal(state.player.onBoat, false);
});

test('a cork plugs a hole, whereas a marshmallow disappears without filling it', () => {
  const cork = step(start(['#######', '#@Ch$E#', '#######']), 'R');
  assert.equal(cork.tiles[1][3], '.');
  assert.equal(play(cork, 'RRR').status, 'won');
  const mallow = step(start(['#######', '#@Mh$E#', '#######']), 'R');
  assert.equal(mallow.tiles[1][3], 'h');
  assert.equal(step(mallow, 'R').status, 'dead');
});

test('fire and unprotected water are lethal, terminal states cannot continue', () => {
  for (const hazard of ['F', '~', 'h']) {
    const state = step(start(['######', `#@${hazard}$E#`, '######']), 'R');
    assert.equal(state.status, 'dead');
    assert.equal(step(state, 'R').moves, 1);
  }
});

test('solver produces a replayable solution including an authentic under-ball escape', () => {
  const map = level(overhead);
  const result = solveLevel(map);
  assert.equal(result.solved, true);
  assert.equal(play(createState(map), result.solution).status, 'won');
  assert.ok(result.visited > 0);
});

test('solver solves tool and canoe interactions and reports bounded failures', () => {
  const map = level(['#########', '#@AT~~$E#', '#########']);
  const result = solveLevel(map);
  assert.equal(result.solved, true);
  assert.equal(play(createState(map), result.solution).status, 'won');
  const blocked = solveLevel(level(['#####', '#@#E#', '#####']));
  assert.equal(blocked.solved, false);
  const limited = solveLevel(level(['########', '#@....E#', '#......#', '########']), { maxStates: 2 });
  assert.equal(limited.reason, 'state-limit');
});

test('solver keys ignore move count but preserve held-tool facing for drop puzzles', () => {
  const state = start(['######', '#@A.E#', '######']);
  assert.equal(stateKey(state), stateKey({ ...state, moves: 99 }));
  const held = step(state, 'R');
  assert.notEqual(stateKey(held), stateKey({ ...held, facing: 'L' }));
});

test('one-way floors reject only opposite-direction entry, allowing perpendicular approaches', () => {
  const vectors = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };
  for (const [tile, allowed] of Object.entries({ u: 'U', d: 'D', l: 'L', r: 'R' })) {
    for (const [direction, [dx, dy]] of Object.entries(vectors)) {
      const rows = ['#######', '#....E#', '#.....#', '#.....#', '#.....#', '#######'].map(row => [...row]);
      rows[3][3] = tile;
      rows[3 - dy][3 - dx] = '@';
      const initial = start(rows.map(row => row.join('')));
      const moved = step(initial, direction);
      const [ax, ay] = vectors[allowed];
      const permitted = dx * ax + dy * ay >= 0;
      assert.equal(moved.moves, Number(permitted), `${tile} entered with ${direction}`);
      assert.equal(moved.tiles[3][3], tile);
      if (permitted) {
        assert.deepEqual({ x: moved.player.x, y: moved.player.y }, { x: 3, y: 3 });
        // Leaving the gate has no direction restriction.
        for (const exit of Object.keys(vectors)) assert.equal(step(moved, exit).moves, 2, `${tile} left with ${exit}`);
      }
    }
  }
});

test('one-way floors support hazards and reject pushed objects from every direction', () => {
  for (const object of ['M', 'O', 'C', 'B']) {
    const blocked = step(start(['#######', `#@${object}r.E#`, '#######']), 'R');
    assert.equal(blocked.moves, 0);
  }
  const ball = step(start(['#######', '#.@O..#', '#.....#', '#..d.E#', '#######']), 'L');
  assert.equal(ball.tiles[2][3], 'O');
  assert.equal(ball.tiles[3][3], 'd');
  const arrow = step(start(['########', '#.@....#', '#.>..rE#', '########']), 'L');
  assert.equal(arrow.tiles[2][4], '>');
  assert.equal(arrow.tiles[2][5], 'r');
});

test('a player standing on one-way floor is protected by the floor from released hazards', () => {
  const initial = start(['#######', '#..O..#', '#.@r..#', '#....E#', '#######']);
  const safe = step(initial, 'R');
  assert.equal(safe.status, 'playing');
  assert.equal(safe.tiles[1][3], 'O');
  assert.equal(safe.tiles[2][3], 'r');
  assert.equal(step(safe, 'R').status, 'playing');
});

test('spike traps charge along a clear player row or column after movement', () => {
  for (const [spikeX, spikeY] of [[1, 3], [5, 3], [3, 1], [3, 5]]) {
    const rows = ['#######', '#....E#', '#.....#', '#.....#', '#.....#', '#.....#', '#######'].map(row => [...row]);
    rows[spikeY][spikeX] = '!';
    rows[spikeX === 3 ? 3 : 2][spikeX === 3 ? 2 : 3] = '@';
    const initial = start(rows.map(row => row.join('')));
    const aligned = step(initial, spikeX === 3 ? 'R' : 'D');
    assert.equal(aligned.status, 'dead', `${spikeX},${spikeY}`);
    assert.equal(aligned.events.at(-1).cause, 'spike');
  }
});

test('waiting does not wake spikes, while moving directly beside one is lethal', () => {
  const initial = start(['########', '#......#', '#..@.!.#', '#.....E#', '########']);
  assert.equal(step(initial, 'W').status, 'playing');
  assert.equal(step(initial, 'W').tiles[2][5], '!');
  assert.equal(step(initial, 'U').status, 'playing');
  const dead = step(initial, 'R');
  assert.equal(dead.status, 'dead');
  assert.equal(dead.events.at(-1).cause, 'spike');
});

test('objects and terrain between spike and player block detection', () => {
  for (const shield of ['M', '$', 'O', 'r', '/', 'p', 'F', '~', 'h', 'A']) {
    const state = step(start(['#########', '#@......#', `#...${shield}..!#`, '#......E#', '#########']), 'D');
    assert.equal(state.status, 'playing', shield);
    assert.equal(state.tiles[2][7], '!');
    assert.equal(state.events.some(event => event.type === 'spike'), false);
  }
});

test('moving the final marshmallow out of a spike’s line of sight is fatal', () => {
  const initial = start(['#########', '#...@...#', '#...MM.!#', '#.......#', '#......E#', '#########']);
  const first = step(initial, 'D');
  assert.equal(first.status, 'playing');
  assert.equal(first.tiles[3][4], 'M');
  const exposed = play(first, 'URD');
  assert.equal(exposed.tiles[3][5], 'M');
  assert.equal(exposed.status, 'dead');
  assert.equal(exposed.events.at(-1).cause, 'spike');
});

test('an earlier queued ball can interrupt a spike charge after line-of-sight detection', () => {
  const initial = start(['#########', '#..@O..O#', '#......!#', '#...r...#', '#......E#', '#########']);
  const snapshot = JSON.stringify(initial);
  const state = step(initial, 'D', { trace: true });
  assert.equal(state.status, 'playing');
  assert.equal(state.tiles[2][4], 'O');
  assert.equal(state.tiles[2][5], '!');
  // The spike vacated the upper-right ball's support, but spike movement
  // itself does not participate in ordinary mechanism releases.
  assert.equal(state.tiles[1][7], 'O');
  assert.equal(state.events.filter(event => event.type === 'spike').length, 2);
  assert.ok(state.events.findIndex(event => event.type === 'fall') < state.events.findIndex(event => event.type === 'spike'));
  assert.equal(JSON.stringify(initial), snapshot);
  assert.equal(state.frames[0].tiles[2][7], '!');
  assert.deepEqual(state.frames.at(-1).tiles, state.tiles);
});

test('a gate beneath the player does not prevent an adjacent spike’s impact', () => {
  const state = step(start(['#######', '#..@..#', '#..r.!#', '#....E#', '#######']), 'D');
  assert.equal(state.status, 'dead');
  assert.equal(state.events.at(-1).cause, 'spike');
  assert.equal(state.tiles[2][3], 'r');
});

test('spike traps cannot be pushed and blocked movement does not advance hazards', () => {
  const state = step(start(['######', '#@!.E#', '######']), 'R');
  assert.equal(state.status, 'playing');
  assert.equal(state.moves, 0);
  assert.equal(state.tiles[1][2], '!');
});

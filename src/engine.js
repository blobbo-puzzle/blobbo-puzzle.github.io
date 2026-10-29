/**
 * Pure, deterministic rules for the browser reconstruction.
 *
 * Primary reference: the original Blobbo 1.0.1 in-game Help. In particular,
 * dangers are stable beside Blobbo, but a released danger runs until stopped;
 * moving down away from a ball overhead must therefore be fatal. Launch-to-rest
 * is also visible in original-game footage (qUhcM2zZ6Yg, about 2:54). Local
 * releases, diagonal ramp paths and rounded-object slides follow observed
 * Globbo behavior; this is independently written, not its program code. Vine
 * timing remains a reconstruction choice. Vertical arrows are an extension.
 *
 * Scope choices for this first version: water has no current; launching and
 * boarding a canoe are separate actions; a heavy object sunk into water leaves
 * traversable floor. Those three details are prototype rules awaiting reference
 * verification. Corks filling holes and the one-item carrying limit are directly
 * described in the original help. Umbrellas are deliberately not a game tile.
 */

export const DIRECTIONS = Object.freeze({
  U: { x: 0, y: -1 }, D: { x: 0, y: 1 },
  L: { x: -1, y: 0 }, R: { x: 1, y: 0 },
});
const ARROWS = { '^': 'U', v: 'D', '<': 'L', '>': 'R' };
const ONE_WAY = { u: 'U', d: 'D', l: 'L', r: 'R' };
const PLANTS = { N: 'U', V: 'D', Q: 'L', P: 'R' };
const TOOLS = { A: 'axe', S: 'shears', K: 'extinguisher' };

export const TILE_INFO = [
  { id: '.', label: 'Floor', description: 'An empty square.' },
  { id: '#', label: 'Wall', description: 'A solid wall.' },
  { id: '@', label: 'Blob', description: 'The starting position. A level needs exactly one.' },
  { id: '$', label: 'Toy chest', description: 'Collect every chest before taking the stairs.' },
  { id: 'E', label: 'Stairs', description: 'The exit opens after the last toy chest.' },
  { id: 'O', label: 'Bowling ball', description: 'Falls when nearby movement releases it. Push it sideways or down, never up; stepping down from beneath it is fatal.' },
  { id: '!', label: 'Spike trap', description: 'Charges toward you along a shared row or column. Solid objects can shield you; standing beside it is not safe.' },
  { id: '>', label: 'Right arrow', description: 'Flies right when released. Push it up or down.' },
  { id: '<', label: 'Left arrow', description: 'Flies left when released. Push it up or down.' },
  { id: '^', label: 'Up arrow (extension)', description: 'Editor extension: flies up when released. Push it sideways.' },
  { id: 'v', label: 'Down arrow (extension)', description: 'Editor extension: flies down when released. Push it sideways.' },
  { id: '/', label: 'Left ramp', description: 'Shifts balls down-left and arrows diagonally into the next lane; their facing stays the same.' },
  { id: '\\', label: 'Right ramp', description: 'Shifts balls down-right and arrows diagonally into the next lane; their facing stays the same.' },
  { id: 'M', label: 'Marshmallow', description: 'Push in any direction. It stays where you leave it.' },
  { id: 'F', label: 'Fire', description: 'Deadly to touch.' },
  { id: '~', label: 'Water', description: 'Deadly without a canoe. Heavy objects sink here.' },
  { id: 'P', label: 'Vine →', description: 'While you stand ahead of its tip with only floor between, it grows one square toward you each turn, even when you wait. It never grows onto you; its stem blocks the path. Vines pointing up, down or left work the same way.' },
  { id: 'Q', label: 'Vine ←', description: 'Grows left one square each turn, even when you wait, while you stand ahead of its tip with only floor between.' },
  { id: 'N', label: 'Vine ↑', description: 'Grows up one square each turn, even when you wait, while you stand ahead of its tip with only floor between.' },
  { id: 'V', label: 'Vine ↓', description: 'Grows down one square each turn, even when you wait, while you stand ahead of its tip with only floor between.' },
  { id: 'p', label: 'Vine stem', description: 'A solid part of a creeping vine.' },
  { id: 'A', label: 'Axe', description: 'Carry it into a palm tree to carve a canoe.' },
  { id: 'T', label: 'Palm tree', description: 'An axe can turn this into a canoe.' },
  { id: 'B', label: 'Canoe', description: 'Push into water, then step aboard.' },
  { id: 'b', label: 'Floating canoe', description: 'Step aboard to cross still water. Step onto land to leave it.' },
  { id: 'S', label: 'Hedge shears', description: 'Carry them into vines to cut a path.' },
  { id: 'K', label: 'Extinguisher', description: 'Carry it into fire to put the fire out.' },
  { id: 'C', label: 'Cork', description: 'Push it into a hole to make ordinary floor.' },
  { id: 'h', label: 'Hole', description: 'Deadly to step into. Plug it with a cork.' },
  { id: 'r', label: 'One-way floor →', description: 'Enter from the left, above or below. Blocks entry from the right and all objects.' },
  { id: 'l', label: 'One-way floor ←', description: 'Enter from the right, above or below. Blocks entry from the left and all objects.' },
  { id: 'u', label: 'One-way floor ↑', description: 'Enter from below or either side. Blocks entry from above and all objects.' },
  { id: 'd', label: 'One-way floor ↓', description: 'Enter from above or either side. Blocks entry from below and all objects.' },
];
const VALID_TILES = new Set(TILE_INFO.map(tile => tile.id));
const at = (state, x, y) => state.tiles[y]?.[x] ?? '#';
const same = (a, b) => a.x === b.x && a.y === b.y;
const pointKey = ({ x, y }) => `${x},${y}`;
const isArrow = tile => Object.hasOwn(ARROWS, tile);
const isMobile = tile => tile === 'O' || tile === '!' || isArrow(tile);
const isPlant = tile => Object.hasOwn(PLANTS, tile);
const copyState = state => {
  // Animation data belongs to one transition, never to a saved game position.
  const { frames, ...position } = state;
  return { ...position, tiles: state.tiles.map(row => row.slice()),
    player: { ...state.player }, inventory: { ...state.inventory },
    underlays: { ...state.underlays }, vineDirections: { ...state.vineDirections },
    ...(state.death ? { death: structuredClone(state.death) } : {}), events: [] };
};

export function validateLevel(level) {
  const errors = [], warnings = [];
  if (!level || !Array.isArray(level.rows) || !level.rows.length) {
    return { valid: false, errors: ['The level needs a nonempty rows array.'], warnings };
  }
  const rows = level.rows;
  if (rows.some(row => typeof row !== 'string')) {
    return { valid: false, errors: ['Every map row must be a string.'], warnings };
  }
  const width = rows[0].length;
  if (width < 3 || rows.length < 3) errors.push('Maps must be at least 3 × 3 squares.');
  if (width > 64 || rows.length > 64) errors.push('Maps must be no larger than 64 × 64 squares.');
  if (rows.some(row => row.length !== width)) errors.push('Every map row must have the same width.');
  let players = 0, exits = 0, chests = 0;
  rows.forEach((row, y) => [...row].forEach((tile, x) => {
    if (!VALID_TILES.has(tile)) errors.push(`Unknown tile “${tile}” at column ${x + 1}, row ${y + 1}.`);
    if (tile === '@') players++;
    if (tile === 'E') exits++;
    if (tile === '$') chests++;
  }));
  if (players !== 1) errors.push(`A level needs exactly one starting position; found ${players}.`);
  if (!exits) errors.push('A level needs at least one stairway.');
  if (!chests) warnings.push('This level has no toy chests; the stairs are already open.');
  return { valid: errors.length === 0, errors, warnings };
}

export function createState(level) {
  const validation = validateLevel(level);
  if (!validation.valid) throw new Error(validation.errors.join(' '));
  const tiles = level.rows.map(row => [...row]);
  let player, total = 0;
  tiles.forEach((row, y) => row.forEach((tile, x) => {
    if (tile === '@') { player = { x, y }; tiles[y][x] = '.'; }
    if (tile === '$') total++;
  }));
  return { levelId: level.id, width: tiles[0].length, height: tiles.length,
    tiles, player, inventory: { axe: 0, shears: 0, extinguisher: 0 }, carrying: null,
    underlays: {}, vineDirections: {},
    facing: 'D', moves: 0, collected: 0, total, status: 'playing',
    message: 'Collect the toy chests, then take the stairs.', events: [] };
}

function event(state, type, message, detail = {}) {
  state.events.push({ type, message, ...detail });
  if (message) state.message = message;
}

function die(state, message, cause, impact = {}) {
  state.status = 'dead';
  // The collision position is visual metadata. Keep the puzzle's last hazard
  // square intact so rules, saved routes and undo do not depend on animation.
  state.death = { cause, at: { x: state.player.x, y: state.player.y }, ...impact };
  event(state, 'dead', message, { cause });
}

function canPush(tile, direction) {
  if (['M', 'B', 'C'].includes(tile)) return true;
  if (tile === 'O') return direction !== 'U';
  if (isArrow(tile)) return DIRECTIONS[direction].x * DIRECTIONS[ARROWS[tile]].x
    + DIRECTIONS[direction].y * DIRECTIONS[ARROWS[tile]].y === 0;
  return false;
}

function movePlayer(state, direction) {
  const delta = DIRECTIONS[direction];
  const next = { x: state.player.x + delta.x, y: state.player.y + delta.y };
  let tile = at(state, next.x, next.y);
  if (tile === 'E' && state.collected < state.total) {
    event(state, 'blocked', 'Collect every toy chest before taking the stairs.');
    return false;
  }
  if (Object.hasOwn(ONE_WAY, tile)) {
    const allowed = DIRECTIONS[ONE_WAY[tile]];
    if (delta.x * allowed.x + delta.y * allowed.y < 0) {
      event(state, 'blocked', 'The one-way floor blocks entry from this direction.');
      return false;
    }
  }
  if (Object.hasOwn(TOOLS, tile)) {
    if (state.carrying) {
      event(state, 'blocked', 'You can carry one item. Press X to drop your current tool onto empty floor ahead.');
      return false;
    }
    state.carrying = tile;
    state.inventory[TOOLS[tile]] = 1;
    state.tiles[next.y][next.x] = '.';
    event(state, 'pickup', `You picked up the ${TOOLS[tile]}.`, { tile });
    tile = '.';
  }
  if (tile === 'T' && state.carrying === 'A') {
    state.tiles[next.y][next.x] = 'B';
    state.facing = direction;
    event(state, 'tool', 'The tree is now a dug-out canoe. Push it into the water.', { tile: 'A', to: next });
    return true;
  }
  if ((tile === 'p' || isPlant(tile)) && state.carrying === 'S') {
    // The original Six Islands room uses vines spanning waterways. Keep the
    // water underneath; shears clear vegetation, they do not build a bridge.
    tile = state.underlays[pointKey(next)] ?? '.';
    state.tiles[next.y][next.x] = tile;
    delete state.underlays[pointKey(next)];
    delete state.vineDirections[pointKey(next)];
    event(state, 'tool', 'Snip! The shears clear the vine.', { tile: 'S', to: next });
  }
  if (tile === 'F' && state.carrying === 'K') {
    state.tiles[next.y][next.x] = '.';
    tile = '.';
    event(state, 'tool', 'The fire is out.', { tile: 'K', to: next });
  }
  if (tile === '~' && at(state, state.player.x, state.player.y) === 'b') {
    state.tiles[state.player.y][state.player.x] = '~';
    state.tiles[next.y][next.x] = 'b';
    tile = 'b';
    event(state, 'sail', 'You paddle across the water.', { to: next });
  }
  if (canPush(tile, direction)) {
    const beyond = { x: next.x + delta.x, y: next.y + delta.y };
    const destination = at(state, beyond.x, beyond.y);
    if (!['.', '~', 'h'].includes(destination) || (tile === 'C' && destination === '~') || (tile === 'B' && destination === 'h')) {
      event(state, 'blocked', 'There is no room to push that.');
      return false;
    }
    state.tiles[next.y][next.x] = '.';
    state.tiles[beyond.y][beyond.x] = destination === '~' ? (tile === 'B' ? 'b' : '.')
      : destination === 'h' ? (tile === 'C' ? '.' : 'h') : tile;
    event(state, destination === '~' || destination === 'h' ? 'splash' : 'push',
      destination === 'h' && tile === 'C' ? 'The cork plugs the hole.'
        : destination === '~' && tile === 'B' ? 'The canoe is afloat. Step aboard.'
        : destination === '~' ? 'The object sinks, making a stepping stone.' : '',
      { tile, from: next, to: beyond });
  } else if (!['.', '$', 'E', 'F', '~', 'h', 'b'].includes(tile) && !Object.hasOwn(ONE_WAY, tile)) {
    event(state, 'blocked', tile === '!' ? 'A spike trap cannot be pushed.'
      : isMobile(tile) ? 'Push balls sideways or down, and arrows across their direction.' : 'The way is blocked.');
    return false;
  }
  const from = { ...state.player };
  state.player = next;
  state.facing = direction;
  state.player.onBoat = at(state, next.x, next.y) === 'b';
  event(state, 'move', '', { from, to: next });
  if (tile === '$') {
    state.tiles[next.y][next.x] = '.';
    state.collected++;
    event(state, 'chest', state.collected === state.total ? 'All toy chests collected! Find the stairs.' : 'A toy chest collected.');
  } else if (tile === 'F') die(state, 'Ouch! Fire is hot. Undo or restart to try again.', 'fire');
  else if (tile === '~') die(state, 'Splash! You need a safe crossing. Undo or restart to try again.', 'water');
  else if (tile === 'h') die(state, 'You fell into a hole. Undo or restart to try again.', 'hole');
  return true;
}

function dropTool(state) {
  if (!state.carrying) { event(state, 'blocked', 'You are not carrying a tool.'); return false; }
  const delta = DIRECTIONS[state.facing];
  const next = { x: state.player.x + delta.x, y: state.player.y + delta.y };
  if (at(state, next.x, next.y) !== '.') {
    event(state, 'blocked', 'You need empty floor in front of you to drop your tool.');
    return false;
  }
  const tile = state.carrying;
  state.tiles[next.y][next.x] = tile;
  state.inventory[TOOLS[tile]] = 0;
  state.carrying = null;
  event(state, 'drop', `You set down the ${TOOLS[tile]}.`, { tile, to: next });
  return true;
}

function rampSide(direction, ramp) {
  const table = ramp === '/' ? { U: 'R', R: 'U', D: 'L', L: 'D' }
    : { U: 'L', L: 'U', D: 'R', R: 'D' };
  return DIRECTIONS[table[direction]];
}

function openForDanger(state, point, playerBlocks = false) {
  return ['.', '~', 'h'].includes(at(state, point.x, point.y))
    && !(playerBlocks && same(point, state.player));
}

function destinationFor(state, mobile) {
  if (mobile.tile === '!') {
    // A spike is a straight charge, not a reflected arrow. Its impact reaches
    // an adjacent player even if the player is standing on a one-way floor.
    const dx = state.player.x - mobile.x, dy = state.player.y - mobile.y;
    if ((dx && dy) || (!dx && !dy)) return null;
    const next = { x: mobile.x + Math.sign(dx), y: mobile.y + Math.sign(dy), tile: '!' };
    if (same(next, state.player)) return { ...next, hitsPlayer: true };
    return at(state, next.x, next.y) === '.' ? next : null;
  }
  const direction = mobile.tile === 'O' ? 'D' : ARROWS[mobile.tile];
  const delta = DIRECTIONS[direction];
  const forward = { x: mobile.x + delta.x, y: mobile.y + delta.y };
  const result = point => ({ ...point, tile: mobile.tile,
    hitsPlayer: same(point, state.player),
    sinks: ['~', 'h'].includes(at(state, point.x, point.y)),
    hole: at(state, point.x, point.y) === 'h' });
  if (openForDanger(state, forward)) return result(forward);
  const obstacle = at(state, forward.x, forward.y);
  let sides;
  if (obstacle === '/' || obstacle === '\\') sides = [rampSide(direction, obstacle)];
  else if (obstacle === 'O') sides = delta.y ? [DIRECTIONS.L, DIRECTIONS.R] : [DIRECTIONS.U, DIRECTIONS.D];
  else return null;
  // A ball rolling around another ball treats Blobbo as a physical support.
  // A ramp instead carries a launched object diagonally past its corner.
  const playerBlocks = mobile.tile === 'O' && obstacle === 'O';
  for (const side of sides) {
    const clearance = { x: mobile.x + side.x, y: mobile.y + side.y };
    const diagonal = { x: forward.x + side.x, y: forward.y + side.y };
    if (openForDanger(state, clearance, playerBlocks) && openForDanger(state, diagonal, playerBlocks)) return result(diagonal);
  }
  return null;
}

function settleDangers(state, captureFrame) {
  // Boards start still. A changed nearby square releases a danger, then that
  // danger finishes its flight before the next queued release. Stable object
  // identities prevent a queued coordinate from accidentally moving a new
  // occupant. Nothing from this transient queue belongs in an undo position.
  const occupants = new Map();
  let nextId = 0;
  state.tiles.forEach((row, y) => row.forEach((tile, x) => {
    if (isMobile(tile)) occupants.set(pointKey({ x, y }), { id: nextId++, x, y, tile });
  }));
  const queue = [], queued = new Set();
  let active = null;
  const schedule = (x, y, predicate = () => true) => {
    const mobile = occupants.get(pointKey({ x, y }));
    if (!mobile || mobile.removed || mobile.id === active || queued.has(mobile.id) || !predicate(mobile)) return;
    const next = destinationFor(state, mobile);
    // A danger cannot start by moving directly onto Blobbo. Once launched,
    // however, its later path is lethal: the original under-ball chest trap.
    if (!next || (next.hitsPlayer && mobile.tile !== '!')) return;
    queued.add(mobile.id);
    queue.push(mobile);
  };
  const ball = mobile => mobile.tile === 'O';
  const arrow = direction => mobile => ARROWS[mobile.tile] === direction;
  const rampAhead = mobile => {
    const delta = DIRECTIONS[mobile.tile === 'O' ? 'D' : ARROWS[mobile.tile]];
    return ['/', '\\'].includes(at(state, mobile.x + delta.x, mobile.y + delta.y));
  };
  const wakeAround = ({ x, y }) => {
    schedule(x, y - 1, ball); schedule(x - 1, y, ball); schedule(x + 1, y, ball);
    schedule(x - 1, y - 1, mobile => ball(mobile) && rampAhead(mobile));
    schedule(x + 1, y - 1, mobile => ball(mobile) && rampAhead(mobile));
    for (const [direction, back] of [['R', -1], ['L', 1]]) {
      const matches = arrow(direction);
      schedule(x + back, y, matches); schedule(x, y - 1, matches); schedule(x, y + 1, matches);
      schedule(x + back, y - 1, mobile => matches(mobile) && rampAhead(mobile));
      schedule(x + back, y + 1, mobile => matches(mobile) && rampAhead(mobile));
    }
    // Symmetric behavior for imported vertical arrows, an editor extension.
    for (const [direction, back] of [['D', -1], ['U', 1]]) {
      const matches = arrow(direction);
      schedule(x, y + back, matches); schedule(x - 1, y, matches); schedule(x + 1, y, matches);
      schedule(x - 1, y + back, mobile => matches(mobile) && rampAhead(mobile));
      schedule(x + 1, y + back, mobile => matches(mobile) && rampAhead(mobile));
    }
  };
  // A pushed danger is released at its new position immediately. Ordinary
  // walking wakes neighbors of the vacated square, never the entire board.
  for (const change of state.events) {
    if (change.type === 'push' && isMobile(change.tile)) schedule(change.to.x, change.to.y);
  }
  for (const change of state.events) if (change.type === 'move') wakeAround(change.from);
  // Spike traps see the new player position through empty squares only. Scan
  // once after a successful move, after ordinary releases have been queued.
  // Waiting, tool use without movement, and other dangers never rescan spikes.
  if (state.events.some(change => change.type === 'move')) {
    for (const delta of [DIRECTIONS.U, DIRECTIONS.D, DIRECTIONS.L, DIRECTIONS.R]) {
      let x = state.player.x + delta.x, y = state.player.y + delta.y;
      while (at(state, x, y) === '.') { x += delta.x; y += delta.y; }
      if (at(state, x, y) === '!') schedule(x, y);
    }
  }
  let steps = 0;
  const limit = state.width * state.height * (state.width + state.height);
  for (let head = 0; head < queue.length && steps < limit; head++) {
    const mobile = queue[head];
    queued.delete(mobile.id);
    if (mobile.removed) continue;
    const first = destinationFor(state, mobile);
    if (!first || (first.hitsPlayer && mobile.tile !== '!')) continue;
    active = mobile.id;
    while (!mobile.removed && steps++ < limit) {
      const next = destinationFor(state, mobile);
      if (!next) break;
      if (next.hitsPlayer) {
        const cause = mobile.tile === 'O' ? 'ball' : mobile.tile === '!' ? 'spike' : 'arrow';
        die(state, cause === 'ball' ? 'Flattened by a bowling ball. Undo and try another route.'
          : cause === 'spike' ? 'The spike trap caught you. Keep a shield between you and its line of sight.'
          : 'An arrow found you. Undo and try another route.', cause,
          { from: { x: mobile.x, y: mobile.y }, tile: mobile.tile });
        captureFrame?.();
        return;
      }
      const from = { x: mobile.x, y: mobile.y };
      occupants.delete(pointKey(from));
      state.tiles[from.y][from.x] = '.';
      state.tiles[next.y][next.x] = next.sinks ? (next.hole ? 'h' : '.') : mobile.tile;
      mobile.x = next.x; mobile.y = next.y; mobile.removed = next.sinks;
      if (!mobile.removed) occupants.set(pointKey(mobile), mobile);
      event(state, next.sinks ? 'splash' : mobile.tile === 'O' ? 'fall' : mobile.tile === '!' ? 'spike' : 'arrow',
        next.sinks ? (next.hole ? 'The object disappears into the hole.' : 'The object sinks, making a stepping stone.') : '',
        { tile: mobile.tile, from, to: { x: next.x, y: next.y } });
      captureFrame?.();
      // Spike motion does not release neighboring mechanisms. Only walking,
      // balls and arrows participate in the local chain-reaction queue.
      if (mobile.tile !== '!') { wakeAround(from); wakeAround(next); }
    }
    active = null;
  }
}

function growPlants(state) {
  const tips = [];
  state.tiles.forEach((row, y) => row.forEach((tile, x) => { if (isPlant(tile)) tips.push({ x, y, tile }); }));
  for (const tip of tips) {
    const delta = DIRECTIONS[PLANTS[tip.tile]];
    const dx = state.player.x - tip.x, dy = state.player.y - tip.y;
    if ((delta.x && (dy !== 0 || dx * delta.x <= 0)) || (delta.y && (dx !== 0 || dy * delta.y <= 0))) continue;
    let x = tip.x + delta.x, y = tip.y + delta.y;
    let clear = true;
    while (x !== state.player.x || y !== state.player.y) {
      if (!['.', '~'].includes(at(state, x, y))) { clear = false; break; }
      x += delta.x; y += delta.y;
    }
    const next = { x: tip.x + delta.x, y: tip.y + delta.y };
    // Original help calls plants an obstruction, not a lethal creature.
    if (!clear || same(next, state.player)) continue;
    if (at(state, next.x, next.y) === '~') state.underlays[pointKey(next)] = '~';
    // Stems share the same collision tile, but retain their original artwork direction.
    state.vineDirections[pointKey(tip)] = tip.tile;
    state.tiles[tip.y][tip.x] = 'p';
    state.tiles[next.y][next.x] = tip.tile;
    event(state, 'grow', 'The vine reaches toward you.', { from: { x: tip.x, y: tip.y }, to: next });
  }
}

export function step(previous, action, { trace = false } = {}) {
  const state = copyState(previous);
  let captureFrame;
  if (trace) {
    state.frames = [];
    captureFrame = () => state.frames.push({
      tiles: state.tiles.map(row => row.slice()), player: { ...state.player },
      width: state.width, height: state.height, underlays: { ...state.underlays },
      vineDirections: { ...state.vineDirections },
      status: state.status,
      ...(state.death ? { death: structuredClone(state.death) } : {}),
    });
  }
  if (state.status !== 'playing') return state;
  const command = typeof action === 'string' ? action.toUpperCase() : '';
  if (command !== 'W' && command !== 'X' && !DIRECTIONS[command]) return state;
  state.message = '';
  const moved = command === 'W' || (command === 'X' ? dropTool(state) : movePlayer(state, command));
  if (!moved) return state;
  state.moves++;
  if (command === 'W') event(state, 'wait', 'You wait a turn.');
  captureFrame?.();
  if (state.status === 'playing') settleDangers(state, captureFrame);
  if (state.status === 'playing') growPlants(state);
  captureFrame?.();
  if (state.status === 'playing' && at(state, state.player.x, state.player.y) === 'E' && state.collected === state.total) {
    state.status = 'won';
    event(state, 'win', 'Room cleared!');
  }
  return state;
}

export function stateKey(state) {
  // vineDirections is visual-only: it does not change reachable puzzle states.
  const underlays = Object.keys(state.underlays ?? {}).sort().map(key => `${key}:${state.underlays[key]}`).join(';');
  return `${state.player.x},${state.player.y}|${state.carrying ?? ''}|${state.carrying ? state.facing : ''}|${state.tiles.map(row => row.join('')).join('/')}|${underlays}`;
}

export function solveLevel(level, { maxStates = 30000, maxDepth = 250 } = {}) {
  const initial = createState(level);
  const queue = [{ state: initial, parent: -1, action: '', depth: 0 }];
  const seen = new Set([stateKey(initial)]);
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    if (node.depth >= maxDepth) continue;
    for (const action of ['U', 'D', 'L', 'R', 'W', ...(node.state.carrying ? ['X'] : [])]) {
      const state = step(node.state, action);
      if (state.status === 'dead' || state.moves === node.state.moves) continue;
      if (state.status === 'won') {
        const solution = [action];
        let index = head;
        while (queue[index].parent !== -1) {
          solution.push(queue[index].action); index = queue[index].parent;
        }
        return { solved: true, solution: solution.reverse().join(''), visited: seen.size };
      }
      const key = stateKey(state);
      if (seen.has(key)) continue;
      seen.add(key);
      if (seen.size >= maxStates) return { solved: false, solution: null, visited: seen.size, reason: 'state-limit' };
      queue.push({ state, parent: head, action, depth: node.depth + 1 });
    }
  }
  return { solved: false, solution: null, visited: seen.size, reason: 'no-solution-within-limits' };
}

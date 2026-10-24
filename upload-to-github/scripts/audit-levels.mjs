// Replay real engine states; shorten witnesses without claiming optimality.
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { LEVELS, CHAPTERS, PRACTICE_LEVELS, generateLevel } from '../src/levels.js';
import { CHALLENGE_LEVELS } from '../src/challenges.js';
import { createState, step, stateKey, validateLevel } from '../src/engine.js';

export function replay(level, actions) {
  let state = createState(level);
  const states = [state];
  for (const action of actions) {
    const next = step(state, action);
    if (next.status === 'dead' || next.moves !== state.moves + 1) return null;
    states.push(next); state = next;
  }
  return { state, states };
}

export function shortenWitness(level) {
  let route = level.solution;
  // Remove exact state cycles first, including the held tool and facing.
  let changed = true;
  while (changed) {
    changed = false;
    const seen = new Map();
    for (const [i, state] of replay(level, route).states.entries()) {
      const key = stateKey(state);
      if (seen.has(key)) {
        route = route.slice(0, seen.get(key)) + route.slice(i);
        changed = true; break;
      }
      seen.set(key, i);
    }
  }
  // Try removing contiguous chunks, accepting only complete, legal wins.
  // This finds some shortcuts but is not a shortest-path search.
  for (let size = Math.floor(route.length / 2); size >= 1; size = Math.floor(size / 2)) {
    for (let start = 0; start + size <= route.length;) {
      const candidate = route.slice(0, start) + route.slice(start + size);
      const result = replay(level, candidate);
      if (result?.state.status === 'won') route = candidate;
      else start++;
    }
  }
  return route;
}

export function auditLevel(level, collection, shorten = false) {
  assert.deepEqual(validateLevel(level).errors, [], level.id);
  assert.match(level.solution, /^[UDLRWX]+$/, level.id);
  const original = JSON.stringify(level);
  const saved = replay(level, level.solution);
  assert.equal(saved?.state.status, 'won', `${level.id}: saved solution must win with no blocked moves`);
  assert.equal(saved.state.collected, saved.state.total, level.id);
  const witness = shorten ? shortenWitness(level) : level.solution;
  const result = replay(level, witness);
  assert.equal(result?.state.status, 'won', `${level.id}: shortened witness must win`);
  assert.equal(JSON.stringify(level), original, `${level.id}: replay changed the map`);
  const kinds = new Set(['push', 'fall', 'arrow', 'spike', 'grow', 'tool', 'drop', 'pickup', 'splash']);
  const activeTurns = result.states.slice(1).filter(s => s.events.some(e => kinds.has(e.type))).length;
  const mechanics = [...new Set(result.states.flatMap(s => s.events)
    .filter(e => kinds.has(e.type)).map(e => `${e.type}${e.tile ? ':' + e.tile : ''}`))].sort();
  return { id: level.id, name: level.name, collection, savedMoves: level.solution.length,
    witnessMoves: witness.length, interactionTurns: activeTurns, chests: result.state.total,
    mechanics, witness, solvable: true };
}

export async function runAudit({ generatedSeeds = 1000 } = {}) {
  const plans = JSON.parse(await readFile(new URL('../docs/campaign-plans.json', import.meta.url), 'utf8'));
  const challengeKeys = JSON.parse(await readFile(new URL('../tests/fixtures/challenge-solutions.json', import.meta.url), 'utf8'));
  const challenges = CHALLENGE_LEVELS.map(level => ({ ...level, solution: challengeKeys[level.id]?.solution }));
  const rooms = [];
  for (const [collection, levels] of [['campaign', LEVELS], ['practice', PRACTICE_LEVELS], ['challenge', challenges]]) {
    for (const level of levels) {
      const result = auditLevel(level, collection, collection !== 'practice');
      if (collection === 'campaign') {
        assert.ok(plans[level.id]?.length, `${level.id}: missing planning explanation`);
        result.planSteps = plans[level.id].length;
        result.chapter = level.chapter;
      }
      rooms.push(result);
      console.log(`${collection} ${level.id}: ${result.savedMoves} → ${result.witnessMoves} moves; ${result.interactionTurns} interaction turns`);
    }
  }
  for (let seed = 0; seed < generatedSeeds; seed++) auditLevel(generateLevel(seed), 'generated');
  await mkdir(new URL('../reports/', import.meta.url), { recursive: true });
  const average = (items, key) => Math.round(items.reduce((sum, item) => sum + item[key], 0) / items.length * 10) / 10;
  const bands = CHAPTERS.map(chapter => {
    const items = rooms.filter(room => room.chapter === chapter.id);
    return { name: chapter.name, rooms: items.length, averageWitnessMoves: average(items, 'witnessMoves'),
      averagePlanSteps: average(items, 'planSteps') };
  });
  const report = { schemaVersion: 1, method: 'Legal saved-solution replay plus cycle/chunk deletion; witnesses are upper bounds, not shortest paths.', bands,
    generated: { seeds: generatedSeeds, first: 0, last: generatedSeeds - 1, allSolved: true }, rooms };
  await writeFile(new URL('../reports/level-audit.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
  const campaign = rooms.filter(room => room.collection === 'campaign');
  const practice = rooms.filter(room => room.collection === 'practice');
  const challengeResults = rooms.filter(room => room.collection === 'challenge');
  let markdown = `# Level audit\n\nGenerated by \`npm run audit:levels\`. All ${rooms.length} built-in maps have a legal winning route: ${campaign.length} campaign rooms and ${practice.length} practice/experimental rooms, and ${challengeResults.length} challenge rooms. Generator seeds 0–${generatedSeeds - 1} also pass. This proves the shipped layouts are solvable under this engine; arbitrary edited rooms still need playtesting.\n\n## What was checked\n\n- Validate each layout and replay every stored action through the actual engine. Reject death, blocked moves, incomplete collection, or an unfinished exit. Confirm replay leaves the original map unchanged.\n- Remove exact-state cycles and try deleting contiguous chunks from campaign routes. Replay every accepted shortcut. These witnesses are **upper bounds**, not globally shortest solutions; the audit does not rule out other, much shorter approaches.\n- The separate test suite exercises irreversible mistakes, remote locks, shared supports, tool exchanges, and specific object-role changes. Historical capped searches in map metadata are not treated as proofs of impossibility.\n- Keep all geometry and winning references intact. Reorder rooms into four bands; migrate old position-based saves to stable room IDs. Completion and best-score IDs are unchanged.\n\n## Difficulty progression\n\nThe previous order opened with a 160-move room and ended with a 90-move room. The new order introduces shorter plans first and ends with longer return trips and shared-object dependencies. Plan steps are manually authored explanations of distinct tasks, not an automated difficulty score. Their wording is not used to determine solvability.\n\n| Band | Rooms | Mean shortened winning route | Mean plan steps |\n| --- | ---: | ---: | ---: |\n${bands.map(b => `| ${b.name} | ${b.rooms} | ${b.averageWitnessMoves} | ${b.averagePlanSteps} |`).join('\n')}\n\nDifficulty is not strictly monotonic. “The travelling prop” is deliberately short but requires five connected role changes; water navigation in “Reed Channels” is less demanding conceptually than several shorter rooms. Move count measures execution length, and prose length depends on editorial choices. Blind human playtesting is still needed to establish how hard each room feels. We have strengthened the **ordering**, not claimed to prove that every later map is harder or added artificial walking.\n\n## Campaign\n\n“Interactions” counts turns with pushes, hazard movement, plant growth, pickups, drops, tool use, or sinking; walking and chest collection alone do not count. One interaction can trigger a long cascade, so this is descriptive, not a difficulty rating.\n\n| Room | Name | Saved moves | Shortened witness | Interactions | Plan steps |\n| --- | --- | ---: | ---: | ---: | ---: |\n${campaign.map((r, i) => `| ${i + 1} | ${r.name} | ${r.savedMoves} | ${r.witnessMoves} | ${r.interactionTurns} | ${r.planSteps} |`).join('\n')}\n\nThe solution explanations and move strings are in [solutions.md](solutions.md), which contains spoilers and is never served with the game. Machine-readable witnesses are generated in \`reports/level-audit.json\`.\n\n## Practice and experiments\n\n| ID | Room | Legal winning moves |\n| --- | --- | ---: |\n${practice.map(r => `| ${r.id} | ${r.name} | ${r.savedMoves} |`).join('\n')}\n\nThe last two practice maps explicitly use the prototype water-filling rule. Campaign rooms do not rely on that rule. The generated maps are connected mazes, not arbitrary gadget puzzles; testing ${generatedSeeds} seeds is sample coverage, not a proof of every possible seed.\n`;
  if (challengeResults.length) markdown += `\n## Extra hard challenges\n\nAll contest rooms are 15 × 13. Keys and strategic explanations are kept outside the browser bundle. See [the blind contest results](challenge-contest.md) for the actual attempt limits and outcomes; failed bounded attempts do not prove universal difficulty.\n\n| Room | Verified route | Shortened witness | Interaction turns |\n| --- | ---: | ---: | ---: |\n${challengeResults.map(r => `| ${r.name} | ${r.savedMoves} | ${r.witnessMoves} | ${r.interactionTurns} |`).join('\n')}\n`;
  const solutions = `# Campaign solutions — spoilers\n\nDeveloper/playtester reference, excluded from the deployed site. Generated by \`npm run audit:levels\` from \`campaign-plans.json\` and successful engine replays. The prose describes one plan; alternatives can be valid. U/D/L/R move, W waits, X drops the held tool. Shortened sequences below are legal winning witnesses, not guaranteed optimal routes.\n\n${campaign.map((room, i) => `## ${i + 1}. ${room.name}\n\nStable ID: \`${room.id}\`. ${room.witnessMoves} moves; ${room.planSteps} planning steps.\n\n${plans[room.id].map((step, n) => `${n + 1}. ${step}`).join('\n')}\n\n<details>\n<summary>Verified move sequence</summary>\n\n\`\`\`text\n${room.witness}\n\`\`\`\n\n</details>\n`).join('\n')}`;
  await writeFile(new URL('../docs/level-audit.md', import.meta.url), markdown);
  await writeFile(new URL('../docs/solutions.md', import.meta.url), solutions);
  const challengeSolutions = `# Challenge solutions — spoilers\n\nDeveloper/playtester reference, excluded from the deployed site and standalone HTML. Each route is verified against the actual game engine by \`npm run audit:levels\`. These are winning witnesses, not guaranteed shortest routes. U/D/L/R move, W waits, X drops the held tool.\n\n${challengeResults.map(room => `## ${room.name}\n\nStable ID: \`${room.id}\`. ${room.witnessMoves} moves; ${room.interactionTurns} turns involving objects or hazards.\n\n${challengeKeys[room.id].plan.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n\n<details>\n<summary>Verified move sequence</summary>\n\n\`\`\`text\n${room.witness}\n\`\`\`\n\n</details>\n`).join('\n')}`;
  await writeFile(new URL('../docs/challenge-solutions.md', import.meta.url), challengeSolutions);
  console.log(`PASS: ${rooms.length} authored rooms and ${generatedSeeds} generated seeds.`);
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await runAudit();

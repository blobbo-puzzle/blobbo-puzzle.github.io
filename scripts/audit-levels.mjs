// Replay real engine states; shorten witnesses without claiming optimality.
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { LEVELS, generateLevel } from '../src/levels.js';
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
  let maxWalk = 0, walk = 0;
  for (const state of result.states.slice(1)) {
    walk = state.events.some(event => kinds.has(event.type)) ? 0 : walk + 1;
    maxWalk = Math.max(maxWalk, walk);
  }
  const mechanics = [...new Set(result.states.flatMap(s => s.events)
    .filter(e => kinds.has(e.type)).map(e => `${e.type}${e.tile ? ':' + e.tile : ''}`))].sort();
  return { id: level.id, name: level.name, collection, savedMoves: level.solution.length,
    witnessMoves: witness.length, interactionTurns: activeTurns, longestWalk: maxWalk, chests: result.state.total,
    mechanics, witness, solvable: true };
}

export async function runAudit({ generatedSeeds = 1000 } = {}) {
  const regularKeys = JSON.parse(await readFile(new URL('../tests/fixtures/regular-solutions.json', import.meta.url), 'utf8'));
  const challengeKeys = JSON.parse(await readFile(new URL('../tests/fixtures/challenge-solutions.json', import.meta.url), 'utf8'));
  const rooms = [];
  for (const [collection, levels, keys] of [['regular', LEVELS, regularKeys], ['challenge', CHALLENGE_LEVELS, challengeKeys]]) {
    for (const level of levels) {
      assert.ok(keys[level.id]?.plan?.length, `${level.id}: missing planning explanation`);
      const result = auditLevel({...level, solution: keys[level.id].solution}, collection);
      result.width = level.rows[0].length; result.height = level.rows.length;
      rooms.push(result);
      console.log(`${collection} ${level.id}: ${result.witnessMoves} moves; ${result.interactionTurns} interaction turns`);
    }
  }
  for (let seed = 0; seed < generatedSeeds; seed++) auditLevel(generateLevel(seed), 'generated');
  await mkdir(new URL('../reports/', import.meta.url), {recursive: true});
  const wrongOrderChecks = [...Object.values(regularKeys), ...Object.values(challengeKeys)].flatMap(key => key.counterfactuals ?? []).filter(proof => proof.prefix && proof.maxStates).length;
  const report = {schemaVersion: 3, method: 'Legal winning-route replay through the actual engine. Move counts are upper bounds, not difficulty scores.', generated: {seeds: generatedSeeds, first: 0, last: generatedSeeds - 1, allSolved: true}, rooms};
  await writeFile(new URL('../reports/level-audit.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
  const table = entries => `| Room | Size | Winning actions | Interaction turns | Longest walk |\n| --- | --- | ---: | ---: | ---: |\n${entries.map(r=>`| ${r.name} | ${r.width} × ${r.height} | ${r.witnessMoves} | ${r.interactionTurns} | ${r.longestWalk} |`).join('\n')}`;
  await writeFile(new URL('../docs/level-audit.md', import.meta.url), `# Level audit\n\nGenerated by \`npm run audit:levels\`. All **${rooms.length} shipped rooms** have legal winning routes: ${LEVELS.length} Regular and ${CHALLENGE_LEVELS.length} Extra hard. Generator seeds 0–${generatedSeeds - 1} also pass. Historical rooms in test fixtures are not counted as shipped content.\n\n## What the checks establish\n\nEach layout is validated and its complete winning route replayed through the actual engine. A blocked action, death, incomplete collection or unfinished exit fails the audit. Replay must not mutate the original layout.\n\nThe separate test suite exhausts the reachable state graph after ${wrongOrderChecks} selected irreversible mistakes. Search limits are treated as inconclusive, never as impossibility proofs. Two additional constrained searches check that temporary tool support and upper-ball relocation cannot simply be skipped. The recorded map hashes bind these checks to the shipped layouts.\n\nWinning routes are upper bounds. Their length and the number of interaction turns describe execution, not human difficulty. Interaction turns involve pushes, falls, arrows, plant growth, tool use, pickup/drop or sinking; a single turn may trigger several events. Longest walk is the longest consecutive run without one of those interactions in the reference route, including treasure collection and the final approach to the exit. It is a screening measure, not a difficulty score. The expanded Regular set has not undergone blind human difficulty testing. No room is advertised as unbeatable.\n\n## Regular\n\nThe first 11 compact rooms are preserved, followed by 19 selected additions from five independent designers. Larger footprints are used where they support coupled decisions; small layouts remain throughout the set. New stable IDs keep additions separate from existing completions. Existing Extra hard IDs, best scores and custom rooms are preserved. The original maps remain only as historical engine regression fixtures.\n\n${table(rooms.filter(r=>r.collection==='regular'))}\n\nDeveloper [walkthroughs](solutions.md) contain spoilers and are excluded from browser assets. These rooms were authored or selected from deterministic small-layout searches, inspected for object interactions, and verified against the engine. They are original layouts, not copies of Globbo maps.\n\n## Extra hard\n\nThe existing two contest-selected rooms are unchanged; see their [original contest report](challenge-contest.md). New selections come from the [five-designer tournament](tournament-2026-10-24.md), with three fresh blind attempts each. Second Floor now starts one square lower, in the exact puzzle state after its original forced opening move; the rest of its layout is unchanged. A regression check binds this revision to the frozen layout. That tournament required a new room to defeat at least two of three bounded attempts. The seven rooms from Cellar Door onward come from the [second design tournament](tournament-2026-10-30.md). Every one that was played blind was solved by at least one stronger agent player, so they were selected through maintainer playtesting rather than blind failures. Agent results do not establish human difficulty.\n\n${table(rooms.filter(r=>r.collection==='challenge'))}\n\n## Generator\n\nThe editor's generator still creates connected treasure mazes, not authored logic puzzles. Testing ${generatedSeeds} seeds is sample coverage, not a proof of every possible seed. Arbitrarily edited maps need their own playtesting.\n`);
  for (const [collection, keys, filename, title] of [['regular', regularKeys, 'solutions.md', 'Regular'], ['challenge', challengeKeys, 'challenge-solutions.md', 'Extra hard']]) {
    const text = `# ${title} solutions — spoilers\n\nDeveloper reference, excluded from the website and standalone HTML. U/D/L/R move, W waits, X drops the held tool. These are verified winning witnesses, not guaranteed shortest routes.\n\n` + rooms.filter(r=>r.collection===collection).map((r,i)=>`## ${i+1}. ${r.name}\n\nStable ID: \`${r.id}\`. ${r.width} × ${r.height}; ${r.witnessMoves} actions.\n\n${keys[r.id].plan.map((p,j)=>`${j+1}. ${p}`).join('\n')}\n\n<details>\n<summary>Verified move sequence</summary>\n\n\`\`\`text\n${r.witness}\n\`\`\`\n\n</details>\n`).join('\n');
    await writeFile(new URL('../docs/'+filename, import.meta.url), text);
  }
  console.log(`PASS: ${rooms.length} shipped rooms and ${generatedSeeds} generated seeds.`);
  return report;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await runAudit();

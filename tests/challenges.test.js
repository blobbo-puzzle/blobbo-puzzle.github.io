import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {CHALLENGE_LEVELS} from '../src/challenges.js';
import {createState,step,validateLevel} from '../src/engine.js';

const keys=JSON.parse(await readFile(new URL('./fixtures/challenge-solutions.json',import.meta.url),'utf8'));

test('challenge rooms keep the same compact footprint and omit solution keys from browser data',()=>{
 assert.ok(CHALLENGE_LEVELS.length>=2,'Select at least two qualifying contest rooms');
 assert.equal(new Set(CHALLENGE_LEVELS.map(level=>level.id)).size,CHALLENGE_LEVELS.length);
 for(const level of CHALLENGE_LEVELS){
  assert.equal(level.rows.length,13);
  assert.ok(level.rows.every(row=>row.length===15));
  assert.match(level.rows[0],/^#+$/);assert.match(level.rows.at(-1),/^#+$/);
  assert.ok(level.rows.every(row=>row.startsWith('#')&&row.endsWith('#')));
  assert.doesNotMatch(level.rows.join(''),/[~^v]/,'No prototype water filling or vertical arrows');
  assert.equal(level.solution,undefined);assert.equal(level.hint,undefined);assert.equal(level.design,undefined);
  const hash=createHash('sha256').update(JSON.stringify(level.rows)).digest('hex');
  assert.equal(hash,keys[level.id].mapHash,'Ship the actual blind-tested layout');
 }
});

for(const level of CHALLENGE_LEVELS){
 test(`${level.name}: the private reference wins within the compact action budget`,()=>{
  const key=keys[level.id];assert.deepEqual(validateLevel(level).errors,[]);
  assert.match(key.solution,/^[UDLRWX]+$/);assert.ok(key.solution.length<=110);
  let state=createState(level);const before=JSON.stringify(level),events=[];
  for(const [i,action]of [...key.solution].entries()){
   const next=step(state,action);
   assert.equal(next.moves,state.moves+1,`Move ${i+1} is blocked`);
   assert.notEqual(next.status,'dead',`Move ${i+1}: ${next.message}`);
   events.push(...next.events);state=next;
  }
  assert.equal(state.status,'won');assert.equal(state.collected,state.total);
  assert.equal(JSON.stringify(level),before);
  for(const mechanic of key.mechanics??[])assert.ok(events.some(event=>`${event.type}${event.tile?':'+event.tile:''}`===mechanic),`Missing ${mechanic}`);
 });
 for(const [index,proof]of (keys[level.id]?.counterfactuals??[]).entries()){
  if(!proof.cells?.length&&!proof.expectedStatus)continue;
  test(`${level.name}: wrong-order branch ${index+1} preserves its documented consequence`,()=>{
   let state=createState(level);
   for(const action of proof.prefix){const next=step(state,action);assert.equal(next.moves,state.moves+1);state=next;}
   if(proof.expectedStatus)assert.equal(state.status,proof.expectedStatus);
   for(const [x,y,tile]of proof.cells??[])assert.equal(state.tiles[y][x],tile,`Cell ${x},${y}`);
   for(const tile of proof.absentTiles??[])assert.ok(!state.tiles.flat().includes(tile),`Unexpected surviving ${tile}`);
   if(proof.expectedCause)assert.equal(state.events.find(event=>event.type==='dead')?.cause,proof.expectedCause);
  });
 }
}

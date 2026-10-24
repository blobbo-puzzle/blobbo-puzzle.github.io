import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {LEVELS} from '../src/levels.js';
import {createState,step,validateLevel} from '../src/engine.js';
import {search} from '../scripts/search-room.mjs';
const keys=JSON.parse(await readFile(new URL('./fixtures/regular-solutions.json',import.meta.url),'utf8'));
function replay(level, route) {
 let state=createState(level);
 for(const [i,a]of [...route].entries()){
  const next=step(state,a);
  assert.equal(next.moves,state.moves+1,`${level.name}: blocked action ${i+1}`);
  assert.notEqual(next.status,'dead',`${level.name}: death at ${i+1}`);
  state=next;
 }
 return state;
}
test('regular rooms are compact replacements with no embedded spoilers',()=>{
 assert.equal(LEVELS.length,30);
 assert.equal(new Set(LEVELS.map(l=>l.id)).size,LEVELS.length);
 assert.deepEqual(Object.keys(keys).sort(),LEVELS.map(l=>l.id).sort());
 for(const level of LEVELS){
  assert.match(level.id,/^compact-/);
  assert.ok(level.rows.length<=13&&level.rows[0].length<=15);
  assert.deepEqual(validateLevel(level).errors,[]);
  assert.equal(level.solution,undefined);assert.equal(level.hint,undefined);
  assert.equal(createHash('sha256').update(JSON.stringify(level.rows)).digest('hex'),keys[level.id].mapHash);
 }
});
for(const level of LEVELS){
 const key=keys[level.id];
 test(`${level.name}: complete legal win within its action budget`,()=>{
  assert.match(key.solution,/^[UDLRWX]+$/);assert.ok(key.solution.length<=(key.actionBudget??35));
  const before=JSON.stringify(level), state=replay(level,key.solution);
  assert.equal(state.status,'won');assert.equal(state.collected,state.total);
  assert.equal(JSON.stringify(level),before);
  let s=createState(level);const mechanics=new Set();
  for(const a of key.solution){s=step(s,a);for(const e of s.events)mechanics.add(e.type+(e.tile?':'+e.tile:''));}
  for(const kind of key.mechanics)assert.ok(mechanics.has(kind),`Missing interaction: ${kind}`);
 });
 for(const [i,proof]of key.counterfactuals.entries()){
  test(`${level.name}: wrong-order branch ${i+1} exhausts all remaining possibilities`,()=>{
   const state=replay(level,proof.prefix);assert.equal(state.status,'playing');
   const result=search(state,{maxStates:proof.maxStates});
   assert.equal(result.solved,false);assert.equal(result.reason,'exhausted','A search limit is not a proof');
  });
 }
}
test('Borrowed Weight cannot bypass the temporary tool support',()=>{
 const level=LEVELS.find(l=>l.name==='Borrowed Weight');
 const result=search(createState(level),{maxStates:500,forbid:(_s,n)=>n.events.some(e=>e.type==='drop')});
 assert.equal(result.solved,false);assert.equal(result.reason,'exhausted');
});
test('One Too Soon requires relocating the upper ball before draining the stack',()=>{
 const level=LEVELS.find(l=>l.name==='One Too Soon');
 const result=search(createState(level),{maxStates:800,forbid:(_s,n)=>n.events.some(e=>e.type==='push'&&e.tile==='O'&&e.from.y===2)});
 assert.equal(result.solved,false);assert.equal(result.reason,'exhausted');
});

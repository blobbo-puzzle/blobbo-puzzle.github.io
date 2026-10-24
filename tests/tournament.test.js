import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {CHALLENGE_LEVELS} from '../src/challenges.js';
import {createState,step,stateKey} from '../src/engine.js';
const report=JSON.parse(await readFile(new URL('../docs/tournament-2026-10-24.json',import.meta.url),'utf8'));
const keys=JSON.parse(await readFile(new URL('./fixtures/challenge-solutions.json',import.meta.url),'utf8'));
test('new Extra hard rooms preserve tournament layouts or verified opening-state revisions',()=>{
 const newRooms=CHALLENGE_LEVELS.filter(l=>keys[l.id].tournament);
 assert.ok(newRooms.length>=2,'Select a few qualifying new rooms');
 for(const level of newRooms){
  const record=report.candidates.find(c=>c.packetId===keys[level.id].tournament.packetId);
  assert.ok(record?.selected);
  const hash=rows=>createHash('sha256').update(JSON.stringify(rows)).digest('hex');
  if(record.shippedRevision){
   const revision=record.shippedRevision;
   assert.equal(revision.type,'start-after-prefix');
   assert.equal(hash(level.rows),revision.mapHash);
   const rows=level.rows.map(row=>[...row]);
   assert.equal(rows[revision.start.y][revision.start.x],'@');
   assert.equal(rows[revision.originalStart.y][revision.originalStart.x],'.');
   rows[revision.start.y][revision.start.x]='.';
   rows[revision.originalStart.y][revision.originalStart.x]='@';
   const original={...level,rows:rows.map(row=>row.join(''))};
   assert.equal(hash(original.rows),record.mapHash,'Only the documented start may change');
   let opening=createState(original);
   for(const action of revision.prefix){
    const next=step(opening,action);
    assert.equal(next.moves,opening.moves+1);
    assert.equal(next.status,'playing');opening=next;
   }
   const revised=createState(level);
   assert.equal(stateKey(revised),stateKey(opening),'The remaining puzzle must be identical');
   assert.deepEqual(revised.inventory,opening.inventory);
   assert.equal(revised.facing,opening.facing);
   assert.equal(Boolean(revised.player.onBoat),Boolean(opening.player.onBoat));
   assert.equal(revised.collected,opening.collected);
   assert.equal(revised.total,opening.total);
  }else assert.equal(hash(level.rows),record.mapHash);
  assert.equal(record.attempts.length,3);
  assert.ok(record.attempts.filter(a=>!a.solved).length>=2);
  for(const a of record.attempts){
   assert.equal(a.mapHash,record.mapHash);
   assert.ok(a.finished);
   if(!a.solved)assert.ok(a.elapsedSeconds>=480||a.probes>=60,'Failure must use the full equal allowance');
  }
 }
});

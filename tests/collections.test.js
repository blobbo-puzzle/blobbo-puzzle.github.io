import test from 'node:test';
import assert from 'node:assert/strict';
import {selectedCollection,roomIndex} from '../src/collections.js';
import {LEVELS} from '../src/levels.js';
import {CHALLENGE_LEVELS} from '../src/challenges.js';
test('legacy campaign and practice positions start at the new regular set',()=>{
 for(const old of ['campaign','practice',undefined]){
  const saved={collection:old,campaignCurrent:19,practiceCurrent:20,best:{'campaign-01':100},rooms:[{id:'custom'}]};
  const before=JSON.stringify(saved);
  assert.equal(selectedCollection(saved),'regular');assert.equal(roomIndex(saved,'regular',LEVELS),0);
  assert.equal(JSON.stringify(saved),before);
  assert.ok(LEVELS.every(l=>saved.best[l.id]===undefined));
 }
});
test('stable regular and extra hard room IDs survive reloads',()=>{
 for(const [collection,levels]of [['regular',LEVELS],['challenge',CHALLENGE_LEVELS]]){
  for(const [index,l]of levels.entries()){
   const saved={collection,[collection+'RoomId']:l.id,[collection+'Current']:0};
   assert.equal(selectedCollection(saved),collection);
   assert.equal(roomIndex(saved,collection,levels),index);
  }
 }
});
test('missing IDs reset safely while old challenge positions still migrate',()=>{
 assert.equal(roomIndex({collection:'regular',regularRoomId:'removed',regularCurrent:8},'regular',LEVELS),0);
 assert.equal(roomIndex({collection:'challenge',challengeCurrent:1},'challenge',CHALLENGE_LEVELS),1);
 assert.equal(roomIndex({collection:'regular',regularCurrent:999},'regular',LEVELS),LEVELS.length-1);
});

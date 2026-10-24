import test from 'node:test';
import assert from 'node:assert/strict';
import {claimPickupHint} from '../src/pickup-hints.js';
const room={id:'one',rows:['#####','#@KE#','#####']};
test('two pickup reminders per map persist through a saved-data round trip',()=>{
 const counts={};assert.equal(claimPickupHint(counts,room),true);
 const reloaded=JSON.parse(JSON.stringify(counts));
 assert.equal(claimPickupHint(reloaded,room),true);
 const before=JSON.stringify(reloaded);
 assert.equal(claimPickupHint(reloaded,room),false);
 assert.equal(JSON.stringify(reloaded),before);
});
test('visiting another map does not reset the previous map reminder budget',()=>{
 const counts={};claimPickupHint(counts,room);claimPickupHint(counts,room);
 assert.equal(claimPickupHint(counts,{...room,id:'two'}),true);
 assert.equal(claimPickupHint(counts,room),false);
});
test('editing a layout gets a new budget without erasing its original layout history',()=>{
 const counts={};claimPickupHint(counts,room);claimPickupHint(counts,room);
 assert.equal(claimPickupHint(counts,{...room,rows:['######','#@.KE#','######']}),true);
 assert.equal(claimPickupHint(counts,room),false);
});

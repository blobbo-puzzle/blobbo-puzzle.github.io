import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step,stateKey} from '../src/engine.js';
import {deathPose,blobPose,drawBoard,CELL} from '../src/render.js';

const ballRows=['#######','#..O..#','#.@$..#','#.....#','#.....#','#....E#','#######'];
const height=pose=>Math.max(...pose.outline.map(p=>p[1]))-Math.min(...pose.outline.map(p=>p[1]));

test('fatal ball impact records the last flight segment without changing the puzzle or undo position',()=>{
 const before=step(createState({rows:ballRows}),'R'),snapshot=JSON.stringify(before);
 const dead=step(before,'D',{trace:true});
 assert.deepEqual(dead.death,{cause:'ball',at:{x:3,y:3},from:{x:3,y:2},tile:'O'});
 assert.equal(dead.tiles[2][3],'O');assert.equal(dead.tiles[3][3],'.');
 assert.equal(dead.moves,before.moves+1);assert.equal(JSON.stringify(before),snapshot);
 assert.equal(dead.frames[0].status,'playing');
 assert.deepEqual(dead.frames.at(-1).death,dead.death);
 const key=stateKey(dead);dead.death.at.x=100;
 assert.equal(dead.frames.at(-1).death.at.x,3,'trace must own impact coordinates');
 assert.equal(stateKey(dead),key,'visual metadata cannot change solver identity');
 assert.equal(step(before,'R').status,'playing','undo can take the safe departure');
});

test('all four arrow directions retain the actual incoming tile and collision location',()=>{
 for(const[tile,action,dx,dy]of[['>','R',1,0],['<','L',-1,0],['v','D',0,1],['^','U',0,-1]]){
  const rows=Array.from({length:7},(_,y)=>Array.from({length:7},(_,x)=>x===0||y===0||x===6||y===6?'#':'.'));
  rows[5][5]='E';rows[3][3]='@';rows[3-dy][3-dx]=tile;
  const before=createState({rows:rows.map(r=>r.join(''))}),dead=step(before,action,{trace:true});
  assert.equal(dead.status,'dead');
  assert.deepEqual(dead.death,{cause:'arrow',tile,from:{x:3,y:3},at:{x:3+dx,y:3+dy}});
  assert.equal(step(before,'W').status,'playing','adjacent resting arrow remains safe');
  const end=deathPose(dead.death);
  assert.ok(Math.abs(end.object.x-dead.player.x)<1&&Math.abs(end.object.y-dead.player.y)<1,'arrow must enter the occupied tile');
  assert.notDeepEqual(end.object,deathPose(dead.death,0).object);
 }
});

test('adjacent spike impacts and fatal terrain work even without a prior flight event',()=>{
 const spike=step(createState({rows:['########','#......#','#..@.!.#','#.....E#','########']}),'R',{trace:true});
 assert.equal(spike.events.filter(e=>e.type==='spike').length,0);
 assert.deepEqual(spike.death,{cause:'spike',tile:'!',from:{x:5,y:2},at:{x:4,y:2}});
 for(const[tile,cause]of[['F','fire'],['~','water'],['h','hole']]){
  const dead=step(createState({rows:['######',`#@${tile}$E#`,'######']}),'R',{trace:true});
  assert.deepEqual(dead.death,{cause,at:{x:2,y:1}});
  assert.ok(dead.frames.every(f=>f.status==='dead'));
  const still=step(dead,'R');assert.equal(still.moves,1);
  still.death.at.x=99;assert.equal(dead.death.at.x,2);
 }
});

test('the falling ball finishes on the flattened body and left/right arrows mirror their impact',()=>{
 const ball={cause:'ball',at:{x:3,y:3},from:{x:3,y:2},tile:'O'};
 assert.deepEqual(deathPose(ball,0).object,{tile:'O',x:3,y:2});
 assert.deepEqual(deathPose(ball,1).object,{tile:'O',x:3,y:3});
 assert.ok(height(deathPose(ball,1))<=6);
 assert.ok(height(deathPose(ball,1))<height(blobPose())/4);
 for(const t of[.2,.4,.7,1]){
  const right=deathPose({cause:'arrow',tile:'>',at:{x:3,y:3},from:{x:2,y:3}},t);
  const left=deathPose({cause:'arrow',tile:'<',at:{x:3,y:3},from:{x:4,y:3}},t);
  assert.deepEqual(left.outline,right.outline.map(([x,y])=>[7*CELL-x,y]));
  assert.notDeepEqual(right.outline,blobPose({from:{x:3,y:3}}).outline);
 }
});

test('death drawing never duplicates the impacting object and balances every canvas frame',()=>{
 for(const[tile,cause,from]of[['O','ball',{x:2,y:1}],['>','arrow',{x:1,y:2}],['<','arrow',{x:3,y:2}],['^','arrow',{x:2,y:3}],['v','arrow',{x:2,y:1}],['!','spike',{x:1,y:2}],['F','fire',null],['~','water',null],['h','hole',null]]){
  const tiles=Array.from({length:5},()=>Array(5).fill('.'));tiles[(from||{y:2}).y][(from||{x:2}).x]=tile;
  const state={tiles,width:5,height:5,player:{x:2,y:2},status:'dead',death:{cause,at:{x:2,y:2},...(from?{from,tile}:{})}};
  for(const t of[0,.1,.2,.4,.65,.8,1]){
   let depth=0,objects=0;const objectFill=tile==='O'?'#282c28':'> < ^ v'.split(' ').includes(tile)?'#344f36':null;
   const ctx=new Proxy({save(){depth++;},restore(){assert.ok(--depth>=0);},fill(){if(objectFill&&this.fillStyle===objectFill)objects++;},ellipse(x,y,rx,ry){assert.ok([x,y,rx,ry].every(Number.isFinite));assert.ok(rx>=0&&ry>=0);}}, {get:(target,key)=>key in target?target[key]:()=>{}});
   drawBoard({width:0,height:0,getContext:()=>ctx},state,{animation:{deathProgress:t}});
   assert.equal(depth,0);if(objectFill)assert.equal(objects,1,`${tile} at ${t}`);
  }
 }
});

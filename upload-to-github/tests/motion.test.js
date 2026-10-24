import test from 'node:test';
import assert from 'node:assert/strict';
import {blobPose,CELL,drawBoard,spikeSightLines} from '../src/render.js';
import {createState,step} from '../src/engine.js';

const directions={R:[1,0],L:[-1,0],D:[0,1],U:[0,-1]};
const bounds=points=>({left:Math.min(...points.map(p=>p[0])),right:Math.max(...points.map(p=>p[0])),top:Math.min(...points.map(p=>p[1])),bottom:Math.max(...points.map(p=>p[1]))});

test('a step begins and ends in the exact standing pose at its two endpoints',()=>{
 for(const [facing,[dx,dy]]of Object.entries(directions)){
  const from={x:4,y:4},to={x:4+dx,y:4+dy};
  const start=blobPose({from,to,facing,cycle:0});
  const end=blobPose({from,to,facing,cycle:1});
  assert.equal(start.phase,'rest');assert.equal(end.phase,'rest');
  assert.deepEqual(start.outline,blobPose({from,facing}).outline);
  assert.deepEqual(end.outline,start.outline.map(([x,y])=>[x+dx*CELL,y+dy*CELL]));
  const shiftedEyes=start.eyes.map(([x,y,rx,ry])=>[x+dx*CELL,y+dy*CELL,rx,ry]);
  assert.ok(end.eyes.flat().every((v,i)=>Math.abs(v-shiftedEyes.flat()[i])<1e-9));
 }
});

test('the horizontal smear holds both ends while its eye mound crosses the body',()=>{
 const first=blobPose({to:{x:1,y:0},cycle:.25,facing:'R'});
 const second=blobPose({to:{x:1,y:0},cycle:.6,facing:'R'});
 const a=bounds(first.outline),b=bounds(second.outline);
 assert.ok(a.right-a.left>=58);assert.ok(a.bottom-a.top<=19);
 assert.equal(a.left,b.left);assert.equal(a.right,b.right);
 assert.ok(second.eyes[0][0]-first.eyes[0][0]>=14);
 assert.notEqual(first.outline.length,blobPose().outline.length);
});

test('all normal and pushing poses stay inside the two traversed squares',()=>{
 for(const [facing,[dx,dy]]of Object.entries(directions))for(const pushing of[false,true]){
  const from={x:4,y:4},to={x:4+dx,y:4+dy};
  const limits={left:Math.min(from.x,to.x)*CELL,right:(Math.max(from.x,to.x)+1)*CELL,top:Math.min(from.y,to.y)*CELL,bottom:(Math.max(from.y,to.y)+1)*CELL};
  for(let i=0;i<=100;i++){
   const pose=blobPose({from,to,facing,pushing,cycle:i/100}),b=bounds(pose.outline);
   assert.ok(b.left>=limits.left&&b.right<=limits.right&&b.top>=limits.top&&b.bottom<=limits.bottom,`${facing} ${pushing} ${i}`);
   assert.ok(pose.outline.flat().every(Number.isFinite));
  }
 }
});

test('vertical travel uses a narrow diagonal body with upright gathering eyes',()=>{
 for(const [facing,from,to]of[['D',{x:0,y:0},{x:0,y:1}],['U',{x:0,y:1},{x:0,y:0}]]){
  const spread=blobPose({from,to,facing,cycle:.3}),b=bounds(spread.outline);
  assert.ok(b.bottom-b.top>=58);assert.ok(b.right-b.left<=23);
  const gather=blobPose({from,to,facing,cycle:.85});
  const eyeY=gather.eyes[0][1];
  assert.ok(eyeY>=to.y*CELL&&eyeY<=to.y*CELL+20,'eyes gather into the upper half of the arrival body');
 }
});

test('board drawing balances canvas state for normal, animated, and blocked poses',()=>{
 let depth=0;
 const ctx=new Proxy({save(){depth++;},restore(){depth--;assert.ok(depth>=0);}}, {get(target,key){return key in target?target[key]:()=>{};}});
 const canvas={width:64,height:64,getContext:()=>ctx};
 const state={tiles:[['.','.'],['.','.']],width:2,height:2,player:{x:0,y:0}};
 for(const animation of[null,{from:state.player,to:{x:1,y:0},cycle:.6,facing:'R'},{from:state.player,to:state.player,cycle:.5,facing:'D',blocked:true}]){
  drawBoard(canvas,state,{animation});assert.equal(depth,0);
 }
});

test('spike sight guides stop at objects and floor doors',()=>{
 const rows=['#######','#..#..#','#..!...','#..r...','#.....#','#######'];
 const lines=spikeSightLines(rows);
 assert.equal(lines.length,2);
 assert.ok(lines.every(line=>line.from.y===2.5&&line.to.y===2.5));
 assert.ok(lines.some(line=>line.to.x===1.05));
 assert.ok(lines.some(line=>line.to.x===6.95));
});

test('a floor door occupied by Blobbo does not hide him from a spike',()=>{
 const rows=['#####','#!r.#','#####'];
 assert.equal(spikeSightLines(rows).length,0);
 assert.equal(spikeSightLines(rows,{x:2,y:1}).length,1);
});

function drawnPlantAngles(state){
 const angles=[];
 const ctx=new Proxy({rotate(angle){angles.push(angle);}}, {get(target,key){return key in target?target[key]:()=>{};}});
 drawBoard({width:0,height:0,getContext:()=>ctx},state);
 return angles;
}

test('all four growing vines draw their stems in the tip direction in every animation frame',()=>{
 for(const [tip,angle,plant,player]of[
  ['P',0,[1,3],[5,3]],['V',Math.PI/2,[3,1],[3,5]],
  ['Q',Math.PI,[5,3],[1,3]],['N',Math.PI*1.5,[3,5],[3,1]],
 ]){
  const rows=Array.from({length:7},(_,y)=>Array.from({length:7},(_,x)=>x===0||y===0||x===6||y===6?'#':'.'));
  rows[1][5]='E';rows[plant[1]][plant[0]]=tip;rows[player[1]][player[0]]='@';
  let state=createState({rows:rows.map(r=>r.join(''))});
  for(let turn=1;turn<=3;turn++){
   const before=JSON.stringify(state);
   const grown=step(state,'W',{trace:true});
   assert.equal(JSON.stringify(state),before,'growth must preserve the undo state');
   for(const frame of grown.frames){
    const angles=drawnPlantAngles(frame);
    assert.ok(angles.length>=turn);
    assert.ok(angles.every(value=>value===angle),`${tip}: stems and tip must have matching rotations`);
   }
   assert.deepEqual(drawnPlantAngles(grown),Array(turn+1).fill(angle));
   state=grown;
  }
 }
});

test('cutting the tip and a stem leaves disconnected vertical stems oriented and undo snapshots intact',()=>{
 let state=createState({rows:['#######','#..@SE#','#.....#','#.....#','#.....#','#..N..#','#######']});
 for(const action of 'WWWRLD')state=step(state,action);
 assert.equal(state.tiles[2][3],'.','the tip has been cut');
 assert.deepEqual(drawnPlantAngles(state),Array(3).fill(Math.PI*1.5));
 const before=JSON.stringify(state),cut=step(state,'D',{trace:true});
 assert.equal(cut.tiles[3][3],'.');
 assert.equal(cut.vineDirections['3,3'],undefined);
 assert.deepEqual(drawnPlantAngles(cut),Array(2).fill(Math.PI*1.5));
 assert.deepEqual(drawnPlantAngles(cut.frames[0]),Array(2).fill(Math.PI*1.5));
 assert.equal(JSON.stringify(state),before);
 assert.deepEqual(drawnPlantAngles(state),Array(3).fill(Math.PI*1.5));
 cut.vineDirections['3,4']='P';
 assert.equal(cut.frames[0].vineDirections['3,4'],'N','animation snapshots own their direction data');
});

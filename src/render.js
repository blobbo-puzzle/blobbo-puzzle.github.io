// Original canvas artwork: no sprites or level data from the Macintosh game.
export const CELL = 32;
const C={ink:'#3c3b2e',gold:'#ecc348',shadow:'#b38a27',light:'#ffe892',green:'#559545',darkGreen:'#315f32'};
// These are independently drawn contours, not scaled versions of the standing
// sprite. The reference has two long oozing poses: the mound (and eyes) crosses
// a stretched, anchored body before the trailing end gathers into the next cell.
// Timing is a reconstruction; the original Move resource has no decoded clock.
const BLOB_POSES={
 rest:{
  outline:[[9,2],[21,2],[25,5],[27,10],[28,20],[30,27],[28,29],[24,28],[22,24],[20,29],[17,31],[14,29],[12,25],[9,29],[6,28],[5,23],[4,15],[5,8]],
  light:[[8,7],[11,4],[20,4],[22,6],[11,6],[8,12],[7,21],[6,15]],
  shade:[[25,10],[27,18],[28,26],[26,26],[23,21],[24,14]],
  eyes:[[12.5,13,3.6,5.5],[20.3,13,3.6,5.5]]
 },
 compress:{
  outline:[[3,26],[5,19],[8,13],[14,10],[24,11],[28,16],[30,25],[27,29],[23,27],[20,30],[16,29],[13,26],[9,29],[5,29]],
  light:[[6,21],[9,15],[15,12],[22,13],[22,15],[13,15],[9,20]],
  shade:[[26,18],[29,25],[26,27],[22,25],[18,28],[17,26],[22,23]],
  eyes:[[15,20,3.5,4.4],[22,20,3.5,4.4]]
 },
 spread:{
  outline:[[2,28],[3,24],[10,22],[15,18],[19,13],[24,12],[30,13],[35,17],[40,21],[49,22],[55,24],[62,25],[62,29],[47,29],[35,28],[27,30],[17,29],[8,30],[2,30]],
  light:[[4,26],[12,23],[18,18],[21,15],[27,15],[25,17],[20,19],[17,24],[8,27]],
  shade:[[29,17],[33,18],[40,23],[51,24],[60,27],[46,27],[35,25],[26,28],[24,26]],
  eyes:[[24,21,3.1,4.1],[31,21,3.1,4.1]]
 },
 reach:{
  outline:[[2,28],[8,26],[18,25],[26,22],[32,17],[36,13],[43,12],[49,15],[52,20],[57,23],[62,24],[62,29],[52,29],[46,28],[40,30],[30,29],[20,30],[10,29],[2,30]],
  light:[[6,28],[20,26],[29,22],[35,17],[39,15],[44,15],[41,18],[35,19],[30,24],[20,28]],
  shade:[[47,17],[51,22],[59,26],[60,27],[51,27],[45,26],[38,28],[35,27],[43,23]],
  eyes:[[40,21,3.1,4.1],[47,21,3.1,4.1]]
 },
 gather:{
  outline:[[17,29],[24,26],[32,23],[36,18],[38,10],[42,5],[50,4],[55,7],[58,13],[60,23],[62,28],[58,29],[54,26],[51,30],[47,30],[44,27],[39,30],[34,28],[27,30]],
  light:[[27,27],[35,23],[39,18],[40,11],[44,7],[50,6],[53,8],[45,8],[42,13],[40,23],[34,26]],
  shade:[[55,11],[58,18],[59,26],[56,25],[52,22],[53,16]],
  eyes:[[45,15,3.5,5.1],[52,15,3.5,5.1]]
 },
 verticalSpread:{
  outline:[[8,2],[12,3],[15,8],[19,12],[20,18],[23,22],[23,30],[25,36],[25,42],[28,49],[28,60],[25,62],[23,57],[21,48],[18,43],[17,35],[14,31],[13,24],[9,19],[8,12]],
  light:[[9,5],[11,7],[12,14],[16,20],[16,25],[19,31],[18,34],[14,29],[12,22],[9,17]],
  shade:[[18,17],[21,23],[21,30],[24,38],[24,45],[27,54],[26,59],[23,51],[21,45],[20,37],[17,31]],
  eyes:[[13.8,22,2.7,4.0],[19.3,25,2.7,4.0]]
 },
 verticalReach:{
  outline:[[8,2],[11,6],[12,16],[15,22],[16,29],[19,34],[23,37],[25,43],[25,49],[28,55],[27,61],[24,62],[20,57],[18,50],[14,46],[13,40],[13,34],[10,29],[10,23],[7,15],[7,7]],
  light:[[9,7],[10,18],[13,24],[14,31],[18,38],[18,43],[15,42],[15,35],[11,29],[10,23],[8,16]],
  shade:[[22,39],[24,44],[24,50],[26,57],[24,59],[20,53],[20,49],[17,46],[18,42]],
  eyes:[[17.3,40,2.7,4.0],[22,43,2.7,4.0]]
 },
 verticalGather:{
  outline:[[8,18],[12,22],[13,28],[17,34],[22,37],[26,42],[28,49],[29,58],[26,61],[23,57],[20,62],[17,62],[14,57],[10,60],[7,58],[6,51],[7,44],[10,38],[10,32],[7,27]],
  light:[[9,23],[12,29],[13,35],[15,39],[11,44],[9,50],[9,55],[8,50],[9,44],[12,38],[11,31]],
  shade:[[24,43],[26,48],[27,57],[25,57],[22,51],[23,47]],
  eyes:[[14.4,47,3.4,5.1],[21.4,47,3.4,5.1]]
 },
 verticalGatherUp:{
  outline:[[9,3],[21,3],[25,6],[27,12],[27,20],[24,26],[22,29],[22,36],[25,44],[23,45],[19,36],[18,29],[15,28],[12,30],[9,27],[6,28],[5,22],[5,14],[6,7]],
  light:[[8,9],[11,5],[20,5],[22,7],[12,7],[9,12],[8,22],[7,16]],
  shade:[[24,10],[26,16],[26,21],[22,26],[20,30],[20,35],[23,41],[21,39],[18,30],[20,24],[23,20]],
  eyes:[[12.5,14,3.5,5.1],[20,14,3.5,5.1]]
 }
};
const BLOB_DIRECTIONS={L:[-1,0],R:[1,0],U:[0,-1],D:[0,1]};

// Return canvas-independent geometry so the footprint can be checked against
// the two traversed squares. Explicit endpoints are immune to easing changes.
export function blobPose({from={x:0,y:0},to=from,cycle=0,facing='D',pushing=false,blocked=false}={}){
 const t=Math.max(0,Math.min(1,Number.isFinite(cycle)?cycle:0));
 const moving=from.x!==to.x||from.y!==to.y;
 const horizontal=facing==='L'||facing==='R';
 let phase=!moving?'rest':t<.10?'compress':t<.45?'spread':t<.77?'reach':t<.94?'gather':'rest';
 if(t===0)phase='rest';
 if(blocked&&t>0&&t<1)phase='compress';
 let key=phase,origin={x:from.x*CELL,y:from.y*CELL};
 if(phase==='rest'&&t>=.94)origin={x:to.x*CELL,y:to.y*CELL};
 const extended=['spread','reach','gather'].includes(phase);
 if(extended){
  origin={x:Math.min(from.x,to.x)*CELL,y:Math.min(from.y,to.y)*CELL};
  if(!horizontal)key='vertical'+phase[0].toUpperCase()+phase.slice(1);
  if(facing==='U'&&phase==='gather')key='verticalGatherUp';
 }
 const source=BLOB_POSES[key];
 const transform=([x,y])=>{
  if(extended&&facing==='L')x=64-x;
  if(extended&&facing==='U'&&key!=='verticalGatherUp'){x=32-x;y=64-y;}
  if(!extended&&phase==='compress'&&facing==='L')x=32-x;
  return [x+origin.x,y+origin.y];
 };
 let outline=source.outline.map(p=>p.slice());
 // A push lifts the long leading lip to meet the object, like the separate
 // original Push silhouette. No overshoot into the object's square is needed.
 if(pushing&&extended&&horizontal&&phase!=='gather'){
  outline=outline.map(([x,y])=>[x,x>=55?y-(x-54)*1.35:y]);
 }
 if(pushing&&extended&&!horizontal&&phase!=='gather')outline=outline.map(([x,y])=>[y>=55?x-(y-54)*.4:x,y]);
 return {phase,origin,outline:outline.map(transform),light:source.light.map(transform),shade:source.shade.map(transform),
  eyes:source.eyes.map(([x,y,rx,ry])=>[...transform([x,y]),rx,ry]),facing};
}

// Independently drawn impact contours. The original Ball sheet has a descending
// ball and two compressed final poses; Left/Right Arrow have five impact poses.
// These shapes and durations are a reconstruction, not copied bitmap frames.
const IMPACT_POSES={
 pressed:{outline:[[6,15],[12,13],[22,14],[27,18],[29,25],[31,29],[25,30],[22,28],[18,31],[14,29],[10,31],[4,29],[2,25]],light:[[6,22],[11,16],[20,16],[14,18],[10,24]],shade:[[24,20],[28,27],[24,28],[20,27]],eyes:[[11,23,3.5,4],[21,23,3.5,4]]},
 flat:{outline:[[1,29],[5,26],[10,27],[14,25],[20,26],[25,26],[31,28],[31,30],[26,31],[22,30],[17,31],[11,30],[6,31],[1,31]],light:[[3,28],[9,28],[14,27],[22,28],[28,28],[27,29],[10,29]],shade:[[4,30],[12,30],[17,29],[24,30],[29,30]],eyes:[[11.5,28.5,3.5,2],[20,28.5,3.5,2]]},
 pierced:{outline:[[11,2],[23,3],[27,7],[29,12],[30,22],[31,27],[28,29],[24,27],[21,30],[17,30],[14,26],[10,29],[8,26],[7,21],[13,19],[8,16],[7,10]],light:[[11,8],[14,4],[22,5],[24,7],[15,7],[12,12]],shade:[[26,12],[28,21],[29,26],[26,25],[23,20]],eyes:[[16,13,3.6,5.6],[24,14,3.4,5.4]]},
 folded:{outline:[[14,6],[23,5],[28,9],[29,14],[25,19],[25,24],[29,29],[24,30],[20,26],[16,30],[11,29],[13,24],[12,21],[18,18],[11,17],[12,11]],light:[[15,10],[18,7],[23,7],[24,9],[18,10]],shade:[[25,12],[27,15],[23,20],[22,25],[19,23]],eyes:[[18,14,3.2,4.6],[25,13,3.1,4.3]]},
 crumpled:{outline:[[18,10],[25,10],[28,13],[27,18],[24,20],[25,25],[29,30],[25,31],[21,27],[19,31],[14,30],[15,25],[17,21],[15,18],[15,14]],light:[[18,12],[24,12],[24,14],[18,15]],shade:[[24,20],[24,25],[27,29],[24,28],[21,25]],eyes:[[19,15,2.8,3.8],[25,15,2.7,3.8]]}
};
const clamp=value=>Math.max(0,Math.min(1,value));
export function deathPose(death,progress=1,facing='D'){
 const t=clamp(Number.isFinite(progress)?progress:1),at=death.at,cause=death.cause;
 let key='rest',phase='impact',sink=0,scale=1,alpha=1;
 if(cause==='ball'){key=t<.14?'rest':t<.34?'pressed':'flat';phase=t<.34?'crush':'flattened';}
 else if(cause==='arrow'||cause==='spike'){key=t<.12?'rest':t<.32?'pierced':t<.55?'folded':'crumpled';phase=t<.55?'pierce':'crumpled';}
 else if(cause==='water'){key=t<.24?'rest':'pressed';sink=30*clamp((t-.15)/.7);alpha=t>.86?0:1;phase='sink';}
 else if(cause==='hole'){scale=1-clamp(t/.8);phase='fall';}
 else if(cause==='fire'){key=t<.48?'rest':t<.72?'pressed':'flat';phase='scorch';}
 const source=BLOB_POSES[key]||IMPACT_POSES[key];
 const arrowDirection=({'>':'R','<':'L','^':'U','v':'D'})[death.tile];
 const direction=arrowDirection||(death.from?(death.from.x>at.x?'L':death.from.x<at.x?'R':death.from.y>at.y?'U':'D'):facing);
 const mirror=direction==='L'&&(cause==='arrow'||cause==='spike');
 const transform=([x,y])=>{
  if(mirror)x=32-x;
  return [at.x*CELL+16+(x-16)*scale,at.y*CELL+16+(y-16)*scale+sink];
 };
 const pose={phase,outline:source.outline.map(transform),light:source.light.map(transform),shade:source.shade.map(transform),
  eyes:source.eyes.map(([x,y,rx,ry])=>[...transform([x,y]),rx*scale,ry*scale]),facing:direction,alpha,
  charred:cause==='fire'&&t>.25,closed:t>.7&&(cause==='arrow'||cause==='spike')};
 if(death.from&&death.tile){
  const travel=clamp(t/(cause==='ball'?.34:.23));
  // Stop the arrow partway through the body; its feathered tail stays outside.
  const [dx,dy]=BLOB_DIRECTIONS[direction];
  const target=cause==='arrow'?{x:at.x-dx*.35,y:at.y-dy*.35}:at;
  pose.object={tile:death.tile,x:death.from.x+(target.x-death.from.x)*travel,y:death.from.y+(target.y-death.from.y)*travel};
  if(cause==='ball'&&t>.34&&t<.8)pose.object.y-=Math.sin((t-.34)/.46*Math.PI*2)*.025;
 }
 return pose;
}

function drawDeath(ctx,death,progress,facing){
 const pose=deathPose(death,progress,facing),x=death.at.x*CELL,y=death.at.y*CELL;
 ctx.save();
 if(death.cause==='water'||death.cause==='hole'){
  ctx.beginPath();ctx.rect(x+2,y+3,28,27);ctx.clip();
 }
 ctx.globalAlpha=pose.alpha;
 if(pose.alpha&&pose.eyes[0][2]>0)drawBlob(ctx,{pose});
 ctx.restore();
 if(pose.object)drawTile(ctx,pose.object.tile,pose.object.x*CELL,pose.object.y*CELL);
 if(death.cause==='water'&&progress>.5){
  ctx.strokeStyle='#e5f3e4';ctx.lineWidth=1;
  for(const [bx,by,r]of [[9,9,2],[21,17,1.5],[16,25,1]]){ctx.beginPath();ctx.arc(x+bx,y+by,r,0,Math.PI*2);ctx.stroke();}
 }
}

function drawBlob(ctx,options={}){
 const pose=options.pose||blobPose(options);
 const polygon=(points,fill,stroke=false)=>{ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle='#362d16';ctx.lineWidth=1.5;ctx.lineJoin='round';ctx.stroke();}};
 const oval=(x,y,rx,ry,fill)=>{ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();};
 polygon(pose.outline,pose.charred?'#34332b':'#ffd21b',true);
 ctx.save();ctx.clip();
 polygon(pose.shade,pose.charred?'#20231e':'#cb9209');
 polygon(pose.light,pose.charred?'#575646':'#fff34b');
 ctx.restore();
 const [dx,dy]=BLOB_DIRECTIONS[pose.facing]||BLOB_DIRECTIONS.D;
 for(const [x,y,rx,ry]of pose.eyes){
  oval(x,y,rx,ry,'#332d18');
  oval(x-.35,y-.55,Math.max(.25,rx-1.15),Math.max(.25,ry-1.25),'#fff274');
  if(pose.closed){ctx.strokeStyle='#292a23';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(x-rx*.6,y);ctx.lineTo(x+rx*.6,y);ctx.stroke();continue;}
  oval(x+dx*.85,y+dy*.55,Math.max(.8,rx*.36),ry*.57,'#292a23');
  oval(x+dx*.85-.35,y+dy*.55-ry*.27,.5,.75,'#fffef0');
 }
}
export function drawTile(ctx,id,x=0,y=0,size=32,phase=0,options={}){
 ctx.save();ctx.translate(x,y);ctx.scale(size/32,size/32);
 const r=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
 const p=(pts,c)=>{ctx.fillStyle=c;ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();};
 const line=(pts,c,w=1)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();};
 const circle=(x,y,rad,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,rad,0,Math.PI*2);ctx.fill();};
 if(id==='#'){
  r(0,0,32,32,'#a8aba5');p([[0,0],[32,0],[27,5],[5,5],[5,27],[0,32]],'#ebebe5');p([[0,32],[5,27],[27,27],[27,5],[32,0],[32,32]],'#818781');r(6,6,20,20,'#c4c7bf');r(7,7,18,2,'#ced1c8');r(0,0,32,1,'#f3f3ed');
 } else if(id==='$'){
  r(4,24,25,3,'#30352b18');p([[4,10],[9,6],[25,6],[28,11],[28,25],[4,25]],'#59462a');r(5,12,22,12,'#bd9140');r(6,13,20,2,'#dab057');p([[5,10],[9,7],[24,7],[27,10]],'#e6c66f');r(5,10,22,3,'#b68f49');r(8,8,2,16,'#e8ce85');r(22,8,2,16,'#efce78');r(5,17,22,1,'#997234');r(15,14,4,5,'#66512f');r(16,14,2,3,'#f5d67a');r(5,24,23,1,'#745b30');
 } else if(id==='@'){
  drawBlob(ctx,{facing:options.facing||'D'});
 } else if(id==='O'){
  r(5,27,23,2,'#42472c1b');p([[10,3],[22,3],[22,5],[26,5],[26,9],[29,9],[29,23],[26,23],[26,27],[22,27],[22,29],[10,29],[10,27],[6,27],[6,23],[3,23],[3,9],[6,9],[6,5],[10,5]],'#282c28');p([[10,4],[21,4],[21,6],[25,6],[25,10],[28,10],[28,22],[24,26],[12,28],[7,24],[4,20],[4,10],[7,6]],'#393e38');circle(12,10,3,'#92968a');circle(21,11,2.5,'#9ba093');circle(17,18,2.5,'#808779');r(9,6,5,1,'#b3b5a6');
 } else if('><^v'.includes(id)){
  ctx.translate(16,16);ctx.rotate(({'>':0,'v':1,'<':2,'^':3}[id])*Math.PI/2);ctx.translate(-16,-16);
  p([[2,12],[7,12],[11,15],[24,15],[24,11],[31,16],[24,21],[24,17],[11,17],[7,20],[2,20],[5,16]],'#344f36');r(7,15,18,2,'#91a06a');p([[2,12],[6,12],[10,15],[5,15]],'#65a067');p([[2,20],[6,20],[10,17],[5,17]],'#77ad6b');p([[25,13],[29,16],[25,16]],'#d2d4bb');
 } else if('ruld'.includes(id)){
  // A floor door, visually distinct from a movable, feathered flying arrow.
  r(3,3,26,26,'#e8ebdf');line([[3,8],[3,3],[8,3]],'#b2bba7');line([[24,3],[29,3],[29,8]],'#b2bba7');line([[29,24],[29,29],[24,29]],'#b2bba7');line([[8,29],[3,29],[3,24]],'#b2bba7');
  ctx.translate(16,16);ctx.rotate(({r:0,d:1,l:2,u:3}[id])*Math.PI/2);ctx.translate(-16,-16);
  p([[7,12],[18,12],[18,7],[27,16],[18,25],[18,20],[7,20]],'#426769');p([[8,13],[19,13],[19,10],[25,16],[19,22],[19,19],[8,19]],'#719998');r(9,14,9,1,'#bad2c2');
 } else if(id==='/'||id==='\\'){
  if(id==='\\'){ctx.translate(32,0);ctx.scale(-1,1);}p([[1,27],[27,1],[31,1],[31,5],[5,31],[1,31]],'#767e76');p([[1,26],[26,1],[30,1],[5,26]],'#e0e1d8');line([[4,29],[29,4]],'#adb3a5',2);
 } else if(id==='E'){
  r(2,2,28,28,'#4d5a4b');r(3,3,26,26,'#ced0bf');for(let i=0;i<5;i++){r(5+i*4,5,2,22-i*4,'#687263');r(7+i*4,5,2,20-i*4,'#eff0df');r(5+i*4,25-i*4,21-i*4,2,'#e9ead9');}r(2,29,28,1,'#364334');
 } else if(id==='M'){
  p([[6,4],[25,4],[29,8],[29,25],[25,28],[7,28],[3,24],[3,9]],'#898d88');p([[7,5],[24,5],[28,9],[28,24],[24,27],[8,27],[4,23],[4,10]],'#e3e6da');r(7,7,16,3,'#fffef5');r(25,11,2,13,'#b7c1ae');r(8,24,15,2,'#c1c9b6');circle(11,13,1,'#b7c5a9');circle(21,20,1.3,'#bbc5b4');
 } else if(id==='!'){
  // Independently drawn four-point steel trap, distinct from a bowling ball.
  p([[16,1],[20,10],[31,16],[21,21],[16,31],[11,21],[1,16],[11,11]],'#555e5c');
  p([[16,3],[17,13],[28,16],[18,18],[16,28],[14,18],[4,16],[14,14]],'#c7cebf');
  p([[9,9],[23,9],[23,23],[9,23]],'#68726b');r(10,10,12,12,'#a5afa0');r(11,11,10,2,'#e0e3d1');r(11,20,10,2,'#7b867b');
  circle(16,16,4,'#584b44');circle(16,16,2.2,'#b76c4b');r(15,14,2,1,'#efb483');
 } else if(id==='F'){
  p([[3,29],[6,20],[9,23],[10,10],[14,16],[18,2],[22,15],[24,11],[26,22],[30,28]],'#c88637');p([[5,27],[9,19],[11,23],[13,11],[17,19],[20,7],[22,20],[26,25],[26,29]],'#efb640');p([[10,28],[14,20],[17,25],[21,16],[21,26],[25,29]],'#ffe798');r(4,29,25,2,'#9b7e3d');
 } else if(id==='~'){
  r(0,0,32,32,'#98c6c5');for(let j=5;j<32;j+=10){let s=(j+phase)%7;r(s,j,10,1,'#d5e8d7');r(s+4,j+2,9,1,'#c3e0d0');r(s+19,j+1,7,1,'#659da1');}
 } else if('PQVNp'.includes(id)){
  const angle=({'P':0,'V':1,'Q':2,'N':3}[id==='p'?options.vineDirection:id]??0);ctx.translate(16,16);ctx.rotate(angle*Math.PI/2);ctx.translate(-16,-16);
  r(0,15,32,4,'#375d34');r(0,15,32,2,'#79a857');p([[7,16],[3,10],[3,5],[9,7],[12,12],[12,16]],'#5c9848');p([[19,17],[18,23],[23,28],[28,27],[26,21]],'#4a843e');line([[5,7],[10,15]],'#98bc68');line([[21,19],[26,25]],'#85ad5f');if(id!=='p'){p([[22,15],[26,9],[30,12],[31,17],[28,21],[23,20]],'#72a350');r(27,13,2,2,'#365835');}
 } else if(id==='T'){
  p([[13,30],[18,30],[20,16],[17,8],[14,10]],'#886644');r(16,20,3,2,'#c3a26a');r(15,26,3,2,'#c3a26a');p([[17,9],[8,4],[2,8],[0,14],[8,10],[14,12],[6,14],[3,22],[10,18],[17,14],[23,19],[28,23],[27,15],[21,11],[29,12],[32,8],[25,4]],'#456e36');p([[16,9],[9,6],[3,10],[9,8],[15,11],[19,8],[25,6],[29,9],[24,8]],'#8db060');
 } else if(id==='A'){
  p([[7,27],[10,29],[25,9],[22,6]],'#8d643a');p([[6,26],[8,27],[23,7],[21,6]],'#c4a369');p([[17,6],[22,3],[29,8],[27,14],[22,13],[20,10],[15,10]],'#4b5a54');p([[18,6],[22,4],[28,8],[25,12],[21,10]],'#bbc7bc');
 } else if(id==='C'){
  p([[10,10],[22,10],[20,26],[12,26]],'#987143');r(9,6,14,6,'#b48b50');r(11,7,10,2,'#dbb87a');r(13,12,6,12,'#c19960');r(13,15,2,2,'#a07c4c');r(17,21,2,1,'#8c6c45');
 } else if(id==='S'){
  circle(8,23,5,'#586b65');circle(20,25,5,'#586b65');circle(8,23,2.5,'#f6f7ed');circle(20,25,2.5,'#f6f7ed');p([[9,21],[13,20],[26,4],[23,3]],'#87948d');p([[18,22],[14,18],[11,2],[8,3],[10,19]],'#c2c9bc');r(13,16,3,3,'#47594f');
 } else if(id==='B'||id==='b'){
  if(id==='b'){r(0,0,32,32,'#98c6c5');r(2,5,9,1,'#d5e8d7');r(20,27,10,1,'#d5e8d7');}
  p([[0,17],[5,10],[23,8],[31,14],[28,21],[9,25]],'#775e3d');p([[3,16],[7,12],[23,10],[29,14],[26,19],[9,22]],'#c39c5b');p([[7,15],[22,12],[25,14],[23,18],[10,20]],'#6c5537');line([[4,16],[28,12]],'#dec48a',1);
 } else if(id==='h'){
  p([[7,7],[24,7],[29,12],[29,23],[24,28],[7,28],[3,23],[3,12]],'#b0b5a5');p([[8,9],[23,9],[27,13],[27,22],[23,26],[8,26],[5,22],[5,13]],'#3f4840');r(9,11,13,2,'#303c35');
 } else if(id==='K'){
  r(11,8,12,21,'#7a3d2e');r(12,9,10,18,'#b86245');r(13,10,2,15,'#df9570');r(13,16,8,6,'#eddfb6');r(15,4,5,5,'#6d7462');r(15,3,11,3,'#4d594c');line([[21,7],[26,10],[27,19]],'#495a4c',2);r(24,19,5,6,'#617461');
 } else if(id!=='.'&&id!==' '){ctx.fillStyle='#5f7751';ctx.font='bold 19px monospace';ctx.textAlign='center';ctx.fillText(id,16,24);}
 ctx.restore();
}
export function spikeSightLines(rows,player=null){
 const lines=[];
 for(let y=0;y<rows.length;y++)for(let x=0;x<rows[y].length;x++)if(rows[y][x]==='!'){
  for(const[dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){
   let ex=x,ey=y;
   for(let nx=x+dx,ny=y+dy;rows[ny]?.[nx]!==undefined;nx+=dx,ny+=dy){
    if(rows[ny][nx]!=='.'&&!(player?.x===nx&&player?.y===ny))break;
    ex=nx;ey=ny;
   }
   if(ex!==x||ey!==y)lines.push({from:{x:x+.5+dx*.42,y:y+.5+dy*.42},to:{x:ex+.5+dx*.45,y:ey+.5+dy*.45}});
  }
 }
 return lines;
}
export function drawBoard(canvas,state,{editor=false,hover=null,animation=null}={}){
 const rows=state.tiles||state.rows.map(r=>Array.from(r));const w=state.width||rows[0].length,h=state.height||rows.length;
 if(canvas.width!==w*CELL||canvas.height!==h*CELL){canvas.width=w*CELL;canvas.height=h*CELL;}
 const death=!editor&&state.status==='dead'?state.death:null;
 const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.fillStyle='#fdfdf7';ctx.fillRect(0,0,canvas.width,canvas.height);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  if(editor){ctx.strokeStyle='#c0cdbd50';ctx.lineWidth=.5;ctx.strokeRect(x*CELL+.5,y*CELL+.5,CELL,CELL);}
  else if(rows[y][x]==='.'&&(x+y)%3===0){ctx.fillStyle='#c6cbb626';ctx.fillRect(x*CELL+7,y*CELL+23,1,1);}
  if(state.underlays?.[`${x},${y}`]==='~')drawTile(ctx,'~',x*CELL,y*CELL);
  if(!death?.from||death.from.x!==x||death.from.y!==y)drawTile(ctx,rows[y][x],x*CELL,y*CELL,CELL,0,{vineDirection:state.vineDirections?.[`${x},${y}`]});
 }
 // Dashed sight guides expose the same clear rows and columns the traps scan.
 ctx.save();ctx.strokeStyle='#aa73536b';ctx.lineWidth=1;ctx.setLineDash([2,4]);
 for(const{from,to}of death?[]:spikeSightLines(rows,state.player)){
  ctx.beginPath();ctx.moveTo(from.x*CELL,from.y*CELL);ctx.lineTo(to.x*CELL,to.y*CELL);ctx.stroke();
 }
 ctx.restore();
 if(animation?.objects)for(const object of animation.objects)drawTile(ctx,object.tile,object.x*CELL,object.y*CELL);
 if(death)drawDeath(ctx,death,animation?.deathProgress??1,state.facing||'D');
 else if(state.player){
  const facing=animation?.facing||state.facing||'D';
  const from=animation?.from||state.player,[dx,dy]=BLOB_DIRECTIONS[facing]||BLOB_DIRECTIONS.D;
  const to=animation?.to||(animation?.player?{x:from.x+dx,y:from.y+dy}:from);
  drawBlob(ctx,{from,to,cycle:animation?.cycle||0,facing,pushing:animation?.pushing,blocked:animation?.blocked});
 }
 if(hover&&editor){ctx.fillStyle='#67925130';ctx.fillRect(hover.x*CELL,hover.y*CELL,CELL,CELL);ctx.strokeStyle='#3e6a39';ctx.lineWidth=1;ctx.strokeRect(hover.x*CELL+.5,hover.y*CELL+.5,CELL-1,CELL-1);}
}
export function tileCanvas(id,size=32){const c=document.createElement('canvas');c.width=c.height=32;c.style.width=c.style.height=size+'px';drawTile(c.getContext('2d'),id);c.setAttribute('aria-hidden','true');return c;}

import {createState,step,validateLevel,TILE_INFO} from './engine.js';
import {LEVELS,CHAPTERS,generateLevel} from './levels.js';
import {drawBoard,tileCanvas} from './render.js';
import {BlobboAudio} from './audio.js';
import {selectedCollection,roomIndex} from './collections.js';
import {PICKUP_HINT_DURATION,claimPickupHint} from './pickup-hints.js';
import {CHALLENGE_LEVELS,CHALLENGE_CHAPTERS} from './challenges.js';

const $=id=>document.getElementById(id);
const STORE='blobbo-browser-v1';
let storageOK=true;
function readSaved(){try{const value=JSON.parse(localStorage.getItem(STORE));return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}catch{storageOK=false;return {};}}
let saved=readSaved();
saved.pickupHints=saved.pickupHints&&typeof saved.pickupHints==='object'&&!Array.isArray(saved.pickupHints)?saved.pickupHints:{};
saved.best=typeof saved.best==='object'&&saved.best?saved.best:{};
saved.rooms=Array.isArray(saved.rooms)?saved.rooms.filter(r=>validateLevel(r).valid):[];
function persist(){try{localStorage.setItem(STORE,JSON.stringify(saved));}catch{storageOK=false;toast('Browser storage is unavailable. Export your rooms to keep them.');}updateSaveLabel();}
function updateSaveLabel(){$('save-state').textContent=storageOK?'Progress saved on this browser':'Storage unavailable — export rooms to keep them';}
const collections={regular:{levels:LEVELS,chapters:CHAPTERS},challenge:{levels:CHALLENGE_LEVELS,chapters:CHALLENGE_CHAPTERS}};
let collection=selectedCollection(saved);
let activeLevels=collections[collection].levels,activeChapters=collections[collection].chapters;
function savedRoomIndex(){return roomIndex(saved,collection,activeLevels);}
let currentIndex=savedRoomIndex();
let level=activeLevels[currentIndex],state=createState(level),history=[],mode='play',testMode=false;
let draft=saved.draft&&Array.isArray(saved.draft.rows)?structuredClone(saved.draft):blankRoom();
let editHistory=[],selectedTile='#',hover=null,painting=false,lastPaint='';
let soundOn=saved.audioVersion===2?!!saved.sound:true,musicOn=saved.audioVersion===2?!!saved.music:false,lastMove=0;
let fullMotion=saved.fullMotion!==false,audioChoiceMade=saved.audioVersion===2;
const audio=new BlobboAudio();audio.setEffects(soundOn);audio.setMusic(musicOn);
let animationId=0,animationRunning=false,queuedMoves=[],animationFrame=0;
const board=$('board');
let pickupHintTool=null,pickupHintTimer;
function hidePickupHint(){clearTimeout(pickupHintTimer);pickupHintTool=null;$('pickup-hint').hidden=true;}
function positionPickupHint(){
 const bubble=$('pickup-hint');if(bubble.hidden)return;
 if(mode!=='play'||state.status!=='playing'||state.carrying!==pickupHintTool){hidePickupHint();return;}
 const cell=board.clientWidth/state.tiles[0].length,center=(state.player.x+.5)*cell;
 const width=bubble.offsetWidth,height=bubble.offsetHeight;
 const left=Math.max(6,Math.min(center-width/2,board.clientWidth-width-6));
 const above=state.player.y*cell-height-10;
 const side=above>=6?'above':'below';
 const top=side==='above'?above:(state.player.y+1)*cell+10;
 bubble.style.left=left+'px';bubble.style.top=Math.max(6,Math.min(top,board.clientHeight-height-6))+'px';
 bubble.dataset.side=side;bubble.style.setProperty('--tail-x',Math.max(10,Math.min(center-left,width-10))+'px');
}
function showPickupHint(tile){
 hidePickupHint();
 if(!claimPickupHint(saved.pickupHints,level))return;
 persist();pickupHintTool=tile;
 $('pickup-name').textContent=TILE_INFO.find(piece=>piece.id===tile)?.label||'Tool';
 $('pickup-hint').hidden=false;positionPickupHint();
 pickupHintTimer=setTimeout(hidePickupHint,PICKUP_HINT_DURATION);
}

function blankRoom(width=17,height=13){return {id:'custom-'+Date.now(),name:'My curious room',chapter:'custom',description:'A room from your workshop.',hint:'Experiment, undo, and try another route.',rows:Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x===0||y===0||x===width-1||y===height-1?'#':x===2&&y===2?'@':x===width-3&&y===height-3?'E':x===width-4&&y===3?'$':'.').join(''))};}
function toast(message,duration=4200){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').hidden=true,duration);}
function rememberAudio(){saved.audioVersion=2;saved.sound=soundOn;saved.music=musicOn;audioChoiceMade=true;persist();}
async function unlockAudio(){const ready=await audio.unlock();updateSound();return ready;}
function playSound(kind){unlockAudio();audio.playUI(kind).then(updateSound);}
function updateSound(){const info=audio.getState(),running=info.contextState==='running';$('sound').textContent=soundOn?(running?'Sound on':'Enable sound'):'Sound off';$('sound').setAttribute('aria-pressed',soundOn&&running);$('music').textContent=musicOn?(running?'Music on':'Enable music'):'Music off';$('music').setAttribute('aria-pressed',musicOn&&running);$('audio-welcome').hidden=audioChoiceMade||running;$('motion').textContent=fullMotion?'Motion: classic':'Motion: reduced';$('motion').setAttribute('aria-pressed',fullMotion);}
async function enableAudio(withMusic=false){soundOn=true;if(withMusic)musicOn=true;audio.setEffects(soundOn);audio.setMusic(musicOn);rememberAudio();const activation=unlockAudio();const pending=audio.playUI('select');const ready=await activation;await pending;if(!ready)toast(audio.getState().lastError||'Tap Enable sound again to let this browser start audio.');}
function chooseCollection(value){if(!Object.hasOwn(collections,value)||!collections[value].levels.length)return;collection=value;activeLevels=collections[value].levels;activeChapters=collections[value].chapters;saved.collection=collection;loadLevel(savedRoomIndex());}
function fillRoomGrid(){const grid=$('room-grid');grid.replaceChildren();activeLevels.forEach((room,i)=>{const b=document.createElement('button');b.textContent=String(i+1).padStart(2,'0');b.title=room.name;b.setAttribute('aria-label',`Room ${i+1}: ${room.name}${saved.best[room.id]!==undefined?', completed':''}`);b.className=(i===currentIndex&&!testMode?'current ':'')+(saved.best[room.id]!==undefined?'completed':'');if(i===currentIndex&&!testMode)b.setAttribute('aria-current','true');b.onclick=()=>loadLevel(i);grid.append(b);});$('progress-count').textContent=`${activeLevels.filter(l=>saved.best[l.id]!==undefined).length} / ${activeLevels.length}`;}
function loadLevel(index){cancelAnimation();currentIndex=Math.max(0,Math.min(activeLevels.length-1,index));level=activeLevels[currentIndex];state=createState(level);history=[];testMode=false;mode='play';saved[collection+'Current']=currentIndex;saved[collection+'RoomId']=level.id;persist();renderMode();board.focus({preventScroll:true});}
function renderMode(){
 $('collection').value=collection;
 const edit=mode==='edit',wasEditing=document.body.classList.contains('creating');
 document.body.classList.toggle('creating',edit);
 $('menu-toggle').hidden=edit;$('close-menu').hidden=edit;
 if(edit)showMenu(true);else if(wasEditing)hideMenu();
 $('game-window').classList.toggle('editing',edit);
 $('play-tab').setAttribute('aria-selected',!edit);$('editor-tab').setAttribute('aria-selected',edit);
 $('play-sidebar').hidden=edit;$('room-picker').hidden=edit||testMode;$('editor-sidebar').hidden=!edit;
 $('play-tools').hidden=edit;$('editor-tools').hidden=!edit;$('generator').hidden=!edit;
 $('back-editor').hidden=!testMode;$('next-room').hidden=testMode;
 if(edit){$('room-title').value=draft.name;$('room-width').value=draft.rows[0].length;$('room-height').value=draft.rows.length;}
 else {$('room-name').textContent=level.name;$('room-number').textContent=testMode?'PLAYTEST':`ROOM ${String(currentIndex+1).padStart(2,'0')}`;$('next-room').textContent=currentIndex===activeLevels.length-1?'All rooms…':'Next room →';}
 fillRoomGrid();render();fitBoard();
}
function fitBoard(){
 const rows=mode==='edit'?draft.rows:level.rows,stage=$('game-stage'),style=getComputedStyle(stage);
 const availableWidth=stage.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight)-10;
 const availableHeight=stage.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom)-$('game-window').querySelector('.titlebar').offsetHeight-10;
 const tileSize=Math.max(1,Math.floor(Math.min(availableWidth/rows[0].length,availableHeight/rows.length)));
 $('game-window').style.width=`${tileSize*rows[0].length+10}px`;
 positionPickupHint();
}
function updateTouchDrop(){
 const button=$('touch-drop');
 button.hidden=mode!=='play'||state.status!=='playing'||!state.carrying;
 button.disabled=animationRunning;
 if(button.hidden)return;
 const direction={U:['↑','up'],D:['↓','down'],L:['←','left'],R:['→','right']}[state.facing];
 const name=TILE_INFO.find(piece=>piece.id===state.carrying)?.label||'tool';
 $('touch-drop-direction').textContent=direction[0];
 button.setAttribute('aria-label',`Drop ${name.toLowerCase()} ${direction[1]}`);
 if(button.dataset.tool!==state.carrying){$('touch-drop-icon').replaceChildren(tileCanvas(state.carrying,26));button.dataset.tool=state.carrying;}
}
function dropHeldTool(){
 if(mode!=='play'||state.status!=='playing'||!state.carrying||animationRunning||$('dialog').open)return;
 const before=state.moves;move('X');
 if(state.moves===before)toast(state.message,2000);
 board.focus({preventScroll:true});
}
function render(draw=true){updateTouchDrop();positionPickupHint();if(mode==='edit'){drawBoard(board,draft,{editor:true,hover});$('board-overlay').hidden=true;$('death-controls').hidden=true;$('title-stripes').hidden=false;$('death-announcement').textContent='';$('chests-stat').textContent=`${draft.rows.join('').split('$').length-1}`;$('moves-stat').textContent='—';$('editor-undo').disabled=!editHistory.length;return;}
 if(draw)drawBoard(board,state);$('chests-stat').textContent=`${state.collected} / ${state.total}`;$('moves-stat').textContent=String(state.moves).padStart(3,'0');$('game-message').textContent=state.message||'Think one step ahead. You can always undo.';$('undo').disabled=!history.length;const best=saved.best[level.id];$('best-score').textContent=best!==undefined&&!testMode?`BEST ${best} MOVES`:'';
 $('drop').hidden=!state.carrying;$('inventory').replaceChildren();if(state.carrying){let row=document.createElement('div');row.className='inventory-item';row.append(tileCanvas(state.carrying));let text=document.createElement('span');text.textContent=`${TILE_INFO.find(t=>t.id===state.carrying)?.label||'Tool'} · X to drop`;row.append(text);$('inventory').append(row);}
 renderOverlay();}
function renderOverlay(){
 updateTouchDrop();
 const overlay=$('board-overlay'),dead=mode==='play'&&state.status==='dead'&&!animationRunning;
 $('death-controls').hidden=!dead;
 $('title-stripes').hidden=dead;
 $('death-announcement').textContent=dead?'Blobbo died. Z to undo, R to restart.':'';
 overlay.hidden=state.status!=='won'||animationRunning;overlay.replaceChildren();
 if(state.status!=='won')return;
 const card=document.createElement('div');card.className='result-card';
 card.innerHTML='<div class="result-icon">✧</div><h3>A room well tidied.</h3><p></p><div></div>';
 card.querySelector('p').textContent=`Every chest, safely home. ${state.moves} moves. ${testMode?'Your room works!':'On to the next little mystery.'}`;
 const primary=document.createElement('button');primary.className='primary';primary.textContent=testMode?'Back to editor':currentIndex===activeLevels.length-1?'Explore all rooms':'Next room →';primary.onclick=()=>testMode?enterEditor():nextRoom();primary.setAttribute('aria-keyshortcuts','Enter');const shortcut=document.createElement('kbd');shortcut.textContent='Enter';primary.append(' ',shortcut);
 const secondary=document.createElement('button');secondary.textContent='Play again';secondary.onclick=restart;
 card.lastChild.append(primary,secondary);overlay.append(card);
}
function move(action,repeating=false){if(mode!=='play'||state.status!=='playing'||$('dialog').open)return;if(animationRunning){if(!repeating&&queuedMoves.length<2)queuedMoves.push(action);return;}const before=state;const next=step(state,action,{trace:true});const frames=next.frames||[];delete next.frames;if(next.moves!==before.moves||next.status!==before.status)history.push(before);state=next;const pickup=next.events.find(event=>event.type==='pickup');if(pickup&&state.status==='playing')showPickupHint(pickup.tile);if(state.status==='won'&&before.status!=='won'){if(!testMode){saved.best[level.id]=Math.min(saved.best[level.id]??Infinity,state.moves);persist();fillRoomGrid();}}unlockAudio();audio.playEvents(state.status==='dead'&&fullMotion?next.events.filter(e=>e.type!=='dead'):next.events).then(updateSound);render(false);if(!animateTurn(before,frames,action))render();}
function cancelAnimation(){hidePickupHint();animationId++;cancelAnimationFrame(animationFrame);animationRunning=false;queuedMoves=[];}
function animateTurn(before,frames,action){
 if(!fullMotion)return false;
 const moved=before.player.x!==state.player.x||before.player.y!==state.player.y;
 const blocked=!moved&&'UDLR'.includes(action)&&state.events.some(e=>e.type==='blocked');
 const facing=blocked?action:state.facing;
 const physics=frames.filter((f,i)=>i===0||JSON.stringify(f.tiles)!==JSON.stringify(frames[i-1].tiles));
 const dying=state.status==='dead'&&state.death;
 if(!moved&&!blocked&&physics.length<2&&!dying)return false;
 const id=++animationId,after=state,started=performance.now(),moveDuration=moved?220:blocked?150:0,tickDuration=Math.min(58,550/Math.max(1,physics.length-1));
 const impactStart=moveDuration+Math.max(0,physics.length-1)*tickDuration;
 const deathDuration=dying?(dying.cause==='ball'?760:900):0;
 const total=impactStart+deathDuration;
 const moveIndex=after.events.findIndex(e=>e.type==='move');
 const push=after.events.slice(0,Math.max(0,moveIndex)).find(e=>(e.type==='push'||e.type==='splash')&&e.from&&e.to);
 animationRunning=true;renderOverlay();if(dying)queuedMoves=[];
 const walkBoard={...before,tiles:before.tiles.map(r=>r.slice())};
 if(push&&moved)walkBoard.tiles[push.from.y][push.from.x]='.';
 drawBoard(board,before);
 let impactPlayed=false;
 const frame=now=>{
  if(id!==animationId)return;
  const elapsed=now-started;
  if((moved||blocked)&&elapsed<moveDuration){
   const t=Math.min(1,elapsed/moveDuration),eased=t*t*(3-2*t);
   const player={x:before.player.x+(after.player.x-before.player.x)*eased,y:before.player.y+(after.player.y-before.player.y)*eased};
   const pushedProgress=Math.min(1,t/.1);
   const objects=push?[{tile:push.tile,x:push.from.x+(push.to.x-push.from.x)*pushedProgress,y:push.from.y+(push.to.y-push.from.y)*pushedProgress}]:[];
   drawBoard(board,walkBoard,{animation:{player,from:before.player,to:after.player,cycle:t,facing,pushing:!!push,blocked,objects}});
  }else if(dying&&elapsed>=impactStart){
   if(!impactPlayed){impactPlayed=true;audio.playEvents([{type:'dead',cause:dying.cause}]).then(updateSound);}
   drawBoard(board,after,{animation:{deathProgress:Math.min(1,(elapsed-impactStart)/deathDuration)}});
  }else if(physics.length){const i=Math.min(physics.length-1,Math.floor((elapsed-moveDuration)/tickDuration));drawBoard(board,{...physics[Math.max(0,i)],status:'playing',facing:after.facing});}
  if(elapsed<total){animationFrame=requestAnimationFrame(frame);return;}
  animationRunning=false;render();const next=queuedMoves.shift();if(next)move(next);
 };
 animationFrame=requestAnimationFrame(frame);return true;
}
function undo(){cancelAnimation();if(mode==='edit'){undoEdit();return;}if(history.length){state=history.pop();playSound('undo');render();}}
function restart(){cancelAnimation();playSound('restart');state=createState(level);history=[];render();board.focus({preventScroll:true});}
function nextRoom(){if(currentIndex===activeLevels.length-1)showRooms();else loadLevel(currentIndex+1);}
function enterEditor(){cancelAnimation();mode='edit';testMode=false;renderMode();}
function pushEdit(){editHistory.push(structuredClone(draft));if(editHistory.length>100)editHistory.shift();}
function saveDraft(){saved.draft=structuredClone(draft);persist();}
function undoEdit(){if(editHistory.length){draft=editHistory.pop();saveDraft();renderMode();}}
function buildPalette(){const palette=$('palette');TILE_INFO.forEach(tile=>{const b=document.createElement('button');b.title=tile.label;b.setAttribute('aria-label',tile.label);b.dataset.tile=tile.id;b.setAttribute('aria-pressed',tile.id===selectedTile);b.append(tileCanvas(tile.id,28));b.onclick=()=>selectTile(tile.id);palette.append(b);});selectTile(selectedTile);}
function selectTile(id){selectedTile=id;const info=TILE_INFO.find(t=>t.id===id);$('selected-piece').textContent=info.label;$('tile-help').textContent=info.description;for(const button of $('palette').children)button.setAttribute('aria-pressed',button.dataset.tile===id);}
function locationAt(e){const rect=board.getBoundingClientRect();return{x:Math.floor((e.clientX-rect.left)/rect.width*draft.rows[0].length),y:Math.floor((e.clientY-rect.top)/rect.height*draft.rows.length)};}
function paint(e){const pos=locationAt(e);if(pos.x<0||pos.y<0||pos.y>=draft.rows.length||pos.x>=draft.rows[0].length)return;const id=e.buttons===2?'.':selectedTile;const key=`${pos.x},${pos.y},${id}`;if(key===lastPaint)return;lastPaint=key;const rows=draft.rows.map(r=>[...r]);if(rows[pos.y][pos.x]===id)return;if(id==='@')rows.forEach(r=>r.forEach((c,i)=>{if(c==='@')r[i]='.';}));rows[pos.y][pos.x]=id;draft.rows=rows.map(r=>r.join(''));delete draft.solution;delete draft.generated;delete draft.generator;render();}
let swipeStart=null;
board.addEventListener('pointerdown',e=>{
 if(mode!=='play'||e.button!==0||$('dialog').open||!$('game-menu').hidden)return;
 swipeStart={x:e.clientX,y:e.clientY,id:e.pointerId};board.setPointerCapture(e.pointerId);
});
board.addEventListener('pointerup',e=>{
 if(!swipeStart||swipeStart.id!==e.pointerId)return;
 const dx=e.clientX-swipeStart.x,dy=e.clientY-swipeStart.y;swipeStart=null;
 if(mode!=='play'||Math.max(Math.abs(dx),Math.abs(dy))<18)return;
 move(Math.abs(dx)>Math.abs(dy)?(dx>0?'R':'L'):(dy>0?'D':'U'));
});
board.addEventListener('pointercancel',()=>{swipeStart=null;});
board.addEventListener('pointerdown',e=>{if(mode!=='edit')return;e.preventDefault();pushEdit();painting=true;lastPaint='';board.setPointerCapture(e.pointerId);paint(e);});
board.addEventListener('pointermove',e=>{if(mode!=='edit')return;hover=locationAt(e);if(painting)paint(e);else render();});
board.addEventListener('pointerup',()=>{if(painting){painting=false;saveDraft();render();}});
board.addEventListener('pointercancel',()=>{if(painting){painting=false;saveDraft();}});
board.addEventListener('pointerleave',()=>{hover=null;if(mode==='edit')render();});
board.addEventListener('contextmenu',e=>{if(mode==='edit')e.preventDefault();});
function checkDraft(){draft.name=$('room-title').value.trim()||'Untitled room';const result=validateLevel(draft);if(!result.valid){toast(result.errors.slice(0,3).join(' '));return false;}return true;}
function testDraft(){if(!checkDraft())return;saveDraft();level=structuredClone(draft);state=createState(level);history=[];testMode=true;mode='play';renderMode();board.focus({preventScroll:true});}
function saveRoom(){if(!checkDraft())return;saveDraft();const i=saved.rooms.findIndex(r=>r.id===draft.id);if(i>=0)saved.rooms[i]=structuredClone(draft);else saved.rooms.push(structuredClone(draft));persist();toast(`“${draft.name}” saved in My rooms.`);}
function exportRoom(){if(!checkDraft())return;const payload={format:'blobbo-browser',version:1,level:structuredClone(draft)};const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=(draft.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')||'room')+'.blobbo.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Room exported. Keep this file to share or back it up.');}
async function importRoom(file){try{if(file.size>200000)throw new Error('Room file is too large.');const parsed=JSON.parse(await file.text());const incoming=parsed.level||parsed;const validation=validateLevel(incoming);if(!validation.valid)throw new Error(validation.errors.slice(0,3).join(' '));pushEdit();draft={id:'custom-'+Date.now(),name:String(incoming.name||'Imported room').slice(0,60),chapter:'custom',description:String(incoming.description||'An imported room.').slice(0,300),hint:String(incoming.hint||'').slice(0,500),rows:incoming.rows};if(typeof incoming.solution==='string'&&incoming.solution.length<20000&&/^[UDLRWX]*$/.test(incoming.solution)){let replay=createState(draft);for(const action of incoming.solution)replay=step(replay,action);if(replay.status==='won'){draft.solution=incoming.solution;if(incoming.generated&&incoming.generator&&typeof incoming.generator.seed==='string'){draft.generated=true;draft.generator={seed:incoming.generator.seed.slice(0,80),version:1};}}}saveDraft();enterEditor();toast('Room imported. Try it with Test room.');}catch(error){toast('Could not import: '+error.message);}}
function openDialog(title){hideMenu();cancelAnimation();render();$('dialog-title').textContent=title;$('dialog-content').replaceChildren();$('dialog').showModal();return $('dialog-content');}
function showRooms(){const content=openDialog('The room collection');activeChapters.forEach(chapter=>{const h=document.createElement('h3');h.className='chapter-heading';h.textContent=chapter.name;content.append(h);const list=document.createElement('div');list.className='room-list';activeLevels.forEach((l,i)=>{if(l.chapter!==chapter.id)return;const b=document.createElement('button');b.className='room-card';let c=document.createElement('canvas');drawBoard(c,{rows:l.rows});let label=document.createElement('strong');label.textContent=`${String(i+1).padStart(2,'0')} · ${l.name}`;let sub=document.createElement('small');sub.textContent=saved.best[l.id]!==undefined?`✓ COMPLETED · ${saved.best[l.id]} MOVES`:'READY TO EXPLORE';b.append(c,label,sub);b.onclick=()=>{$('dialog').close();loadLevel(i);};list.append(b);});content.append(list);});}
function showGuide(){const content=openDialog('Field guide');let intro=document.createElement('p');intro.className='guide-intro';intro.textContent='Collect every toy chest, then take the stairs. Arrow keys, WASD, or a swipe or drag across the map move Blobbo; Space waits. Z undoes a whole turn, R restarts, and X drops the tool you are holding in the direction you last faced. On touch screens, use the Drop button above the map while holding a tool; its arrow shows the drop direction. You need empty floor ahead. Take your time: nothing happens until you act. Released balls and arrows travel until something stops them. Removing a support or leaving a nearby square can release a ball or arrow. A hazard waits if its very first step would hit you; once moving, it can strike you. Ramps shift arrows diagonally without turning them. Balls are rounded: another ball can slide off their sides, and an arrow can slide diagonally past them without turning. Both the adjacent side square and the diagonal landing square must be clear. Balls try left before right; horizontal arrows try above before below.';content.append(intro);let grid=document.createElement('div');grid.className='guide-grid';TILE_INFO.filter(t=>!['.','@','<','^','v','Q','N','V','p','b'].includes(t.id)).forEach(t=>{const div=document.createElement('div');div.className='guide-tile';let inner=document.createElement('div'),title=document.createElement('strong'),p=document.createElement('p');title.textContent=t.label;p.textContent=t.description;inner.append(title,p);div.append(tileCanvas(t.id,36),inner);grid.append(div);});content.append(grid);}
function showAudio(){const content=openDialog('Sound & movement');content.className='audio-settings';content.innerHTML=`<p>Sound effects and music have separate controls. The music is a new composition for this browser edition.</p><div class="audio-actions"><button id="test-audio" class="primary">Play sound check</button><button id="toggle-music">${musicOn?'Stop music':'Start music'}</button><button id="mute-all-audio">Mute all audio</button><button id="toggle-motion">${fullMotion?'Use reduced motion':'Use classic movement'}</button></div><p id="audio-feedback" role="status">Press Play sound check for a chest sound followed by the completion chime.</p><p class="audio-tip">If the check is active but you hear nothing, check this tab’s mute control and your device’s audio output.</p>`;const feedback=$('audio-feedback');let timer,signalDetected=false;
 const report=()=>{if(!feedback.isConnected){clearInterval(timer);return;}const a=audio.getState();signalDetected ||= a.outputPeak>0.0001;feedback.textContent=a.lastError||(!a.effectsEnabled&&!a.musicEnabled?'All audio muted.':!a.unlocked?'Sound is waiting for a click.':`Audio ${a.contextState}. Effects ${a.effectsEnabled?'on':'off'}; music ${a.musicEnabled?'on':'off'}. ${signalDetected?'Sound signal detected.':'Ready to play.'}`);};
 $('test-audio').onclick=async()=>{soundOn=true;audio.setEffects(true);rememberAudio();signalDetected=false;unlockAudio();await audio.playEvents([{type:'chest'}]);updateSound();setTimeout(()=>audio.playUI('win'),400);report();};
 $('toggle-music').onclick=async()=>{musicOn=!musicOn;audio.setMusic(musicOn);rememberAudio();if(musicOn)await unlockAudio();updateSound();$('toggle-music').textContent=musicOn?'Stop music':'Start music';report();};
 $('mute-all-audio').onclick=()=>{soundOn=false;musicOn=false;audio.setEffects(false);audio.setMusic(false);rememberAudio();updateSound();$('toggle-music').textContent='Start music';report();};
 $('toggle-motion').onclick=()=>{fullMotion=!fullMotion;saved.fullMotion=fullMotion;persist();updateSound();$('toggle-motion').textContent=fullMotion?'Use reduced motion':'Use classic movement';};timer=setInterval(report,100);$('dialog').addEventListener('close',()=>clearInterval(timer),{once:true});}
function showAbout(){const content=openDialog('A small game with a long memory');content.className='about-text';content.innerHTML=`<h3>Welcome back to a very peculiar toy room.</h3><p>This is an independent browser reconstruction inspired by <strong>Blobbo</strong>, Glenn Andreas’s classic Macintosh puzzle game. The canvas artwork and engine were made anew, along with ${LEVELS.length} compact regular rooms and ${CHALLENGE_LEVELS.length} extra hard rooms.</p><p>The research includes the original in-game Help, the author’s FAQ, and gameplay recordings. <a href="https://www.lexaloffle.com/bbs/?tid=46390" target="_blank" rel="noopener">Globbo by siwu</a> helped show why this deserves a home in the browser.</p><div class="fidelity-note"><strong>A reconstruction in progress.</strong><p>Bowling balls, arrows, ramps, directional floor gates, marshmallows, spike traps, fire, growing vines, shears, corks and holes, axes, and canoes are here. Local hazard release and diagonal slides now follow the observed Globbo behavior. Vertical arrows are an editor extension. Exact Macintosh timing, vine growth, water bridges, and canoe behavior still need further verification. Water currents, transporters, smileys, and the original’s more elaborate gadgets are still to come. This is not a complete or officially endorsed port.</p></div><p>Movement uses separately drawn reaching and gathering poses based on the original oozing silhouettes. Sound effects are newly synthesized; the separately controlled background music is a new composition, not the original soundtrack.</p><p>Progress and custom rooms stay in this browser. Export your rooms as JSON to back them up or share them. Generated rooms are solvable mazes; rooms you draw yourself need playtesting.</p><p>References: <a href="https://www.youtube.com/watch?v=qUhcM2zZ6Yg" target="_blank" rel="noopener">original Macintosh gameplay</a> · <a href="https://carbon-izer.s3.amazonaws.com/projects/BlobboFAQ.html" target="_blank" rel="noopener">author’s FAQ</a> · <a href="https://www.campbelljc.com/oldgames/blobbo/" target="_blank" rel="noopener">Blobbo archive and resources</a>.</p>`;}
function showSavedRooms(){const content=openDialog('My rooms');if(!saved.rooms.length){const p=document.createElement('p');p.className='guide-intro';p.textContent='Your workshop is ready. Save a room from the editor and it will appear here.';content.append(p);return;}saved.rooms.forEach(r=>{const div=document.createElement('div');div.className='saved-room';const label=document.createElement('strong');label.textContent=r.name;const edit=document.createElement('button');edit.textContent='Edit';edit.onclick=()=>{pushEdit();draft=structuredClone(r);saveDraft();$('dialog').close();enterEditor();};const play=document.createElement('button');play.textContent='Play';play.onclick=()=>{pushEdit();draft=structuredClone(r);saveDraft();$('dialog').close();enterEditor();testDraft();};div.append(label,edit,play);content.append(div);});}
let menuPinned=false,menuHovered=false,menuDismissed=false,menuCloseTimer;
function showMenu(pin=false){
 clearTimeout(menuCloseTimer);if(pin)menuPinned=true;
 $('game-menu').hidden=false;$('menu-toggle').setAttribute('aria-expanded','true');
}
function hideMenu(){
 // The creator palette is a docked workspace, not a dismissible play menu.
 if(mode==='edit')return;
 clearTimeout(menuCloseTimer);menuPinned=false;menuDismissed=$('menu-anchor').matches(':hover');
 if($('game-menu').contains(document.activeElement))board.focus({preventScroll:true});
 $('game-menu').hidden=true;$('menu-toggle').setAttribute('aria-expanded','false');
}
function closeMenuPreview(){
 clearTimeout(menuCloseTimer);menuCloseTimer=setTimeout(()=>{
  if(!menuPinned&&!menuHovered&&!$('game-menu').contains(document.activeElement))hideMenu();
 },160);
}
function updateFullscreen(){
 const active=!!document.fullscreenElement;
 $('fullscreen').textContent=active?'Exit full screen (L)':'Full screen (L)';
 $('fullscreen').setAttribute('aria-pressed',String(active));
 requestAnimationFrame(fitBoard);
}
async function toggleFullscreen(){
 hideMenu();
 try{
  if(document.fullscreenElement)await document.exitFullscreen();
  else if(document.documentElement.requestFullscreen&&document.fullscreenEnabled!==false)await document.documentElement.requestFullscreen();
  else throw new Error('Fullscreen unavailable');
  board.focus({preventScroll:true});
 }catch{
  toast('Full screen is unavailable here. Open the game in Safari or Chrome and use the browser’s full-screen command.');
 }
 updateFullscreen();
}
$('fullscreen').onclick=toggleFullscreen;
document.addEventListener('fullscreenchange',updateFullscreen);
$('menu-anchor').addEventListener('pointerenter',e=>{if(e.pointerType!=='mouse')return;menuHovered=true;if(!menuDismissed)showMenu();});
$('menu-anchor').addEventListener('pointerleave',e=>{if(e.pointerType!=='mouse')return;menuHovered=false;menuDismissed=false;closeMenuPreview();});
$('menu-toggle').onclick=()=>{if(menuPinned)hideMenu();else{menuDismissed=false;showMenu(true);}};
$('close-menu').onclick=()=>hideMenu();
$('game-menu').addEventListener('pointerdown',()=>{menuPinned=true;});
$('game-menu').addEventListener('focusout',()=>{if(!menuPinned)closeMenuPreview();});
document.addEventListener('pointerdown',e=>{if(!$('game-menu').hidden&&!$('menu-anchor').contains(e.target))hideMenu();},true);
window.addEventListener('resize',fitBoard);
window.visualViewport?.addEventListener('resize',fitBoard);
$('dialog').addEventListener('close',()=>{$('dialog-content').className='';});
$('close-dialog').onclick=()=>$('dialog').close();
$('play-tab').onclick=()=>loadLevel(currentIndex);$('editor-tab').onclick=enterEditor;$('menu-guide').onclick=showGuide;$('all-rooms').onclick=showRooms;$('about').onclick=showAbout;
$('sound').onclick=async()=>{if(!soundOn||!audio.unlocked){await enableAudio();return;}soundOn=false;audio.setEffects(false);rememberAudio();updateSound();};
$('music').onclick=async()=>{if(musicOn&&!audio.unlocked){await unlockAudio();return;}musicOn=!musicOn;audio.setMusic(musicOn);rememberAudio();if(musicOn)await unlockAudio();updateSound();};
$('start-audio').onclick=()=>enableAudio(true);$('start-muted').onclick=()=>{soundOn=false;musicOn=false;audio.setEffects(false);audio.setMusic(false);rememberAudio();updateSound();};$('audio-settings').onclick=showAudio;$('motion').onclick=()=>{fullMotion=!fullMotion;saved.fullMotion=fullMotion;persist();cancelAnimation();render();updateSound();};$('collection').onchange=e=>chooseCollection(e.target.value);
document.addEventListener('visibilitychange',async()=>{if(document.hidden)audio.suspend();else await audio.resume();updateSound();});
$('death-undo').onclick=()=>{undo();board.focus({preventScroll:true});};$('death-restart').onclick=restart;
$('undo').onclick=undo;$('restart').onclick=restart;$('wait').onclick=()=>move('W');$('drop').onclick=dropHeldTool;$('touch-drop').onclick=dropHeldTool;$('next-room').onclick=nextRoom;$('back-editor').onclick=enterEditor;
$('new-room').onclick=()=>{pushEdit();draft=blankRoom();saveDraft();renderMode();toast('A fresh room. Undo edit restores the previous one.');};
$('room-title').addEventListener('change',()=>{pushEdit();draft.name=$('room-title').value.trim()||'Untitled room';saveDraft();});
$('resize-room').onclick=()=>{const w=Math.max(7,Math.min(31,Math.round(Number($('room-width').value)||17))),h=Math.max(7,Math.min(23,Math.round(Number($('room-height').value)||13)));pushEdit();const old=draft.rows;draft.rows=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>x===0||y===0||x===w-1||y===h-1?'#':old[y]?.[x]||'.').join(''));delete draft.solution;delete draft.generated;delete draft.generator;saveDraft();renderMode();toast('Room resized. Check the start and stairs before testing.');};
$('test-room').onclick=testDraft;$('save-room').onclick=saveRoom;$('export-room').onclick=exportRoom;$('import-room').onclick=()=>$('import-file').click();$('my-rooms').onclick=showSavedRooms;$('editor-undo').onclick=undoEdit;
$('import-file').addEventListener('change',e=>{if(e.target.files[0])importRoom(e.target.files[0]);e.target.value='';});
$('generate').onclick=()=>{pushEdit();const seed=$('seed').value.trim()||String(Date.now());$('seed').value=seed;draft={...generateLevel(seed),id:'custom-'+Date.now(),chapter:'custom'};saveDraft();enterEditor();toast('A new solvable maze. Test it, change it, or save it.');};
for(const button of document.querySelectorAll('[data-move]'))button.onclick=()=>move(button.dataset.move);
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('dialog').open){e.preventDefault();if(document.fullscreenElement){toggleFullscreen();return;}if(mode==='edit'){board.focus({preventScroll:true});return;}if(!$('game-menu').hidden){hideMenu();$('menu-toggle').focus({preventScroll:true});}else{showMenu(true);$('close-menu').focus({preventScroll:true});}return;}if($('dialog').open||['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)||(e.key===' '&&['BUTTON','SUMMARY','A'].includes(e.target.tagName))||e.ctrlKey||e.metaKey||e.altKey)return;if((e.key==='Enter'||e.key==='Return')&&mode==='play'&&state.status==='won'&&!e.target.closest('button,a,summary,[contenteditable]')){e.preventDefault();if(!e.repeat){if(testMode)enterEditor();else nextRoom();}return;}if(e.key.toLowerCase()==='l'&&!e.target.closest('[contenteditable]')){e.preventDefault();if(!e.repeat)toggleFullscreen();return;}const actions={ArrowUp:'U',ArrowDown:'D',ArrowLeft:'L',ArrowRight:'R',w:'U',a:'L',s:'D',d:'R',' ':'W',x:'X'};const action=actions[e.key];if(action){e.preventDefault();if(e.repeat&&performance.now()-lastMove<105)return;lastMove=performance.now();move(action,e.repeat);}else if(e.key.toLowerCase()==='z'){e.preventDefault();undo();}else if(e.key.toLowerCase()==='r'&&mode==='play'){e.preventDefault();restart();}});
buildPalette();updateSound();updateSaveLabel();renderMode();

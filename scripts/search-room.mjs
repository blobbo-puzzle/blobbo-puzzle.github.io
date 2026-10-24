// Exhaustive finite-state breadth-first search. A limit is inconclusive, never a proof.
import {step,stateKey} from '../src/engine.js';
export function search(initial,{maxStates=25000,forbid=null}={}){
 const q=[{s:initial,p:-1,a:''}],seen=new Set([stateKey(initial)]);
 for(let head=0;head<q.length;head++){const {s}=q[head];for(const a of ['U','D','L','R','W',...(s.carrying?['X']:[])]){const n=step(s,a);if(n.moves===s.moves||n.status==='dead'||forbid?.(s,n,a))continue;if(n.status==='won'){let path=a,i=head;while(q[i].p!==-1){path=q[i].a+path;i=q[i].p;}return {solved:true,solution:path,visited:seen.size};}const key=stateKey(n);if(seen.has(key))continue;seen.add(key);if(seen.size>maxStates)return{solved:false,reason:'state-limit',visited:seen.size};q.push({s:n,p:head,a});}}
 return {solved:false,reason:'exhausted',visited:seen.size};
}

export const IDS=['python','cpp','matlab','c','bash'];
export const KEY='coding-field-guide-v1';
export const emptyState=()=>({version:1,checks:{},sessions:{},focus:'python',minutes:40});
export function validateState(data){
 if(!data||data.version!==1||typeof data!=='object'||Array.isArray(data))throw Error('This is not a Coding Field Guide backup.');
 const state=emptyState();
 for(const [key,value] of Object.entries(data.checks||{}))if(/^(python|cpp|matlab|c|bash)-[0-3]$/.test(key)&&typeof value==='boolean')state.checks[key]=value;
 for(const [key,value] of Object.entries(data.sessions||{}))if(/^\d{4}-\d{2}-\d{2}$/.test(key)&&Array.isArray(value))state.sessions[key]=[...new Set(value.filter(id=>IDS.includes(id)))];
 if(IDS.includes(data.focus))state.focus=data.focus;
 if([20,40,60].includes(data.minutes))state.minutes=data.minutes;
 return state;
}
export function mergeState(a,b){const x=validateState(a),y=validateState(b);for(const [k,v] of Object.entries(y.checks))x.checks[k]=!!x.checks[k]||v;for(const [k,v] of Object.entries(y.sessions))x.sessions[k]=[...new Set([...(x.sessions[k]||[]),...v])];x.focus=y.focus;x.minutes=y.minutes;return x;}
export function routine(minutes){if(![20,40,60].includes(minutes))throw Error('Unsupported session duration');return {recall:5,code:minutes-10,explain:5};}
export function thermal(t,tau){if(!Number.isFinite(t)||!Number.isFinite(tau)||t<0||tau<=0)throw Error('Invalid thermal input');return 20+20*Math.exp(-t/tau);}
export function flags(value){if(!Number.isInteger(value)||value<0||value>255)throw Error('Expected an unsigned byte');return {binary:value.toString(2).padStart(8,'0'),fault:!!(value&1),stale:!!(value&2),battery:!!(value&4)};}
export function timing(ms){if(!Number.isFinite(ms)||ms<0)throw Error('Invalid duration');return {budget:20,remaining:20-ms,over:ms>20};}
export const readings=[22,23.5,28.2,31.1];
export const above=(limit)=>readings.filter(v=>v>limit);
export const sampleLog=['INFO sensor connected','WARN missing sample','INFO analysis started','WARN stale timestamp','INFO report saved'];
export function pipeline(mode){const found=sampleLog.filter(line=>line.includes('WARN'));if(mode==='all')return sampleLog.join('\n');if(mode==='warn')return found.join('\n');if(mode==='count')return String(found.length);throw Error('Unknown pipeline');}

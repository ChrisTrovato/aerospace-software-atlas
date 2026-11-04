export const ACADEMY_KEY='coding-academy-v2';
export const LANGS=['python','cpp','matlab','c','bash'];
export const today=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export function validDay(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T12:00:00Z');return Number.isFinite(+d)&&d.toISOString().slice(0,10)===s;}
export function addDays(day,n){const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
export const fresh=()=>({version:2,prefs:{focus:'python',minutes:40,weeklyGoal:4,theme:'light',track:'exploring'},lessons:{},exercises:{},reviews:{},projects:{},journal:[],bookmarks:[],legacy:{}});
const plain=x=>x&&typeof x==='object'&&!Array.isArray(x);
const safeId=x=>typeof x==='string'&&/^[a-z][a-z0-9-]{1,89}$/.test(x)&&!['constructor','prototype','__proto__'].includes(x);
const text=(x,n=20000)=>typeof x==='string'?x.slice(0,n):'';
const stamp=x=>typeof x==='string'&&Number.isFinite(Date.parse(x))?new Date(x).toISOString():'1970-01-01T00:00:00.000Z';
export function normalize(raw){
 if(!plain(raw)||raw.version!==2)throw Error('Choose a version 2 Coding Academy backup.');
 const s=fresh(),p=raw.prefs||{};
 if(LANGS.includes(p.focus))s.prefs.focus=p.focus;
 if([15,20,30,40,60,90].includes(p.minutes))s.prefs.minutes=p.minutes;
 if(Number.isInteger(p.weeklyGoal)&&p.weeklyGoal>=1&&p.weeklyGoal<=7)s.prefs.weeklyGoal=p.weeklyGoal;
 if(['light','dark'].includes(p.theme))s.prefs.theme=p.theme;
 s.prefs.track=text(p.track,80)||'exploring';
 for(const [id,v] of Object.entries(plain(raw.lessons)?raw.lessons:{}))if(safeId(id)&&plain(v))s.lessons[id]={status:['learning','complete'].includes(v.status)?v.status:'learning',updatedAt:stamp(v.updatedAt)};
 for(const [id,v] of Object.entries(plain(raw.exercises)?raw.exercises:{}))if(safeId(id)&&plain(v))s.exercises[id]={status:['attempted','solved'].includes(v.status)?v.status:'attempted',answer:text(v.answer),note:text(v.note,5000),updatedAt:stamp(v.updatedAt)};
 for(const [id,v] of Object.entries(plain(raw.reviews)?raw.reviews:{}))if(safeId(id)&&plain(v)&&validDay(v.due))s.reviews[id]={due:v.due,interval:Math.max(0,Math.min(365,Number(v.interval)||0)),count:Math.max(0,Math.min(99999,Number(v.count)||0)),updatedAt:stamp(v.updatedAt)};
 for(const [id,v] of Object.entries(plain(raw.projects)?raw.projects:{}))if(safeId(id)&&plain(v))s.projects[id]={checks:[...new Set((Array.isArray(v.checks)?v.checks:[]).filter(x=>Number.isInteger(x)&&x>=0&&x<100))],note:text(v.note),updatedAt:stamp(v.updatedAt)};
 s.bookmarks=[...new Set((Array.isArray(raw.bookmarks)?raw.bookmarks:[]).filter(safeId))];
 s.journal=(Array.isArray(raw.journal)?raw.journal:[]).filter(v=>plain(v)&&safeId(v.id)&&validDay(v.day)&&LANGS.includes(v.language)).slice(-10000).map(v=>({id:v.id,day:v.day,language:v.language,minutes:Math.max(0,Math.min(600,Number(v.minutes)||0)),learned:text(v.learned,5000),blocker:text(v.blocker,5000),next:text(v.next,5000),updatedAt:stamp(v.updatedAt)}));
 const seen=new Set();s.journal=s.journal.filter(v=>!seen.has(v.id)&&seen.add(v.id));
 if(plain(raw.legacy))s.legacy=JSON.parse(JSON.stringify(raw.legacy));
 return s;
}
export function migrateV1(old){const s=fresh();if(!plain(old)||old.version!==1)return s;s.legacy=old;if(LANGS.includes(old.focus))s.prefs.focus=old.focus;if([20,40,60].includes(old.minutes))s.prefs.minutes=old.minutes;for(const [day,langs] of Object.entries(old.sessions||{})){if(!validDay(day)||!Array.isArray(langs))continue;for(const language of [...new Set(langs)].filter(x=>LANGS.includes(x)))s.journal.push({id:`legacy-${day}-${language}`,day,language,minutes:0,learned:'Practice day imported from the original Field Guide. Duration was not recorded.',blocker:'',next:'',updatedAt:day+'T12:00:00.000Z'});}return s;}
export function mergeBackups(a,b){const x=normalize(a),y=normalize(b);for(const bucket of ['lessons','exercises','reviews','projects'])for(const [id,v] of Object.entries(y[bucket]))if(!x[bucket][id]||v.updatedAt>x[bucket][id].updatedAt)x[bucket][id]=v;const rows=new Map(x.journal.map(v=>[v.id,v]));for(const v of y.journal)if(!rows.has(v.id)||v.updatedAt>rows.get(v.id).updatedAt)rows.set(v.id,v);x.journal=[...rows.values()].sort((a,b)=>a.updatedAt.localeCompare(b.updatedAt));x.bookmarks=[...new Set([...x.bookmarks,...y.bookmarks])];if(!Object.keys(x.legacy).length)x.legacy=y.legacy;return normalize(x);}
export function rateReview(previous,rating,day=today()){if(!['again','hard','good'].includes(rating)||!validDay(day))throw Error('Invalid review');const base=previous?.interval||0;const interval=rating==='again'?1:rating==='hard'?Math.max(1,Math.round(base*1.2)):base?Math.min(180,Math.max(3,Math.round(base*2))):3;return {due:addDays(day,interval),interval,count:(previous?.count||0)+1,updatedAt:new Date().toISOString()};}
export function nextLesson(modules,state,language){const items=modules.filter(m=>m.language===language);return items.find(m=>state.lessons[m.id]?.status!=='complete'&&(m.prerequisites||[]).every(id=>state.lessons[id]?.status==='complete'))||items.find(m=>state.lessons[m.id]?.status!=='complete')||items[0];}
export function searchItems(items,{query='',language='all',kind='all',stage='all',bookmarks=null}={}){const words=query.toLowerCase().trim().split(/\s+/).filter(Boolean);return items.filter(i=>(language==='all'||i.language===language)&&(kind==='all'||i.kind===kind)&&(stage==='all'||i.stage===stage)&&(!bookmarks||bookmarks.includes(i.id))&&words.every(w=>i.search.toLowerCase().includes(w)));}
export function weekStats(journal,day=today()){const from=addDays(day,-6);const rows=journal.filter(x=>x.day>=from&&x.day<=day);return {days:new Set(rows.map(x=>x.day)).size,minutes:rows.reduce((a,b)=>a+b.minutes,0),sessions:rows.length};}
export function textDownload(content,type,name){return {content,type,name};}

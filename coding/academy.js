import {ACADEMY_KEY,LANGS,today,validDay,fresh,normalize,migrateV1,mergeBackups,rateReview,searchItems} from './academy-engine.mjs';
import {makeDrill,gradeNumber} from './drills.mjs';
import {tracks,dataset,datasetSpecs,mentorPrompt,readmeTemplate} from './toolkit.mjs';
import {esc,todayView,libraryView,libraryResults,lessonView,exerciseView,projectsView,projectView,practiceView,reviewView,journalView,toolkitView,exploreView} from './academy-views.mjs';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let state=fresh(),data,pendingImport,storageOK=true,storageReadFailed=false,recoveryRaw='',noticeTimer,drill=makeDrill('units',1),currentCard,libraryLimit=60;
let timer={remaining:0,until:0,running:false,handle:0};
const stamped=()=>new Date().toISOString();
function notice(message){const box=$('#academy-notice');box.textContent=message;box.classList.add('visible');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>box.classList.remove('visible'),5000);}
function warnStorage(){const box=$('#storage-warning');box.hidden=storageOK;box.textContent=storageReadFailed?'Existing saved progress could not be read and has been left unchanged. Export this session and the recovery data from Toolkit before leaving.':'This browser could not save your progress. Keep working, then export a backup from Toolkit before leaving.';}
function save(){if(storageReadFailed){storageOK=false;warnStorage();return;}try{localStorage.setItem(ACADEMY_KEY,JSON.stringify(state));storageOK=true;}catch{storageOK=false;}warnStorage();}
try{const stored=localStorage.getItem(ACADEMY_KEY);recoveryRaw=stored||'';if(stored)state=normalize(JSON.parse(stored));else {const v1=localStorage.getItem('coding-field-guide-v1');if(v1)state=migrateV1(JSON.parse(v1));}recoveryRaw='';}catch{storageOK=false;storageReadFailed=!!recoveryRaw;}
if(LANGS.includes(document.body.dataset.language))state.prefs.focus=document.body.dataset.language;
document.documentElement.dataset.academyTheme=state.prefs.theme;warnStorage();
const count=(o,status)=>Object.values(o).filter(v=>!status||v.status===status).length;
const download=(name,content,type='text/plain')=>{const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);};
function route(){const hash=location.hash.slice(1)||'today',q=hash.indexOf('?');return {path:q<0?hash:hash.slice(0,q),params:new URLSearchParams(q<0?'':hash.slice(q+1))};}
function go(hash){if(location.hash==='#'+hash)render();else location.hash=hash;}
function reviewData(){const all=data.cards.filter(c=>state.lessons[c.module]),due=all.filter(c=>!state.reviews[c.id]||state.reviews[c.id].due<=today()).sort((a,b)=>(state.reviews[a.id]?.due||'').localeCompare(state.reviews[b.id]?.due||''));return {all,due};}
function searchOptions(params){return {query:params.get('q')||'',language:params.get('lang')||state.prefs.focus,kind:params.get('kind')||'all',stage:params.get('stage')||'all',bookmarks:params.get('saved')==='1'?state.bookmarks:null};}
function renderLibraryResults(params){const results=searchItems(data.index,searchOptions(params));return libraryResults(data,state,results.slice(0,libraryLimit)).replace(`<span>${Math.min(results.length,libraryLimit)} results</span>`,`<span>${results.length} results · showing ${Math.min(results.length,libraryLimit)}</span>`)+(results.length>libraryLimit?'<button class="a-button load-more" data-action="load-more">Show more results</button>':'');}
function updateLibrary(){const p=new URLSearchParams();p.set('lang',$('#library-language').value);p.set('kind',$('#library-kind').value);p.set('stage',$('#library-stage').value);if($('#library-search').value)p.set('q',$('#library-search').value);if($('#library-saved').checked)p.set('saved','1');history.replaceState(null,'','#library?'+p.toString());libraryLimit=60;$('#library-results').innerHTML=renderLibraryResults(p);}
function render(){
 if(!data)return;const {path,params}=route(),[view,id]=path.split('/');let html,active=view;
 $('#field-guide').hidden=true;$('#academy-content').hidden=false;
 if(view==='lesson'){
  const m=data.modules.find(x=>x.id===id);if(m){if(!state.lessons[id]){state.lessons[id]={status:'learning',updatedAt:stamped()};save();}html=lessonView(data,state,m);}active='library';
 }else if(view==='exercise'){const e=data.exercises.find(x=>x.id===id);if(e)html=exerciseView(data,state,e);active='library';
 }else if(view==='project'){const p=data.projects.find(x=>x.id===id);if(p)html=projectView(data,state,p);active='projects';
 }else if(view==='library'){html=libraryView(data,state,params,[]);
 }else if(view==='projects')html=projectsView(data,state,params);
 else if(view==='practice')html=practiceView(data,state,drill);
 else if(view==='review'){const r=reviewData();currentCard=r.due[0];html=reviewView(data,state,currentCard,{due:r.due.length,available:r.all.length});}
 else if(view==='journal')html=journalView(data,state);
 else if(view==='toolkit')html=toolkitView(data,state)+(recoveryRaw?'<button class="a-button section-spacer" data-action="recovery-export">Download unreadable progress for recovery</button>':'');
 else if(view==='explore')html=exploreView(data,state);
 else if(view==='guide'||view.startsWith('guide-')){$('#field-guide').hidden=false;$('#academy-content').hidden=true;active='guide';if(view!=='guide')requestAnimationFrame(()=>document.getElementById(view)?.scrollIntoView());}
 else if(view==='today')html=todayView(data,state);
 if(html!==undefined)$('#academy-content').innerHTML=html;
 else if(active!=='guide'){$('#academy-content').innerHTML='<div class="empty-state"><h1>This item was not found.</h1><p>Use the library to find a lesson or project.</p><a class="a-button" href="#library">Open curriculum</a></div>';active='library';}
 if(view==='library')$('#library-results').innerHTML=renderLibraryResults(params);
 $$('[data-view]').forEach(a=>{if(a.dataset.view===active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 const label=$(`[data-view="${active}"]`)?.textContent?.replace(/\d+/g,'').trim()||'Academy';$('#view-breadcrumb').textContent='The long game / '+label;
 const due=reviewData().due.length;$('#due-badge').textContent=due?String(due):'';
 updateTimerDisplay();
}
function updateTimerDisplay(){const el=$('#timer-display');if(!el)return;const remaining=timer.running?Math.max(0,Math.ceil((timer.until-Date.now())/1000)):(timer.remaining||state.prefs.minutes*60);el.textContent=`${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,'0')}`;const b=$('[data-action="timer-start"]');if(b)b.textContent=timer.running?'Pause':timer.remaining?'Resume':'Start';if(timer.running&&remaining<=0){timer.running=false;timer.remaining=0;clearInterval(timer.handle);el.textContent='Complete';if(b)b.textContent='Start again';notice('Focus session complete. Save what you learned in the journal.');}}
function resetTimer(){clearInterval(timer.handle);timer={remaining:0,until:0,running:false,handle:0};updateTimerDisplay();}
function saveExercise(){const f=$('#exercise-form');if(!f)return;const id=f.dataset.id;state.exercises[id]={...(state.exercises[id]||{status:'attempted'}),answer:$('#exercise-answer').value,note:$('#exercise-note').value,updatedAt:stamped()};save();$('#draft-status').textContent=storageOK?'Saved in this browser.':'Storage unavailable. Export a backup before leaving.';}
function journalMarkdown(){return '# My coding learning journal\n\n'+[...state.journal].sort((a,b)=>a.day.localeCompare(b.day)).map(j=>`## ${j.day} — ${j.language} (${j.minutes} minutes)\n\nLearned: ${j.learned}\n\nTo investigate: ${j.blocker}\n\nNext: ${j.next}\n`).join('\n');}
document.addEventListener('click',async event=>{
 const skip=event.target.closest('a.skip');if(skip){event.preventDefault();$('#main').focus({preventScroll:true});$('#main').scrollIntoView({behavior:'instant'});return;}
 const b=event.target.closest('[data-action]');if(!b||!data)return;const action=b.dataset.action,id=b.dataset.id;
 if(action==='bookmark'){state.bookmarks=state.bookmarks.includes(id)?state.bookmarks.filter(v=>v!==id):[...state.bookmarks,id];save();b.innerHTML=state.bookmarks.includes(id)?'★ Saved':'☆ Save';notice(state.bookmarks.includes(id)?'Saved to your library.':'Removed from saved items.');}
 if(action==='lesson-status'){state.lessons[id]={status:state.lessons[id]?.status==='complete'?'learning':'complete',updatedAt:stamped()};save();render();}
 if(action==='exercise-solved'){saveExercise();state.exercises[id].status=state.exercises[id].status==='solved'?'attempted':'solved';state.exercises[id].updatedAt=stamped();save();render();notice(state.exercises[id].status==='solved'?'Exercise marked solved. Keep the evidence with your code.':'Exercise reopened.');}
 if(action==='copy'){try{await navigator.clipboard.writeText(data.modules.find(m=>m.id===id)?.example.code||'');notice('Copied. Run this in the matching language environment.');}catch{notice('Clipboard unavailable. Select the code to copy it.');}}
 if(action==='mentor-copy'){try{await navigator.clipboard.writeText(mentorPrompt);notice('Tutoring prompt copied.');}catch{notice('Clipboard unavailable. Select the prompt to copy it.');}}
 if(action==='drill-next'){drill=makeDrill(drill.topic,drill.seed>=999999?1:drill.seed+1);render();}
 if(action.startsWith('rate-')){if(!$('#recall-reveal')?.open)return;state.reviews[id]=rateReview(state.reviews[id],action.slice(5));save();render();}
 if(action==='track'){state.prefs.track=id;save();render();notice('Exploration lens saved. Your language focus stays under your control.');}
 if(action==='load-more'){libraryLimit+=60;$('#library-results').innerHTML=renderLibraryResults(route().params);}
 if(action==='timer-reset')resetTimer();
 if(action==='timer-start'){if(timer.running){timer.remaining=Math.max(1,Math.ceil((timer.until-Date.now())/1000));timer.running=false;clearInterval(timer.handle);}else{timer.until=Date.now()+(timer.remaining||state.prefs.minutes*60)*1000;timer.running=true;timer.handle=setInterval(updateTimerDisplay,500);}updateTimerDisplay();}
 if(action==='dataset'){const spec=datasetSpecs.find(s=>s.id===id);download(spec.filename,dataset(id),'text/csv');notice('Synthetic dataset downloaded.');}
 if(action==='readme-template')download('engineering-project-README.md',readmeTemplate(),'text/markdown');
 if(action==='project-readme'){const p=data.projects.find(p=>p.id===id);download(p.id+'-README.md',readmeTemplate(p.title)+'\n## Project brief\n\n'+p.summary+'\n\n'+p.milestones.map((m,i)=>`### ${i+1}. ${m.title}\n\n${m.deliverable}\n\nAcceptance: ${m.acceptance}`).join('\n\n')+'\n\n## My project notes\n\n'+(state.projects[id]?.note||''),'text/markdown');}
 if(action==='journal-export')download('coding-journal-'+today()+'.md',journalMarkdown(),'text/markdown');
 if(action==='recovery-export')download('coding-progress-recovery-'+today()+'.txt',recoveryRaw);
 if(action==='journal-edit'){const j=state.journal.find(j=>j.id===id);if(j){$('#journal-form').dataset.editId=j.id;$('#journal-day').value=j.day;$('#journal-minutes').value=j.minutes;$('#journal-language').value=j.language;$('#journal-learned').value=j.learned;$('#journal-blocker').value=j.blocker;$('#journal-next').value=j.next;$('#journal-form button[type="submit"]').textContent='Save changes to this entry';$('#journal-form').scrollIntoView({behavior:'smooth'});$('#journal-learned').focus({preventScroll:true});}}
 if(action==='backup-export'){download('coding-academy-backup-'+today()+'.json',JSON.stringify({...state,exportedAt:stamped()},null,2),'application/json');notice('Backup downloaded. Keep it with your project files.');}
 if(action==='backup-import')$('#backup-file').click();
 if(action==='import-confirm'&&pendingImport){state=mergeBackups(state,pendingImport);pendingImport=null;if(storageReadFailed){try{localStorage.setItem(ACADEMY_KEY+'-recovery',recoveryRaw);storageReadFailed=false;}catch{notice('Recovery copy could not be saved. Export a backup before leaving.');}}save();render();notice('Backup merged. Newer records and unique entries were retained.');}
 if(action==='import-cancel'){pendingImport=null;$('#import-preview').replaceChildren();}
});
document.addEventListener('input',event=>{
 const el=event.target;
 if(el.id==='library-search')updateLibrary();
 if(['exercise-answer','exercise-note'].includes(el.id))saveExercise();
 if(el.id==='project-note'){const id=el.dataset.id;state.projects[id]={...(state.projects[id]||{checks:[]}),note:el.value,updatedAt:stamped()};save();$('#draft-status').textContent=storageOK?'Saved in this browser.':'Storage unavailable. Export a backup before leaving.';}
});
document.addEventListener('change',async event=>{
 const el=event.target;
 if(['library-language','library-kind','library-stage','library-saved'].includes(el.id))updateLibrary();
 if(el.id==='study-focus'){state.prefs.focus=el.value;save();render();}
 if(el.id==='study-minutes'){state.prefs.minutes=Number(el.value);save();resetTimer();render();}
 if(el.id==='weekly-goal'){state.prefs.weeklyGoal=Number(el.value);save();notice('Weekly rhythm updated.');}
 if(el.id==='project-language'||el.id==='project-mission'){go('projects?'+new URLSearchParams({lang:$('#project-language').value,mission:$('#project-mission').value}));}
 if(el.dataset.projectCheck){const id=el.dataset.projectCheck,index=Number(el.dataset.index),p=state.projects[id]||{checks:[],note:''};p.checks=el.checked?[...new Set([...p.checks,index])]:p.checks.filter(x=>x!==index);p.updatedAt=stamped();state.projects[id]=p;save();}
 if(el.id==='drill-topic'||el.id==='drill-seed'){const seed=Number($('#drill-seed').value);if(!Number.isInteger(seed)||seed<1||seed>999999){notice('Use a whole-number seed from 1 to 999999.');return;}drill=makeDrill($('#drill-topic').value,seed);render();}
 if(el.id==='backup-file'){const file=el.files?.[0];if(!file)return;try{if(file.size>10000000)throw Error('This backup exceeds the 10 MB import limit.');const raw=JSON.parse(await file.text());pendingImport=raw.version===1?migrateV1(raw):normalize(raw);$('#import-preview').innerHTML=`<div class="import-box"><h3>Review this backup</h3><p>${count(pendingImport.lessons)} lesson records · ${count(pendingImport.exercises)} exercise records · ${pendingImport.journal.length} journal entries · ${count(pendingImport.projects)} project records</p><p>Merging keeps your current preferences. For matching IDs, the newest timestamp wins; unique entries are preserved.</p><button class="a-button" data-action="import-confirm">Merge this backup</button> <button class="a-button light-outline" data-action="import-cancel">Cancel</button></div>`;}catch(error){pendingImport=null;notice(error.message||'Could not read this backup. Your current progress is unchanged.');}finally{el.value='';}}
});
document.addEventListener('submit',event=>{
 const f=event.target;
 if(f.id==='library-form'){event.preventDefault();updateLibrary();}
 if(f.id==='exercise-form'){event.preventDefault();saveExercise();notice('Attempt saved.');}
 if(f.id==='drill-form'){event.preventDefault();const result=gradeNumber($('#drill-answer').value,drill);$('#drill-feedback').textContent=result.message;$('#drill-feedback').className='answer-feedback '+(result.ok?'correct':'incorrect');}
 if(f.id==='journal-form'){event.preventDefault();const day=$('#journal-day').value,minutes=Number($('#journal-minutes').value),learned=$('#journal-learned').value.trim();if(!validDay(day)||!Number.isFinite(minutes)||minutes<0||minutes>600||!learned){notice('Add a valid date, 0–600 minutes, and what you learned.');return;}const entry={id:f.dataset.editId||'session-'+crypto.randomUUID(),day,minutes,language:$('#journal-language').value,learned,blocker:$('#journal-blocker').value.trim(),next:$('#journal-next').value.trim(),updatedAt:stamped()},idx=state.journal.findIndex(j=>j.id===entry.id);if(idx>=0)state.journal[idx]=entry;else state.journal.push(entry);save();render();notice('Session saved. Your next step is waiting on Today.');}
});
$('#theme-toggle').addEventListener('click',()=>{state.prefs.theme=state.prefs.theme==='light'?'dark':'light';document.documentElement.dataset.academyTheme=state.prefs.theme;save();});
window.addEventListener('hashchange',()=>{render();if(!route().path.startsWith('guide-')){window.scrollTo({top:0,behavior:'instant'});$('#main').focus({preventScroll:true});}});
document.addEventListener('keydown',event=>{if(event.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){event.preventDefault();go('library');requestAnimationFrame(()=>$('#library-search')?.focus());}});
try{
 const response=await fetch('/coding_assets/academy-data.json');if(!response.ok)throw Error('Could not load curriculum.');data=await response.json();
 data.exercises=data.modules.flatMap(m=>m.exercises.map(e=>({...e,module:m.id,language:m.language,stage:m.stage})));
 data.cards=data.modules.flatMap(m=>m.review.map((r,i)=>({...r,id:`${m.id}-review-${i}`,module:m.id,language:m.language})));
 data.index=[...data.modules.map(m=>({id:m.id,kind:'lesson',title:m.title,summary:m.summary,language:m.language,stage:m.stage,minutes:m.minutes,detail:state.lessons[m.id]?.status==='complete'?'Understood':'4 exercises + worked example',url:'#lesson/'+m.id,search:[m.title,m.summary,m.why,...m.explanation].join(' ')})),...data.exercises.map(e=>({id:e.id,kind:'exercise',title:e.title,summary:e.prompt,language:e.language,stage:e.stage,minutes:e.minutes,detail:e.level,url:'#exercise/'+e.id,search:[e.title,e.prompt,e.inputs,e.expected,e.level].join(' ')})),...data.projects.map(p=>({id:p.id,kind:'project',title:p.title,summary:p.summary,language:p.language,detail:p.mission,url:'#project/'+p.id,search:[p.title,p.summary,p.mission,...p.testPlan].join(' ')})),...data.glossary.map(g=>({id:g.id,kind:'glossary',title:g.term,summary:g.definition+' Example: '+g.example,language:g.language,url:'#library?'+new URLSearchParams({kind:'glossary',lang:g.language,q:g.term}),search:g.term+' '+g.definition+' '+g.example})),...data.resources.map(r=>({id:r.id,kind:'resource',title:r.title,summary:r.reason+' '+r.usage,language:r.language,detail:r.cost,url:r.url,search:[r.title,r.reason,r.usage,r.cost,r.type].join(' ')}))];
 save();render();
}catch(error){$('#academy-content').innerHTML='<div class="empty-state"><h1>The curriculum could not load.</h1><p>Your saved progress has not been removed. Try reloading, or use the complete static handbook.</p><a class="a-button" href="/coding_assets/handbook.html">Open the handbook</a></div>';}

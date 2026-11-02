import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { STATUSES, escapeHtml, filterTools, cleanProgress, uniqueSources } from '../dist/utils.js';
import { ROOT, audit, validateRecords, validateEditorial, validatePublicText } from '../check.mjs';

const fixture=(id,overrides={})=>({id,name:id,kind:'Application',family:'CAD & manufacturing',specialties:['mechanisms'],summary:'Precise physical design',why:'Build and verify an assembly',alternatives:['Example CAD'],start:'2026–2027',priority:'core',...overrides});
const fixtures=[fixture('cad'),fixture('sim',{name:'Thermal Solver',family:'Thermal & fluids',specialties:['thermal','systems'],start:'2030–2032',priority:'branch',summary:'Model temperature with a mesh',why:'Inspect a heat-transfer simulation',alternatives:['Example thermal']}),fixture('robot',{name:'Robot Framework',kind:'Framework',family:'Robotics & autonomy',specialties:['robotics','mechanisms'],priority:'branch',start:'2028–2029',summary:'Coordinate sensors and motion',why:'Robotics tests',alternatives:['Simulation toolkit']})];
const ids=new Set(['python','freecad']);
const envelope=saved=>({format:'software-atlas',version:1,saved});
const clone=value=>JSON.parse(JSON.stringify(value));
const research=fs.readdirSync(path.join(ROOT,'research')).filter(name=>name.endsWith('.json')).flatMap(name=>JSON.parse(fs.readFileSync(path.join(ROOT,'research',name),'utf8')));
const editorial=JSON.parse(fs.readFileSync(path.join(ROOT,'dist/editorial.json'),'utf8'));

test('empty filters preserve all records and input order without mutation',()=>{
  const snapshot=clone(fixtures);assert.deepEqual(filterTools(fixtures),fixtures);assert.deepEqual(fixtures,snapshot);
});
test('search is case-insensitive, trims whitespace, and requires every word',()=>{
  assert.deepEqual(filterTools(fixtures,{q:'  THERMAL  mesh '}).map(t=>t.id),['sim']);
  assert.deepEqual(filterTools(fixtures,{q:'thermal robotics'}),[]);
  assert.deepEqual(filterTools(fixtures,{q:'   '}),fixtures);
});
test('search includes kind, specialty and alternative names',()=>{
  assert.deepEqual(filterTools(fixtures,{q:'framework mechanisms simulation'}).map(t=>t.id),['robot']);
});
test('family, priority, phase and specialty filters combine with AND',()=>{
  const filters={q:'temperature',family:'Thermal & fluids',priority:'branch',phase:'2030–2032',specialty:'systems'};
  assert.deepEqual(filterTools(fixtures,filters).map(t=>t.id),['sim']);
  for(const key of ['family','priority','phase','specialty'])assert.deepEqual(filterTools(fixtures,{...filters,[key]:'unknown'}),[],key);
});
test('all filter dimensions also work independently',()=>{
  assert.deepEqual(filterTools(fixtures,{specialty:'mechanisms'}).map(t=>t.id),['cad','robot']);
  assert.deepEqual(filterTools(fixtures,{priority:'branch'}).map(t=>t.id),['sim','robot']);
  assert.deepEqual(filterTools(fixtures,{phase:'2026–2027'}).map(t=>t.id),['cad']);
  assert.deepEqual(filterTools(fixtures,{family:'Robotics & autonomy'}).map(t=>t.id),['robot']);
});
test('import accepts the current export format and current local-storage shape',()=>{
  const saved={python:{status:'Practicing',note:'Compare measurements'}};
  assert.deepEqual(cleanProgress(envelope(saved),ids),saved);
  assert.deepEqual(cleanProgress({version:1,saved,compare:['python']},ids),saved);
});
test('import drops unknown IDs and unknown entry properties',()=>{
  const result=cleanProgress(envelope({python:{status:'Tried it',note:'Works',html:'<script>bad()</script>'},unknown:{status:'Comfortable',note:'Ignore'}}),ids);
  assert.deepEqual(result,{python:{status:'Tried it',note:'Works'}});
});
test('import normalizes invalid status and non-string notes and caps note size',()=>{
  const result=cleanProgress(envelope({python:{status:'Expert',note:44},freecad:{status:'Comfortable',note:'x'.repeat(6000)}}),ids);
  assert.deepEqual(result.python,{status:'Curious',note:''});
  assert.equal(result.freecad.note.length,5000);
  assert.deepEqual(STATUSES,['Curious','Tried it','Practicing','Comfortable']);
});
test('import rejects malformed containers',()=>{
  for(const input of [null,undefined,[],1,'{}',{},envelope(null),envelope([]),envelope('text')])assert.throws(()=>cleanProgress(input,ids));
});
test('import rejects unsupported versions and explicitly foreign formats',()=>{
  for(const input of [{format:'other-app',version:1,saved:{}},{format:'software-atlas',version:2,saved:{}},{format:'software-atlas',saved:{}},{version:'1',saved:{}}])assert.throws(()=>cleanProgress(input,ids),JSON.stringify(input));
});
test('import skips invalid records including arrays',()=>{
  assert.deepEqual(cleanProgress(envelope({python:[],freecad:null}),ids),{});
});
test('unrecognized prototype-like keys cannot enter the learning list',()=>{
  const input=JSON.parse('{"format":"software-atlas","version":1,"saved":{"__proto__":{"polluted":true},"constructor":{"status":"Comfortable"},"python":{"status":"Curious","note":"safe"}}}');
  assert.deepEqual(cleanProgress(input,ids),{python:{status:'Curious',note:'safe'}});
  assert.equal({}.polluted,undefined);
});
test('import preserves note text but HTML escaping makes it safe in textareas and attributes',()=>{
  const note='</textarea><img src=x onerror="alert(1)"> & \'quoted\'';
  const result=cleanProgress(envelope({python:{status:'Curious',note}}),ids);
  assert.equal(result.python.note,note);
  assert.equal(escapeHtml(note),'&lt;/textarea&gt;&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &#39;quoted&#39;');
  assert.equal(escapeHtml(null),'');assert.equal(escapeHtml(undefined),'');
  const app=fs.readFileSync(path.join(ROOT,'dist/app.js'),'utf8');
  assert.match(app,/h\(s\?\.note\|\|''\)/,'detail note must be escaped before entering a textarea');
  assert.match(app,/h\(saved\[t\.id\]\.note\.slice\(0,180\)\)/,'saved-list preview must be escaped');
});
test('source deduplication excludes unsafe schemes and normalizes equal URLs',()=>{
  const records=[{sources:[{title:'Zulu',url:'https://example.com'},{title:'Duplicate',url:'https://example.com/'},{title:'Unsafe',url:'javascript:alert(1)'},{title:'Insecure',url:'http://example.com'},{title:'Malformed',url:'bad-url'}]}];
  const result=uniqueSources(records,[{title:'Alpha',url:'https://example.org/guide'}]);
  assert.deepEqual(result,[{title:'Alpha',url:'https://example.org/guide'},{title:'Zulu',url:'https://example.com/'}]);
});
test('research catalog validates IDs, HTTPS source URLs and every record schema',()=>{
  assert.deepEqual(validateRecords(research,new Set(editorial.specialties.map(s=>s.id))),[]);
});
test('catalog validator rejects duplicates, unknown fields and unsafe source URLs',()=>{
  const bad=clone(research.slice(0,2));bad[1].id=bad[0].id;bad[0].privateNote='unexpected';bad[0].sources[0].url='javascript:alert(1)';
  const errors=validateRecords(bad);
  assert.ok(errors.some(e=>e.includes('duplicate ID')));assert.ok(errors.some(e=>e.includes('unknown field')));assert.ok(errors.some(e=>e.includes('HTTPS')));
});
test('all editorial pathway and roadmap references resolve',()=>{
  assert.deepEqual(validateEditorial(editorial,research),[]);
  const bad=clone(editorial);bad.phases[0].focus.push('missing-tool');
  assert.ok(validateEditorial(bad,research).some(e=>e.includes('unknown tool missing-tool')));
});
test('privacy checks detect private paths and transcript data without blocking ordinary prose',()=>{
  for(const text of ['C:\\Users\\Private\\Notes.txt','/home/private/file.txt','person@example.com','thread://private-id','{"threadId":"private-id"}','## User','{"role":"assistant"}'])assert.ok(validatePublicText(text).length>0,text);
  assert.deepEqual(validatePublicText('No private conversation transcripts are included. https://www.python.org/'),[]);
});
test('public build matches research, resolves local assets, and contains no private data markers',()=>{
  const result=audit();assert.deepEqual(result.errors,[]);
});

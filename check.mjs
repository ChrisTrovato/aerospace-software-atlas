import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = path.dirname(fileURLToPath(import.meta.url));
const FIELDS = ['id','name','kind','family','specialties','summary','why','firstProject','prerequisites','alternatives','priority','start','depth','access','platform','sources'];
const KINDS = new Set(['Application','Language','Library','Framework','Environment']);
const PRIORITIES = new Set(['core','branch','explore']);
const PHASES = new Set(['2026–2027','2028–2029','2030–2032','2033–2035']);
const DEPTHS = new Set(['Proficient','Working','Explore']);
const FAMILIES = new Set(['Computing & workflow','Visualization & communication','Embedded & avionics','Orbits & flight dynamics','Systems & verification','Propulsion & aerodynamics','CAD & manufacturing','Structures & materials','Thermal & fluids','Robotics & autonomy','Computing & controls','Electronics & RF','Testing & optimization']);
const plain = value => !!value && typeof value === 'object' && !Array.isArray(value);
const nonempty = value => typeof value === 'string' && value.trim().length > 0;

export function validateRecords(records, specialtyIds) {
  const errors = [], ids = new Set();
  const check = (ok, message) => { if (!ok) errors.push(message); };
  if (!Array.isArray(records)) return ['Catalog must be an array.'];
  check(records.length > 0, 'Catalog must not be empty.');
  records.forEach((record, index) => {
    const label = `Tool ${record?.id || index}`;
    if (!plain(record)) { errors.push(`${label}: record must be an object.`); return; }
    for (const key of FIELDS) check(Object.hasOwn(record,key), `${label}: missing ${key}.`);
    for (const key of Object.keys(record)) check(FIELDS.includes(key), `${label}: unknown field ${key}.`);
    check(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.id || ''), `${label}: unsafe ID.`);
    check(!ids.has(record.id), `${label}: duplicate ID.`); ids.add(record.id);
    for (const key of ['name','family','summary','why','firstProject','access','platform']) check(nonempty(record[key]),`${label}: ${key} must be nonempty text.`);
    for (const [key, choices] of [['kind',KINDS],['family',FAMILIES],['priority',PRIORITIES],['start',PHASES],['depth',DEPTHS]]) check(choices.has(record[key]), `${label}: invalid ${key} ${JSON.stringify(record[key])}.`);
    for (const key of ['specialties','prerequisites','alternatives']) {
      const values=record[key];
      check(Array.isArray(values), `${label}: ${key} must be an array.`);
      if (!Array.isArray(values)) continue;
      check(values.every(nonempty), `${label}: ${key} entries must be nonempty text.`);
      check(new Set(values).size===values.length, `${label}: duplicate ${key} entries.`);
      if (key!=='alternatives') check(values.length>0, `${label}: ${key} must not be empty.`);
    }
    if (specialtyIds && Array.isArray(record.specialties)) for (const id of record.specialties) check(specialtyIds.has(id),`${label}: unknown specialty ${id}.`);
    check(Array.isArray(record.sources) && record.sources.length>=1 && record.sources.length<=3,`${label}: expected one to three sources.`);
    if (Array.isArray(record.sources)) record.sources.forEach((source,i)=>validateSource(source,`${label} source ${i+1}`,check));
  });
  return errors;
}

function validateSource(source,label,check) {
  if (!plain(source)) { check(false,`${label}: source must be an object.`); return; }
  check(nonempty(source.title),`${label}: missing source title.`);
  try { const url=new URL(source.url); check(url.protocol==='https:' && !url.username && !url.password,`${label}: expected HTTPS URL without credentials.`); }
  catch { check(false,`${label}: invalid source URL.`); }
}

export function validateEditorial(editorial,records) {
  const errors=[], ids=new Set(records.map(record=>record.id));
  const check=(ok,message)=>{if(!ok)errors.push(message);};
  if (!plain(editorial)) return ['Editorial must be an object.'];
  for (const key of ['specialties','phases','glossary','evidence']) check(Array.isArray(editorial[key]) && editorial[key].length>0,`Editorial ${key} must be a nonempty array.`);
  const specialties=Array.isArray(editorial.specialties)?editorial.specialties:[], seen=new Set();
  for (const specialty of specialties) {
    if (!plain(specialty)) { errors.push('Specialty must be an object.'); continue; }
    const label=`Specialty ${specialty.id}`;
    check(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(specialty.id||''),`${label}: unsafe ID.`);
    check(!seen.has(specialty.id),`${label}: duplicate ID.`);seen.add(specialty.id);
    for(const key of ['name','short','description','symbol','foundation','project','depth'])check(nonempty(specialty[key]),`${label}: missing ${key}.`);
    check(/^#[0-9a-f]{6}$/i.test(specialty.color||''),`${label}: invalid color.`);
    check(Array.isArray(specialty.workflow)&&specialty.workflow.length>0&&specialty.workflow.every(nonempty),`${label}: invalid workflow.`);
    checkRefs(specialty.recommended,label+' recommended',ids,check);
  }
  const phases=Array.isArray(editorial.phases)?editorial.phases:[], phaseIds=new Set();
  for(const phase of phases){
    if(!plain(phase)){errors.push('Phase must be an object.');continue;}
    const label=`Phase ${phase.id}`;
    check(PHASES.has(phase.id),`${label}: unsupported phase.`);
    check(!phaseIds.has(phase.id),`${label}: duplicate phase.`);phaseIds.add(phase.id);
    for(const key of ['label','title','description','outcome'])check(nonempty(phase[key]),`${label}: missing ${key}.`);
    checkRefs(phase.focus,label+' focus',ids,check);
    check(Array.isArray(phase.steps)&&phase.steps.length>0,`${label}: missing steps.`);
    if(Array.isArray(phase.steps))for(const step of phase.steps)check(plain(step)&&nonempty(step.title)&&nonempty(step.body),`${label}: malformed step.`);
  }
  check(phaseIds.size===PHASES.size,'Editorial must include all four phases.');
  for(const glossary of editorial.glossary||[])check(plain(glossary)&&nonempty(glossary.term)&&nonempty(glossary.definition),'Malformed glossary entry.');
  for(const source of editorial.evidence||[]){validateSource(source,'Editorial evidence',check);check(nonempty(source?.note),'Editorial evidence needs an explanatory note.');}
  return errors;
}

function checkRefs(values,label,ids,check){
  check(Array.isArray(values)&&values.length>0,`${label}: expected a nonempty list.`);
  if(!Array.isArray(values))return;
  check(new Set(values).size===values.length,`${label}: duplicate references.`);
  for(const id of values)check(ids.has(id),`${label}: unknown tool ${id}.`);
}

export function validatePublicText(text,label='Public asset'){
  const patterns=[
    [/[a-z]:[\\/](?:users|documents|temp|windows|program files)[\\/]/i,'private Windows path'],
    [/(?:^|[\s"'=(])\/(?:Users|home)\/[A-Za-z0-9_. -]+\//m,'private home path'],
    [/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,'email address'],
    [/(?:chatgpt-conversation|thread|plugin|file):\/\//i,'private or local URI'],
    [/\b(?:conversationId|threadId|hostId)\s*["']?\s*:/,'conversation metadata'],
    [/^\s*#{1,4}\s*(?:user|assistant|system)\s*$/im,'transcript speaker marker'],
    [/"role"\s*:\s*"(?:user|assistant|system)"/,'transcript role object']
  ];
  return patterns.filter(([pattern])=>pattern.test(text)).map(([,type])=>`${label}: contains ${type}.`);
}

export function audit(root=ROOT){
  const errors=[],research=path.join(root,'research'),dist=path.join(root,'dist');
  const records=[],names=fs.readdirSync(research).filter(name=>name.endsWith('.json')).sort();
  for(const name of names){try{const items=JSON.parse(fs.readFileSync(path.join(research,name),'utf8'));if(!Array.isArray(items))errors.push(`${name}: root must be an array.`);else records.push(...items);}catch(error){errors.push(`${name}: ${error.message}`);}}
  let editorial;
  try{editorial=JSON.parse(fs.readFileSync(path.join(dist,'editorial.json'),'utf8'));}catch(error){errors.push(`editorial.json: ${error.message}`);}
  const specialtyIds=new Set(editorial?.specialties?.map(s=>s.id)||[]);
  errors.push(...validateRecords(records,specialtyIds));
  if(editorial)errors.push(...validateEditorial(editorial,records));
  let built;
  try{built=JSON.parse(fs.readFileSync(path.join(dist,'data.json'),'utf8'));errors.push(...validateRecords(built,specialtyIds));
    const expected=new Map(records.map(record=>[record.id,JSON.stringify(record)]));
    if(built.length!==records.length)errors.push('Built catalog count differs from research; run npm run build.');
    for(const record of built)if(expected.get(record.id)!==JSON.stringify(record))errors.push(`Built catalog differs for ${record.id}; run npm run build.`);
  }catch(error){errors.push(`data.json: ${error.message}; run npm run build.`);}
  const allIds=new Set(records.map(t=>t.id));
  const publicFiles=fs.readdirSync(dist,{recursive:true}).filter(name=>fs.statSync(path.join(dist,name)).isFile());
  for(const name of publicFiles){
    if(!/\.(?:html|css|m?js|json|svg|txt|md)$/i.test(name))continue;
    const file=path.join(dist,name),text=fs.readFileSync(file,'utf8');
    errors.push(...validatePublicText(text,name));
    const localRefs=[];
    if(name.endsWith('.html'))for(const match of text.matchAll(/<(?:a|link|script|img|source|iframe)\b[^>]*?\b(?:href|src)\s*=\s*["']([^"']+)["']/gi))localRefs.push(match[1]);
    if(name.endsWith('.css'))for(const match of text.matchAll(/url\(\s*["']?([^'"\s)]+)["']?\s*\)/g))localRefs.push(match[1]);
    if(name.endsWith('.js'))for(const match of text.matchAll(/\bfrom\s+["']([^"']+)["']/g))localRefs.push(match[1]);
    for(const ref of localRefs){
      if(ref.startsWith('#')||/^(?:https:|data:)/.test(ref))continue;
      if(/^[a-z][a-z0-9+.-]*:/i.test(ref)){errors.push(`${name}: unexpected URL scheme ${ref}.`);continue;}
      const cleanRef=ref.replace(/[?#].*$/,'');
      const codingRoute=/^\/coding_(?:learning_main|python|Cplusplus|matlab|C|bash)\/?$/.test(cleanRef);
      const target=cleanRef.startsWith('/')?path.resolve(dist,'.'+cleanRef.replace(/\/$/,'')+(codingRoute?'.html':'')):path.resolve(path.dirname(file),cleanRef);
      if(!target.startsWith(dist+path.sep)||!fs.existsSync(target)||!fs.statSync(target).isFile())errors.push(`${name}: missing or unsafe local asset ${ref}.`);
    }
    if(name==='app.js'){
      for(const match of text.matchAll(/(?:coreOrder\s*=|chips\()\s*\[([^\]]+)\]/g))for(const id of match[1].matchAll(/['"]([^'"]+)['"]/g))if(!allIds.has(id[1]))errors.push(`app.js: unknown hard-coded tool ${id[1]}.`);
      for(const match of text.matchAll(/\[([^\]]+)\]\.map\(id=>editorial\.specialties/g))for(const id of match[1].matchAll(/['"]([^'"]+)['"]/g))if(!specialtyIds.has(id[1]))errors.push(`app.js: unknown hard-coded specialty ${id[1]}.`);
    }
  }
  return {errors,tools:records.length,specialties:specialtyIds.size,researchFiles:names.length,publicFiles:publicFiles.length};
}

if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  const result=audit();
  if(result.errors.length){console.error(result.errors.map(error=>'- '+error).join('\n'));process.exitCode=1;}
  else console.log(`Atlas check passed: ${result.tools} tools, ${result.specialties} pathways, ${result.researchFiles} research files, ${result.publicFiles} public assets.`);
}

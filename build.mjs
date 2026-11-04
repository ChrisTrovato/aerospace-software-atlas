import fs from 'node:fs';
const names=fs.readdirSync('research').filter(n=>n.endsWith('.json'));
const tools=names.flatMap(name=>JSON.parse(fs.readFileSync('research/'+name,'utf8')));
if(new Set(tools.map(t=>t.id)).size!==tools.length)throw Error('Duplicate software IDs');
fs.writeFileSync('dist/data.json',JSON.stringify(tools,null,2)+'\n');
console.log(`Built catalog: ${tools.length} tools from ${names.length} research files.`);

await import('./coding/build.mjs');

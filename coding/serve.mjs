import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
http.createServer((req,res)=>{let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
 if(/^\/coding_(?:learning_main|python|Cplusplus|matlab|C|bash)\/?$/.test(name))name=name.replace(/\/$/,'')+'.html';
 if(name==='/')name='/coding_learning_main.html';
 if(name==='/softwares')name='/index.html';else name=name.replace(/^\/softwares\//,'/');
 const file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 try{const body=fs.readFileSync(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(body);}catch{res.writeHead(404).end('Not found');}
}).listen(8754,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:8754/coding_learning_main'));

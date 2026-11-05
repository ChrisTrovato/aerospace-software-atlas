import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {pythonChecks,readinessMessage,toolRole,focusView} from '../coding/learning-plan.mjs';

test('C++ readiness needs every actual checkpoint, ignores unrelated answers, and can be reversed',()=>{
 const values=Object.fromEntries(pythonChecks.map(([id])=>[id,true]));
 assert.match(readinessMessage(values),/^Ready to try C\+\+/);
 for(const [id] of pythonChecks){assert.match(readinessMessage({...values,[id]:false,unrelated:true}),/^4 of 5/);}
 assert.match(readinessMessage(Object.fromEntries(pythonChecks.map(([id])=>[id,'true']))),/^0 of 5/);
});
test('major tracks, supporting tools, and alternatives have distinct learning roles',()=>{
 assert.match(toolRole({id:'cpp'}).when,/not expert mastery|Start after/);
 assert.match(toolRole({id:'c'}).when,/not a prerequisite/);
 assert.match(toolRole({id:'git'}).label,/Supporting/);
 assert.equal(toolRole({id:'solidworks'}).label,toolRole({id:'freecad'}).label);
 assert.match(toolRole({id:'ros-2'}).when,/Python/);
});
test('both applications ship identical shared guidance and working cross-links',()=>{
 for(const name of ['learning-plan.mjs','learning-plan.css']){
  assert.equal(fs.readFileSync('dist/'+name,'utf8'),fs.readFileSync('coding/'+name,'utf8'));
  assert.equal(fs.readFileSync('dist/coding_assets/'+name,'utf8'),fs.readFileSync('coding/'+name,'utf8'));
 }
 assert.match(focusView('academy'),/href="\/softwares\/#focus"/);
 assert.match(focusView('atlas'),/href="\/coding_learning_main#focus"/);
 for(const page of ['learning_main','python','Cplusplus','matlab','C','bash'])assert.match(fs.readFileSync(`dist/coding_${page}.html`,'utf8'),/data-view="focus"/);
});

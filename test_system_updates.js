import ts from 'typescript';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
import worker from './worker.js';
function setup(){
 const sql=new DatabaseSync(':memory:');sql.exec(fs.readFileSync('schema.sql','utf8').split('-- DATOS INICIALES')[0]);
 const password=crypto.randomUUID();
 for(const [usuario,rol] of [['admin','admin'],['daniel','admin'],['operador','operador'],['otro','operador']])sql.prepare('INSERT INTO usuarios(usuario,password,nombre,rol) VALUES(?,?,?,?)').run(usuario,password,usuario,rol);
 const data=new Map([["config_servicio",JSON.stringify({estadoServicio:"activo"})],["config_mantenimiento",JSON.stringify({mantenimientoActivo:false})]]);
 const DB={prepare(query){const st=sql.prepare(query);let args=[];return {bind(...a){args=a;return this},async run(){const r=st.run(...args);return {success:true,meta:{changes:Number(r.changes)}}},async first(){return st.get(...args)||null},async all(){return {results:st.all(...args)}}}},async batch(sts){sql.exec('BEGIN');try{for(const st of sts)await st.run();sql.exec('COMMIT')}catch(e){sql.exec('ROLLBACK');throw e;}}};
 const env={DB,CORSSEN_STORAGE:{get:async(k,t)=>data.has(k)?t==='json'||t?.type==='json'?JSON.parse(data.get(k)):data.get(k):null,put:async(k,v)=>data.set(k,v),delete:async k=>data.delete(k)}};
 const call=(path,method='GET',body,cookie='',headers={})=>worker.fetch(new Request('https://test'+path,{method,headers:{'Content-Type':'application/json',Cookie:cookie,...headers},body:body===undefined?undefined:JSON.stringify(body)}),env,{});
 const login=async user=>{const r=await call('/api/login','POST',{usuario:user,password});assert.equal(r.status,200);return r.headers.get('set-cookie').split(';')[0]};
 return {sql,env,call,login};
}

import {handleSystemUpdates,currentRelease} from './system-updates.js';
test('release notes require a real session and acknowledgement cannot target another user or origin',async()=>{
 const {call,login,sql}=setup();
 assert.equal((await call('/api/updates','GET',undefined,'',{'x-usuario':'admin'})).status,401);
 const op=await login('operador'),admin=await login('admin');
 assert.equal((await call('/api/updates/read','POST',{releaseId:currentRelease.id},op,{Origin:'https://evil.test'})).status,403);
 assert.equal((await call('/api/updates/read','GET',undefined,op)).status,405);
 assert.equal((await call('/api/updates','POST',{},op)).status,405);
 assert.equal((await call('/api/updates/read','POST',{releaseId:'future'},op)).status,409);
 assert.equal((await call('/api/updates/read','POST',{releaseId:currentRelease.id,usuario:'admin'},op)).status,200);
 assert.equal((await(await call('/api/updates','GET',undefined,op)).json()).pending,false);
 assert.equal((await(await call('/api/updates','GET',undefined,admin)).json()).pending,true);
 assert.equal(sql.prepare('SELECT count(*) AS n FROM app_update_reads WHERE usuario=?').get('admin').n,0);
});
test('dismissal persists across logins/devices for each role, is idempotent and does not alter operational data',async()=>{
 const {call,login,sql}=setup();
 for(const user of ['admin','daniel','operador']){
  const first=await login(user),second=await login(user);
  let notes=await(await call('/api/updates','GET',undefined,first)).json();
  assert.equal(notes.pending,true);assert.equal(notes.release.id,currentRelease.id);
  for(let n=0;n<2;n++)assert.equal((await call('/api/updates/read','POST',{releaseId:notes.releaseId},first)).status,200);
  assert.deepEqual(await(await call('/api/updates','GET',undefined,second)).json(),{usuario:user,releaseId:currentRelease.id,pending:false,release:null});
  assert.equal(sql.prepare('SELECT count(*) AS n FROM app_update_reads WHERE usuario=?').get(user).n,1);
  await call('/api/logout','POST',{},first);
  assert.equal((await(await call('/api/updates','GET',undefined,await login(user))).json()).pending,false);
 }
 assert.equal(sql.prepare('SELECT count(*) AS n FROM usuarios').get().n,4);
});
test('a new published edition appears once while old or stale acknowledgements cannot hide it',async()=>{
 const {env}=setup(),user={usuario:'operador'},url='https://test/api/updates';
 const request=(path,body)=>new Request(path,{method:body?'POST':'GET',body:body?JSON.stringify(body):undefined});
 await handleSystemUpdates(request(url+'/read',{releaseId:currentRelease.id}),env.DB,user);
 const next={...currentRelease,id:'next-published-edition'};
 const status=await(await handleSystemUpdates(request(url),env.DB,user,next)).json();assert.equal(status.pending,true);
 assert.equal((await handleSystemUpdates(request(url+'/read',{releaseId:currentRelease.id}),env.DB,user,next)).status,409);
 assert.equal((await(await handleSystemUpdates(request(url),env.DB,user,next)).json()).pending,true);
 await handleSystemUpdates(request(url+'/read',{releaseId:next.id}),env.DB,user,next);
 assert.equal((await(await handleSystemUpdates(request(url),env.DB,user,next)).json()).pending,false);
});
test('failed reads are not reported as saved and a retry can acknowledge normally',async()=>{
 const {call,login,env}=setup(),op=await login('operador');
 const original=env.DB.prepare;
 env.DB.prepare=(query)=>{if(query.startsWith('INSERT OR IGNORE INTO app_update_reads'))throw Error('simulated persistence failure');return original(query)};
 assert.equal((await call('/api/updates/read','POST',{releaseId:currentRelease.id},op)).status,503);
 env.DB.prepare=original;
 assert.equal((await(await call('/api/updates','GET',undefined,op)).json()).pending,true);
 assert.equal((await call('/api/updates/read','POST',{releaseId:currentRelease.id},op)).status,200);
 assert.equal((await(await call('/api/updates','GET',undefined,op)).json()).pending,false);
});

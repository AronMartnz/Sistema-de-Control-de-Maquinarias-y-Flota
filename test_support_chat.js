import ts from 'typescript';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {handleSupportChat} from './support-chat.js';
import { application as worker } from './worker.js';
import fs from 'node:fs';
import vm from 'node:vm';
function setup(legacy=[]) {
 const sqlite=new DatabaseSync(':memory:');
 sqlite.exec('CREATE TABLE usuarios(usuario TEXT PRIMARY KEY,avatar TEXT)');
 const db={prepare(sql){const st=sqlite.prepare(sql);let values=[];return {bind(...args){values=args;return this;},async run(){st.run(...values);return {success:true};},async first(){return st.get(...values)||null;},async all(){return {results:st.all(...values)};}};},async batch(sts){for(const st of sts) await st.run();}};
 return {DB:db,CORSSEN_STORAGE:{get:async()=>legacy}};
}
const call=(env,user,path='',method='GET',body)=>handleSupportChat(new Request('https://test/api/soporte/'+(path||'mensajes'),{method,headers:{'x-usuario':user,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined}),env);
test('send, receive, read receipts, isolation and pending notifications',async()=>{
 const env=setup();
 const sent=await (await call(env,'daniel','','POST',{texto:'Hola Aron'})).json();
 assert.equal(sent.guardado,true);
 let inbox=await(await call(env,'admin','conversaciones')).json();
 assert.equal(inbox.totalPendientes,1);
 assert.equal((await(await call(env,'rodrigo')).json()).mensajes.length,0);
 assert.equal((await(await call(env,'daniel','mensajes?usuario=rodrigo')).json()).mensajes[0].usuario,'daniel');
 await call(env,'admin','mensajes?usuario=daniel&leido=1');
 assert.equal((await(await call(env,'daniel')).json()).mensajes[0].leidoPorDestinatario,true);
 await call(env,'admin','','POST',{texto:'Recibido',destinatario:'daniel'});
 await call(env,'daniel','mensajes?leido=1');
 const messages=(await(await call(env,'admin','mensajes?usuario=daniel')).json()).mensajes;
 assert.equal(messages.length,3);assert.equal(messages[1].esBot,true);assert.equal(messages[2].leidoPorDestinatario,true);
});
test('storage failure never confirms a send; routes never return HTML',async()=>{
 assert.equal((await call({},'daniel','','POST',{texto:'Hola'})).status,503);
 const env=setup();env.DB.prepare=()=>{throw new Error('simulated D1 failure');};
 const failed=await call(env,'daniel','','POST',{texto:'Hola'});assert.equal(failed.status,503);assert.equal((await failed.json()).ok,false);
 const routed=await worker.fetch(new Request('https://test/api/soporte/mensajes',{headers:{'x-usuario':'daniel'}}),setup(),{});
 assert.match(routed.headers.get('content-type'),/application\/json/);
 assert.equal((await routed.json()).ok,true);
});
test('legacy messages are imported once and receipts survive later reads',async()=>{
 const env=setup([{id:'old',usuario:'daniel',destinatario:'admin',texto:'Anterior',esSoporte:false}]);
 assert.equal((await(await call(env,'daniel')).json()).mensajes.length,1);
 await call(env,'admin','marcar-leido','POST',{usuario:'daniel'});
 assert.equal((await(await call(env,'daniel')).json()).mensajes[0].leidoPorAdmin,true);
 assert.equal((await(await call(env,'daniel')).json()).mensajes.length,1);
});
test('concurrent sends are stored independently',async()=>{
 const env=setup();await call(env,'daniel');
 await Promise.all(Array.from({length:12},(_,i)=>call(env,'daniel','','POST',{texto:'Mensaje '+i})));
 assert.equal((await(await call(env,'admin','mensajes?usuario=daniel')).json()).mensajes.length,12);
});
test('widget sends without ReferenceError and rejects HTML success responses',async()=>{
 const source=['functions-core.js','functions-operations.js','script.js'].map(p=>fs.readFileSync(p,'utf8')).join('\n');
 const ast=ts.createSourceFile('script.js',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);const fn=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name.text==='enviarMensajeUsuarioSoporte').getText(ast);
 let sent=0;const check={};const input={value:''};
 const context={sessionStorage:{getItem:()=> 'daniel'},document:{getElementById:id=>id==='inputPreguntaSoporte'?input:id.startsWith('check-')?check:{appendChild(){},scrollHeight:1},createElement:()=>({})},generarEtiquetaRemitenteChat:()=>'',escapeHtmlSoporte:s=>s,BASE_CONOCIMIENTO_SOPORTE:{},reproducirChimeMensaje(){},setTimeout(){},console,fetch:async()=>{sent++;return new Response('<html>fallback</html>',{headers:{'Content-Type':'text/html'}});}};
 check.style={};vm.createContext(context);vm.runInContext(fn,context);
 await context.enviarMensajeUsuarioSoporte('Hola Aron',null);
 assert.equal(sent,1);assert.equal(check.textContent,'No enviado');assert.equal(input.value,'Hola Aron');
});
import bcrypt from 'bcryptjs';
test('login accepts only configured credentials and verifies bcrypt hashes',async()=>{
 const password=crypto.randomUUID();
 const hash=await bcrypt.hash(password,4);
 const env={CORSSEN_STORAGE:{get:async key=>key==='usuarios_lista'?[{usuario:'admin',password:hash,rol:'admin',nombre:'Admin de prueba'}]:null}};
 const login=key=>worker.fetch(new Request('https://test/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({usuario:'admin',password:key})}),env,{});
 assert.equal((await login(password)).status,200);
 assert.equal((await login(crypto.randomUUID())).status,401);
 const noAccounts={CORSSEN_STORAGE:{get:async()=>null}};
 const response=await worker.fetch(new Request('https://test/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({usuario:'admin',password})}),noAccounts,{});
 assert.equal(response.status,401);
});
test('bot recognizes accents and complete words without matching unrelated substrings',()=>{
 const detect=globalThis.SoporteBot.detectar;
 assert.equal(detect('Necesito cambiar la contraseña'),'roles');assert.equal(detect('litros de aceite del camión'),'aceite');assert.equal(detect('historial mensual del inventario'),'mensual');assert.equal(detect('No llegan los mensajes'),'sincronizacion');assert.equal(detect('stock disponible'),'inventario');assert.equal(detect('foto del motor'),null);assert.equal(detect('hola, gracias'),null);
});
test('automatic guidance persists, remains isolated and never marks a request as read by Aron',async()=>{
 const env=setup();const response=await(await call(env,'daniel','','POST',{texto:'Cómo ajustar el stock'})).json();
 assert.equal(response.mensajeBot.esBot,true);assert.equal(response.mensajeBot.destinatario,'daniel');assert.match(response.mensajeBot.texto,/cantidad final/);
 const history=await(await call(env,'daniel')).json();assert.equal(history.mensajes.length,2);assert.equal(history.mensajes[0].leidoPorAdmin,false);assert.equal(history.mensajes[1].nombre,'Asistente automático ServiTec Pro');
 assert.equal((await(await call(env,'rodrigo')).json()).mensajes.length,0);
 const pending=await(await call(env,'admin','conversaciones')).json();assert.equal(pending.totalPendientes,1);
 const sent=await(await call(env,'admin','','POST',{texto:'Revisaré el inventario',destinatario:'daniel'})).json();assert.equal(sent.mensajeBot,null);
});
test('selected topic is validated and human guidance never promises immediate attention',async()=>{
 const env=setup();const topic=await(await call(env,'daniel','','POST',{texto:'Ver instrucciones',temaSoporte:'mensual'})).json();assert.match(topic.mensajeBot.tituloContexto,/mensual/);
 const invalid=await(await call(env,'daniel','','POST',{texto:'Hola',temaSoporte:'__proto__'})).json();assert.equal(invalid.mensajeBot,null);
 const human=await(await call(env,'daniel','','POST',{texto:'Quiero hablar con Aron'})).json();assert.match(human.mensajeBot.texto,/disponibilidad/);assert.doesNotMatch(human.mensajeBot.texto,/inmediata|en línea/);
});
test('profile avatar markup supports photos/presets and escapes unsafe values with a fallback',()=>{
 const text=fs.readFileSync('functions-operations.js','utf8');const ast=ts.createSourceFile('ops.js',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);const code=['escapeHtmlSoporte','avatarHtmlSoporte'].map(name=>ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name.text===name).getText(ast)).join('\n');const ctx={};vm.createContext(ctx);vm.runInContext(code,ctx);
 assert.match(ctx.avatarHtmlSoporte('avatar-camion'),/🚚/);assert.match(ctx.avatarHtmlSoporte('https://example.com/photo.png'),/<img/);assert.match(ctx.avatarHtmlSoporte('https://example.com/" onload="alert(1)'),/&quot;/);assert.doesNotMatch(ctx.avatarHtmlSoporte('javascript:alert(1)'),/<img/);assert.doesNotMatch(ctx.avatarHtmlSoporte('data:image/svg+xml;base64,abc'),/<img/);assert.match(ctx.avatarHtmlSoporte(null),/👤/);assert.match(ctx.avatarHtmlSoporte('avatar-admin',true),/🤖/);
});

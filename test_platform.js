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
test('authentication rejects forged identity, empty login, cross-origin writes and expired sessions',async()=>{
 const {sql,call,login}=setup();
 assert.equal((await call('/api/usuarios','GET',undefined,'',{'x-usuario':'admin'})).status,401);
 assert.equal((await call('/api/login','POST',{})).status,400);
 const cookie=await login('admin');
 assert.equal((await call('/api/servicio/estado','POST',{estadoServicio:'suspendido'},cookie,{Origin:'https://evil.test'})).status,403);
 await call('/api/logout','POST',{},cookie);
 assert.equal((await call('/api/session','GET',undefined,cookie)).status,401);
});
test('role matrix protects user administration, fleet, technical sheets, maintenance and support',async()=>{
 const {call,login}=setup();const op=await login('operador'),admin=await login('admin'),daniel=await login('daniel');
 for(const [path,method,body] of [['/api/usuarios','GET'],['/api/usuarios','POST',{usuario:'bad',nombre:'bad'}],['/api/programa/TEST','PUT',{}],['/api/fichas/TEST','PUT',{}],['/api/mantenimiento/config','POST',{}],['/api/servicio/estado','POST',{}],['/api/soporte/conversaciones','GET'],['/api/backup/cron-ejecutar','POST',{}]]) assert.equal((await call(path,method,body,op,{'x-usuario':'admin'})).status,403,path);
 assert.equal((await call('/api/usuarios','GET',undefined,daniel)).status,200);
 assert.equal((await call('/api/mantenimiento/config','POST',{},daniel)).status,403);
 assert.equal((await call('/api/soporte/conversaciones','GET',undefined,admin)).status,200);
});
test('all operational modules synchronize between users with conflict protection',async()=>{
 const {call,login}=setup();const admin=await login('admin'),op=await login('operador'),other=await login('otro');
 const keys=['corssen_programa_v2','corssen_stock_v2','corssen_fichas_v2','flota_vehiculos_v3','flota_maquinarias_v3','flota_cargas','flota_mantenciones_v3','flota_inventario_v3','corssen_tambores_aceite_v2','corssen_historial_aceite_v1','corssen_tanque_combustible_v1','corssen_historial_recargas_comb_v1'];
 await call('/api/state','GET',undefined,admin);
 for(const key of keys){const value=key==='corssen_fichas_v2'?{TEST:{nombre:'Prueba'}}:key==='corssen_tambores_aceite_v2'?{tambor1:{actual:20,capacidad:200},tambor2:{actual:30,capacidad:200}}:key==='corssen_tanque_combustible_v1'?{actual:100,capacidad:400}:key==='corssen_stock_v2'?[{id:crypto.randomUUID(),stock:10}]:[{id:crypto.randomUUID()}];assert.equal((await call('/api/state','PUT',{key,value,version:0},admin)).status,200,key);const r=await(await call('/api/state','GET',undefined,op)).json();assert.deepEqual(r.entries.find(e=>e.key===key).value,value,key);}
 assert.equal((await call('/api/state','PUT',{key:'flota_cargas',value:[],version:1},op)).status,200);
 assert.equal((await call('/api/state','PUT',{key:'flota_cargas',value:[{id:'stale'}],version:1},other)).status,409);
 const r=await(await call('/api/state','GET',undefined,admin)).json();assert.deepEqual(r.entries.find(e=>e.key==='flota_cargas').value,[]);
 assert.equal((await call('/api/state','PUT',{key:'flota_vehiculos_v3',value:[],version:1},op)).status,403);
});
test('fleet CRUD, technical sheets and user lifecycle persist across sessions',async()=>{
 const {call,login}=setup();const admin=await login('admin'),op=await login('operador');
 const item={equipo:'Equipo de prueba',cat:'AUXILIARES',estado:'Operativo'};
 assert.equal((await call('/api/programa/TEST','PUT',item,admin)).status,200);
 const list=await(await call('/api/programa','GET',undefined,op)).json();assert.equal(list.find(e=>e.cod==='TEST').equipo,item.equipo);
 assert.equal((await call('/api/fichas/TEST','PUT',{nombre:'Equipo de prueba',filtros:[]},admin)).status,200);
 assert.equal((await call('/api/fichas/TEST','GET',undefined,op)).status,200);
 assert.equal((await call('/api/programa/TEST','DELETE',undefined,admin)).status,200);
 assert.equal((await call('/api/fichas/TEST','DELETE',undefined,admin)).status,200);
 assert.equal((await call('/api/usuarios','POST',{usuario:'test',nombre:'Prueba',password:crypto.randomUUID(),rol:'operador'},admin)).status,200);
 assert.equal((await call('/api/usuarios/test','DELETE',undefined,admin)).status,200);
});
test('support chat uses authenticated identity and never exposes another operator conversation',async()=>{
 const {call,login}=setup();const admin=await login('admin'),op=await login('operador'),other=await login('otro');
 const sent=await(await call('/api/soporte/mensajes','POST',{texto:'Prueba aislada',usuario:'admin',esSoporte:true},op,{'x-usuario':'admin'})).json();assert.equal(sent.mensajeEnviado.usuario,'operador');assert.equal(sent.mensajeEnviado.esSoporte,false);
 const inbox=await(await call('/api/soporte/mensajes?usuario=operador','GET',undefined,other)).json();assert.equal(inbox.mensajes.length,0);
 await call('/api/soporte/mensajes?usuario=operador&leido=1','GET',undefined,admin);
 const status=await(await call('/api/soporte/mensajes','GET',undefined,op)).json();assert.equal(status.mensajes[0].leidoPorDestinatario,true);
});
test('backup storage, retrieval and service controls function with configured users',async()=>{
 const {call,login}=setup();const admin=await login('admin'),op=await login('operador');
 const saved=await call('/api/backup/guardar','POST',{id:'TEST',timestamp:Date.now(),data:{flota_cargas:[{id:'sample'}]}},op);assert.equal(saved.status,200);
 assert.equal((await call('/api/backup/obtener/ultimo','GET',undefined,admin)).status,200);
 assert.equal((await call('/api/mantenimiento/config','POST',{mantenimientoActivo:true},admin)).status,200);
 assert.equal((await(await call('/api/mantenimiento/config','GET')).json()).mantenimientoActivo,true);
 assert.equal((await call('/api/ruta-inexistente','POST',{},admin)).status,404);
});
import vm from 'node:vm';
test('work-order linked changes commit together and stale batches leave every module unchanged',async()=>{
 const {call,login}=setup();const admin=await login('admin'),op=await login('operador');
 await call('/api/state','GET',undefined,admin);
 const seed=[{key:'corssen_programa_v2',value:[{cod:'EQ',equipo:'Equipo',horometro:'0'}],version:0},{key:'corssen_stock_v2',value:[{id:'S',stock:10}],version:0},{key:'flota_mantenciones_v3',value:[],version:0}];
 assert.equal((await call('/api/state','PUT',{entries:seed},admin)).status,200);
 const linked=[{key:'corssen_programa_v2',value:[{cod:'EQ',equipo:'Equipo',horometro:'12'}],version:1},{key:'corssen_stock_v2',value:[{id:'S',stock:8}],version:1},{key:'flota_mantenciones_v3',value:[{id:'OT-test',codigoEquipo:'EQ'}],version:1}];
 assert.equal((await call('/api/state','PUT',{entries:linked},op)).status,200);
 assert.equal((await call('/api/state','PUT',{entries:seed.map(c=>({...c,version:1}))},admin)).status,409);
 const result=await(await call('/api/state','GET',undefined,op)).json();assert.equal(result.entries.find(e=>e.key==='corssen_stock_v2').value[0].stock,8);
 assert.equal((await call('/api/state','PUT',{key:'corssen_stock_v2',value:[{stock:-1}],version:2},op)).status,400);
 assert.equal((await call('/api/state','PUT',{key:'corssen_tanque_combustible_v1',value:{actual:500,capacidad:400},version:0},op)).status,400);
});
test('real client sync propagates between two sessions and preserves offline changes',async()=>{
 const {call,login}=setup();const admin=await login('admin'),op=await login('operador');
 await call('/api/state','GET',undefined,admin);await call('/api/state','PUT',{key:'flota_cargas',value:[],version:0},admin);
 const script=['functions-core.js','functions-operations.js','script.js'].map(p=>fs.readFileSync(p,'utf8')).join('\n');const ast=ts.createSourceFile('script.js',script,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);const helpers=ast.statements.filter(n=>ts.isFunctionDeclaration(n)&&['leerColaCompartida','guardarColaCompartida','sincronizarEstadoCompartido'].includes(n.name.text)).map(n=>n.getText(ast)).join('\n');const code=helpers+'\n'+script.slice(script.indexOf('const ESTADO_COMPARTIDO ='));
 function client(cookie,user){
  class Storage{constructor(){this.data=new Map()}getItem(k){return this.data.get(k)||null}setItem(k,v){this.data.set(k,String(v))}}
  const localStorage=new Storage(),sessionStorage=new Storage();sessionStorage.setItem('usuarioLogueado',user);
  const context={Storage,localStorage,sessionStorage,cargas:[],console,Map,Set,JSON,document:{readyState:'loading',addEventListener(){},querySelector:()=>({textContent:'',appendChild(){}}),createElement:()=>({})},setInterval(){},window:{addEventListener(){},location:{replace(){}}},esUsuarioAdministrador:()=>user==='admin'};
  for(const name of ['actualizarPermisosFichasTecnicas','actualizarPermisosFlotaRegistrada','actualizarPermisosModuloRespaldos','renderizarDashboard','renderizarProgramaMaestro','renderizarStockInsumos','renderizarKardexMovimientos','renderizarMantenciones','renderizarModuloAceite','renderizarModuloCombustible','renderizarTablasOriginales','renderizarFlotaRegistrada'])context[name]=()=>{};
  context.fetch=async(url,options={})=>{if(context.offline)throw Error('offline simulated');return call(url,options.method||'GET',options.body?JSON.parse(options.body):undefined,cookie)};
  vm.createContext(context);vm.runInContext(code,context);return context;
 }
 const first=client(admin,'admin'),second=client(op,'operador');
 await first.sincronizarEstadoCompartido();await second.sincronizarEstadoCompartido();
 vm.runInContext('cargas=[{id:"C-1",litros:20}];localStorage.setItem("flota_cargas",JSON.stringify(cargas))',first);
 await first.sincronizarEstadoCompartido();await second.sincronizarEstadoCompartido();
 assert.equal(second.cargas[0].id,'C-1');
 second.offline=true;vm.runInContext('cargas.push({id:"C-2",litros:10});localStorage.setItem("flota_cargas",JSON.stringify(cargas))',second);
 await second.sincronizarEstadoCompartido();assert.match(second.localStorage.getItem('corssen_sync_pendientes_operador'),/C-2/);
 second.offline=false;await second.sincronizarEstadoCompartido();await first.sincronizarEstadoCompartido();assert.equal(first.cargas.length,2);
});
import bcrypt from 'bcryptjs';
test('only authenticated general admin can reveal actual available passwords; hashes and placeholders never appear',async()=>{
 const {sql,call,login}=setup();const admin=await login('admin'),daniel=await login('daniel');
 const previous=sql.prepare("SELECT password FROM usuarios WHERE usuario='operador'").get().password;
 const hashed=await bcrypt.hash(previous,4);sql.prepare("UPDATE usuarios SET password=? WHERE usuario='operador'").run(hashed);
 const op=await login('operador');
 for(const cookie of [op,daniel])assert.equal((await call('/api/usuarios/claves','GET',undefined,cookie)).status,403);
 assert.equal((await call('/api/usuarios/claves','GET',undefined,'',{'x-usuario':'admin'})).status,401);
 const ordinary=await(await call('/api/usuarios','GET',undefined,admin)).json();assert.equal(ordinary.find(u=>u.usuario==='operador').password_recuperable,false);assert.equal(ordinary.find(u=>u.usuario==='admin').password_recuperable,true);assert.equal(ordinary.some(u=>'password' in u || 'password_visible' in u),false);
 const response=await call('/api/usuarios/claves','GET',undefined,admin);assert.equal(response.status,200);assert.match(response.headers.get('Cache-Control'),/no-store/);
 const details=(await response.json()).usuarios;assert.equal(details.find(u=>u.usuario==='operador').clave,null);assert.equal(details.find(u=>u.usuario==='admin').clave,sql.prepare("SELECT password FROM usuarios WHERE usuario='admin'").get().password);
 assert.equal(details.some(u=>u.clave===hashed),false);
});
test('monthly history is shared by admin and operator, authenticated and read-only',async()=>{
 const {call,login}=setup();const admin=await login('admin'),op=await login('operador');
 assert.equal((await call('/api/inventory/monthly')).status,401);
 await call('/api/state','GET',undefined,admin);
 const stock=[{detalle:'Prueba',stock:10,costo:100}];
 assert.equal((await call('/api/state','PUT',{entries:[{key:'corssen_stock_v2',value:stock,version:0},{key:'flota_inventario_v3',value:[],version:0}]},admin)).status,200);
 const a=await(await call('/api/inventory/monthly','GET',undefined,admin)).json();const b=await(await call('/api/inventory/monthly','GET',undefined,op)).json();
 assert.equal(a.months[0].value,1000);assert.equal(b.months[0].value,1000);assert.equal(a.months[0].opening,null);
 assert.equal((await call('/api/inventory/monthly','POST',{value:0},op)).status,405);
 assert.equal((await call('/api/state','PUT',{key:'corssen_stock_v2',value:[{stock:0}],version:0},op)).status,409);
 const unchanged=await(await call('/api/inventory/monthly','GET',undefined,op)).json();assert.equal(unchanged.months[0].value,1000);
});
test('a failed bot insert rolls back the user message instead of confirming a partial send',async()=>{
 const {sql,call,login}=setup();const op=await login('operador');
 await call('/api/soporte/mensajes','GET',undefined,op);
 sql.exec("CREATE TRIGGER reject_bot BEFORE INSERT ON soporte_chat WHEN NEW.usuario='asistente_servitec' BEGIN SELECT RAISE(ABORT,'simulated bot storage failure'); END");
 const result=await call('/api/soporte/mensajes','POST',{texto:'Cómo ajustar el stock'},op);assert.equal(result.status,503);
 assert.equal(sql.prepare('SELECT count(*) AS n FROM soporte_chat').get().n,0);
});
test('chat shows current profile photos for old messages and ignores forged message avatars',async()=>{
 const {sql,call,login}=setup();const op=await login('operador'),admin=await login('admin'),other=await login('otro');
 const photo='data:image/png;base64,aGVsbG8=';sql.prepare('UPDATE usuarios SET avatar=? WHERE usuario=?').run(photo,'operador');
 await call('/api/soporte/mensajes','POST',{texto:'Consulta de prueba',avatar:'https://fake.invalid/avatar.png'},op);
 let history=await(await call('/api/soporte/mensajes?usuario=operador','GET',undefined,admin)).json();assert.equal(history.perfiles.operador,photo);assert.equal(history.mensajes[0].avatar,undefined);
 const updated='avatar-camion';sql.prepare('UPDATE usuarios SET avatar=? WHERE usuario=?').run(updated,'operador');
 history=await(await call('/api/soporte/mensajes','GET',undefined,op)).json();assert.equal(history.perfiles.operador,updated);
 const isolated=await(await call('/api/soporte/mensajes?usuario=operador','GET',undefined,other)).json();assert.equal(isolated.mensajes.length,0);
 const conv=await(await call('/api/soporte/conversaciones','GET',undefined,admin)).json();assert.equal(conv.conversaciones.find(c=>c.usuario==='operador').avatar,updated);
});

test('D1 quota exhaustion returns service unavailable instead of invalid credentials',async()=>{
 const {env,call}=setup();env.DB.prepare=()=>{throw Error("Your account has exceeded D1's free tier daily row read limit.")};
 const response=await call('/api/login','POST',{usuario:'admin',password:'isolated-test'});
 assert.equal(response.status,503);const body=await response.json();assert.equal(body.error,'CUPO_BASE_DATOS_AGOTADO');assert.match(body.mensaje,/No es un error de contraseña/);
 assert.equal(response.headers.get('set-cookie'),null);
});

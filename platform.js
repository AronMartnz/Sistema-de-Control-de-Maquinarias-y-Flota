import {handleSystemUpdates} from './system-updates.js';
import {ensureInventoryMonths,inventoryMonthStatement,inventoryMonthHistory} from './inventory-monthly.js';
// Authentication and live shared state for the production Worker.
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
export const stateKeys=['corssen_programa_v2','corssen_stock_v2','corssen_fichas_v2','flota_vehiculos_v3','flota_maquinarias_v3','flota_cargas','flota_mantenciones_v3','flota_inventario_v3','corssen_tambores_aceite_v2','corssen_tambor_aceite_v1','corssen_historial_aceite_v1','corssen_tanque_combustible_v1','corssen_historial_recargas_comb_v1','corssen_kardex_v1'];
const hash=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),b=>b.toString(16).padStart(2,'0')).join('');
async function sessions(db){await db.prepare('CREATE TABLE IF NOT EXISTS app_sessions (token_hash TEXT PRIMARY KEY, usuario TEXT NOT NULL, expires INTEGER NOT NULL)').run();}
export async function secureFetch(request,env,ctx,app){
 const url=new URL(request.url),path=url.pathname;
 if(/(?:^|\/)(?:usuarios\.json|server\.ts|worker\.js|platform\.js|support-chat\.js|[^/]+\.(?:sql|toml|env))$/i.test(path)||path.includes('/backups/'))return json({error:'Archivo no público'},403);
 const protectedPage=['/','/index.html','/usuarios','/usuarios.html','/public/index.html','/public/usuarios.html'].includes(path);
 if(!path.startsWith('/api/') && /\.(?:json|ts|sql|toml|env)$/i.test(path))return json({error:'Archivo no público'},403);
 if ((!path.startsWith('/api/') && !protectedPage) || path==='/api/health' || request.method==='OPTIONS') return app.fetch(request,env,ctx);
 if (!env.DB) return json({error:'Almacenamiento no disponible'},503);
 const db=env.DB.withSession?env.DB.withSession('first-primary'):env.DB;
 try {
  await sessions(db);
  if(path==='/api/login' && request.method==='POST'){
   const body=await request.clone().json().catch(()=>null);
   if(!body?.usuario || !body?.password) return json({mensaje:'Indica usuario y contraseña'},400);
   const response=await app.fetch(request,env,ctx);
   if(!response.ok)return response;
   const account=await response.clone().json();
   await db.prepare('DELETE FROM app_sessions WHERE expires<=?').bind(Date.now()).run();
   const token=crypto.randomUUID()+crypto.randomUUID();
   await db.prepare('INSERT INTO app_sessions(token_hash,usuario,expires) VALUES(?,?,?)').bind(await hash(token),account.usuario,Date.now()+12*60*60*1000).run();
   const headers=new Headers(response.headers);headers.set('Set-Cookie',`corssen_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=43200`);headers.set('Cache-Control','no-store');
   return new Response(response.body,{status:response.status,headers});
  }
  // The login page needs the public service/maintenance status before signing in.
  const publicStatus=request.method==='GET' && ['/api/servicio/estado','/api/mantenimiento/config'].includes(path);
  const token=(request.headers.get('Cookie')||'').match(/(?:^|;\s*)corssen_session=([^;]+)/)?.[1];
  const session=token?await db.prepare('SELECT usuario FROM app_sessions WHERE token_hash=? AND expires>?').bind(await hash(token),Date.now()).first():null;
  const user=session?await db.prepare('SELECT usuario,rol,estado FROM usuarios WHERE lower(usuario)=?').bind(session.usuario).first():null;
  if(!user){if(protectedPage)return Response.redirect(new URL('/login.html',request.url),302);if(publicStatus){const headers=new Headers(request.headers);headers.delete('x-usuario');return app.fetch(new Request(request,{headers}),env,ctx);}return json({error:'SESION_REQUERIDA',mensaje:'Inicia sesión nuevamente'},401);}
  if(user.estado==='suspendido' && user.usuario!=='admin' && protectedPage)return Response.redirect(new URL('/login.html?suspendido=1',request.url),302);
  if(user.estado==='suspendido' && user.usuario!=='admin')return json({error:'USUARIO_SUSPENDIDO'},403);
  if(user.usuario!=='admin' && !['/api/logout','/api/session','/api/servicio/estado','/api/mantenimiento/config'].includes(path)){
   const service=await app.fetch(new Request(new URL('/api/servicio/estado',request.url)),env,ctx);
   const maintenance=await app.fetch(new Request(new URL('/api/mantenimiento/config',request.url)),env,ctx);
   if((await service.json()).estadoServicio==='suspendido'||(await maintenance.json()).mantenimientoActivo)return json({error:'ACCESO_SUSPENDIDO'},403);
  }
  if(path.startsWith('/api/usuarios/admin') && user.usuario!=='admin')return json({error:'Acceso exclusivo del administrador general'},403);
  const read=['GET','HEAD'].includes(request.method),admin=user.rol==='admin',general=user.usuario==='admin';
  const origin=request.headers.get('Origin');
  if(!read && origin && origin!==url.origin)return json({error:'Origen no autorizado'},403);
  if(path==='/api/logout'){await db.prepare('DELETE FROM app_sessions WHERE token_hash=?').bind(await hash(token)).run();return new Response('{}',{headers:{'Content-Type':'application/json','Set-Cookie':'corssen_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'}});}
  if(path==='/api/session')return json({usuario:user.usuario,rol:user.rol});
  if(path==='/api/updates'||path==='/api/updates/read')return await handleSystemUpdates(request,db,user);
  if(path==='/api/inventory/monthly'){
   if(request.method!=='GET')return json({error:'Método no permitido'},405);
   return json(await inventoryMonthHistory(db));
  }
  if(path==='/api/usuarios/claves' && !general)return json({error:'Acceso exclusivo del administrador general'},403);
  const ownAvatar=path==='/api/perfil/avatar'||path===`/api/usuarios/${encodeURIComponent(user.usuario)}/avatar`;
  if(path.startsWith('/api/usuarios') && !admin && !ownAvatar)return json({error:'Acceso exclusivo de administración'},403);
  if(!read && (path.startsWith('/api/programa')||path.startsWith('/api/fichas')||path==='/api/sync/fichas') && !admin)return json({error:'Acceso exclusivo de administración'},403);
  if((path.startsWith('/api/mantenimiento/')||path.startsWith('/api/servicio/')) && !read && !general)return json({error:'Acceso exclusivo del administrador general'},403);
  if(path==='/api/soporte/conversaciones'||path==='/api/soporte/marcar-leido'||path==='/api/backup/cron-ejecutar'){if(!general)return json({error:'Acceso exclusivo del administrador general'},403);}
  if(protectedPage){if(path.includes('usuarios')&&!admin)return Response.redirect(new URL('/',request.url),302);const headers=new Headers(request.headers);headers.set('x-usuario',user.usuario);return app.fetch(new Request(request,{headers}),env,ctx);}
  if(path==='/api/state')return liveState(request,db,user);
  if(path.startsWith('/api/programa')||path.startsWith('/api/fichas')||path==='/api/sync/fichas')return records(request,db,user,app,env,ctx);
  const headers=new Headers(request.headers);headers.set('x-usuario',user.usuario);
  const response=await app.fetch(new Request(request,{headers}),env,ctx);
  if((response.headers.get('Content-Type')||'').includes('text/html'))return json({error:'Ruta API no encontrada'},404);
  const outputHeaders=new Headers(response.headers);outputHeaders.set('Cache-Control','no-store');
  return new Response(response.body,{status:response.status,headers:outputHeaders});
 }catch(error){console.error('Platform request failed',error);return json({error:'No se pudo completar la operación'},503);}
}
async function liveState(request,db,user){
 await db.prepare('CREATE TABLE IF NOT EXISTS app_state (key TEXT PRIMARY KEY, value TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1)').run();
 // Initialize from a durable backup once, never from a browser's default dataset.
 await db.prepare('CREATE TABLE IF NOT EXISTS app_state_meta (id TEXT PRIMARY KEY)').run();
 if(!await db.prepare("SELECT id FROM app_state_meta WHERE id='initialized'").first()){
  const row=await db.prepare('SELECT data_json FROM corssen_backups ORDER BY timestamp DESC LIMIT 1').first();
  const data=row?.data_json?JSON.parse(row.data_json):{};
  // Preserve more recent individual equipment edits when initializing live state.
  const {results:program}=await db.prepare('SELECT * FROM corssen_programa').all();
  if(program.length){const items=new Map((data.corssen_programa_v2||[]).map(p=>[String(p.cod).toUpperCase(),p]));for(const row of program)items.set(String(row.cod).toUpperCase(),{...items.get(String(row.cod).toUpperCase()),...row});data.corssen_programa_v2=[...items.values()];}
  const {results:sheets}=await db.prepare('SELECT * FROM corssen_fichas').all();
  if(sheets.length){data.corssen_fichas_v2={...(data.corssen_fichas_v2||{})};for(const row of sheets){const details=row.especificaciones_json?JSON.parse(row.especificaciones_json):{};data.corssen_fichas_v2[row.cod]={...data.corssen_fichas_v2[row.cod],...details,codigo:row.cod,nombre:row.equipo||details.nombre||row.cod,filtros:row.filtros_json?JSON.parse(row.filtros_json):(details.filtros||[])};}}
  for(const key of stateKeys)if(data[key]!==undefined)await db.prepare('INSERT OR IGNORE INTO app_state(key,value) VALUES(?,?)').bind(key,JSON.stringify(data[key])).run();
  await db.prepare("INSERT OR IGNORE INTO app_state_meta(id) VALUES('initialized')").run();
 }
 if(request.method==='GET'){const {results}=await db.prepare('SELECT key,value,version FROM app_state').all();return json({ok:true,user:{usuario:user.usuario,rol:user.rol},entries:results.map(r=>({key:r.key,value:JSON.parse(r.value),version:r.version}))});}
 if(request.method!=='PUT')return json({error:'Método no permitido'},405);
 const body=await request.json();
 const changes=body.entries || [body];
 if(!Array.isArray(changes)||!changes.length||changes.length>stateKeys.length||new Set(changes.map(c=>c.key)).size!==changes.length)return json({error:'Cambios inválidos'},400);
 const statements=[],versions={},guard=crypto.randomUUID();
 await db.prepare('CREATE TABLE IF NOT EXISTS app_state_guard (id TEXT PRIMARY KEY, valid INTEGER NOT NULL CHECK(valid=1))').run();
 for(const change of changes){
  const {key,value,version}=change;
  if(!stateKeys.includes(key)||value===undefined||!Number.isInteger(version)||version<0)return json({error:'Estado inválido'},400);

  if(value===null || typeof value!=='object')return json({error:'Datos del módulo inválidos'},400);
  const arrayKeys=['corssen_programa_v2','corssen_stock_v2','flota_vehiculos_v3','flota_maquinarias_v3','flota_cargas','flota_mantenciones_v3','flota_inventario_v3','corssen_historial_aceite_v1','corssen_historial_recargas_comb_v1'];
  if(arrayKeys.includes(key) && !Array.isArray(value))return json({error:'El módulo requiere una lista de registros'},400);
  if(!arrayKeys.includes(key) && Array.isArray(value))return json({error:'Estructura inválida del módulo'},400);
  if(key==='corssen_stock_v2' && value.some(r=>!Number.isFinite(Number(r.stock))||Number(r.stock)<0))return json({error:'El stock no puede ser negativo'},400);
  const tanks=key==='corssen_tambores_aceite_v2'?Object.values(value):['corssen_tanque_combustible_v1','corssen_tambor_aceite_v1'].includes(key)?[value]:[];
  if(tanks.some(t=>!t||!Number.isFinite(t.actual)||t.actual<0||(t.capacidad!==undefined&&t.actual>t.capacidad)))return json({error:'Saldo de combustible o aceite inválido'},400);
  const encoded=JSON.stringify(value);if(encoded.length>2000000)return json({error:'Datos demasiado grandes'},413);
  const current=await db.prepare('SELECT value,version FROM app_state WHERE key=?').bind(key).first();
  if(user.rol!=='admin' && ['corssen_programa_v2','corssen_fichas_v2','flota_vehiculos_v3','flota_maquinarias_v3'].includes(key) && !allowedWorkOrderUpdate(key,current?JSON.parse(current.value):null,value,changes))return json({error:'Acceso exclusivo de administración'},403);
  if(current?.value===encoded){versions[key]=current.version;continue;}
  if((current?.version||0)!==version)return json({error:'CONFLICTO',mensaje:'Otro usuario modificó este módulo. Tus cambios se conservan en este dispositivo.'},409);
  const id=guard+key;
  statements.push(db.prepare('INSERT OR IGNORE INTO app_state(key,value,version) VALUES(?,?,0)').bind(key,encoded));
  statements.push(db.prepare('INSERT INTO app_state_guard(id,valid) SELECT ?,CASE WHEN EXISTS(SELECT 1 FROM app_state WHERE key=? AND version=?) THEN 1 ELSE 0 END').bind(id,key,version));
  statements.push(db.prepare('UPDATE app_state SET value=?,version=version+1 WHERE key=? AND version=?').bind(encoded,key,version));
  statements.push(db.prepare('DELETE FROM app_state_guard WHERE id=?').bind(id));
  versions[key]=version+1;
 }
 const trackInventory=changes.some(c=>['corssen_stock_v2','flota_inventario_v3'].includes(c.key));
 if(trackInventory && statements.length){await ensureInventoryMonths(db);const now=new Date();statements.unshift(inventoryMonthStatement(db,now,true));statements.push(inventoryMonthStatement(db,now));}
 try {if(statements.length)await db.batch(statements);}
 catch(error){if(String(error).includes('CHECK constraint'))return json({error:'CONFLICTO'},409);throw error;}
 return json({ok:true,versions,version:body.key?versions[body.key]:undefined});

}
// Versioned editing used by the legacy fleet/sheet endpoints as well as live clients.
async function records(request,db,user,app,env,ctx){
 const path=new URL(request.url).pathname;
 const sheet=path.startsWith('/api/fichas')||path==='/api/sync/fichas';
 const key=sheet?'corssen_fichas_v2':'corssen_programa_v2';
 await liveState(new Request('https://test/api/state'),db,user);
 let row=await db.prepare('SELECT value,version FROM app_state WHERE key=?').bind(key).first();
 if(!row){
  const sourcePath=sheet?'/api/fichas':'/api/programa';
  const headers=new Headers(request.headers);headers.set('x-usuario',user.usuario);
  const source=await app.fetch(new Request(new URL(sourcePath,request.url),{headers}),env,ctx);
  if(!source.ok)return source;
  await db.prepare('INSERT OR IGNORE INTO app_state(key,value) VALUES(?,?)').bind(key,JSON.stringify(await source.json())).run();
  row=await db.prepare('SELECT value,version FROM app_state WHERE key=?').bind(key).first();
 }
 const value=JSON.parse(row.value),code=decodeURIComponent(path.split('/')[3]||'').trim().toUpperCase();
 if(request.method==='GET'){
  if(path==='/api/sync/fichas')return json({fichas:value});
  if(!code)return json(value);
  const item=sheet?value[code]:value.find(p=>String(p.cod).toUpperCase()===code);
  return item?json(item):json({error:'Registro no encontrado'},404);
 }
 if(!['PUT','POST','DELETE'].includes(request.method))return json({error:'Método no permitido'},405);
 const body=request.method==='DELETE'?null:await request.json();
 if(path==='/api/sync/fichas'){
  if(!body.fichas||typeof body.fichas!=='object'||Array.isArray(body.fichas))return json({error:'Fichas inválidas'},400);
  Object.assign(value,body.fichas);
 }else{
  if(!code)return json({error:'Falta el código del equipo'},400);
  if(sheet){if(body)value[code]={...value[code],...body,codigo:code};else delete value[code];}
  else{const index=value.findIndex(p=>String(p.cod).toUpperCase()===code);if(body){const next={...(value[index]||{}),...body,cod:code};if(index<0)value.push(next);else value[index]=next;}else if(index>=0)value.splice(index,1);}
 }
 const result=await db.prepare('UPDATE app_state SET value=?,version=version+1 WHERE key=? AND version=?').bind(JSON.stringify(value),key,row.version).run();
 if(!result.meta?.changes&&!result.changes)return json({error:'CONFLICTO',mensaje:'Otra sesión modificó este módulo; vuelve a intentarlo'},409);
 return json({ok:true,mensaje:'Registro guardado',version:row.version+1});
}
// Operators may update operational readings/history only together with work orders;
// they cannot create/delete equipment or alter its technical identity.
function allowedWorkOrderUpdate(key,before,after,changes){
 const orders=changes.find(c=>c.key==='flota_mantenciones_v3')?.value;
 if(!Array.isArray(orders)||!before)return false;
 const codes=new Set(orders.map(o=>String(o.codigoEquipo||o.patente||'').toUpperCase()));
 const allowed={corssen_programa_v2:['horometro','prox','estado','observaciones'],flota_vehiculos_v3:['kilometraje','estado'],flota_maquinarias_v3:['horometro','estado'],corssen_fichas_v2:['historial']}[key];
 const entries=value=>Array.isArray(value)?value.map(r=>[String(r.cod||r.codigo||r.numeroMaquinaria||r.id||r.patente).toUpperCase(),r]):Object.entries(value);
 const oldMap=new Map(entries(before)),newEntries=entries(after);
 if(oldMap.size!==newEntries.length)return false;
 const strip=obj=>Object.fromEntries(Object.entries(obj).filter(([k])=>!allowed.includes(k)));
 return newEntries.every(([code,item])=>{
  const old=oldMap.get(code);if(!old)return false;
  if(JSON.stringify(old)===JSON.stringify(item))return true;
  return codes.has(code.toUpperCase()) && JSON.stringify(strip(old))===JSON.stringify(strip(item));
 });
}

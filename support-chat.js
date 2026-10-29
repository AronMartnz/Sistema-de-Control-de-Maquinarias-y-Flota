import './support-bot.js';
export async function handleSupportChat(request, env) {
  const url = new URL(request.url), path = url.pathname;
  if (!path.startsWith('/api/soporte/') && path !== '/api/chat/mensajes') return null;
  const reply = (body, status = 200) => new Response(JSON.stringify(body), {status, headers: {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
  const isMessages = ['/api/soporte/mensajes','/api/chat/mensajes'].includes(path);
  if (!isMessages && !['/api/soporte/conversaciones','/api/soporte/marcar-leido'].includes(path)) return reply({error:'Ruta no encontrada'},404);
  const caller = String(request.headers.get('x-usuario') || '').trim().toLowerCase(), admin = caller === 'admin';
  if (!caller) return reply({error:'Falta identificar al usuario'},401);
  if (!isMessages && !admin) return reply({error:'Acceso restringido'},403);
  if (!env.DB) return reply({error:'El almacenamiento del chat no está disponible'},503);
  // Read from the primary so polling observes acknowledged writes across devices.
  const db = env.DB.withSession ? env.DB.withSession('first-primary') : env.DB;
  try {
    await db.prepare('CREATE TABLE IF NOT EXISTS soporte_chat (id TEXT PRIMARY KEY, usuario TEXT NOT NULL, destinatario TEXT NOT NULL, data TEXT NOT NULL, leido INTEGER NOT NULL DEFAULT 0)').run();
    await db.prepare('CREATE TABLE IF NOT EXISTS soporte_chat_meta (id TEXT PRIMARY KEY)').run();
    if (!(await db.prepare("SELECT id FROM soporte_chat_meta WHERE id = 'kv-import-v1'").first())) {
      const kv = env.CORSSEN_STORAGE || env.CORSSEN_KV;
      const legacy = kv ? await kv.get('corssen_soporte_chat','json') : [];
      const inserts = (Array.isArray(legacy) ? legacy : []).filter(m => m.id && m.id !== 'MSG-INIT-001').map(m => db.prepare('INSERT OR IGNORE INTO soporte_chat (id,usuario,destinatario,data,leido) VALUES (?,?,?,?,?)').bind(m.id,String(m.usuario || 'operador').toLowerCase(),String(m.destinatario || (m.esSoporte ? 'daniel':'admin')).toLowerCase(),JSON.stringify(m),!m.esSoporte && m.leidoPorAdmin ? 1:0));
      for (let i=0;i<inserts.length;i+=50) await db.batch(inserts.slice(i,i+50));
      await db.prepare("INSERT OR IGNORE INTO soporte_chat_meta (id) VALUES ('kv-import-v1')").run();
    }
    if (path === '/api/soporte/marcar-leido' && request.method === 'POST') {
      const body = await request.json(), target = String(body.usuario || '').trim().toLowerCase();
      if (!target) return reply({error:'Selecciona una conversación'},400);
      await db.prepare("UPDATE soporte_chat SET leido=1 WHERE usuario=? AND destinatario='admin'").bind(target).run();
      return reply({ok:true});
    }
    if (isMessages && request.method === 'POST') {
      const body = await request.json(), texto = String(body.texto || '').trim();
      if (!texto || texto.length>10000) return reply({error:'Escribe un mensaje de hasta 10000 caracteres'},400);
      const destinatario = admin ? String(body.destinatario || '').trim().toLowerCase():'admin';
      if (!destinatario || destinatario===caller) return reply({error:'Selecciona el destinatario'},400);
      const now = new Date();
      const message = {id:'MSG-'+crypto.randomUUID(),usuario:caller,destinatario,nombre:String(body.nombre || caller),rol:admin?'admin':'operador',texto,timestamp:now.toISOString(),hora:now.toLocaleTimeString('es-CL',{timeZone:'America/Santiago',hour:'2-digit',minute:'2-digit'}),esSoporte:admin,necesitaAtencionHumana:!admin,leidoPorAdmin:false,guardado:true,leidoPorDestinatario:false};
      const tema=!admin ? (Object.hasOwn(SoporteBot.temas,body.temaSoporte || '') ? body.temaSoporte : SoporteBot.detectar(texto)) : null;
      const ayuda=tema ? SoporteBot.temas[tema] : null;
      const bot=ayuda ? {id:'BOT-'+crypto.randomUUID(),usuario:'asistente_servitec',destinatario:caller,nombre:'Asistente automático ServiTec Pro',rol:'bot',texto:ayuda.respuesta,tituloContexto:ayuda.titulo,timestamp:now.toISOString(),hora:message.hora,esSoporte:true,esBot:true,guardado:true,leidoPorDestinatario:false} : null;
      const guardar=m=>db.prepare('INSERT INTO soporte_chat (id,usuario,destinatario,data) VALUES (?,?,?,?)').bind(m.id,m.usuario,m.destinatario,JSON.stringify(m));
      await db.batch(bot ? [guardar(message),guardar(bot)] : [guardar(message)]);
      return reply({ok:true,guardado:true,mensajeEnviado:message,mensajeBot:bot});
    }
    if (isMessages && request.method === 'DELETE') {
      if (!admin) return reply({error:'Acceso restringido'},403);
      await db.prepare('DELETE FROM soporte_chat').run();
      return reply({ok:true,mensajes:[]});
    }
    if (request.method !== 'GET') return reply({error:'Método no permitido'},405);
    const target = admin ? String(url.searchParams.get('usuario') || '').trim().toLowerCase():caller;
    if (isMessages && url.searchParams.get('leido') === '1' && target) await db.prepare('UPDATE soporte_chat SET leido=1 WHERE usuario=? AND destinatario=?').bind(admin?target:'admin',caller).run();
    const query = admin && (!target || target==='todos' || target==='admin') ? db.prepare('SELECT data,leido FROM soporte_chat ORDER BY rowid'):db.prepare('SELECT data,leido FROM soporte_chat WHERE usuario=? OR destinatario=? ORDER BY rowid').bind(target,target);
    const {results} = await query.all();
    const parsed = results.map(row => ({...row,message:JSON.parse(row.data)}));
    // Look up each sender once, rather than reading the same profile for every message.
    const authors=[...new Set(parsed.filter(r=>!r.message.esBot).map(r=>String(r.message.usuario||'').toLowerCase()))];
    const profiles=authors.length ? (await db.prepare(`SELECT usuario,avatar FROM usuarios WHERE lower(usuario) IN (${authors.map(()=>'?').join(',')})`).bind(...authors).all()).results : [];
    const avatars=new Map(profiles.map(p=>[String(p.usuario).toLowerCase(),p.avatar]));
    const mensajes = parsed.map(row => {const m=row.message;return {...m,guardado:true,leidoPorDestinatario:!!row.leido,leidoPorAdmin:!m.esSoporte && !!row.leido};});
    const pendientes = mensajes.filter(m => !m.esSoporte && !m.leidoPorAdmin);
    if (path === '/api/soporte/conversaciones') {
      const conversaciones = new Map(['daniel','rodrigo','operador'].map(usuario => [usuario,{usuario,nombre:usuario,rol:'operador',avatar:'👤',totalMensajes:0,sinLeer:0}]));
      for (const m of mensajes) {
        const usuario=m.esSoporte?m.destinatario:m.usuario;
        const c=conversaciones.get(usuario)||{usuario,nombre:m.nombre||usuario,rol:m.rol,avatar:'👤',totalMensajes:0,sinLeer:0};
        if (!m.esSoporte) { c.nombre=m.nombre||usuario; c.avatar=avatars.get(String(m.usuario).toLowerCase()) || "👤"; }
        Object.assign(c,{ultimoMensaje:m.texto,ultimaHora:m.hora,ultimoTimestamp:Date.parse(m.timestamp)||0});
        c.totalMensajes++;
        if (!m.esSoporte && !m.leidoPorAdmin) c.sinLeer++;
        c.necesitaAtencion=c.sinLeer>0;
        conversaciones.set(usuario,c);
      }
      const lista=[...conversaciones.values()].sort((a,b)=>(b.ultimoTimestamp||0)-(a.ultimoTimestamp||0));
      return reply({ok:true,conversaciones:lista,totalPendientes:lista.filter(c=>c.sinLeer).length});
    }
    return reply({ok:true,mensajes,perfiles:Object.fromEntries(avatars),total:mensajes.length,pendientesAdminCount:admin?pendientes.length:0,ultimosPendientes:admin?pendientes.slice(-5):[]});
  } catch (error) {
    console.error('Support chat storage failed',error);
    return reply({ok:false,error:'No se pudo guardar o cargar el chat. Intenta nuevamente.'},503);
  }
}

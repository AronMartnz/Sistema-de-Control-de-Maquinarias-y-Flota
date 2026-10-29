// Publish a new id only with a new set of user-facing release notes. See UPDATES.md.
export const currentRelease = {
  "id": "corssen-2026-10-29-acceso-disponibilidad-3",
  "title": "Entrada al sistema más fluida",
  "description": "Corregimos la transición después de validar tus credenciales.",
  "sections": [
    {
      "title": "Inicio de sesión",
      "tag": "CORRECCIÓN",
      "items": [
        "El logo de Corssen permanece visible hasta que se abre el sistema, sin dejar una pantalla vacía al terminar la bienvenida.",
        "El panel se muestra sin el desvanecimiento que provocaba el corte visual.",
        "Los límites de Cloudflare y los errores del servidor se distinguen de las contraseñas incorrectas al iniciar sesión."
      ]
    }
  ]
};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
export async function handleSystemUpdates(request,db,user,release=currentRelease){
 const path=new URL(request.url).pathname;
 if(!user?.usuario)return json({error:'SESION_REQUERIDA'},401);
 if(!((path==='/api/updates'&&request.method==='GET')||(path==='/api/updates/read'&&request.method==='POST')))return json({error:'Método no permitido'},405);
 const username=String(user.usuario).trim().toLowerCase();
 let body;
 if(request.method==='POST'){
  body=await request.json().catch(()=>null);
  if(body?.releaseId!==release.id)return json({error:'ACTUALIZACION_NO_VIGENTE',mensaje:'Recarga para consultar las novedades actuales.'},409);
 }
 await db.prepare('CREATE TABLE IF NOT EXISTS app_update_reads (usuario TEXT NOT NULL, release_id TEXT NOT NULL, read_at INTEGER NOT NULL, PRIMARY KEY(usuario,release_id))').run();
 if(request.method==='GET'){
  const read=await db.prepare('SELECT read_at FROM app_update_reads WHERE usuario=? AND release_id=?').bind(username,release.id).first();
  return json({usuario:username,releaseId:release.id,pending:!read,release:read?null:release});
 }
 await db.prepare('INSERT OR IGNORE INTO app_update_reads(usuario,release_id,read_at) VALUES(?,?,?)').bind(username,release.id,Date.now()).run();
 return json({ok:true,releaseId:release.id});
}

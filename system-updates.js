// Publish a new id only with a new set of user-facing release notes. See UPDATES.md.
export const currentRelease = {
  "id": "corssen-2026-10-28-novedades-1",
  "title": "Tu sistema sigue mejorando",
  "description": "Conoce las mejoras y correcciones incorporadas para facilitar tu trabajo diario.",
  "sections": [
    {
      "title": "Experiencia y diseño",
      "tag": "MEJORAS",
      "items": [
        "Nuevo inicio de sesión con mensajes animados y bienvenida con el logo de Corssen.",
        "Dashboard renovado, menú lateral plegable y vistas más compactas de aceites y combustible.",
        "Aviso de novedades que se muestra una sola vez por usuario y actualización."
      ]
    },
    {
      "title": "Inventario y abastecimiento",
      "tag": "GESTIÓN",
      "items": [
        "Ajuste de stock con motivo, responsable e historial de movimientos.",
        "Imágenes automáticas para insumos y consulta del valor del inventario por mes."
      ]
    },
    {
      "title": "Sincronización y soporte",
      "tag": "CORRECCIONES",
      "items": [
        "Estado compartido entre administradores y operadores, con control de cambios simultáneos.",
        "Chat con confirmaciones de lectura, fotos de perfil y respuestas automáticas organizadas.",
        "Validación de existencias y saldos al registrar consumos de insumos, aceites y combustible."
      ]
    },
    {
      "title": "Mantenimiento, respaldos y acceso",
      "tag": "CONTROL",
      "items": [
        "Gestión de respaldos a petición y avisos de mantenimiento o suspensión de acceso.",
        "Acceso con cuentas configuradas y retiro de contraseñas incorporadas en el código."
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

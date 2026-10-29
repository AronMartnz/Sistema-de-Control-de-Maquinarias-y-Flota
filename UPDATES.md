# Novedades del sistema

El aviso se muestra después del acceso autenticado, solo si la cuenta no ha leído la edición vigente. La X, el botón Entendido y Escape guardan la misma confirmación. Las lecturas se guardan en D1 por usuario y edición; otro navegador o dispositivo consulta esa misma información.

## Publicar cambios nuevos

Al publicar una mejora, corrección, mantenimiento o cambio en respaldos que deba conocer el usuario:

1. Actualizar `currentRelease` en `system-updates.js`, con un `id` nuevo y estable para esa publicación y el resumen real de cambios.
2. Incluir todos los cambios de esa publicación en `sections`. No anunciar tareas ni respaldos como realizados sin verificarlos.
3. Publicar el Worker y los archivos web juntos. Mantener las copias de raíz y `public/` iguales.

No cambiar el identificador al iniciar sesión, recargar, repetir un despliegue sin novedades o modificar datos operativos (stock, combustible, OTs, chats). Esos eventos no son versiones nuevas del sistema. Para evitar avisos repetidos, los futuros cambios deben seguir este registro de publicación; no se genera un texto automáticamente a partir del código.

`GET /api/updates` devuelve solo la edición pendiente del usuario autenticado. `POST /api/updates/read` acepta únicamente el identificador vigente y usa la identidad de la sesión, nunca un usuario enviado por el cliente. Una tabla nueva `app_update_reads` se crea de forma idempotente al usar la función; no cambia registros operativos existentes.

Si la confirmación no se puede guardar por falta de conexión, el aviso se cierra y queda una lectura pendiente local para reintentar. Se informa al usuario y se reintenta al volver a cargar. La lectura entre dispositivos queda sincronizada cuando el servidor confirma el guardado.

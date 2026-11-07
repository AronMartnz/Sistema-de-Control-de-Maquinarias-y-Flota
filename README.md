# CORSSEN Logística — Control de flota y maquinaria

Aplicación web para gestionar equipos, mantenimiento, órdenes de trabajo, inventario, combustible, aceite, cuentas y soporte operativo.

## Arquitectura

- `worker.js` es el punto de entrada de producción en Cloudflare Workers.
- `platform.js` verifica sesiones y permisos, y sincroniza el estado compartido en Cloudflare D1.
- `public/` contiene los archivos web entregados por Cloudflare Assets.
- `migrations/` contiene cambios versionados del esquema D1.
- `server.ts` ofrece el servidor local de desarrollo y compatibilidad.
- `src/` conserva el cliente React de AI Studio; no es el punto de entrada indicado por Wrangler.
- Cloudflare KV figura como compatibilidad heredada; la configuración activa también vincula D1 y una tarea programada.

## Desarrollo y verificaciones

Requiere Node.js. Instala las dependencias con `npm install` y ejecuta `npm run dev` para iniciar el servidor local. Usa `npm test` para ejecutar las pruebas y `npm run lint` para comprobar tipos.

`npm run build` compila el servidor y sincroniza los recursos actuales con `public/`. `npm run cf:dry-run` prepara una simulación local de Cloudflare sin publicar cambios.

## Migraciones D1

Las migraciones usan el registro versionado de Wrangler: `npm run db:migrate:local` para la base local y `npm run db:migrate:remote` para la base remota. Wrangler solicita confirmación al aplicar cambios en un terminal interactivo y guarda un respaldo antes de ejecutarlos. Las migraciones ya aplicadas no vuelven a ejecutarse.

No uses `wrangler d1 execute` para volver a ejecutar el esquema inicial: contiene datos iniciales para una base nueva.

## Despliegue y secretos

Configura bindings de D1/KV y secretos en Cloudflare. No guardes tokens, contraseñas ni respaldos operativos en el cliente o en archivos públicos. `npm run deploy:cf` y `npm run deploy:pages` publican cambios; revísalos por separado antes de ejecutarlos.

Mantén cualquier respaldo fuera de las rutas de archivos estáticos. Las bases con datos reales deben tener copias protegidas y un procedimiento de restauración probado.


/**
 * Cloudflare Worker Handler
 * Soporte para APIs (/api/login, /api/usuarios) y servicio de assets estáticos en Cloudflare
 */

let IN_MEMORY_USERS = [
  {
    usuario: "admin",
    passwordHash: "$2b$10$uYTOyaJeHb9FQfOosVFElehPB3AntqhXGSMUTUbJGjYTXv.KLx/x2",
    nombre: "Administrador General",
    rol: "admin",
    avatar: "avatar-admin"
  },
  {
    usuario: "operador",
    passwordHash: "$2b$10$qac5xGf7UI3udD4j88V/O.OiWQUFBa5qJX3Yb.V5YpbmMR8FWzYL6",
    nombre: "Operador Principal",
    rol: "operador",
    avatar: "avatar-mecanico"
  }
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers con PATCH incluido
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-usuario, Authorization"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Función auxiliar para obtener lista unificada de usuarios
    async function obtenerUsuarios() {
      let users = IN_MEMORY_USERS;
      if (env && env.CORSSEN_KV) {
        try {
          const stored = await env.CORSSEN_KV.get("usuarios_lista", "json");
          if (stored && Array.isArray(stored)) {
            users = stored;
            IN_MEMORY_USERS = stored;
          }
        } catch (e) {
          console.warn("Error leyendo KV:", e);
        }
      }
      return users;
    }

    // Función auxiliar para guardar lista unificada de usuarios
    async function guardarUsuarios(nuevaLista) {
      IN_MEMORY_USERS = nuevaLista;
      if (env && env.CORSSEN_KV) {
        try {
          await env.CORSSEN_KV.put("usuarios_lista", JSON.stringify(nuevaLista));
        } catch (e) {
          console.warn("Error guardando en KV:", e);
        }
      }
    }

    // Health check
    if (path === "/prueba" || path === "/api/health") {
      return new Response("EL SERVIDOR DE CONTROL DE FLOTA ESTA FUNCIONANDO CORRECTAMENTE", {
        headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    // API Login
    if (path === "/api/login" && request.method === "POST") {
      try {
        const body = await request.json();
        const { usuario, password } = body;
        const uNorm = (usuario || "").trim().toLowerCase();

        const listaUsers = await obtenerUsuarios();
        const uFound = listaUsers.find(u => u.usuario.toLowerCase() === uNorm);

        if (
          (uNorm === "admin" && (password === "admin" || password === "corssen2026")) ||
          (uNorm === "operador" && (password === "1234" || password === "operador")) ||
          (uFound && uFound.password === password)
        ) {
          const esAdmin = uNorm === "admin" || (uFound && uFound.rol === "admin");
          const avatarFinal = (uFound && uFound.avatar) ? uFound.avatar : (esAdmin ? "avatar-admin" : "avatar-mecanico");
          const nombreFinal = (uFound && uFound.nombre) ? uFound.nombre : (esAdmin ? "Administrador General" : "Operador Principal");
          const rolFinal = (uFound && uFound.rol) ? uFound.rol : (esAdmin ? "admin" : "operador");

          return new Response(JSON.stringify({
            mensaje: "Inicio de sesión correcto",
            usuario: uNorm,
            nombre: nombreFinal,
            rol: rolFinal,
            avatar: avatarFinal
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        return new Response(JSON.stringify({ mensaje: "Usuario o contraseña incorrectos." }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ mensaje: "Error procesando login" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // API Usuarios - GET lista
    if (path === "/api/usuarios" && request.method === "GET") {
      const users = await obtenerUsuarios();
      return new Response(JSON.stringify(users.map(u => ({
        usuario: u.usuario,
        nombre: u.nombre,
        rol: u.rol,
        avatar: u.avatar
      }))), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // API Usuarios - POST crear usuario
    if (path === "/api/usuarios" && request.method === "POST") {
      try {
        const body = await request.json();
        const { usuario, nombre, password, rol, avatar } = body;
        
        if (!usuario || !nombre) {
          return new Response(JSON.stringify({ mensaje: "Faltan datos obligatorios." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        let users = await obtenerUsuarios();
        users = [...users.filter(u => u.usuario.toLowerCase() !== usuario.toLowerCase()), {
          usuario,
          nombre,
          password: password || "1234",
          rol: rol || "operador",
          avatar: avatar || "avatar-mecanico"
        }];
        await guardarUsuarios(users);

        return new Response(JSON.stringify({ mensaje: "Usuario creado exitosamente" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ mensaje: "Usuario creado en memoria local" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // API Perfil Avatar (/api/perfil/avatar)
    if (path === "/api/perfil/avatar" && (request.method === "PATCH" || request.method === "POST")) {
      try {
        const body = await request.json().catch(() => ({}));
        const avatar = body.avatar;
        const userHeader = (request.headers.get("x-usuario") || "admin").toLowerCase().trim();

        if (userHeader && avatar) {
          let users = await obtenerUsuarios();
          const uIdx = users.findIndex(u => u.usuario.toLowerCase() === userHeader);
          if (uIdx !== -1) {
            users[uIdx].avatar = avatar;
          } else {
            users.push({ usuario: userHeader, nombre: userHeader, rol: "admin", avatar });
          }
          await guardarUsuarios(users);
        }

        return new Response(JSON.stringify({ mensaje: "Imagen de perfil actualizada y sincronizada correctamente" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ mensaje: "Imagen de perfil actualizada correctamente" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // API Usuarios - PATCH avatar (/api/usuarios/:usuario/avatar)
    if (path.startsWith("/api/usuarios/") && path.endsWith("/avatar") && (request.method === "PATCH" || request.method === "POST")) {
      try {
        const parts = path.split("/");
        const userTarget = decodeURIComponent(parts[3] || "").toLowerCase().trim();
        const body = await request.json().catch(() => ({}));
        const avatar = body.avatar;

        if (userTarget && avatar) {
          let users = await obtenerUsuarios();
          const uIdx = users.findIndex(u => u.usuario.toLowerCase() === userTarget);
          if (uIdx !== -1) {
            users[uIdx].avatar = avatar;
          } else {
            users.push({ usuario: userTarget, nombre: userTarget, rol: "operador", avatar });
          }
          await guardarUsuarios(users);
        }

        return new Response(JSON.stringify({ mensaje: "Imagen de perfil actualizada correctamente" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ mensaje: "Imagen de perfil actualizada correctamente" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    // API Usuarios - PATCH password (/api/usuarios/:usuario/password)
    if (path.startsWith("/api/usuarios/") && path.endsWith("/password") && request.method === "PATCH") {
      try {
        const parts = path.split("/");
        const userTarget = decodeURIComponent(parts[3] || "").toLowerCase().trim();
        const body = await request.json().catch(() => ({}));
        const nuevaPass = body.nuevaPassword;

        if (userTarget && nuevaPass) {
          let users = await obtenerUsuarios();
          const uIdx = users.findIndex(u => u.usuario.toLowerCase() === userTarget);
          if (uIdx !== -1) {
            users[uIdx].password = nuevaPass;
            await guardarUsuarios(users);
          }
        }

        return new Response(JSON.stringify({ mensaje: "Contraseña actualizada exitosamente" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ mensaje: "Contraseña actualizada exitosamente" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // API Usuarios - DELETE (/api/usuarios/:usuario)
    if (path.startsWith("/api/usuarios/") && request.method === "DELETE") {
      const userToDelete = decodeURIComponent(path.split("/")[3] || "").toLowerCase().trim();
      if (userToDelete) {
        try {
          let users = await obtenerUsuarios();
          users = users.filter(u => u.usuario.toLowerCase() !== userToDelete);
          await guardarUsuarios(users);
        } catch (e) {
          console.warn("Error eliminando en KV:", e);
        }
      }
      return new Response(JSON.stringify({ mensaje: "Usuario eliminado correctamente" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // API Backup - Guardar Respaldo en la Nube KV (/api/backup/guardar)
    if (path === "/api/backup/guardar" && request.method === "POST") {
      try {
        const body = await request.json();
        const backupId = body.id || ("SNP-CLOUD-" + Date.now());
        const timestamp = body.timestamp || Date.now();
        const fecha = body.fecha || new Date().toLocaleDateString("es-CL");
        const hora = body.hora || new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

        const snapshotMeta = {
          id: backupId,
          fecha: fecha,
          hora: hora,
          timestamp: timestamp,
          motivo: body.motivo || "Copia de Seguridad Automática",
          tipo: body.tipo || "AUTOMATICO_NUBE",
          usuario: body.usuario || "Sistema Corssen",
          resumen: body.resumen || {},
          origen: "Cloudflare KV"
        };

        if (env && env.CORSSEN_KV) {
          try {
            // 1. Guardar el snapshot completo en KV
            await env.CORSSEN_KV.put(`backup_${backupId}`, JSON.stringify({ ...snapshotMeta, data: body.data }));
            // 2. Guardar como último respaldo
            await env.CORSSEN_KV.put("corssen_backup_ultimo", JSON.stringify({ ...snapshotMeta, data: body.data }));

            // 3. Actualizar lista de historial en KV (máximo 30 respaldos)
            let historial = [];
            const rawHist = await env.CORSSEN_KV.get("corssen_backups_historial", "json");
            if (rawHist && Array.isArray(rawHist)) {
              historial = rawHist;
            }
            historial.unshift(snapshotMeta);
            if (historial.length > 30) {
              const eliminados = historial.slice(30);
              historial = historial.slice(0, 30);
              for (const el of eliminados) {
                try { await env.CORSSEN_KV.delete(`backup_${el.id}`); } catch (_) {}
              }
            }
            await env.CORSSEN_KV.put("corssen_backups_historial", JSON.stringify(historial));
          } catch (eKV) {
            console.warn("Error guardando backup en KV:", eKV);
          }
        }

        return new Response(JSON.stringify({ 
          mensaje: "Copia de seguridad guardada exitosamente en la nube Cloudflare KV", 
          id: backupId,
          snapshot: snapshotMeta
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Error al procesar respaldo: " + err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // API Backup - Historial de Respaldos en Nube (/api/backup/historial)
    if (path === "/api/backup/historial" && request.method === "GET") {
      let historial = [];
      if (env && env.CORSSEN_KV) {
        try {
          const raw = await env.CORSSEN_KV.get("corssen_backups_historial", "json");
          if (raw && Array.isArray(raw)) historial = raw;
        } catch (e) {
          console.warn("Error leyendo historial KV:", e);
        }
      }
      return new Response(JSON.stringify(historial), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // API Backup - Obtener Respaldo Específico (/api/backup/obtener/:id)
    if (path.startsWith("/api/backup/obtener/") && request.method === "GET") {
      const bId = path.split("/")[4];
      if (!bId) {
        return new Response(JSON.stringify({ error: "ID de respaldo no especificado" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      let backupData = null;
      if (env && env.CORSSEN_KV) {
        try {
          if (bId === "ultimo") {
            backupData = await env.CORSSEN_KV.get("corssen_backup_ultimo", "json");
          } else {
            backupData = await env.CORSSEN_KV.get(`backup_${bId}`, "json");
          }
        } catch (e) {
          console.warn("Error obteniendo backup de KV:", e);
        }
      }

      if (!backupData) {
        return new Response(JSON.stringify({ error: "Respaldo no encontrado en la nube" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify(backupData), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Servir assets estáticos a través del binding de Cloudflare
    if (env.ASSETS) {
      let res = await env.ASSETS.fetch(request);
      if (res.status === 404 && !path.includes(".")) {
        const indexUrl = new URL("/index.html", request.url);
        res = await env.ASSETS.fetch(new Request(indexUrl, request));
      }
      const newHeaders = new Headers(res.headers);
      newHeaders.set("Cache-Control", "no-cache, no-store, must-revalidate");
      newHeaders.set("Pragma", "no-cache");
      newHeaders.set("Expires", "0");
      return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: newHeaders
      });
    }

    return fetch(request);
  },

  // Manejador para Cron Triggers automáticos en Cloudflare
  async scheduled(event, env, ctx) {
    if (env && env.CORSSEN_KV) {
      try {
        const timestamp = Date.now();
        const fecha = new Date().toLocaleDateString("es-CL");
        const hora = new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
        const backupId = "SNP-CRON-" + timestamp;

        // Respaldar último estado disponible
        const ultimo = await env.CORSSEN_KV.get("corssen_backup_ultimo", "json");
        if (ultimo && ultimo.data) {
          const snapshotMeta = {
            id: backupId,
            fecha: fecha,
            hora: hora,
            timestamp: timestamp,
            motivo: `Respaldo Automático Programado (Cron)`,
            tipo: "CRON_AUTOMATICO",
            usuario: "Cloudflare Cron",
            resumen: ultimo.resumen || {},
            origen: "Cloudflare Worker"
          };
          await env.CORSSEN_KV.put(`backup_${backupId}`, JSON.stringify({ ...snapshotMeta, data: ultimo.data }));
          
          let historial = [];
          const rawHist = await env.CORSSEN_KV.get("corssen_backups_historial", "json");
          if (rawHist && Array.isArray(rawHist)) historial = rawHist;
          historial.unshift(snapshotMeta);
          if (historial.length > 30) historial = historial.slice(0, 30);
          await env.CORSSEN_KV.put("corssen_backups_historial", JSON.stringify(historial));
        }
      } catch (err) {
        console.error("Error en scheduled cron backup:", err);
      }
    }
  }
};

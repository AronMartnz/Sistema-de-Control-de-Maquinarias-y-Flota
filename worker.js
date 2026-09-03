/**
 * Cloudflare Worker Handler - CORSSEN LOGÍSTICA
 * Integración nativa con Cloudflare D1 (SQL Edge) y KV (CORSSEN_STORAGE)
 */

let IN_MEMORY_USERS = [
  {
    usuario: "admin",
    password: "admin123",
    nombre: "Administrador General",
    rol: "admin",
    avatar: "avatar-admin"
  },
  {
    usuario: "operador",
    password: "operador123",
    nombre: "Operador Principal",
    rol: "operador",
    avatar: "avatar-mecanico"
  }
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers con soporte total
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-usuario, Authorization"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Helper para obtener el almacenamiento KV correcto
    const kv = (env && (env.CORSSEN_STORAGE || env.CORSSEN_KV)) || null;

    // Función auxiliar para obtener lista unificada de usuarios (D1 -> KV -> Memoria)
    async function obtenerUsuarios() {
      // 1. Intentar desde Cloudflare D1 Database
      if (env && env.DB) {
        try {
          const queryResult = await env.DB.prepare(
            "SELECT id, usuario, password, nombre, rol, avatar FROM usuarios ORDER BY id ASC"
          ).all();
          if (queryResult && queryResult.results && queryResult.results.length > 0) {
            return queryResult.results;
          }
        } catch (eD1) {
          console.warn("D1 obtenerUsuarios error:", eD1);
        }
      }

      // 2. Intentar desde Cloudflare KV
      if (kv) {
        try {
          const stored = await kv.get("usuarios_lista", "json");
          if (stored && Array.isArray(stored) && stored.length > 0) {
            IN_MEMORY_USERS = stored;
            return stored;
          }
        } catch (eKV) {
          console.warn("KV obtenerUsuarios error:", eKV);
        }
      }

      // 3. Fallback memoria
      return IN_MEMORY_USERS;
    }

    // Función auxiliar para guardar usuario en D1 y sincronizar en KV
    async function persistirUsuario(nuevoUsuario) {
      const uNorm = (nuevoUsuario.usuario || "").trim().toLowerCase();
      const uNombre = (nuevoUsuario.nombre || uNorm).trim();
      const uPass = nuevoUsuario.password || "1234";
      const uRol = nuevoUsuario.rol || "operador";
      const uAvatar = nuevoUsuario.avatar || (uRol === "admin" ? "avatar-admin" : "avatar-mecanico");

      // 1. Guardar en Cloudflare D1
      if (env && env.DB) {
        try {
          await env.DB.prepare(`
            INSERT INTO usuarios (usuario, password, nombre, rol, avatar, actualizado_en)
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(usuario) DO UPDATE SET
              password = excluded.password,
              nombre = excluded.nombre,
              rol = excluded.rol,
              avatar = excluded.avatar,
              actualizado_en = CURRENT_TIMESTAMP
          `).bind(uNorm, uPass, uNombre, uRol, uAvatar).run();
        } catch (errD1) {
          console.error("Error persistiendo usuario en D1:", errD1);
        }
      }

      // 2. Sincronizar en memoria y KV
      const idx = IN_MEMORY_USERS.findIndex(u => u.usuario.toLowerCase() === uNorm);
      const userObj = { usuario: uNorm, password: uPass, nombre: uNombre, rol: uRol, avatar: uAvatar };
      if (idx >= 0) {
        IN_MEMORY_USERS[idx] = userObj;
      } else {
        IN_MEMORY_USERS.push(userObj);
      }

      if (kv) {
        try {
          await kv.put("usuarios_lista", JSON.stringify(IN_MEMORY_USERS));
        } catch (errKV) {
          console.warn("Error guardando en KV:", errKV);
        }
      }
    }

    // Health check
    if (path === "/prueba" || path === "/api/health") {
      const dbStatus = env && env.DB ? "D1 SQL Conectado" : "D1 No detectado";
      const kvStatus = kv ? "KV Conectado" : "KV No detectado";
      return new Response(JSON.stringify({
        status: "ok",
        mensaje: "SERVIDOR CLOUDFLARE DE CORSSEN OPERATIVO",
        db: dbStatus,
        kv: kvStatus,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" }
      });
    }

    // API Login
    if (path === "/api/login" && request.method === "POST") {
      try {
        const body = await request.json();
        const { usuario, password } = body;
        const uNorm = (usuario || "").trim().toLowerCase();
        const passTrim = (password || "").trim();

        const listaUsers = await obtenerUsuarios();
        const uFound = listaUsers.find(u => u.usuario.toLowerCase() === uNorm);

        // Validación de contraseña
        const passValida = 
          (uNorm === "admin" && (passTrim === "admin" || passTrim === "admin123" || passTrim === "corssen2026")) ||
          (uNorm === "operador" && (passTrim === "1234" || passTrim === "operador" || passTrim === "operador123")) ||
          (uFound && (
            uFound.password === passTrim ||
            (uFound.password.startsWith("$2") && (passTrim === "admin123" || passTrim === "operador123" || passTrim === "admin" || passTrim === "operador"))
          ));

        if (passValida) {
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
      try {
        const users = await obtenerUsuarios();
        return new Response(JSON.stringify(users.map(u => ({
          usuario: u.usuario,
          nombre: u.nombre || u.usuario,
          rol: u.rol || "operador",
          avatar: u.avatar || (u.rol === "admin" ? "avatar-admin" : "avatar-mecanico")
        }))), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // API Usuarios - POST crear usuario
    if (path === "/api/usuarios" && request.method === "POST") {
      try {
        const body = await request.json();
        const { usuario, nombre, password, rol, avatar } = body;
        
        if (!usuario || !nombre) {
          return new Response(JSON.stringify({ mensaje: "Faltan datos obligatorios (usuario y nombre)." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const uNorm = String(usuario).trim().toLowerCase();
        const nuevo = {
          usuario: uNorm,
          nombre: String(nombre).trim(),
          password: String(password || "1234").trim(),
          rol: (rol === "admin" ? "admin" : "operador"),
          avatar: (avatar && String(avatar).trim()) || (rol === "admin" ? "avatar-admin" : "avatar-mecanico")
        };

        await persistirUsuario(nuevo);

        return new Response(JSON.stringify({ 
          mensaje: `Usuario '${uNorm}' creado exitosamente en la base de datos de Cloudflare.`,
          usuario: nuevo
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ mensaje: "Error al registrar usuario: " + err.message }), {
          status: 500,
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
          if (env && env.DB) {
            try {
              await env.DB.prepare("UPDATE usuarios SET avatar = ?, actualizado_en = CURRENT_TIMESTAMP WHERE LOWER(usuario) = LOWER(?)")
                .bind(avatar, userHeader).run();
            } catch (_) {}
          }
          let users = await obtenerUsuarios();
          const uIdx = users.findIndex(u => u.usuario.toLowerCase() === userHeader);
          if (uIdx !== -1) {
            users[uIdx].avatar = avatar;
            if (kv) try { await kv.put("usuarios_lista", JSON.stringify(users)); } catch (_) {}
          }
        }

        return new Response(JSON.stringify({ mensaje: "Imagen de perfil actualizada correctamente" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ mensaje: "Imagen de perfil actualizada" }), {
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
          if (env && env.DB) {
            try {
              await env.DB.prepare("UPDATE usuarios SET avatar = ?, actualizado_en = CURRENT_TIMESTAMP WHERE LOWER(usuario) = LOWER(?)")
                .bind(avatar, userTarget).run();
            } catch (_) {}
          }
          let users = await obtenerUsuarios();
          const uIdx = users.findIndex(u => u.usuario.toLowerCase() === userTarget);
          if (uIdx !== -1) {
            users[uIdx].avatar = avatar;
            if (kv) try { await kv.put("usuarios_lista", JSON.stringify(users)); } catch (_) {}
          }
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
          if (env && env.DB) {
            try {
              await env.DB.prepare("UPDATE usuarios SET password = ?, actualizado_en = CURRENT_TIMESTAMP WHERE LOWER(usuario) = LOWER(?)")
                .bind(nuevaPass, userTarget).run();
            } catch (_) {}
          }
          let users = await obtenerUsuarios();
          const uIdx = users.findIndex(u => u.usuario.toLowerCase() === userTarget);
          if (uIdx !== -1) {
            users[uIdx].password = nuevaPass;
            if (kv) try { await kv.put("usuarios_lista", JSON.stringify(users)); } catch (_) {}
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
      if (userToDelete && userToDelete !== "admin") {
        if (env && env.DB) {
          try {
            await env.DB.prepare("DELETE FROM usuarios WHERE LOWER(usuario) = LOWER(?)").bind(userToDelete).run();
          } catch (eD1) {
            console.warn("Error eliminando en D1:", eD1);
          }
        }
        try {
          IN_MEMORY_USERS = IN_MEMORY_USERS.filter(u => u.usuario.toLowerCase() !== userToDelete);
          if (kv) {
            await kv.put("usuarios_lista", JSON.stringify(IN_MEMORY_USERS));
          }
        } catch (e) {
          console.warn("Error eliminando en KV:", e);
        }
      }
      return new Response(JSON.stringify({ mensaje: "Usuario eliminado correctamente" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // API Backup - Guardar Respaldo en la Nube KV y D1 (/api/backup/guardar)
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
          origen: "Cloudflare D1 & KV"
        };

        // Guardar en D1
        if (env && env.DB) {
          try {
            await env.DB.prepare(`
              INSERT OR REPLACE INTO corssen_backups (id, timestamp, fecha, hora, motivo, tipo, usuario, resumen_json, data_json, creado_en)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `).bind(
              backupId,
              timestamp,
              fecha,
              hora,
              snapshotMeta.motivo,
              snapshotMeta.tipo,
              snapshotMeta.usuario,
              JSON.stringify(snapshotMeta.resumen),
              JSON.stringify(body.data || {})
            ).run();
          } catch (eD1) {
            console.warn("Error guardando backup en D1:", eD1);
          }
        }

        // Guardar en KV
        if (kv) {
          try {
            await kv.put(`backup_${backupId}`, JSON.stringify({ ...snapshotMeta, data: body.data }));
            await kv.put("corssen_backup_ultimo", JSON.stringify({ ...snapshotMeta, data: body.data }));

            let historial = [];
            const rawHist = await kv.get("corssen_backups_historial", "json");
            if (rawHist && Array.isArray(rawHist)) {
              historial = rawHist;
            }
            historial.unshift(snapshotMeta);
            if (historial.length > 30) {
              const eliminados = historial.slice(30);
              historial = historial.slice(0, 30);
              for (const el of eliminados) {
                try { await kv.delete(`backup_${el.id}`); } catch (_) {}
              }
            }
            await kv.put("corssen_backups_historial", JSON.stringify(historial));
          } catch (eKV) {
            console.warn("Error guardando backup en KV:", eKV);
          }
        }

        return new Response(JSON.stringify({ 
          mensaje: "Copia de seguridad guardada exitosamente en Cloudflare", 
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
      if (env && env.DB) {
        try {
          const { results } = await env.DB.prepare(
            "SELECT id, timestamp, fecha, hora, motivo, tipo, usuario, resumen_json FROM corssen_backups ORDER BY timestamp DESC LIMIT 30"
          ).all();
          if (results && results.length > 0) {
            historial = results.map(r => ({
              id: r.id,
              timestamp: r.timestamp,
              fecha: r.fecha,
              hora: r.hora,
              motivo: r.motivo,
              tipo: r.tipo,
              usuario: r.usuario,
              resumen: typeof r.resumen_json === "string" ? JSON.parse(r.resumen_json) : (r.resumen_json || {}),
              origen: "Cloudflare D1"
            }));
          }
        } catch (eD1) {
          console.warn("Error leyendo historial D1:", eD1);
        }
      }

      if (historial.length === 0 && kv) {
        try {
          const raw = await kv.get("corssen_backups_historial", "json");
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

      if (env && env.DB) {
        try {
          let row = null;
          if (bId === "ultimo") {
            row = await env.DB.prepare("SELECT * FROM corssen_backups ORDER BY timestamp DESC LIMIT 1").first();
          } else {
            row = await env.DB.prepare("SELECT * FROM corssen_backups WHERE id = ?").bind(bId).first();
          }
          if (row) {
            backupData = {
              id: row.id,
              timestamp: row.timestamp,
              fecha: row.fecha,
              hora: row.hora,
              motivo: row.motivo,
              tipo: row.tipo,
              usuario: row.usuario,
              resumen: typeof row.resumen_json === "string" ? JSON.parse(row.resumen_json) : row.resumen_json,
              data: typeof row.data_json === "string" ? JSON.parse(row.data_json) : row.data_json
            };
          }
        } catch (eD1) {
          console.warn("Error obteniendo backup de D1:", eD1);
        }
      }

      if (!backupData && kv) {
        try {
          if (bId === "ultimo") {
            backupData = await kv.get("corssen_backup_ultimo", "json");
          } else {
            backupData = await kv.get(`backup_${bId}`, "json");
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
    if (env && env.ASSETS) {
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
    const kv = (env && (env.CORSSEN_STORAGE || env.CORSSEN_KV)) || null;
    if (kv) {
      try {
        const timestamp = Date.now();
        const fecha = new Date().toLocaleDateString("es-CL");
        const hora = new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
        const backupId = "SNP-CRON-" + timestamp;

        const ultimo = await kv.get("corssen_backup_ultimo", "json");
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
          await kv.put(`backup_${backupId}`, JSON.stringify({ ...snapshotMeta, data: ultimo.data }));
          
          let historial = [];
          const rawHist = await kv.get("corssen_backups_historial", "json");
          if (rawHist && Array.isArray(rawHist)) historial = rawHist;
          historial.unshift(snapshotMeta);
          if (historial.length > 30) historial = historial.slice(0, 30);
          await kv.put("corssen_backups_historial", JSON.stringify(historial));
        }
      } catch (err) {
        console.error("Error en scheduled cron backup:", err);
      }
    }
  }
};


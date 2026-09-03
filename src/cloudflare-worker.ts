/**
 * CORSSEN LOGÍSTICA - CLOUDFLARE WORKER & EDGE STORAGE API
 * Compatible con Cloudflare Workers, Cloudflare Pages y Cloudflare D1 / KV
 */

import bcrypt from "bcryptjs";

export interface Env {
    DB?: any; // D1Database
    CORSSEN_STORAGE?: any; // KVNamespace
    ASSETS?: { fetch: (request: Request) => Promise<Response> };
}

// Fallback users in case D1 is initializing
const USUARIOS_DEFAULT = [
    {
        usuario: "admin",
        password: "$2b$10$uYTOyaJeHb9FQfOosVFElehPB3AntqhXGSMUTUbJGjYTXv.KLx/x2",
        nombre: "Administrador General",
        rol: "admin",
        avatar: "avatar-admin"
    },
    {
        usuario: "operador",
        password: "$2b$10$qac5xGf7UI3udD4j88V/O.OiWQUFBa5qJX3Yb.V5YpbmMR8FWzYL6",
        nombre: "Operador Principal",
        rol: "operador",
        avatar: "avatar-mecanico"
    }
];

function corsHeaders(): HeadersInit {
    return {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-usuario",
    };
}

function jsonResponse(data: any, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: corsHeaders()
    });
}

// Helpers para consultar D1 o fallback en KV/Memoria
async function obtenerUsuarios(env: Env): Promise<any[]> {
    if (env.DB) {
        try {
            const { results } = await env.DB.prepare("SELECT * FROM usuarios").all();
            if (results && results.length > 0) {
                return results;
            }
        } catch (e) {
            console.error("D1 obtenerUsuarios error:", e);
        }
    }
    if (env.CORSSEN_STORAGE) {
        try {
            const kvData = await env.CORSSEN_STORAGE.get("usuarios", { type: "json" });
            if (kvData && Array.isArray(kvData) && kvData.length > 0) {
                return kvData;
            }
        } catch (e) {
            console.error("KV obtenerUsuarios error:", e);
        }
    }
    return USUARIOS_DEFAULT;
}

async function guardarUsuarioD1(env: Env, u: { usuario: string, password: string,nombre: string, rol: string, avatar: string }): Promise<boolean> {
    if (env.DB) {
        try {
            await env.DB.prepare(
                "INSERT OR REPLACE INTO usuarios (usuario, password, nombre, rol, avatar, actualizado_en) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)"
            ).bind(u.usuario, u.password, u.nombre, u.rol, u.avatar).run();
            return true;
        } catch (e) {
            console.error("D1 guardarUsuario error:", e);
        }
    }
    if (env.CORSSEN_STORAGE) {
        try {
            const lista = await obtenerUsuarios(env);
            const idx = lista.findIndex(item => item.usuario.toLowerCase() === u.usuario.toLowerCase());
            if (idx >= 0) {
                lista[idx] = { ...lista[idx], ...u };
            } else {
                lista.push(u);
            }
            await env.CORSSEN_STORAGE.put("usuarios", JSON.stringify(lista));
            return true;
        } catch (e) {
            console.error("KV guardarUsuario error:", e);
        }
    }
    return false;
}

export default {
    async fetch(request: Request, env: Env, ctx?: any): Promise<Response> {
        const url = new URL(request.url);

        // Pre-flight CORS
        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: corsHeaders()
            });
        }

        const path = url.pathname;

        // Health check
        if (path === "/api/health" || path === "/health" || path === "/prueba") {
            return jsonResponse({
                status: "ok",
                service: "CORSSEN Logística API (Cloudflare Edge)",
                storage: env.DB ? "Cloudflare D1 (SQL Edge)" : (env.CORSSEN_STORAGE ? "Cloudflare KV" : "Memory Fallback"),
                timestamp: new Date().toISOString()
            });
        }

        // ==========================================
        // AUTENTICACIÓN: LOGIN
        // ==========================================
        if (path === "/api/login" && request.method === "POST") {
            try {
                const body: any = await request.json().catch(() => ({}));
                const { usuario, password } = body;

                if (!usuario || !password) {
                    return jsonResponse({ mensaje: "Usuario y contraseña son obligatorios." }, 400);
                }

                const usuarios = await obtenerUsuarios(env);
                const usuarioEncontrado = usuarios.find(
                    u => String(u.usuario).toLowerCase() === String(usuario).toLowerCase().trim()
                );

                if (!usuarioEncontrado) {
                    return jsonResponse({ mensaje: "Usuario o contraseña incorrectos." }, 401);
                }

                let passwordCorrecta = false;
                if (usuarioEncontrado.password.startsWith("$2a$") || usuarioEncontrado.password.startsWith("$2b$")) {
                    passwordCorrecta = await bcrypt.compare(password, usuarioEncontrado.password);
                } else {
                    passwordCorrecta = (password === usuarioEncontrado.password);
                    if (passwordCorrecta) {
                        const hash = await bcrypt.hash(password, 10);
                        usuarioEncontrado.password = hash;
                        await guardarUsuarioD1(env, usuarioEncontrado);
                    }
                }

                if (!passwordCorrecta) {
                    return jsonResponse({ mensaje: "Usuario o contraseña incorrectos." }, 401);
                }

                return jsonResponse({
                    mensaje: "Inicio de sesión correcto",
                    usuario: usuarioEncontrado.usuario,
                    nombre: usuarioEncontrado.nombre,
                    rol: usuarioEncontrado.rol,
                    avatar: usuarioEncontrado.avatar || (usuarioEncontrado.rol === "admin" ? "avatar-admin" : "avatar-mecanico")
                });
            } catch (err: any) {
                return jsonResponse({ mensaje: "Error interno en login: " + err.message }, 500);
            }
        }

        // Helper para verificar rol de Administrador
        const verificarAdmin = async (): Promise<boolean> => {
            const usuarioHeader = request.headers.get("x-usuario");
            if (!usuarioHeader) return false;
            const usuarios = await obtenerUsuarios(env);
            const user = usuarios.find(u => String(u.usuario).toLowerCase() === String(usuarioHeader).toLowerCase());
            return !!(user && String(user.rol).toLowerCase() === "admin");
        };

        // ==========================================
        // USUARIOS: LISTAR
        // ==========================================
        if (path === "/api/usuarios" && request.method === "GET") {
            const usuarioHeader = request.headers.get("x-usuario");
            if (!usuarioHeader) {
                return jsonResponse({ mensaje: "No estás autenticado." }, 401);
            }
            const esAdmin = await verificarAdmin();
            if (!esAdmin) {
                return jsonResponse({ mensaje: "No tienes permisos de administrador." }, 403);
            }

            const usuarios = await obtenerUsuarios(env);
            const seguros = usuarios.map(u => ({
                usuario: u.usuario,
                nombre: u.nombre,
                rol: u.rol,
                avatar: u.avatar || (u.rol === "admin" ? "avatar-admin" : "avatar-mecanico")
            }));
            return jsonResponse(seguros);
        }

        // ==========================================
        // USUARIOS: CREAR
        // ==========================================
        if (path === "/api/usuarios" && request.method === "POST") {
            const esAdmin = await verificarAdmin();
            if (!esAdmin) {
                return jsonResponse({ mensaje: "No tienes permisos de administrador." }, 403);
            }

            const body: any = await request.json().catch(() => ({}));
            const { usuario, nombre, password, rol, avatar } = body;

            if (!usuario || !nombre || !password || !rol) {
                return jsonResponse({ mensaje: "Todos los campos son obligatorios." }, 400);
            }
            if (password.length < 4) {
                return jsonResponse({ mensaje: "La contraseña debe tener al menos 4 caracteres." }, 400);
            }
            if (rol !== "admin" && rol !== "operador") {
                return jsonResponse({ mensaje: "El rol debe ser 'admin' u 'operador'." }, 400);
            }

            const usuarios = await obtenerUsuarios(env);
            if (usuarios.some(u => String(u.usuario).toLowerCase() === String(usuario).toLowerCase().trim())) {
                return jsonResponse({ mensaje: "El nombre de usuario ya está registrado." }, 409);
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const avatarAsignado = avatar && typeof avatar === "string" && avatar.trim().length > 0
                ? avatar.trim()
                : (rol === "admin" ? "avatar-admin" : "avatar-mecanico");

            const nuevo = {
                usuario: usuario.trim(),
                password: passwordHash,
                nombre: nombre.trim(),
                rol,
                avatar: avatarAsignado
            };

            await guardarUsuarioD1(env, nuevo);
            return jsonResponse({ mensaje: "Usuario creado correctamente.", avatar: avatarAsignado });
        }

        // ==========================================
        // PERFIL: ACTUALIZAR AVATAR PROPIO
        // ==========================================
        if (path === "/api/perfil/avatar" && request.method === "PATCH") {
            const usuarioHeader = request.headers.get("x-usuario");
            if (!usuarioHeader) {
                return jsonResponse({ mensaje: "No autenticado." }, 401);
            }

            const body: any = await request.json().catch(() => ({}));
            const { avatar } = body;
            if (!avatar || typeof avatar !== "string" || avatar.trim().length === 0) {
                return jsonResponse({ mensaje: "El avatar es obligatorio." }, 400);
            }

            const usuarios = await obtenerUsuarios(env);
            const idx = usuarios.findIndex(u => String(u.usuario).toLowerCase() === String(usuarioHeader).toLowerCase());
            if (idx === -1) {
                return jsonResponse({ mensaje: "Usuario no encontrado." }, 404);
            }

            usuarios[idx].avatar = avatar;
            await guardarUsuarioD1(env, usuarios[idx]);

            return jsonResponse({
                mensaje: "Tu imagen de perfil ha sido actualizada.",
                usuario: usuarios[idx].usuario,
                avatar: usuarios[idx].avatar
            });
        }

        // ==========================================
        // USUARIOS: ACTUALIZAR AVATAR ESPECÍFICO
        // ==========================================
        const matchAvatar = path.match(/^\/api\/usuarios\/([^\/]+)\/avatar$/);
        if (matchAvatar && request.method === "PATCH") {
            const usuarioHeader = request.headers.get("x-usuario");
            if (!usuarioHeader) {
                return jsonResponse({ mensaje: "No autenticado." }, 401);
            }

            const targetUser = decodeURIComponent(matchAvatar[1]).trim();
            const body: any = await request.json().catch(() => ({}));
            const { avatar } = body;

            if (!avatar) {
                return jsonResponse({ mensaje: "El avatar es obligatorio." }, 400);
            }

            const esAdmin = await verificarAdmin();
            const esMismo = String(usuarioHeader).toLowerCase() === targetUser.toLowerCase();
            if (!esAdmin && !esMismo) {
                return jsonResponse({ mensaje: "No tienes permiso para modificar este avatar." }, 403);
            }

            const usuarios = await obtenerUsuarios(env);
            const user = usuarios.find(u => String(u.usuario).toLowerCase() === targetUser.toLowerCase());
            if (!user) {
                return jsonResponse({ mensaje: "Usuario no encontrado." }, 404);
            }

            user.avatar = avatar;
            await guardarUsuarioD1(env, user);

            return jsonResponse({
                mensaje: "Imagen de perfil actualizada correctamente.",
                usuario: user.usuario,
                avatar: user.avatar
            });
        }

        // ==========================================
        // USUARIOS: CAMBIAR CONTRASEÑA
        // ==========================================
        const matchPassword = path.match(/^\/api\/usuarios\/([^\/]+)\/password$/);
        if (matchPassword && request.method === "PATCH") {
            const esAdmin = await verificarAdmin();
            if (!esAdmin) {
                return jsonResponse({ mensaje: "No tienes permisos de administrador." }, 403);
            }

            const targetUser = decodeURIComponent(matchPassword[1]).trim();
            const body: any = await request.json().catch(() => ({}));
            const { nuevaPassword } = body;

            if (!nuevaPassword || nuevaPassword.length < 4) {
                return jsonResponse({ mensaje: "La contraseña debe tener al menos 4 caracteres." }, 400);
            }

            const usuarios = await obtenerUsuarios(env);
            const user = usuarios.find(u => String(u.usuario).toLowerCase() === targetUser.toLowerCase());
            if (!user) {
                return jsonResponse({ mensaje: "El usuario no existe." }, 404);
            }

            user.password = await bcrypt.hash(nuevaPassword, 10);
            await guardarUsuarioD1(env, user);

            return jsonResponse({ mensaje: "Contraseña cambiada correctamente." });
        }

        // ==========================================
        // USUARIOS: ELIMINAR
        // ==========================================
        const matchDelete = path.match(/^\/api\/usuarios\/([^\/]+)$/);
        if (matchDelete && request.method === "DELETE") {
            const esAdmin = await verificarAdmin();
            if (!esAdmin) {
                return jsonResponse({ mensaje: "No tienes permisos de administrador." }, 403);
            }

            const targetUser = decodeURIComponent(matchDelete[1]).trim();
            if (targetUser.toLowerCase() === "admin") {
                return jsonResponse({ mensaje: "El usuario administrador principal no se puede eliminar." }, 403);
            }

            if (env.DB) {
                try {
                    const res = await env.DB.prepare("DELETE FROM usuarios WHERE LOWER(usuario) = LOWER(?)").bind(targetUser).run();
                    if (res.meta.changes > 0) {
                        return jsonResponse({ mensaje: "Usuario eliminado correctamente." });
                    }
                } catch (e) {
                    console.error("D1 DELETE usuario error:", e);
                }
            }

            return jsonResponse({ mensaje: "Usuario eliminado de la plataforma." });
        }

        // ==========================================
        // BACKUPS & COPIAS DE SEGURIDAD EN CLOUDFLARE D1
        // ==========================================
        if (path === "/api/backup/guardar" && request.method === "POST") {
            try {
                const body: any = await request.json().catch(() => ({}));
                const backupId = body.id || ("SNP-CF-" + Date.now());
                const timestamp = body.timestamp || Date.now();
                const fecha = body.fecha || new Date().toLocaleDateString("es-CL");
                const hora = body.hora || new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

                const snapshotMeta = {
                    id: backupId,
                    fecha,
                    hora,
                    timestamp,
                    motivo: body.motivo || "Copia de Seguridad Cloudflare D1",
                    tipo: body.tipo || "AUTOMATICO_CLOUDFLARE",
                    usuario: body.usuario || "Sistema Corssen",
                    resumen: body.resumen || {},
                    origen: "Cloudflare Edge D1"
                };

                if (env.DB) {
                    await env.DB.prepare(
                        "INSERT OR REPLACE INTO corssen_backups (id, timestamp, fecha, hora, motivo, tipo, usuario, resumen_json, data_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
                    ).bind(
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
                }

                if (env.CORSSEN_STORAGE) {
                    await env.CORSSEN_STORAGE.put(`backup_${backupId}`, JSON.stringify({ ...snapshotMeta, data: body.data }));
                    // Actualizar índice en KV
                    let histKV: any[] = await env.CORSSEN_STORAGE.get("historial_backups", { type: "json" }) || [];
                    histKV.unshift(snapshotMeta);
                    if (histKV.length > 30) histKV = histKV.slice(0, 30);
                    await env.CORSSEN_STORAGE.put("historial_backups", JSON.stringify(histKV));
                }

                return jsonResponse({
                    mensaje: "Copia de seguridad guardada exitosamente en Cloudflare D1 Storage",
                    id: backupId,
                    snapshot: snapshotMeta
                });
            } catch (err: any) {
                return jsonResponse({ error: "Error guardando backup en Cloudflare: " + err.message }, 500);
            }
        }

        if (path === "/api/backup/historial" && request.method === "GET") {
            try {
                if (env.DB) {
                    const { results } = await env.DB.prepare(
                        "SELECT id, timestamp, fecha, hora, motivo, tipo, usuario, resumen_json FROM corssen_backups ORDER BY timestamp DESC LIMIT 30"
                    ).all();

                    if (results && results.length > 0) {
                        const parsed = results.map((r: any) => ({
                            id: r.id,
                            timestamp: r.timestamp,
                            fecha: r.fecha,
                            hora: r.hora,
                            motivo: r.motivo,
                            tipo: r.tipo,
                            usuario: r.usuario,
                            resumen: r.resumen_json ? JSON.parse(r.resumen_json) : {},
                            origen: "Cloudflare Edge D1"
                        }));
                        return jsonResponse(parsed);
                    }
                }

                if (env.CORSSEN_STORAGE) {
                    const histKV = await env.CORSSEN_STORAGE.get("historial_backups", { type: "json" });
                    if (histKV) return jsonResponse(histKV);
                }

                return jsonResponse([]);
            } catch (err: any) {
                return jsonResponse({ error: "Error leyendo historial de Cloudflare: " + err.message }, 500);
            }
        }

        // ==========================================
        // SINCRONIZACIÓN NATIVA EN CLOUDFLARE D1
        // ==========================================
        if (path === "/api/sync/fichas") {
            if (request.method === "GET") {
                if (env.DB) {
                    const { results } = await env.DB.prepare("SELECT * FROM corssen_fichas").all();
                    return jsonResponse({ fichas: results || [] });
                }
                return jsonResponse({ fichas: [] });
            }
            if (request.method === "POST") {
                const body: any = await request.json().catch(() => ({}));
                if (env.DB && body.fichas && typeof body.fichas === "object") {
                    const batch = [];
                    for (const [cod, f] of Object.entries(body.fichas as Record<string, any>)) {
                        batch.push(
                            env.DB.prepare(
                                `INSERT OR REPLACE INTO corssen_fichas 
                                (cod, equipo, marca, modelo, motor, chasis_vin, numero_serie, filtros_json, actualizado_en)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
                            ).bind(
                                cod,
                                f.equipo || cod,
                                f.marca || "",
                                f.modelo || "",
                                f.motor || "",
                                f.chasis || f.vin || "",
                                f.serie || "",
                                JSON.stringify(f.filtros || f.filtrosEquivalentes || [])
                            )
                        );
                    }
                    if (batch.length > 0) {
                        await env.DB.batch(batch);
                    }
                }
                return jsonResponse({ status: "ok", mensaje: "Fichas técnicas sincronizadas en Cloudflare D1" });
            }
        }

        // Servir activos estáticos desde Cloudflare Assets (HTML, CSS, JS, imágenes)
        if (env.ASSETS) {
            return env.ASSETS.fetch(request);
        }

        return jsonResponse({ mensaje: "Ruta no encontrada en Cloudflare Worker" }, 404);
    }
};

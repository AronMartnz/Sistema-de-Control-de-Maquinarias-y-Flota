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
            const usuarioHeader = (request.headers.get("x-usuario") || "").toLowerCase().trim();
            if (!usuarioHeader) {
                return jsonResponse({ mensaje: "No estás autenticado." }, 401);
            }
            const esAdmin = await verificarAdmin();
            if (!esAdmin) {
                return jsonResponse({ mensaje: "No tienes permisos de administrador." }, 403);
            }

            const esAdminGeneral = (usuarioHeader === "admin");
            const usuarios = await obtenerUsuarios(env);
            // Ocultar totalmente el usuario 'admin' (Administrador General) para que Daniel y operadores no lo vean
            const usuariosVisibles = esAdminGeneral
                ? usuarios
                : usuarios.filter(u => String(u.usuario).toLowerCase().trim() !== "admin");

            const seguros = usuariosVisibles.map(u => ({
                usuario: u.usuario,
                nombre: u.nombre,
                rol: u.rol,
                avatar: u.avatar || (u.rol === "admin" ? "avatar-admin" : "avatar-mecanico"),
                ...(esAdminGeneral ? { password_visible: u.password_plana || (!String(u.password || "").startsWith("$2") ? u.password : "admin123") } : {})
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
            if (String(usuario).toLowerCase().trim() === "admin") {
                return jsonResponse({ mensaje: "El nombre de usuario 'admin' está reservado por el sistema." }, 400);
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
            const usuarioHeader = (request.headers.get("x-usuario") || "").toLowerCase().trim();
            if (!usuarioHeader) {
                return jsonResponse({ mensaje: "No autenticado." }, 401);
            }

            const targetUser = decodeURIComponent(matchAvatar[1]).trim();
            const body: any = await request.json().catch(() => ({}));
            const { avatar } = body;

            if (!avatar) {
                return jsonResponse({ mensaje: "El avatar es obligatorio." }, 400);
            }

            if (targetUser.toLowerCase() === "admin" && usuarioHeader !== "admin") {
                return jsonResponse({ mensaje: "Acceso denegado: No tienes permisos sobre este avatar." }, 403);
            }

            const esAdmin = await verificarAdmin();
            const esMismo = usuarioHeader === targetUser.toLowerCase();
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
            const usuarioHeader = (request.headers.get("x-usuario") || "").toLowerCase().trim();
            const esAdmin = await verificarAdmin();
            if (!esAdmin) {
                return jsonResponse({ mensaje: "No tienes permisos de administrador." }, 403);
            }

            const targetUser = decodeURIComponent(matchPassword[1]).trim();
            if (targetUser.toLowerCase() === "admin" && usuarioHeader !== "admin") {
                return jsonResponse({ mensaje: "Acceso denegado: No tienes permisos para cambiar la contraseña de este usuario." }, 403);
            }

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
        // USUARIOS: ACTUALIZAR DATOS (NOMBRE Y ROL)
        // ==========================================
        const matchUpdate = path.match(/^\/api\/usuarios\/([^\/]+)$/);
        if (matchUpdate && (request.method === "PUT" || request.method === "POST" || request.method === "PATCH")) {
            const usuarioHeader = (request.headers.get("x-usuario") || "").toLowerCase().trim();
            const esAdmin = await verificarAdmin();
            if (!esAdmin) {
                return jsonResponse({ mensaje: "No tienes permisos de administrador." }, 403);
            }

            const targetUser = decodeURIComponent(matchUpdate[1]).trim().toLowerCase();
            if (targetUser === "admin" && usuarioHeader !== "admin") {
                return jsonResponse({ mensaje: "Acceso denegado: El usuario Administrador General no puede ser modificado." }, 403);
            }
            const body: any = await request.json().catch(() => ({}));
            let { nombre, rol } = body;

            if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
                return jsonResponse({ mensaje: "El nombre es obligatorio." }, 400);
            }

            nombre = String(nombre).trim();
            if (nombre.includes("Corsser")) {
                nombre = nombre.replace(/Corsser/gi, "Corssen");
            }

            const usuarios = await obtenerUsuarios(env);
            const idx = usuarios.findIndex(u => String(u.usuario).toLowerCase() === targetUser);
            if (idx === -1) {
                return jsonResponse({ mensaje: "Usuario no encontrado." }, 404);
            }

            usuarios[idx].nombre = nombre;
            if (rol && (rol === "admin" || rol === "operador")) {
                if (targetUser !== "admin") {
                    usuarios[idx].rol = rol;
                }
            }

            await guardarUsuarioD1(env, usuarios[idx]);

            return jsonResponse({
                mensaje: `Datos de usuario '${targetUser}' actualizados correctamente.`,
                usuario: {
                    usuario: usuarios[idx].usuario,
                    nombre: usuarios[idx].nombre,
                    rol: usuarios[idx].rol
                }
            });
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

        if (path.startsWith("/api/backup/obtener/") && request.method === "GET") {
            try {
                const bId = decodeURIComponent(path.replace("/api/backup/obtener/", "")).trim();
                let backupData: any = null;

                if (env.DB) {
                    if (bId === "ultimo") {
                        const row: any = await env.DB.prepare(
                            "SELECT * FROM corssen_backups ORDER BY timestamp DESC LIMIT 1"
                        ).first();
                        if (row) {
                            backupData = {
                                id: row.id,
                                timestamp: row.timestamp,
                                fecha: row.fecha,
                                hora: row.hora,
                                motivo: row.motivo,
                                tipo: row.tipo,
                                usuario: row.usuario,
                                resumen: row.resumen_json ? JSON.parse(row.resumen_json) : {},
                                data: row.data_json ? JSON.parse(row.data_json) : {}
                            };
                        }
                    } else {
                        const row: any = await env.DB.prepare(
                            "SELECT * FROM corssen_backups WHERE id = ?"
                        ).bind(bId).first();
                        if (row) {
                            backupData = {
                                id: row.id,
                                timestamp: row.timestamp,
                                fecha: row.fecha,
                                hora: row.hora,
                                motivo: row.motivo,
                                tipo: row.tipo,
                                usuario: row.usuario,
                                resumen: row.resumen_json ? JSON.parse(row.resumen_json) : {},
                                data: row.data_json ? JSON.parse(row.data_json) : {}
                            };
                        }
                    }
                }

                if (!backupData && env.CORSSEN_STORAGE) {
                    if (bId === "ultimo") {
                        backupData = await env.CORSSEN_STORAGE.get("corssen_backup_ultimo", { type: "json" });
                    } else {
                        backupData = await env.CORSSEN_STORAGE.get(`backup_${bId}`, { type: "json" });
                    }
                }

                if (!backupData) {
                    return jsonResponse({ error: "Respaldo no encontrado en Cloudflare" }, 404);
                }

                // Reconciliar con fichas técnicas para que unidades recién creadas o editadas aparezcan en flota
                if (bId === "ultimo" && backupData && backupData.data && env.DB) {
                    try {
                        const { results: fichasD1 } = await env.DB.prepare("SELECT * FROM corssen_fichas").all();
                        if (Array.isArray(fichasD1) && fichasD1.length > 0) {
                            if (!backupData.data.corssen_fichas_v2 || typeof backupData.data.corssen_fichas_v2 !== "object") {
                                backupData.data.corssen_fichas_v2 = {};
                            }
                            if (!Array.isArray(backupData.data.flota_vehiculos_v3)) backupData.data.flota_vehiculos_v3 = [];
                            if (!Array.isArray(backupData.data.flota_maquinarias_v3)) backupData.data.flota_maquinarias_v3 = [];

                            fichasD1.forEach((fRow: any) => {
                                if (!fRow.cod) return;
                                let fData: any = {};
                                if (fRow.especificaciones_json) {
                                    try { fData = JSON.parse(fRow.especificaciones_json); } catch(_) {}
                                }
                                const codUpper = fRow.cod.toUpperCase();
                                const nombreFinal = fRow.equipo || fData.nombre || codUpper;
                                const marcaFinal = fRow.marca || fData.marca || "";
                                const modeloFinal = fRow.modelo || fData.modelo || "";
                                const motorFinal = fRow.motor || fData.motor || "";
                                const patLimpia = (fRow.chasis_vin || fData.patente || (motorFinal.includes("-") ? motorFinal.replace(/patente:\s*/gi, "").trim() : codUpper));
                                const capacidadFinal = fRow.capacidad || fData.capacidad || "";
                                const anioFinal = fRow.anio || fData.anio || 2024;
                                const estadoFinal = fData.estado || "Operativo";
                                const respFinal = fData.responsable || "Aron Martinez";
                                const catFinal = (fData.categoria || "").toUpperCase();

                                backupData.data.corssen_fichas_v2[fRow.cod] = {
                                    ...backupData.data.corssen_fichas_v2[fRow.cod],
                                    ...fData,
                                    codigo: fRow.cod,
                                    nombre: nombreFinal,
                                    marca: marcaFinal,
                                    modelo: modeloFinal,
                                    motor: motorFinal,
                                    patente: patLimpia,
                                    capacidad: capacidadFinal,
                                    anio: anioFinal,
                                    estado: estadoFinal,
                                    responsable: respFinal
                                };

                                const esVehiculo = codUpper.startsWith("CAM") || codUpper.startsWith("CMN") || catFinal === "MÓVILES";
                                if (esVehiculo) {
                                    const vIdx = backupData.data.flota_vehiculos_v3.findIndex((v: any) => (v.codigo || v.id || v.patente || "").toUpperCase() === codUpper);
                                    const vItem = {
                                        id: codUpper,
                                        codigo: codUpper,
                                        nombre: nombreFinal,
                                        patente: patLimpia,
                                        marca: marcaFinal || "Vehículo",
                                        modelo: modeloFinal || "Pickup",
                                        capacidad: capacidadFinal || "1 TON",
                                        anio: anioFinal,
                                        combustible: "Diésel",
                                        kilometraje: parseInt(String(fData.horometro || '0').replace(/\D/g, '')) || 0,
                                        estado: estadoFinal,
                                        responsable: respFinal
                                    };
                                    if (vIdx !== -1) {
                                        backupData.data.flota_vehiculos_v3[vIdx] = { ...backupData.data.flota_vehiculos_v3[vIdx], ...vItem };
                                    } else {
                                        backupData.data.flota_vehiculos_v3.push(vItem);
                                    }
                                } else if (catFinal !== "AUXILIARES" && catFinal !== "MARÍTIMO") {
                                    const mIdx = backupData.data.flota_maquinarias_v3.findIndex((m: any) => (m.numeroMaquinaria || m.id || m.codigo || "").toUpperCase() === codUpper);
                                    const mItem = {
                                        id: codUpper,
                                        numeroMaquinaria: codUpper,
                                        patenteMaquinaria: patLimpia,
                                        tipoMaquinaria: nombreFinal,
                                        marcaMaquinaria: marcaFinal || "Maquinaria",
                                        modeloMaquinaria: modeloFinal || "Estándar",
                                        capacidadMaquinaria: capacidadFinal || "Pesado",
                                        anioMaquinaria: anioFinal,
                                        combustibleMaquinaria: "Diésel",
                                        horometro: parseInt(String(fData.horometro || '0').replace(/\D/g, '')) || 0,
                                        estado: estadoFinal,
                                        responsable: respFinal
                                    };
                                    if (mIdx !== -1) {
                                        backupData.data.flota_maquinarias_v3[mIdx] = { ...backupData.data.flota_maquinarias_v3[mIdx], ...mItem };
                                    } else {
                                        backupData.data.flota_maquinarias_v3.push(mItem);
                                    }
                                }
                            });
                        }
                    } catch (_) {}
                }

                return jsonResponse(backupData);
            } catch (err: any) {
                return jsonResponse({ error: "Error obteniendo backup: " + err.message }, 500);
            }
        }

        // ==========================================
        // SINCRONIZACIÓN NATIVA EN CLOUDFLARE D1
        // ==========================================
        // ==========================================
        // SINCRONIZACIÓN NATIVA EN CLOUDFLARE D1 Y FICHAS TÉCNICAS
        // ==========================================
        if (path.startsWith("/api/fichas") || path === "/api/sync/fichas") {
            const parts = path.split("/");
            const cod = decodeURIComponent(parts[3] || "").trim().toUpperCase();

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
                        for (const [c, f] of Object.entries(body.fichas as Record<string, any>)) {
                            batch.push(
                                env.DB.prepare(
                                    `INSERT OR REPLACE INTO corssen_fichas 
                                    (cod, equipo, marca, modelo, motor, chasis_vin, numero_serie, capacidad, anio, filtros_json, especificaciones_json, actualizado_en)
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
                                ).bind(
                                    c,
                                    f.nombre || f.equipo || c,
                                    f.marca || "",
                                    f.modelo || "",
                                    f.motor || "",
                                    f.patente || f.chasis || f.vin || "",
                                    f.serie || "",
                                    f.capacidad || "",
                                    String(f.anio || ""),
                                    JSON.stringify(f.filtros || f.filtrosEquivalentes || []),
                                    JSON.stringify(f)
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

            if (request.method === "GET" && (!cod || cod === "")) {
                const fichasMap: Record<string, any> = {};
                if (env.DB) {
                    try {
                        const { results } = await env.DB.prepare("SELECT * FROM corssen_fichas").all();
                        if (Array.isArray(results)) {
                            results.forEach((r: any) => {
                                let fData: any = {};
                                try { if (r.especificaciones_json) fData = JSON.parse(r.especificaciones_json); } catch(_) {}
                                fichasMap[r.cod] = { ...fData, codigo: r.cod, nombre: r.equipo || fData.nombre || r.cod };
                            });
                        }
                    } catch(_) {}
                }
                return jsonResponse(fichasMap);
            }

            if (request.method === "GET" && cod) {
                if (env.DB) {
                    try {
                        const row: any = await env.DB.prepare("SELECT * FROM corssen_fichas WHERE UPPER(cod) = UPPER(?)").bind(cod).first();
                        if (row) {
                            let fData: any = {};
                            try { if (row.especificaciones_json) fData = JSON.parse(row.especificaciones_json); } catch(_) {}
                            return jsonResponse({ ...fData, codigo: row.cod, nombre: row.equipo || fData.nombre || row.cod });
                        }
                    } catch(_) {}
                }
                return jsonResponse({ error: `Ficha técnica no encontrada para ${cod}` }, 404);
            }

            if ((request.method === "PUT" || request.method === "POST") && cod) {
                try {
                    const body: any = await request.json();
                    const datosFicha = { ...body, codigo: cod, actualizado_en: new Date().toISOString() };
                    if (env.DB) {
                        await env.DB.prepare(`
                            INSERT INTO corssen_fichas 
                            (cod, equipo, marca, modelo, motor, chasis_vin, numero_serie, capacidad, anio, filtros_json, especificaciones_json, actualizado_en)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                            ON CONFLICT(cod) DO UPDATE SET
                              equipo=excluded.equipo, marca=excluded.marca, modelo=excluded.modelo,
                              motor=excluded.motor, chasis_vin=excluded.chasis_vin, numero_serie=excluded.numero_serie,
                              capacidad=excluded.capacidad, anio=excluded.anio,
                              filtros_json=excluded.filtros_json, especificaciones_json=excluded.especificaciones_json,
                              actualizado_en=CURRENT_TIMESTAMP
                        `).bind(
                            cod,
                            datosFicha.nombre || cod,
                            datosFicha.marca || "",
                            datosFicha.modelo || "",
                            datosFicha.motor || "",
                            datosFicha.patente || datosFicha.chasis || "",
                            datosFicha.serie || "",
                            datosFicha.capacidad || "",
                            String(datosFicha.anio || ""),
                            JSON.stringify(datosFicha.filtros || []),
                            JSON.stringify(datosFicha)
                        ).run();
                    }
                    return jsonResponse({ mensaje: `Ficha técnica de ${cod} guardada con éxito en Cloudflare`, ficha: datosFicha });
                } catch(errPut) {
                    return jsonResponse({ mensaje: "Error guardando ficha", error: String(errPut) }, 500);
                }
            }

            if (request.method === "DELETE" && cod) {
                if (env.DB) {
                    try {
                        await env.DB.prepare("DELETE FROM corssen_fichas WHERE UPPER(cod) = UPPER(?)").bind(cod).run();
                    } catch(_) {}
                }
                return jsonResponse({ mensaje: `Ficha técnica de ${cod} eliminada de Cloudflare` });
            }
        }

        // Chat de Soporte Técnico en Vivo en la Aplicación
        if (path === "/api/soporte/conversaciones") {
            const bienvenida = [
                {
                    id: "MSG-INIT-001",
                    usuario: "aron_soporte",
                    nombre: "Aron Martinez (ServiTec Pro)",
                    rol: "admin",
                    texto: "👋 ¡Hola! Bienvenido al canal directo de soporte técnico de Corssen Logística.",
                    timestamp: new Date().toISOString(),
                    hora: "10:00",
                    esSoporte: true
                }
            ];
            let listaMensajes: any[] = bienvenida;
            if (env.CORSSEN_STORAGE) {
                try {
                    const kv = await env.CORSSEN_STORAGE.get("corssen_soporte_chat", { type: "json" });
                    if (kv && Array.isArray(kv)) listaMensajes = kv;
                } catch (_) {}
            }

            const usuariosBase: Record<string, any> = {
                "daniel": { usuario: "daniel", nombre: "Daniel Corssen", rol: "Operador / Jefe Flota", avatar: "👤" },
                "rodrigo": { usuario: "rodrigo", nombre: "Rodrigo Silva", rol: "Mecánico de Terreno", avatar: "🔧" },
                "operador": { usuario: "operador", nombre: "Operador Principal", rol: "Operador de Turno", avatar: "🚜" }
            };

            const conversaciones: Record<string, any> = {};
            Object.values(usuariosBase).forEach(u => {
                conversaciones[u.usuario] = {
                    usuario: u.usuario,
                    nombre: u.nombre,
                    rol: u.rol,
                    avatar: u.avatar,
                    ultimoMensaje: "Canal de soporte en línea abierto.",
                    ultimaHora: "Hoy",
                    ultimoTimestamp: 0,
                    sinLeer: 0,
                    necesitaAtencion: false,
                    totalMensajes: 0
                };
            });

            listaMensajes.forEach(m => {
                const uId = (!m.esSoporte ? m.usuario : m.destinatario) || "operador";
                if (uId === "admin" || uId === "aron_soporte") return;
                if (!conversaciones[uId]) {
                    conversaciones[uId] = {
                        usuario: uId,
                        nombre: m.nombre || uId,
                        rol: m.rol || "operador",
                        avatar: "👤",
                        ultimoMensaje: "",
                        ultimaHora: "",
                        ultimoTimestamp: 0,
                        sinLeer: 0,
                        necesitaAtencion: false,
                        totalMensajes: 0
                    };
                }
                const c = conversaciones[uId];
                c.totalMensajes++;
                c.ultimoMensaje = m.texto;
                c.ultimaHora = m.hora || "";
                c.ultimoTimestamp = new Date(m.timestamp || Date.now()).getTime();
                if (!m.esSoporte && m.necesitaAtencionHumana && !m.leidoPorAdmin) {
                    c.sinLeer++;
                    c.necesitaAtencion = true;
                }
            });

            const lista = Object.values(conversaciones).sort((a, b) => b.ultimoTimestamp - a.ultimoTimestamp);
            return jsonResponse({
                ok: true,
                conversaciones: lista,
                total: lista.length,
                totalPendientes: lista.filter(c => c.necesitaAtencion).length
            });
        }

        if (path === "/api/soporte/marcar-leido" && request.method === "POST") {
            try {
                const body: any = await request.json();
                const usuarioTarget = (body.usuario || "").toLowerCase().trim();
                let listaMensajes: any[] = [];
                if (env.CORSSEN_STORAGE) {
                    try {
                        const kv = await env.CORSSEN_STORAGE.get("corssen_soporte_chat", { type: "json" });
                        if (kv && Array.isArray(kv)) listaMensajes = kv;
                    } catch (_) {}
                }
                listaMensajes.forEach(m => {
                    if (!m.esSoporte && (!usuarioTarget || (m.usuario && m.usuario.toLowerCase() === usuarioTarget))) {
                        m.leidoPorAdmin = true;
                    }
                });
                if (env.CORSSEN_STORAGE) {
                    await env.CORSSEN_STORAGE.put("corssen_soporte_chat", JSON.stringify(listaMensajes));
                }
                return jsonResponse({ ok: true, mensaje: "Mensajes marcados como leídos" });
            } catch (err: any) {
                return jsonResponse({ error: String(err) }, 500);
            }
        }

        if (path === "/api/soporte/mensajes" || path === "/api/chat/mensajes") {
            const bienvenida = [
                {
                    id: "MSG-INIT-001",
                    usuario: "aron_soporte",
                    nombre: "Aron Martinez (ServiTec Pro)",
                    rol: "admin",
                    texto: "👋 ¡Hola! Bienvenido al chat directo de soporte técnico de Corssen Logística. Puedes escribir tus dudas técnicas, requerimientos de flota o consultar por fallas aquí mismo sin salir del sistema.",
                    timestamp: new Date().toISOString(),
                    hora: "10:00",
                    esSoporte: true,
                    origen: "sistema"
                }
            ];

            let listaMensajes: any[] = bienvenida;
            if (env.CORSSEN_STORAGE) {
                try {
                    const kv = await env.CORSSEN_STORAGE.get("corssen_soporte_chat", { type: "json" });
                    if (kv && Array.isArray(kv)) listaMensajes = kv;
                } catch (_) {}
            }

            if (request.method === "GET") {
                const urlParams = url.searchParams;
                const usuarioFiltro = (urlParams.get("usuario") || "").toLowerCase().trim();
                let mensajes = listaMensajes;
                if (usuarioFiltro && usuarioFiltro !== "admin" && usuarioFiltro !== "todos") {
                    mensajes = listaMensajes.filter(m => 
                        (m.usuario && m.usuario.toLowerCase() === usuarioFiltro) ||
                        (m.destinatario && m.destinatario.toLowerCase() === usuarioFiltro) ||
                        (m.id === "MSG-INIT-001")
                    );
                }
                const pendientes = listaMensajes.filter(m => !m.esSoporte && m.necesitaAtencionHumana && !m.leidoPorAdmin);

                return jsonResponse({
                    ok: true,
                    canal: "in_app_soporte_servitec",
                    agente: "Aron Martinez (ServiTec Pro)",
                    estado: "conectado",
                    mensajes: mensajes,
                    total: mensajes.length,
                    pendientesAdminCount: pendientes.length,
                    ultimosPendientes: pendientes.slice(-5)
                });
            }

            if (request.method === "POST") {
                try {
                    const body: any = await request.json();
                    const texto = (body.texto || "").trim();
                    if (!texto) {
                        return jsonResponse({ error: "El campo texto es obligatorio" }, 400);
                    }

                    const idMsg = "MSG-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
                    const hora = new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
                    const esSoporte = Boolean(body.esSoporte || (body.rol === "admin" && (body.usuario === "admin" || body.usuario === "aron")));
                    const remitente = body.usuario || (esSoporte ? "admin" : "operador");
                    const nombreRemitente = body.nombre || (esSoporte ? "Aron Martinez (Administrador General)" : (remitente === "daniel" ? "Daniel Corssen (Operador)" : (remitente === "rodrigo" ? "Rodrigo Silva (Mecánico)" : "Operador")));
                    const destinatario = body.destinatario || (esSoporte ? "daniel" : "admin");

                    const tLower = texto.toLowerCase();
                    const pideAtencionHumana = tLower.includes("aron") || tLower.includes("humano") || tLower.includes("contacto") || tLower.includes("soporte") || tLower.includes("hablar") || tLower.includes("admin") || Boolean(body.necesitaAtencionHumana);

                    const nuevoMensaje = {
                        id: idMsg,
                        usuario: remitente,
                        nombre: nombreRemitente,
                        rol: body.rol || (esSoporte ? "admin" : "operador"),
                        texto: texto,
                        timestamp: new Date().toISOString(),
                        hora: hora,
                        esSoporte: esSoporte,
                        destinatario: destinatario,
                        necesitaAtencionHumana: !esSoporte && pideAtencionHumana,
                        leidoPorAdmin: esSoporte ? true : false
                    };
                    listaMensajes.push(nuevoMensaje);

                    if (esSoporte && destinatario) {
                        listaMensajes.forEach(m => {
                            if (m.usuario && m.usuario.toLowerCase() === destinatario.toLowerCase()) {
                                m.leidoPorAdmin = true;
                            }
                        });
                    }

                    let respuestaAutomatica: any = null;
                    if (!esSoporte) {
                        let respuestaTexto = "";
                        let tituloContexto = "";

                        if (tLower.includes("ficha") || tLower.includes("filtro") || tLower.includes("baldwin") || tLower.includes("donaldson") || (tLower.includes("aceite") && tLower.includes("motor"))) {
                            tituloContexto = "Fichas Técnicas & Filtros";
                            respuestaTexto = "En el módulo de Fichas Técnicas puedes consultar la matriz completa de equivalencias multimarca (Baldwin, Donaldson, Fleetguard y Mann). Los cambios guardados por el Administrador ya persisten en el servidor.";
                        } else if (tLower.includes("camion") || tLower.includes("camioneta") || tLower.includes("flota") || tLower.includes("cmn-") || tLower.includes("cam-") || tLower.includes("patente")) {
                            tituloContexto = "Flota & Unidades Registradas";
                            respuestaTexto = "Las unidades dadas de alta (camionetas, camiones y maquinaria pesada) se sincronizan en la tabla de Flota Registrada y en el Programa Maestro.";
                        } else if (tLower.includes("combustible") || tLower.includes("estanque") || tLower.includes("litro") || tLower.includes("diesel") || tLower.includes("400")) {
                            tituloContexto = "Control de Combustible (Estanque 400L)";
                            respuestaTexto = "El estanque de 400L descuenta en tiempo real los despachos realizados a cada equipo y emite alerta si el saldo baja de 100L.";
                        } else if (tLower.includes("respaldo") || tLower.includes("backup") || tLower.includes("restaurar")) {
                            tituloContexto = "Puntos de Restauración y Respaldos";
                            respuestaTexto = "Los respaldos no se aplican automáticamente para no interrumpir tus labores. El Administrador General dispone del botón '🚀 Aplicar este Punto' para ejecutar restauraciones cuando sea necesario.";
                        } else {
                            tituloContexto = "Solicitud Transmitida al Administrador";
                            respuestaTexto = `🔔 Tu consulta ha sido notificada en tiempo real a <strong>Aron Martinez (Administrador General)</strong>. Te responderá directamente a través de este chat interno en la plataforma.`;
                            nuevoMensaje.necesitaAtencionHumana = true;
                        }

                        respuestaAutomatica = {
                            id: "MSG-RESP-" + Date.now(),
                            usuario: "aron_soporte",
                            nombre: "Aron Martinez (ServiTec Pro)",
                            rol: "admin",
                            texto: respuestaTexto,
                            tituloContexto: tituloContexto,
                            timestamp: new Date().toISOString(),
                            hora: hora,
                            esSoporte: true,
                            autoRespuesta: true,
                            destinatario: remitente,
                            leidoPorAdmin: true
                        };
                        listaMensajes.push(respuestaAutomatica);
                    }

                    if (listaMensajes.length > 200) listaMensajes = listaMensajes.slice(-200);
                    if (env.CORSSEN_STORAGE) {
                        try {
                            await env.CORSSEN_STORAGE.put("corssen_soporte_chat", JSON.stringify(listaMensajes));
                        } catch (_) {}
                    }

                    return jsonResponse({
                        ok: true,
                        mensajeEnviado: nuevoMensaje,
                        respuestaInmediata: respuestaAutomatica,
                        todosLosMensajes: listaMensajes
                    });
                } catch (errPost: any) {
                    return jsonResponse({ error: "Error enviando mensaje: " + String(errPost) }, 500);
                }
            }

            if (request.method === "DELETE") {
                listaMensajes = bienvenida;
                if (env.CORSSEN_STORAGE) {
                    try {
                        await env.CORSSEN_STORAGE.put("corssen_soporte_chat", JSON.stringify(listaMensajes));
                    } catch (_) {}
                }
                return jsonResponse({ ok: true, mensaje: "Chat reiniciado", mensajes: bienvenida });
            }
        }

        // Servir activos estáticos desde Cloudflare Assets (HTML, CSS, JS, imágenes)
        if (env.ASSETS) {
            return env.ASSETS.fetch(request);
        }

        return jsonResponse({ mensaje: "Ruta no encontrada en Cloudflare Worker" }, 404);
    }
};

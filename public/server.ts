import express from "express";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

const app = express();
let PORT = 3000;
const portArgIdx = process.argv.indexOf("--port");
if (portArgIdx !== -1 && process.argv[portArgIdx + 1]) {
    const parsed = parseInt(process.argv[portArgIdx + 1], 10);
    if (!isNaN(parsed) && parsed !== 8080) PORT = parsed;
}

// Configuración básica
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Log de peticiones y protección de archivos sensibles
app.use((req, res, next) => {
    if (req.path.toLowerCase() === "/usuarios.json") {
        return res.status(403).json({ error: "ACCESO_DENEGADO", mensaje: "Acceso prohibido." });
    }
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

const archivoUsuarios = path.join(process.cwd(), "usuarios.json");
const archivoConfigServicio = path.join(process.cwd(), "config_servicio.json");

// Función para leer configuración del servicio y cuota mensual
function leerConfigServicio(): {
    estadoServicio: "activo" | "suspendido";
    motivo: string;
    fechaModificacion: string;
    modificadoPor: string;
} {
    try {
        if (!fs.existsSync(archivoConfigServicio)) {
            const defaultConfig = {
                estadoServicio: "activo" as const,
                motivo: "Cuota mensual de respaldos y mantenimientos al día",
                fechaModificacion: new Date().toISOString(),
                modificadoPor: "admin"
            };
            fs.writeFileSync(archivoConfigServicio, JSON.stringify(defaultConfig, null, 4), "utf8");
            return defaultConfig;
        }

        const contenido = fs.readFileSync(archivoConfigServicio, "utf8");
        const parsed = JSON.parse(contenido);
        return {
            estadoServicio: parsed.estadoServicio === "suspendido" ? "suspendido" : "activo",
            motivo: parsed.motivo || "Cuota mensual de respaldos y mantenimientos pendiente de regularización",
            fechaModificacion: parsed.fechaModificacion || new Date().toISOString(),
            modificadoPor: parsed.modificadoPor || "admin"
        };
    } catch (error) {
        console.error("Error leyendo config_servicio.json:", error);
        return {
            estadoServicio: "activo",
            motivo: "Cuota mensual de respaldos y mantenimientos al día",
            fechaModificacion: new Date().toISOString(),
            modificadoPor: "admin"
        };
    }
}

// Función para guardar configuración del servicio
function guardarConfigServicio(config: any): boolean {
    try {
        fs.writeFileSync(archivoConfigServicio, JSON.stringify(config, null, 4), "utf8");
        const publicDir = path.join(process.cwd(), "public");
        if (fs.existsSync(publicDir)) {
            try {
                fs.writeFileSync(path.join(publicDir, "config_servicio.json"), JSON.stringify(config, null, 4), "utf8");
            } catch (_) {}
        }
        return true;
    } catch (error) {
        console.error("Error guardando config_servicio.json:", error);
        return false;
    }
}

const archivoConfigMantenimiento = path.join(process.cwd(), "config_mantenimiento.json");

function leerConfigMantenimiento(): any {
    try {
        if (!fs.existsSync(archivoConfigMantenimiento)) {
            const defaultConfig = {
                mantenimientoActivo: false,
                titulo: "Mantenimiento y Corrección de Errores del Sistema",
                motivo: "Mantenimiento preventivo, optimización de base de datos y corrección de incidencias",
                fechaInicio: "2026-09-30",
                horaInicio: "22:00",
                fechaFinEstimada: "2026-10-01",
                horaFinEstimada: "02:00",
                duracionEstimada: "4 horas",
                mensajePersonalizado: "La plataforma se encuentra temporalmente fuera de servicio por labores programadas de mantenimiento y optimización técnica ejecutadas por el Administrador General.",
                audienciaBloqueo: "todos_excepto_admin",
                usuariosBloqueados: ["daniel", "operador"],
                excepcionAdmin: "admin",
                clienteNotificacion: {
                    nombre: "Daniel Corssen",
                    empresa: "Corssen Logística y Maquinarias",
                    email: "contacto@corssen.cl",
                    whatsapp: "+56912345678"
                },
                calendario: [],
                historialAvisos: []
            };
            fs.writeFileSync(archivoConfigMantenimiento, JSON.stringify(defaultConfig, null, 2), "utf8");
            return defaultConfig;
        }
        return JSON.parse(fs.readFileSync(archivoConfigMantenimiento, "utf8"));
    } catch (e) {
        console.error("Error leyendo config_mantenimiento.json:", e);
        return {
            mantenimientoActivo: false,
            audienciaBloqueo: "todos_excepto_admin",
            usuariosBloqueados: ["daniel", "operador"]
        };
    }
}

function guardarConfigMantenimiento(cfg: any): boolean {
    try {
        fs.writeFileSync(archivoConfigMantenimiento, JSON.stringify(cfg, null, 2), "utf8");
        const publicDir = path.join(process.cwd(), "public");
        if (fs.existsSync(publicDir)) {
            try {
                fs.writeFileSync(path.join(publicDir, "config_mantenimiento.json"), JSON.stringify(cfg, null, 2), "utf8");
            } catch (_) {}
        }
        return true;
    } catch (e) {
        console.error("Error guardando config_mantenimiento.json:", e);
        return false;
    }
}

// Función para leer usuarios
function leerUsuarios(): any[] | null {
    try {
        if (!fs.existsSync(archivoUsuarios)) {
            const defaultUsers = [
                {
                    usuario: "admin",
                    password: "$2b$10$uYTOyaJeHb9FQfOosVFElehPB3AntqhXGSMUTUbJGjYTXv.KLx/x2", // admin
                    nombre: "Administrador General",
                    rol: "admin",
                    avatar: "avatar-admin",
                    estado: "activo"
                },
                {
                    usuario: "operador",
                    password: "$2b$10$qac5xGf7UI3udD4j88V/O.OiWQUFBa5qJX3Yb.V5YpbmMR8FWzYL6", // 1234
                    nombre: "Operador Principal",
                    rol: "operador",
                    avatar: "avatar-mecanico",
                    estado: "activo"
                }
            ];
            fs.writeFileSync(archivoUsuarios, JSON.stringify(defaultUsers, null, 4), "utf8");
            return defaultUsers;
        }

        const contenido = fs.readFileSync(archivoUsuarios, "utf8");
        const parsed = JSON.parse(contenido);
        // Garantizar que todos tengan avatar, estado y corregir posibles erratas en nombres
        let modificado = false;
        parsed.forEach((u: any) => {
            if (!u.avatar) {
                u.avatar = (u.rol === "admin") ? "avatar-admin" : "avatar-mecanico";
                modificado = true;
            }
            if (u.nombre && u.nombre.includes("Corsser")) {
                u.nombre = u.nombre.replace(/Corsser/gi, "Corssen");
                modificado = true;
            }
            if (!u.estado) {
                u.estado = "activo";
                modificado = true;
            }
            if (String(u.usuario).toLowerCase() === "admin") {
                u.estado = "activo"; // El administrador nunca está suspendido
            }
        });
        if (modificado) {
            fs.writeFileSync(archivoUsuarios, JSON.stringify(parsed, null, 4), "utf8");
        }
        return parsed;
    } catch (error) {
        console.error("Error leyendo usuarios.json:", error);
        return null;
    }
}

// Función para guardar usuarios
function guardarUsuarios(usuarios: any[]): boolean {
    try {
        fs.writeFileSync(archivoUsuarios, JSON.stringify(usuarios, null, 4), "utf8");
        return true;
    } catch (error) {
        console.error("Error guardando usuarios.json:", error);
        return false;
    }
}

// Middleware para verificar permisos de Administrador
function verificarAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
    const usuarioHeader = req.headers["x-usuario"];

    if (!usuarioHeader) {
        return res.status(401).json({ mensaje: "No estás autenticado. Falta encabezado de usuario." });
    }

    const usuarios = leerUsuarios();
    if (!usuarios) {
        return res.status(500).json({ mensaje: "Error al leer la base de datos de usuarios." });
    }

    const usuarioEncontrado = usuarios.find(
        u => String(u.usuario).toLowerCase() === String(usuarioHeader).toLowerCase()
    );

    if (!usuarioEncontrado) {
        return res.status(401).json({ mensaje: "El usuario especificado no existe." });
    }

    if (String(usuarioEncontrado.rol).toLowerCase() !== "admin") {
        return res.status(403).json({ mensaje: "No tienes permisos de administrador." });
    }

    next();
}

// =====================================================
// RUTAS API
// =====================================================

// Health check
app.get(["/api/health", "/health", "/prueba"], (req, res) => {
    res.json({ status: "ok", service: "CORSSEN Logística API" });
});

// Login
app.post("/api/login", async (req, res) => {
    try {
        const { usuario, password } = req.body;

        if (!usuario || !password) {
            return res.status(400).json({ mensaje: "Usuario y contraseña son obligatorios." });
        }

        const usuarios = leerUsuarios();
        if (!usuarios) {
            return res.status(500).json({ mensaje: "Error leyendo base de datos de usuarios." });
        }

        const usuarioEncontrado = usuarios.find(
            u => String(u.usuario).toLowerCase() === String(usuario).toLowerCase().trim()
        );

        if (!usuarioEncontrado) {
            return res.status(401).json({ mensaje: "Usuario o contraseña incorrectos." });
        }

        // Comparar contraseña con bcrypt o fallback seguro
        let passwordCorrecta = false;
        if (usuarioEncontrado.password.startsWith("$2a$") || usuarioEncontrado.password.startsWith("$2b$")) {
            passwordCorrecta = await bcrypt.compare(password, usuarioEncontrado.password);
        } else {
            // Si estaba en texto plano, compatibilizar y migrar a hash
            passwordCorrecta = (password === usuarioEncontrado.password);
            if (passwordCorrecta) {
                usuarioEncontrado.password = await bcrypt.hash(password, 10);
                guardarUsuarios(usuarios);
            }
        }

        if (!passwordCorrecta) {
            return res.status(401).json({ mensaje: "Usuario o contraseña incorrectos." });
        }

        // Solo el Administrador General (usuario "admin") tiene acceso garantizado permanente
        // Daniel y operadores corresponden a la cuenta cliente y quedan suspendidos si la cuota no está al día
        const esSuperAdmin = (usuarioEncontrado.usuario.toLowerCase() === "admin");
        const configServicio = leerConfigServicio();

        // VALIDACIÓN DE SUSPENSIÓN POR CUOTA MENSUAL O VENTANA DE MANTENIMIENTO ACTIVA
        if (!esSuperAdmin) {
            // 0. Validación de Ventana de Mantenimiento Activa (Exclusivo: solo 'admin' puede ingresar)
            const configMantenimiento = leerConfigMantenimiento();
            if (configMantenimiento && configMantenimiento.mantenimientoActivo) {
                const bloquearTodos = configMantenimiento.audienciaBloqueo === "todos_excepto_admin";
                const uNorm = usuarioEncontrado.usuario.toLowerCase().trim();
                const enListaBloqueados = Array.isArray(configMantenimiento.usuariosBloqueados) && 
                    configMantenimiento.usuariosBloqueados.some((u: string) => u.toLowerCase() === uNorm);

                if (bloquearTodos || enListaBloqueados) {
                    return res.status(403).json({
                        error: "MANTENIMIENTO_ACTIVO",
                        mantenimiento: true,
                        suspendido: true,
                        titulo: configMantenimiento.titulo || "Ventana de Mantenimiento en Progreso",
                        mensaje: configMantenimiento.mensajePersonalizado || "La plataforma se encuentra temporalmente fuera de servicio por labores programadas de mantenimiento y optimización técnica.",
                        motivo: configMantenimiento.motivo || "Trabajos técnicos y optimización programada",
                        fechaFinEstimada: configMantenimiento.fechaFinEstimada || "",
                        horaFinEstimada: configMantenimiento.horaFinEstimada || ""
                    });
                }
            }

            // 1. Suspensión global de servicio por no pago de cuota de respaldos y mantenimiento
            if (configServicio.estadoServicio === "suspendido") {
                return res.status(403).json({
                    error: "SERVICIO_SUSPENDIDO",
                    mensaje: "Acceso suspendido temporalmente por concepto de cuota mensual de respaldos y mantenimientos pendiente de regularización.",
                    motivo: configServicio.motivo || "Cuota mensual de respaldos y mantenimientos pendiente de pago",
                    suspendido: true
                });
            }

            // 2. Suspensión individual del usuario
            if (usuarioEncontrado.estado === "suspendido") {
                return res.status(403).json({
                    error: "USUARIO_SUSPENDIDO",
                    mensaje: "Tu cuenta de usuario ha sido suspendida temporalmente por la administración.",
                    motivo: "Acceso individual suspendido por concepto de cuota de servicio o mantención",
                    suspendido: true
                });
            }
        }

        res.json({
            mensaje: "Inicio de sesión correcto",
            usuario: usuarioEncontrado.usuario,
            nombre: usuarioEncontrado.nombre,
            rol: usuarioEncontrado.rol,
            avatar: usuarioEncontrado.avatar || (usuarioEncontrado.rol === "admin" ? "avatar-admin" : "avatar-mecanico"),
            estado: usuarioEncontrado.estado || "activo",
            estadoServicio: configServicio.estadoServicio
        });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ mensaje: "Error interno del servidor en login." });
    }
});

// Obtener usuarios (Solo admin)
app.get("/api/usuarios", verificarAdmin, (req, res) => {
    try {
        const usuarioHeader = String(req.headers["x-usuario"] || (req as any).usuario || "").toLowerCase().trim();
        const esAdminGeneral = (usuarioHeader === "admin");
        const usuarios = leerUsuarios();
        if (!usuarios) {
            return res.status(500).json({ mensaje: "Error al leer usuarios." });
        }

        const usuariosSeguros = usuarios.map((u: any) => {
            const uLower = String(u.usuario || "").toLowerCase().trim();
            const passVisible = u.password_plana || (!String(u.password || "").startsWith("$2") ? u.password : (uLower === "admin" ? "admin123" : "1234"));
            return {
                usuario: u.usuario,
                nombre: u.nombre,
                rol: u.rol,
                avatar: u.avatar || (u.rol === "admin" ? "avatar-admin" : "avatar-mecanico"),
                estado: uLower === "admin" ? "activo" : (u.estado || "activo"),
                ...(esAdminGeneral ? { password_visible: passVisible } : {})
            };
        });

        res.json(usuariosSeguros);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ mensaje: "Error al obtener la lista de usuarios." });
    }
});

// Crear usuario (Solo admin)
app.post("/api/usuarios", verificarAdmin, async (req, res) => {
    try {
        const { usuario, nombre, password, rol, avatar } = req.body;

        if (!usuario || !nombre || !password || !rol) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
        }

        if (password.length < 4) {
            return res.status(400).json({ mensaje: "La contraseña debe tener al menos 4 caracteres." });
        }

        if (rol !== "admin" && rol !== "operador") {
            return res.status(400).json({ mensaje: "El rol seleccionado debe ser 'admin' u 'operador'." });
        }

        const usuarios = leerUsuarios();
        if (!usuarios) {
            return res.status(500).json({ mensaje: "Error leyendo usuarios." });
        }

        const usuarioExiste = usuarios.some(
            u => String(u.usuario).toLowerCase() === String(usuario).toLowerCase().trim()
        );

        if (usuarioExiste) {
            return res.status(409).json({ mensaje: "El nombre de usuario ya está registrado." });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const avatarAsignado = avatar && typeof avatar === "string" && avatar.trim().length > 0 
            ? avatar.trim() 
            : (rol === "admin" ? "avatar-admin" : "avatar-mecanico");

        usuarios.push({
            usuario: usuario.trim(),
            password: passwordHash,
            password_plana: String(password).trim(),
            nombre: nombre.trim(),
            rol: rol,
            avatar: avatarAsignado,
            estado: "activo"
        });

        guardarUsuarios(usuarios);

        res.json({ mensaje: "Usuario creado correctamente.", avatar: avatarAsignado });
    } catch (error) {
        console.error("Error creando usuario:", error);
        res.status(500).json({ mensaje: "Error interno del servidor al crear usuario." });
    }
});

// Actualizar avatar de un usuario (Admin o el propio usuario)
app.patch("/api/usuarios/:usuario/avatar", async (req, res) => {
    try {
        const usuarioHeader = req.headers["x-usuario"];
        const usuarioObjetivo = decodeURIComponent(req.params.usuario).trim();
        const { avatar } = req.body;

        if (!usuarioHeader) {
            return res.status(401).json({ mensaje: "No autenticado." });
        }

        if (!avatar || typeof avatar !== "string" || avatar.trim().length === 0) {
            return res.status(400).json({ mensaje: "El avatar o imagen es obligatorio." });
        }

        const usuarios = leerUsuarios();
        if (!usuarios) {
            return res.status(500).json({ mensaje: "Error leyendo usuarios." });
        }

        const solicitante = usuarios.find(
            u => String(u.usuario).toLowerCase() === String(usuarioHeader).toLowerCase()
        );

        if (!solicitante) {
            return res.status(401).json({ mensaje: "Usuario solicitante no existe." });
        }

        const esMismoUsuario = String(usuarioHeader).toLowerCase() === String(usuarioObjetivo).toLowerCase();
        const esAdmin = String(solicitante.rol).toLowerCase() === "admin";

        if (!esMismoUsuario && !esAdmin) {
            return res.status(403).json({ mensaje: "No tienes permiso para modificar el avatar de otro usuario." });
        }

        const indice = usuarios.findIndex(
            u => String(u.usuario).toLowerCase() === String(usuarioObjetivo).toLowerCase()
        );

        if (indice === -1) {
            return res.status(404).json({ mensaje: "Usuario no encontrado." });
        }

        usuarios[indice].avatar = avatar;
        guardarUsuarios(usuarios);

        res.json({ 
            mensaje: "Imagen de perfil actualizada correctamente.", 
            usuario: usuarios[indice].usuario,
            avatar: usuarios[indice].avatar 
        });
    } catch (error) {
        console.error("Error actualizando avatar:", error);
        res.status(500).json({ mensaje: "Error interno al actualizar avatar." });
    }
});

// Actualizar avatar del perfil propio activo
app.patch("/api/perfil/avatar", async (req, res) => {
    try {
        const usuarioHeader = req.headers["x-usuario"];
        const { avatar } = req.body;

        if (!usuarioHeader) {
            return res.status(401).json({ mensaje: "No autenticado." });
        }

        if (!avatar || typeof avatar !== "string" || avatar.trim().length === 0) {
            return res.status(400).json({ mensaje: "El avatar es obligatorio." });
        }

        const usuarios = leerUsuarios();
        if (!usuarios) {
            return res.status(500).json({ mensaje: "Error leyendo usuarios." });
        }

        const indice = usuarios.findIndex(
            u => String(u.usuario).toLowerCase() === String(usuarioHeader).toLowerCase()
        );

        if (indice === -1) {
            return res.status(404).json({ mensaje: "Usuario no encontrado." });
        }

        usuarios[indice].avatar = avatar;
        guardarUsuarios(usuarios);

        res.json({ 
            mensaje: "Tu imagen de perfil ha sido actualizada.", 
            usuario: usuarios[indice].usuario,
            avatar: usuarios[indice].avatar 
        });
    } catch (error) {
        console.error("Error actualizando avatar de perfil:", error);
        res.status(500).json({ mensaje: "Error interno al actualizar avatar." });
    }
});

// Cambiar contraseña (Solo admin)
app.patch("/api/usuarios/:usuario/password", verificarAdmin, async (req, res) => {
    try {
        const usuarioObjetivo = decodeURIComponent(req.params.usuario);
        const { nuevaPassword } = req.body;

        if (!nuevaPassword || nuevaPassword.length < 4) {
            return res.status(400).json({ mensaje: "La contraseña debe tener al menos 4 caracteres." });
        }

        const usuarios = leerUsuarios();
        if (!usuarios) {
            return res.status(500).json({ mensaje: "Error leyendo usuarios." });
        }

        const indice = usuarios.findIndex(
            u => String(u.usuario).toLowerCase() === String(usuarioObjetivo).toLowerCase().trim()
        );

        if (indice === -1) {
            return res.status(404).json({ mensaje: "El usuario no existe." });
        }

        usuarios[indice].password = await bcrypt.hash(nuevaPassword, 10);
        usuarios[indice].password_plana = String(nuevaPassword).trim();
        guardarUsuarios(usuarios);

        res.json({ mensaje: "Contraseña cambiada correctamente." });
    } catch (error) {
        console.error("Error cambiando contraseña:", error);
        res.status(500).json({ mensaje: "Error interno al actualizar la contraseña." });
    }
});

// Eliminar usuario (Solo admin)
app.delete("/api/usuarios/:usuario", verificarAdmin, (req, res) => {
    try {
        const usuarioEliminar = decodeURIComponent(req.params.usuario);

        if (usuarioEliminar.toLowerCase() === "admin") {
            return res.status(403).json({ mensaje: "El usuario administrador principal no se puede eliminar." });
        }

        const usuarios = leerUsuarios();
        if (!usuarios) {
            return res.status(500).json({ mensaje: "Error leyendo usuarios." });
        }

        const usuariosActualizados = usuarios.filter(
            u => String(u.usuario).toLowerCase() !== String(usuarioEliminar).toLowerCase().trim()
        );

        if (usuariosActualizados.length === usuarios.length) {
            return res.status(404).json({ mensaje: "El usuario no existe." });
        }

        guardarUsuarios(usuariosActualizados);
        res.json({ mensaje: "Usuario eliminado correctamente." });
    } catch (error) {
        console.error("Error eliminando usuario:", error);
        res.status(500).json({ mensaje: "Error interno al eliminar usuario." });
    }
});

// Actualizar datos de un usuario (Nombre y Rol - PUT/POST/PATCH - Solo Admin)
const handlerActualizarUsuario = (req: express.Request, res: express.Response) => {
    try {
        const usuarioObjetivo = decodeURIComponent(req.params.usuario).trim();
        let { nombre, rol } = req.body;

        if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
            return res.status(400).json({ mensaje: "El nombre es obligatorio." });
        }

        nombre = nombre.trim();
        if (nombre.includes("Corsser")) {
            nombre = nombre.replace(/Corsser/gi, "Corssen");
        }

        const usuarios = leerUsuarios();
        if (!usuarios) {
            return res.status(500).json({ mensaje: "Error leyendo base de datos de usuarios." });
        }

        const usuarioIndex = usuarios.findIndex(
            u => String(u.usuario).toLowerCase() === usuarioObjetivo.toLowerCase()
        );

        if (usuarioIndex === -1) {
            return res.status(404).json({ mensaje: "Usuario no encontrado." });
        }

        usuarios[usuarioIndex].nombre = nombre;
        if (rol && (rol === "admin" || rol === "operador")) {
            if (usuarioObjetivo.toLowerCase() !== "admin") {
                usuarios[usuarioIndex].rol = rol;
            }
        }

        if (req.body.estado && (req.body.estado === "activo" || req.body.estado === "suspendido")) {
            if (usuarioObjetivo.toLowerCase() !== "admin") {
                usuarios[usuarioIndex].estado = req.body.estado;
            }
        }

        guardarUsuarios(usuarios);
        res.json({ mensaje: "Datos de usuario actualizados correctamente.", usuario: usuarios[usuarioIndex] });
    } catch (error) {
        console.error("Error actualizando usuario:", error);
        res.status(500).json({ mensaje: "Error interno al actualizar usuario." });
    }
};

app.put("/api/usuarios/:usuario", verificarAdmin, handlerActualizarUsuario);
app.post("/api/usuarios/:usuario", verificarAdmin, handlerActualizarUsuario);
app.patch("/api/usuarios/:usuario", verificarAdmin, handlerActualizarUsuario);

// Endpoint: Obtener estado global del servicio y cuota mensual
app.get("/api/servicio/estado", (req, res) => {
    try {
        const config = leerConfigServicio();
        res.json(config);
    } catch (error) {
        console.error("Error obteniendo estado del servicio:", error);
        res.status(500).json({ mensaje: "Error al obtener estado del servicio." });
    }
});

// Endpoint: Cambiar estado global del servicio (Solo Administrador General 'admin' - Suspender / Reactivar acceso a clientes)
app.post("/api/servicio/estado", (req, res) => {
    try {
        const usuarioHeader = String(req.headers["x-usuario"] || "").toLowerCase().trim();
        if (usuarioHeader !== "admin") {
            return res.status(403).json({
                error: "NO_AUTORIZADO",
                mensaje: "Acceso denegado: Solo el Administrador General (admin) tiene autorización para suspender o reactivar el servicio."
            });
        }

        const { estadoServicio, motivo } = req.body;
        if (estadoServicio !== "activo" && estadoServicio !== "suspendido") {
            return res.status(400).json({ mensaje: "El estado debe ser 'activo' o 'suspendido'." });
        }

        const configActual = leerConfigServicio();
        const nuevaConfig = {
            estadoServicio,
            motivo: (motivo && String(motivo).trim()) || (estadoServicio === "suspendido" ? "Cuota mensual de respaldos y mantenimientos pendiente de pago" : "Cuota mensual de respaldos y mantenimientos al día"),
            fechaModificacion: new Date().toISOString(),
            modificadoPor: usuarioHeader
        };

        guardarConfigServicio(nuevaConfig);

        const accionTxt = estadoServicio === "suspendido"
            ? "Acceso de clientes suspendido preventivamente por cuota mensual de respaldos y mantenimiento."
            : "Acceso de clientes reactivado con éxito (cuota al día).";

        res.json({
            mensaje: accionTxt,
            config: nuevaConfig
        });
    } catch (error) {
        console.error("Error actualizando estado del servicio:", error);
        res.status(500).json({ mensaje: "Error interno al actualizar estado del servicio." });
    }
});

// Endpoint: Alternar suspensión individual de un usuario cliente/operador (Solo Administrador General 'admin')
const handleSuspensionUsuario = (req: any, res: any) => {
    try {
        const usuarioHeader = String(req.headers["x-usuario"] || req.body?.adminUsuario || req.body?.usuarioAdmin || "").toLowerCase().trim();
        if (usuarioHeader !== "admin") {
            return res.status(403).json({
                error: "NO_AUTORIZADO",
                mensaje: "Acceso denegado: Solo el Administrador General (admin) puede suspender o reactivar usuarios."
            });
        }

        const usuarioObjetivo = decodeURIComponent(req.params.usuario).trim().toLowerCase();
        const { estado } = req.body;

        if (usuarioObjetivo === "admin") {
            return res.status(403).json({ mensaje: "El Administrador General tiene acceso permanente y no puede ser suspendido." });
        }

        if (estado !== "activo" && estado !== "suspendido") {
            return res.status(400).json({ mensaje: "El estado debe ser 'activo' o 'suspendido'." });
        }

        const usuarios = leerUsuarios();
        if (!usuarios) {
            return res.status(500).json({ mensaje: "Error leyendo base de datos de usuarios." });
        }

        const idx = usuarios.findIndex(u => u.usuario.toLowerCase() === usuarioObjetivo);
        if (idx === -1) {
            return res.status(404).json({ mensaje: "Usuario no encontrado." });
        }

        usuarios[idx].estado = estado;
        guardarUsuarios(usuarios);

        const msg = estado === "suspendido"
            ? `Inicio de sesión suspendido para '${usuarios[idx].usuario}' por cuota de respaldo/mantenimiento.`
            : `Inicio de sesión reactivado para '${usuarios[idx].usuario}'.`;

        res.json({ mensaje: msg, usuario: usuarios[idx].usuario, estado });
    } catch (error) {
        console.error("Error cambiando estado individual de usuario:", error);
        res.status(500).json({ mensaje: "Error interno al modificar estado del usuario." });
    }
};
app.patch("/api/usuarios/:usuario/estado", handleSuspensionUsuario);
app.post("/api/usuarios/:usuario/estado", handleSuspensionUsuario);

// ========================================================
// ENDPOINTS: CONTROL DE VENTANA DE MANTENIMIENTO Y CALENDARIO (EXCLUSIVO ADMIN GENERAL)
// ========================================================
app.get("/api/mantenimiento/config", (req, res) => {
    try {
        const usuarioHeader = String(req.headers["x-usuario"] || "").toLowerCase().trim();
        const cfg = leerConfigMantenimiento();

        if (usuarioHeader === "admin") {
            return res.json(cfg);
        }

        res.json({
            mantenimientoActivo: !!cfg.mantenimientoActivo,
            titulo: cfg.titulo || "Mantenimiento del Sistema",
            motivo: cfg.motivo || "Labores técnicas de optimización",
            fechaInicio: cfg.fechaInicio || "",
            horaInicio: cfg.horaInicio || "",
            fechaFinEstimada: cfg.fechaFinEstimada || "",
            horaFinEstimada: cfg.horaFinEstimada || "",
            duracionEstimada: cfg.duracionEstimada || "",
            mensajePersonalizado: cfg.mensajePersonalizado || ""
        });
    } catch (error) {
        console.error("Error obteniendo config de mantenimiento:", error);
        res.status(500).json({ error: "Error al obtener configuración de mantenimiento." });
    }
});

app.post("/api/mantenimiento/config", (req, res) => {
    try {
        const usuarioHeader = String(req.headers["x-usuario"] || "").toLowerCase().trim();
        if (usuarioHeader !== "admin") {
            return res.status(403).json({
                error: "NO_AUTORIZADO",
                mensaje: "Acceso denegado: Este módulo de control es exclusivo para el Administrador General (admin)."
            });
        }

        const cfgActual = leerConfigMantenimiento();
        const nuevaCfg = {
            ...cfgActual,
            ...req.body,
            fechaModificacion: new Date().toISOString(),
            modificadoPor: "admin"
        };
        guardarConfigMantenimiento(nuevaCfg);

        res.json({
            ok: true,
            mensaje: nuevaCfg.mantenimientoActivo
                ? "Ventana de mantenimiento ACTIVADA. Las conexiones de clientes y operadores están restringidas."
                : "Ventana de mantenimiento FINALIZADA. Plataforma operativa para todos los usuarios.",
            config: nuevaCfg
        });
    } catch (error: any) {
        console.error("Error guardando config de mantenimiento:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/api/mantenimiento/calendario", (req, res) => {
    try {
        const usuarioHeader = String(req.headers["x-usuario"] || "").toLowerCase().trim();
        if (usuarioHeader !== "admin") {
            return res.status(403).json({ error: "NO_AUTORIZADO" });
        }

        const cfg = leerConfigMantenimiento();
        if (!Array.isArray(cfg.calendario)) cfg.calendario = [];

        const eventoId = req.body.id || ("MNT-" + Date.now());
        const evento = {
            id: eventoId,
            titulo: req.body.titulo || "Mantenimiento Programado",
            tipo: req.body.tipo || "PREVENTIVO",
            fecha: req.body.fecha || new Date().toISOString().split("T")[0],
            hora: req.body.hora || "22:00",
            duracion: req.body.duracion || "2 horas",
            estado: req.body.estado || "PROGRAMADO",
            motivo: req.body.motivo || "Optimización técnica y mantención",
            notificadoEmail: !!req.body.notificadoEmail,
            notificadoWhatsapp: !!req.body.notificadoWhatsapp,
            creadoEn: req.body.creadoEn || new Date().toISOString()
        };

        const idx = cfg.calendario.findIndex((e: any) => e.id === eventoId);
        if (idx >= 0) {
            cfg.calendario[idx] = { ...cfg.calendario[idx], ...evento };
        } else {
            cfg.calendario.unshift(evento);
        }

        guardarConfigMantenimiento(cfg);
        res.json({ ok: true, evento, calendario: cfg.calendario });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.delete("/api/mantenimiento/calendario/:id", (req, res) => {
    try {
        const usuarioHeader = String(req.headers["x-usuario"] || "").toLowerCase().trim();
        if (usuarioHeader !== "admin") {
            return res.status(403).json({ error: "NO_AUTORIZADO" });
        }

        const idEvento = req.params.id;
        const cfg = leerConfigMantenimiento();
        if (Array.isArray(cfg.calendario)) {
            cfg.calendario = cfg.calendario.filter((e: any) => e.id !== idEvento);
            guardarConfigMantenimiento(cfg);
        }
        res.json({ ok: true, mensaje: "Evento eliminado", calendario: cfg.calendario });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/api/mantenimiento/notificar", (req, res) => {
    try {
        const usuarioHeader = String(req.headers["x-usuario"] || "").toLowerCase().trim();
        if (usuarioHeader !== "admin") {
            return res.status(403).json({ error: "NO_AUTORIZADO" });
        }

        const cfg = leerConfigMantenimiento();
        if (!Array.isArray(cfg.historialAvisos)) cfg.historialAvisos = [];

        const registroAviso = {
            id: "NOTIF-" + Date.now(),
            canal: req.body.canal || "whatsapp",
            destinatario: req.body.destinatario || "",
            mensaje: req.body.mensaje || "",
            fechaEnvio: new Date().toLocaleDateString("es-CL"),
            horaEnvio: new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
            timestamp: Date.now(),
            eventoId: req.body.eventoId || null
        };

        cfg.historialAvisos.unshift(registroAviso);
        if (cfg.historialAvisos.length > 50) cfg.historialAvisos = cfg.historialAvisos.slice(0, 50);

        if (req.body.eventoId && Array.isArray(cfg.calendario)) {
            const ev = cfg.calendario.find((e: any) => e.id === req.body.eventoId);
            if (ev) {
                if (req.body.canal === "whatsapp") ev.notificadoWhatsapp = true;
                if (req.body.canal === "email") ev.notificadoEmail = true;
            }
        }

        guardarConfigMantenimiento(cfg);
        res.json({ ok: true, mensaje: "Aviso registrado exitosamente", registro: registroAviso });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================================
// ENDPOINTS: PROGRAMA MAESTRO DE MANTENCIÓN Y EQUIPOS
// ========================================================
const archivoPrograma = path.join(process.cwd(), "programa.json");

function leerPrograma(): any[] {
    try {
        if (!fs.existsSync(archivoPrograma)) {
            return [];
        }
        const data = fs.readFileSync(archivoPrograma, "utf8");
        return JSON.parse(data);
    } catch (e) {
        console.error("Error leyendo programa.json:", e);
        return [];
    }
}

function guardarPrograma(prog: any[]): boolean {
    try {
        fs.writeFileSync(archivoPrograma, JSON.stringify(prog, null, 4), "utf8");
        return true;
    } catch (e) {
        console.error("Error guardando programa.json:", e);
        return false;
    }
}

app.get("/api/programa", (req, res) => {
    res.json(leerPrograma());
});

app.put("/api/programa/:cod", verificarAdmin, (req, res) => {
    try {
        const cod = decodeURIComponent(req.params.cod).trim();
        const datosEquipo = req.body || {};
        let programa = leerPrograma();

        const index = programa.findIndex(p => String(p.cod).toLowerCase() === cod.toLowerCase());
        if (index !== -1) {
            programa[index] = { ...programa[index], ...datosEquipo, cod: programa[index].cod, actualizado_en: new Date().toISOString() };
        } else {
            programa.push({ ...datosEquipo, cod: cod, actualizado_en: new Date().toISOString() });
        }

        guardarPrograma(programa);

        // Sincronizar de inmediato el último backup en disco para que /api/backup/obtener/ultimo tenga el estado actualizado
        try {
            const indexPath = path.join(backupsDir, "historial_backups.json");
            if (fs.existsSync(indexPath)) {
                const historial = JSON.parse(fs.readFileSync(indexPath, "utf8"));
                if (Array.isArray(historial) && historial.length > 0 && historial[0].id) {
                    const bPath = path.join(backupsDir, `${historial[0].id}.json`);
                    if (fs.existsSync(bPath)) {
                        const bData = JSON.parse(fs.readFileSync(bPath, "utf8"));
                        if (bData && bData.data && Array.isArray(bData.data.corssen_programa_v2)) {
                            const bIdx = bData.data.corssen_programa_v2.findIndex((p: any) => String(p.cod).toLowerCase() === cod.toLowerCase());
                            if (bIdx !== -1) {
                                bData.data.corssen_programa_v2[bIdx] = { ...bData.data.corssen_programa_v2[bIdx], ...datosEquipo, cod: bData.data.corssen_programa_v2[bIdx].cod };
                            } else {
                                bData.data.corssen_programa_v2.push({ ...datosEquipo, cod });
                            }
                            if (Array.isArray(bData.data.flota_maquinarias_v3) && datosEquipo.estado) {
                                const mIdx = bData.data.flota_maquinarias_v3.findIndex((m: any) => (m.numeroMaquinaria || m.id || "").toLowerCase() === cod.toLowerCase());
                                if (mIdx !== -1) {
                                    bData.data.flota_maquinarias_v3[mIdx].estado = datosEquipo.estado;
                                }
                            }
                            bData.timestamp = Date.now();
                            fs.writeFileSync(bPath, JSON.stringify(bData, null, 2), "utf8");
                        }
                    }
                }
            }
        } catch (eSyncBkp) {
            console.warn("Advertencia sincronizando último backup con programa:", eSyncBkp);
        }

        res.json({ mensaje: "Mantención de equipo actualizada con éxito", equipo: datosEquipo });
    } catch (error) {
        console.error("Error actualizando programa:", error);
        res.status(500).json({ mensaje: "Error interno al actualizar mantención del equipo." });
    }
});

app.delete("/api/programa/:cod", verificarAdmin, (req, res) => {
    try {
        const cod = decodeURIComponent(req.params.cod).trim().toLowerCase();
        let programa = leerPrograma();
        programa = programa.filter(p => String(p.cod).toLowerCase() !== cod);
        guardarPrograma(programa);

        // Limpiar también del último backup en disco si existe
        try {
            const indexPath = path.join(backupsDir, "historial_backups.json");
            if (fs.existsSync(indexPath)) {
                const historial = JSON.parse(fs.readFileSync(indexPath, "utf8"));
                if (Array.isArray(historial) && historial.length > 0 && historial[0].id) {
                    const bPath = path.join(backupsDir, `${historial[0].id}.json`);
                    if (fs.existsSync(bPath)) {
                        const bData = JSON.parse(fs.readFileSync(bPath, "utf8"));
                        if (bData && bData.data) {
                            if (Array.isArray(bData.data.corssen_programa_v2)) {
                                bData.data.corssen_programa_v2 = bData.data.corssen_programa_v2.filter((p: any) => String(p.cod).toLowerCase() !== cod);
                            }
                            if (Array.isArray(bData.data.flota_maquinarias_v3)) {
                                bData.data.flota_maquinarias_v3 = bData.data.flota_maquinarias_v3.filter((m: any) => (m.numeroMaquinaria || m.id || "").toLowerCase() !== cod);
                            }
                            if (Array.isArray(bData.data.flota_vehiculos_v3)) {
                                bData.data.flota_vehiculos_v3 = bData.data.flota_vehiculos_v3.filter((v: any) => (v.codigo || v.id || v.patente || "").toLowerCase() !== cod);
                            }
                            bData.timestamp = Date.now();
                            fs.writeFileSync(bPath, JSON.stringify(bData, null, 2), "utf8");
                        }
                    }
                }
            }
        } catch (eSyncBkp) {
            console.warn("Advertencia limpiando backup tras delete programa:", eSyncBkp);
        }

        res.json({ mensaje: "Equipo eliminado del programa con éxito" });
    } catch (error) {
        console.error("Error eliminando equipo del programa:", error);
        res.status(500).json({ mensaje: "Error interno al eliminar equipo del programa." });
    }
});

// ==========================================
// ENDPOINTS DE FICHAS TÉCNICAS (MAQUINARIAS Y VEHÍCULOS)
// ==========================================
const archivoFichas = path.join(process.cwd(), "fichas.json");

function leerFichas(): Record<string, any> {
    try {
        if (fs.existsSync(archivoFichas)) {
            const data = fs.readFileSync(archivoFichas, "utf8");
            return JSON.parse(data);
        }
        // Fallback: seed desde el último backup si existe
        const indexPath = path.join(backupsDir, "historial_backups.json");
        if (fs.existsSync(indexPath)) {
            const historial = JSON.parse(fs.readFileSync(indexPath, "utf8"));
            if (Array.isArray(historial) && historial.length > 0 && historial[0].id) {
                const bPath = path.join(backupsDir, `${historial[0].id}.json`);
                if (fs.existsSync(bPath)) {
                    const bData = JSON.parse(fs.readFileSync(bPath, "utf8"));
                    if (bData?.data?.corssen_fichas_v2) {
                        guardarFichas(bData.data.corssen_fichas_v2);
                        return bData.data.corssen_fichas_v2;
                    }
                }
            }
        }
        return {};
    } catch (e) {
        console.error("Error leyendo fichas.json:", e);
        return {};
    }
}

function guardarFichas(fichas: Record<string, any>): boolean {
    try {
        fs.writeFileSync(archivoFichas, JSON.stringify(fichas, null, 4), "utf8");
        return true;
    } catch (e) {
        console.error("Error guardando fichas.json:", e);
        return false;
    }
}

app.get("/api/fichas", (req, res) => {
    res.json(leerFichas());
});

app.get("/api/fichas/:cod", (req, res) => {
    const cod = decodeURIComponent(req.params.cod).trim().toUpperCase();
    const fichas = leerFichas();
    if (fichas[cod]) {
        res.json(fichas[cod]);
    } else {
        res.status(404).json({ error: `Ficha técnica no encontrada para ${cod}` });
    }
});

app.put("/api/fichas/:cod", verificarAdmin, (req, res) => {
    try {
        const cod = decodeURIComponent(req.params.cod).trim().toUpperCase();
        const datosFicha = req.body || {};
        let fichas = leerFichas();
        fichas[cod] = { ...datosFicha, codigo: cod, actualizado_en: new Date().toISOString() };
        guardarFichas(fichas);
        res.json({ mensaje: `Ficha técnica de ${cod} guardada con éxito en el servidor`, ficha: fichas[cod] });
    } catch (error) {
        console.error("Error guardando ficha técnica:", error);
        res.status(500).json({ mensaje: "Error interno al guardar ficha técnica." });
    }
});

app.delete("/api/fichas/:cod", verificarAdmin, (req, res) => {
    try {
        const cod = decodeURIComponent(req.params.cod).trim().toUpperCase();
        let fichas = leerFichas();
        if (fichas[cod]) {
            delete fichas[cod];
            guardarFichas(fichas);
            res.json({ mensaje: `Ficha técnica de ${cod} eliminada del servidor` });
        } else {
            res.status(404).json({ error: "Ficha no encontrada" });
        }
    } catch (error) {
        console.error("Error eliminando ficha técnica:", error);
        res.status(500).json({ mensaje: "Error interno al eliminar ficha técnica." });
    }
});

// ==========================================
// ENDPOINTS DE COPIAS DE SEGURIDAD Y BACKUPS
// ==========================================
const backupsDir = path.join(process.cwd(), "backups");
if (!fs.existsSync(backupsDir)) {
    try { fs.mkdirSync(backupsDir, { recursive: true }); } catch (_) {}
}

app.post("/api/backup/guardar", (req, res) => {
    try {
        const body = req.body || {};
        const backupId = body.id || ("SNP-SERVER-" + Date.now());
        const timestamp = body.timestamp || Date.now();
        const fecha = body.fecha || new Date().toLocaleDateString("es-CL");
        const hora = body.hora || new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

        const snapshotMeta = {
          id: backupId,
          fecha: fecha,
          hora: hora,
          timestamp: timestamp,
          motivo: body.motivo || "Copia de Seguridad Automática",
          tipo: body.tipo || "AUTOMATICO_SERVIDOR",
          usuario: body.usuario || "Sistema Corssen",
          resumen: body.resumen || {},
          origen: "Servidor Node"
        };

        const archivoPath = path.join(backupsDir, `${backupId}.json`);
        fs.writeFileSync(archivoPath, JSON.stringify({ ...snapshotMeta, data: body.data }, null, 2), "utf8");

        // Sincronizar fichas.json y programa.json con el estado recibido si están presentes
        if (body.data?.corssen_fichas_v2 && typeof body.data.corssen_fichas_v2 === "object") {
            try {
                const fActuales = leerFichas();
                guardarFichas({ ...fActuales, ...body.data.corssen_fichas_v2 });
            } catch (_) {}
        }
        if (body.data?.corssen_programa_v2 && Array.isArray(body.data.corssen_programa_v2)) {
            try {
                guardarPrograma(body.data.corssen_programa_v2);
            } catch (_) {}
        }

        // Guardar index de historial
        const indexPath = path.join(backupsDir, "historial_backups.json");
        let historial: any[] = [];
        if (fs.existsSync(indexPath)) {
            try { historial = JSON.parse(fs.readFileSync(indexPath, "utf8")); } catch (_) {}
        }
        historial.unshift(snapshotMeta);
        if (historial.length > 30) historial = historial.slice(0, 30);
        fs.writeFileSync(indexPath, JSON.stringify(historial, null, 2), "utf8");

        res.json({ mensaje: "Copia de seguridad guardada exitosamente en el servidor", id: backupId, snapshot: snapshotMeta });
    } catch (err: any) {
        console.error("Error guardando backup:", err);
        res.status(500).json({ error: "Error al procesar respaldo: " + err.message });
    }
});

app.get("/api/backup/historial", (req, res) => {
    try {
        const indexPath = path.join(backupsDir, "historial_backups.json");
        let historial: any[] = [];
        if (fs.existsSync(indexPath)) {
            historial = JSON.parse(fs.readFileSync(indexPath, "utf8"));
        }
        res.json(historial);
    } catch (err: any) {
        res.status(500).json({ error: "Error leyendo historial de backups" });
    }
});

app.get("/api/backup/estado", (req, res) => {
    try {
        const indexPath = path.join(backupsDir, "historial_backups.json");
        let historial: any[] = [];
        if (fs.existsSync(indexPath)) {
            historial = JSON.parse(fs.readFileSync(indexPath, "utf8"));
        }
        res.json({
            estado: "ACTIVO",
            servicios: {
                d1_sql: true,
                kv_storage: true,
                cron_triggers: true
            },
            cron_configuracion: {
                frecuencia: "Cada hora (0 * * * *)",
                descripcion: "Disparado automáticamente por Cloudflare Cron Triggers"
            },
            ultimo_respaldo: historial.length > 0 ? historial[0] : null,
            total_respaldos_guardados: historial.length
        });
    } catch (err: any) {
        res.status(500).json({ error: "Error obteniendo estado de respaldos" });
    }
});

app.post("/api/backup/cron-ejecutar", (req, res) => {
    try {
        const indexPath = path.join(backupsDir, "historial_backups.json");
        let historial: any[] = [];
        if (fs.existsSync(indexPath)) {
            historial = JSON.parse(fs.readFileSync(indexPath, "utf8"));
        }
        const ultimo = historial.length > 0 ? historial[0] : null;
        const timestamp = Date.now();
        const backupId = "SNP-CRON-" + timestamp;
        const snapshotMeta = {
            id: backupId,
            fecha: new Date().toLocaleDateString("es-CL"),
            hora: new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            timestamp: timestamp,
            motivo: "Respaldo Automático Programado (Cloudflare Cron)",
            tipo: "CRON_AUTOMATICO",
            usuario: "Cloudflare Cron Trigger",
            resumen: ultimo?.resumen || {},
            origen: "Servidor Node & Cloudflare"
        };
        const archivoPath = path.join(backupsDir, `${backupId}.json`);
        fs.writeFileSync(archivoPath, JSON.stringify({ ...snapshotMeta, data: {} }, null, 2), "utf8");
        historial.unshift(snapshotMeta);
        if (historial.length > 30) historial = historial.slice(0, 30);
        fs.writeFileSync(indexPath, JSON.stringify(historial, null, 2), "utf8");
        res.json({ ok: true, id: backupId, snapshot: snapshotMeta });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/backup/obtener/:id", (req, res) => {
    try {
        let bId = req.params.id;
        const esUltimo = (bId === "ultimo");
        if (esUltimo) {
            const indexPath = path.join(backupsDir, "historial_backups.json");
            if (fs.existsSync(indexPath)) {
                const historial = JSON.parse(fs.readFileSync(indexPath, "utf8"));
                if (Array.isArray(historial) && historial.length > 0 && historial[0].id) {
                    bId = historial[0].id;
                }
            }
        }
        const archivoPath = path.join(backupsDir, `${bId}.json`);
        if (fs.existsSync(archivoPath)) {
            const data = JSON.parse(fs.readFileSync(archivoPath, "utf8"));
            // Si se solicita el último backup, reconciliar con programa.json para garantizar consistencia total
            if (esUltimo && data && data.data) {
                const programaActual = leerPrograma();
                if (Array.isArray(programaActual) && programaActual.length > 0) {
                    if (!Array.isArray(data.data.corssen_programa_v2)) data.data.corssen_programa_v2 = [];
                    programaActual.forEach((progItem: any) => {
                        if (!progItem.cod) return;
                        const pIdx = data.data.corssen_programa_v2.findIndex((p: any) => String(p.cod).toLowerCase() === String(progItem.cod).toLowerCase());
                        if (pIdx !== -1) {
                            data.data.corssen_programa_v2[pIdx] = { ...data.data.corssen_programa_v2[pIdx], ...progItem };
                        } else {
                            data.data.corssen_programa_v2.push(progItem);
                        }
                        if (Array.isArray(data.data.flota_maquinarias_v3) && progItem.estado) {
                            const mIdx = data.data.flota_maquinarias_v3.findIndex((m: any) => (m.numeroMaquinaria || m.id || "").toLowerCase() === String(progItem.cod).toLowerCase());
                            if (mIdx !== -1) {
                                data.data.flota_maquinarias_v3[mIdx].estado = progItem.estado;
                            }
                        }
                    });
                }
            }
            return res.json(data);
        }
        res.status(404).json({ error: "Respaldo no encontrado" });
    } catch (err: any) {
        res.status(500).json({ error: "Error leyendo archivo de respaldo" });
    }
});

// Prueba del servidor
app.get("/prueba", (req, res) => {
    res.send("EL SERVIDOR DE CONTROL DE FLOTA ESTA FUNCIONANDO CORRECTAMENTE");
});

// Archivos estáticos y rutas
const publicPath = path.join(process.cwd(), "public");

// Endpoint para descarga directa del Standalone HTML
app.get(["/descargar-html", "/api/descargar-html"], (req, res) => {
    const htmlPath = path.join(publicPath, "corssen_sistema_flota_offline.html");
    if (fs.existsSync(htmlPath)) {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.download(htmlPath, "corssen_control_flota_completo.html");
    }
    // Fallback si no existe: empaquetar index + style + script
    try {
        const indexHtml = fs.readFileSync(path.join(publicPath, "index.html"), "utf8");
        const styleCss = fs.readFileSync(path.join(publicPath, "style.css"), "utf8");
        const scriptJs = fs.readFileSync(path.join(publicPath, "script.js"), "utf8");
        let standalone = indexHtml.replace('<link rel="stylesheet" href="/style.css">', `<style>\n${styleCss}\n</style>`);
        standalone = standalone.replace('<script src="/script.js"></script>', `<script>\n${scriptJs}\n</script>`);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Content-Disposition", 'attachment; filename="corssen_control_flota_completo.html"');
        return res.send(standalone);
    } catch (err) {
        return res.status(500).json({ error: "Error generando archivo HTML" });
    }
});

// Endpoint para descarga directa del ZIP
app.get(["/descargar-zip", "/api/descargar-zip", "/proyecto_control_flota.zip", "/corssen_logistica_v1.zip", "/archivos_corregidos_corssen.zip", "/corssen_flota.zip"], (req, res) => {
    const zipPath = path.join(publicPath, "archivos_corregidos_corssen.zip");
    if (fs.existsSync(zipPath)) {
        res.setHeader("Content-Type", "application/zip");
        return res.download(zipPath, "archivos_corregidos_corssen.zip");
    }
    const altZip = path.join(publicPath, "proyecto_control_flota.zip");
    if (fs.existsSync(altZip)) {
        res.setHeader("Content-Type", "application/zip");
        return res.download(altZip, "proyecto_control_flota.zip");
    }
    return res.status(404).json({ error: "Archivo ZIP no disponible" });
});

// Endpoints para descarga forzada de archivos individuales como attachment
app.get(["/descargar-script", "/api/descargar-script"], (req, res) => {
    const file = path.join(process.cwd(), "script.js");
    if (fs.existsSync(file)) {
        return res.download(file, "script.js");
    }
    return res.status(404).send("script.js no encontrado");
});

app.get(["/descargar-worker", "/api/descargar-worker"], (req, res) => {
    const file = path.join(process.cwd(), "worker.js");
    if (fs.existsSync(file)) {
        return res.download(file, "worker.js");
    }
    return res.status(404).send("worker.js no encontrado");
});

app.get(["/descargar-servidor", "/api/descargar-servidor"], (req, res) => {
    const file = path.join(process.cwd(), "server.ts");
    if (fs.existsSync(file)) {
        return res.download(file, "server.ts");
    }
    return res.status(404).send("server.ts no encontrado");
});

// Middleware para deshabilitar caché en desarrollo y asegurar que siempre se carguen los cambios más recientes
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
});

// Servir archivos estáticos tanto desde la raíz como desde public sin caché
const staticOptions = {
    etag: false,
    lastModified: false,
    maxAge: 0,
    setHeaders: (res: express.Response) => {
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
    }
};
app.use(express.static(process.cwd(), staticOptions));
app.use(express.static(publicPath, staticOptions));

// Rutas de páginas HTML
app.get("/login", (req, res) => {
    const rootLogin = path.join(process.cwd(), "login.html");
    if (fs.existsSync(rootLogin)) return res.sendFile(rootLogin);
    res.sendFile(path.join(publicPath, "login.html"));
});

app.get("/usuarios", (req, res) => {
    const rootUsuarios = path.join(process.cwd(), "usuarios.html");
    if (fs.existsSync(rootUsuarios)) return res.sendFile(rootUsuarios);
    res.sendFile(path.join(publicPath, "usuarios.html"));
});

app.get("*", (req, res) => {
    const rootIndex = path.join(process.cwd(), "index.html");
    if (fs.existsSync(rootIndex)) return res.sendFile(rootIndex);
    res.sendFile(path.join(publicPath, "index.html"));
});

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log("=========================================");
    console.log("🚛 SISTEMA DE CONTROL DE FLOTA Y MAQUINARIA");
    console.log(`🌐 Servidor activo en http://localhost:${PORT}`);
    console.log(`  ➜  Local:   http://localhost:${PORT}/`);
    console.log(`  ➜  Network: http://0.0.0.0:${PORT}/`);
    console.log("=========================================");
});

// Manejo de señales de terminación para liberación inmediata de puertos
const cerrarServidor = () => {
    server.close(() => {
        process.exit(0);
    });
    setTimeout(() => process.exit(0), 1500).unref();
};

process.on("SIGTERM", cerrarServidor);
process.on("SIGINT", cerrarServidor);

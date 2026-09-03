import express from "express";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

const app = express();
const PORT = 3000;

// Configuración básica
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Log de peticiones
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

const archivoUsuarios = path.join(process.cwd(), "usuarios.json");

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
                    avatar: "avatar-admin"
                },
                {
                    usuario: "operador",
                    password: "$2b$10$qac5xGf7UI3udD4j88V/O.OiWQUFBa5qJX3Yb.V5YpbmMR8FWzYL6", // 1234
                    nombre: "Operador Principal",
                    rol: "operador",
                    avatar: "avatar-mecanico"
                }
            ];
            fs.writeFileSync(archivoUsuarios, JSON.stringify(defaultUsers, null, 4), "utf8");
            return defaultUsers;
        }

        const contenido = fs.readFileSync(archivoUsuarios, "utf8");
        const parsed = JSON.parse(contenido);
        // Garantizar que todos tengan avatar
        let modificado = false;
        parsed.forEach((u: any) => {
            if (!u.avatar) {
                u.avatar = (u.rol === "admin") ? "avatar-admin" : "avatar-mecanico";
                modificado = true;
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

        res.json({
            mensaje: "Inicio de sesión correcto",
            usuario: usuarioEncontrado.usuario,
            nombre: usuarioEncontrado.nombre,
            rol: usuarioEncontrado.rol,
            avatar: usuarioEncontrado.avatar || (usuarioEncontrado.rol === "admin" ? "avatar-admin" : "avatar-mecanico")
        });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ mensaje: "Error interno del servidor en login." });
    }
});

// Obtener usuarios (Solo admin)
app.get("/api/usuarios", verificarAdmin, (req, res) => {
    try {
        const usuarios = leerUsuarios();
        if (!usuarios) {
            return res.status(500).json({ mensaje: "Error al leer usuarios." });
        }

        // Retornar información segura sin hashes de contraseña
        const usuariosSeguros = usuarios.map(u => ({
            usuario: u.usuario,
            nombre: u.nombre,
            rol: u.rol,
            avatar: u.avatar || (u.rol === "admin" ? "avatar-admin" : "avatar-mecanico")
        }));

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
            nombre: nombre.trim(),
            rol: rol,
            avatar: avatarAsignado
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

app.get("/api/backup/obtener/:id", (req, res) => {
    try {
        const bId = req.params.id;
        const archivoPath = path.join(backupsDir, `${bId}.json`);
        if (fs.existsSync(archivoPath)) {
            const data = JSON.parse(fs.readFileSync(archivoPath, "utf8"));
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
        return res.download(altZip, "archivos_corregidos_corssen.zip");
    }
    return res.status(404).json({ error: "Archivo ZIP no disponible" });
});

app.use(express.static(publicPath));

// Rutas de páginas HTML
app.get("/login", (req, res) => {
    res.sendFile(path.join(publicPath, "login.html"));
});

app.get("/usuarios", (req, res) => {
    res.sendFile(path.join(publicPath, "usuarios.html"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
    console.log("=========================================");
    console.log("🚛 SISTEMA DE CONTROL DE FLOTA Y MAQUINARIA");
    console.log(`🌐 Servidor activo en http://0.0.0.0:${PORT}`);
    console.log("=========================================");
});

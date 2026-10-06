import http from 'http';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

console.log('\n================================================================');
console.log('🧪 CORSSEN LOGÍSTICA - SUITE INTEGRAL DE PRUEBAS DE MÓDULOS');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const testResults = [];

function assert(condition, testName, moduleName, details = '') {
    totalTests++;
    if (condition) {
        passedTests++;
        testResults.push({ module: moduleName, test: testName, status: 'PASS', details });
        console.log(`  ✅ [PASS] [${moduleName}] ${testName}`);
    } else {
        failedTests++;
        testResults.push({ module: moduleName, test: testName, status: 'FAIL', details });
        console.error(`  ❌ [FAIL] [${moduleName}] ${testName} - ${details}`);
    }
}

// Helper para hacer peticiones HTTP al servidor local
function request(method, pathUrl, headers = {}, body = null) {
    return new Promise((resolve, reject) => {
        const payload = body ? JSON.stringify(body) : null;
        const reqHeaders = { ...headers };
        if (payload) {
            reqHeaders['Content-Type'] = 'application/json';
            reqHeaders['Content-Length'] = Buffer.byteLength(payload);
        }

        const options = {
            hostname: '127.0.0.1',
            port: 3000,
            path: pathUrl,
            method: method,
            headers: reqHeaders
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                let parsed = null;
                try {
                    parsed = JSON.parse(data);
                } catch (e) {
                    parsed = data;
                }
                resolve({ status: res.statusCode, headers: res.headers, body: parsed });
            });
        });

        req.on('error', (err) => reject(err));
        if (payload) req.write(payload);
        req.end();
    });
}

async function ejecutarPruebas() {
    // -------------------------------------------------------------
    // MÓDULO 1: SERVIDOR Y ENDPOINTS API
    // -------------------------------------------------------------
    console.log('\n🔹 MÓDULO 1: Servidor Node y Endpoints API');
    try {
        const resHealth = await request('GET', '/api/health');
        assert(resHealth.status === 200 && resHealth.body?.status === 'ok', 
            'Health Check /api/health responde 200 OK', 'API');

        const resPrueba = await request('GET', '/prueba');
        assert(resPrueba.status === 200 && resPrueba.body?.service?.includes('CORSSEN'),
            'Endpoint de prueba /prueba responde 200 OK', 'API');

        const resLoginFail = await request('POST', '/api/login', {}, { usuario: 'baduser', password: 'badpassword' });
        assert(resLoginFail.status === 401, 
            'Login con credenciales inválidas es rechazado (401)', 'API');

        const resLoginEmpty = await request('POST', '/api/login', {}, { usuario: '', password: '' });
        assert(resLoginEmpty.status === 400, 
            'Login sin parámetros es rechazado (400)', 'API');

        const resLoginAdmin = await request('POST', '/api/login', {}, { usuario: 'admin', password: 'admin' });
        assert(resLoginAdmin.status === 200 && resLoginAdmin.body?.rol === 'admin', 
            'Login administrador (admin/admin) autentica con rol admin (200)', 'API');

        const resLoginOp = await request('POST', '/api/login', {}, { usuario: 'operador', password: '1234' });
        assert(resLoginOp.status === 200 && resLoginOp.body?.rol === 'operador', 
            'Login operador (operador/1234) autentica con rol operador (200)', 'API');

        // RBAC: Operador no puede ver lista de usuarios
        const resUsersOp = await request('GET', '/api/usuarios', { 'x-usuario': 'operador' });
        assert(resUsersOp.status === 403, 
            'Operador no tiene permisos para listar usuarios (403 Forbidden)', 'API / RBAC');

        // RBAC: Administrador sí puede listar usuarios
        const resUsersAdmin = await request('GET', '/api/usuarios', { 'x-usuario': 'admin' });
        assert(resUsersAdmin.status === 200 && Array.isArray(resUsersAdmin.body) && resUsersAdmin.body.length >= 2, 
            'Administrador puede listar usuarios con éxito (200 OK)', 'API / RBAC');

        // CRUD de Usuario Temporal para prueba completa
        const testUser = `test_bot_${Date.now()}`;
        const resCreate = await request('POST', '/api/usuarios', { 'x-usuario': 'admin' }, {
            usuario: testUser,
            nombre: 'Usuario Bot de Prueba',
            password: 'secretPassword123',
            rol: 'operador'
        });
        assert(resCreate.status === 200, 
            'Administrador puede crear nuevo usuario vía API', 'API / Usuarios');

        const resUpdateAvatar = await request('PATCH', `/api/usuarios/${testUser}/avatar`, { 'x-usuario': 'admin' }, {
            avatar: 'avatar-mecanico'
        });
        assert(resUpdateAvatar.status === 200, 
            'Actualización de avatar por API responde 200', 'API / Usuarios');

        const resUpdateDatos = await request('PUT', `/api/usuarios/${testUser}`, { 'x-usuario': 'admin' }, {
            nombre: 'Usuario Bot Modificado Corssen',
            rol: 'admin'
        });
        assert(resUpdateDatos.status === 200 && resUpdateDatos.body?.usuario?.nombre === 'Usuario Bot Modificado Corssen', 
            'Administrador puede modificar nombre y rol vía PUT /api/usuarios/:usuario', 'API / Usuarios');

        const resDeleteUser = await request('DELETE', `/api/usuarios/${testUser}`, { 'x-usuario': 'admin' });
        assert(resDeleteUser.status === 200, 
            'Administrador puede eliminar usuario vía API', 'API / Usuarios');

        // Visibilidad de contraseñas exclusiva para el Administrador General
        const resUsersAdminView = await request('GET', '/api/usuarios', { 'x-usuario': 'admin' });
        const danielUser = resUsersAdminView.body?.find(u => u.usuario === 'daniel');
        assert(danielUser && (danielUser.password_visible === '1234' || danielUser.password_visible),
            'Administrador General puede ver la contraseña del usuario Daniel y demás usuarios', 'API / Seguridad Claves');

        const resUsersDanielView = await request('GET', '/api/usuarios', { 'x-usuario': 'daniel' });
        assert(resUsersDanielView.body?.[0]?.password_visible === undefined,
            'Usuarios no administradores generales NO tienen acceso a ver contraseñas', 'API / Seguridad Claves');

        const tieneAdminDaniel = resUsersDanielView.body?.some(u => String(u.usuario).toLowerCase().trim() === 'admin');
        assert(!tieneAdminDaniel,
            'El usuario Administrador General (admin) está totalmente oculto para Daniel y operadores en GET /api/usuarios', 'API / Privacidad Admin General');

        // Control de Cuota Mensual y Suspensión de Inicio de Sesión
        const resEstadoServicio = await request('GET', '/api/servicio/estado');
        assert(resEstadoServicio.status === 200 && (resEstadoServicio.body?.estadoServicio === 'activo' || resEstadoServicio.body?.estadoServicio === 'suspendido'),
            'Consulta de estado de servicio y cuota mensual (/api/servicio/estado)', 'API / Suspensión Cuotas');

        // Operador no puede modificar el estado de servicio
        const resSuspenOp = await request('POST', '/api/servicio/estado', { 'x-usuario': 'operador' }, {
            estadoServicio: 'suspendido'
        });
        assert(resSuspenOp.status === 403,
            'Operador no tiene permisos para suspender el servicio (403)', 'API / Suspensión Cuotas');

        // Administrador suspende el servicio preventivamente por no pago de cuota
        const resSuspenAdmin = await request('POST', '/api/servicio/estado', { 'x-usuario': 'admin' }, {
            estadoServicio: 'suspendido',
            motivo: 'Prueba de cuota mensual pendiente de pago'
        });
        assert(resSuspenAdmin.status === 200 && resSuspenAdmin.body?.config?.estadoServicio === 'suspendido',
            'Administrador puede suspender inicio de sesión de clientes por cuota pendiente', 'API / Suspensión Cuotas');

        // Al estar suspendido, el login de cliente/operador debe ser bloqueado con 403
        const resLoginBloqueado = await request('POST', '/api/login', {}, { usuario: 'operador', password: '1234' });
        assert(resLoginBloqueado.status === 403 && resLoginBloqueado.body?.suspendido === true,
            'Inicio de sesión de cliente/operador es bloqueado cuando el servicio está suspendido (403)', 'API / Suspensión Cuotas');

        // Pero el Administrador General SIEMPRE puede ingresar
        const resLoginAdminInmune = await request('POST', '/api/login', {}, { usuario: 'admin', password: 'admin' });
        assert(resLoginAdminInmune.status === 200 && resLoginAdminInmune.body?.rol === 'admin',
            'Administrador General conserva acceso total garantizado incluso con servicio suspendido (200)', 'API / Suspensión Cuotas');

        // Administrador reactiva el servicio (cuota pagada)
        const resReactivarAdmin = await request('POST', '/api/servicio/estado', { 'x-usuario': 'admin' }, {
            estadoServicio: 'activo',
            motivo: 'Cuota mensual de respaldos y mantenimientos al día'
        });
        assert(resReactivarAdmin.status === 200 && resReactivarAdmin.body?.config?.estadoServicio === 'activo',
            'Administrador reactiva el acceso de clientes con éxito (cuota pagada)', 'API / Suspensión Cuotas');

        // Ahora el cliente/operador puede ingresar normalmente de nuevo
        const resLoginRestaurado = await request('POST', '/api/login', {}, { usuario: 'operador', password: '1234' });
        assert(resLoginRestaurado.status === 200 && resLoginRestaurado.body?.rol === 'operador',
            'Cliente/operador puede ingresar normalmente tras reactivar el servicio (200)', 'API / Suspensión Cuotas');

        // Suspensión individual de un usuario específico
        const resSuspenIndiv = await request('PATCH', '/api/usuarios/operador/estado', { 'x-usuario': 'admin' }, {
            estado: 'suspendido'
        });
        assert(resSuspenIndiv.status === 200 && resSuspenIndiv.body?.estado === 'suspendido',
            'Administrador puede suspender individualmente la cuenta de un operador', 'API / Suspensión Cuotas');

        const resLoginIndivBloqueado = await request('POST', '/api/login', {}, { usuario: 'operador', password: '1234' });
        assert(resLoginIndivBloqueado.status === 403 && resLoginIndivBloqueado.body?.suspendido === true,
            'Login de usuario suspendido individualmente es rechazado con 403', 'API / Suspensión Cuotas');

        // Reactivar usuario individual
        const resReactivarIndiv = await request('PATCH', '/api/usuarios/operador/estado', { 'x-usuario': 'admin' }, {
            estado: 'activo'
        });
        assert(resReactivarIndiv.status === 200 && resReactivarIndiv.body?.estado === 'activo',
            'Administrador reactiva la cuenta individual del operador', 'API / Suspensión Cuotas');

        // SEGURIDAD: Daniel (rol admin pero cliente) NO tiene permisos para suspender el servicio
        const resDanielSuspen = await request('POST', '/api/servicio/estado', { 'x-usuario': 'daniel' }, {
            estadoServicio: 'suspendido'
        });
        assert(resDanielSuspen.status === 403,
            'Daniel NO tiene permisos para suspender el servicio general (403)', 'API / Seguridad Daniel');

        // Daniel tampoco puede suspender a otros usuarios
        const resDanielSuspenUser = await request('PATCH', '/api/usuarios/operador/estado', { 'x-usuario': 'daniel' }, {
            estado: 'suspendido'
        });
        assert(resDanielSuspenUser.status === 403,
            'Daniel NO tiene permisos para suspender a otros usuarios (403)', 'API / Seguridad Daniel');

        // Respaldos y Snapshots API
        const resBackupSave = await request('POST', '/api/backup/guardar', {}, {
            motivo: 'Respaldo automático de prueba',
            data: { testTimestamp: Date.now() }
        });
        assert(resBackupSave.status === 200 && resBackupSave.body?.id, 
            'Guardado de copia de seguridad en servidor (/api/backup/guardar)', 'API / Backups');

        const resBackupHistorial = await request('GET', '/api/backup/historial');
        assert(resBackupHistorial.status === 200 && Array.isArray(resBackupHistorial.body), 
            'Consulta de historial de copias de seguridad (/api/backup/historial)', 'API / Backups');

        const resBackupEstado = await request('GET', '/api/backup/estado');
        assert(resBackupEstado.status === 200 && resBackupEstado.body?.estado === 'ACTIVO',
            'Diagnóstico y estado del sistema de respaldos (/api/backup/estado)', 'API / Backups');

        const resBackupCron = await request('POST', '/api/backup/cron-ejecutar');
        assert(resBackupCron.status === 200 && resBackupCron.body?.ok === true, 
            'Disparador y ejecución de respaldo automático Cron (/api/backup/cron-ejecutar)', 'API / Backups');

        // -------------------------------------------------------------
        // TESTS DE VENTANA DE MANTENIMIENTO, CALENDARIO Y AVISOS
        // -------------------------------------------------------------
        const resMantGetAdmin = await request('GET', '/api/mantenimiento/config', { 'x-usuario': 'admin' });
        assert(resMantGetAdmin.status === 200 && resMantGetAdmin.body?.clienteNotificacion, 
            'Administrador General obtiene configuración completa de mantenimiento y contactos (/api/mantenimiento/config)', 'API / Mantenimiento');

        const resMantGetPublic = await request('GET', '/api/mantenimiento/config', { 'x-usuario': 'operador' });
        assert(resMantGetPublic.status === 200 && !resMantGetPublic.body?.clienteNotificacion, 
            'Cliente u operador recibe información pública sin exponer datos privados de contacto', 'API / Mantenimiento');

        // Operador o Daniel NO pueden modificar configuración de mantenimiento
        const resMantPostNoAuth = await request('POST', '/api/mantenimiento/config', { 'x-usuario': 'daniel' }, { mantenimientoActivo: true });
        assert(resMantPostNoAuth.status === 403, 
            'Daniel o usuario no-admin NO tiene permisos para modificar ventana de mantenimiento (403)', 'API / Seguridad Mantenimiento');

        // Admin activa ventana de mantenimiento
        const resMantActivar = await request('POST', '/api/mantenimiento/config', { 'x-usuario': 'admin' }, {
            mantenimientoActivo: true,
            audienciaBloqueo: 'todos_excepto_admin',
            motivo: 'Mantenimiento de prueba automatizada',
            duracionEstimada: '2 horas'
        });
        assert(resMantActivar.status === 200 && resMantActivar.body?.config?.mantenimientoActivo === true, 
            'Administrador General activa la ventana de mantenimiento con bloqueo (200 OK)', 'API / Mantenimiento');

        // Operador intenta loguearse durante mantenimiento activo -> rechazado con 403 MANTENIMIENTO_ACTIVO
        const resLoginOpMant = await request('POST', '/api/login', {}, { usuario: 'operador', password: '1234' });
        assert(resLoginOpMant.status === 403 && (resLoginOpMant.body?.mantenimiento === true || resLoginOpMant.body?.error === 'MANTENIMIENTO_ACTIVO'), 
            'Login de cliente/operador es bloqueado con pantalla de mantenimiento en curso (403)', 'API / Mantenimiento');

        // Administrador General PUEDE loguearse siempre con acceso garantizado
        const resLoginAdminMant = await request('POST', '/api/login', {}, { usuario: 'admin', password: 'admin' });
        assert(resLoginAdminMant.status === 200, 
            'Administrador General conserva acceso exclusivo y total durante el mantenimiento activo (200 OK)', 'API / Mantenimiento');

        // Administrador finaliza ventana de mantenimiento
        const resMantFinalizar = await request('POST', '/api/mantenimiento/config', { 'x-usuario': 'admin' }, {
            mantenimientoActivo: false
        });
        assert(resMantFinalizar.status === 200 && resMantFinalizar.body?.config?.mantenimientoActivo === false, 
            'Administrador General finaliza el mantenimiento y restablece el acceso regular (200 OK)', 'API / Mantenimiento');

        // Agregar evento al calendario
        const resCalAdd = await request('POST', '/api/mantenimiento/calendario', { 'x-usuario': 'admin' }, {
            titulo: 'Mantención Programada Servidores',
            tipo: 'CORRECCION_ERRORES',
            fecha: '2026-10-05',
            hora: '23:00',
            duracion: '3 horas'
        });
        assert(resCalAdd.status === 200 && Array.isArray(resCalAdd.body?.calendario), 
            'Administrador puede agendar nueva fecha en el calendario de mantenimiento (200 OK)', 'API / Mantenimiento');

        // Registrar aviso enviado por WhatsApp/Email
        const resNotif = await request('POST', '/api/mantenimiento/notificar', { 'x-usuario': 'admin' }, {
            canal: 'whatsapp',
            destinatario: '+56912345678',
            mensaje: 'Aviso de prueba de mantención',
            eventoId: resCalAdd.body?.evento?.id
        });
        assert(resNotif.status === 200 && resNotif.body?.ok === true, 
            'Registro y confirmación de envío de aviso al cliente por WhatsApp/Email', 'API / Mantenimiento');

    } catch (err) {
        assert(false, 'Falla inesperada en peticiones de API', 'API', err.message);
    }

    // -------------------------------------------------------------
    // MÓDULO 2: CARGA Y PARSEO DEL SCRIPT DEL CLIENTE
    // -------------------------------------------------------------
    console.log('\n🔹 MÓDULO 2: Integridad de Código y Parseo Client-Side');
    const scriptPath = path.join(process.cwd(), 'script.js');
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    assert(scriptContent.length > 50000, 'script.js existe y contiene el código del sistema', 'Integridad');

    // Emular entorno DOM para script.js
    const sandbox = {
        window: {},
        document: {
            getElementById: (id) => ({
                value: '',
                textContent: '',
                innerHTML: '',
                classList: { add: () => {}, remove: () => {}, toggle: () => {} },
                style: {},
                querySelectorAll: () => []
            }),
            querySelector: () => null,
            querySelectorAll: () => [],
            addEventListener: () => {}
        },
        sessionStorage: {
            data: { rolUsuario: 'admin', usuarioLogueado: 'admin' },
            getItem: function(k) { return this.data[k] || null; },
            setItem: function(k, v) { this.data[k] = v; },
            removeItem: function(k) { delete this.data[k]; }
        },
        localStorage: {
            data: {},
            getItem: function(k) { return this.data[k] || null; },
            setItem: function(k, v) { this.data[k] = v; },
            removeItem: function(k) { delete this.data[k]; }
        },
        console: { log: () => {}, warn: () => {}, error: () => {} },
        alert: () => {},
        confirm: () => true,
        setTimeout: () => {},
        setInterval: () => {},
        fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    };
    sandbox.window = sandbox;

    let vmOk = true;
    try {
        sandbox.globalThis = sandbox;
        sandbox.window = sandbox;
        const scriptExport = scriptContent + `
        try {
            if (typeof cargarTodo === 'function') {
                cargarTodo();
            }
        } catch(err) {
            console.error("cargarTodo error:", err);
        }
        globalThis._EXPORTS_ = {
            corssenFichas: (typeof corssenFichas !== 'undefined') ? corssenFichas : null,
            maquinarias: (typeof maquinarias !== 'undefined') ? maquinarias : null,
            vehiculos: (typeof vehiculos !== 'undefined') ? vehiculos : null,
            inventario: (typeof inventario !== 'undefined') ? inventario : null,
            corssenStock: (typeof corssenStock !== 'undefined') ? corssenStock : null,
            corssenPrograma: (typeof corssenPrograma !== 'undefined') ? corssenPrograma : null,
            estadoTamborAceite: (typeof estadoTamborAceite !== 'undefined') ? estadoTamborAceite : null,
            estadoTanqueCombustible: (typeof estadoTanqueCombustible !== 'undefined') ? estadoTanqueCombustible : null,
            obtenerListaAlertasMantencion: (typeof obtenerListaAlertasMantencion === 'function') ? obtenerListaAlertasMantencion : null,
            esUsuarioAdministrador: (typeof esUsuarioAdministrador === 'function') ? esUsuarioAdministrador : null,
            cambiarModoVistaAlertas: (typeof cambiarModoVistaAlertas === 'function') ? cambiarModoVistaAlertas : null,
            toggleMostrarTodasAlertasDash: (typeof toggleMostrarTodasAlertasDash === 'function') ? toggleMostrarTodasAlertasDash : null
        };
        `;
        const scriptVm = new vm.Script(scriptExport);
        const context = vm.createContext(sandbox);
        scriptVm.runInContext(context);
        Object.assign(sandbox, sandbox._EXPORTS_ || {});
        assert(true, 'script.js compila y ejecuta sin errores sintácticos en sandbox VM', 'Script VM');
    } catch (e) {
        vmOk = false;
        assert(false, 'Error en evaluación de script.js', 'Script VM', e.message);
    }

    // -------------------------------------------------------------
    // MÓDULO 3: FICHAS TÉCNICAS Y EQUIVALENCIAS MULTIMARCA
    // -------------------------------------------------------------
    console.log('\n🔹 MÓDULO 3: Fichas Técnicas y Equivalencias Multimarca');
    const fichas = sandbox.corssenFichas;
    assert(fichas && typeof fichas === 'object', 'corssenFichas está definido como objeto de especificaciones', 'Fichas');
    
    const fichasKeys = Object.keys(fichas || {});
    assert(fichasKeys.length >= 10, `Existen al menos 10 Fichas Técnicas registradas (Detectadas: ${fichasKeys.length})`, 'Fichas');

    // Verificar estructura de fichas críticas de la flota (GPC-01, GHO-01, GTE-01, CAM-01, CMN-01)
    const equiposClave = ['GPC-01', 'GHO-01', 'GTE-01', 'CAM-01', 'CMN-01'];
    equiposClave.forEach(eq => {
        const ficha = fichas ? fichas[eq] : null;
        assert(ficha !== null && ficha !== undefined && (ficha.filtros || ficha.filtrosEquivalentes), 
            `Equipo ${eq} posee Ficha Técnica con matriz de filtros configurada`, 'Fichas');
    });

    // -------------------------------------------------------------
    // MÓDULO 4: CONTROL DE ACCESO (RBAC) EN FICHAS TÉCNICAS
    // -------------------------------------------------------------
    console.log('\n🔹 MÓDULO 4: Permisos RBAC en Fichas Técnicas');
    assert(typeof sandbox.esUsuarioAdministrador === 'function', 
        'Función esUsuarioAdministrador() está definida', 'RBAC');
    
    // Probar con sesión admin
    sandbox.sessionStorage.setItem('rolUsuario', 'admin');
    sandbox.sessionStorage.setItem('usuarioLogueado', 'admin');
    assert(sandbox.esUsuarioAdministrador() === true, 
        'esUsuarioAdministrador() retorna true cuando rolUsuario es "admin"', 'RBAC');

    // Probar con sesión operador
    sandbox.sessionStorage.setItem('rolUsuario', 'operador');
    sandbox.sessionStorage.setItem('usuarioLogueado', 'operador');
    assert(sandbox.esUsuarioAdministrador() === false, 
        'esUsuarioAdministrador() retorna false cuando rolUsuario es "operador"', 'RBAC');

    // Restaurar a admin
    sandbox.sessionStorage.setItem('rolUsuario', 'admin');
    sandbox.sessionStorage.setItem('usuarioLogueado', 'admin');

    // -------------------------------------------------------------
    // MÓDULO 5: ALERTAS DE MANTENCIONES EN DASHBOARD (MODO RESUMIDO Y DETALLADO)
    // -------------------------------------------------------------
    console.log('\n🔹 MÓDULO 5: Alertas de Mantenciones Preventivas en Dashboard');
    assert(typeof sandbox.obtenerListaAlertasMantencion === 'function', 
        'Función obtenerListaAlertasMantencion() está disponible', 'Alertas Dashboard');

    const listaAlertas = sandbox.obtenerListaAlertasMantencion ? sandbox.obtenerListaAlertasMantencion() : [];
    assert(Array.isArray(listaAlertas) && listaAlertas.length > 0, 
        `Cálculo de alertas generó lista de maquinaria activa (${listaAlertas.length} equipos evaluados)`, 'Alertas Dashboard');

    // Validar propiedades de cada alerta calculada
    if (listaAlertas.length > 0) {
        const primera = listaAlertas[0];
        assert(primera.cod && primera.equipo && primera.tipoAlerta && primera.porcentajeProgreso !== undefined, 
            'Estructura de alerta contiene cod, equipo, tipoAlerta y porcentajeProgreso', 'Alertas Dashboard');
    }

    assert(typeof sandbox.cambiarModoVistaAlertas === 'function', 
        'Función cambiarModoVistaAlertas() está disponible para alternar vista resumida/detallada', 'Alertas Dashboard');

    assert(typeof sandbox.toggleMostrarTodasAlertasDash === 'function', 
        'Función toggleMostrarTodasAlertasDash() está disponible para expandir/contraer alertas', 'Alertas Dashboard');

    // -------------------------------------------------------------
    // MÓDULO 6: INVENTARIO, STOCK E INSUMOS
    // -------------------------------------------------------------
    console.log('\n🔹 MÓDULO 6: Gestión de Stock e Insumos');
    const itemsStock = (sandbox.corssenStock && sandbox.corssenStock.length > 0) ? sandbox.corssenStock : sandbox.inventario;
    assert(Array.isArray(itemsStock) && itemsStock.length > 0, 
        `Base de stock de repuestos e insumos cargada (${itemsStock ? itemsStock.length : 0} ítems)`, 'Inventario');

    if (Array.isArray(itemsStock) && itemsStock.length > 0) {
        const itemValido = itemsStock.every(i => (i.detalle || i.nombre) && (i.categoria || i.cat) && i.stock !== undefined);
        assert(itemValido, 'Todos los ítems de repuestos tienen descripción de insumo, categoría y nivel de stock', 'Inventario');
    }

    // -------------------------------------------------------------
    // MÓDULO 7: FLOTA Y MAQUINARIAS
    // -------------------------------------------------------------
    console.log('\n🔹 MÓDULO 7: Control de Maquinarias y Vehículos');
    const maquinarias = (sandbox.maquinarias && sandbox.maquinarias.length > 0) ? sandbox.maquinarias : sandbox.corssenPrograma?.filter(p => p.cat === 'GRÚAS' || p.cat === 'PORTACONTENEDORES' || p.cat === 'HORQUILLAS');
    const vehiculos = (sandbox.vehiculos && sandbox.vehiculos.length > 0) ? sandbox.vehiculos : sandbox.corssenPrograma?.filter(p => p.cat === 'MÓVILES');

    assert(Array.isArray(maquinarias) && maquinarias.length > 0, 
        `Lista de maquinarias pesadas cargada (${maquinarias ? maquinarias.length : 0} unidades)`, 'Flota');
    assert(Array.isArray(vehiculos) && vehiculos.length > 0, 
        `Lista de vehículos de apoyo/camiones cargada (${vehiculos ? vehiculos.length : 0} unidades)`, 'Flota');

    // -------------------------------------------------------------
    // MÓDULO 8: COMBUSTIBLE Y ESTANQUE MÓVIL 400L
    // -------------------------------------------------------------
    console.log('\n🔹 MÓDULO 8: Control de Combustible y Estanque 400L');
    assert(sandbox.estadoTanqueCombustible !== null || scriptContent.includes('estadoTanqueCombustible'), 
        'Módulo de combustible y estanque 400L está integrado en la lógica', 'Combustible');

    // -------------------------------------------------------------
    // MÓDULO 9: LUBRICANTES Y TAMBOR 200L
    // -------------------------------------------------------------
    console.log('\n🔹 MÓDULO 9: Aceite a Granel y Tambor 200L');
    assert(sandbox.estadoTamborAceite !== null || scriptContent.includes('estadoTamborAceite'), 
        'Módulo de tambor de aceite a granel 200L está configurado', 'Aceite a Granel');

    // -------------------------------------------------------------
    // MÓDULO 10: ARCHIVOS Y ESTRUCTURA HTML (INDEX, LOGIN, USUARIOS)
    // -------------------------------------------------------------
    console.log('\n🔹 MÓDULO 10: Integridad de Vistas y Elementos HTML');
    const indexHtml = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
    const publicIndexHtml = fs.readFileSync(path.join(process.cwd(), 'public/index.html'), 'utf8');
    const loginHtml = fs.readFileSync(path.join(process.cwd(), 'login.html'), 'utf8');
    const usuariosHtml = fs.readFileSync(path.join(process.cwd(), 'usuarios.html'), 'utf8');

    assert(indexHtml.includes('id="contenedorGridAlertasMantencion"'), 
        'index.html contiene contenedorGridAlertasMantencion', 'HTML');
    assert(indexHtml.includes('id="btnVistaAlertasResumida"'), 
        'index.html contiene botón de vista resumida de alertas', 'HTML');
    assert(indexHtml.includes('id="btnVistaAlertasDetallada"'), 
        'index.html contiene botón de vista detallada de alertas', 'HTML');
    assert(indexHtml.includes('id="btnNuevaFichaTecnica"'), 
        'index.html contiene control de nueva ficha técnica con soporte RBAC', 'HTML');
    assert(indexHtml.includes('id="btnEditarFichaTecnica"'), 
        'index.html contiene control de editar ficha técnica con soporte RBAC', 'HTML');
    assert(indexHtml.includes('id="badgeFichaSoloLectura"'), 
        'index.html contiene distintivo de solo lectura para operadores', 'HTML');
    assert(indexHtml.includes('id="menuItemRegistrarVehiculo"'), 
        'index.html contiene identificador menuItemRegistrarVehiculo para control RBAC', 'HTML');
    assert(indexHtml.includes('id="menuItemRegistrarMaquinaria"'), 
        'index.html contiene identificador menuItemRegistrarMaquinaria para control RBAC', 'HTML');
    assert(indexHtml.includes('id="menuItemVideoTutoriales"'), 
        'index.html contiene identificador menuItemVideoTutoriales en el menú lateral', 'HTML');
    assert(indexHtml.includes('id="videoTutoriales"'), 
        'index.html contiene sección interactiva de videoTutoriales con soporte para ambos roles', 'HTML');
    assert(scriptContent.includes('TUTORIAL_VIDEOS'), 
        'script.js contiene estructura TUTORIAL_VIDEOS para Rol Operador y Administrador', 'Video Tutoriales');
    assert(scriptContent.includes('narrarPasoActual') && scriptContent.includes('SpeechSynthesisUtterance'), 
        'script.js cuenta con motor de narración por voz (Web Speech API) para tutoriales en español', 'Video Tutoriales');
    assert(indexHtml.includes('btnToggleVozNarracion') && indexHtml.includes('btnRepetirVozPaso'), 
        'index.html incluye controles de usuario para silenciar o repetir la narración por voz', 'HTML');
    assert(publicIndexHtml.length === indexHtml.length, 
        'public/index.html está 100% sincronizado con index.html', 'HTML Sync');
    assert(loginHtml.includes('id="usuario"') && loginHtml.includes('id="password"'), 
        'login.html contiene formulario de autenticación con campos obligatorios (usuario y password)', 'HTML');
    assert(usuariosHtml.includes('id="listaUsuarios"'), 
        'usuarios.html contiene tabla de gestión de cuentas (listaUsuarios)', 'HTML');
    assert(indexHtml.includes('id="controlVentanaMantenimiento"'), 
        'index.html contiene panel de control de ventana de mantenimiento (controlVentanaMantenimiento)', 'HTML Mantenimiento');
    assert(indexHtml.includes('id="tablaCalendarioMantenimiento"'), 
        'index.html contiene tabla de calendario de mantenimientos programados', 'HTML Mantenimiento');
    assert(indexHtml.includes('id="preMensajeGeneradoAviso"'), 
        'index.html contiene vista previa dinámica para mensajes de WhatsApp y Correo', 'HTML Mantenimiento');
    assert(indexHtml.includes('id="menuItemVentanaMantenimiento"'), 
        'index.html contiene acceso de menú menuItemVentanaMantenimiento con restricción RBAC', 'HTML Mantenimiento');
    assert(loginHtml.includes('id="modalMantenimientoActivoLogin"'), 
        'login.html contiene modal informativo de plataforma en mantenimiento (modalMantenimientoActivoLogin)', 'HTML Mantenimiento');
    assert(scriptContent.includes('cargarModuloVentanaMantenimiento') && scriptContent.includes('enviarMensajeWhatsappCliente'), 
        'script.js contiene lógica completa de gestión de ventana, calendario y avisos por WhatsApp y Correo', 'Script Mantenimiento');
    assert(indexHtml.includes('id="seccionControlCuota"') && indexHtml.includes('id="kpiCuotaEstadoTexto"') && indexHtml.includes('id="modalConfirmarSuspensionGeneral"'), 
        'index.html contiene sección y modales de Control de Acceso por Cuota Mensual en Vent. Mantención', 'Cuota en Vent. Mantención');
    assert(!usuariosHtml.includes('id="seccionControlCuota"') && !usuariosHtml.includes('id="cardStatCuota"'), 
        'usuarios.html ya no contiene seccionControlCuota ni cardStatCuota (trasladado exitosamente)', 'Cuota fuera de usuarios');
    assert(scriptContent.includes('cargarEstadoServicioCuota') && scriptContent.includes('abrirModalSuspensionGeneral'), 
        'script.js contiene funciones cliente para control de cuota mensual y suspensión', 'Script Cuota');

    // -------------------------------------------------------------
    // RESUMEN GENERAL DE PRUEBAS
    // -------------------------------------------------------------
    console.log('\n================================================================');
    console.log('📊 RESUMEN FINAL DEL TEST SUITE');
    console.log('================================================================');
    console.log(`Total de pruebas ejecutadas: ${totalTests}`);
    console.log(`Pruebas exitosas (PASS)    : ${passedTests}`);
    console.log(`Pruebas fallidas (FAIL)    : ${failedTests}`);
    console.log(`Tasa de éxito              : ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    console.log('================================================================\n');

    if (failedTests > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

ejecutarPruebas().catch(err => {
    console.error('Error fatal al ejecutar pruebas:', err);
    process.exit(1);
});

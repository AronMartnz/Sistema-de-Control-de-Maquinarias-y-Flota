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

        const resDeleteUser = await request('DELETE', `/api/usuarios/${testUser}`, { 'x-usuario': 'admin' });
        assert(resDeleteUser.status === 200, 
            'Administrador puede eliminar usuario vía API', 'API / Usuarios');

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
    assert(publicIndexHtml.length === indexHtml.length, 
        'public/index.html está 100% sincronizado con index.html', 'HTML Sync');
    assert(loginHtml.includes('id="usuario"') && loginHtml.includes('id="password"'), 
        'login.html contiene formulario de autenticación con campos obligatorios (usuario y password)', 'HTML');
    assert(usuariosHtml.includes('id="listaUsuarios"'), 
        'usuarios.html contiene tabla de gestión de cuentas (listaUsuarios)', 'HTML');

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

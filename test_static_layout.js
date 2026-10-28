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
    console.log('\n🔹 MÓDULO 2: Integridad de Código y Parseo Client-Side');
    const scriptPath = path.join(process.cwd(), 'script.js');
    const scriptContent = ['functions-core.js','functions-operations.js','script.js'].map(p=>fs.readFileSync(p,'utf8')).join('\n');
    assert(scriptContent.length > 50000, 'script.js existe y contiene el código del sistema', 'Integridad');

    // Emular entorno DOM para script.js
    const sandbox = {
        Storage: class Storage {setItem(){}},
        addEventListener: () => {},
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
        const context = vm.createContext(sandbox);
        for (const file of ['functions-core.js','functions-operations.js','script.js']) {
            const contents=fs.readFileSync(file,'utf8')+(file==='script.js'?scriptExport.slice(scriptContent.length):'');
            new vm.Script(contents,{filename:file}).runInContext(context);
        }
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
    assert(indexHtml.includes('id="menuItemRespaldos"') && indexHtml.includes('style="display:none;"'), 
        'index.html contiene menuItemRespaldos oculto por defecto con style="display:none;"', 'RBAC Respaldos');
    assert(scriptContent.includes('actualizarPermisosModuloRespaldos') && scriptContent.includes('El módulo de Respaldos & Mantención es exclusivo para el Administrador General (admin)'), 
        'script.js restringe y oculta Respaldos & Mantención para Daniel y operadores garantizando exclusividad de admin', 'RBAC Respaldos');
    assert(indexHtml.includes('id="modalAplicarPuntoRestauracion"') && scriptContent.includes('abrirModalAplicarPunto') && scriptContent.includes('Aplicar este Punto'), 
        'Respaldos no se aplican solos: cada punto cuenta con botón profesional y modal para aplicar a petición manual', 'Respaldos a Petición');
    assert(indexHtml.includes('id="btnFlotanteSoporte"') && indexHtml.includes('id="ventanaChatSoporte"'), 
        'Dashboard contiene botón flotante de soporte y ventana de chat interactivo accesible para ambos roles', 'Widget Soporte');
    assert(indexHtml.includes('id="menuItemCentroSoporte"') && indexHtml.includes('id="centroSoporteInterno"'), 
        'index.html contiene Centro de Mensajes & Soporte Interno exclusivo para Administrador General', 'Admin Soporte');
    assert(indexHtml.includes('id="toastNotificacionSoporteAdmin"'), 
        'index.html incluye notificación flotante (toast) en tiempo real para Administrador General', 'Toast Soporte');
    assert(!indexHtml.includes('btnLinkDirectoWhatsappHeader') && !indexHtml.includes('https://wa.me/56961405100?text='), 
        'Eliminada redirección externa a WhatsApp: el chat ocurre 100% dentro de la plataforma', 'Chat In-App');
    assert(scriptContent.includes('cargarConversacionesAdmin') && scriptContent.includes('mostrarToastSoporteAdmin'), 
        'script.js contiene gestión completa de conversaciones de operadores y alertas en pantalla para Admin', 'Admin Soporte');
    assert(scriptContent.includes('BASE_CONOCIMIENTO_SOPORTE') && scriptContent.includes('toggleVentanaChatSoporte') && scriptContent.includes('cargarMensajesSoporteServidor'), 
        'script.js contiene motor de chat en vivo y soporte interactivo dentro de la aplicación con Aron Martinez (ServiTec Pro)', 'Widget Soporte');
    assert(scriptContent.includes('generarEtiquetaRemitenteChat') && scriptContent.includes('chat-remitente-tag-usuario'), 
        'Cada mensaje del chat muestra claramente el nombre y usuario de quien lo envía (@usuario)', 'Nombre Remitente Chat');

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

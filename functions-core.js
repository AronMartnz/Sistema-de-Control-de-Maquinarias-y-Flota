function cargarTodo() {
    try {
        const progGuardado = localStorage.getItem("corssen_programa_v2");
        corssenPrograma = progGuardado ? JSON.parse(progGuardado) : [...DATOS_MAESTROS_CORSSEN];

        const stockGuardado = localStorage.getItem("corssen_stock_v2");
        corssenStock = stockGuardado ? JSON.parse(stockGuardado) : [...DATOS_STOCK_CORSSEN];
        // Asegurar que el tambor de 200L/208L no esté en corssenStock general
        corssenStock = corssenStock.filter(item => !(
            (item.medida && (item.medida.includes("TAMBOR") || item.medida.includes("200") || item.medida.includes("208"))) ||
            (item.detalle && item.detalle.toLowerCase().includes("tambor"))
        ));

        const fichasGuardadas = localStorage.getItem("corssen_fichas_v2");
        corssenFichas = fichasGuardadas ? JSON.parse(fichasGuardadas) : JSON.parse(JSON.stringify(FICHAS_EQUIPOS_CORSSEN));

        const vehiculosGuardados = JSON.parse(localStorage.getItem("flota_vehiculos_v3") || "null");
        if (vehiculosGuardados !== null && Array.isArray(vehiculosGuardados)) {
            vehiculos = vehiculosGuardados;
        } else {
            vehiculos = [...DATOS_VEHICULOS_DEFAULT];
        }

        const maquinariasGuardadas = JSON.parse(localStorage.getItem("flota_maquinarias_v3") || "null");
        if (maquinariasGuardadas !== null && Array.isArray(maquinariasGuardadas)) {
            maquinarias = maquinariasGuardadas;
        } else {
            maquinarias = [...DATOS_MAQUINARIAS_DEFAULT];
        }

        const cargasGuardadas = JSON.parse(localStorage.getItem("flota_cargas") || "null");
        if (cargasGuardadas !== null && Array.isArray(cargasGuardadas)) {
            cargas = cargasGuardadas;
        } else {
            cargas = JSON.parse(JSON.stringify(DATOS_CARGAS_DEFAULT));
        }
        
        const mantGuardadas = JSON.parse(localStorage.getItem("flota_mantenciones_v3") || "null");
        if (mantGuardadas !== null && Array.isArray(mantGuardadas)) {
            mantenciones = mantGuardadas;
        } else {
            mantenciones = JSON.parse(JSON.stringify(DATOS_MANTENCIONES_DEFAULT));
        }

        const invGuardado = JSON.parse(localStorage.getItem("flota_inventario_v3") || "null");
        if (invGuardado !== null && Array.isArray(invGuardado)) {
            inventario = invGuardado;
        } else {
            inventario = JSON.parse(JSON.stringify(DATOS_INVENTARIO_DEFAULT));
        }

        // Cargar estado especializado de los 2 Tambores de Aceite (200L c/u)
        const tamboresGuardados = localStorage.getItem("corssen_tambores_aceite_v2");
        if (tamboresGuardados) {
            try {
                estadoTamboresAceite = JSON.parse(tamboresGuardados);
            } catch (e) {
                console.error("Error al parsear estadoTamboresAceite:", e);
            }
        } else {
            // Migración desde v1
            const tamborGuardado = localStorage.getItem("corssen_tambor_aceite_v1");
            if (tamborGuardado) {
                try {
                    const parsedV1 = JSON.parse(tamborGuardado);
                    if (parsedV1 && parsedV1.nombre) {
                        estadoTamboresAceite.tambor1 = { ...estadoTamboresAceite.tambor1, ...parsedV1 };
                    }
                } catch (e) {
                    console.error("Error al migrar estadoTamborAceite:", e);
                }
            }
        }
        if (!estadoTamboresAceite.tambor1) {
            estadoTamboresAceite.tambor1 = {
                id: "tambor1",
                nombre: "Aceite Valvoline Premium Blue 15W40 CI-4",
                tipo: "Aceite de Motor (15W-40)",
                capacidad: 200,
                actual: 200,
                costoTotal: 550000,
                costoPorLitro: 2750,
                proveedor: "LUVAL S.A.",
                factura: "FAC-84920",
                fechaApertura: "2026-03-01",
                estado: "Activo"
            };
        }
        if (!estadoTamboresAceite.tambor2) {
            estadoTamboresAceite.tambor2 = {
                id: "tambor2",
                nombre: "Aceite Hidráulico Valvoline Unitrac 10W30 / ISO 68",
                tipo: "Aceite Hidráulico (10W-30)",
                capacidad: 200,
                actual: 200,
                costoTotal: 520000,
                costoPorLitro: 2600,
                proveedor: "LUVAL S.A.",
                factura: "FAC-84925",
                fechaApertura: "2026-03-01",
                estado: "Activo"
            };
        }
        estadoTamborAceite = estadoTamboresAceite.tambor1;

        const histAceiteGuardado = JSON.parse(localStorage.getItem("corssen_historial_aceite_v1") || "null");
        if (histAceiteGuardado !== null && Array.isArray(histAceiteGuardado)) {
            historialConsumoAceite = histAceiteGuardado;
        } else {
            historialConsumoAceite = JSON.parse(JSON.stringify(DATOS_HISTORIAL_ACEITE_DEFAULT));
        }

        // Cargar estado especializado del Estanque de Combustible Diésel (400L)
        const tanqueGuardado = localStorage.getItem("corssen_tanque_combustible_v1");
        if (tanqueGuardado) {
            try {
                estadoTanqueCombustible = JSON.parse(tanqueGuardado);
            } catch (e) {
                console.error("Error al parsear estadoTanqueCombustible:", e);
            }
        }

        const histRecargasGuardado = JSON.parse(localStorage.getItem("corssen_historial_recargas_comb_v1") || "null");
        if (histRecargasGuardado !== null && Array.isArray(histRecargasGuardado)) {
            historialRecargasCombustible = histRecargasGuardado;
        } else {
            historialRecargasCombustible = JSON.parse(JSON.stringify(DATOS_RECARGAS_COMB_DEFAULT));
        }

        // Preserve measured balances. Missing dispatch history never implies a full tank.
        if (estadoTanqueCombustible.actual === undefined) {
            estadoTanqueCombustible.actual = 0;
        }

        // Auto-reconciliación: Asegurar que toda maquinaria y vehículo registrado figure en corssenPrograma
        if (Array.isArray(maquinarias)) {
            maquinarias.forEach(m => {
                const cod = (m.numeroMaquinaria || m.id || "").toUpperCase();
                if (!cod) return;
                const existe = corssenPrograma.find(p => (p.cod || "").toUpperCase() === cod);
                if (!existe) {
                    const tipoMin = (m.tipoMaquinaria || "").toLowerCase();
                    let cat = "GRÚAS";
                    if (tipoMin.includes("portacontenedor")) cat = "PORTACONTENEDORES";
                    else if (tipoMin.includes("horquilla")) cat = "HORQUILLAS";
                    else if (tipoMin.includes("telescópica") || tipoMin.includes("telescopica")) cat = "GRÚAS";
                    else if (tipoMin.includes("auxiliar") || tipoMin.includes("generador")) cat = "AUXILIARES";
                    else if (tipoMin.includes("marítimo") || tipoMin.includes("lancha")) cat = "MARÍTIMO";

                    corssenPrograma.push({
                        cod: cod,
                        equipo: `${(m.tipoMaquinaria || 'Maquinaria').toUpperCase()} ${(m.modeloMaquinaria || '').toUpperCase()}`,
                        marca: (m.marcaMaquinaria || 'CORSSEN').toUpperCase(),
                        cat: cat,
                        estado: m.estado || "Operativo",
                        prioridad: "Media",
                        horometro: `${m.horometro || 0} hrs`,
                        frecuencia: "250 horas",
                        prox: `${(m.horometro || 0) + 250} hrs`,
                        responsable: m.responsable || "Alexis Santos",
                        observaciones: ""
                    });
                }
            });
        }

        if (Array.isArray(vehiculos)) {
            vehiculos.forEach(v => {
                const cod = (v.codigo || v.id || v.patente || "").toUpperCase();
                if (!cod) return;
                const existe = corssenPrograma.find(p => (p.cod || "").toUpperCase() === cod || (p.equipo || "").toUpperCase().includes((v.patente || "---").toUpperCase()));
                if (!existe) {
                    corssenPrograma.push({
                        cod: cod,
                        equipo: `CAMIONETA ${(v.marca || '').toUpperCase()} ${(v.modelo || '').toUpperCase()} (${v.patente || cod})`,
                        marca: (v.marca || 'VEHÍCULO').toUpperCase(),
                        cat: "MÓVILES",
                        estado: v.estado || "Operativo",
                        prioridad: "Media",
                        horometro: `${(v.kilometraje || 0).toLocaleString('es-CL')} km`,
                        frecuencia: "10000 kilometros",
                        prox: `${((v.kilometraje || 0) + 10000).toLocaleString('es-CL')} km`,
                        responsable: v.responsable || "Alexis Santos",
                        observaciones: ""
                    });
                }
            });
        }

        // Sincronizar automáticamente cualquier ficha técnica existente con Flota Registrada
        if (typeof sincronizarFichasConFlotaRegistrada === "function") {
            sincronizarFichasConFlotaRegistrada();
        }

        guardarTodo();
    } catch (e) {
        console.error("Error al cargar datos:", e);
    }
}

function guardarTodo() {
    try {
        localStorage.setItem("corssen_programa_v2", JSON.stringify(corssenPrograma));
        localStorage.setItem("corssen_stock_v2", JSON.stringify(corssenStock));
        localStorage.setItem("corssen_fichas_v2", JSON.stringify(corssenFichas));
        localStorage.setItem("flota_vehiculos_v3", JSON.stringify(vehiculos));
        localStorage.setItem("flota_maquinarias_v3", JSON.stringify(maquinarias));
        localStorage.setItem("flota_cargas", JSON.stringify(cargas));
        localStorage.setItem("flota_mantenciones_v3", JSON.stringify(mantenciones));
        localStorage.setItem("flota_inventario_v3", JSON.stringify(inventario));
        localStorage.setItem("corssen_tambores_aceite_v2", JSON.stringify(estadoTamboresAceite));
        localStorage.setItem("corssen_tambor_aceite_v1", JSON.stringify(estadoTamboresAceite?.tambor1 || estadoTamborAceite));
        localStorage.setItem("corssen_historial_aceite_v1", JSON.stringify(historialConsumoAceite));
        localStorage.setItem("corssen_tanque_combustible_v1", JSON.stringify(estadoTanqueCombustible));
        localStorage.setItem("corssen_historial_recargas_comb_v1", JSON.stringify(historialRecargasCombustible));
        localStorage.setItem("corssen_ultima_modificacion_ts", String(Date.now()));

        // Disparar auto-backup silencioso a la nube y local con debounce de 800ms
        if (typeof window !== "undefined" && typeof window.ejecutarAutoBackupSistema === "function" && window.sincronizacionPreparada) {
            if (window._debounceAutoBackupTimeout) {
                clearTimeout(window._debounceAutoBackupTimeout);
            }
            window._debounceAutoBackupTimeout = setTimeout(() => {
                window.ejecutarAutoBackupSistema("Auto-respaldo tras modificación de datos", "AUTOMATICO", true);
            }, 800);
        }
    } catch (e) {
        console.error("Error al guardar datos:", e);
    }
}

function cambiarModoVistaAlertas(modo) {
    modoVistaAlertasDash = modo;
    const btnRes = document.getElementById("btnVistaAlertasResumida");
    const btnDet = document.getElementById("btnVistaAlertasDetallada");
    if (btnRes) btnRes.classList.toggle("active", modo === 'resumida');
    if (btnDet) btnDet.classList.toggle("active", modo === 'detallada');

    const grid = document.getElementById("contenedorGridAlertasMantencion");
    if (grid) {
        if (modo === 'resumida') {
            grid.classList.add("modo-resumido");
        } else {
            grid.classList.remove("modo-resumido");
        }
    }
    renderizarAlertasMantencionesDashboard();
}

function toggleMostrarTodasAlertasDash() {
    mostrarTodasAlertasDash = !mostrarTodasAlertasDash;
    renderizarAlertasMantencionesDashboard();
}

function filtrarAlertasMantencionDash(filtro, btn) {
    filtroAlertaMantencionDash = filtro;
    document.querySelectorAll('.btn-filtro-alerta-mant').forEach(b => {
        if (b.getAttribute('data-filtro') === filtro || b === btn) {
            b.classList.add('active');
        } else {
            b.classList.remove('active');
        }
    });
    const sel = document.getElementById("selectFiltroEstadoMantDash");
    if (sel && sel.value !== filtro) {
        sel.value = filtro;
    }
    renderizarAlertasMantencionesDashboard();
}

function cambiarFiltroEstadoDesdeSelector(valor) {
    filtroAlertaMantencionDash = valor;
    document.querySelectorAll('.btn-filtro-alerta-mant').forEach(b => {
        if (b.getAttribute('data-filtro') === valor) {
            b.classList.add('active');
        } else {
            b.classList.remove('active');
        }
    });
    const sel = document.getElementById("selectFiltroEstadoMantDash");
    if (sel && sel.value !== valor) {
        sel.value = valor;
    }
    renderizarAlertasMantencionesDashboard();
}

function extraerNumeroHorometro(str) {
    if (!str) return null;
    let s = String(str).trim();
    if (/taller|repara|fuera|arma|pend|revis|ubicar/i.test(s)) return null;
    const match = s.match(/[\d.,]+/);
    if (!match) return null;
    let numStr = match[0];
    if (numStr.includes(',') && numStr.includes('.')) {
        numStr = numStr.replace(/\./g, '').replace(',', '.');
    } else if (numStr.includes('.') && numStr.split('.').length > 1 && numStr.split('.')[1].length === 3) {
        numStr = numStr.replace(/\./g, '');
    } else if (numStr.includes(',')) {
        numStr = numStr.replace(',', '.');
    }
    const val = parseFloat(numStr);
    return isNaN(val) ? null : val;
}

function obtenerListaAlertasMantencion() {
    const lista = [];
    const fechaHoy = new Date();

    (corssenPrograma || []).forEach(item => {
        const cod = item.cod || '';
        const equipo = item.equipo || '';
        const marca = item.marca || '';
        const cat = item.cat || '';
        const estado = item.estado || '';
        const horoStr = (item.horometro || '').trim();
        const proxStr = (item.prox || '').trim();
        const freqStr = (item.frecuencia || '').trim();
        const responsable = item.responsable || 'No asignado';
        const observaciones = item.observaciones || '';

        const esKm = /km|kilometro/i.test(horoStr) || /km|kilometro/i.test(proxStr) || /km|kilometro/i.test(freqStr);
        const unidad = esKm ? 'km' : (/hrs|horas/i.test(horoStr) || /hrs|horas/i.test(proxStr) || /hrs|horas/i.test(freqStr) ? 'hrs' : '');

        const horoNum = extraerNumeroHorometro(horoStr);
        const proxNum = extraerNumeroHorometro(proxStr);

        const esTaller = /taller|reparaci|fuera|armado|falla|bloqueado|revisi/i.test(estado) || /taller|reparaci|fuera|armado|revisi|no operativo/i.test(proxStr);

        // Check if proxStr is a calendar date (e.g. 31-08-2026)
        const matchFecha = proxStr.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);

        let tipoAlerta = 'programada';
        let badge = 'PROGRAMADA';
        let badgeClase = 'badge-azul';
        let nivel = 'normal';
        let mensaje = '';
        let restanteTexto = '';
        let restanteNum = null;
        let porcentajeProgreso = 50;
        let icono = '📅';

        if (esTaller) {
            tipoAlerta = 'taller'; // Separar de vencida regular para permitir filtro específico de Taller
            badge = 'EN TALLER';
            badgeClase = 'badge-rojo';
            nivel = 'critica';
            icono = '🛠️';
            mensaje = observaciones || (proxStr.includes('taller') || proxStr.includes('reparaci') ? proxStr : 'Equipo fuera de servicio o en taller');
            restanteTexto = 'Detenido en taller / Reparación requerida';
            porcentajeProgreso = 100;
        } else if (matchFecha) {
            const d = parseInt(matchFecha[1], 10);
            const m = parseInt(matchFecha[2], 10) - 1;
            const y = parseInt(matchFecha[3], 10);
            const fechaMant = new Date(y, m, d);
            const diffDias = Math.ceil((fechaMant - fechaHoy) / (1000 * 60 * 60 * 24));
            restanteNum = diffDias;

            if (diffDias < 0) {
                tipoAlerta = 'vencida';
                badge = 'VENCIDA';
                badgeClase = 'badge-rojo';
                nivel = 'critica';
                icono = '🚨';
                mensaje = `Pauta de calendario vencida hace ${Math.abs(diffDias)} días (${proxStr})`;
                restanteTexto = `Vencida hace ${Math.abs(diffDias)} días`;
                porcentajeProgreso = 100;
            } else if (diffDias <= 15) {
                tipoAlerta = 'proxima';
                badge = 'PRÓXIMA';
                badgeClase = 'badge-naranja';
                nivel = 'advertencia';
                icono = '⚠️';
                mensaje = `Pauta de calendario vence en ${diffDias} días (${proxStr})`;
                restanteTexto = `Faltan ${diffDias} días para mantención`;
                porcentajeProgreso = 85;
            } else {
                tipoAlerta = 'programada';
                badge = 'PROGRAMADA';
                badgeClase = 'badge-azul';
                nivel = 'normal';
                icono = '📅';
                mensaje = `Programada para el ${proxStr} (${diffDias} días restantes)`;
                restanteTexto = `Faltan ${diffDias} días`;
                porcentajeProgreso = 40;
            }
        } else if (horoNum !== null && proxNum !== null) {
            const diff = proxNum - horoNum;
            restanteNum = diff;
            const freqNum = extraerNumeroHorometro(freqStr) || (esKm ? 10000 : 250);

            if (diff <= 0) {
                tipoAlerta = 'vencida';
                badge = 'VENCIDA';
                badgeClase = 'badge-rojo';
                nivel = 'critica';
                icono = '🚨';
                const sobre = Math.abs(Math.round(diff)).toLocaleString('es-CL');
                mensaje = `Servicio sobrepasado por ${sobre} ${unidad || 'unid.'}. Requiere ingreso inmediato.`;
                restanteTexto = `Sobrepasada por ${sobre} ${unidad || 'unid.'}`;
                porcentajeProgreso = 100;
            } else if ((esKm && diff <= 2500) || (!esKm && diff <= 100)) {
                tipoAlerta = 'proxima';
                badge = 'PRÓXIMA';
                badgeClase = 'badge-naranja';
                nivel = 'advertencia';
                icono = '⚠️';
                const faltan = Math.round(diff).toLocaleString('es-CL');
                mensaje = `Faltan solo ${faltan} ${unidad || 'unid.'} para cumplir ciclo de ${freqStr || (esKm ? '10.000 km' : '250 hrs')}.`;
                restanteTexto = `Faltan ${faltan} ${unidad || 'unid.'} para servicio`;
                porcentajeProgreso = Math.min(95, Math.max(75, Math.round(((freqNum - diff) / freqNum) * 100)));
            } else {
                tipoAlerta = 'programada';
                badge = 'PROGRAMADA';
                badgeClase = 'badge-azul';
                nivel = 'normal';
                icono = '📅';
                const faltan = Math.round(diff).toLocaleString('es-CL');
                mensaje = `Próximo servicio programado en ${faltan} ${unidad || 'unid.'}. Operatividad estable.`;
                restanteTexto = `Faltan ${faltan} ${unidad || 'unid.'}`;
                porcentajeProgreso = Math.min(70, Math.max(20, Math.round(((freqNum - diff) / freqNum) * 100)));
            }
        } else {
            if (observaciones && observaciones.trim().length > 0) {
                tipoAlerta = 'proxima';
                badge = 'OBSERVACIÓN';
                badgeClase = 'badge-naranja';
                nivel = 'advertencia';
                icono = '⚠️';
                mensaje = observaciones;
                restanteTexto = proxStr || 'Revisión periódica';
                porcentajeProgreso = 60;
            } else {
                tipoAlerta = 'programada';
                badge = 'AL DÍA';
                badgeClase = 'badge-verde';
                nivel = 'normal';
                icono = '✅';
                mensaje = `Control periódico vigente (${freqStr || 'Mensual'})`;
                restanteTexto = proxStr || 'En norma';
                porcentajeProgreso = 30;
            }
        }

        // Obtener insumos técnicos de la Ficha Técnica si existe
        let insumosInfo = '';
        const ficha = corssenFichas && corssenFichas[cod];
        if (ficha) {
            const primerAceite = ficha.aceites && ficha.aceites[0];
            const primerFiltro = ficha.filtros && ficha.filtros[0];
            const partes = [];
            if (primerAceite) partes.push(`🛢️ ${primerAceite.tipo}: ${primerAceite.modelo}`);
            if (primerFiltro) partes.push(`⚙️ Filtro: ${primerFiltro.elemento} (${primerFiltro.alt1 || primerFiltro.alt2 || ''})`);
            if (partes.length > 0) insumosInfo = partes.join(' • ');
        }

        lista.push({
            cod,
            equipo,
            marca,
            cat,
            estado,
            horoStr,
            proxStr,
            freqStr,
            unidad,
            tipoAlerta,
            badge,
            badgeClase,
            nivel,
            icono,
            mensaje,
            restanteTexto,
            restanteNum,
            porcentajeProgreso,
            insumosInfo,
            responsable,
            observaciones
        });
    });

    // Ordenar: primero 'vencida', luego 'proxima', luego 'taller', luego 'programada'
    const pesoAlerta = { 'vencida': 1, 'proxima': 2, 'taller': 3, 'programada': 4 };
    lista.sort((a, b) => {
        const pesoDiff = (pesoAlerta[a.tipoAlerta] || 5) - (pesoAlerta[b.tipoAlerta] || 5);
        if (pesoDiff !== 0) return pesoDiff;
        if (a.restanteNum !== null && b.restanteNum !== null) {
            return a.restanteNum - b.restanteNum;
        }
        return a.cod.localeCompare(b.cod);
    });

    return lista;
}

function renderizarAlertasMantencionesDashboard() {
    const contenedor = document.getElementById("contenedorGridAlertasMantencion");
    if (!contenedor) return;

    const listaCompleta = obtenerListaAlertasMantencion();

    // Conteo por categorías
    const totalTodas = listaCompleta.length;
    const totalProx = listaCompleta.filter(i => i.tipoAlerta === 'proxima').length;
    const totalTaller = listaCompleta.filter(i => i.tipoAlerta === 'taller' || i.badge === 'EN TALLER').length;
    const totalVenc = listaCompleta.filter(i => i.tipoAlerta === 'vencida' && i.badge !== 'EN TALLER').length;
    const totalProg = listaCompleta.filter(i => i.tipoAlerta === 'programada').length;
    const totalCriticas = totalProx + totalVenc + totalTaller;

    // Actualizar contadores en la UI
    const elDashProx = document.getElementById("dashMantencionesProximas");
    if (elDashProx) elDashProx.textContent = totalCriticas;

    const elBadgeHeader = document.getElementById("badgeTotalMantProximas");
    if (elBadgeHeader) elBadgeHeader.textContent = `${totalCriticas} unidades de atención`;

    const elContTodas = document.getElementById("contFiltroMantTodas");
    if (elContTodas) elContTodas.textContent = totalTodas;

    const elContProx = document.getElementById("contFiltroMantProx");
    if (elContProx) elContProx.textContent = totalProx;

    const elContTaller = document.getElementById("contFiltroMantTaller");
    if (elContTaller) elContTaller.textContent = totalTaller;

    const elContVenc = document.getElementById("contFiltroMantVenc");
    if (elContVenc) elContVenc.textContent = totalVenc;

    const elContProg = document.getElementById("contFiltroMantProg");
    if (elContProg) elContProg.textContent = totalProg;

    // Sincronizar selector dropdown si existe
    const selEstado = document.getElementById("selectFiltroEstadoMantDash");
    if (selEstado && selEstado.value !== (filtroAlertaMantencionDash || 'TODAS')) {
        selEstado.value = filtroAlertaMantencionDash || 'TODAS';
    }

    // Filtro de texto del buscador rápido
    const inputBuscar = document.getElementById("inputBuscarAlertaMant");
    const textoBuscar = (inputBuscar?.value || "").toLowerCase().trim();

    const filtradas = listaCompleta.filter(item => {
        // Filtro por pestaña o selector rápido
        if (filtroAlertaMantencionDash === 'PROXIMAS' && item.tipoAlerta !== 'proxima') return false;
        if (filtroAlertaMantencionDash === 'TALLER' && (item.tipoAlerta !== 'taller' && item.badge !== 'EN TALLER')) return false;
        if (filtroAlertaMantencionDash === 'VENCIDAS' && (item.tipoAlerta !== 'vencida' || item.badge === 'EN TALLER')) return false;
        if (filtroAlertaMantencionDash === 'PROGRAMADAS' && item.tipoAlerta !== 'programada') return false;

        // Filtro de texto
        if (textoBuscar) {
            const match = item.cod.toLowerCase().includes(textoBuscar) ||
                          item.equipo.toLowerCase().includes(textoBuscar) ||
                          item.marca.toLowerCase().includes(textoBuscar) ||
                          item.responsable.toLowerCase().includes(textoBuscar) ||
                          item.observaciones.toLowerCase().includes(textoBuscar) ||
                          item.cat.toLowerCase().includes(textoBuscar);
            if (!match) return false;
        }

        return true;
    });

    const elResumenTexto = document.getElementById("resumenAlertasMantTexto");

    const totalMostrables = filtradas.length;
    let itemsAMostrar = filtradas;
    const limiteResumido = 6;
    const hayMuchasAlertas = totalMostrables > limiteResumido;

    if (!mostrarTodasAlertasDash && hayMuchasAlertas) {
        itemsAMostrar = filtradas.slice(0, limiteResumido);
    }

    if (elResumenTexto) {
        if (!mostrarTodasAlertasDash && hayMuchasAlertas) {
            elResumenTexto.innerHTML = `Mostrando <strong>${itemsAMostrar.length} de ${totalMostrables}</strong> alertas (${totalCriticas} prioritarias)`;
        } else {
            elResumenTexto.innerHTML = `Mostrando <strong>${totalMostrables}</strong> alertas (${totalCriticas} prioritarias)`;
        }
    }

    const elContenedorBoton = document.getElementById("contenedorBotonExpandirAlertas");
    if (elContenedorBoton) {
        if (hayMuchasAlertas) {
            elContenedorBoton.innerHTML = `
                <button type="button" class="btn-secundario" onclick="toggleMostrarTodasAlertasDash()" style="font-size:12px; padding:6px 16px; border-radius:8px; font-weight:700; color:#0369a1; background:#f0f9ff; border:1.5px solid #bae6fd; cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition:all 0.2s ease;">
                    ${mostrarTodasAlertasDash ? `⬆️ Mostrar vista resumida (primeras ${limiteResumido} de ${totalMostrables} unidades)` : `⬇️ Ver todas las alertas (${totalMostrables} unidades en total)`}
                </button>
            `;
        } else {
            elContenedorBoton.innerHTML = "";
        }
    }

    if (filtradas.length === 0) {
        contenedor.innerHTML = `
            <div style="grid-column: 1 / -1; padding: 24px 20px; text-align: center; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px;">
                <div style="font-size: 30px; margin-bottom: 6px;">✅</div>
                <h4 style="margin: 0; color: #1e293b; font-size: 14px;">No hay alertas en esta categoría</h4>
                <p style="margin: 4px 0 0; color: #64748b; font-size: 12.5px;">Todas las unidades correspondientes se encuentran al día o no coinciden con la búsqueda.</p>
            </div>
        `;
        return;
    }

    if (modoVistaAlertasDash === 'resumida') {
        const esc = escapeHtmlSoporte;
        contenedor.innerHTML = `<div class="dashboard-tabla-alertas"><table><thead><tr><th>Equipo / unidad</th><th>Estado</th><th>Próximo servicio</th><th>Responsable</th><th>Acciones</th></tr></thead><tbody>${itemsAMostrar.map(item => `<tr><td><strong>${esc(item.cod)}</strong><small>${esc(item.equipo)}</small></td><td><span class="badge ${esc(item.badgeClase)}">${esc(item.badge)}</span></td><td><strong>${esc(item.restanteTexto)}</strong><small>Actual: ${esc(item.horoStr || 'N/A')} · Próximo: ${esc(item.proxStr || '-')}</small></td><td>${esc(item.responsable || 'Sin asignar')}</td><td><div class="dashboard-fila-acciones"><button class="btn-secundario" onclick="verFichaTecnica(${esc(JSON.stringify(item.cod))})">Ficha</button><button class="btn-primario" onclick="iniciarMantencionParaEquipo(${esc(JSON.stringify(item.cod))})">OT</button></div></td></tr>`).join('')}</tbody></table></div>`;
        return;
    }

    contenedor.innerHTML = itemsAMostrar.map(item => {
        let claseBorde = 'alerta-programada';
        let colorBarra = '#2563eb';
        if (item.tipoAlerta === 'vencida') {
            claseBorde = 'alerta-vencida';
            colorBarra = '#ef4444';
        } else if (item.tipoAlerta === 'taller' || item.badge === 'EN TALLER') {
            claseBorde = 'alerta-taller alerta-vencida';
            colorBarra = '#dc2626';
        } else if (item.tipoAlerta === 'proxima') {
            claseBorde = 'alerta-proxima';
            colorBarra = '#f59e0b';
        }

        // Modo detallado (vista extendida)
        return `
            <div class="tarjeta-alerta-mant ${claseBorde}">
                <div>
                    <div class="tarjeta-alerta-cabecera">
                        <div>
                            <span class="tarjeta-alerta-codigo">${item.cod}</span>
                            <span style="font-size: 11px; color: #64748b; margin-left: 6px; font-weight: 600;">${item.cat}</span>
                        </div>
                        <span class="badge ${item.badgeClase}" style="font-size: 10.5px; padding: 3px 8px;">
                            ${item.icono} ${item.badge}
                        </span>
                    </div>

                    <div class="tarjeta-alerta-nombre">${item.equipo}</div>
                    <div class="tarjeta-alerta-sub">${item.marca} • Frecuencia: <strong>${item.freqStr || 'Periódica'}</strong></div>

                    <div class="tarjeta-alerta-metricas">
                        <div class="tarjeta-alerta-fila-metrica">
                            <span style="color: #64748b;">Lectura Actual:</span>
                            <strong style="color: #0f172a;">${item.horoStr || 'N/A'}</strong>
                        </div>
                        <div class="tarjeta-alerta-fila-metrica">
                            <span style="color: #64748b;">Próximo Servicio:</span>
                            <strong style="color: ${colorBarra};">${item.proxStr || 'En revisión'}</strong>
                        </div>
                        <div class="tarjeta-alerta-fila-metrica" style="font-weight: 700; color: ${colorBarra}; border-top: 1px dashed #e2e8f0; padding-top: 4px; margin-top: 2px;">
                            <span>Estado / Margen:</span>
                            <span>${item.restanteTexto}</span>
                        </div>
                        <div class="tarjeta-alerta-barra-progreso" title="Progreso del ciclo de servicio">
                            <div class="tarjeta-alerta-barra-relleno" style="width: ${item.porcentajeProgreso}%; background: ${colorBarra};"></div>
                        </div>
                    </div>

                    ${item.insumosInfo ? `
                        <div class="tarjeta-alerta-insumos" title="Insumos técnicos según Ficha Técnica">
                            <span style="font-size: 12px;">🛢️</span>
                            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.insumosInfo}</span>
                        </div>
                    ` : ''}

                    <div style="font-size: 11.5px; color: #475569; margin-bottom: 8px; line-height: 1.35;">
                        <span style="color: #64748b;">Observación:</span> <strong>${item.mensaje}</strong>
                    </div>

                    <div style="font-size: 11px; color: #64748b; margin-bottom: 10px;">
                        👤 Responsable: <strong style="color: #334155;">${item.responsable}</strong>
                    </div>
                </div>

                <div class="tarjeta-alerta-acciones">
                    <button type="button" class="btn-alerta-accion-ot" onclick="iniciarMantencionParaEquipo('${item.cod}')" title="Emitir Orden de Trabajo para este equipo">
                        ⚡ Iniciar Mantención (OT)
                    </button>
                    <button type="button" class="btn-alerta-accion-ficha" onclick="verFichaTecnica('${item.cod}')" title="Ver equivalencias de filtros y lubricantes">
                        📄 Ficha
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

function renderizarCombustibleDashboard() {
    if (typeof estadoTanqueCombustible === 'undefined') return;
    const capacidad = Number(estadoTanqueCombustible.capacidad) > 0 ? Number(estadoTanqueCombustible.capacidad) : 400;
    const saldo = Math.max(0, Number(estadoTanqueCombustible.actual) || 0);
    const porcentaje = Math.min(100, saldo / capacidad * 100);
    const valores = {dashCapacidadCombustible:`Estanque de ${capacidad.toLocaleString('es-CL')} L`,dashLitrosCombustible:`${saldo.toLocaleString('es-CL')} L`,dashPorcentajeCombustible:`${porcentaje.toFixed(0)}% disponible`,dashEstadoCombustible:saldo === 0 ? 'Estanque vacío. Registra un abastecimiento.' : porcentaje <= 25 ? 'Nivel bajo. Planifica el próximo abastecimiento.' : 'Saldo disponible para despachos.'};
    for (const [id,valor] of Object.entries(valores)) {const el=document.getElementById(id);if(el)el.textContent=valor;}
    const barra = document.getElementById('dashBarraCombustible');
    if (barra) {barra.style.width=`${porcentaje}%`;barra.style.background=porcentaje <= 25 ? '#dc5962' : '#10b981';}
}

function renderizarDashboard() {
    const totalEquipos = corssenPrograma.length;
    const estados = corssenPrograma.map(e => String(e.estado || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase());
    const clasificar = estado => /no\s+operativ|fuera|taller|reparacion|en\s+mantencion/.test(estado) ? 'no' : /falla/.test(estado) ? 'falla' : /operativ[oa]/.test(estado) ? 'operativo' : 'sin';
    const categorias = estados.map(clasificar);
    const operativos = categorias.filter(e => e === 'operativo').length;
    const conFalla = categorias.filter(e => e === 'falla').length;
    const noOperativos = categorias.filter(e => e === 'no').length;
    const stockCritico = corssenStock.filter(i => Number(i.stock || 0) <= Number(i.stockMin ?? 1)).length;
    const estadoOperativo = document.getElementById('dashOperativosEstado');
    const sinClasificar = document.getElementById('dashSinClasificar');
    if (estadoOperativo) estadoOperativo.textContent = operativos;
    if (sinClasificar) sinClasificar.textContent = categorias.filter(e => e === 'sin').length;
    renderizarCombustibleDashboard();

    const elTotal = document.getElementById("dashTotalEquipos");
    const elOperativos = document.getElementById("dashOperativos");
    const elConFalla = document.getElementById("dashConFalla");
    const elNoOperativos = document.getElementById("dashNoOperativos");
    const elStockCritico = document.getElementById("dashStockCritico");

    if (elTotal) elTotal.textContent = totalEquipos;
    if (elOperativos) elOperativos.textContent = operativos;
    if (elConFalla) elConFalla.textContent = conFalla;
    if (elNoOperativos) elNoOperativos.textContent = noOperativos;
    if (elStockCritico) elStockCritico.textContent = stockCritico;

    // Renderizar Alertas de Mantenciones Próximas y Preventivas en Dashboard
    renderizarAlertasMantencionesDashboard();

    // Resumen de alertas recientes en Dashboard
    const tbodyAlertas = document.getElementById("tbodyAlertasDashboard");
    if (tbodyAlertas) {
        const esc = escapeHtmlSoporte;
        const pendientesCriticos = corssenPrograma.filter(e => e.observaciones && e.observaciones.trim().length > 0).slice(0, 6);
        tbodyAlertas.innerHTML = pendientesCriticos.map(item => `
            <tr>
                <td><strong>${esc(item.cod || "Sin código")}</strong></td>
                <td>${esc(item.equipo || "Sin denominación")} (${esc(item.marca || "Sin marca")})</td>
                <td><span class="badge ${obtenerClaseBadge(item.estado)}">${esc(item.estado || "Sin estado")}</span></td>
                <td><span class="badge ${item.prioridad === 'Alta' ? 'badge-rojo' : (item.prioridad === 'Media' ? 'badge-naranja' : 'badge-verde')}">${esc(item.prioridad || "Sin prioridad")}</span></td>
                <td>${esc(item.observaciones)}</td>
                <td>${esc(item.responsable || "Sin asignar")}</td>
            </tr>
        `).join("");
    }
}

function obtenerClaseBadge(estado) {
    const e = (estado || "").toLowerCase();
    if (e.includes("operativo") && !e.includes("no") && !e.includes("falla")) return "badge-verde";
    if (e.includes("falla")) return "badge-naranja";
    if (e.includes("no") || e.includes("fuera")) return "badge-rojo";
    return "badge-gris";
}

function renderizarProgramaMaestro() {
    const tbody = document.getElementById("tbodyProgramaMaestro");
    if (!tbody) return;

    const filtroTexto = (document.getElementById("inputBuscarPrograma")?.value || "").toLowerCase();

    const datosFiltrados = corssenPrograma.filter(item => {
        const coincideCat = (categoriaFiltroPrograma === "TODOS" || item.cat === categoriaFiltroPrograma);
        const coincideTxt = item.cod.toLowerCase().includes(filtroTexto) ||
                            item.equipo.toLowerCase().includes(filtroTexto) ||
                            item.marca.toLowerCase().includes(filtroTexto) ||
                            item.responsable.toLowerCase().includes(filtroTexto) ||
                            item.observaciones.toLowerCase().includes(filtroTexto);
        return coincideCat && coincideTxt;
    });

    tbody.innerHTML = datosFiltrados.map((item, idx) => `
        <tr>
            <td><strong>${item.cod}</strong></td>
            <td>
                <strong>${item.equipo}</strong>
                <div style="font-size:11px; color:#64748b;">${item.cat}</div>
            </td>
            <td>${item.marca}</td>
            <td><span class="badge ${obtenerClaseBadge(item.estado)}">${item.estado}</span></td>
            <td><span class="badge ${item.prioridad === 'Alta' ? 'badge-rojo' : (item.prioridad === 'Media' ? 'badge-naranja' : 'badge-verde')}">${item.prioridad}</span></td>
            <td>${item.horometro || '-'}</td>
            <td>${item.frecuencia || '-'}</td>
            <td><strong>${item.prox || '-'}</strong></td>
            <td>${item.responsable || '-'}</td>
            <td style="max-width:260px; font-size:12px;">${item.observaciones || '<span style="color:#94a3b8;">Sin observaciones</span>'}</td>
            <td style="text-align:center;">
                <div style="display:flex; gap:4px; justify-content:center; flex-wrap:wrap;">
                    <button class="btn-secundario" style="padding:4px 8px; font-size:11px;" onclick="verFichaTecnica('${item.cod}')" title="Ver ficha técnica">
                        🔍 Ficha
                    </button>
                    <button class="btn-primario" style="padding:4px 8px; font-size:11px;" onclick="iniciarMantencionParaEquipo('${item.cod}')" title="Crear Orden de Mantención y Rebajar Stock">
                        🔧 Mantención
                    </button>
                    <button class="btn-secundario" style="padding:4px 8px; font-size:11px; background:#eff6ff; border-color:#93c5fd; color:#1d4ed8; font-weight:700;" onclick="abrirModalEditarEquipoPrograma('${item.cod}')" title="Modificar parámetros de mantención">
                        ⚙️ Modificar
                    </button>
                    <button class="btn-peligro" style="padding:4px 8px; font-size:11px;" onclick="eliminarEquipoPrograma('${item.cod}')" title="Eliminar equipo del catálogo y programa">
                        🗑️ Eliminar
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}

function cambiarPestanaInventario(pestana) {
    pestanaInventarioActiva = pestana;
    
    // Sincronizar botones de pestañas
    document.querySelectorAll(".btn-pestana-inv, .btn-pestana-inventario").forEach(b => {
        const t = b.dataset.pestana || b.dataset.tab;
        b.classList.toggle("active", t === pestana);
    });

    const bloqueExistencias = document.getElementById("bloqueStockExistencias") || document.getElementById("bloqueInventarioExistencias");
    const bloqueKardex = document.getElementById("bloqueStockMovimientos") || document.getElementById("bloqueInventarioKardex");

    const bloqueMensual = document.getElementById("bloqueInventarioMensual");
    if (bloqueMensual) bloqueMensual.style.display = pestana === "MENSUAL" ? "block" : "none";
    if (pestana === "MENSUAL") {
        if (bloqueExistencias) bloqueExistencias.style.display = "none";
        if (bloqueKardex) bloqueKardex.style.display = "none";
        cargarHistorialMensualInventario();
    } else if (pestana === "EXISTENCIAS") {
        if (bloqueExistencias) bloqueExistencias.style.display = "block";
        if (bloqueKardex) bloqueKardex.style.display = "none";
        renderizarStockInsumos();
    } else {
        if (bloqueExistencias) bloqueExistencias.style.display = "none";
        if (bloqueKardex) bloqueKardex.style.display = "block";
        renderizarKardexMovimientos();
    }
}

function normalizarTextoBusqueda(str) {
    return (str || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function poblarSelectorEquiposCompatiblesStock() {
    const select = document.getElementById("selectEquipoCompatibleStock");
    if (!select) return;

    const valorPrevio = select.value || "TODOS";

    // Recolectar lista única de equipos combinando programa maestro, maquinarias, vehículos y fichas técnicas
    const mapaEquipos = new Map();

    const gruas = [];
    const moviles = [];
    const auxiliares = [];
    const maritimos = [];

    // 1. Equipos del Programa Maestro
    (corssenPrograma || []).forEach(p => {
        if (!p.cod) return;
        mapaEquipos.set(p.cod, {
            cod: p.cod,
            nombre: p.equipo || p.cod,
            marca: p.marca || "",
            cat: p.cat || "GENERAL"
        });
    });

    // 2. Fichas Técnicas Oficiales
    Object.keys(corssenFichas || {}).forEach(cod => {
        if (!mapaEquipos.has(cod)) {
            const f = corssenFichas[cod];
            mapaEquipos.set(cod, {
                cod: cod,
                nombre: f.nombre || cod,
                marca: f.marca || "",
                cat: cod.startsWith("GP") || cod.startsWith("GH") ? "GRÚAS" : "MÓVILES"
            });
        }
    });

    // 3. Maquinarias Registradas
    (maquinarias || []).forEach(m => {
        const cod = m.numeroMaquinaria || m.id;
        if (!cod) return;
        if (!mapaEquipos.has(cod)) {
            mapaEquipos.set(cod, {
                cod: cod,
                nombre: `${m.tipoMaquinaria || 'Maquinaria'} ${m.modeloMaquinaria || ''}`,
                marca: m.marcaMaquinaria || "",
                cat: "GRÚAS"
            });
        }
    });

    // 4. Vehículos y Camionetas
    (vehiculos || []).forEach(v => {
        const cod = v.codigo || (v.patente ? v.patente : "CAM");
        if (!cod) return;
        if (!mapaEquipos.has(cod)) {
            mapaEquipos.set(cod, {
                cod: cod,
                nombre: v.nombre || `Camioneta ${v.marca || ''} ${v.modelo || ''} (${v.patente || ''})`,
                marca: v.marca || "",
                cat: "MÓVILES"
            });
        }
    });

    // Clasificar en grupos
    mapaEquipos.forEach(eq => {
        const codUpper = eq.cod.toUpperCase();
        const catUpper = (eq.cat || "").toUpperCase();
        if (codUpper.startsWith("GP") || codUpper.startsWith("GH") || codUpper.startsWith("GT") || catUpper.includes("GRÚA") || catUpper.includes("GRUA") || catUpper.includes("PORTA")) {
            gruas.push(eq);
        } else if (codUpper.startsWith("CAM") || codUpper.startsWith("CMN") || catUpper.includes("MÓVIL") || catUpper.includes("MOVIL") || catUpper.includes("VEHÍC")) {
            moviles.push(eq);
        } else if (codUpper.startsWith("M") || catUpper.includes("MARÍTIM") || catUpper.includes("MARITIM")) {
            maritimos.push(eq);
        } else {
            auxiliares.push(eq);
        }
    });

    let html = `<option value="TODOS">🚜 Compatibilidad: Todos los Equipos</option>`;

    if (gruas.length > 0) {
        html += `<optgroup label="🏗️ Grúas Portacontenedores & Horquillas">`;
        gruas.forEach(g => {
            html += `<option value="${g.cod}">[${g.cod}] ${g.nombre} ${g.marca ? `(${g.marca})` : ''}</option>`;
        });
        html += `</optgroup>`;
    }

    if (moviles.length > 0) {
        html += `<optgroup label="🚚 Camionetas y Camiones">`;
        moviles.forEach(m => {
            html += `<option value="${m.cod}">[${m.cod}] ${m.nombre}</option>`;
        });
        html += `</optgroup>`;
    }

    if (auxiliares.length > 0) {
        html += `<optgroup label="⚡ Auxiliares & Equipos de Taller">`;
        auxiliares.forEach(a => {
            html += `<option value="${a.cod}">[${a.cod}] ${a.nombre}</option>`;
        });
        html += `</optgroup>`;
    }

    if (maritimos.length > 0) {
        html += `<optgroup label="⚓ Equipos y Embarcaciones Marítimas">`;
        maritimos.forEach(mar => {
            html += `<option value="${mar.cod}">[${mar.cod}] ${mar.nombre}</option>`;
        });
        html += `</optgroup>`;
    }

    select.innerHTML = html;
    if (valorPrevio && select.querySelector(`option[value="${valorPrevio}"]`)) {
        select.value = valorPrevio;
    }
}

function calcularCompatibilidadInsumo(item, codigoEquipo) {
    if (!codigoEquipo || codigoEquipo === "TODOS") {
        return { esCompatible: true, score: 1, motivo: "Catálogo General", coincidenciaExacta: false };
    }

    const cod = (codigoEquipo || "").toUpperCase().trim();
    const itemCompat = normalizarTextoBusqueda(item.compatible);
    const itemDetalle = normalizarTextoBusqueda(item.detalle);
    const itemModelo = normalizarTextoBusqueda(item.modelo);
    const itemMarca = normalizarTextoBusqueda(item.marca);
    const itemCat = normalizarTextoBusqueda(item.categoria);

    // 1. Cotejo directo por código de equipo en el campo compatible (ej. "GPC-01", "GPC-02", "GHO-01")
    if (itemCompat.includes(cod.toLowerCase())) {
        return { esCompatible: true, score: 12, motivo: `Compatible directo con ${cod}`, coincidenciaExacta: true };
    }

    // 2. Cotejo con Ficha Técnica Oficial CORSSEN
    const ficha = corssenFichas[cod];
    if (ficha) {
        const fichaNombre = normalizarTextoBusqueda(ficha.nombre);
        const fichaMarca = normalizarTextoBusqueda(ficha.marca);
        const fichaModelo = normalizarTextoBusqueda(ficha.modelo);

        // A) Filtros homologados (BD50000, LF 9001, BF1259, RS3870, etc.)
        if (ficha.filtros && Array.isArray(ficha.filtros)) {
            for (let f of ficha.filtros) {
                const elementosTexto = normalizarTextoBusqueda(`${f.elemento} ${f.alt1} ${f.alt2} ${f.alt3} ${f.alt4} ${f.codigoOEM}`);
                if (itemModelo && itemModelo.length >= 3 && elementosTexto.includes(itemModelo)) {
                    return { esCompatible: true, score: 15, motivo: `Filtro homologado en Ficha (${f.elemento || 'Motor'})`, coincidenciaExacta: true };
                }
                if (itemDetalle && itemDetalle.length >= 4 && elementosTexto.includes(itemDetalle)) {
                    return { esCompatible: true, score: 14, motivo: `Filtro requerido en Ficha Técnica`, coincidenciaExacta: true };
                }
            }
        }

        // B) Aceites y Lubricantes especificados
        if (ficha.aceites && Array.isArray(ficha.aceites)) {
            for (let a of ficha.aceites) {
                const aceiteModelo = normalizarTextoBusqueda(a.modelo); // "15w40", "10w30", "80w90", "dexron iii", "coolan"
                if (aceiteModelo && (itemModelo.includes(aceiteModelo) || itemDetalle.includes(aceiteModelo))) {
                    return { esCompatible: true, score: 8, motivo: `Lubricante especificado (${a.tipo})`, coincidenciaExacta: false };
                }
            }
        }

        // C) Coincidencia por Marca de la Ficha (ej. Taylor, Hyster, Liugong, Komatsu, Nissan)
        if (fichaMarca && (itemCompat.includes(fichaMarca) || itemModelo.includes(fichaMarca))) {
            return { esCompatible: true, score: 9, motivo: `Repuesto para línea ${ficha.marca}`, coincidenciaExacta: true };
        }
        if (fichaNombre && (itemCompat.includes(fichaNombre) || itemDetalle.includes(fichaNombre))) {
            return { esCompatible: true, score: 9, motivo: `Repuesto para ${ficha.nombre}`, coincidenciaExacta: true };
        }
    }

    // 3. Reglas de compatibilidad semántica por familias de equipos CORSSEN
    if (cod.startsWith("GPC-01") || cod === "GPC-01") {
        if (itemCompat.includes("taylor") || itemCompat.includes("porta taylor")) {
            return { esCompatible: true, score: 10, motivo: "Específico para Grúa Taylor", coincidenciaExacta: true };
        }
    }
    if (cod.startsWith("GPC-02") || cod === "GPC-02") {
        if (itemCompat.includes("hyster") || itemCompat.includes("porta hyster")) {
            return { esCompatible: true, score: 10, motivo: "Específico para Grúa Hyster", coincidenciaExacta: true };
        }
    }
    if (cod.startsWith("GHO-01") || cod.startsWith("GHO-03")) {
        if (itemCompat.includes("liugong") || itemCompat.includes("horquilla 4 ton") || itemCompat.includes("horquilla 3.5")) {
            return { esCompatible: true, score: 10, motivo: "Específico para Grúa Liugong", coincidenciaExacta: true };
        }
    }
    if (cod.startsWith("GHO-02")) {
        if (itemCompat.includes("komatsu") || itemCompat.includes("horquilla 7 ton") || itemCompat.includes("horquilla 7t")) {
            return { esCompatible: true, score: 10, motivo: "Específico para Grúa Komatsu 7T", coincidenciaExacta: true };
        }
    }
    if (cod.startsWith("GTE")) {
        if (itemCompat.includes("grove") || itemCompat.includes("telescopica") || itemCompat.includes("telescópica")) {
            return { esCompatible: true, score: 10, motivo: "Específico para Grúa Grove", coincidenciaExacta: true };
        }
    }
    if (cod.startsWith("CAM-01") || cod.startsWith("CAM-03")) {
        if (itemCompat.includes("nissan") || itemCompat.includes("np300") || itemCompat.includes("navara")) {
            return { esCompatible: true, score: 10, motivo: "Repuesto para Camioneta Nissan", coincidenciaExacta: true };
        }
    }
    if (cod.startsWith("CAM-02")) {
        if (itemCompat.includes("volkswagen") || itemCompat.includes("amarok")) {
            return { esCompatible: true, score: 10, motivo: "Repuesto para VW Amarok", coincidenciaExacta: true };
        }
    }
    if (cod.startsWith("CAM-04")) {
        if (itemCompat.includes("maxus") || itemCompat.includes("t60")) {
            return { esCompatible: true, score: 10, motivo: "Repuesto para Camioneta Maxus", coincidenciaExacta: true };
        }
    }
    if (cod === "XSL-02" || cod.startsWith("XSL")) {
        if (itemCompat.includes("lincoln") || itemCompat.includes("soldadora")) {
            return { esCompatible: true, score: 10, motivo: "Repuesto para Soldadora Lincoln", coincidenciaExacta: true };
        }
    }

    // 4. Insumos Universales y de Taller (Grasas, Zunchos, Aceites multipropósito, etc.)
    if (itemCompat.includes("todos los equipos") || itemCompat.includes("toda la flota") || itemCompat.includes("todas las maquinarias") || itemCompat.includes("universal") || itemCat === "zuncho" || itemCompat.includes("embalaje") || itemCat === "grasa") {
        return { esCompatible: true, score: 4, motivo: "Insumo de uso universal / flota", coincidenciaExacta: false };
    }

    return { esCompatible: false, score: 0, motivo: "No compatible", coincidenciaExacta: false };
}

function renderizarStockInsumos() {
    const tbody = document.getElementById("tbodyStockInsumos");
    if (!tbody) return;

    const filtroTexto = (document.getElementById("inputBuscarStock")?.value || "").toLowerCase().trim();
    const filtroCat = document.getElementById("selectCategoriaStock")?.value || "TODAS";
    const filtroEquipo = document.getElementById("selectEquipoCompatibleStock")?.value || "TODOS";
    const ordenarPor = document.getElementById("selectOrdenarStock")?.value || "DEFAULT";

    // 1. Calcular KPIs globales de bodega
    let valorTotalInventario = 0;
    let itemsCriticos = 0;
    corssenStock.forEach(item => {
        const stock = item.stock || 0;
        const costo = item.costo || 0;
        valorTotalInventario += (stock * costo);
        if (stock <= (item.stockMin ?? 1)) {
            itemsCriticos++;
        }
    });

    const periodoMes = mesInventarioActual();
    let totalGastosIngresos = 0;
    let totalConsumidoMantenciones = 0;
    (inventario || []).forEach(mov => {
        if (mesMovimientoInventario(mov) !== periodoMes || mov.tipo === "AJUSTE") return;
        const cant = Math.abs(Number(mov.cantidad ?? 1));
        const subtotal = Number(mov.costoTotal ?? ((mov.costoUnitario || 0) * cant));
        if (mov.tipo === "INGRESO" || Number(mov.cantidad) < 0) totalGastosIngresos += subtotal;
        else totalConsumidoMantenciones += subtotal;
    });
    actualizarEncabezadoMesInventario(periodoMes);

    const elKpiValor = document.getElementById("kpiStockValorTotal");
    const elKpiIngresos = document.getElementById("kpiStockTotalIngresos");
    const elKpiConsumido = document.getElementById("kpiStockTotalConsumido");
    const elKpiCriticos = document.getElementById("kpiStockCriticos");
    const elBadgeValor = document.getElementById("badgeTotalValorizacionStock");

    if (elKpiValor) elKpiValor.textContent = `$${valorTotalInventario.toLocaleString('es-CL')}`;
    if (elKpiIngresos) elKpiIngresos.textContent = `$${totalGastosIngresos.toLocaleString('es-CL')}`;
    if (elKpiConsumido) elKpiConsumido.textContent = `$${totalConsumidoMantenciones.toLocaleString('es-CL')}`;
    if (elKpiCriticos) elKpiCriticos.textContent = `${itemsCriticos}`;
    const aviso = document.getElementById("avisoStockCritico");
    if (aviso) aviso.textContent = `${itemsCriticos} artículos requieren reposición. Revisa las existencias y planifica tu próximo abastecimiento.`;
    if (elBadgeValor) elBadgeValor.textContent = `Valor Total: $${valorTotalInventario.toLocaleString('es-CL')}`;

    // 2. Filtrar por categoría, texto y compatibilidad de equipo
    let datosFiltrados = corssenStock.map((item, idxOriginal) => {
        const compat = calcularCompatibilidadInsumo(item, filtroEquipo);
        return {
            item,
            idxOriginal,
            compat
        };
    }).filter(({ item, compat }) => {
        const estado = document.getElementById("filtroEstadoStock")?.value || "TODOS";
        if (estado === "CRITICO" && Number(item.stock || 0) > Number(item.stockMin ?? 1)) return false;
        if (estado === "AGOTADO" && Number(item.stock || 0) !== 0) return false;
        // Filtro de Categoría
        if (filtroCat !== "TODAS") {
            const catItem = (item.categoria || "").toUpperCase();
            const fCat = filtroCat.toUpperCase();
            if (!catItem.includes(fCat)) return false;
        }

        // Filtro de Compatibilidad de Equipo
        if (filtroEquipo !== "TODOS") {
            if (!compat.esCompatible) return false;
        }

        // Filtro de Texto de búsqueda
        if (filtroTexto) {
            const matchTexto = (item.detalle || "").toLowerCase().includes(filtroTexto) ||
                               (item.marca || "").toLowerCase().includes(filtroTexto) ||
                               (item.modelo || "").toLowerCase().includes(filtroTexto) ||
                               (item.compatible || "").toLowerCase().includes(filtroTexto) ||
                               (item.proveedor || "").toLowerCase().includes(filtroTexto) ||
                               (item.categoria || "").toLowerCase().includes(filtroTexto) ||
                               (compat.motivo || "").toLowerCase().includes(filtroTexto);
            if (!matchTexto) return false;
        }

        return true;
    });

    // 3. Ordenamiento del catálogo
    if (ordenarPor === "COMPATIBILIDAD") {
        datosFiltrados.sort((a, b) => {
            if (b.compat.score !== a.compat.score) return b.compat.score - a.compat.score;
            return (b.item.stock || 0) - (a.item.stock || 0);
        });
    } else if (ordenarPor === "NOMBRE_ASC") {
        datosFiltrados.sort((a, b) => (a.item.detalle || "").localeCompare(b.item.detalle || ""));
    } else if (ordenarPor === "STOCK_ASC") {
        datosFiltrados.sort((a, b) => (a.item.stock || 0) - (b.item.stock || 0));
    } else if (ordenarPor === "STOCK_DESC") {
        datosFiltrados.sort((a, b) => (b.item.stock || 0) - (a.item.stock || 0));
    } else if (ordenarPor === "VALOR_DESC") {
        datosFiltrados.sort((a, b) => ((b.item.stock || 0) * (b.item.costo || 0)) - ((a.item.stock || 0) * (a.item.costo || 0)));
    } else if (ordenarPor === "COSTO_DESC") {
        datosFiltrados.sort((a, b) => (b.item.costo || 0) - (a.item.costo || 0));
    }

    // 4. Actualizar Banner de Filtro de Equipo Activo
    const bannerEquipo = document.getElementById("bannerFiltroEquipoActivo");
    const bannerTitulo = document.getElementById("bannerFiltroEquipoTitulo");
    const bannerSubtitulo = document.getElementById("bannerFiltroEquipoSubtitulo");
    const btnLimpiar = document.getElementById("btnLimpiarFiltrosStock");

    const hayFiltrosActivos = (filtroCat !== "TODAS") || (filtroEquipo !== "TODOS") || (filtroTexto !== "") || (ordenarPor !== "DEFAULT");
    if (btnLimpiar) {
        btnLimpiar.style.display = hayFiltrosActivos ? "inline-block" : "none";
    }

    if (filtroEquipo !== "TODOS") {
        const prog = (corssenPrograma || []).find(p => p.cod === filtroEquipo);
        const maq = (maquinarias || []).find(m => m.numeroMaquinaria === filtroEquipo);
        const veh = (vehiculos || []).find(v => v.codigo === filtroEquipo);
        const nomEquipo = prog ? `${prog.equipo} (${prog.marca})` : (maq ? `${maq.tipoMaquinaria} ${maq.marcaMaquinaria}` : (veh ? veh.nombre : filtroEquipo));

        if (bannerEquipo) {
            bannerEquipo.style.display = "flex";
            if (bannerTitulo) {
                bannerTitulo.innerHTML = `Mostrando insumos y repuestos compatibles con <strong>[${filtroEquipo}] ${nomEquipo}</strong>`;
            }
            if (bannerSubtitulo) {
                bannerSubtitulo.innerHTML = `Se identificaron <strong>${datosFiltrados.length} artículos</strong> compatibles en bodega (coincidencia en ficha técnica, filtros y especificación).`;
            }
        }
    } else {
        if (bannerEquipo) bannerEquipo.style.display = "none";
    }

    // Actualizar badge de total de artículos
    const badgeTotal = document.getElementById("badgeTotalItemsStock");
    if (badgeTotal) {
        if (filtroEquipo !== "TODOS" || filtroCat !== "TODAS" || filtroTexto) {
            badgeTotal.textContent = `${datosFiltrados.length} de ${corssenStock.length} Artículos`;
        } else {
            badgeTotal.textContent = `${corssenStock.length} Artículos en Catálogo`;
        }
    }

    if (datosFiltrados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="11" style="text-align:center; padding:36px; color:#64748b;">
                    <div style="font-size:32px; margin-bottom:8px;">🔍</div>
                    <strong>No se encontraron insumos o repuestos con los filtros seleccionados.</strong><br>
                    <span style="font-size:12px;">Prueba seleccionando otra categoría o restablece el filtro de equipo.</span><br>
                    <button class="btn-secundario" onclick="limpiarFiltrosStock()" style="margin-top:12px; font-size:12px;">Restablecer Filtros</button>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = datosFiltrados.map(({ item, idxOriginal, compat }) => {
        let badgeStock = "badge-verde";
        if (item.stock === 0) badgeStock = "badge-rojo";
        else if (item.stock <= (item.stockMin ?? 1)) badgeStock = "badge-naranja";

        const valorTotalLinea = (item.stock || 0) * (item.costo || 0);

        // Celda de compatibilidad enriquecida
        let compatHtml = `<span style="font-size:12px; color:#334155;">${item.compatible || '-'}</span>`;
        if (filtroEquipo !== "TODOS" && compat.esCompatible) {
            const badgeTipo = compat.coincidenciaExacta ? "badge-verde" : "badge-azul";
            compatHtml = `
                <div style="margin-bottom:3px;">
                    <span class="badge ${badgeTipo}" style="font-size:10.5px; font-weight:700;">✓ ${compat.motivo}</span>
                </div>
                <div style="font-size:11px; color:#64748b;">${item.compatible || '-'}</div>
            `;
        }

        return `
            <tr ${filtroEquipo !== "TODOS" && compat.coincidenciaExacta ? 'style="background:#f8fafc;"' : ''}>
                <td><button class="inventario-articulo" onclick="verDetalleInventario(${idxOriginal})"><img src="${imagenAutomaticaInsumo(item)}" alt="" width="48" height="48" loading="lazy"><span><strong>${textoSeguroInventario(item.detalle)}</strong><small>${textoSeguroInventario(item.marca)} · ${textoSeguroInventario(item.modelo)}</small></span></button></td>
                <td><span class="badge badge-azul">${item.categoria}</span></td>
                <td>${item.marca}</td>
                <td><code>${item.modelo}</code></td>
                <td>${item.medida}</td>
                <td><span class="badge ${badgeStock}">${item.stock} ${Number(item.stock) === 0 ? '(Agotado)' : item.stock <= (item.stockMin ?? 1) ? '(Crítico)' : ''}</span></td>
                <td>${item.proveedor || '-'}</td>
                <td style="min-width:180px;">${compatHtml}</td>
                <td><strong>$${(item.costo || 0).toLocaleString('es-CL')}</strong></td>
                <td><strong style="color:#059669;">$${valorTotalLinea.toLocaleString('es-CL')}</strong></td>
                <td>
                    <button class="btn-secundario inventario-ajuste" onclick="abrirAjusteInventario(${idxOriginal})">Ajustar stock</button>
                </td>
            </tr>
        `;
    }).join("");
}

function limpiarFiltrosStock() {
    const elTexto = document.getElementById("inputBuscarStock");
    const elCat = document.getElementById("selectCategoriaStock");
    const elEquipo = document.getElementById("selectEquipoCompatibleStock");
    const elOrden = document.getElementById("selectOrdenarStock");

    const estado = document.getElementById("filtroEstadoStock");
    if (estado) estado.value = "TODOS";
    if (elTexto) elTexto.value = "";
    if (elCat) elCat.value = "TODAS";
    if (elEquipo) elEquipo.value = "TODOS";
    if (elOrden) elOrden.value = "DEFAULT";

    renderizarStockInsumos();
}

function limpiarFiltroEquipoStock() {
    const elEquipo = document.getElementById("selectEquipoCompatibleStock");
    if (elEquipo) elEquipo.value = "TODOS";
    renderizarStockInsumos();
}

function filtrarStockPorEquipoDirecto(codEquipo) {
    navegarSeccion("controlStock");
    cambiarPestanaInventario("EXISTENCIAS");
    
    poblarSelectorEquiposCompatiblesStock();
    const elEquipo = document.getElementById("selectEquipoCompatibleStock");
    const elOrden = document.getElementById("selectOrdenarStock");
    if (elEquipo) elEquipo.value = codEquipo;
    if (elOrden) elOrden.value = "COMPATIBILIDAD";

    renderizarStockInsumos();
}

function ajustarStockInsumo(idx) {
    abrirAjusteInventario(idx);
}

function renderizarKardexMovimientos() {
    const tbody = document.getElementById("tbodyKardexMovimientos");
    if (!tbody) return;

    // Actualizar contador en pestaña
    const badgeKardex = document.getElementById("contKardexTotal");
    if (badgeKardex) {
        badgeKardex.textContent = inventario ? inventario.length : 0;
    }

    if (!inventario || inventario.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:24px; color:#64748b;">No hay movimientos de consumo o ingreso registrados aún.</td></tr>`;
        return;
    }

    tbody.innerHTML = inventario.map((mov) => {
        const esAjuste = mov.tipo === "AJUSTE";
        const esIngreso = (mov.tipo === "INGRESO" || (mov.cantidad && mov.cantidad < 0));
        const cantAbs = Math.abs(mov.cantidad || 1);
        const costoTotalMov = mov.costoTotal || ((mov.costoUnitario || 0) * cantAbs);
        return `
            <tr>
                <td><strong>${mov.fecha || '-'}</strong></td>
                <td><span class="badge ${esIngreso ? 'badge-verde' : 'badge-azul'}">${mov.folioOT || (esIngreso ? 'Ingreso Bodega' : 'OT General')}</span></td>
                <td><span class="badge ${esIngreso ? 'badge-verde' : 'badge-rojo'}">${esAjuste ? 'AJUSTE DE STOCK' : esIngreso ? '📥 INGRESO' : '🛠️ CONSUMO OT'}</span></td>
                <td><strong>${mov.codigoEquipo || '-'}</strong> ${mov.equipoNombre ? `<br><small style="color:#64748b;">${mov.equipoNombre}</small>` : ''}</td>
                <td><strong>${textoSeguroInventario(mov.insumoDetalle || '-')}${esAjuste ? `<small class="inventario-auditoria">${textoSeguroInventario(mov.motivo)} · ${mov.stockAnterior} → ${mov.stockRestante}<br>${textoSeguroInventario(mov.nota || '')}</small>` : ''}</strong></td>
                <td><strong>${esAjuste ? (mov.delta > 0 ? '+' : '−') : esIngreso ? '+' : '-'}${cantAbs} ${mov.medida || 'UN'}</strong></td>
                <td><span class="badge badge-gris">${mov.stockRestante !== undefined ? mov.stockRestante + ' Disp.' : '-'}</span></td>
                <td>$${(mov.costoUnitario || 0).toLocaleString('es-CL')}</td>
                <td><strong style="color:${esIngreso ? '#059669' : '#b91c1c'};">$${costoTotalMov.toLocaleString('es-CL')}</strong></td>
                <td>${mov.responsable || 'Alexis Santos'}</td>
            </tr>
        `;
    }).join("");
}

function abrirModalNuevoInsumo() {
    const form = document.getElementById("formNuevoInsumo");
    if (form) form.reset();
    const modal = document.getElementById("modalNuevoInsumo");
    if (modal) modal.style.display = "flex";
}

function cerrarModalNuevoInsumo() {
    const modal = document.getElementById("modalNuevoInsumo");
    if (modal) modal.style.display = "none";
}

function guardarNuevoInsumo(e) {
    if (e && e.preventDefault) e.preventDefault();

    const detalle = document.getElementById("inputNuevoInsumoDetalle")?.value.trim();
    const categoria = document.getElementById("selectNuevoInsumoCategoria")?.value || "GENERAL";
    const marca = document.getElementById("inputNuevoInsumoMarca")?.value.trim();
    const modelo = document.getElementById("inputNuevoInsumoModelo")?.value.trim();
    const medida = document.getElementById("selectNuevoInsumoMedida")?.value || "UNIDAD";
    const stockInicial = parseInt(document.getElementById("inputNuevoInsumoStockInicial")?.value) || 0;
    const stockMinimo = parseInt(document.getElementById("inputNuevoInsumoStockMinimo")?.value) || 2;
    const costo = parseFloat(document.getElementById("inputNuevoInsumoCosto")?.value) || 0;
    const proveedor = document.getElementById("inputNuevoInsumoProveedor")?.value.trim() || "PROVEEDOR GENERAL";
    const compatible = document.getElementById("inputNuevoInsumoCompatible")?.value.trim() || "Todos los equipos";

    if (!detalle || !marca || !modelo) {
        return alert("Por favor complete los campos obligatorios: Nombre, Marca y Modelo / Especificación.");
    }

    // Verificar si ya existe un insumo idéntico
    const existente = corssenStock.find(i => 
        i.modelo.toLowerCase() === modelo.toLowerCase() && 
        i.marca.toLowerCase() === marca.toLowerCase()
    );

    if (existente) {
        if (!confirm(`Ya existe un insumo registrado como "${existente.detalle} (${existente.marca} - ${existente.modelo})". ¿Desea registrar este nuevo ítem de todos modos?`)) {
            return;
        }
    }

    const nuevoItem = {
        detalle: detalle,
        categoria: categoria,
        marca: marca,
        modelo: modelo,
        medida: medida,
        stock: stockInicial,
        stockMin: stockMinimo,
        proveedor: proveedor,
        compatible: compatible,
        costo: costo
    };

    // Agregar al catálogo maestro
    corssenStock.unshift(nuevoItem);

    // Si tiene stock inicial mayor a 0, registrarlo en el kárdex como ingreso inicial
    if (stockInicial > 0) {
        const fechaActual = new Date().toISOString().split("T")[0];
        const responsable = sessionStorage.getItem("nombreUsuario") || "Alexis Santos";
        inventario.unshift({
            id: `ALTA-${Date.now()}`,
            tipo: "INGRESO",
            fecha: fechaActual,
            folioOT: "ALTA-CATALOGO",
            codigoEquipo: "BODEGA",
            equipoNombre: "Bodega Central CORSSEN",
            insumoDetalle: `${nuevoItem.detalle} (${nuevoItem.modelo})`,
            cantidad: -stockInicial,
            medida: nuevoItem.medida,
            costoUnitario: nuevoItem.costo,
            costoTotal: nuevoItem.costo * stockInicial,
            responsable: responsable,
            stockRestante: nuevoItem.stock
        });
    }

    guardarTodo();
    renderizarStockInsumos();
    renderizarKardexMovimientos();
    poblarSelectorIngresoStock();
    renderizarDashboard();
    cerrarModalNuevoInsumo();

    alert(`✓ NUEVO INSUMO REGISTRADO CON ÉXITO:\n"${nuevoItem.detalle}" (${nuevoItem.marca} - ${nuevoItem.modelo})\nIncorporado al catálogo de bodega con ${nuevoItem.stock} ${nuevoItem.medida} disponibles.`);
}

function abrirModalIngresoStock() {
    poblarSelectorIngresoStock();
    
    // Limpiar campos del formulario
    const inputCant = document.getElementById("inputIngresoCantidad");
    const inputProv = document.getElementById("inputIngresoProveedor");
    const inputCosto = document.getElementById("inputIngresoCostoUnitario") || document.getElementById("inputIngresoCostoUnit");
    
    if (inputCant) inputCant.value = "1";
    if (inputProv) inputProv.value = "";
    if (inputCosto) inputCosto.value = "";
    
    actualizarPlaceholderCostoIngreso();

    const modal = document.getElementById("modalIngresoStock");
    if (modal) {
        modal.style.display = "flex";
    }
}

function cerrarModalIngresoStock() {
    const modal = document.getElementById("modalIngresoStock");
    if (modal) modal.style.display = "none";
}

function actualizarPlaceholderCostoIngreso() {
    const select = document.getElementById("selectIngresoInsumoExistente") || document.getElementById("selectIngresoInsumo");
    const inputCosto = document.getElementById("inputIngresoCostoUnitario") || document.getElementById("inputIngresoCostoUnit");
    if (!select || !inputCosto) return;

    const idx = parseInt(select.value);
    if (!isNaN(idx) && corssenStock[idx]) {
        const item = corssenStock[idx];
        inputCosto.placeholder = `Actual: $${(item.costo || 0).toLocaleString('es-CL')} por ${item.medida}`;
    }
}

function poblarSelectorIngresoStock() {
    // Soportar tanto selectIngresoInsumoExistente como selectIngresoInsumo
    const selects = [
        document.getElementById("selectIngresoInsumoExistente"),
        document.getElementById("selectIngresoInsumo")
    ].filter(Boolean);

    if (selects.length === 0) return;

    // Agrupar insumos por categoría para mayor claridad
    const categorias = [...new Set(corssenStock.map(s => s.categoria))];

    let html = `<option value="">-- Seleccionar Insumo o Repuesto del Inventario --</option>`;

    categorias.forEach(cat => {
        html += `<optgroup label="📂 ${cat.toUpperCase()}">`;
        corssenStock.forEach((item, idx) => {
            if (item.categoria === cat) {
                html += `<option value="${idx}">
                    ${item.detalle} (${item.marca} - ${item.modelo}) • Stock actual: ${item.stock} ${item.medida} • Costo: $${(item.costo || 0).toLocaleString('es-CL')}
                </option>`;
            }
        });
        html += `</optgroup>`;
    });

    selects.forEach(select => {
        const valorPrevio = select.value;
        select.innerHTML = html;
        if (valorPrevio && select.querySelector(`option[value="${valorPrevio}"]`)) {
            select.value = valorPrevio;
        } else if (corssenStock.length > 0) {
            select.selectedIndex = 1; // Seleccionar el primer insumo real
        }

        select.onchange = actualizarPlaceholderCostoIngreso;
    });
}

function registrarIngresoMercaderia(e) {
    if (e && e.preventDefault) e.preventDefault();

    const select = document.getElementById("selectIngresoInsumoExistente") || document.getElementById("selectIngresoInsumo");
    const selectIdx = parseInt(select?.value);
    const cantidad = parseInt(document.getElementById("inputIngresoCantidad")?.value) || 0;
    const proveedorDoc = (document.getElementById("inputIngresoProveedor")?.value || document.getElementById("inputIngresoFactura")?.value || "").trim();
    const inputCosto = document.getElementById("inputIngresoCostoUnitario") || document.getElementById("inputIngresoCostoUnit");
    const costoIngresado = parseFloat(inputCosto?.value);
    const responsable = sessionStorage.getItem("nombreUsuario") || document.getElementById("inputIngresoResponsable")?.value.trim() || "Alexis Santos";

    if (isNaN(selectIdx) || !corssenStock[selectIdx]) {
        return alert("Por favor seleccione un insumo válido de la lista desplegable.");
    }
    if (cantidad <= 0) {
        return alert("Por favor ingrese una cantidad mayor a 0.");
    }

    const item = corssenStock[selectIdx];
    const costoUnit = (!isNaN(costoIngresado) && costoIngresado > 0) ? costoIngresado : (item.costo || 0);

    // Actualizar existencias y costo si fue modificado
    item.stock += cantidad;
    if (!isNaN(costoIngresado) && costoIngresado > 0) {
        item.costo = costoIngresado;
    }
    if (proveedorDoc && !proveedorDoc.startsWith("FAC-") && !proveedorDoc.startsWith("Guía")) {
        item.proveedor = proveedorDoc;
    }

    const costoTotal = costoUnit * cantidad;
    const fechaActual = new Date().toISOString().split("T")[0];

    // Registrar en Kárdex de Movimientos
    inventario.unshift({
        id: `ING-${Date.now()}`,
        tipo: "INGRESO",
        fecha: fechaActual,
        folioOT: proveedorDoc ? (proveedorDoc.toUpperCase().startsWith("FAC") || proveedorDoc.toUpperCase().startsWith("GUIA") ? proveedorDoc : `DOC-${proveedorDoc}`) : "Ingreso Directo Bodega",
        codigoEquipo: "BODEGA",
        equipoNombre: "Bodega Central CORSSEN",
        insumoDetalle: `${item.detalle} (${item.modelo})`,
        cantidad: -cantidad, // negativo para denotar entrada al stock
        medida: item.medida,
        costoUnitario: costoUnit,
        costoTotal: costoTotal,
        responsable: responsable,
        stockRestante: item.stock
    });

    guardarTodo();
    renderizarStockInsumos();
    renderizarKardexMovimientos();
    poblarSelectorIngresoStock();
    renderizarDashboard();
    cerrarModalIngresoStock();

    const form = document.getElementById("formIngresoMercaderia") || document.getElementById("formIngresoStock");
    if (form) form.reset();

    alert(`✓ INGRESO EXITOSO:\nSe abastecieron ${cantidad} ${item.medida} de "${item.detalle}".\nNuevo stock disponible: ${item.stock} ${item.medida}.\nMovimiento registrado en el Kárdex.`);
}

function esUsuarioAdministrador() {
    return (sessionStorage.getItem("rolUsuario") || "").toLowerCase().trim() === "admin";
}

function actualizarPermisosFichasTecnicas() {
    const esAdmin = esUsuarioAdministrador();
    const btnNueva = document.getElementById("btnNuevaFichaTecnica");
    const btnEditar = document.getElementById("btnEditarFichaTecnica");
    const badgeRestringido = document.getElementById("badgeFichaSoloLectura");
    const btnNuevoProg = document.getElementById("btnNuevoEquipoPrograma");

    if (btnNueva) {
        btnNueva.style.display = esAdmin ? "inline-flex" : "none";
    }
    if (btnEditar) {
        btnEditar.style.display = esAdmin ? "inline-flex" : "none";
    }
    if (badgeRestringido) {
        badgeRestringido.style.display = esAdmin ? "none" : "inline-flex";
    }
    if (btnNuevoProg) {
        btnNuevoProg.style.display = esAdmin ? "inline-flex" : "none";
    }
}

function actualizarPermisosFlotaRegistrada() {
    const esAdmin = esUsuarioAdministrador();
    const btnRegUnidad = document.getElementById("btnRegistrarUnidadFlota");
    const badgeSoloLectura = document.getElementById("badgeFlotaSoloLectura");
    const badgeAdmin = document.getElementById("badgeFlotaAdmin");

    // Elementos del menú lateral: Solo visibles para rol Administrador
    const menuItemVeh = document.getElementById("menuItemRegistrarVehiculo");
    const menuItemMaq = document.getElementById("menuItemRegistrarMaquinaria");

    if (menuItemVeh) {
        menuItemVeh.style.display = esAdmin ? "flex" : "none";
    }
    if (menuItemMaq) {
        menuItemMaq.style.display = esAdmin ? "flex" : "none";
    }

    // CONTROL ESTRICTO DE VISIBILIDAD: Módulo de Respaldos & Mantención y Ventana de Mantenimiento
    // Exclusivo para el usuario 'admin' (Administrador General). Oculto para Daniel y operadores.
    actualizarPermisosModuloRespaldos();

    if (btnRegUnidad) {
        btnRegUnidad.style.display = esAdmin ? "inline-flex" : "none";
    }
    if (badgeSoloLectura) {
        badgeSoloLectura.style.display = esAdmin ? "none" : "inline-flex";
    }
    if (badgeAdmin) {
        badgeAdmin.style.display = esAdmin ? "inline-flex" : "none";
    }
}

function actualizarPermisosModuloRespaldos() {
    const usuarioActual = (sessionStorage.getItem("usuarioLogueado") || "").toLowerCase().trim();
    // Exclusivo para el usuario 'admin' (Administrador General).
    // Oculto explícitamente para el usuario Daniel y para cualquier rol de operador u otro usuario.
    const esAdminGeneralExclusivo = (usuarioActual === "admin");

    const menuItemRespaldos = document.getElementById("menuItemRespaldos");
    if (menuItemRespaldos) {
        menuItemRespaldos.style.display = esAdminGeneralExclusivo ? "flex" : "none";
    }

    const menuItemMantenimiento = document.getElementById("menuItemVentanaMantenimiento");
    if (menuItemMantenimiento) {
        menuItemMantenimiento.style.display = esAdminGeneralExclusivo ? "flex" : "none";
    }

    const seccionRespaldos = document.getElementById("respaldosMantencion");
    if (seccionRespaldos) {
        if (!esAdminGeneralExclusivo) {
            seccionRespaldos.style.display = "none";
            seccionRespaldos.classList.remove("active");
        } else {
            seccionRespaldos.style.removeProperty("display");
        }
    }

    // Control de visibilidad del Centro de Mensajes & Soporte Interno (Solo Admin)
    const menuItemCentroSoporte = document.getElementById("menuItemCentroSoporte");
    if (menuItemCentroSoporte) {
        menuItemCentroSoporte.style.display = esAdminGeneralExclusivo ? "flex" : "none";
    }

    const seccionCentroSoporte = document.getElementById("centroSoporteInterno");
    if (seccionCentroSoporte) {
        if (!esAdminGeneralExclusivo) {
            seccionCentroSoporte.style.display = "none";
            seccionCentroSoporte.classList.remove("active");
        } else {
            seccionCentroSoporte.style.removeProperty("display");
        }
    }
}

function abrirModalEditarEquipoPrograma(cod) {
    if (!esUsuarioAdministrador()) {
        alert("⛔ Acceso Denegado: Esta función está reservada exclusivamente para el Rol de Administración.");
        return;
    }

    const item = corssenPrograma.find(p => String(p.cod).toUpperCase() === String(cod).toUpperCase());
    if (!item) {
        alert(`No se encontró el equipo con código ${cod}.`);
        return;
    }

    document.getElementById("lblEditProgCod").textContent = `${item.cod} - ${item.equipo}`;
    document.getElementById("editProgCod").value = item.cod;
    document.getElementById("editProgEquipo").value = item.equipo || "";
    document.getElementById("editProgMarca").value = item.marca || "";
    document.getElementById("editProgCat").value = item.cat || "AUXILIARES";
    document.getElementById("editProgEstado").value = item.estado || "Operativo";
    document.getElementById("editProgPrioridad").value = item.prioridad || "Media";
    document.getElementById("editProgHorometro").value = item.horometro || "";
    document.getElementById("editProgFrecuencia").value = item.frecuencia || "";
    document.getElementById("editProgProx").value = item.prox || "";
    document.getElementById("editProgResponsable").value = item.responsable || "";
    document.getElementById("editProgObservaciones").value = item.observaciones || "";

    const modal = document.getElementById("modalEditarEquipoPrograma");
    if (modal) {
        modal.style.display = "flex";
    }
}

function cerrarModalEditarEquipoPrograma() {
    const modal = document.getElementById("modalEditarEquipoPrograma");
    if (modal) {
        modal.style.display = "none";
    }
}

async function guardarEdicionEquipoPrograma() {
    if (!esUsuarioAdministrador()) {
        alert("⛔ Acceso Restringido: Únicamente los usuarios con rol de Administración tienen autorización para modificar parámetros de flota.");
        return;
    }

    const cod = document.getElementById("editProgCod").value.trim();
    const equipo = document.getElementById("editProgEquipo").value.trim();
    const marca = document.getElementById("editProgMarca").value.trim();
    const cat = document.getElementById("editProgCat").value;
    const estado = document.getElementById("editProgEstado").value;
    const prioridad = document.getElementById("editProgPrioridad").value;
    const horometro = document.getElementById("editProgHorometro").value.trim();
    const frecuencia = document.getElementById("editProgFrecuencia").value.trim();
    const prox = document.getElementById("editProgProx").value.trim();
    const responsable = document.getElementById("editProgResponsable").value.trim();
    const observaciones = document.getElementById("editProgObservaciones").value.trim();

    if (!cod || !equipo) {
        alert("El código y el nombre del equipo son obligatorios.");
        return;
    }

    const codUpper = String(cod).toUpperCase();
    const index = corssenPrograma.findIndex(p => String(p.cod).toUpperCase() === codUpper);
    const nuevoObj = {
        cod,
        equipo,
        marca,
        cat,
        estado,
        prioridad,
        horometro,
        frecuencia,
        prox,
        responsable,
        observaciones,
        actualizado_en: new Date().toISOString()
    };

    if (index !== -1) {
        corssenPrograma[index] = nuevoObj;
    } else {
        corssenPrograma.push(nuevoObj);
    }

    // 1. Sincronizar catálogo de Maquinarias Pesadas (Grúas, Horquillas, etc.)
    if (Array.isArray(maquinarias)) {
        const mIdx = maquinarias.findIndex(m => (m.numeroMaquinaria || m.id || "").toUpperCase() === codUpper);
        if (mIdx !== -1) {
            maquinarias[mIdx].estado = estado;
            if (horometro) {
                const hNum = parseFloat(String(horometro).replace(/[^0-9.]/g, '')) || maquinarias[mIdx].horometro;
                maquinarias[mIdx].horometro = hNum;
            }
            if (responsable) maquinarias[mIdx].responsable = responsable;
            if (marca) maquinarias[mIdx].marcaMaquinaria = marca;
        }
    }

    // 2. Sincronizar catálogo de Vehículos (Camionetas, Camiones, etc.)
    if (Array.isArray(vehiculos)) {
        const vIdx = vehiculos.findIndex(v => (v.codigo || v.id || v.patente || "").toUpperCase() === codUpper || (v.patente && v.patente.toUpperCase() === codUpper));
        if (vIdx !== -1) {
            vehiculos[vIdx].estado = estado;
            if (horometro) {
                const kmNum = parseFloat(String(horometro).replace(/[^0-9.]/g, '')) || vehiculos[vIdx].kilometraje;
                vehiculos[vIdx].kilometraje = kmNum;
            }
            if (responsable) vehiculos[vIdx].responsable = responsable;
            if (marca) vehiculos[vIdx].marca = marca;
        }
    }

    // 3. Sincronizar con ficha técnica si existe el equipo
    if (corssenFichas && corssenFichas[cod]) {
        corssenFichas[cod].nombre = equipo;
        corssenFichas[cod].marca = marca;
        corssenFichas[cod].estado = estado;
        corssenFichas[cod].horometro = horometro;
        corssenFichas[cod].prox = prox;
        corssenFichas[cod].responsable = responsable;
    }

    // 4. Persistir todo en almacenamiento local y registrar timestamp inmediato
    guardarTodo();
    const ahoraTs = Date.now();
    localStorage.setItem("corssen_ultima_modificacion_ts", String(ahoraTs));

    // 5. Persistir en servidor Express y base de datos Cloudflare
    try {
        const usuarioActual = sessionStorage.getItem("usuarioLogueado") || "admin";
        await fetch(`/api/programa/${encodeURIComponent(cod)}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-usuario": usuarioActual
            },
            body: JSON.stringify(nuevoObj)
        });

        // Si existe ficha, persistir también actualización en endpoint de fichas
        if (corssenFichas && corssenFichas[cod]) {
            fetch(`/api/fichas/${encodeURIComponent(cod)}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-usuario": usuarioActual
                },
                body: JSON.stringify(corssenFichas[cod])
            }).catch(e => console.warn("Sync ficha PUT diferido:", e));
        }
    } catch (errApi) {
        console.warn("Sincronización remota programa diferida:", errApi);
    }

    // 6. Generar auto-respaldo inmediato silencioso para actualizar snapshot en la nube/servidor
    try {
        if (typeof window !== "undefined" && typeof window.ejecutarAutoBackupSistema === "function" && window.sincronizacionPreparada) {
            await window.ejecutarAutoBackupSistema(`Actualización de equipo ${cod} en Programa Mantención`, "AUTOMATICO", true);
        }
    } catch (eSnap) {
        console.warn("Auto-backup tras actualizar equipo diferido:", eSnap);
    }

    alert(`✓ Datos de mantención actualizados con éxito para ${cod} (${equipo}).`);
    cerrarModalEditarEquipoPrograma();
    renderizarProgramaMaestro();
    renderizarFlotaRegistrada();
    renderizarDashboard();
}

async function sincronizarProgramaDesdeServidor() {
    try {
        const resp = await fetch("/api/programa?t=" + Date.now());
        if (!resp.ok) return false;
        const progRemoto = await resp.json();
        if (Array.isArray(progRemoto) && progRemoto.length > 0) {
            let huboCambios = false;
            progRemoto.forEach(remoto => {
                if (!remoto.cod) return;
                const codUpper = String(remoto.cod).toUpperCase();
                const idx = corssenPrograma.findIndex(p => String(p.cod).toUpperCase() === codUpper);
                if (idx !== -1) {
                    corssenPrograma[idx] = { ...corssenPrograma[idx], ...remoto };
                    huboCambios = true;
                } else {
                    corssenPrograma.push(remoto);
                    huboCambios = true;
                }
                // Sincronizar catálogo de Maquinarias
                if (Array.isArray(maquinarias)) {
                    const mIdx = maquinarias.findIndex(m => (m.numeroMaquinaria || m.id || "").toUpperCase() === codUpper);
                    if (mIdx !== -1 && remoto.estado) {
                        if (maquinarias[mIdx].estado !== remoto.estado) {
                            maquinarias[mIdx].estado = remoto.estado;
                            huboCambios = true;
                        }
                    }
                }
                // Sincronizar catálogo de Vehículos
                if (Array.isArray(vehiculos)) {
                    const vIdx = vehiculos.findIndex(v => (v.codigo || v.id || v.patente || "").toUpperCase() === codUpper || (v.patente && v.patente.toUpperCase() === codUpper));
                    if (vIdx !== -1 && remoto.estado) {
                        if (vehiculos[vIdx].estado !== remoto.estado) {
                            vehiculos[vIdx].estado = remoto.estado;
                            huboCambios = true;
                        }
                    }
                }
                // Sincronizar fichas técnicas
                if (corssenFichas && corssenFichas[remoto.cod] && remoto.estado) {
                    if (corssenFichas[remoto.cod].estado !== remoto.estado) {
                        corssenFichas[remoto.cod].estado = remoto.estado;
                        huboCambios = true;
                    }
                }
            });

            if (huboCambios) {
                localStorage.setItem("corssen_programa_v2", JSON.stringify(corssenPrograma));
                localStorage.setItem("flota_maquinarias_v3", JSON.stringify(maquinarias));
                localStorage.setItem("flota_vehiculos_v3", JSON.stringify(vehiculos));
                localStorage.setItem("corssen_fichas_v2", JSON.stringify(corssenFichas));
                renderizarProgramaMaestro();
                renderizarFlotaRegistrada();
                renderizarDashboard();
            }
            return true;
        }
    } catch (e) {
        console.warn("Sincronización remota programa diferida:", e);
    }
    return false;
}

function abrirModalNuevoEquipoPrograma() {
    if (!esUsuarioAdministrador()) {
        alert("⛔ Acceso Restringido: Únicamente el Administrador puede registrar nuevos equipos.");
        return;
    }
    const nuevoCod = prompt("Ingrese el Código único del nuevo equipo o herramienta (Ej: X-35, GPC-09, C-11, BAR-02):");
    if (!nuevoCod || !nuevoCod.trim()) return;
    const codLimpio = nuevoCod.trim().toUpperCase();

    const existe = corssenPrograma.some(p => p.cod.toUpperCase() === codLimpio);
    if (existe) {
        alert(`El equipo con código ${codLimpio} ya existe. Abriendo formulario de edición.`);
        abrirModalEditarEquipoPrograma(codLimpio);
        return;
    }

    document.getElementById("lblEditProgCod").textContent = `${codLimpio} (Nuevo Equipo)`;
    document.getElementById("editProgCod").value = codLimpio;
    document.getElementById("editProgEquipo").value = "";
    document.getElementById("editProgMarca").value = "CORSSEN";
    document.getElementById("editProgCat").value = codLimpio.startsWith("G") ? "GRÚAS" : (codLimpio.startsWith("C") ? "MÓVILES" : (codLimpio.startsWith("M") ? "MARÍTIMO" : "AUXILIARES"));
    document.getElementById("editProgEstado").value = "Operativo";
    document.getElementById("editProgPrioridad").value = "Media";
    document.getElementById("editProgHorometro").value = "";
    document.getElementById("editProgFrecuencia").value = "250 hrs / Mensual";
    document.getElementById("editProgProx").value = "";
    document.getElementById("editProgResponsable").value = "Alexis Santos";
    document.getElementById("editProgObservaciones").value = "";

    const modal = document.getElementById("modalEditarEquipoPrograma");
    if (modal) modal.style.display = "flex";
}

function filtrarCategoriaFichas(cat) {
    categoriaFiltroFichasActual = cat || "TODOS";
    
    // Actualizar botones visuales de pestañas
    document.querySelectorAll(".btn-pestana-ficha").forEach(btn => {
        const c = btn.getAttribute("data-cat-ficha");
        if (c === categoriaFiltroFichasActual) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    renderizarSelectorFichas();
}

function renderizarSelectorFichas() {
    const contenedor = document.getElementById("contenedorSelectorFichas");
    if (!contenedor) return;

    const todosLosEquipos = Object.keys(corssenFichas);
    
    // Filtrar por categoría seleccionada
    const equiposDisponibles = todosLosEquipos.filter(codigo => {
        if (!categoriaFiltroFichasActual || categoriaFiltroFichasActual === "TODOS") return true;

        const f = corssenFichas[codigo] || {};
        const p = corssenPrograma.find(prog => (prog.cod || "").toUpperCase() === codigo.toUpperCase());
        const catEquipo = (f.categoria || p?.cat || "").toUpperCase();

        if (categoriaFiltroFichasActual === "GRÚAS") {
            return catEquipo === "GRÚAS" || catEquipo === "PORTACONTENEDORES" || catEquipo === "HORQUILLAS" || codigo.startsWith("G");
        }
        if (categoriaFiltroFichasActual === "MÓVILES") {
            return catEquipo === "MÓVILES" || codigo.startsWith("CAM") || codigo.startsWith("CMN") || codigo.startsWith("C");
        }
        if (categoriaFiltroFichasActual === "AUXILIARES") {
            return catEquipo === "AUXILIARES" || catEquipo === "HERRAMIENTA" || catEquipo === "HERRAMIENTAS" || codigo.startsWith("GEN") || codigo.startsWith("HER") || codigo.startsWith("X");
        }
        if (categoriaFiltroFichasActual === "MARÍTIMO") {
            return catEquipo === "MARÍTIMO" || catEquipo === "MARITIMO" || codigo.startsWith("LAN") || codigo.startsWith("M");
        }
        return catEquipo === categoriaFiltroFichasActual;
    });

    if (!equiposDisponibles.includes(equipoSeleccionado) && equiposDisponibles.length > 0) {
        equipoSeleccionado = equiposDisponibles[0];
        renderizarDetalleFichaTecnica();
    }
    equipoSeleccionadoFicha = equipoSeleccionado;

    const botonesEquipos = equiposDisponibles.map(codigo => {
        const f = corssenFichas[codigo];
        const activo = (codigo === equipoSeleccionado) ? "active" : "";
        return `
            <div class="btn-equipo-card ${activo}" onclick="seleccionarEquipoFicha('${codigo}')" title="${f.nombre || codigo}">
                <strong>${codigo}</strong>
                <span>${f.marca || 'CORSSEN'}</span>
            </div>
        `;
    }).join("");

    // Botón de acceso directo para agregar nueva ficha dentro del grid (Exclusivo Administrador)
    let botonNuevaFichaCard = "";
    if (esUsuarioAdministrador()) {
        botonNuevaFichaCard = `
            <div class="btn-equipo-card" onclick="abrirModalNuevaFicha()" style="border:2px dashed #0284c7; background:#f0f9ff; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#0284c7; cursor:pointer;" title="Crear nueva ficha técnica para maquinaria, auxiliares o marítimo">
                <strong style="color:#0284c7; font-size:15px;">➕</strong>
                <span style="color:#0369a1; font-weight:700;">Nueva Ficha</span>
            </div>
        `;
    }

    if (equiposDisponibles.length === 0) {
        contenedor.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:16px; color:#64748b; font-size:13px;">No hay fichas técnicas registradas en la categoría seleccionada.</div>` + botonNuevaFichaCard;
    } else {
        contenedor.innerHTML = botonesEquipos + botonNuevaFichaCard;
    }

    actualizarPermisosFichasTecnicas();
}

function seleccionarEquipoFicha(codigo) {
    equipoSeleccionado = codigo;
    equipoSeleccionadoFicha = codigo;
    renderizarSelectorFichas();
    renderizarDetalleFichaTecnica();
}

function verFichaTecnica(codigo) {
    if (corssenFichas[codigo]) {
        equipoSeleccionado = codigo;
        equipoSeleccionadoFicha = codigo;
        navegarSeccion("fichasEquipos");
        renderizarSelectorFichas();
        renderizarDetalleFichaTecnica();
    } else {
        if (!esUsuarioAdministrador()) {
            alert(`El equipo "${codigo}" no posee aún una Ficha Técnica oficial registrada.\n\nComuníquese con un Administrador para su registro.`);
            return;
        }
        if (confirm(`El equipo "${codigo}" no posee aún una Ficha Técnica oficial registrada.\n\n¿Desea crear su Ficha Técnica ahora con sus especificaciones pre-cargadas?`)) {
            navegarSeccion("fichasEquipos");
            abrirModalNuevaFichaParaEquipo(codigo);
        }
    }
}

function renderizarDetalleFichaTecnica() {
    const ficha = corssenFichas[equipoSeleccionado];
    if (!ficha) {
        const elTitulo = document.getElementById("fichaTituloEquipo");
        if (elTitulo) elTitulo.textContent = "Sin equipo seleccionado";
        return;
    }

    equipoSeleccionadoFicha = equipoSeleccionado;

    // Encabezado
    const elTitulo = document.getElementById("fichaTituloEquipo");
    const elCod = document.getElementById("fichaCodigo");
    const elMarca = document.getElementById("fichaMarca");
    const elModelo = document.getElementById("fichaModelo");
    const elCapacidad = document.getElementById("fichaCapacidad");
    const elAnio = document.getElementById("fichaAnio");
    const elMotor = document.getElementById("fichaMotor");
    const elResponsable = document.getElementById("fichaResponsable");
    const elEstado = document.getElementById("fichaEstado");

    if (elTitulo) elTitulo.textContent = `${equipoSeleccionado} • ${ficha.nombre || 'EQUIPO'}`;
    if (elCod) elCod.textContent = equipoSeleccionado;
    if (elMarca) elMarca.textContent = ficha.marca || '-';
    if (elModelo) elModelo.textContent = ficha.modelo || '-';
    if (elCapacidad) elCapacidad.textContent = ficha.capacidad || "-";
    if (elAnio) elAnio.textContent = ficha.anio || "-";
    if (elMotor) elMotor.textContent = ficha.motor || (ficha.patente ? `Patente: ${ficha.patente}` : "-");
    if (elResponsable) elResponsable.textContent = ficha.responsable || "Alexis Santos";
    if (elEstado) {
        const est = ficha.estado || "OPERATIVA";
        elEstado.textContent = est;
        elEstado.className = `badge ${obtenerClaseBadge(est)}`;
    }

    // Tabla de Aceites y Fluidos
    const tbodyAceites = document.getElementById("tbodyFichaAceites");
    if (tbodyAceites) {
        const aceitesLista = ficha.aceites || [];
        if (aceitesLista.length === 0) {
            tbodyAceites.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#94a3b8; padding:12px;">No hay lubricantes definidos aún. Haga clic en "Editar Ficha" para agregar.</td></tr>`;
        } else {
            tbodyAceites.innerHTML = aceitesLista.map(a => `
                <tr>
                    <td><strong>${a.tipo || '-'}</strong></td>
                    <td><code>${a.modelo || '-'}</code></td>
                    <td>${a.cantidad || '-'}</td>
                    <td>${a.proveedor || 'Luval'}</td>
                </tr>
            `).join("");
        }
    }

    // Matriz de Filtros y 4 Alternativas
    const tbodyFiltros = document.getElementById("tbodyFichaFiltros");
    if (tbodyFiltros) {
        const filtrosLista = ficha.filtros || [];
        if (filtrosLista.length === 0) {
            tbodyFiltros.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#94a3b8; padding:12px;">No hay matriz de filtros cargada aún. Haga clic en "Editar Ficha" para ingresar alternativas.</td></tr>`;
        } else {
            tbodyFiltros.innerHTML = filtrosLista.map(f => `
                <tr>
                    <td><strong>${f.elemento || f.tipo || '-'}</strong></td>
                    <td><span style="font-size:12px; font-weight:700; color:#1e40af;">${f.alt1 || f.baldwin || '-'}</span></td>
                    <td><span style="font-size:12px; color:#475569;">${f.alt2 || f.donaldson || '-'}</span></td>
                    <td><span style="font-size:12px; color:#475569;">${f.alt3 || f.fleetguard || '-'}</span></td>
                    <td><span style="font-size:12px; color:#475569;">${f.alt4 || f.original || '-'}</span></td>
                </tr>
            `).join("");
        }
    }

    // Historial de Mantenciones
    const tbodyHistorial = document.getElementById("tbodyFichaHistorial");
    if (tbodyHistorial) {
        const historialLista = ficha.historial || [];
        if (historialLista.length === 0) {
            tbodyHistorial.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#94a3b8; padding:12px;">Sin registros en la bitácora técnica de este equipo.</td></tr>`;
        } else {
            tbodyHistorial.innerHTML = historialLista.map(h => `
                <tr>
                    <td><strong>${h.fecha || '-'}</strong></td>
                    <td>${h.horometro || '-'}</td>
                    <td><strong>${h.prox || '-'}</strong></td>
                    <td>${h.descripcion || '-'}</td>
                    <td><span class="badge badge-gris">${h.insumos || '-'}</span></td>
                </tr>
            `).join("");
        }
    }

    // Reparaciones Faltantes / Observaciones de Operadores
    const listaPendientes = document.getElementById("listaFichaPendientes");
    if (listaPendientes) {
        const pendientes = ficha.pendientes || [];
        if (pendientes.length === 0) {
            listaPendientes.innerHTML = `<li style="padding:10px; color:#64748b; font-size:12px; text-align:center;">Sin observaciones o reparaciones pendientes registradas.</li>`;
        } else {
            listaPendientes.innerHTML = pendientes.map((p, pIdx) => `
                <li style="padding:8px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center; font-size:13px;">
                    <span>⚠️ ${p}</span>
                    <button class="btn-secundario" style="padding:2px 8px; font-size:11px; color:#16a34a;" onclick="resolverPendienteFicha('${equipoSeleccionado}', ${pIdx})">✓ Resuelto</button>
                </li>
            `).join("");
        }
    }

    actualizarPermisosFichasTecnicas();
}

function agregarPendienteFicha() {
    const input = document.getElementById("inputNuevoPendiente");
    const texto = input?.value.trim();
    if (!texto) return alert("Ingrese el detalle de la observación o reparación pendiente.");

    if (corssenFichas[equipoSeleccionado]) {
        if (!corssenFichas[equipoSeleccionado].pendientes) {
            corssenFichas[equipoSeleccionado].pendientes = [];
        }
        corssenFichas[equipoSeleccionado].pendientes.push(texto);
        guardarTodo();
        renderizarDetalleFichaTecnica();
        input.value = "";
    }
}

function resolverPendienteFicha(codigo, idx) {
    if (corssenFichas[codigo] && corssenFichas[codigo].pendientes) {
        corssenFichas[codigo].pendientes.splice(idx, 1);
        guardarTodo();
        renderizarDetalleFichaTecnica();
    }
}

function abrirModalEditarFicha(cod = null) {
    if (!esUsuarioAdministrador()) {
        alert("⛔ Acceso Restringido: Únicamente los usuarios con rol de Administrador tienen autorización para editar Fichas Técnicas.");
        return;
    }

    const codigo = cod || equipoSeleccionado;
    const ficha = corssenFichas[codigo];
    if (!ficha) {
        alert(`No se encontró la ficha técnica para el equipo ${codigo}.`);
        return;
    }

    const modal = document.getElementById("modalEditarFicha");
    if (!modal) return;

    // Buscar datos adicionales en programa maestro si existen
    const prog = corssenPrograma.find(p => (p.cod || "").toUpperCase() === codigo.toUpperCase());

    document.getElementById("lblEditarFichaCodigo").textContent = codigo;
    document.getElementById("editFichaCodigoOriginal").value = codigo;
    document.getElementById("editFichaCodigo").value = codigo;
    document.getElementById("editFichaNombre").value = ficha.nombre || "";
    document.getElementById("editFichaMarca").value = ficha.marca || "";
    document.getElementById("editFichaModelo").value = ficha.modelo || "";
    document.getElementById("editFichaCapacidad").value = ficha.capacidad || "";
    document.getElementById("editFichaAnio").value = ficha.anio || "";
    document.getElementById("editFichaMotor").value = ficha.motor || ficha.patente || "";
    document.getElementById("editFichaResponsable").value = ficha.responsable || prog?.responsable || "Alexis Santos";
    document.getElementById("editFichaEstado").value = (ficha.estado || prog?.estado || "OPERATIVA").toUpperCase();
    document.getElementById("editFichaHorometro").value = ficha.horometro || prog?.horometro || "";
    document.getElementById("editFichaProx").value = ficha.prox || prog?.prox || "";

    const elCat = document.getElementById("editFichaCategoria");
    if (elCat) {
        elCat.value = prog?.cat || ficha.categoria || (codigo.startsWith("CAM") ? "MÓVILES" : "PORTACONTENEDORES");
    }

    // Cargar tabla de Aceites
    const tbodyAceites = document.getElementById("tbodyEditAceites");
    tbodyAceites.innerHTML = "";
    const aceites = (ficha.aceites && ficha.aceites.length > 0) ? ficha.aceites : [
        { tipo: "Aceite de Motor", modelo: "15W40 CI-4", cantidad: "25 Lts", proveedor: "Luval" },
        { tipo: "Aceite Hidráulico", modelo: "ISO VG 68", cantidad: "150 Lts", proveedor: "Luval" }
    ];
    aceites.forEach(a => agregarFilaAceiteEdicion(a.tipo, a.modelo, a.cantidad, a.proveedor));

    // Cargar tabla de Filtros
    const tbodyFiltros = document.getElementById("tbodyEditFiltros");
    tbodyFiltros.innerHTML = "";
    const filtros = (ficha.filtros && ficha.filtros.length > 0) ? ficha.filtros : [
        { elemento: "Filtro de Aceite Motor", alt1: "Baldwin BD50000", alt2: "Donaldson P550428", alt3: "Fleetguard LF9001", alt4: "Original OEM" },
        { elemento: "Filtro de Petróleo Primario", alt1: "Baldwin BF1284-SP", alt2: "Donaldson P551010", alt3: "Fleetguard FS19732", alt4: "Original OEM" }
    ];
    filtros.forEach(f => agregarFilaFiltroEdicion(f.elemento || f.tipo, f.alt1 || f.baldwin, f.alt2 || f.donaldson, f.alt3 || f.fleetguard, f.alt4 || f.original));

    modal.style.display = "flex";
}

function cerrarModalEditarFicha() {
    const modal = document.getElementById("modalEditarFicha");
    if (modal) modal.style.display = "none";
}

function agregarFilaAceiteEdicion(tipo = "", modelo = "", cantidad = "", proveedor = "Luval") {
    const tbody = document.getElementById("tbodyEditAceites");
    if (!tbody) return;
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td><input type="text" class="input-edit-aceite-tipo" placeholder="Ej: Aceite de Motor" value="${tipo.replace(/"/g, '&quot;')}" style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px;" required></td>
        <td><input type="text" class="input-edit-aceite-modelo" placeholder="Ej: 15W40 / ISO VG 68" value="${modelo.replace(/"/g, '&quot;')}" style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px;"></td>
        <td><input type="text" class="input-edit-aceite-cantidad" placeholder="Ej: 30 Lts" value="${cantidad.replace(/"/g, '&quot;')}" style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px;"></td>
        <td><input type="text" class="input-edit-aceite-proveedor" placeholder="Ej: Luval / Mobil" value="${proveedor.replace(/"/g, '&quot;')}" style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px;"></td>
        <td style="text-align:center;"><button type="button" class="btn-peligro" style="padding:2px 8px; font-size:11px;" onclick="eliminarFilaTabla(this)">✕</button></td>
    `;
    tbody.appendChild(tr);
}

function agregarFilaFiltroEdicion(elemento = "", alt1 = "", alt2 = "", alt3 = "", alt4 = "") {
    const tbody = document.getElementById("tbodyEditFiltros");
    if (!tbody) return;
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td><input type="text" class="input-edit-filtro-elem" placeholder="Ej: Filtro Aceite" value="${elemento.replace(/"/g, '&quot;')}" style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px;" required></td>
        <td><input type="text" class="input-edit-filtro-alt1" placeholder="Alt 1 / OEM" value="${alt1.replace(/"/g, '&quot;')}" style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px;"></td>
        <td><input type="text" class="input-edit-filtro-alt2" placeholder="Alt 2" value="${alt2.replace(/"/g, '&quot;')}" style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px;"></td>
        <td><input type="text" class="input-edit-filtro-alt3" placeholder="Alt 3" value="${alt3.replace(/"/g, '&quot;')}" style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px;"></td>
        <td><input type="text" class="input-edit-filtro-alt4" placeholder="Alt 4" value="${alt4.replace(/"/g, '&quot;')}" style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px;"></td>
        <td style="text-align:center;"><button type="button" class="btn-peligro" style="padding:2px 8px; font-size:11px;" onclick="eliminarFilaTabla(this)">✕</button></td>
    `;
    tbody.appendChild(tr);
}

function eliminarFilaTabla(boton) {
    const tr = boton.closest("tr");
    if (tr) tr.remove();
}

function guardarEdicionFicha(e) {
    e.preventDefault();

    if (!esUsuarioAdministrador()) {
        alert("⛔ Acceso Denegado: Solo los usuarios con rol de Administrador pueden guardar cambios en las Fichas Técnicas.");
        return;
    }

    const codigoOriginal = document.getElementById("editFichaCodigoOriginal").value.trim();
    const nuevoCodigo = document.getElementById("editFichaCodigo").value.trim().toUpperCase();
    const nombre = document.getElementById("editFichaNombre").value.trim();
    const categoria = document.getElementById("editFichaCategoria").value;
    const marca = document.getElementById("editFichaMarca").value.trim();
    const modelo = document.getElementById("editFichaModelo").value.trim();
    const capacidad = document.getElementById("editFichaCapacidad").value.trim();
    const anio = document.getElementById("editFichaAnio").value.trim();
    const motor = document.getElementById("editFichaMotor").value.trim();
    const responsable = document.getElementById("editFichaResponsable").value.trim();
    const estado = document.getElementById("editFichaEstado").value;
    const horometro = document.getElementById("editFichaHorometro").value.trim();
    const prox = document.getElementById("editFichaProx").value.trim();

    if (!nuevoCodigo || !nombre || !marca) {
        alert("Por favor complete los campos obligatorios: Código, Nombre y Marca.");
        return;
    }

    // Validar conflicto de códigos si se renombró
    if (nuevoCodigo !== codigoOriginal && corssenFichas[nuevoCodigo]) {
        if (!confirm(`Ya existe una ficha con el código "${nuevoCodigo}". ¿Desea sobrescribirla?`)) {
            return;
        }
    }

    // Extraer aceites
    const filasAceites = document.querySelectorAll("#tbodyEditAceites tr");
    const aceites = [];
    filasAceites.forEach(tr => {
        const tipo = tr.querySelector(".input-edit-aceite-tipo")?.value.trim();
        const mod = tr.querySelector(".input-edit-aceite-modelo")?.value.trim();
        const cant = tr.querySelector(".input-edit-aceite-cantidad")?.value.trim();
        const prov = tr.querySelector(".input-edit-aceite-proveedor")?.value.trim();
        if (tipo) {
            aceites.push({ tipo, modelo: mod, cantidad: cant, proveedor: prov });
        }
    });

    // Extraer filtros
    const filasFiltros = document.querySelectorAll("#tbodyEditFiltros tr");
    const filtros = [];
    filasFiltros.forEach(tr => {
        const elem = tr.querySelector(".input-edit-filtro-elem")?.value.trim();
        const a1 = tr.querySelector(".input-edit-filtro-alt1")?.value.trim();
        const a2 = tr.querySelector(".input-edit-filtro-alt2")?.value.trim();
        const a3 = tr.querySelector(".input-edit-filtro-alt3")?.value.trim();
        const a4 = tr.querySelector(".input-edit-filtro-alt4")?.value.trim();
        if (elem) {
            filtros.push({ elemento: elem, alt1: a1, alt2: a2, alt3: a3, alt4: a4 });
        }
    });

    // Obtener ficha original para preservar historial y observaciones pendientes
    const fichaOriginal = corssenFichas[codigoOriginal] || {};

    const fichaActualizada = {
        codigo: nuevoCodigo,
        nombre: nombre,
        marca: marca,
        modelo: modelo,
        capacidad: capacidad,
        anio: anio,
        motor: motor,
        patente: (motor && motor.includes("-") ? motor : (fichaOriginal.patente || "")),
        responsable: responsable,
        estado: estado,
        horometro: horometro || fichaOriginal.horometro || "0 hrs",
        prox: prox || fichaOriginal.prox || "250 hrs",
        categoria: categoria,
        aceites: aceites,
        filtros: filtros,
        historial: fichaOriginal.historial || [],
        pendientes: fichaOriginal.pendientes || []
    };

    // Si cambió el código, eliminar la clave previa
    if (nuevoCodigo !== codigoOriginal) {
        delete corssenFichas[codigoOriginal];
    }
    corssenFichas[nuevoCodigo] = fichaActualizada;
    equipoSeleccionado = nuevoCodigo;
    equipoSeleccionadoFicha = nuevoCodigo;

    // SINCRONIZACIÓN AUTOMÁTICA CON MÓDULOS RESPECTIVOS
    // 1. Sincronizar con Programa Maestro (corssenPrograma)
    const progIndex = corssenPrograma.findIndex(p => (p.cod || "").toUpperCase() === codigoOriginal.toUpperCase() || (p.cod || "").toUpperCase() === nuevoCodigo.toUpperCase());
    if (progIndex !== -1) {
        corssenPrograma[progIndex].cod = nuevoCodigo;
        corssenPrograma[progIndex].equipo = nombre;
        corssenPrograma[progIndex].marca = marca.toUpperCase();
        corssenPrograma[progIndex].cat = categoria;
        corssenPrograma[progIndex].estado = estado;
        corssenPrograma[progIndex].responsable = responsable;
        if (horometro) corssenPrograma[progIndex].horometro = horometro;
        if (prox) corssenPrograma[progIndex].prox = prox;
    } else {
        corssenPrograma.push({
            cod: nuevoCodigo,
            equipo: nombre,
            marca: marca.toUpperCase(),
            cat: categoria,
            estado: estado,
            prioridad: "Media",
            horometro: horometro || "0 hrs",
            frecuencia: horometro.includes("km") ? "10000 kilometros" : "250 horas",
            prox: prox || "250 hrs",
            responsable: responsable,
            observaciones: `Ficha técnica editada y sincronizada el ${new Date().toLocaleDateString('es-CL')}`
        });
    }

    // 2. Sincronizar con Flota Vehículos si aplica
    if (categoria === "MÓVILES" || nuevoCodigo.startsWith("CAM") || nuevoCodigo.startsWith("CMN")) {
        const vIdx = vehiculos.findIndex(v => (v.codigo || "").toUpperCase() === codigoOriginal.toUpperCase() || (v.codigo || "").toUpperCase() === nuevoCodigo.toUpperCase());
        if (vIdx !== -1) {
            vehiculos[vIdx].codigo = nuevoCodigo;
            vehiculos[vIdx].marca = marca;
            vehiculos[vIdx].modelo = modelo;
            vehiculos[vIdx].capacidad = capacidad;
            vehiculos[vIdx].anio = anio;
            vehiculos[vIdx].responsable = responsable;
            vehiculos[vIdx].estado = estado;
            if (motor && motor.includes("-")) vehiculos[vIdx].patente = motor;
        }
    } else {
        // 3. Sincronizar con Maquinarias Pesadas
        const mIdx = maquinarias.findIndex(m => (m.numeroMaquinaria || m.id || "").toUpperCase() === codigoOriginal.toUpperCase() || (m.numeroMaquinaria || m.id || "").toUpperCase() === nuevoCodigo.toUpperCase());
        if (mIdx !== -1) {
            maquinarias[mIdx].numeroMaquinaria = nuevoCodigo;
            maquinarias[mIdx].id = nuevoCodigo;
            maquinarias[mIdx].tipoMaquinaria = nombre;
            maquinarias[mIdx].marcaMaquinaria = marca;
            maquinarias[mIdx].modeloMaquinaria = modelo;
            maquinarias[mIdx].capacidadMaquinaria = capacidad;
            maquinarias[mIdx].anioMaquinaria = anio;
            maquinarias[mIdx].responsable = responsable;
            maquinarias[mIdx].estado = estado;
        }
    }

    // Persistir todo en almacenamiento local
    guardarTodo();

    // Sincronizar en servidor Express
    try {
        const usuarioActual = sessionStorage.getItem("usuarioLogueado") || "admin";
        fetch(`/api/fichas/${encodeURIComponent(nuevoCodigo)}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-usuario": usuarioActual
            },
            body: JSON.stringify(fichaActualizada)
        }).catch(e => console.warn("Sync ficha PUT:", e));

        if (nuevoCodigo !== codigoOriginal) {
            fetch(`/api/fichas/${encodeURIComponent(codigoOriginal)}`, {
                method: "DELETE",
                headers: { "x-usuario": usuarioActual }
            }).catch(e => console.warn("Sync ficha DELETE:", e));
        }

        const progObj = corssenPrograma.find(p => (p.cod || "").toUpperCase() === nuevoCodigo.toUpperCase());
        if (progObj) {
            fetch(`/api/programa/${encodeURIComponent(nuevoCodigo)}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-usuario": usuarioActual
                },
                body: JSON.stringify(progObj)
            }).catch(e => console.warn("Sync prog PUT:", e));
        }

        // Respaldo inmediato garantizado en la nube Cloudflare KV y D1
        if (typeof window !== "undefined" && typeof window.ejecutarAutoBackupSistema === "function" && window.sincronizacionPreparada) {
            window.ejecutarAutoBackupSistema(`Edición de ficha técnica ${nuevoCodigo}`, "AUTOMATICO", true);
        }
    } catch (eServidor) {
        console.warn("Error enviando cambios de ficha al servidor:", eServidor);
    }

    // Actualizar selectores y vistas
    poblarSelectorEquiposMantencion();
    poblarSelectorEquiposCompatiblesStock();
    renderizarSelectorFichas();
    renderizarDetalleFichaTecnica();
    renderizarProgramaMaestro();
    renderizarFlotaRegistrada();
    renderizarTablasOriginales();
    renderizarDashboard();
    renderizarAlertasMantencionesDashboard();

    cerrarModalEditarFicha();
    alert(`✓ Ficha técnica de "${nuevoCodigo} • ${nombre}" actualizada y sincronizada en todos los módulos correctamente.`);
}

function eliminarFichaTecnicaActual() {
    if (!esUsuarioAdministrador()) {
        alert("⛔ Acceso Denegado: Solo los usuarios con rol de Administrador pueden eliminar Fichas Técnicas.");
        return;
    }

    const cod = document.getElementById("editFichaCodigoOriginal").value;
    if (!corssenFichas[cod]) return;

    if (!confirm(`¿Está seguro de que desea eliminar la ficha técnica del equipo ${cod}?\n\nEsta acción no eliminará las mantenciones históricas.`)) {
        return;
    }

    delete corssenFichas[cod];
    const restantes = Object.keys(corssenFichas);
    equipoSeleccionado = restantes.length > 0 ? restantes[0] : "";
    equipoSeleccionadoFicha = equipoSeleccionado;

    guardarTodo();

    // Sincronizar eliminación en servidor
    try {
        const usuarioActual = sessionStorage.getItem("usuarioLogueado") || "admin";
        fetch(`/api/fichas/${encodeURIComponent(cod)}`, {
            method: "DELETE",
            headers: { "x-usuario": usuarioActual }
        }).catch(e => console.warn("Sync delete ficha:", e));
    } catch (_) {}

    renderizarSelectorFichas();
    renderizarDetalleFichaTecnica();
    renderizarFlotaRegistrada();
    cerrarModalEditarFicha();
    alert(`Ficha técnica del equipo ${cod} eliminada.`);
}

function abrirModalNuevaFicha(equipoPreseleccionado = "") {
    if (!esUsuarioAdministrador()) {
        alert("⛔ Acceso Restringido: Únicamente los usuarios con rol de Administrador tienen autorización para crear o vincular nuevas Fichas Técnicas.");
        return;
    }

    const modal = document.getElementById("modalNuevaFicha");
    if (!modal) return;

    const form = document.getElementById("formNuevaFicha");
    if (form) form.reset();

    // Poblar selector de equipos para vincular
    poblarSelectorVincularEquipoFicha();

    // Precargar filas iniciales en tablas de lubricantes y filtros
    const tbodyAceites = document.getElementById("tbodyNuevaAceites");
    tbodyAceites.innerHTML = "";
    agregarFilaAceiteNueva("Aceite de Motor", "15W40 CI-4 / CK-4", "25 Lts", "Luval");
    agregarFilaAceiteNueva("Aceite Hidráulico", "ISO VG 68", "120 Lts", "Luval");
    agregarFilaAceiteNueva("Líquido Refrigerante", "50/50 OAT Larga Duración", "30 Lts", "Luval");
    agregarFilaAceiteNueva("Grasa Chasis y Pasadores", "Litio EP-2 con Molibdeno", "Cartuchos", "Luval");

    const tbodyFiltros = document.getElementById("tbodyNuevaFiltros");
    tbodyFiltros.innerHTML = "";
    agregarFilaFiltroNueva("Filtro Aceite Motor", "Baldwin BD50000", "Donaldson P550428", "Fleetguard LF9001", "Original OEM");
    agregarFilaFiltroNueva("Filtro Combustible Primario", "Baldwin BF1284-SP", "Donaldson P551010", "Fleetguard FS19732", "Original OEM");
    agregarFilaFiltroNueva("Filtro Aire Primario", "Baldwin RS3517", "Donaldson P772580", "Fleetguard AF25545", "Original OEM");
    agregarFilaFiltroNueva("Filtro Hidráulico", "Baldwin BT8840", "Donaldson P164378", "Fleetguard HF6510", "Original OEM");

    if (equipoPreseleccionado) {
        const select = document.getElementById("selectVincularEquipoFicha");
        if (select) {
            select.value = equipoPreseleccionado;
            alSeleccionarEquipoVincularFicha(equipoPreseleccionado);
        }
    }

    modal.style.display = "flex";
}

function abrirModalNuevaFichaParaEquipo(cod) {
    if (!esUsuarioAdministrador()) {
        alert("⛔ Acceso Restringido: Únicamente los usuarios con rol de Administrador pueden crear Fichas Técnicas.");
        return;
    }
    abrirModalNuevaFicha(cod);
}

function cerrarModalNuevaFicha() {
    const modal = document.getElementById("modalNuevaFicha");
    if (modal) modal.style.display = "none";
}

function poblarSelectorVincularEquipoFicha() {
    const select = document.getElementById("selectVincularEquipoFicha");
    if (!select) return;

    let html = `<option value="">-- Seleccionar Equipo Registrado (para autocompletar) o Crear Nuevo --</option>`;

    // Maquinarias registradas
    const codigosFichasExistentes = Object.keys(corssenFichas);
    const maqs = [...maquinarias];
    
    // Agregar también ítems del programa maestro que no estén en maquinarias
    corssenPrograma.forEach(p => {
        if (!maqs.some(m => (m.numeroMaquinaria || m.id || "").toUpperCase() === p.cod.toUpperCase())) {
            maqs.push({
                numeroMaquinaria: p.cod,
                tipoMaquinaria: p.equipo,
                marcaMaquinaria: p.marca,
                modeloMaquinaria: "",
                horometro: parseInt(p.horometro) || 0,
                responsable: p.responsable
            });
        }
    });

    html += `<optgroup label="🚜 Maquinarias y Grúas en Sistema">`;
    maqs.forEach(m => {
        const cod = m.numeroMaquinaria || m.id;
        const tieneFicha = codigosFichasExistentes.includes(cod);
        html += `<option value="${cod}">[${cod}] ${m.tipoMaquinaria || m.marcaMaquinaria || 'Maquinaria'} ${m.modeloMaquinaria || ''} ${tieneFicha ? '(Ya tiene ficha)' : '⚡ Sin Ficha'}</option>`;
    });
    html += `</optgroup>`;

    // Vehículos registrados
    html += `<optgroup label="🚐 Flota Móviles y Vehículos">`;
    vehiculos.forEach(v => {
        const cod = v.codigo;
        const tieneFicha = codigosFichasExistentes.includes(cod);
        html += `<option value="${cod}">[${cod}] ${v.marca} ${v.modelo} (${v.patente || 'Sin Patente'}) ${tieneFicha ? '(Ya tiene ficha)' : '⚡ Sin Ficha'}</option>`;
    });
    html += `</optgroup>`;

    html += `<option value="__NUEVO__">✨ Crear Nuevo Equipo desde Cero (No Registrado)</option>`;

    select.innerHTML = html;
}

function alSeleccionarEquipoVincularFicha(cod) {
    if (!cod || cod === "__NUEVO__") {
        document.getElementById("nuevaFichaCodigo").value = "";
        document.getElementById("nuevaFichaNombre").value = "";
        document.getElementById("nuevaFichaMarca").value = "";
        document.getElementById("nuevaFichaModelo").value = "";
        document.getElementById("nuevaFichaCapacidad").value = "";
        document.getElementById("nuevaFichaAnio").value = "";
        document.getElementById("nuevaFichaMotor").value = "";
        document.getElementById("nuevaFichaHorometro").value = "";
        document.getElementById("nuevaFichaProx").value = "";
        return;
    }

    // Buscar en Vehículos
    const v = vehiculos.find(veh => (veh.codigo || "").toUpperCase() === cod.toUpperCase());
    if (v) {
        document.getElementById("nuevaFichaCodigo").value = v.codigo;
        document.getElementById("nuevaFichaNombre").value = v.nombre || `${v.marca} ${v.modelo}`;
        document.getElementById("nuevaFichaCategoria").value = "MÓVILES";
        document.getElementById("nuevaFichaMarca").value = v.marca;
        document.getElementById("nuevaFichaModelo").value = v.modelo;
        document.getElementById("nuevaFichaCapacidad").value = v.capacidad || "1 TON";
        document.getElementById("nuevaFichaAnio").value = v.anio || "";
        document.getElementById("nuevaFichaMotor").value = v.patente || "";
        document.getElementById("nuevaFichaResponsable").value = v.responsable || "Alexis Santos";
        document.getElementById("nuevaFichaEstado").value = (v.estado || "OPERATIVA").toUpperCase();
        document.getElementById("nuevaFichaHorometro").value = v.kilometraje ? `${v.kilometraje} km` : "10.000 km";
        document.getElementById("nuevaFichaFrecuencia").value = "10000 kilometros";
        
        const kmActual = v.kilometraje || 10000;
        document.getElementById("nuevaFichaProx").value = `${kmActual + 10000} km`;
        return;
    }

    // Buscar en Maquinarias
    const m = maquinarias.find(maq => (maq.numeroMaquinaria || maq.id || "").toUpperCase() === cod.toUpperCase());
    const prog = corssenPrograma.find(p => (p.cod || "").toUpperCase() === cod.toUpperCase());

    if (m || prog) {
        const codigo = m?.numeroMaquinaria || m?.id || prog?.cod || cod;
        const tipo = m?.tipoMaquinaria || prog?.equipo || "MAQUINARIA";
        const marca = m?.marcaMaquinaria || prog?.marca || "";
        const modelo = m?.modeloMaquinaria || "";
        const cap = m?.capacidadMaquinaria || "";
        const anio = m?.anioMaquinaria || "";
        const resp = m?.responsable || prog?.responsable || "Alexis Santos";
        const est = (m?.estado || prog?.estado || "OPERATIVA").toUpperCase();
        const horo = m?.horometro ? `${m.horometro} hrs` : (prog?.horometro || "150 hrs");

        document.getElementById("nuevaFichaCodigo").value = codigo;
        document.getElementById("nuevaFichaNombre").value = tipo;
        document.getElementById("nuevaFichaMarca").value = marca;
        document.getElementById("nuevaFichaModelo").value = modelo;
        document.getElementById("nuevaFichaCapacidad").value = cap || "Pesado";
        document.getElementById("nuevaFichaAnio").value = anio;
        document.getElementById("nuevaFichaMotor").value = m?.patenteMaquinaria || "";
        document.getElementById("nuevaFichaResponsable").value = resp;
        document.getElementById("nuevaFichaEstado").value = est;
        document.getElementById("nuevaFichaHorometro").value = horo;
        document.getElementById("nuevaFichaFrecuencia").value = "250 horas";

        const numHoro = parseInt(horo) || 0;
        document.getElementById("nuevaFichaProx").value = `${numHoro + 250} hrs`;

        if (prog?.cat) {
            document.getElementById("nuevaFichaCategoria").value = prog.cat;
        } else if (codigo.startsWith("GPC")) {
            document.getElementById("nuevaFichaCategoria").value = "PORTACONTENEDORES";
        } else if (codigo.startsWith("GH") || codigo.startsWith("GHO")) {
            document.getElementById("nuevaFichaCategoria").value = "HORQUILLAS";
        } else if (codigo.startsWith("GR")) {
            document.getElementById("nuevaFichaCategoria").value = "GRÚAS";
        } else {
            document.getElementById("nuevaFichaCategoria").value = "AUXILIARES";
        }
    }
}

function alCambiarFrecuenciaNuevaFicha() {
    const frec = document.getElementById("nuevaFichaFrecuencia").value;
    const horoStr = document.getElementById("nuevaFichaHorometro").value || "0";
    const numHoro = parseInt(horoStr) || 0;

    const proxInput = document.getElementById("nuevaFichaProx");
    if (!proxInput) return;

    if (frec === "250 horas") {
        proxInput.value = `${numHoro + 250} hrs`;
    } else if (frec === "500 horas") {
        proxInput.value = `${numHoro + 500} hrs`;
    } else if (frec === "1000 horas") {
        proxInput.value = `${numHoro + 1000} hrs`;
    } else if (frec === "10000 kilometros") {
        proxInput.value = `${numHoro + 10000} km`;
    } else if (frec === "5000 kilometros") {
        proxInput.value = `${numHoro + 5000} km`;
    } else {
        proxInput.value = "Próximo Mes";
    }
}

function agregarFilaAceiteNueva(tipo = "", modelo = "", cantidad = "", proveedor = "Luval") {
    const tbody = document.getElementById("tbodyNuevaAceites");
    if (!tbody) return;
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td><input type="text" class="input-nueva-aceite-tipo" placeholder="Ej: Aceite de Motor" value="${tipo.replace(/"/g, '&quot;')}" style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px;" required></td>
        <td><input type="text" class="input-nueva-aceite-modelo" placeholder="Ej: 15W40 / ISO VG 68" value="${modelo.replace(/"/g, '&quot;')}" style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px;"></td>
        <td><input type="text" class="input-nueva-aceite-cantidad" placeholder="Ej: 30 Lts" value="${cantidad.replace(/"/g, '&quot;')}" style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px;"></td>
        <td><input type="text" class="input-nueva-aceite-proveedor" placeholder="Ej: Luval / Mobil" value="${proveedor.replace(/"/g, '&quot;')}" style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px;"></td>
        <td style="text-align:center;"><button type="button" class="btn-peligro" style="padding:2px 8px; font-size:11px;" onclick="eliminarFilaTabla(this)">✕</button></td>
    `;
    tbody.appendChild(tr);
}

function agregarFilaFiltroNueva(elemento = "", alt1 = "", alt2 = "", alt3 = "", alt4 = "") {
    const tbody = document.getElementById("tbodyNuevaFiltros");
    if (!tbody) return;
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td><input type="text" class="input-nueva-filtro-elem" placeholder="Ej: Filtro Aceite" value="${elemento.replace(/"/g, '&quot;')}" style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px;" required></td>
        <td><input type="text" class="input-nueva-filtro-alt1" placeholder="Alt 1 / OEM" value="${alt1.replace(/"/g, '&quot;')}" style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px;"></td>
        <td><input type="text" class="input-nueva-filtro-alt2" placeholder="Alt 2" value="${alt2.replace(/"/g, '&quot;')}" style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px;"></td>
        <td><input type="text" class="input-nueva-filtro-alt3" placeholder="Alt 3" value="${alt3.replace(/"/g, '&quot;')}" style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px;"></td>
        <td><input type="text" class="input-nueva-filtro-alt4" placeholder="Alt 4" value="${alt4.replace(/"/g, '&quot;')}" style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px;"></td>
        <td style="text-align:center;"><button type="button" class="btn-peligro" style="padding:2px 8px; font-size:11px;" onclick="eliminarFilaTabla(this)">✕</button></td>
    `;
    tbody.appendChild(tr);
}

function guardarNuevaFicha(e) {
    e.preventDefault();

    if (!esUsuarioAdministrador()) {
        alert("⛔ Acceso Denegado: Solo los usuarios con rol de Administrador pueden registrar nuevas Fichas Técnicas.");
        return;
    }

    const codigo = document.getElementById("nuevaFichaCodigo").value.trim().toUpperCase();
    const nombre = document.getElementById("nuevaFichaNombre").value.trim();
    const categoria = document.getElementById("nuevaFichaCategoria").value;
    const marca = document.getElementById("nuevaFichaMarca").value.trim();
    const modelo = document.getElementById("nuevaFichaModelo").value.trim();
    const capacidad = document.getElementById("nuevaFichaCapacidad").value.trim();
    const anio = document.getElementById("nuevaFichaAnio").value.trim();
    const motor = document.getElementById("nuevaFichaMotor").value.trim();
    const responsable = document.getElementById("nuevaFichaResponsable").value.trim() || "Alexis Santos";
    const estado = document.getElementById("nuevaFichaEstado").value;
    const horometro = document.getElementById("nuevaFichaHorometro").value.trim() || "0 hrs";
    const frecuencia = document.getElementById("nuevaFichaFrecuencia").value;
    const prox = document.getElementById("nuevaFichaProx").value.trim() || (horometro.includes("km") ? "10.000 km" : "250 hrs");

    if (!codigo || !nombre || !marca) {
        alert("Por favor complete los campos obligatorios: Código, Nombre y Marca.");
        return;
    }

    if (corssenFichas[codigo]) {
        if (!confirm(`El equipo "${codigo}" ya posee una Ficha Técnica guardada.\n\n¿Desea sobrescribirla con esta nueva información?`)) {
            return;
        }
    }

    // Extraer aceites
    const filasAceites = document.querySelectorAll("#tbodyNuevaAceites tr");
    const aceites = [];
    filasAceites.forEach(tr => {
        const tipo = tr.querySelector(".input-nueva-aceite-tipo")?.value.trim();
        const mod = tr.querySelector(".input-nueva-aceite-modelo")?.value.trim();
        const cant = tr.querySelector(".input-nueva-aceite-cantidad")?.value.trim();
        const prov = tr.querySelector(".input-nueva-aceite-proveedor")?.value.trim();
        if (tipo) {
            aceites.push({ tipo, modelo: mod, cantidad: cant, proveedor: prov });
        }
    });

    // Extraer filtros
    const filasFiltros = document.querySelectorAll("#tbodyNuevaFiltros tr");
    const filtros = [];
    filasFiltros.forEach(tr => {
        const elem = tr.querySelector(".input-nueva-filtro-elem")?.value.trim();
        const a1 = tr.querySelector(".input-nueva-filtro-alt1")?.value.trim();
        const a2 = tr.querySelector(".input-nueva-filtro-alt2")?.value.trim();
        const a3 = tr.querySelector(".input-nueva-filtro-alt3")?.value.trim();
        const a4 = tr.querySelector(".input-nueva-filtro-alt4")?.value.trim();
        if (elem) {
            filtros.push({ elemento: elem, alt1: a1, alt2: a2, alt3: a3, alt4: a4 });
        }
    });

    // Crear Ficha Técnica
    corssenFichas[codigo] = {
        codigo: codigo,
        nombre: nombre,
        marca: marca,
        modelo: modelo,
        capacidad: capacidad,
        anio: anio,
        motor: motor,
        patente: (motor && motor.includes("-") ? motor : ""),
        responsable: responsable,
        estado: estado,
        horometro: horometro,
        prox: prox,
        categoria: categoria,
        aceites: aceites,
        filtros: filtros,
        historial: [
            {
                fecha: new Date().toLocaleDateString("es-CL"),
                horometro: horometro,
                prox: prox,
                descripcion: "Emisión de Ficha Técnica oficial y configuración de plan preventivo",
                insumos: "Pauta inicial de fluidos y filtros"
            }
        ],
        pendientes: []
    };

    equipoSeleccionado = codigo;
    equipoSeleccionadoFicha = codigo;

    // SINCRONIZACIÓN AUTOMÁTICA CON TODOS LOS MÓDULOS RESPECTIVOS
    // 1. Sincronizar en Programa Maestro
    const progIndex = corssenPrograma.findIndex(p => (p.cod || "").toUpperCase() === codigo.toUpperCase());
    if (progIndex !== -1) {
        corssenPrograma[progIndex].equipo = nombre;
        corssenPrograma[progIndex].marca = marca.toUpperCase();
        corssenPrograma[progIndex].cat = categoria;
        corssenPrograma[progIndex].estado = estado;
        corssenPrograma[progIndex].responsable = responsable;
        corssenPrograma[progIndex].horometro = horometro;
        corssenPrograma[progIndex].frecuencia = frecuencia;
        corssenPrograma[progIndex].prox = prox;
    } else {
        corssenPrograma.push({
            cod: codigo,
            equipo: nombre,
            marca: marca.toUpperCase(),
            cat: categoria,
            estado: estado,
            prioridad: "Media",
            horometro: horometro,
            frecuencia: frecuencia,
            prox: prox,
            responsable: responsable,
            observaciones: `Ficha oficial creada el ${new Date().toLocaleDateString('es-CL')}`
        });
    }

    // 2. Sincronizar en Catálogo de Flota
    if (categoria === "MÓVILES" || codigo.startsWith("CAM") || codigo.startsWith("CMN")) {
        const vIdx = vehiculos.findIndex(v => (v.codigo || "").toUpperCase() === codigo.toUpperCase());
        if (vIdx !== -1) {
            vehiculos[vIdx].marca = marca;
            vehiculos[vIdx].modelo = modelo;
            vehiculos[vIdx].capacidad = capacidad || "1 TON";
            vehiculos[vIdx].anio = anio;
            vehiculos[vIdx].responsable = responsable;
            vehiculos[vIdx].estado = estado;
        } else {
            vehiculos.push({
                codigo: codigo,
                patente: (motor && motor.includes("-") ? motor : codigo),
                marca: marca,
                modelo: modelo || "Pickup",
                capacidad: capacidad || "1 TON",
                anio: anio || new Date().getFullYear().toString(),
                combustible: "Diésel",
                kilometraje: parseInt(horometro) || 10000,
                estado: estado,
                responsable: responsable
            });
        }
    } else {
        const mIdx = maquinarias.findIndex(m => (m.numeroMaquinaria || m.id || "").toUpperCase() === codigo.toUpperCase());
        if (mIdx !== -1) {
            maquinarias[mIdx].tipoMaquinaria = nombre;
            maquinarias[mIdx].marcaMaquinaria = marca;
            maquinarias[mIdx].modeloMaquinaria = modelo;
            maquinarias[mIdx].capacidadMaquinaria = capacidad || "Pesado";
            maquinarias[mIdx].anioMaquinaria = anio;
            maquinarias[mIdx].responsable = responsable;
            maquinarias[mIdx].estado = estado;
        } else {
            maquinarias.push({
                id: codigo,
                numeroMaquinaria: codigo,
                tipoMaquinaria: nombre,
                marcaMaquinaria: marca,
                modeloMaquinaria: modelo || "Estándar",
                capacidadMaquinaria: capacidad || "Pesado",
                anioMaquinaria: anio || new Date().getFullYear().toString(),
                combustibleMaquinaria: "Diésel",
                horometro: parseInt(horometro) || 150,
                estado: estado,
                responsable: responsable
            });
        }
    }

    // Persistir
    guardarTodo();

    // Sincronizar creación en servidor Express
    try {
        const usuarioActual = sessionStorage.getItem("usuarioLogueado") || "admin";
        fetch(`/api/fichas/${encodeURIComponent(codigo)}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-usuario": usuarioActual
            },
            body: JSON.stringify(corssenFichas[codigo])
        }).catch(e => console.warn("Sync new ficha PUT:", e));

        const progObj = corssenPrograma.find(p => (p.cod || "").toUpperCase() === codigo.toUpperCase());
        if (progObj) {
            fetch(`/api/programa/${encodeURIComponent(codigo)}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-usuario": usuarioActual
                },
                body: JSON.stringify(progObj)
            }).catch(e => console.warn("Sync prog PUT:", e));
        }
    } catch (_) {}

    // Actualizar todas las interfaces
    poblarSelectorEquiposMantencion();
    poblarSelectorEquiposCompatiblesStock();
    renderizarSelectorFichas();
    renderizarDetalleFichaTecnica();
    renderizarProgramaMaestro();
    renderizarFlotaRegistrada();
    renderizarTablasOriginales();
    renderizarDashboard();
    renderizarAlertasMantencionesDashboard();

    cerrarModalNuevaFicha();
    alert(`✓ Ficha técnica de "${codigo} • ${nombre}" creada y sincronizada con éxito en todos los módulos.`);
}

function irACargarCombustible(patente) {
    navegarSeccion("registrarCarga");
    const input = document.getElementById("patenteCarga");
    if (input) {
        input.value = patente;
        input.focus();
    }
}

function sincronizarFichasConFlotaRegistrada() {
    if (typeof corssenFichas !== "object" || !corssenFichas) return;

    let huboCambios = false;
    Object.entries(corssenFichas).forEach(([cod, f]) => {
        if (!cod || !f) return;
        const codUpper = cod.toUpperCase();
        const categoria = (f.categoria || "").toUpperCase();
        const esVehiculo = codUpper.startsWith("CAM") || codUpper.startsWith("CMN") || categoria === "MÓVILES";
        const nombreFinal = f.nombre || `${f.marca || ''} ${f.modelo || ''}`.trim() || codUpper;
        const marcaFinal = f.marca || (esVehiculo ? "Vehículo" : "Maquinaria");
        const modeloFinal = f.modelo || "Estándar";
        const capacidadFinal = f.capacidad && f.capacidad !== "-" ? f.capacidad : (esVehiculo ? "1 TON" : "Pesado");
        const anioFinal = f.anio && f.anio !== "-" ? (parseInt(f.anio) || 2024) : 2024;
        const estadoFinal = f.estado || "Operativo";
        const respFinal = f.responsable || "Alexis Santos";

        if (esVehiculo) {
            const rawPat = f.patente || (f.motor && f.motor.includes("-") ? f.motor : "");
            const patLimpia = rawPat.replace(/patente:\s*/gi, "").trim() || codUpper;
            const vIdx = vehiculos.findIndex(v => 
                (v.codigo || v.id || "").toUpperCase() === codUpper || 
                ((v.patente || "").toUpperCase() === patLimpia.toUpperCase() && patLimpia !== codUpper)
            );

            const numKm = parseInt(String(f.horometro || '0').replace(/\D/g, '')) || 0;
            const vehObj = {
                id: codUpper,
                codigo: codUpper,
                nombre: nombreFinal,
                patente: patLimpia,
                marca: marcaFinal,
                modelo: modeloFinal,
                capacidad: capacidadFinal,
                anio: anioFinal,
                combustible: f.combustible || "Diésel",
                kilometraje: numKm,
                estado: estadoFinal,
                responsable: respFinal,
                fechaRegistro: f.fechaRegistro || new Date().toISOString().split("T")[0]
            };

            if (vIdx !== -1) {
                if (!numKm && vehiculos[vIdx].kilometraje) {
                    vehObj.kilometraje = vehiculos[vIdx].kilometraje;
                }
                vehiculos[vIdx] = { ...vehiculos[vIdx], ...vehObj };
            } else {
                vehiculos.push(vehObj);
                huboCambios = true;
            }
        } else if (categoria !== "AUXILIARES" && categoria !== "MARÍTIMO") {
            // Maquinaria Pesada o Grúa (GHO, GPC, GTE, etc.)
            const mIdx = maquinarias.findIndex(m => 
                (m.numeroMaquinaria || m.id || m.codigo || "").toUpperCase() === codUpper
            );

            const numHrs = parseInt(String(f.horometro || '0').replace(/\D/g, '')) || 0;
            const maqObj = {
                id: codUpper,
                numeroMaquinaria: codUpper,
                patenteMaquinaria: f.patente || codUpper,
                tipoMaquinaria: nombreFinal,
                marcaMaquinaria: marcaFinal,
                modeloMaquinaria: modeloFinal,
                capacidadMaquinaria: capacidadFinal,
                anioMaquinaria: anioFinal,
                combustibleMaquinaria: f.combustible || "Diésel",
                horometro: numHrs,
                estado: estadoFinal,
                responsable: respFinal,
                fechaRegistro: f.fechaRegistro || new Date().toISOString().split("T")[0]
            };

            if (mIdx !== -1) {
                if (!numHrs && maquinarias[mIdx].horometro) {
                    maqObj.horometro = maquinarias[mIdx].horometro;
                }
                maquinarias[mIdx] = { ...maquinarias[mIdx], ...maqObj };
            } else {
                maquinarias.push(maqObj);
                huboCambios = true;
            }
        }

        // Sincronizar en Programa Maestro si falta
        const pIdx = corssenPrograma.findIndex(p => (p.cod || "").toUpperCase() === codUpper);
        if (pIdx === -1) {
            corssenPrograma.push({
                cod: codUpper,
                equipo: nombreFinal,
                marca: marcaFinal.toUpperCase(),
                cat: categoria || (esVehiculo ? "MÓVILES" : "GRÚAS"),
                estado: estadoFinal,
                prioridad: "Media",
                horometro: f.horometro || "0 hrs",
                frecuencia: (f.horometro || "").includes("km") ? "10000 kilometros" : "250 horas",
                prox: f.prox || "250 hrs",
                responsable: respFinal,
                observaciones: `Sincronizado automáticamente desde Ficha Técnica ${codUpper}`
            });
            huboCambios = true;
        }
    });

    if (huboCambios) {
        try {
            localStorage.setItem("flota_vehiculos_v3", JSON.stringify(vehiculos));
            localStorage.setItem("flota_maquinarias_v3", JSON.stringify(maquinarias));
            localStorage.setItem("corssen_programa_v2", JSON.stringify(corssenPrograma));
        } catch (_) {}
    }
}

function renderizarFlotaRegistrada() {
    sincronizarFichasConFlotaRegistrada();
    const query = (document.getElementById("inputBuscarFlota")?.value || "").toLowerCase().trim();

    // 1. VEHÍCULOS / CAMIONETAS Y CAMIONES
    const tbodyVeh = document.getElementById("tablaVehiculos");
    const vehiculosFiltrados = vehiculos.filter(v => {
        if (!query) return true;
        return (v.patente || "").toLowerCase().includes(query) ||
               (v.marca || "").toLowerCase().includes(query) ||
               (v.modelo || "").toLowerCase().includes(query) ||
               (v.codigo || "").toLowerCase().includes(query) ||
               (v.nombre || "").toLowerCase().includes(query) ||
               (v.responsable || "").toLowerCase().includes(query);
    });

    if (tbodyVeh) {
        if (vehiculosFiltrados.length === 0) {
            tbodyVeh.innerHTML = `<tr><td colspan="11" style="text-align:center; padding:20px; color:#64748b;">No se encontraron vehículos que coincidan con la búsqueda.</td></tr>`;
        } else {
            tbodyVeh.innerHTML = vehiculosFiltrados.map((v, i) => {
                const cod = v.codigo || (v.patente ? v.patente : `CAM-${i+1}`);
                const tieneFicha = !!corssenFichas[cod];
                const estado = v.estado || "Operativo";

                return `
                    <tr>
                        <td>
                            <strong>${v.codigo || cod}</strong>
                            ${v.patente ? `<br><small style="color:#2563eb; font-weight:700;">${v.patente}</small>` : ''}
                        </td>
                        <td>${v.nombre || `${v.marca} ${v.modelo}`}</td>
                        <td><strong>${v.marca}</strong></td>
                        <td>${v.modelo}</td>
                        <td><span class="badge badge-gris">${v.capacidad || '1 TON'}</span></td>
                        <td>${v.anio || '-'}</td>
                        <td><span class="badge badge-azul">${v.combustible || 'Diésel'}</span></td>
                        <td><strong>${v.kilometraje ? v.kilometraje.toLocaleString('es-CL') + ' km' : '-'}</strong></td>
                        <td><span class="badge ${obtenerClaseBadge(estado)}">${estado}</span></td>
                        <td>${v.responsable || 'Alexis Santos'}</td>
                        <td style="text-align:center;">
                            <div style="display:flex; gap:4px; justify-content:center; flex-wrap:wrap;">
                                ${tieneFicha ? `<button class="btn-secundario" style="padding:3px 6px; font-size:11px;" onclick="verFichaTecnica('${cod}')">🔍 Ficha</button>` : `<button class="btn-secundario" style="padding:3px 6px; font-size:11px; color:#0284c7; border-color:#bae6fd; font-weight:700;" onclick="abrirModalNuevaFichaParaEquipo('${cod}')" title="Crear Ficha Técnica para este vehículo">➕ Ficha</button>`}
                                <button class="btn-primario" style="padding:3px 6px; font-size:11px;" onclick="iniciarMantencionParaEquipo('${cod}')" title="Crear OT y rebajar insumos">🔧 Mantención</button>
                                <button class="btn-secundario" style="padding:3px 6px; font-size:11px; color:#0284c7;" onclick="irACargarCombustible('${v.patente || cod}')">⛽ Diésel</button>
                                <button class="btn-peligro" style="padding:3px 6px; font-size:11px;" onclick="eliminarVehiculo('${cod}')" title="Eliminar vehículo de la flota">🗑️</button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join("");
        }
    }

    // 2. MAQUINARIA PESADA Y GRÚAS
    const tbodyMaq = document.getElementById("tablaMaquinarias");
    const maquinariasFiltradas = maquinarias.filter(m => {
        if (!query) return true;
        return (m.numeroMaquinaria || "").toLowerCase().includes(query) ||
               (m.tipoMaquinaria || "").toLowerCase().includes(query) ||
               (m.marcaMaquinaria || "").toLowerCase().includes(query) ||
               (m.modeloMaquinaria || "").toLowerCase().includes(query) ||
               (m.responsable || "").toLowerCase().includes(query) ||
               (m.patenteMaquinaria || "").toLowerCase().includes(query);
    });

    if (tbodyMaq) {
        if (maquinariasFiltradas.length === 0) {
            tbodyMaq.innerHTML = `<tr><td colspan="11" style="text-align:center; padding:20px; color:#64748b;">No se encontraron maquinarias que coincidan con la búsqueda.</td></tr>`;
        } else {
            tbodyMaq.innerHTML = maquinariasFiltradas.map((m, i) => {
                const cod = m.numeroMaquinaria || m.id;
                const tieneFicha = !!corssenFichas[cod];
                const estado = m.estado || "Operativo";

                return `
                    <tr>
                        <td>
                            <strong>${cod}</strong>
                            ${m.patenteMaquinaria ? `<br><small style="color:#059669; font-weight:700;">${m.patenteMaquinaria}</small>` : ''}
                        </td>
                        <td>${m.tipoMaquinaria}</td>
                        <td><strong>${m.marcaMaquinaria}</strong></td>
                        <td>${m.modeloMaquinaria}</td>
                        <td><span class="badge badge-gris">${m.capacidadMaquinaria || 'Pesado'}</span></td>
                        <td>${m.anioMaquinaria || '-'}</td>
                        <td><span class="badge badge-azul">${m.combustibleMaquinaria || 'Diésel'}</span></td>
                        <td><strong>${m.horometro ? m.horometro.toLocaleString('es-CL') + ' hrs' : '-'}</strong></td>
                        <td><span class="badge ${obtenerClaseBadge(estado)}">${estado}</span></td>
                        <td>${m.responsable || 'Alexis Santos'}</td>
                        <td style="text-align:center;">
                            <div style="display:flex; gap:4px; justify-content:center; flex-wrap:wrap;">
                                ${tieneFicha ? `<button class="btn-secundario" style="padding:3px 6px; font-size:11px;" onclick="verFichaTecnica('${cod}')">🔍 Ficha</button>` : `<button class="btn-secundario" style="padding:3px 6px; font-size:11px; color:#0284c7; border-color:#bae6fd; font-weight:700;" onclick="abrirModalNuevaFichaParaEquipo('${cod}')" title="Crear Ficha Técnica para esta maquinaria">➕ Ficha</button>`}
                                <button class="btn-primario" style="padding:3px 6px; font-size:11px;" onclick="iniciarMantencionParaEquipo('${cod}')" title="Crear OT y rebajar insumos">🔧 Mantención</button>
                                <button class="btn-secundario" style="padding:3px 6px; font-size:11px; color:#0284c7;" onclick="irACargarCombustible('${cod}')">⛽ Diésel</button>
                                <button class="btn-peligro" style="padding:3px 6px; font-size:11px;" onclick="eliminarMaquinaria('${cod}')" title="Eliminar maquinaria de la flota">🗑️</button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join("");
        }
    }

    // 3. AUXILIARES Y HERRAMIENTAS (Xxx)
    const tbodyAux = document.getElementById("tablaAuxiliares");
    if (tbodyAux) {
        const auxList = corssenPrograma.filter(item => item.cat === "AUXILIARES");
        const auxFiltrados = auxList.filter(a => {
            if (!query) return true;
            return (a.cod || "").toLowerCase().includes(query) ||
                   (a.equipo || "").toLowerCase().includes(query) ||
                   (a.marca || "").toLowerCase().includes(query) ||
                   (a.responsable || "").toLowerCase().includes(query) ||
                   (a.observaciones || "").toLowerCase().includes(query);
        });

        if (auxFiltrados.length === 0) {
            tbodyAux.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:20px; color:#64748b;">No se encontraron equipos auxiliares ni herramientas registrados.</td></tr>`;
        } else {
            tbodyAux.innerHTML = auxFiltrados.map(a => `
                <tr>
                    <td><strong>${a.cod}</strong></td>
                    <td>${a.equipo}</td>
                    <td><strong>${a.marca}</strong></td>
                    <td><span class="badge badge-gris">${a.frecuencia || 'Mensual'}</span></td>
                    <td>${a.horometro || 'N/A'}</td>
                    <td><span class="badge ${obtenerClaseBadge(a.estado)}">${a.estado}</span></td>
                    <td>${a.responsable}</td>
                    <td style="max-width:260px; font-size:12px;">${a.observaciones || '-'}</td>
                    <td style="text-align:center;">
                        <div style="display:flex; gap:4px; justify-content:center; flex-wrap:wrap;">
                            <button class="btn-primario" style="padding:3px 6px; font-size:11px;" onclick="iniciarMantencionParaEquipo('${a.cod}')" title="Crear OT y rebajar insumos">🔧 Mantención</button>
                            <button class="btn-secundario" style="padding:3px 6px; font-size:11px;" onclick="navegarSeccion('programaMantencion')">📋 Programa</button>
                            <button class="btn-peligro" style="padding:3px 6px; font-size:11px;" onclick="eliminarEquipoPrograma('${a.cod}')" title="Eliminar auxiliar/herramienta de la flota">🗑️</button>
                        </div>
                    </td>
                </tr>
            `).join("");
        }
    }

    // 4. MARÍTIMO (Mxx)
    const tbodyMar = document.getElementById("tablaMaritimo");
    if (tbodyMar) {
        const marList = corssenPrograma.filter(item => item.cat === "MARÍTIMO");
        const marFiltrados = marList.filter(m => {
            if (!query) return true;
            return (m.cod || "").toLowerCase().includes(query) ||
                   (m.equipo || "").toLowerCase().includes(query) ||
                   (m.marca || "").toLowerCase().includes(query) ||
                   (m.responsable || "").toLowerCase().includes(query);
        });

        if (marFiltrados.length === 0) {
            tbodyMar.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px; color:#64748b;">No se encontraron equipos marítimos registrados.</td></tr>`;
        } else {
            tbodyMar.innerHTML = marFiltrados.map(m => `
                <tr>
                    <td><strong>${m.cod}</strong></td>
                    <td>${m.equipo}</td>
                    <td><strong>${m.marca}</strong></td>
                    <td><span class="badge badge-gris">${m.frecuencia || 'Anual'}</span></td>
                    <td><span class="badge ${obtenerClaseBadge(m.estado)}">${m.estado}</span></td>
                    <td>${m.responsable}</td>
                    <td style="max-width:260px; font-size:12px;">${m.observaciones || '-'}</td>
                    <td style="text-align:center;">
                        <div style="display:flex; gap:4px; justify-content:center; flex-wrap:wrap;">
                            <button class="btn-primario" style="padding:3px 6px; font-size:11px;" onclick="iniciarMantencionParaEquipo('${m.cod}')" title="Crear OT y rebajar insumos">🔧 Mantención</button>
                            <button class="btn-secundario" style="padding:3px 6px; font-size:11px;" onclick="navegarSeccion('programaMantencion')">📋 Programa</button>
                            <button class="btn-peligro" style="padding:3px 6px; font-size:11px;" onclick="eliminarEquipoPrograma('${m.cod}')" title="Eliminar equipo marítimo de la flota">🗑️</button>
                        </div>
                    </td>
                </tr>
            `).join("");
        }
    }

    // Actualizar contadores y badges
    const auxCount = corssenPrograma.filter(i => i.cat === "AUXILIARES").length;
    const marCount = corssenPrograma.filter(i => i.cat === "MARÍTIMO").length;

    const elContMov = document.getElementById("contFlotaMoviles");
    const elContGru = document.getElementById("contFlotaGruas");
    const elContAux = document.getElementById("contFlotaAux");
    const elContMar = document.getElementById("contFlotaMar");

    if (elContMov) elContMov.textContent = vehiculos.length;
    if (elContGru) elContGru.textContent = maquinarias.length;
    if (elContAux) elContAux.textContent = auxCount;
    if (elContMar) elContMar.textContent = marCount;

    const bTotalCam = document.getElementById("badgeTotalCamionetas");
    const bTotalMaq = document.getElementById("badgeTotalMaquinarias");
    const bTotalAux = document.getElementById("badgeTotalAuxiliares");
    const bTotalMar = document.getElementById("badgeTotalMaritimo");

    if (bTotalCam) bTotalCam.textContent = `${vehiculos.length} Unidades Registradas`;
    if (bTotalMaq) bTotalMaq.textContent = `${maquinarias.length} Unidades Registradas`;
    if (bTotalAux) bTotalAux.textContent = `${auxCount} Equipos`;
    if (bTotalMar) bTotalMar.textContent = `${marCount} Unidades`;

    // Manejar visibilidad de bloques según la pestaña seleccionada
    const bloqueVeh = document.getElementById("bloqueFlotaVehiculos");
    const bloqueMaq = document.getElementById("bloqueFlotaMaquinarias");
    const bloqueAux = document.getElementById("bloqueFlotaAuxiliares");
    const bloqueMar = document.getElementById("bloqueFlotaMaritimo");

    if (categoriaFiltroFlota === "TODOS") {
        if (bloqueVeh) bloqueVeh.style.display = "block";
        if (bloqueMaq) bloqueMaq.style.display = "block";
        if (bloqueAux) bloqueAux.style.display = "block";
        if (bloqueMar) bloqueMar.style.display = "block";
    } else if (categoriaFiltroFlota === "MOVILES") {
        if (bloqueVeh) bloqueVeh.style.display = "block";
        if (bloqueMaq) bloqueMaq.style.display = "none";
        if (bloqueAux) bloqueAux.style.display = "none";
        if (bloqueMar) bloqueMar.style.display = "none";
    } else if (categoriaFiltroFlota === "GRUAS") {
        if (bloqueVeh) bloqueVeh.style.display = "none";
        if (bloqueMaq) bloqueMaq.style.display = "block";
        if (bloqueAux) bloqueAux.style.display = "none";
        if (bloqueMar) bloqueMar.style.display = "none";
    } else if (categoriaFiltroFlota === "AUXILIARES") {
        if (bloqueVeh) bloqueVeh.style.display = "none";
        if (bloqueMaq) bloqueMaq.style.display = "none";
        if (bloqueAux) bloqueAux.style.display = "block";
        if (bloqueMar) bloqueMar.style.display = "none";
    } else if (categoriaFiltroFlota === "MARITIMO") {
        if (bloqueVeh) bloqueVeh.style.display = "none";
        if (bloqueMaq) bloqueMaq.style.display = "none";
        if (bloqueAux) bloqueAux.style.display = "none";
        if (bloqueMar) bloqueMar.style.display = "block";
    }

    // Actualizar visibilidad de controles y botones según permisos de administrador
    actualizarPermisosFlotaRegistrada();
}


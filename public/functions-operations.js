function renderizarTablasOriginales() {
    renderizarFlotaRegistrada();
    renderizarModuloCombustible();
}

function renderizarModuloCombustible() {
    renderizarCombustibleDashboard();
    const elNombre = document.getElementById("lblNombreTanqueCombustible");
    const elPorcentaje = document.getElementById("lblPorcentajeCombustible");
    const barra = document.getElementById("barraProgresoCombustible");
    const elFecha = document.getElementById("lblFechaRecargaTanque");
    const elProveedor = document.getElementById("lblProveedorTanque");
    const elFactura = document.getElementById("lblFacturaTanque");
    const badgeEstado = document.getElementById("badgeEstadoTanqueCombustible");

    const capTotal = estadoTanqueCombustible.capacidad || 400;
    const saldoActual = Math.max(0, estadoTanqueCombustible.actual !== undefined ? estadoTanqueCombustible.actual : capTotal);
    const porcentaje = Math.min(100, Math.max(0, (saldoActual / capTotal) * 100));

    if (elNombre) elNombre.textContent = estadoTanqueCombustible.nombre || "Estanque Petróleo Diésel (400 Lts)";
    if (elFecha) elFecha.textContent = estadoTanqueCombustible.fechaUltimaRecarga || "2026-02-27";
    if (elProveedor) elProveedor.textContent = estadoTanqueCombustible.proveedor || "COPEC S.A.";
    if (elFactura) elFactura.textContent = estadoTanqueCombustible.factura || "FAC-91823";

    if (elPorcentaje) {
        elPorcentaje.textContent = `${porcentaje.toFixed(1)}% (${saldoActual.toFixed(1)} / ${capTotal} L)`;
        if (saldoActual <= 80) {
            elPorcentaje.style.color = "#dc2626";
        } else if (saldoActual <= 160) {
            elPorcentaje.style.color = "#d97706";
        } else {
            elPorcentaje.style.color = "#059669";
        }
    }

    if (barra) {
        barra.style.width = `${porcentaje}%`;
        if (saldoActual <= 80) {
            barra.style.background = "linear-gradient(90deg, #ef4444, #b91c1c)";
        } else if (saldoActual <= 160) {
            barra.style.background = "linear-gradient(90deg, #f59e0b, #d97706)";
        } else {
            barra.style.background = "linear-gradient(90deg, #10b981, #059669)";
        }
    }

    if (badgeEstado) {
        if (saldoActual <= 80) {
            badgeEstado.className = "badge badge-rojo";
            badgeEstado.textContent = "⚠️ Nivel Crítico (< 80L)";
        } else if (saldoActual <= 160) {
            badgeEstado.className = "badge badge-naranja";
            badgeEstado.textContent = "⚡ Nivel Bajo (< 160L)";
        } else {
            badgeEstado.className = "badge badge-verde";
            badgeEstado.textContent = "⛽ Estanque Operativo";
        }
    }

    // 4 KPIs del Estanque
    const elKpiDespachado = document.getElementById("kpiLitrosDespachadosTanque");
    const elKpiEquipos = document.getElementById("kpiEquiposAbastecidosComb");
    const elKpiCostoL = document.getElementById("kpiCostoLitroComb");
    const elKpiRecargas = document.getElementById("kpiRecargasTanqueTotal");

    const despachosTanque = (cargas || []).filter(c => (c.origen === "ESTANQUE_400L" || (c.estacion || "").toLowerCase().includes("estanque") || (c.estacion || "").toLowerCase().includes("corssen")));
    const totalLitrosDespachados = despachosTanque.reduce((acc, c) => acc + Number(c.litros || 0), 0);

    if (elKpiDespachado) elKpiDespachado.textContent = `${totalLitrosDespachados.toFixed(1)} L`;
    if (elKpiEquipos) {
        elKpiEquipos.textContent = cargas.length;
    }
    if (elKpiCostoL) {
        const costoL = estadoTanqueCombustible.costoPorLitro || 1050;
        elKpiCostoL.textContent = `$${costoL.toLocaleString('es-CL')}`;
    }
    if (elKpiRecargas) {
        elKpiRecargas.textContent = (historialRecargasCombustible || []).length;
    }

    // Badge en Menú Lateral
    const badgeMenu = document.getElementById("badgeNivelCombustibleMenu");
    if (badgeMenu) {
        badgeMenu.textContent = `${saldoActual.toFixed(0)}L`;
        if (saldoActual <= 80) {
            badgeMenu.className = "badge badge-rojo";
        } else if (saldoActual <= 160) {
            badgeMenu.className = "badge badge-naranja";
        } else {
            badgeMenu.className = "badge badge-verde";
        }
    }

    // Badge de saldo en el formulario de despacho
    const badgeForm = document.getElementById("badgeSaldoTanqueEnFormulario");
    if (badgeForm) {
        badgeForm.textContent = `Saldo en Estanque 400L: ${saldoActual.toFixed(1)} Lts`;
        badgeForm.className = saldoActual <= 80 ? "badge badge-rojo" : (saldoActual <= 160 ? "badge badge-naranja" : "badge badge-verde");
    }

    // Poblar datalist de equipos si existe
    const datalist = document.getElementById("listaEquiposCombustibleDatalist");
    if (datalist) {
        const todosEquipos = [
            ...(corssenPrograma || []).map(e => ({ cod: e.codigo, desc: `${e.codigo} - ${e.nombre}` })),
            ...(vehiculos || []).map(v => ({ cod: v.patente || v.codigo, desc: `${v.patente || v.codigo} - ${v.nombre || v.marca}` })),
            ...(maquinarias || []).map(m => ({ cod: m.numeroMaquinaria || m.id, desc: `${m.numeroMaquinaria || m.id} - ${m.tipoMaquinaria || m.marcaMaquinaria}` }))
        ];
        const unicos = Array.from(new Map(todosEquipos.map(item => [item.cod, item])).values());
        datalist.innerHTML = unicos.map(item => `<option value="${item.cod}">${item.desc}</option>`).join("");
    }

    // Contadores de pestañas
    const contDespachos = document.getElementById("contTabDespachosComb");
    const contRecargas = document.getElementById("contTabRecargasComb");
    if (contDespachos) contDespachos.textContent = (cargas || []).length;
    if (contRecargas) contRecargas.textContent = (historialRecargasCombustible || []).length;

    // Tabla 1: Despachos a Equipos
    const tbodyCargas = document.getElementById("tablaCargas");
    if (tbodyCargas) {
        if (!cargas || cargas.length === 0) {
            tbodyCargas.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:24px; color:#64748b;">No hay despachos de combustible registrados aún.</td></tr>`;
        } else {
            tbodyCargas.innerHTML = cargas.map((c) => {
                const esEstanque = (c.origen === "ESTANQUE_400L" || (c.estacion || "").toLowerCase().includes("estanque"));
                const badgeOrigen = esEstanque 
                    ? `<span class="badge badge-verde" style="font-size:11px;">⛽ Estanque 400L</span>` 
                    : `<span class="badge badge-azul" style="font-size:11px;">⛽ ${c.estacion || 'Estación Externa'}</span>`;
                const saldoTexto = (c.saldoPosterior !== undefined && c.saldoPosterior !== null) ? `<span class="badge badge-gris">${Number(c.saldoPosterior).toFixed(1)} L</span>` : `-`;

                return `
                    <tr>
                        <td><strong>${c.fecha || '-'}</strong></td>
                        <td>
                            <strong>${c.patente || '-'}</strong>
                            ${c.horometroKm ? `<br><small style="color:#64748b;">${c.horometroKm}</small>` : ''}
                        </td>
                        <td>${c.conductor || 'Alexis Santos'}</td>
                        <td><strong style="color:#2563eb; font-size:14px;">${Number(c.litros || 0).toFixed(1)} Lts</strong></td>
                        <td>$${Number(c.precioLitro || 0).toLocaleString('es-CL')}</td>
                        <td><strong style="color:#059669;">$${Number(c.total || (c.litros * c.precioLitro)).toLocaleString('es-CL')}</strong></td>
                        <td>${badgeOrigen}</td>
                        <td>${saldoTexto}</td>
                        <td style="text-align:center;">
                            <button type="button" class="btn-peligro" onclick="eliminarCargaCombustible('${c.id}')" title="Eliminar despacho y reponer litros si correspondía al estanque" style="padding:4px 8px; font-size:11px;">🗑️</button>
                        </td>
                    </tr>
                `;
            }).join("");
        }
    }

    // Tabla 2: Historial de Recargas del Estanque 400L
    const tbodyRecargas = document.getElementById("tbodyHistorialRecargasTanque");
    if (tbodyRecargas) {
        if (!historialRecargasCombustible || historialRecargasCombustible.length === 0) {
            tbodyRecargas.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:24px; color:#64748b;">No hay recargas registradas para el estanque de 400L.</td></tr>`;
        } else {
            tbodyRecargas.innerHTML = historialRecargasCombustible.map((r) => {
                return `
                    <tr>
                        <td><strong>${r.fecha || '-'}</strong></td>
                        <td><span class="badge badge-azul">${r.id || 'RECARGA'}</span></td>
                        <td><strong style="color:#059669; font-size:14px;">+${Number(r.litrosCargados || 0).toFixed(1)} Lts</strong></td>
                        <td>${r.proveedor || 'COPEC S.A.'}</td>
                        <td><strong>${r.factura || '-'}</strong></td>
                        <td>$${Number(r.costoPorLitro || 0).toLocaleString('es-CL')}</td>
                        <td><strong style="color:#0f172a;">$${Number(r.costoTotal || 0).toLocaleString('es-CL')}</strong></td>
                        <td>${r.responsable || 'Alexis Santos'}</td>
                        <td><span class="badge badge-verde">${Number(r.saldoPosterior || 400).toFixed(1)} L</span></td>
                        <td style="text-align:center;">
                            <button type="button" class="btn-peligro" onclick="eliminarRecargaCombustible('${r.id}')" title="Eliminar registro de recarga" style="padding:4px 8px; font-size:11px;">🗑️</button>
                        </td>
                    </tr>
                `;
            }).join("");
        }
    }
}

function cambiarPestanaCombustible(pestana) {
    pestanaCombustibleActiva = pestana;
    const btnDespachos = document.getElementById("btnTabCombDespachos");
    const btnRecargas = document.getElementById("btnTabCombRecargas");
    const vistaDespachos = document.getElementById("vistaTablaDespachosComb");
    const vistaRecargas = document.getElementById("vistaTablaRecargasComb");

    if (pestana === "DESPACHOS") {
        if (btnDespachos) btnDespachos.classList.add("active");
        if (btnRecargas) btnRecargas.classList.remove("active");
        if (vistaDespachos) vistaDespachos.style.display = "block";
        if (vistaRecargas) vistaRecargas.style.display = "none";
    } else {
        if (btnDespachos) btnDespachos.classList.remove("active");
        if (btnRecargas) btnRecargas.classList.add("active");
        if (vistaDespachos) vistaDespachos.style.display = "none";
        if (vistaRecargas) vistaRecargas.style.display = "block";
    }
}

function manejarCambioOrigenCombustible() {
    const sel = document.getElementById("selectOrigenCombustible");
    const inputPrecio = document.getElementById("precioLitro");
    const inputEstacion = document.getElementById("estacionCarga");
    if (!sel) return;

    if (sel.value === "ESTANQUE_400L") {
        if (inputPrecio) inputPrecio.value = estadoTanqueCombustible.costoPorLitro || 1050;
        if (inputEstacion) inputEstacion.value = "Vale Estanque 400L Taller Central";
    } else if (sel.value === "COPEC_EXTERNA") {
        if (inputPrecio) inputPrecio.value = 1120;
        if (inputEstacion) inputEstacion.value = "Copec Puerto Montt (Estación de Servicio)";
    } else if (sel.value === "SHELL_EXTERNA") {
        if (inputPrecio) inputPrecio.value = 1115;
        if (inputEstacion) inputEstacion.value = "Shell / Petrobras Panamericana Sur";
    } else {
        if (inputPrecio) inputPrecio.value = 1120;
        if (inputEstacion) inputEstacion.value = "Estación de Servicio en Ruta";
    }
    calcularTotalCargaCombustibleForm();
}

function calcularTotalCargaCombustibleForm() {
    const litros = parseFloat(document.getElementById("litros")?.value) || 0;
    const precio = parseFloat(document.getElementById("precioLitro")?.value) || 0;
    const inputTotal = document.getElementById("inputTotalCargaCombCalculado");
    if (inputTotal) {
        inputTotal.value = `$${Math.round(litros * precio).toLocaleString('es-CL')}`;
    }
}

function abrirModalRecargaTanque() {
    const modal = document.getElementById("modalRecargaEstanqueCombustible");
    if (!modal) return;

    const inputFecha = document.getElementById("inputFechaRecargaTanque");
    if (inputFecha) inputFecha.value = new Date().toISOString().split("T")[0];

    const capTotal = estadoTanqueCombustible.capacidad || 400;
    const saldoActual = estadoTanqueCombustible.actual !== undefined ? estadoTanqueCombustible.actual : capTotal;
    const falta = Math.max(0, capTotal - saldoActual);

    const inputLitros = document.getElementById("inputLitrosRecargaTanque");
    if (inputLitros) inputLitros.value = falta > 0 ? falta : 400;

    const lblSugerencia = document.getElementById("lblSugerenciaLlenadoModal");
    if (lblSugerencia) {
        lblSugerencia.textContent = `Sugerido para completar estanque (400L): ${falta.toFixed(1)} Lts`;
    }

    const inputCosto = document.getElementById("inputCostoTotalRecargaTanque");
    const precioLitroEstimado = estadoTanqueCombustible.costoPorLitro || 1050;
    if (inputCosto) {
        const ltsVal = parseFloat(inputLitros?.value) || falta;
        inputCosto.value = Math.round(ltsVal * precioLitroEstimado);
    }

    calcularCostoPorLitroModalTanque();
    modal.style.display = "flex";
}

function cerrarModalRecargaTanque() {
    const modal = document.getElementById("modalRecargaEstanqueCombustible");
    if (modal) modal.style.display = "none";
}

function calcularCostoPorLitroModalTanque() {
    const litros = parseFloat(document.getElementById("inputLitrosRecargaTanque")?.value) || 1;
    const costoTotal = parseFloat(document.getElementById("inputCostoTotalRecargaTanque")?.value) || 0;
    const lblPrecio = document.getElementById("lblPrecioLitroCalculadoModal");
    if (lblPrecio && litros > 0) {
        const precioUnit = Math.round(costoTotal / litros);
        lblPrecio.textContent = `$${precioUnit.toLocaleString('es-CL')} por litro`;
    }
}

function guardarRecargaTanqueCombustible(e) {
    if (e && e.preventDefault) e.preventDefault();

    const tipoCombustible = document.getElementById("inputTipoCombustibleTanque")?.value.trim() || "Petróleo Diésel Grado B (Ultra Diésel)";
    const litros = parseFloat(document.getElementById("inputLitrosRecargaTanque")?.value) || 0;
    const fecha = document.getElementById("inputFechaRecargaTanque")?.value || new Date().toISOString().split("T")[0];
    const costoTotal = parseFloat(document.getElementById("inputCostoTotalRecargaTanque")?.value) || 0;
    const proveedor = document.getElementById("inputProveedorRecargaTanque")?.value.trim() || "COPEC S.A.";
    const factura = document.getElementById("inputFacturaRecargaTanque")?.value.trim() || "FAC-" + Math.floor(10000 + Math.random() * 90000);
    const responsable = document.getElementById("inputResponsableRecargaTanque")?.value.trim() || "Alexis Santos";
    const observaciones = document.getElementById("inputObsRecargaTanque")?.value.trim() || "";

    if (litros <= 0) return alert("Debe ingresar una cantidad válida de litros a cargar.");

    const costoPorLitro = Math.round(costoTotal / litros) || 1050;
    const capTotal = estadoTanqueCombustible.capacidad || 400;
    if(!Number.isFinite(litros)||!Number.isFinite(costoTotal)||costoTotal<0||litros + Number(estadoTanqueCombustible.actual || 0)>capTotal)return alert("La recarga supera la capacidad disponible o contiene un costo inválido. No se modificó el estanque.");
    const nuevoSaldo = Number(estadoTanqueCombustible.actual || 0) + litros;

    estadoTanqueCombustible = {
        nombre: tipoCombustible,
        capacidad: capTotal,
        actual: nuevoSaldo,
        costoTotal: costoTotal,
        costoPorLitro: costoPorLitro,
        proveedor: proveedor,
        factura: factura,
        fechaUltimaRecarga: fecha,
        estado: "Activo"
    };

    const idRecarga = `RECARGA-COMB-${crypto.randomUUID()}`;
    historialRecargasCombustible.unshift({
        id: idRecarga,
        fecha,
        litrosCargados: litros,
        costoTotal,
        costoPorLitro,
        proveedor,
        factura,
        responsable,
        saldoPosterior: nuevoSaldo,
        observaciones
    });

    // Registrar en Kárdex general para trazabilidad contable
    inventario.unshift({
        id: `MOV-COMB-${Date.now()}`,
        tipo: "INGRESO",
        fecha: fecha,
        folioOT: factura || idRecarga,
        codigoEquipo: "TALLER-ESTANQUE",
        equipoNombre: "Estanque Diésel 400L CORSSEN",
        insumoDetalle: `Recarga Petróleo Diésel (${tipoCombustible})`,
        cantidad: litros,
        medida: "LITROS",
        costoUnitario: costoPorLitro,
        costoTotal: costoTotal,
        responsable: responsable,
        stockRestante: nuevoSaldo
    });

    guardarTodo();
    renderizarModuloCombustible();
    renderizarKardexMovimientos();
    cerrarModalRecargaTanque();

    alert(`✓ Recarga de ${litros} Litros de Petróleo Diésel registrada con éxito.\nNuevo saldo en estanque: ${nuevoSaldo.toFixed(1)} / ${capTotal} Litros.`);
}

function registrarCargaCombustible(e) {
    e.preventDefault();
    const patente = document.getElementById("patenteCarga")?.value.trim().toUpperCase();
    const fecha = document.getElementById("fechaCarga")?.value;
    const origen = document.getElementById("selectOrigenCombustible")?.value || "ESTANQUE_400L";
    const litros = parseFloat(document.getElementById("litros")?.value) || 0;
    const precioLitro = parseFloat(document.getElementById("precioLitro")?.value) || 1050;
    const conductor = document.getElementById("conductorCarga")?.value.trim() || "Alexis Santos";
    const horometroKm = document.getElementById("inputHorometroKmCarga")?.value.trim();
    const estacion = document.getElementById("estacionCarga")?.value.trim() || (origen === "ESTANQUE_400L" ? "Estanque Diésel 400L CORSSEN" : "Estación Externa");

    if (!patente || litros <= 0 || !fecha) {
        return alert("⚠️ Por favor complete los campos obligatorios (Equipo/Patente, Fecha y Litros).");
    }

    const esEstanqueInterno = (origen === "ESTANQUE_400L");
    let nuevoSaldoEstanque = null;

    if (esEstanqueInterno) {
        const capTotal = estadoTanqueCombustible.capacidad || 400;
        const saldoActual = estadoTanqueCombustible.actual !== undefined ? estadoTanqueCombustible.actual : capTotal;
        if (litros > saldoActual) {
            return alert(`⚠️ STOCK INSUFICIENTE EN EL ESTANQUE DE 400L:\n\nEl estanque cuenta con ${saldoActual.toFixed(1)} Litros disponibles y se solicitaron ${litros.toFixed(1)} Litros.\n\nPor favor registre una recarga al estanque o ajuste la cantidad.`);
        }
        nuevoSaldoEstanque = Math.max(0, saldoActual - litros);
        estadoTanqueCombustible.actual = nuevoSaldoEstanque;
        localStorage.setItem("corssen_tanque_combustible_v1", JSON.stringify(estadoTanqueCombustible));
    }

    const idCarga = `CARGA-${crypto.randomUUID()}`;
    const totalInversion = Math.round(litros * precioLitro);
    const capTanque = estadoTanqueCombustible.capacidad || 400;

    cargas.unshift({
        id: idCarga,
        patente,
        fecha,
        origen,
        litros,
        precioLitro,
        total: totalInversion,
        conductor,
        horometroKm,
        estacion,
        saldoPosterior: esEstanqueInterno ? nuevoSaldoEstanque : (estadoTanqueCombustible.actual !== undefined ? estadoTanqueCombustible.actual : capTanque),
        fechaRegistro: new Date().toISOString()
    });

    guardarTodo();
    renderizarModuloCombustible();
    renderizarDashboard();

    // Resetear formulario
    document.getElementById("formCarga")?.reset();
    const inputFecha = document.getElementById("fechaCarga");
    if (inputFecha) inputFecha.value = new Date().toISOString().split("T")[0];
    manejarCambioOrigenCombustible();

    alert(`✓ Despacho de combustible registrado con éxito para ${patente}.\n${esEstanqueInterno ? `⛽ Se descontaron ${litros.toFixed(1)} Litros del estanque de 400L (Saldo restante: ${nuevoSaldoEstanque.toFixed(1)} Lts).` : '⛽ Carga en estación externa registrada.'}`);
}

function eliminarCargaCombustible(id) {
    const idx = cargas.findIndex(c => c.id.toString() === id.toString());
    if (idx === -1) return;

    const carga = cargas[idx];
    const esEstanque = (carga.origen === "ESTANQUE_400L" || (carga.estacion || "").toLowerCase().includes("estanque") || (carga.estacion || "").toLowerCase().includes("corssen"));
    const confirma = confirm(`¿Está seguro de eliminar el registro de carga de ${carga.litros} Lts a ${carga.patente}?${esEstanque ? '\n\nLos litros serán restituidos al estanque de 400L.' : ''}`);
    if (!confirma) return;

    if (esEstanque) {
        const capTotal = estadoTanqueCombustible.capacidad || 400;
        const saldoPrev = Number(estadoTanqueCombustible.actual !== undefined ? estadoTanqueCombustible.actual : capTotal);
        estadoTanqueCombustible.actual = Math.min(capTotal, saldoPrev + Number(carga.litros || 0));
        localStorage.setItem("corssen_tanque_combustible_v1", JSON.stringify(estadoTanqueCombustible));
    }

    cargas.splice(idx, 1);
    localStorage.setItem("flota_cargas", JSON.stringify(cargas));
    localStorage.setItem("corssen_ultima_modificacion_ts", String(Date.now()));
    guardarTodo();
    if (typeof window.ejecutarAutoBackupSistema === "function") {
        window.ejecutarAutoBackupSistema("Despacho de combustible eliminado y saldo restituido al estanque 400L", "AUTOMATICO", true);
    }
    renderizarModuloCombustible();
    renderizarDashboard();
}

function eliminarRecargaCombustible(id) {
    const idx = (historialRecargasCombustible || []).findIndex(r => r.id.toString() === id.toString());
    if (idx === -1) return;

    const recarga = historialRecargasCombustible[idx];
    const confirma = confirm(`¿Está seguro de eliminar el registro de recarga de ${recarga.litrosCargados} Lts (${recarga.fecha})?`);
    if (!confirma) return;

    estadoTanqueCombustible.actual = Math.max(0, (estadoTanqueCombustible.actual || 0) - Number(recarga.litrosCargados || 0));
    historialRecargasCombustible.splice(idx, 1);
    localStorage.setItem("corssen_historial_recargas_comb_v1", JSON.stringify(historialRecargasCombustible));
    localStorage.setItem("corssen_tanque_combustible_v1", JSON.stringify(estadoTanqueCombustible));
    localStorage.setItem("corssen_ultima_modificacion_ts", String(Date.now()));

    guardarTodo();
    if (typeof window.ejecutarAutoBackupSistema === "function") {
        window.ejecutarAutoBackupSistema("Recarga de combustible eliminada", "AUTOMATICO", true);
    }
    renderizarModuloCombustible();
}

function abrirModalAjustarNivelEstanque() {
    const modal = document.getElementById("modalAjustarNivelEstanque");
    if (!modal) return;
    const inputLitros = document.getElementById("inputNivelManualEstanque");
    const cap = estadoTanqueCombustible.capacidad || 400;
    const actual = estadoTanqueCombustible.actual !== undefined ? estadoTanqueCombustible.actual : cap;
    if (inputLitros) {
        inputLitros.value = actual.toFixed(1);
    }
    const lblActual = document.getElementById("lblAjusteSaldoActualModal");
    if (lblActual) {
        lblActual.textContent = `${actual.toFixed(1)} / ${cap} Lts (${((actual / cap) * 100).toFixed(1)}%)`;
    }
    modal.style.display = "flex";
}

function cerrarModalAjustarNivelEstanque() {
    const modal = document.getElementById("modalAjustarNivelEstanque");
    if (modal) modal.style.display = "none";
}

function restablecerEstanqueLleno() {
    const cap = estadoTanqueCombustible.capacidad || 400;
    if (!confirm(`¿Desea restablecer el estanque a su capacidad máxima de ${cap} Litros (100% lleno)?\n\nEsto dejará el saldo en 400.0 Lts y se guardará directamente en Cloudflare.`)) return;
    
    estadoTanqueCombustible.actual = cap;
    localStorage.setItem("corssen_tanque_combustible_v1", JSON.stringify(estadoTanqueCombustible));
    localStorage.setItem("corssen_ultima_modificacion_ts", String(Date.now()));
    guardarTodo();
    if (typeof window.ejecutarAutoBackupSistema === "function") {
        window.ejecutarAutoBackupSistema("Estanque de 400L restablecido al 100% de capacidad", "AUTOMATICO", true);
    }
    renderizarModuloCombustible();
    renderizarDashboard();
    cerrarModalAjustarNivelEstanque();
    if (typeof mostrarNotificacionToast === "function") {
        mostrarNotificacionToast(`Estanque restablecido a ${cap} Lts (100% lleno) y sincronizado con Cloudflare.`, "success");
    } else {
        alert(`Estanque restablecido a ${cap} Lts (100% lleno) y sincronizado con Cloudflare.`);
    }
}

function reconciliarSaldoEstanqueCombustible(mostrarAviso = true) {
    const cap = estadoTanqueCombustible.capacidad || 400;
    const despachosTanque = (cargas || []).filter(c => 
        c.origen === "ESTANQUE_400L" || 
        (c.estacion || "").toLowerCase().includes("estanque") || 
        (c.estacion || "").toLowerCase().includes("corssen")
    );
    const totalDespachado = despachosTanque.reduce((sum, c) => sum + Number(c.litros || 0), 0);
    const saldoCalculado = Math.max(0, cap - totalDespachado);

    estadoTanqueCombustible.actual = saldoCalculado;
    localStorage.setItem("corssen_tanque_combustible_v1", JSON.stringify(estadoTanqueCombustible));
    localStorage.setItem("corssen_ultima_modificacion_ts", String(Date.now()));
    guardarTodo();
    if (typeof window.ejecutarAutoBackupSistema === "function") {
        window.ejecutarAutoBackupSistema("Reconciliación de saldo de Estanque 400L según despachos", "AUTOMATICO", true);
    }
    renderizarModuloCombustible();
    renderizarDashboard();
    cerrarModalAjustarNivelEstanque();

    if (mostrarAviso) {
        const msg = `Saldo reconciliado: ${saldoCalculado.toFixed(1)} Lts disponibles (${totalDespachado.toFixed(1)} Lts despachados en ${despachosTanque.length} registros). Sincronizado con Cloudflare.`;
        if (typeof mostrarNotificacionToast === "function") {
            mostrarNotificacionToast(msg, "success");
        } else {
            alert(msg);
        }
    }
}

function guardarAjusteManualEstanque(e) {
    if (e) e.preventDefault();
    const inputLitros = document.getElementById("inputNivelManualEstanque");
    const nuevoValor = parseFloat(inputLitros?.value);
    const cap = estadoTanqueCombustible.capacidad || 400;

    if (isNaN(nuevoValor) || nuevoValor < 0 || nuevoValor > cap) {
        return alert(`Por favor ingrese un valor válido entre 0 y ${cap} Litros.`);
    }

    estadoTanqueCombustible.actual = nuevoValor;
    localStorage.setItem("corssen_tanque_combustible_v1", JSON.stringify(estadoTanqueCombustible));
    localStorage.setItem("corssen_ultima_modificacion_ts", String(Date.now()));
    guardarTodo();
    if (typeof window.ejecutarAutoBackupSistema === "function") {
        window.ejecutarAutoBackupSistema(`Ajuste manual de nivel en Estanque 400L a ${nuevoValor} Lts`, "AUTOMATICO", true);
    }
    renderizarModuloCombustible();
    renderizarDashboard();
    cerrarModalAjustarNivelEstanque();

    if (typeof mostrarNotificacionToast === "function") {
        mostrarNotificacionToast(`Nivel del estanque ajustado a ${nuevoValor.toFixed(1)} Lts y guardado en Cloudflare.`, "success");
    } else {
        alert(`Nivel del estanque ajustado a ${nuevoValor.toFixed(1)} Lts con éxito.`);
    }
}

function registrarVehiculo(e) {
    e.preventDefault();
    if (!esUsuarioAdministrador()) {
        alert("⛔ Acceso Restringido: Únicamente los usuarios con rol de Administrador tienen autorización para registrar vehículos.");
        return;
    }
    const patente = document.getElementById("patente")?.value.trim().toUpperCase();
    const codigoInput = document.getElementById("codigoVehiculo")?.value.trim().toUpperCase();
    const marca = document.getElementById("marca")?.value.trim();
    const modelo = document.getElementById("modelo")?.value.trim();
    const anio = parseInt(document.getElementById("anio")?.value) || 2024;
    const combustible = document.getElementById("combustible")?.value || "Diesel";
    const kilometraje = parseFloat(document.getElementById("kilometraje")?.value) || 0;
    const frecuencia = document.getElementById("frecuenciaVehiculo")?.value?.trim() || "10000 kilometros";
    const responsable = document.getElementById("responsableVehiculo")?.value?.trim() || "Alexis Santos";

    if (!patente) return alert("Debe ingresar la patente.");
    if (!marca) return alert("Debe ingresar la marca.");
    if (!modelo) return alert("Debe ingresar el modelo.");

    const nuevoId = codigoInput || `CAM-${(vehiculos.length + 1).toString().padStart(2, '0')}`;
    
    // 1. Guardar o actualizar en catálogo de vehículos
    const idxExistente = vehiculos.findIndex(v => v.codigo === nuevoId || v.patente === patente);
    const itemVeh = { 
        id: nuevoId, 
        codigo: nuevoId,
        nombre: `Camioneta ${marca} ${modelo}`,
        patente, 
        marca, 
        modelo, 
        capacidad: "1 TON",
        anio, 
        combustible, 
        kilometraje, 
        estado: "Operativo",
        responsable,
        fechaRegistro: new Date().toISOString() 
    };

    if (idxExistente >= 0) {
        vehiculos[idxExistente] = itemVeh;
    } else {
        vehiculos.push(itemVeh);
    }

    // 2. Sincronizar en Programa Maestro (corssenPrograma) para seguimiento y alertas
    const freqNum = extraerNumeroHorometro(frecuencia) || 10000;
    const proxKm = `${(kilometraje + freqNum).toLocaleString('es-CL')} km`;
    const itemProgExistente = corssenPrograma.find(p => p.cod.toUpperCase() === nuevoId.toUpperCase() || p.cod.toUpperCase() === patente);

    if (itemProgExistente) {
        itemProgExistente.equipo = `CAMIONETA ${marca.toUpperCase()} ${modelo.toUpperCase()} (${patente})`;
        itemProgExistente.marca = marca.toUpperCase();
        itemProgExistente.cat = "MÓVILES";
        itemProgExistente.horometro = `${kilometraje.toLocaleString('es-CL')} km`;
        itemProgExistente.frecuencia = frecuencia;
        itemProgExistente.prox = proxKm;
        itemProgExistente.responsable = responsable;
        itemProgExistente.estado = "Operativo";
    } else {
        corssenPrograma.push({
            cod: nuevoId,
            equipo: `CAMIONETA ${marca.toUpperCase()} ${modelo.toUpperCase()} (${patente})`,
            marca: marca.toUpperCase(),
            cat: "MÓVILES",
            estado: "Operativo",
            prioridad: "Media",
            horometro: `${kilometraje.toLocaleString('es-CL')} km`,
            frecuencia: frecuencia,
            prox: proxKm,
            responsable: responsable,
            observaciones: `Vehículo nuevo dado de alta el ${new Date().toLocaleDateString('es-CL')}`
        });
    }

    // 3. Sincronizar en Ficha Técnica Oficial (corssenFichas)
    if (!corssenFichas[nuevoId]) {
        corssenFichas[nuevoId] = {
            nombre: `Camioneta ${marca} ${modelo} (${patente})`,
            marca: marca,
            modelo: modelo,
            patente: patente,
            anio: anio,
            horometro: `${kilometraje.toLocaleString('es-CL')} km`,
            prox: proxKm,
            estado: "Operativo",
            responsable: responsable,
            aceites: [
                { tipo: "Aceite de Motor", viscosidad: "5W-30 / 10W-40 Sintético", capacidad: "7 L", modelo: "Valvoline SynPower", frecuencia: "10.000 km" }
            ],
            filtros: [
                { elemento: "Filtro de Aceite", tipo: "Aceite", codigoOEM: "OEM-FIL", alt1: "Mann / Bosch", frecuencia: "10.000 km" },
                { elemento: "Filtro de Combustible", tipo: "Combustible", codigoOEM: "OEM-DIE", alt1: "Mann Filter", frecuencia: "20.000 km" },
                { elemento: "Filtro de Aire", tipo: "Aire", codigoOEM: "OEM-AIR", alt1: "Mann Filter", frecuencia: "20.000 km" }
            ],
            historial: [
                {
                    fecha: new Date().toISOString().split("T")[0],
                    horometro: `${kilometraje.toLocaleString('es-CL')} km`,
                    prox: proxKm,
                    descripcion: "Ingreso a flota y control inicial de puesta en marcha",
                    insumos: "Revisión general y fluidos OK"
                }
            ],
            pendientes: []
        };
    }

    // 4. Guardar y sincronizar todas las vistas
    guardarTodo();

    // Sincronización inmediata remota con Cloudflare y servidor
    try {
        const usuarioActual = sessionStorage.getItem("usuarioLogueado") || "admin";
        const progObj = corssenPrograma.find(p => (p.cod || "").toUpperCase() === nuevoId.toUpperCase());
        if (progObj) {
            fetch(`/api/programa/${encodeURIComponent(nuevoId)}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-usuario": usuarioActual
                },
                body: JSON.stringify(progObj)
            }).catch(e => console.warn("Sync prog PUT vehículo:", e));
        }

        if (corssenFichas[nuevoId]) {
            fetch(`/api/fichas/${encodeURIComponent(nuevoId)}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-usuario": usuarioActual
                },
                body: JSON.stringify(corssenFichas[nuevoId])
            }).catch(e => console.warn("Sync ficha PUT vehículo:", e));
        }

        if (typeof window !== "undefined" && typeof window.ejecutarAutoBackupSistema === "function" && window.sincronizacionPreparada) {
            window.ejecutarAutoBackupSistema(`Alta y sincronización de vehículo ${nuevoId}`, "AUTOMATICO", true);
        }
    } catch (eSyncVeh) {
        console.warn("Error en sincronización remota de vehículo:", eSyncVeh);
    }

    poblarSelectorEquiposMantencion();
    poblarSelectorEquiposCompatiblesStock();
    renderizarSelectorFichas();
    renderizarProgramaMaestro();
    renderizarFlotaRegistrada();
    renderizarTablasOriginales();
    renderizarDashboard();
    renderizarAlertasMantencionesDashboard();

    document.getElementById("formVehiculo")?.reset();
    alert(`✓ Vehículo "${nuevoId} (${patente})" registrado y sincronizado exitosamente con:\n- Alertas Predictivas del Dashboard\n- Programa Maestro de Mantenciones\n- Ficha Técnica de Mantenimiento\n- Módulo de Emisión de OT`);
    navegarSeccion("vehiculos");
}

async function eliminarVehiculo(identificador) {
    if (!esUsuarioAdministrador()) {
        alert("⛔ Acceso Denegado: Únicamente los usuarios con rol de Administrador pueden eliminar vehículos de la flota.");
        return;
    }
    let idx = -1;
    if (typeof identificador === "number") {
        idx = identificador;
    } else {
        idx = vehiculos.findIndex(v => (v.codigo || v.id || v.patente) === identificador);
    }
    const v = vehiculos[idx];
    if (!v) return;
    const cod = v.codigo || v.id;
    if (confirm(`¿Está seguro de eliminar el vehículo ${cod} (${v.patente}) de la flota?`)) {
        vehiculos.splice(idx, 1);
        const progIdx = corssenPrograma.findIndex(p => p.cod === cod || p.cod === v.patente);
        if (progIdx >= 0) {
            corssenPrograma.splice(progIdx, 1);
        }
        if (corssenFichas[cod]) {
            delete corssenFichas[cod];
        }
        if (v.patente && corssenFichas[v.patente]) {
            delete corssenFichas[v.patente];
        }
        guardarTodo();
        localStorage.setItem("corssen_ultima_modificacion_ts", String(Date.now()));

        try {
            const usuarioActual = sessionStorage.getItem("usuarioLogueado") || "admin";
            fetch(`/api/programa/${encodeURIComponent(cod)}`, { method: "DELETE", headers: { "x-usuario": usuarioActual } }).catch(() => {});
            if (v.patente && v.patente !== cod) {
                fetch(`/api/programa/${encodeURIComponent(v.patente)}`, { method: "DELETE", headers: { "x-usuario": usuarioActual } }).catch(() => {});
            }
            fetch(`/api/fichas/${encodeURIComponent(cod)}`, { method: "DELETE", headers: { "x-usuario": usuarioActual } }).catch(() => {});
        } catch (_) {}

        try {
            if (typeof window !== "undefined" && typeof window.ejecutarAutoBackupSistema === "function" && window.sincronizacionPreparada) {
                await window.ejecutarAutoBackupSistema(`Eliminación de vehículo ${cod}`, "AUTOMATICO", true);
            }
        } catch (_) {}

        poblarSelectorEquiposMantencion();
        poblarSelectorEquiposCompatiblesStock();
        renderizarSelectorFichas();
        renderizarTablasOriginales();
        renderizarProgramaMaestro();
        renderizarFlotaRegistrada();
        renderizarDashboard();
        renderizarAlertasMantencionesDashboard();
    }
}

function registrarMaquinaria(e) {
    e.preventDefault();
    if (!esUsuarioAdministrador()) {
        alert("⛔ Acceso Restringido: Únicamente los usuarios con rol de Administrador tienen autorización para registrar maquinarias.");
        return;
    }
    const numeroMaquinaria = document.getElementById("numeroMaquinaria")?.value.trim().toUpperCase();
    const tipoMaquinaria = document.getElementById("tipoMaquinaria")?.value.trim();
    const categoria = document.getElementById("categoriaMaquinaria")?.value || "HORQUILLAS";
    const marcaMaquinaria = document.getElementById("marcaMaquinaria")?.value.trim();
    const modeloMaquinaria = document.getElementById("modeloMaquinaria")?.value.trim();
    const anioMaquinaria = parseInt(document.getElementById("anioMaquinaria")?.value) || 2025;
    const horometro = parseFloat(document.getElementById("horometroMaquinaria")?.value) || 0;
    const frecuencia = document.getElementById("frecuenciaMaquinaria")?.value?.trim() || "250 horas";
    const responsable = document.getElementById("responsableMaquinaria")?.value?.trim() || "Alexis Santos";

    if (!numeroMaquinaria) return alert("Debe ingresar el código / número de maquinaria.");
    if (!tipoMaquinaria) return alert("Debe ingresar el tipo de maquinaria.");
    if (!marcaMaquinaria) return alert("Debe ingresar la marca.");

    // 1. Guardar o actualizar en catálogo de maquinarias
    const idxExistente = maquinarias.findIndex(m => (m.numeroMaquinaria || m.id).toUpperCase() === numeroMaquinaria);
    const itemMaq = { 
        id: numeroMaquinaria, 
        numeroMaquinaria, 
        patenteMaquinaria: numeroMaquinaria,
        tipoMaquinaria, 
        marcaMaquinaria, 
        modeloMaquinaria, 
        capacidadMaquinaria: "Pesado",
        anioMaquinaria, 
        combustibleMaquinaria: "Diésel",
        horometro, 
        estado: "Operativo",
        responsable,
        fechaRegistro: new Date().toISOString() 
    };

    if (idxExistente >= 0) {
        maquinarias[idxExistente] = itemMaq;
    } else {
        maquinarias.push(itemMaq);
    }

    // 2. Sincronizar en Programa Maestro (corssenPrograma) para seguimiento y alertas
    const freqNum = extraerNumeroHorometro(frecuencia) || 250;
    const proxHorometro = `${(horometro + freqNum).toLocaleString('es-CL')} hrs`;
    const itemProgExistente = corssenPrograma.find(p => p.cod.toUpperCase() === numeroMaquinaria);

    let catFinal = categoria;
    if (!catFinal || catFinal === "AUTO") {
        const tipoMin = (tipoMaquinaria || "").toLowerCase();
        if (tipoMin.includes("portacontenedor")) catFinal = "PORTACONTENEDORES";
        else if (tipoMin.includes("horquilla")) catFinal = "HORQUILLAS";
        else if (tipoMin.includes("telescópica") || tipoMin.includes("telescopica")) catFinal = "GRÚAS";
        else if (tipoMin.includes("auxiliar") || tipoMin.includes("generador") || tipoMin.includes("compresor")) catFinal = "AUXILIARES";
        else if (tipoMin.includes("marítimo") || tipoMin.includes("lancha") || tipoMin.includes("bote")) catFinal = "MARÍTIMO";
        else catFinal = "GRÚAS";
    }

    if (itemProgExistente) {
        itemProgExistente.equipo = `${tipoMaquinaria.toUpperCase()} ${modeloMaquinaria.toUpperCase()}`;
        itemProgExistente.marca = marcaMaquinaria.toUpperCase();
        itemProgExistente.cat = catFinal;
        itemProgExistente.horometro = `${horometro} hrs`;
        itemProgExistente.frecuencia = frecuencia;
        itemProgExistente.prox = proxHorometro;
        itemProgExistente.responsable = responsable;
        itemProgExistente.estado = "Operativo";
    } else {
        corssenPrograma.push({
            cod: numeroMaquinaria,
            equipo: `${tipoMaquinaria.toUpperCase()} ${modeloMaquinaria.toUpperCase()}`,
            marca: marcaMaquinaria.toUpperCase(),
            cat: catFinal,
            estado: "Operativo",
            prioridad: "Media",
            horometro: `${horometro} hrs`,
            frecuencia: frecuencia,
            prox: proxHorometro,
            responsable: responsable,
            observaciones: `Maquinaria nueva dada de alta el ${new Date().toLocaleDateString('es-CL')}`
        });
    }

    // 3. Sincronizar Ficha Técnica Oficial (corssenFichas)
    if (!corssenFichas[numeroMaquinaria]) {
        corssenFichas[numeroMaquinaria] = {
            nombre: `${tipoMaquinaria} ${marcaMaquinaria} ${modeloMaquinaria}`,
            marca: marcaMaquinaria,
            modelo: modeloMaquinaria,
            anio: anioMaquinaria,
            horometro: `${horometro} hrs`,
            prox: proxHorometro,
            estado: "Operativo",
            responsable: responsable,
            aceites: [
                { tipo: "Aceite de Motor", viscosidad: "15W-40 CI-4 / CK-4", capacidad: "15 L", modelo: "Valvoline Premium Blue", frecuencia: "250 hrs" },
                { tipo: "Aceite Hidráulico", viscosidad: "ISO VG 68", capacidad: "80 L", modelo: "Tellus / Rando HD", frecuencia: "1000 hrs" },
                { tipo: "Aceite Transmisión", viscosidad: "80W-90 / ATF", capacidad: "25 L", modelo: "Spirax / HD", frecuencia: "1000 hrs" }
            ],
            filtros: [
                { elemento: "Filtro de Aceite de Motor", tipo: "Aceite", codigoOEM: "OEM-STD", alt1: "Baldwin / Donaldson", frecuencia: "250 hrs" },
                { elemento: "Filtro de Combustible Primario", tipo: "Combustible", codigoOEM: "OEM-SEP", alt1: "Racor / Fleetguard", frecuencia: "500 hrs" },
                { elemento: "Filtro de Aire Primario", tipo: "Aire", codigoOEM: "OEM-AIR", alt1: "Donaldson RadialSeal", frecuencia: "500 hrs" }
            ],
            historial: [
                {
                    fecha: new Date().toISOString().split("T")[0],
                    horometro: `${horometro} hrs`,
                    prox: proxHorometro,
                    descripcion: "Puesta en servicio inicial y alta en catálogo",
                    insumos: "Nivelación de fluidos de fábrica"
                }
            ],
            pendientes: []
        };
    }

    // 4. Sincronizar persistencia y re-renderizar todas las vistas
    guardarTodo();

    // Sincronización inmediata remota con Cloudflare y servidor Express
    try {
        const usuarioActual = sessionStorage.getItem("usuarioLogueado") || "admin";
        const progObj = corssenPrograma.find(p => (p.cod || "").toUpperCase() === numeroMaquinaria.toUpperCase());
        if (progObj) {
            fetch(`/api/programa/${encodeURIComponent(numeroMaquinaria)}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-usuario": usuarioActual
                },
                body: JSON.stringify(progObj)
            }).catch(e => console.warn("Sync prog PUT maquinaria:", e));
        }

        if (corssenFichas[numeroMaquinaria]) {
            fetch(`/api/fichas/${encodeURIComponent(numeroMaquinaria)}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-usuario": usuarioActual
                },
                body: JSON.stringify(corssenFichas[numeroMaquinaria])
            }).catch(e => console.warn("Sync ficha PUT maquinaria:", e));
        }

        if (typeof window !== "undefined" && typeof window.ejecutarAutoBackupSistema === "function" && window.sincronizacionPreparada) {
            window.ejecutarAutoBackupSistema(`Alta y sincronización de maquinaria ${numeroMaquinaria}`, "AUTOMATICO", true);
        }
    } catch (eSyncMaq) {
        console.warn("Error en sincronización remota de maquinaria:", eSyncMaq);
    }

    poblarSelectorEquiposMantencion();
    poblarSelectorEquiposCompatiblesStock();
    renderizarSelectorFichas();
    renderizarProgramaMaestro();
    renderizarFlotaRegistrada();
    renderizarTablasOriginales();
    renderizarDashboard();
    renderizarAlertasMantencionesDashboard();

    document.getElementById("formMaquinaria")?.reset();
    alert(`✓ Maquinaria "${numeroMaquinaria}" registrada y sincronizada exitosamente con:\n- Alertas Predictivas del Dashboard\n- Programa Maestro de Mantenciones\n- Ficha Técnica Oficial de Lubricación\n- Módulo de Emisión de OT`);
    navegarSeccion("vehiculos");
}

function alCambiarTipoAuxiliarHerramienta() {
    const tipo = document.getElementById("auxTipoRegistro")?.value || "AUXILIARES";
    const inputCod = document.getElementById("auxCodigo");
    const inputNombre = document.getElementById("auxNombre");
    const inputMarca = document.getElementById("auxMarca");
    const inputModelo = document.getElementById("auxModelo");
    const inputCap = document.getElementById("auxCapacidad");
    const selectFrec = document.getElementById("auxFrecuencia");

    if (tipo === "MARÍTIMO") {
        if (inputCod && (!inputCod.value || inputCod.value.startsWith("GEN") || inputCod.value.startsWith("HER"))) inputCod.placeholder = "Ej: LAN-01, M-02, BOT-01";
        if (inputNombre && !inputNombre.value) inputNombre.placeholder = "Ej: Lancha de Operaciones Portuarias / Motor Fuera de Borda";
        if (inputMarca && !inputMarca.value) inputMarca.placeholder = "Ej: Yamaha, Mercury, Evinrude, Yanmar";
        if (inputModelo && !inputModelo.value) inputModelo.placeholder = "Ej: F150 FourStroke, V8 300, 4JH4";
        if (inputCap && !inputCap.value) inputCap.placeholder = "Ej: 150 HP, 8 Pasajeros, 2 TON";
        if (selectFrec) selectFrec.value = "100 horas";
    } else if (tipo === "HERRAMIENTA") {
        if (inputCod && (!inputCod.value || inputCod.value.startsWith("GEN") || inputCod.value.startsWith("LAN"))) inputCod.placeholder = "Ej: HER-01, TOL-04, X-05";
        if (inputNombre && !inputNombre.value) inputNombre.placeholder = "Ej: Pistola de Impacto Neumática 1 pulg / Gata Hidráulica 50T";
        if (inputMarca && !inputMarca.value) inputMarca.placeholder = "Ej: Ingersoll Rand, Chicago Pneumatic, Mega, Bosch";
        if (inputModelo && !inputModelo.value) inputModelo.placeholder = "Ej: 285B-6, MG-50, GWS 22-230";
        if (inputCap && !inputCap.value) inputCap.placeholder = "Ej: 1 Pulg / 2.000 Nm / 50 TON";
        if (selectFrec) selectFrec.value = "Mensual";
    } else {
        // AUXILIARES
        if (inputCod && (!inputCod.value || inputCod.value.startsWith("HER") || inputCod.value.startsWith("LAN"))) inputCod.placeholder = "Ej: GEN-01, COM-02, TOR-01, X-01";
        if (inputNombre && !inputNombre.value) inputNombre.placeholder = "Ej: Generador Diésel Insonorizado 60kVA / Compresor de Tornillo";
        if (inputMarca && !inputMarca.value) inputMarca.placeholder = "Ej: Cummins, Caterpillar, Atlas Copco, Doosan";
        if (inputModelo && !inputModelo.value) inputModelo.placeholder = "Ej: C60D5, XAS 97, G70";
        if (inputCap && !inputCap.value) inputCap.placeholder = "Ej: 60 kVA, 185 CFM, 70 kVA";
        if (selectFrec) selectFrec.value = "250 horas";
    }
}

function registrarAuxiliarHerramientaMaritimo(e) {
    if (e && e.preventDefault) e.preventDefault();

    if (!esUsuarioAdministrador()) {
        alert("⛔ Acceso Restringido: Únicamente los usuarios con rol de Administrador tienen autorización para dar de alta nuevos equipos auxiliares, herramientas o marítimo.");
        return;
    }

    const tipoRegistro = document.getElementById("auxTipoRegistro")?.value || "AUXILIARES";
    const codigo = document.getElementById("auxCodigo")?.value.trim().toUpperCase();
    const nombre = document.getElementById("auxNombre")?.value.trim();
    const marca = document.getElementById("auxMarca")?.value.trim();
    const modelo = document.getElementById("auxModelo")?.value.trim() || "Estándar";
    const capacidad = document.getElementById("auxCapacidad")?.value.trim() || "N/A";
    const anio = parseInt(document.getElementById("auxAnio")?.value) || new Date().getFullYear();
    const horometroStr = document.getElementById("auxHorometro")?.value.trim() || "0 hrs";
    const frecuencia = document.getElementById("auxFrecuencia")?.value || "250 horas";
    const responsable = document.getElementById("auxResponsable")?.value.trim() || "Alexis Santos";
    const estado = document.getElementById("auxEstado")?.value || "Operativo";
    const observaciones = document.getElementById("auxObservaciones")?.value.trim() || "";

    if (!codigo || !nombre || !marca) {
        alert("Por favor complete los campos obligatorios: Código Interno, Nombre y Marca.");
        return;
    }

    const numHoro = parseFloat(horometroStr.replace(/[^\d.]/g, "")) || 0;
    const unidadMedida = horometroStr.toLowerCase().includes("km") ? "km" : "hrs";

    // Calcular próximo servicio estimado
    let proxServicio = "";
    if (frecuencia.includes("100")) proxServicio = `${numHoro + 100} ${unidadMedida}`;
    else if (frecuencia.includes("200")) proxServicio = `${numHoro + 200} ${unidadMedida}`;
    else if (frecuencia.includes("250")) proxServicio = `${numHoro + 250} ${unidadMedida}`;
    else if (frecuencia.includes("500")) proxServicio = `${numHoro + 500} ${unidadMedida}`;
    else proxServicio = "Próximo Ciclo";

    // Determinar categoría maestra
    let catMaestra = "AUXILIARES";
    if (tipoRegistro === "MARÍTIMO") catMaestra = "MARÍTIMO";
    else if (tipoRegistro === "HERRAMIENTA") catMaestra = "AUXILIARES";

    // 1. SINCRONIZAR EN CATÁLOGO DE MAQUINARIAS / EQUIPOS
    const idxExistente = maquinarias.findIndex(m => (m.numeroMaquinaria || m.id || "").toUpperCase() === codigo);
    const itemMaq = {
        id: codigo,
        numeroMaquinaria: codigo,
        patenteMaquinaria: codigo,
        tipoMaquinaria: nombre,
        marcaMaquinaria: marca,
        modeloMaquinaria: modelo,
        capacidadMaquinaria: capacidad,
        anioMaquinaria: anio,
        combustibleMaquinaria: (tipoRegistro === "MARÍTIMO" ? "Gasolina / Diésel Marino" : (tipoRegistro === "HERRAMIENTA" ? "Eléctrico / Neumático" : "Diésel")),
        horometro: numHoro,
        estado: estado,
        responsable: responsable,
        categoria: catMaestra,
        fechaRegistro: new Date().toISOString()
    };

    if (idxExistente >= 0) {
        maquinarias[idxExistente] = itemMaq;
    } else {
        maquinarias.push(itemMaq);
    }

    // 2. SINCRONIZAR EN PROGRAMA MAESTRO (corssenPrograma)
    const progIndex = corssenPrograma.findIndex(p => (p.cod || "").toUpperCase() === codigo);
    const itemProg = {
        cod: codigo,
        equipo: `${nombre.toUpperCase()} ${modelo ? modelo.toUpperCase() : ''}`.trim(),
        marca: marca.toUpperCase(),
        cat: catMaestra,
        estado: estado,
        prioridad: (estado.toLowerCase().includes("fuera") ? "Alta" : "Media"),
        horometro: `${numHoro} ${unidadMedida}`,
        frecuencia: frecuencia,
        prox: proxServicio,
        responsable: responsable,
        observaciones: observaciones || `Alta de equipo ${tipoRegistro.toLowerCase()} el ${new Date().toLocaleDateString('es-CL')}`
    };

    if (progIndex >= 0) {
        corssenPrograma[progIndex] = itemProg;
    } else {
        corssenPrograma.push(itemProg);
    }

    // 3. SINCRONIZAR O CREAR FICHA TÉCNICA OFICIAL (corssenFichas)
    // Generar pauta de aceites y filtros adaptada a la naturaleza del equipo
    let aceitesPredeterminados = [];
    let filtrosPredeterminados = [];

    if (tipoRegistro === "MARÍTIMO") {
        aceitesPredeterminados = [
            { tipo: "Aceite de Motor Marino", modelo: "10W-30 / 15W-40 Marino TC-W3 / FC-W", cantidad: "8 Lts", proveedor: "Yamalube / Luval" },
            { tipo: "Aceite Pata / Transmisión Marina", modelo: "SAE 90 Marino / GL-5", cantidad: "1.2 Lts", proveedor: "Yamalube / Luval" },
            { tipo: "Grasa Marina Chasis y Ejes", modelo: "Grasa Marina Resistente a Agua Salada", cantidad: "Cartucho", proveedor: "Luval" }
        ];
        filtrosPredeterminados = [
            { elemento: "Filtro Aceite Motor Marino", alt1: "Yamaha / Mercury OEM", alt2: "Baldwin B1400", alt3: "Sierra 18-7915", alt4: "Donaldson P550963" },
            { elemento: "Filtro Separador Agua/Combustible 10 Micron", alt1: "Racor S3213", alt2: "Sierra 18-7919", alt3: "Baldwin BF7783-D", alt4: "Donaldson P551843" },
            { elemento: "Filtro Combustible en Línea", alt1: "OEM Original", alt2: "Sierra 18-7866", alt3: "Baldwin BF7863", alt4: "Fleetguard FF5375" }
        ];
    } else if (tipoRegistro === "HERRAMIENTA") {
        aceitesPredeterminados = [
            { tipo: "Aceite para Herramientas Neumáticas", modelo: "ISO VG 32 Neumático con Antidesgaste", cantidad: "0.5 Lts", proveedor: "Luval" },
            { tipo: "Aceite Hidráulico Gatas", modelo: "ISO VG 46 / 68 Hidráulico", cantidad: "2 Lts", proveedor: "Luval" },
            { tipo: "Grasa para Rodamientos e Impacto", modelo: "Grasa Litio Complejo EP-2", cantidad: "Cartucho", proveedor: "Luval" }
        ];
        filtrosPredeterminados = [
            { elemento: "Filtro Regulador de Aire / Trampa Agua", alt1: "SMC / Parker 5 Micron", alt2: "Norgren F74G", alt3: "Festo LFR", alt4: "Original OEM" },
            { elemento: "Filtro Silenciador de Escape", alt1: "SMC AN-Series", alt2: "Parker 0450", alt3: "Festo U-Series", alt4: "Original OEM" }
        ];
    } else {
        // AUXILIARES (Generadores, Torres de luz, Compresores)
        aceitesPredeterminados = [
            { tipo: "Aceite de Motor Diésel", modelo: "15W-40 CI-4 / CK-4 Heavy Duty", cantidad: "12 Lts", proveedor: "Luval" },
            { tipo: "Aceite para Compresor / Hidráulico", modelo: "ISO VG 46 / 68 Rotativo o Tornillo", cantidad: "18 Lts", proveedor: "Luval" },
            { tipo: "Líquido Refrigerante", modelo: "50/50 OAT Larga Duración", cantidad: "15 Lts", proveedor: "Luval" }
        ];
        filtrosPredeterminados = [
            { elemento: "Filtro Aceite Motor Diésel", alt1: "Baldwin BD7309", alt2: "Donaldson P550008", alt3: "Fleetguard LF3349", alt4: "Original OEM" },
            { elemento: "Filtro Petróleo / Separador de Agua", alt1: "Baldwin BF1280", alt2: "Donaldson P550440", alt3: "Fleetguard FS19855", alt4: "Original OEM" },
            { elemento: "Filtro Aire Primario", alt1: "Baldwin RS3544", alt2: "Donaldson P772579", alt3: "Fleetguard AF25437", alt4: "Original OEM" }
        ];
    }

    if (!corssenFichas[codigo]) {
        corssenFichas[codigo] = {
            codigo: codigo,
            nombre: nombre,
            marca: marca,
            modelo: modelo,
            capacidad: capacidad,
            anio: anio,
            motor: (tipoRegistro === "MARÍTIMO" ? `Motor Marino ${marca}` : `${marca} ${modelo}`),
            patente: "",
            responsable: responsable,
            estado: estado.toUpperCase(),
            horometro: `${numHoro} ${unidadMedida}`,
            prox: proxServicio,
            categoria: catMaestra,
            aceites: aceitesPredeterminados,
            filtros: filtrosPredeterminados,
            historial: [
                {
                    fecha: new Date().toLocaleDateString("es-CL"),
                    horometro: `${numHoro} ${unidadMedida}`,
                    prox: proxServicio,
                    descripcion: `Alta oficial en catálogo como ${tipoRegistro} y configuración de pauta técnica inicial`,
                    insumos: "Pauta base de lubricantes y matriz de repuestos equivalentes"
                }
            ],
            pendientes: observaciones ? [observaciones] : []
        };
    } else {
        // Actualizar datos generales si ya existía
        corssenFichas[codigo].nombre = nombre;
        corssenFichas[codigo].marca = marca;
        corssenFichas[codigo].modelo = modelo;
        corssenFichas[codigo].capacidad = capacidad;
        corssenFichas[codigo].anio = anio;
        corssenFichas[codigo].responsable = responsable;
        corssenFichas[codigo].estado = estado.toUpperCase();
        corssenFichas[codigo].categoria = catMaestra;
        corssenFichas[codigo].horometro = `${numHoro} ${unidadMedida}`;
        corssenFichas[codigo].prox = proxServicio;
        if (!corssenFichas[codigo].aceites || corssenFichas[codigo].aceites.length === 0) {
            corssenFichas[codigo].aceites = aceitesPredeterminados;
        }
        if (!corssenFichas[codigo].filtros || corssenFichas[codigo].filtros.length === 0) {
            corssenFichas[codigo].filtros = filtrosPredeterminados;
        }
    }

    // Seleccionar automáticamente el equipo registrado
    equipoSeleccionado = codigo;
    equipoSeleccionadoFicha = codigo;

    // 4. PERSISTIR DATOS Y ACTUALIZAR TODAS LAS VISTAS
    guardarTodo();

    // Sincronización inmediata remota con Cloudflare y servidor Express
    try {
        const usuarioActual = sessionStorage.getItem("usuarioLogueado") || "admin";
        const progObj = corssenPrograma.find(p => (p.cod || "").toUpperCase() === codigo.toUpperCase());
        if (progObj) {
            fetch(`/api/programa/${encodeURIComponent(codigo)}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-usuario": usuarioActual
                },
                body: JSON.stringify(progObj)
            }).catch(e => console.warn("Sync prog PUT auxiliar:", e));
        }

        if (corssenFichas[codigo]) {
            fetch(`/api/fichas/${encodeURIComponent(codigo)}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-usuario": usuarioActual
                },
                body: JSON.stringify(corssenFichas[codigo])
            }).catch(e => console.warn("Sync ficha PUT auxiliar:", e));
        }

        if (typeof window !== "undefined" && typeof window.ejecutarAutoBackupSistema === "function" && window.sincronizacionPreparada) {
            window.ejecutarAutoBackupSistema(`Alta y sincronización de equipo ${codigo}`, "AUTOMATICO", true);
        }
    } catch (eSyncAux) {
        console.warn("Error en sincronización remota de equipo auxiliar:", eSyncAux);
    }

    poblarSelectorEquiposMantencion();
    poblarSelectorEquiposCompatiblesStock();
    renderizarSelectorFichas();
    renderizarDetalleFichaTecnica();
    renderizarProgramaMaestro();
    renderizarFlotaRegistrada();
    renderizarTablasOriginales();
    renderizarDashboard();
    renderizarAlertasMantencionesDashboard();

    // Resetear formulario
    document.getElementById("formAuxiliarHerramientaMaritimo")?.reset();
    alCambiarTipoAuxiliarHerramienta();

    if (confirm(`✓ Equipo "${codigo} - ${nombre}" registrado y sincronizado exitosamente.\n\nSe dio de alta en:\n• Programa Maestro de Mantención (${catMaestra})\n• Fichas Técnicas Multimarca (con matriz de lubricantes y filtros)\n• Alertas y Módulo de OT\n\n¿Desea ir a ver y editar su Ficha Técnica ahora?`)) {
        navegarSeccion("fichasEquipos");
        seleccionarEquipoFicha(codigo);
    }
}

async function eliminarMaquinaria(identificador) {
    if (!esUsuarioAdministrador()) {
        alert("⛔ Acceso Denegado: Únicamente los usuarios con rol de Administrador pueden eliminar maquinarias del catálogo.");
        return;
    }
    let idx = -1;
    if (typeof identificador === "number") {
        idx = identificador;
    } else {
        idx = maquinarias.findIndex(m => (m.numeroMaquinaria || m.id) === identificador);
    }
    const m = maquinarias[idx];
    if (!m) return;
    const cod = m.numeroMaquinaria || m.id;
    if (confirm(`¿Está seguro de eliminar la maquinaria ${cod} (${m.tipoMaquinaria || 'Equipo'}) del catálogo de flota?`)) {
        maquinarias.splice(idx, 1);
        const progIdx = corssenPrograma.findIndex(p => p.cod === cod);
        if (progIdx >= 0) {
            corssenPrograma.splice(progIdx, 1);
        }
        if (corssenFichas[cod]) {
            delete corssenFichas[cod];
        }
        guardarTodo();
        localStorage.setItem("corssen_ultima_modificacion_ts", String(Date.now()));

        try {
            const usuarioActual = sessionStorage.getItem("usuarioLogueado") || "admin";
            fetch(`/api/programa/${encodeURIComponent(cod)}`, { method: "DELETE", headers: { "x-usuario": usuarioActual } }).catch(() => {});
            fetch(`/api/fichas/${encodeURIComponent(cod)}`, { method: "DELETE", headers: { "x-usuario": usuarioActual } }).catch(() => {});
        } catch (_) {}

        try {
            if (typeof window !== "undefined" && typeof window.ejecutarAutoBackupSistema === "function" && window.sincronizacionPreparada) {
                await window.ejecutarAutoBackupSistema(`Eliminación de maquinaria ${cod}`, "AUTOMATICO", true);
            }
        } catch (_) {}

        poblarSelectorEquiposMantencion();
        poblarSelectorEquiposCompatiblesStock();
        renderizarSelectorFichas();
        renderizarTablasOriginales();
        renderizarProgramaMaestro();
        renderizarFlotaRegistrada();
        renderizarDashboard();
        renderizarAlertasMantencionesDashboard();
    }
}

async function eliminarEquipoPrograma(cod) {
    if (!esUsuarioAdministrador()) {
        alert("⛔ Acceso Denegado: Únicamente los usuarios con rol de Administrador pueden eliminar equipos del catálogo de flota.");
        return;
    }
    if (!cod) return;
    const codUpper = String(cod).trim().toUpperCase();
    const item = corssenPrograma.find(p => String(p.cod).toUpperCase() === codUpper);
    const nombreEquipo = item ? `${item.cod} - ${item.equipo}` : cod;
    const tipoTexto = item && item.cat === "MARÍTIMO" ? "el equipo marítimo" : (item && item.cat === "AUXILIARES" ? "el equipo auxiliar / herramienta" : "el equipo");

    if (!confirm(`¿Está seguro de eliminar ${tipoTexto} "${nombreEquipo}" del catálogo y del programa de flota?\n\nEsta acción quitará el equipo del sistema y actualizará todos los módulos.`)) {
        return;
    }

    // 1. Quitar de corssenPrograma
    const progIdx = corssenPrograma.findIndex(p => String(p.cod).toUpperCase() === codUpper);
    if (progIdx >= 0) {
        corssenPrograma.splice(progIdx, 1);
    }
    // 2. Si además estuviera registrado en maquinarias o vehículos, limpiarlo también
    const maqIdx = maquinarias.findIndex(m => (m.numeroMaquinaria || m.id || "").toUpperCase() === codUpper);
    if (maqIdx >= 0) {
        maquinarias.splice(maqIdx, 1);
    }
    const vehIdx = vehiculos.findIndex(v => (v.codigo || v.id || v.patente || "").toUpperCase() === codUpper);
    if (vehIdx >= 0) {
        vehiculos.splice(vehIdx, 1);
    }
    if (corssenFichas[cod]) {
        delete corssenFichas[cod];
    }
    if (corssenFichas[codUpper]) {
        delete corssenFichas[codUpper];
    }

    // 3. Persistir en localStorage y actualizar marca de tiempo
    guardarTodo();
    localStorage.setItem("corssen_ultima_modificacion_ts", String(Date.now()));

    // 4. Sincronizar eliminación en servidor Node / Cloudflare
    try {
        const usuarioActual = sessionStorage.getItem("usuarioLogueado") || "admin";
        fetch(`/api/programa/${encodeURIComponent(cod)}`, {
            method: "DELETE",
            headers: {
                "x-usuario": usuarioActual
            }
        }).catch(e => console.warn("Sync DELETE /api/programa:", e));

        fetch(`/api/fichas/${encodeURIComponent(cod)}`, {
            method: "DELETE",
            headers: {
                "x-usuario": usuarioActual
            }
        }).catch(e => console.warn("Sync DELETE /api/fichas:", e));
    } catch (eSync) {
        console.warn("Error en eliminación remota:", eSync);
    }

    // 5. Disparar auto-backup silencioso inmediato para actualizar snapshot
    try {
        if (typeof window !== "undefined" && typeof window.ejecutarAutoBackupSistema === "function" && window.sincronizacionPreparada) {
            await window.ejecutarAutoBackupSistema(`Eliminación de ${cod} (${nombreEquipo})`, "AUTOMATICO", true);
        }
    } catch (eSnap) {
        console.warn("Auto-backup tras eliminación diferido:", eSnap);
    }

    // 6. Actualizar interfaces
    poblarSelectorEquiposMantencion();
    poblarSelectorEquiposCompatiblesStock();
    renderizarSelectorFichas();
    renderizarTablasOriginales();
    renderizarProgramaMaestro();
    renderizarFlotaRegistrada();
    renderizarDashboard();
    renderizarAlertasMantencionesDashboard();

    alert(`✓ ${tipoTexto} "${nombreEquipo}" ha sido eliminado exitosamente del catálogo y de la flota.`);
}

function renderizarMantenciones() {
    const tbody = document.getElementById("tbodyMantenciones");
    if (!tbody) return;

    // Calcular métricas de resumen
    const totalReg = mantenciones.length;
    const prevOk = mantenciones.filter(m => (m.tipo || "").toLowerCase().includes("preventiva")).length;
    const corrOProceso = mantenciones.filter(m => !(m.tipo || "").toLowerCase().includes("preventiva") || (m.estado || "").toLowerCase().includes("proceso")).length;
    const inversion = mantenciones.reduce((acc, m) => acc + (m.costoTotal || 0), 0);

    const elTotal = document.getElementById("mantTotalRegistradas");
    const elPrev = document.getElementById("mantPreventivasOk");
    const elCorr = document.getElementById("mantCorrectivas");
    const elInv = document.getElementById("mantInversionTotal");

    if (elTotal) elTotal.textContent = totalReg;
    if (elPrev) elPrev.textContent = prevOk;
    if (elCorr) elCorr.textContent = corrOProceso;
    if (elInv) elInv.textContent = `$${inversion.toLocaleString('es-CL')}`;

    // Filtrar mantenciones
    const inputBuscador = document.getElementById("inputBuscarMantencion") || document.getElementById("inputBuscarMantenciones");
    const filtroTexto = (inputBuscador?.value || "").toLowerCase().trim();

    const datosFiltrados = mantenciones.filter(m => {
        let coincideTipo = true;
        const tipoMin = (m.tipo || "").toLowerCase();
        if (filtroMantencionActivo === "PREVENTIVA" || filtroMantencionActivo === "PREVENTIVAS") {
            coincideTipo = tipoMin.includes("preventiva");
        } else if (filtroMantencionActivo === "CORRECTIVA" || filtroMantencionActivo === "CORRECTIVAS") {
            coincideTipo = tipoMin.includes("correctiva") || tipoMin.includes("reparación") || tipoMin.includes("falla");
        } else if (filtroMantencionActivo === "PAUTA") {
            coincideTipo = tipoMin.includes("pauta") || tipoMin.includes("oficial");
        } else if (filtroMantencionActivo === "PROCESO") {
            coincideTipo = (m.estado || "").toLowerCase().includes("proceso");
        }

        if (!coincideTipo) return false;
        if (!filtroTexto) return true;

        return (m.folio || "").toLowerCase().includes(filtroTexto) ||
               (m.codigoEquipo || "").toLowerCase().includes(filtroTexto) ||
               (m.equipoNombre || "").toLowerCase().includes(filtroTexto) ||
               (m.patente || "").toLowerCase().includes(filtroTexto) ||
               (m.tecnico || "").toLowerCase().includes(filtroTexto) ||
               (m.taller || "").toLowerCase().includes(filtroTexto) ||
               (m.tipo || "").toLowerCase().includes(filtroTexto) ||
               (m.descripcion || "").toLowerCase().includes(filtroTexto);
    });

    const badgeTotal = document.getElementById("badgeTotalMantenciones");
    if (badgeTotal) {
        badgeTotal.textContent = `${datosFiltrados.length} ${datosFiltrados.length === 1 ? 'Orden' : 'Órdenes'} Registradas`;
    }

    if (datosFiltrados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="11" style="text-align:center; padding:40px 20px; color:#64748b;">
                    <div style="font-size:32px; margin-bottom:8px;">🔧</div>
                    <div style="font-weight:700; font-size:14px; color:#1e293b;">No se encontraron órdenes de trabajo registradas</div>
                    <div style="font-size:12px; color:#94a3b8; margin-top:4px;">Intente ajustar los filtros de búsqueda o registre una nueva orden técnica.</div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = datosFiltrados.map((m, idx) => {
        const insumosBadges = (m.insumosConsumidos && m.insumosConsumidos.length > 0)
            ? m.insumosConsumidos.map(i => `<span class="mant-insumo-pill" title="${i.detalle || i.modelo}"><strong>${i.cantidad}x</strong> ${i.detalle || i.modelo} <span class="mant-insumo-price">($${((i.costoTotal || (i.costoUnitario * i.cantidad)) || 0).toLocaleString('es-CL')})</span></span>`).join("")
            : '<span class="mant-insumo-empty">Sin deducción de bodega</span>';

        let badgeEstado = "badge-verde";
        if ((m.estado || "").toLowerCase().includes("proceso")) badgeEstado = "badge-naranja";
        else if ((m.estado || "").toLowerCase().includes("pendiente")) badgeEstado = "badge-rojo";

        let tipoBadgeClass = "badge-azul";
        const tipoMin = (m.tipo || "").toLowerCase();
        if (tipoMin.includes("correctiva") || tipoMin.includes("reparación") || tipoMin.includes("falla")) {
            tipoBadgeClass = "badge-naranja";
        } else if (tipoMin.includes("pauta")) {
            tipoBadgeClass = "badge-verde";
        }

        return `
            <tr class="mant-row-hover">
                <td>
                    <div class="mant-folio-tag">${m.folio || `OT-${idx+1}`}</div>
                </td>
                <td>
                    <div style="font-weight:600; color:#334155; font-size:12.5px;">${m.fecha || '-'}</div>
                </td>
                <td>
                    <div style="display:flex; align-items:center; gap:6px;">
                        <strong style="color:#0f172a; font-size:13px;">${m.codigoEquipo || '-'}</strong>
                        ${m.patente ? `<span class="mant-patente-tag">${m.patente}</span>` : ''}
                    </div>
                    <div style="font-size:11.5px; color:#64748b; margin-top:2px;">${m.equipoNombre || ''}</div>
                </td>
                <td><span class="badge ${tipoBadgeClass}">${m.tipo || 'Preventiva'}</span></td>
                <td><span style="font-weight:700; color:#0f172a;">${m.horometroKm || '-'}</span></td>
                <td><span style="font-weight:800; color:#059669;">${m.proximoServicio || '-'}</span></td>
                <td>
                    <div style="font-weight:600; color:#1e293b; font-size:12.5px;">${m.tecnico || 'Alexis Santos'}</div>
                    <div style="font-size:11px; color:#94a3b8;">${m.taller || 'Taller Central'}</div>
                </td>
                <td style="max-width:320px;">
                    <div style="display:flex; flex-wrap:wrap; gap:4px;">${insumosBadges}</div>
                </td>
                <td>
                    <div class="mant-costo-total">$${(m.costoTotal || 0).toLocaleString('es-CL')}</div>
                </td>
                <td><span class="badge ${badgeEstado}">${m.estado || 'Completada'}</span></td>
                <td style="text-align:center;">
                    <div style="display:flex; gap:6px; justify-content:center; align-items:center;">
                        <button class="btn-mant-action-view" onclick="verDetalleOT('${m.folio || m.id}')" title="Ver Comprobante Oficial de OT y PDF">
                            <span>📄</span>
                            <span>OT</span>
                        </button>
                        <button class="btn-mant-action-edit" onclick="abrirModalEditarOT('${m.folio || m.id}')" title="Editar Orden de Trabajo">
                            <span>✏️</span>
                            <span>Editar</span>
                        </button>
                        <button class="btn-mant-action-delete" onclick="eliminarMantencion('${m.folio || m.id}')" title="Eliminar registro">
                            <span>🗑️</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function generarPlantillaDocumentoOT(orden) {
    if (!orden) return "";

    const insumosFilas = (orden.insumosConsumidos && orden.insumosConsumidos.length > 0)
        ? orden.insumosConsumidos.map((i, idx) => `
            <tr style="border-bottom: 1px solid #cbd5e1;">
                <td style="padding: 6px 8px; font-size: 11px; color: #475569; text-align: center; font-weight: 600;">${idx + 1}</td>
                <td style="padding: 6px 8px; font-size: 11.5px; font-weight: 700; color: #0f172a;">${i.detalle}</td>
                <td style="padding: 6px 8px; font-size: 11px; color: #334155; font-family: monospace;">${i.modelo || '-'}</td>
                <td style="padding: 6px 8px; font-size: 11.5px; font-weight: 800; color: #0f172a; text-align: center;">${i.cantidad} ${i.medida || 'UN'}</td>
                <td style="padding: 6px 8px; font-size: 11px; color: #475569; text-align: right;">$${(i.costoUnitario || 0).toLocaleString('es-CL')}</td>
                <td style="padding: 6px 8px; font-size: 11.5px; font-weight: 800; color: #0f172a; text-align: right;">$${(i.costoTotal || (i.costoUnitario * i.cantidad) || 0).toLocaleString('es-CL')}</td>
            </tr>
        `).join("")
        : `<tr><td colspan="6" style="padding: 12px; text-align: center; color: #64748b; font-style: italic; font-size: 11.5px;">No se registraron insumos ni repuestos descontados de bodega para este servicio.</td></tr>`;

    return `
    <div id="documentoOficialOT" style="font-family: 'Plus Jakarta Sans', Arial, Helvetica, sans-serif; color: #0f172a; background: #ffffff; padding: 20px 24px; width: 100%; max-width: 794px; margin: 0 auto; box-sizing: border-box; line-height: 1.35;">
        <!-- ENCABEZADO CORPORATIVO OFICIAL -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2.5px solid #0f172a; padding-bottom: 12px; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 44px; height: 44px; background: #0f172a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #38bdf8; font-size: 24px; font-weight: 900;">
                    ⚓
                </div>
                <div>
                    <h1 style="font-size: 17px; font-weight: 900; margin: 0; color: #0f172a; letter-spacing: -0.3px; text-transform: uppercase;">CORSSEN LOGÍSTICA S.A.</h1>
                    <div style="font-size: 11px; color: #1e293b; font-weight: 800; margin-top: 1px;">DEPARTAMENTO DE CONTROL DE FLOTA, MAQUINARIAS & TALLER</div>
                    <div style="font-size: 10px; color: #64748b;">R.U.T.: 76.892.340-5 • Taller Central & Mantenimiento Preventivo • Puerto Montt</div>
                </div>
            </div>
            <div style="text-align: right;">
                <div style="background: #0f172a; color: #ffffff; padding: 6px 14px; border-radius: 6px; display: inline-block; text-align: right;">
                    <div style="font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; font-weight: 800;">ORDEN DE TRABAJO</div>
                    <div style="font-size: 15px; font-weight: 900; color: #38bdf8; letter-spacing: 0.5px; margin-top: 1px;">${orden.folio || orden.id}</div>
                </div>
                <div style="font-size: 10px; color: #475569; margin-top: 3px;">Fecha: <strong style="color: #0f172a;">${orden.fecha || new Date().toISOString().split("T")[0]}</strong></div>
                <div style="font-size: 10px; margin-top: 1px;">Estado: <strong style="color: ${orden.estado === 'Completada' ? '#16a34a' : '#ea580c'};">${(orden.estado || 'Completada').toUpperCase()}</strong></div>
            </div>
        </div>

        <!-- SECCIÓN 1: DATOS DE LA UNIDAD INTERVENIDA -->
        <div style="margin-bottom: 10px;">
            <div style="background: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 800; text-transform: uppercase; color: #0f172a; letter-spacing: 0.5px; margin-bottom: 5px; border-left: 3.5px solid #2563eb;">
                1. Identificación del Equipo y Parámetros Operacionales
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; border: 1.5px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; background: #fafafa;">
                <div>
                    <div style="font-size: 9px; color: #64748b; font-weight: 700; text-transform: uppercase;">Cód. Equipo</div>
                    <div style="font-size: 12.5px; font-weight: 800; color: #0284c7;">${orden.codigoEquipo || '-'}</div>
                </div>
                <div>
                    <div style="font-size: 9px; color: #64748b; font-weight: 700; text-transform: uppercase;">Denominación</div>
                    <div style="font-size: 11px; font-weight: 700; color: #0f172a;">${orden.equipoNombre || orden.codigoEquipo}</div>
                </div>
                <div>
                    <div style="font-size: 9px; color: #64748b; font-weight: 700; text-transform: uppercase;">Patente / Registro</div>
                    <div style="font-size: 11px; font-weight: 700; color: #0f172a;">${orden.patente || 'N/A'}</div>
                </div>
                <div>
                    <div style="font-size: 9px; color: #64748b; font-weight: 700; text-transform: uppercase;">Tipo Mantención</div>
                    <div style="font-size: 11px; font-weight: 700; color: #0f172a;">${orden.tipo || 'Preventiva'}</div>
                </div>
                <div>
                    <div style="font-size: 9px; color: #64748b; font-weight: 700; text-transform: uppercase;">Lectura Actual</div>
                    <div style="font-size: 11.5px; font-weight: 800; color: #0f172a;">${orden.horometroKm || '-'}</div>
                </div>
                <div>
                    <div style="font-size: 9px; color: #64748b; font-weight: 700; text-transform: uppercase;">Próximo Servicio</div>
                    <div style="font-size: 11.5px; font-weight: 800; color: #16a34a;">${orden.proximoServicio || '-'}</div>
                </div>
                <div>
                    <div style="font-size: 9px; color: #64748b; font-weight: 700; text-transform: uppercase;">Técnico Responsable</div>
                    <div style="font-size: 11px; font-weight: 700; color: #0f172a;">${orden.tecnico || 'Alexis Santos'}</div>
                </div>
                <div>
                    <div style="font-size: 9px; color: #64748b; font-weight: 700; text-transform: uppercase;">Lugar Ejecución</div>
                    <div style="font-size: 11px; font-weight: 700; color: #0f172a;">${orden.taller || 'Taller Central CORSSEN'}</div>
                </div>
            </div>
        </div>

        <!-- SECCIÓN 2: DIAGNÓSTICO Y TRABAJOS REALIZADOS -->
        <div style="margin-bottom: 10px;">
            <div style="background: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 800; text-transform: uppercase; color: #0f172a; letter-spacing: 0.5px; margin-bottom: 5px; border-left: 3.5px solid #2563eb;">
                2. Diagnóstico Técnico y Descripción de Trabajos Realizados
            </div>
            <div style="border: 1.5px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; background: #ffffff; font-size: 11px; line-height: 1.45; color: #334155; min-height: 42px;">
                ${orden.descripcion || 'Se ejecutan trabajos de mantenimiento preventivo y operacional conforme a la pauta técnica establecida para el equipo.'}
            </div>
        </div>

        <!-- SECCIÓN 3: INSUMOS, FILTROS Y LUBRICANTES OCUPADOS DE BODEGA -->
        <div style="margin-bottom: 10px;">
            <div style="background: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 800; text-transform: uppercase; color: #0f172a; letter-spacing: 0.5px; margin-bottom: 5px; border-left: 3.5px solid #2563eb;">
                3. Insumos, Filtros y Lubricantes Descontados de Bodega
            </div>
            <table style="width: 100%; border-collapse: collapse; border: 1.5px solid #cbd5e1; border-radius: 6px; overflow: hidden;">
                <thead>
                    <tr style="background: #0f172a; color: #ffffff;">
                        <th style="padding: 6px 8px; font-size: 9.5px; text-transform: uppercase; text-align: center; width: 28px; color: #ffffff;">#</th>
                        <th style="padding: 6px 8px; font-size: 9.5px; text-transform: uppercase; text-align: left; color: #ffffff;">Detalle / Artículo</th>
                        <th style="padding: 6px 8px; font-size: 9.5px; text-transform: uppercase; text-align: left; color: #ffffff;">Modelo / Cód.</th>
                        <th style="padding: 6px 8px; font-size: 9.5px; text-transform: uppercase; text-align: center; color: #ffffff;">Cantidad</th>
                        <th style="padding: 6px 8px; font-size: 9.5px; text-transform: uppercase; text-align: right; color: #ffffff;">Unitario</th>
                        <th style="padding: 6px 8px; font-size: 9.5px; text-transform: uppercase; text-align: right; color: #ffffff;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${insumosFilas}
                </tbody>
            </table>
        </div>

        <!-- SECCIÓN 4: LIQUIDACIÓN DE COSTOS -->
        <div style="margin-bottom: 12px; display: flex; justify-content: flex-end;">
            <div style="width: 300px; border: 1.5px solid #cbd5e1; border-radius: 6px; overflow: hidden; background: #f8fafc;">
                <div style="padding: 5px 10px; display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; font-size: 11px;">
                    <span style="color: #64748b;">Subtotal Insumos Bodega:</span>
                    <strong style="color: #0f172a;">$${(orden.costoInsumos || 0).toLocaleString('es-CL')}</strong>
                </div>
                <div style="padding: 5px 10px; display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; font-size: 11px;">
                    <span style="color: #64748b;">Mano de Obra / Servicios:</span>
                    <strong style="color: #0f172a;">$${(orden.costoManoObra || 0).toLocaleString('es-CL')}</strong>
                </div>
                <div style="padding: 7px 10px; display: flex; justify-content: space-between; background: #0f172a; color: #ffffff; font-size: 12px; align-items: center;">
                    <span style="font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #ffffff;">TOTAL ORDEN DE TRABAJO:</span>
                    <strong style="font-size: 14.5px; color: #4ade80;">$${(orden.costoTotal || 0).toLocaleString('es-CL')}</strong>
                </div>
            </div>
        </div>

        <!-- SECCIÓN 5: PROTOCOLO DE FIRMAS Y VALIDACIÓN OFICIAL -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 14px; padding-top: 12px; border-top: 1.5px dashed #94a3b8; text-align: center;">
            <div>
                <div style="border-bottom: 1.5px solid #475569; height: 30px; margin-bottom: 4px;"></div>
                <div style="font-size: 10.5px; font-weight: 800; color: #0f172a;">${orden.tecnico || 'Alexis Santos'}</div>
                <div style="font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: 600;">Mecánico Responsable</div>
            </div>
            <div>
                <div style="border-bottom: 1.5px solid #475569; height: 30px; margin-bottom: 4px;"></div>
                <div style="font-size: 10.5px; font-weight: 800; color: #0f172a;">Supervisor de Taller</div>
                <div style="font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: 600;">Recepción Conforme</div>
            </div>
            <div>
                <div style="border-bottom: 1.5px solid #475569; height: 30px; margin-bottom: 4px;"></div>
                <div style="font-size: 10.5px; font-weight: 800; color: #0f172a;">Jefatura de Operaciones</div>
                <div style="font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: 600;">CORSSEN LOGÍSTICA S.A.</div>
            </div>
        </div>

        <div style="margin-top: 12px; text-align: center; font-size: 8.5px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 5px;">
            Documento oficial emitido por el Sistema Integrado de Control de Flota y Maquinarias CORSSEN Logística S.A.
        </div>
    </div>
    `;
}

function verDetalleOT(folio) {
    const orden = mantenciones.find(m => m.folio === folio || m.id === folio);
    if (!orden) return alert("Orden de trabajo no encontrada.");

    ordenActivaOT = orden;

    const elCuerpo = document.getElementById("cuerpoModalOT") || document.getElementById("modalOTBody");
    if (!elCuerpo) return;

    const elFolioHeader = document.getElementById("modalOTFolio");
    if (elFolioHeader) elFolioHeader.textContent = orden.folio || orden.id;

    // Renderizar la vista corporativa en el modal
    elCuerpo.innerHTML = generarPlantillaDocumentoOT(orden);

    const modal = document.getElementById("modalDetalleOT");
    if (modal) modal.style.display = "flex";
}

function cerrarModalOT() {
    const modal = document.getElementById("modalDetalleOT");
    if (modal) modal.style.display = "none";
}

async function descargarOTPDF() {
    if (!ordenActivaOT) {
        alert("No se ha seleccionado ninguna orden de trabajo.");
        return;
    }

    const labelEstado = document.getElementById("labelEstadoGenerandoPDF");
    const btnDescargar = document.getElementById("btnDescargarOTPDF");

    if (labelEstado) labelEstado.style.display = "flex";
    if (btnDescargar) btnDescargar.disabled = true;

    // Contenedor temporal aislado sin restricciones de scroll del modal
    const tempContainer = document.createElement("div");
    tempContainer.id = "temp_pdf_exporter_root";
    tempContainer.style.position = "fixed";
    tempContainer.style.top = "0";
    tempContainer.style.left = "-9999px";
    tempContainer.style.width = "794px";
    tempContainer.style.backgroundColor = "#ffffff";
    tempContainer.style.zIndex = "-9999";
    tempContainer.style.overflow = "visible";
    tempContainer.style.boxSizing = "border-box";
    tempContainer.innerHTML = generarPlantillaDocumentoOT(ordenActivaOT);
    document.body.appendChild(tempContainer);

    try {
        const folioNombre = (ordenActivaOT.folio || "OT-2026").replace(/[^a-zA-Z0-9_-]/g, "_");
        const nombreArchivo = `${folioNombre}_CORSSEN_Logistica.pdf`;

        // Esperar render de fuentes y estilos
        await new Promise(r => setTimeout(r, 120));

        const targetNode = tempContainer.querySelector("#documentoOficialOT") || tempContainer;

        let jsPDFConstructor = null;
        if (typeof window.jspdf !== "undefined" && window.jspdf.jsPDF) {
            jsPDFConstructor = window.jspdf.jsPDF;
        } else if (typeof window.jsPDF !== "undefined") {
            jsPDFConstructor = window.jsPDF;
        }

        if (typeof html2canvas !== "undefined" && jsPDFConstructor) {
            const canvas = await html2canvas(targetNode, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                width: 794,
                windowWidth: 794,
                scrollX: 0,
                scrollY: 0
            });

            const pdf = new jsPDFConstructor({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Dimensiones hoja A4: 210mm x 297mm
            const marginMm = 8;
            const usableWidthMm = 210 - (marginMm * 2); // 194mm
            const imgHeightMm = (canvas.height * usableWidthMm) / canvas.width;

            const imgData = canvas.toDataURL('image/jpeg', 0.98);
            pdf.addImage(imgData, 'JPEG', marginMm, marginMm, usableWidthMm, imgHeightMm, undefined, 'FAST');
            pdf.save(nombreArchivo);
        } else if (typeof html2pdf !== "undefined") {
            const opt = {
                margin: [8, 8, 8, 8],
                filename: nombreArchivo,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', width: 794, windowWidth: 794 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            await html2pdf().set(opt).from(targetNode).save();
        } else {
            // Fallback directo a comprobante HTML imprimible
            imprimirComprobanteOT();
        }
    } catch (err) {
        console.error("Error al generar PDF:", err);
        alert("Ocurrió un inconveniente al generar el PDF. Abriendo vista de impresión...");
        imprimirComprobanteOT();
    } finally {
        if (tempContainer.parentNode) {
            tempContainer.parentNode.removeChild(tempContainer);
        }
        if (labelEstado) labelEstado.style.display = "none";
        if (btnDescargar) btnDescargar.disabled = false;
    }
}

function imprimirComprobanteOT() {
    if (!ordenActivaOT) {
        alert("No se ha seleccionado ninguna orden de trabajo.");
        return;
    }

    const htmlDocumento = generarPlantillaDocumentoOT(ordenActivaOT);
    const folioTitulo = ordenActivaOT.folio || ordenActivaOT.id || "OT-CORSSEN";

    const htmlCompleto = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Orden de Trabajo ${folioTitulo} - CORSSEN Logística</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        @page {
            size: A4 portrait;
            margin: 8mm;
        }
        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        body {
            margin: 0;
            padding: 12px;
            background: #ffffff;
            color: #0f172a;
            font-family: 'Plus Jakarta Sans', Arial, Helvetica, sans-serif;
        }
        @media print {
            body {
                padding: 0 !important;
            }
            .barra-impresion-controles {
                display: none !important;
            }
        }
        .barra-impresion-controles {
            background: #0f172a;
            color: #ffffff;
            padding: 12px 20px;
            margin: -12px -12px 16px -12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .btn-accion-print {
            background: #2563eb;
            color: #ffffff;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
    </style>
</head>
<body>
    <div class="barra-impresion-controles">
        <div style="font-size: 14px; font-weight: 800;">
            ⚓ CORSSEN LOGÍSTICA • Comprobante Oficial ${folioTitulo}
        </div>
        <div style="display: flex; gap: 10px;">
            <button class="btn-accion-print" onclick="window.print()">🖨️ Enviar a Imprimir</button>
            <button class="btn-accion-print" style="background:#475569;" onclick="window.close()">Cerrar</button>
        </div>
    </div>
    ${htmlDocumento}
    <script>
        window.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                window.print();
            }, 300);
        });
    </script>
</body>
</html>`;

    const blob = new Blob([htmlCompleto], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Abrir en ventana externa independiente para eludir bloqueos de iframes
    const win = window.open(url, '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
        // En caso de que el navegador bloquee popups, se descarga el PDF automáticamente
        descargarOTPDF();
    }
}

function exportarMantencionesCSV() {
    exportarMantencionesExcel();
}

function eliminarMantencion(folio) {
    const idx = mantenciones.findIndex(m => m.folio === folio || m.id === folio);
    if (idx === -1) return;

    if (confirm(`¿Está seguro de eliminar la Orden de Trabajo ${folio}?`)) {
        const orden = mantenciones[idx];
        // Preguntar si desea revertir los insumos consumidos en bodega
        if (orden.insumosConsumidos && orden.insumosConsumidos.length > 0) {
            const revertir = confirm("¿Desea reincorporar los insumos descontados al stock del inventario?");
            if (revertir) {
                orden.insumosConsumidos.forEach(ins => {
                    const stockItem = corssenStock.find(s => s.detalle === ins.detalle || s.modelo === ins.modelo);
                    if (stockItem) {
                        stockItem.stock += ins.cantidad;
                    }
                });
                // Eliminar movimientos de kárdex asociados a esta OT
                inventario = inventario.filter(inv => inv.folioOT !== folio);
            }
        }

        mantenciones.splice(idx, 1);
        guardarTodo();
        renderizarMantenciones();
        renderizarStockInsumos();
        renderizarKardexMovimientos();
        renderizarProgramaMaestro();
        renderizarDashboard();
        renderizarAlertasMantencionesDashboard();
        poblarSelectorEquiposMantencion();
        alert("✓ Registro de mantención eliminado.");
    }
}

function abrirModalEditarOT(folio) {
    const orden = mantenciones.find(m => m.folio === folio || m.id === folio);
    if (!orden) {
        alert("Orden de trabajo no encontrada.");
        return;
    }
    ordenEnEdicionOT = orden;

    const lblFolio = document.getElementById("lblEditOTFolio");
    if (lblFolio) lblFolio.textContent = orden.folio || orden.id;

    const inputHidden = document.getElementById("inputEditOTFolioHidden");
    if (inputHidden) inputHidden.value = orden.folio || orden.id;

    const lblEquipo = document.getElementById("lblEditOTEquipoTexto");
    if (lblEquipo) {
        lblEquipo.textContent = `${orden.codigoEquipo || ''} • ${orden.equipoNombre || ''}`;
    }

    const badgePatente = document.getElementById("badgeEditOTPatente");
    if (badgePatente) {
        badgePatente.textContent = orden.patente ? `Patente: ${orden.patente}` : (orden.codigoEquipo || 'Equipo CORSSEN');
    }

    const inputFecha = document.getElementById("inputEditOTFecha");
    if (inputFecha) inputFecha.value = orden.fecha || new Date().toISOString().split("T")[0];

    const selectTipo = document.getElementById("selectEditOTTipo");
    if (selectTipo) {
        let encontrado = false;
        for (let opt of selectTipo.options) {
            if (opt.value.toLowerCase() === (orden.tipo || "").toLowerCase()) {
                selectTipo.value = opt.value;
                encontrado = true;
                break;
            }
        }
        if (!encontrado) {
            const t = (orden.tipo || "").toLowerCase();
            if (t.includes("10.000") || t.includes("km")) {
                selectTipo.value = "Preventiva 10.000 Kilómetros";
            } else if (t.includes("250")) {
                selectTipo.value = "Preventiva 250 Horas";
            } else if (t.includes("mayor") || t.includes("500") || t.includes("1000")) {
                selectTipo.value = "Preventiva Mayor 500/1000 Hrs";
            } else if (t.includes("correctiva") || t.includes("repara")) {
                selectTipo.value = "Correctiva / Reparación";
            } else if (t.includes("concesionario")) {
                selectTipo.value = "Pauta Oficial Concesionario";
            } else if (t.includes("engrase")) {
                selectTipo.value = "Engrase y Revisión de Niveles";
            } else if (t.includes("inspecci")) {
                selectTipo.value = "Inspección General";
            } else {
                const opt = document.createElement("option");
                opt.value = orden.tipo;
                opt.textContent = orden.tipo;
                selectTipo.appendChild(opt);
                selectTipo.value = orden.tipo;
            }
        }
    }

    const inputHorometro = document.getElementById("inputEditOTHorometroKm");
    if (inputHorometro) inputHorometro.value = orden.horometroKm || "";

    const inputProx = document.getElementById("inputEditOTProxServicio");
    if (inputProx) inputProx.value = orden.proximoServicio || "";

    const selectEstado = document.getElementById("selectEditOTEstado");
    if (selectEstado) {
        let matched = false;
        for (let opt of selectEstado.options) {
            if (opt.value.toLowerCase().includes((orden.estado || "").toLowerCase())) {
                selectEstado.value = opt.value;
                matched = true;
                break;
            }
        }
        if (!matched) selectEstado.value = "Completada (Equipo Operativo)";
    }

    const inputTecnico = document.getElementById("inputEditOTTecnico");
    if (inputTecnico) inputTecnico.value = orden.tecnico || "Alexis Santos";

    const inputTaller = document.getElementById("inputEditOTTaller");
    if (inputTaller) inputTaller.value = orden.taller || "Taller Central CORSSEN";

    const inputManoObra = document.getElementById("inputEditOTCostoManoObra");
    if (inputManoObra) inputManoObra.value = orden.costoManoObra || 0;

    const inputInsumos = document.getElementById("inputEditOTCostoInsumos");
    if (inputInsumos) inputInsumos.value = orden.costoInsumos || 0;

    calcularCostoTotalEditOT();

    const txtDescripcion = document.getElementById("textareaEditOTDescripcion");
    if (txtDescripcion) txtDescripcion.value = orden.descripcion || "";

    // Renderizar insumos registrados
    const contInsumos = document.getElementById("contenedorEditOTInsumos");
    if (contInsumos) {
        if (orden.insumosConsumidos && orden.insumosConsumidos.length > 0) {
            contInsumos.innerHTML = orden.insumosConsumidos.map(i => `
                <div style="background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; padding:5px 10px; font-size:12px; display:inline-flex; align-items:center; gap:6px;">
                    <span style="font-weight:800; color:#0f172a;">${i.cantidad} ${i.medida || 'UN'}</span>
                    <span style="color:#475569;">${i.detalle}</span>
                    <span style="color:#16a34a; font-weight:700;">($${((i.cantidad * i.costoUnitario) || 0).toLocaleString('es-CL')})</span>
                </div>
            `).join("");
        } else {
            contInsumos.innerHTML = `<span style="font-size:12px; color:#94a3b8; font-style:italic;">No se registraron insumos de bodega en esta OT (o servicio externo sin salida de almacén).</span>`;
        }
    }

    // Actualizar etiquetas de Horómetro / KM según equipo y tipo
    actualizarLabelsEditOT();

    const modal = document.getElementById("modalEditarOT");
    if (modal) modal.style.display = "flex";
}

function cerrarModalEditarOT() {
    const modal = document.getElementById("modalEditarOT");
    if (modal) modal.style.display = "none";
    ordenEnEdicionOT = null;
}

function actualizarLabelsEditOT() {
    const inputHorometro = document.getElementById("inputEditOTHorometroKm");
    const selectTipo = document.getElementById("selectEditOTTipo");
    const lblHorometro = document.getElementById("lblEditOTHorometroKm");
    const lblProx = document.getElementById("lblEditOTProxServicio");

    const valLectura = (inputHorometro?.value || "").trim().toLowerCase();
    const tipo = (selectTipo?.value || "").toLowerCase();
    const cod = (ordenEnEdicionOT?.codigoEquipo || "").toUpperCase();

    const esVehiculo = cod.startsWith("CAM") || cod.startsWith("FUR") || cod.startsWith("AUTO") || cod.startsWith("CT");
    const esKm = tipo.includes("10.000") || tipo.includes("kilómetro") || tipo.includes("km") || valLectura.includes("km") || esVehiculo;

    if (lblHorometro) {
        lblHorometro.textContent = esKm ? "Kilometraje Registrado (KM):" : "Horómetro Registrado (HRS):";
    }
    if (lblProx) {
        lblProx.textContent = esKm ? "Próximo Servicio (+10.000 km):" : "Próximo Servicio (+250 hrs):";
    }
}

function alCambiarTipoEditOT() {
    actualizarLabelsEditOT();
    sugerirProximoServicioEditOT();
}

function sugerirProximoServicioEditOT() {
    const inputHorometro = document.getElementById("inputEditOTHorometroKm");
    const inputProx = document.getElementById("inputEditOTProxServicio");
    const selectTipo = document.getElementById("selectEditOTTipo");

    if (!inputHorometro || !inputProx || !selectTipo) return;

    actualizarLabelsEditOT();

    const valLectura = inputHorometro.value.trim();
    const tipo = (selectTipo.value || "").toLowerCase();
    const cod = (ordenEnEdicionOT?.codigoEquipo || "").toUpperCase();

    const esVehiculo = cod.startsWith("CAM") || cod.startsWith("FUR") || cod.startsWith("AUTO") || cod.startsWith("CT");
    const esKm = tipo.includes("10.000") || tipo.includes("kilómetro") || tipo.includes("km") || valLectura.toLowerCase().includes("km") || esVehiculo;

    const numLimpio = parseFloat(valLectura.replace(/\./g, "").replace(/,/g, ".").replace(/[^\d.]/g, ""));
    if (!isNaN(numLimpio) && numLimpio > 0) {
        if (esKm) {
            const proxKm = Math.round(numLimpio + 10000);
            inputProx.value = `${proxKm.toLocaleString('es-CL')} km`;
        } else {
            const proxHrs = Math.round(numLimpio + 250);
            inputProx.value = `${proxHrs.toLocaleString('es-CL')} hrs`;
        }
    }
}

function calcularCostoTotalEditOT() {
    const mo = parseFloat(document.getElementById("inputEditOTCostoManoObra")?.value) || 0;
    const ins = parseFloat(document.getElementById("inputEditOTCostoInsumos")?.value) || 0;
    const total = mo + ins;
    const inputTotal = document.getElementById("inputEditOTCostoTotal");
    if (inputTotal) {
        inputTotal.value = `$${total.toLocaleString('es-CL')}`;
    }
}

function guardarEdicionOT(e) {
    if (e) e.preventDefault();
    if (!ordenEnEdicionOT) return;

    const folio = document.getElementById("inputEditOTFolioHidden")?.value || ordenEnEdicionOT.folio || ordenEnEdicionOT.id;
    const orden = mantenciones.find(m => m.folio === folio || m.id === folio);
    if (!orden) {
        alert("Error: No se encontró la orden de trabajo para guardar.");
        return;
    }

    const fecha = document.getElementById("inputEditOTFecha")?.value;
    const tipo = document.getElementById("selectEditOTTipo")?.value;
    const horometroKm = document.getElementById("inputEditOTHorometroKm")?.value.trim();
    const proximoServicio = document.getElementById("inputEditOTProxServicio")?.value.trim();
    const estado = document.getElementById("selectEditOTEstado")?.value;
    const tecnico = document.getElementById("inputEditOTTecnico")?.value.trim();
    const taller = document.getElementById("inputEditOTTaller")?.value.trim();
    const costoManoObra = parseFloat(document.getElementById("inputEditOTCostoManoObra")?.value) || 0;
    const costoInsumos = parseFloat(document.getElementById("inputEditOTCostoInsumos")?.value) || 0;
    const costoTotal = costoManoObra + costoInsumos;
    const descripcion = document.getElementById("textareaEditOTDescripcion")?.value.trim();

    if (!fecha) return alert("Por favor indique la fecha de ejecución.");
    if (!tecnico) return alert("Por favor indique el técnico responsable.");

    // Actualizar datos de la OT
    orden.fecha = fecha;
    orden.tipo = tipo;
    orden.horometroKm = horometroKm;
    orden.proximoServicio = proximoServicio;
    orden.estado = estado;
    orden.tecnico = tecnico;
    orden.taller = taller;
    orden.costoManoObra = costoManoObra;
    orden.costoInsumos = costoInsumos;
    orden.costoTotal = costoTotal;
    orden.descripcion = descripcion;
    orden.fechaUltimaEdicion = new Date().toISOString();

    // Sincronizar lectura con Ficha Técnica si existe
    const cod = orden.codigoEquipo;
    if (cod && corssenFichas[cod]) {
        if (corssenFichas[cod].historial && corssenFichas[cod].historial.length > 0) {
            const h = corssenFichas[cod].historial.find(item => item.fecha === fecha || (item.descripcion && item.descripcion.includes(folio)));
            if (h) {
                h.horometro = horometroKm;
                h.prox = proximoServicio;
                h.descripcion = `${tipo}: ${descripcion || 'Servicio ejecutado'}`;
            }
        }
    }

    // Sincronizar con el Programa Maestro (corssenPrograma) si esta OT es la más reciente del equipo
    if (cod) {
        const prog = corssenPrograma.find(p => p.cod === cod);
        if (prog) {
            const otsDelEquipo = mantenciones.filter(m => m.codigoEquipo === cod);
            if (otsDelEquipo[0] && (otsDelEquipo[0].folio === folio || otsDelEquipo[0].id === folio)) {
                if (horometroKm) prog.horometro = horometroKm;
                if (proximoServicio) prog.prox = proximoServicio;
                prog.estado = (estado.includes("Proceso") || estado.includes("Taller")) ? "En Taller" : "Operativo";
                prog.responsable = tecnico;
                prog.observaciones = `Mantención ${tipo} (${folio}) actualizada el ${fecha}`;
            }
        }

        // Si es vehículo o maquinaria, actualizar también su kilometraje/horómetro en flota
        const veh = vehiculos.find(v => v.codigo === cod || v.patente === cod || v.patente === orden.patente);
        if (veh && horometroKm) {
            veh.kilometraje = horometroKm;
        }
        const maq = maquinarias.find(m => m.codigoMaquinaria === cod);
        if (maq && horometroKm) {
            maq.horometro = horometroKm;
        }
    }

    guardarTodo();
    renderizarMantenciones();
    renderizarProgramaMaestro();
    renderizarDashboard();
    renderizarAlertasMantencionesDashboard();
    poblarSelectorEquiposMantencion();

    cerrarModalEditarOT();
    alert(`✓ Orden de Trabajo ${folio} actualizada con éxito.`);
}

function actualizarFolioEstimadoBadge() {
    const badge = document.getElementById("badgeFolioEstimado");
    if (!badge) return;
    const numFolio = (mantenciones.length + 1).toString().padStart(3, '0');
    const anioActual = new Date().getFullYear();
    badge.textContent = `Folio Sugerido: OT-${anioActual}-${numFolio}`;
}

function poblarSelectorEquiposMantencion() {
    const select = document.getElementById("selectMantEquipo");
    if (!select) return;

    actualizarFolioEstimadoBadge();

    // Establecer fecha de hoy por defecto si está vacía
    const inputFecha = document.getElementById("inputMantFecha");
    if (inputFecha && !inputFecha.value) {
        inputFecha.value = new Date().toISOString().split("T")[0];
    }

    let html = `<option value="">-- Seleccionar Equipo o Vehículo de la Flota --</option>`;

    // Mapa unificado para evitar duplicados
    const mapaEquipos = new Map();

    // 1. Vehículos
    vehiculos.forEach(v => {
        const cod = (v.codigo || v.patente || v.id || "CAM").toUpperCase();
        mapaEquipos.set(cod, {
            cod,
            cat: "MÓVILES",
            nombre: v.nombre || `Camioneta ${v.marca} ${v.modelo}`,
            marca: v.marca,
            icono: "🚚"
        });
    });

    // 2. Maquinarias
    maquinarias.forEach(m => {
        const cod = (m.numeroMaquinaria || m.id || "").toUpperCase();
        if (!cod) return;
        const tipoMin = (m.tipoMaquinaria || "").toLowerCase();
        let cat = "HORQUILLAS";
        let icono = "🚜";
        if (tipoMin.includes("portacontenedor")) { cat = "PORTACONTENEDORES"; icono = "🏗️"; }
        else if (tipoMin.includes("telescópica") || tipoMin.includes("grúa")) { cat = "GRÚAS"; icono = "🏗️"; }
        else if (tipoMin.includes("auxiliar") || tipoMin.includes("generador")) { cat = "AUXILIARES"; icono = "⚡"; }
        else if (tipoMin.includes("marítimo")) { cat = "MARÍTIMO"; icono = "⚓"; }

        mapaEquipos.set(cod, {
            cod,
            cat,
            nombre: `${m.tipoMaquinaria} (${m.marcaMaquinaria} ${m.modeloMaquinaria})`,
            marca: m.marcaMaquinaria,
            icono
        });
    });

    // 3. Programa Maestro
    corssenPrograma.forEach(p => {
        const cod = (p.cod || "").toUpperCase();
        if (!cod || mapaEquipos.has(cod)) return;

        let icono = "🚜";
        if (p.cat === "MÓVILES") icono = "🚚";
        else if (p.cat === "PORTACONTENEDORES" || p.cat === "GRÚAS") icono = "🏗️";
        else if (p.cat === "AUXILIARES") icono = "⚡";
        else if (p.cat === "MARÍTIMO") icono = "⚓";

        mapaEquipos.set(cod, {
            cod,
            cat: p.cat || "MAQUINARIA",
            nombre: p.equipo,
            marca: p.marca,
            icono
        });
    });

    // Agrupación organizada
    const grupos = {
        "🚚 Camionetas y Vehículos": [],
        "🏗️ Grúas Portacontenedores & Telescópicas": [],
        "🚜 Grúas Horquillas & Maquinaria Pesada": [],
        "⚡ Equipos Auxiliares & Generadores": [],
        "⚓ Embarcaciones & Equipos Marítimos": []
    };

    mapaEquipos.forEach(item => {
        if (item.cat === "MÓVILES") {
            grupos["🚚 Camionetas y Vehículos"].push(item);
        } else if (item.cat === "PORTACONTENEDORES" || item.cat === "GRÚAS") {
            grupos["🏗️ Grúas Portacontenedores & Telescópicas"].push(item);
        } else if (item.cat === "AUXILIARES") {
            grupos["⚡ Equipos Auxiliares & Generadores"].push(item);
        } else if (item.cat === "MARÍTIMO") {
            grupos["⚓ Embarcaciones & Equipos Marítimos"].push(item);
        } else {
            grupos["🚜 Grúas Horquillas & Maquinaria Pesada"].push(item);
        }
    });

    Object.entries(grupos).forEach(([grupo, items]) => {
        if (items.length > 0) {
            html += `<optgroup label="${grupo}">`;
            items.forEach(eq => {
                html += `<option value="${eq.cod}" data-cat="${eq.cat || ''}">${eq.icono} ${eq.cod} • ${eq.nombre}</option>`;
            });
            html += `</optgroup>`;
        }
    });

    select.innerHTML = html;
}

function manejarCambioEquipoMantencion() {
    const cod = document.getElementById("selectMantEquipo")?.value;
    const banner = document.getElementById("bannerInfoEquipoMant");
    const inputHorometro = document.getElementById("inputMantHorometroKm");
    const inputProx = document.getElementById("inputMantProxServicio");

    if (!cod) {
        if (banner) banner.style.display = "none";
        return;
    }

    // Buscar en fichas, vehículos, maquinarias o programa
    const ficha = corssenFichas[cod];
    const veh = vehiculos.find(v => v.codigo === cod || v.patente === cod || v.id === cod);
    const maq = maquinarias.find(m => m.numeroMaquinaria === cod || m.id === cod);
    const prog = corssenPrograma.find(p => p.cod === cod);

    let nombre = "";
    let estado = "Operativo";
    let lecturaActual = "";
    let lecturaNum = 0;
    let patente = cod;
    let tipoIcon = "🚜";
    let responsable = "Alexis Santos";

    if (veh) {
        nombre = veh.nombre || `${veh.marca} ${veh.modelo}`;
        patente = veh.patente ? `Patente: ${veh.patente}` : `Cód: ${cod}`;
        estado = veh.estado || "Operativo";
        lecturaNum = veh.kilometraje || 0;
        lecturaActual = `${lecturaNum.toLocaleString('es-CL')} km`;
        tipoIcon = "🚚";
        responsable = veh.responsable || "Alexis Santos";
    } else if (maq) {
        nombre = `${maq.tipoMaquinaria} (${maq.marcaMaquinaria} ${maq.modeloMaquinaria})`;
        patente = maq.patenteMaquinaria ? `Patente/N°: ${maq.patenteMaquinaria}` : `Cód: ${cod}`;
        estado = maq.estado || "Operativo";
        lecturaNum = maq.horometro || 0;
        lecturaActual = `${lecturaNum.toLocaleString('es-CL')} hrs`;
        tipoIcon = (maq.tipoMaquinaria || "").toLowerCase().includes("portacontenedor") || (maq.tipoMaquinaria || "").toLowerCase().includes("grúa") ? "🏗️" : "🚜";
        responsable = maq.responsable || "Alexis Santos";
    } else if (prog) {
        nombre = `${prog.equipo} (${prog.marca})`;
        patente = `Cód: ${cod}`;
        estado = prog.estado || "Operativo";
        lecturaActual = prog.horometro || "";
        lecturaNum = extraerNumeroHorometro(prog.horometro) || 0;
        tipoIcon = prog.cat === "MARÍTIMO" ? "⚓" : (prog.cat === "AUXILIARES" ? "⚡" : (prog.cat === "MÓVILES" ? "🚚" : "🚜"));
        responsable = prog.responsable || prog.tecnico || "Alexis Santos";
    }

    // Actualizar HUD
    if (banner) {
        banner.style.display = "block";
        const elIcono = document.getElementById("hudEquipoIcono");
        const elCod = document.getElementById("hudEquipoCod");
        const elNombre = document.getElementById("hudEquipoNombre");
        const elBadge = document.getElementById("hudEquipoBadgeEstado");
        const elPatente = document.getElementById("hudEquipoPatente");
        const elLectura = document.getElementById("hudEquipoLectura");
        const elResp = document.getElementById("hudEquipoResponsable");
        const elSpecs = document.getElementById("hudEquipoSpecs");

        if (elIcono) elIcono.textContent = tipoIcon;
        if (elCod) elCod.textContent = cod;
        if (elNombre) elNombre.textContent = nombre;
        if (elPatente) elPatente.textContent = patente;
        if (elLectura) elLectura.innerHTML = `Lectura Actual: <strong>${lecturaActual || '0'}</strong>`;
        if (elResp) elResp.textContent = `Responsable: ${responsable}`;
        
        if (elBadge) {
            elBadge.className = `badge ${obtenerClaseBadge(estado)}`;
            elBadge.textContent = (estado || "OPERATIVO").toUpperCase();
        }

        // Generar Pills de especificaciones técnicas
        if (elSpecs) {
            let specsHtml = "";
            if (ficha) {
                if (ficha.aceites && ficha.aceites.length > 0) {
                    const motOil = ficha.aceites.find(a => a.tipo.toLowerCase().includes("motor")) || ficha.aceites[0];
                    specsHtml += `<span class="hud-spec-pill">🛢️ Motor: <strong>${motOil.viscosidad || motOil.tipo} (${motOil.capacidad || ''})</strong></span>`;
                }
                if (ficha.filtros && ficha.filtros.length > 0) {
                    const fAceite = ficha.filtros.find(f => f.tipo.toLowerCase().includes("aceite")) || ficha.filtros[0];
                    specsHtml += `<span class="hud-spec-pill">⚙️ Filtro: <strong>${fAceite.alt1 || fAceite.codigoOEM || 'Baldwin'}</strong></span>`;
                }
                specsHtml += `<span class="hud-spec-pill" style="border-color:#38bdf8; color:#38bdf8;">✓ Ficha Técnica Oficial Vinculada</span>`;
            } else {
                specsHtml = `<span class="hud-spec-pill" style="color:#94a3b8;">Unidad registrada sin matriz de lubricación extendida.</span>`;
            }
            elSpecs.innerHTML = specsHtml;
        }
    }

    if (inputHorometro && lecturaActual) {
        inputHorometro.value = lecturaActual;
    }

    if (inputProx) {
        if (lecturaActual.includes("km") || esUnidadPorKilometraje(cod)) {
            inputProx.value = `${(lecturaNum + 10000).toLocaleString('es-CL')} km`;
        } else {
            inputProx.value = `${(lecturaNum + 250).toLocaleString('es-CL')} hrs`;
        }
    }

    // Auto-seleccionar tipo de servicio coherente con la unidad (250 Horas para maquinaria / 10.000 Km para camioneta)
    const selectTipo = document.getElementById("selectMantTipo");
    if (selectTipo) {
        const esMovil = lecturaActual.includes("km") || esUnidadPorKilometraje(cod);
        if (esMovil) {
            selectTipo.value = "Preventiva 10.000 Kilómetros";
        } else {
            selectTipo.value = "Preventiva 250 Horas";
        }
    }

    // Actualizar requerimiento de Aceite de Motor desde Ficha Técnica
    actualizarRequerimientoAceiteMantencion(ficha);

    // Auto precargar insumos si la lista está vacía
    const contenedor = document.getElementById("contenedorInsumosDeduccion");
    if (contenedor && contenedor.children.length === 0 && ficha) {
        cargarInsumosSugeridosParaEquipo();
    }
}

function actualizarRequerimientoAceiteMantencion(ficha) {
    const inputLitrosMotor = document.getElementById("inputLitrosAceiteDescontar");
    const inputLitrosHidraulico = document.getElementById("inputLitrosAceiteHidraulicoDescontar");
    const lblSugeridoMotor = document.getElementById("lblInfoAceiteSugeridoFicha");
    const lblSugeridoHidraulico = document.getElementById("lblInfoAceiteHidraulicoSugeridoFicha");
    const lblSaldoMotor = document.getElementById("lblSaldoTamborActualMant");
    const lblSaldoHidraulico = document.getElementById("lblSaldoTambor2ActualMant");
    const lblNombreT1 = document.getElementById("lblNombreTambor1EnMant");
    const lblNombreT2 = document.getElementById("lblNombreTambor2EnMant");

    const t1 = estadoTamboresAceite?.tambor1 || estadoTamborAceite || {};
    const t2 = estadoTamboresAceite?.tambor2 || {};

    if (lblNombreT1) lblNombreT1.textContent = t1.nombre || "Aceite Valvoline Premium Blue 15W40";
    if (lblNombreT2) lblNombreT2.textContent = t2.nombre || "Aceite Hidráulico Valvoline Unitrac 10W30";

    const saldoT1 = t1.actual !== undefined ? t1.actual : 200;
    const saldoT2 = t2.actual !== undefined ? t2.actual : 200;

    if (lblSaldoMotor) {
        lblSaldoMotor.innerHTML = `Saldo disponible: <strong style="color:#1e40af;">${saldoT1.toFixed(1)} Lts</strong>`;
    }
    if (lblSaldoHidraulico) {
        lblSaldoHidraulico.innerHTML = `Saldo disponible: <strong style="color:#15803d;">${saldoT2.toFixed(1)} Lts</strong>`;
    }

    let litrosMotorReq = 0;
    let descMotor = "Sin especificación en ficha";
    let descHidraulico = "Opcional / Según requerimiento";

    if (ficha && ficha.aceites && ficha.aceites.length > 0) {
        const motOil = ficha.aceites.find(a => (a.tipo || "").toLowerCase().includes("motor")) || ficha.aceites[0];
        if (motOil && (motOil.capacidad || motOil.cantidad)) {
            const valStr = String(motOil.capacidad || motOil.cantidad);
            const capNum = parseFloat(valStr.replace(/[^0-9.]/g, ""));
            if (!isNaN(capNum) && capNum > 0) {
                litrosMotorReq = capNum;
                descMotor = `${motOil.viscosidad || motOil.tipo || "15W40"} (${valStr})`;
            }
        }

        const hidOil = ficha.aceites.find(a => (a.tipo || "").toLowerCase().includes("hidráulico") || (a.tipo || "").toLowerCase().includes("hidraulico"));
        if (hidOil && (hidOil.capacidad || hidOil.cantidad)) {
            descHidraulico = `${hidOil.viscosidad || hidOil.tipo || "10W30"} (${hidOil.capacidad || hidOil.cantidad})`;
        }
    }

    if (inputLitrosMotor) {
        inputLitrosMotor.value = litrosMotorReq;
    }
    if (lblSugeridoMotor) {
        lblSugeridoMotor.innerHTML = `Requisito según Ficha: <strong>${litrosMotorReq > 0 ? litrosMotorReq + ' Litros' : 'N/A'}</strong> <span style="font-size:11px; color:#64748b;">(${descMotor})</span>`;
    }

    if (inputLitrosHidraulico && (!inputLitrosHidraulico.value || inputLitrosHidraulico.value === "0")) {
        inputLitrosHidraulico.value = 0;
    }
    if (lblSugeridoHidraulico) {
        lblSugeridoHidraulico.innerHTML = `Capacidad Ficha: <strong>${descHidraulico}</strong>`;
    }

    calcularTotalMantencionForm();
}

function seleccionarTipoRapido(tipo) {
    const select = document.getElementById("selectMantTipo");
    if (select) {
        select.value = tipo;
        alCambiarTipoServicioMantencion();
    }
}

function alCambiarTipoServicioMantencion() {
    const select = document.getElementById("selectMantTipo");
    const tipo = select?.value || "";
    const lblProx = document.getElementById("lblInputMantProxServicio");
    const inputHorometro = document.getElementById("inputMantHorometroKm");

    if (lblProx) {
        if (tipo.includes("10.000") || tipo.includes("Kilómetros") || tipo.includes("Km")) {
            lblProx.textContent = "Próximo Servicio (+10.000 km):";
        } else if (tipo.includes("500") || tipo.includes("1000")) {
            lblProx.textContent = "Próximo Servicio (+500 / +1.000 hrs):";
        } else if (tipo.includes("250") || tipo.includes("Horas")) {
            lblProx.textContent = "Próximo Servicio (+250 hrs):";
        } else {
            lblProx.textContent = "Próximo Servicio Sugerido:";
        }
    }

    if (inputHorometro && inputHorometro.value.trim()) {
        sugerirProximoServicioAutomatico();
    }
}

function insertarPlantillaDescripcion(texto) {
    const textarea = document.getElementById("textareaMantDescripcion");
    if (!textarea) return;
    if (textarea.value.trim() === "") {
        textarea.value = texto;
    } else {
        textarea.value = textarea.value.trim() + " " + texto;
    }
    textarea.focus();
}

function esUnidadPorKilometraje(cod, textoIngresado = "") {
    // Si el usuario seleccionó explícitamente la opción de 10.000 Kilómetros en el menú
    const selectTipo = document.getElementById("selectMantTipo");
    const tipoSeleccionado = selectTipo?.value || "";
    if (tipoSeleccionado.includes("10.000") || tipoSeleccionado.includes("Kilómetros") || tipoSeleccionado.includes("Km")) {
        return true;
    }
    if (tipoSeleccionado.includes("250") || tipoSeleccionado.includes("Horas") || tipoSeleccionado.includes("500")) {
        return false;
    }

    const valLow = (textoIngresado || "").toLowerCase().trim();
    if (valLow.includes("km") || valLow.includes("kilometro")) return true;
    if (valLow.includes("hr") || valLow.includes("hora")) return false;

    if (!cod && !valLow) return false;
    const codUpper = (cod || "").toUpperCase().trim();

    // 1. Si el código empieza con prefijos de camionetas / camiones
    if (codUpper.startsWith("CAM") || codUpper.startsWith("CMN") || codUpper.startsWith("VH") || codUpper.startsWith("PICKUP")) {
        return true;
    }

    // 2. Revisar si la opción seleccionada en el dropdown es móvil
    const select = document.getElementById("selectMantEquipo");
    const opt = select?.selectedOptions?.[0];
    if (opt) {
        const catOpt = (opt.dataset.cat || "").toUpperCase();
        const textoOpt = (opt.textContent || "").toUpperCase();
        if (catOpt === "MÓVILES" || catOpt === "MOVILES" || textoOpt.includes("🚚") || textoOpt.includes("CAMIONETA") || textoOpt.includes("CAMIÓN") || textoOpt.includes("CAMION")) {
            return true;
        }
    }

    // 3. Revisar en listado de vehículos
    if (Array.isArray(vehiculos)) {
        const veh = vehiculos.find(v => {
            const vCod = (v.codigo || "").toUpperCase();
            const vPat = (v.patente || "").toUpperCase();
            const vId = (v.id || "").toUpperCase();
            return vCod === codUpper || vPat === codUpper || vId === codUpper || (codUpper && vPat.includes(codUpper));
        });
        if (veh) return true;
    }

    // 4. Revisar en Programa Maestro
    if (Array.isArray(corssenPrograma)) {
        const prog = corssenPrograma.find(p => {
            const pCod = (p.cod || "").toUpperCase();
            return pCod === codUpper || (codUpper && (p.equipo || "").toUpperCase().includes(codUpper));
        });
        if (prog) {
            const cat = (prog.cat || "").toUpperCase();
            const eqNom = (prog.equipo || "").toUpperCase();
            const freq = (prog.frecuencia || "").toLowerCase();
            const horo = (prog.horometro || "").toLowerCase();
            if (cat === "MÓVILES" || cat === "MOVILES" || freq.includes("km") || horo.includes("km") || eqNom.includes("CAMIONETA") || eqNom.includes("CAMIÓN") || eqNom.includes("CAMION")) {
                return true;
            }
        }
    }

    // 5. Revisar en Fichas Técnicas
    if (typeof corssenFichas !== "undefined" && corssenFichas && corssenFichas[codUpper]) {
        const f = corssenFichas[codUpper];
        const fNom = (f.nombre || "").toUpperCase();
        const fCat = (f.categoria || "").toUpperCase();
        if (fCat.includes("MOVIL") || fCat.includes("MÓVIL") || fNom.includes("CAMIONETA") || fNom.includes("CAMIÓN") || fNom.includes("CAMION")) {
            return true;
        }
    }

    // 6. Heurística numérica: Si el valor numérico supera 6.000 y no es grúa identificada (GPC/GHO/GTE), casi con certeza es kilometraje
    if (valLow) {
        const numLimpio = parseFloat(valLow.replace(/[^0-9]/g, ""));
        if (numLimpio >= 8000 && !codUpper.startsWith("G") && !codUpper.startsWith("X") && !codUpper.startsWith("M")) {
            return true;
        }
    }

    return false;
}

function sugerirProximoServicioAutomatico() {
    const inputHorometro = document.getElementById("inputMantHorometroKm");
    const inputProx = document.getElementById("inputMantProxServicio");
    const selectEquipo = document.getElementById("selectMantEquipo");
    const selectTipo = document.getElementById("selectMantTipo");
    if (!inputHorometro || !inputProx) return;

    const val = inputHorometro.value.trim();
    if (!val) return;

    // Parseo robusto de kilometraje / horómetro tolerante a separadores de miles y unidades
    let sLimpio = val.toLowerCase().replace(/km|kilometros|kilometro|hrs|horas|hora/g, '').trim();
    const match = sLimpio.match(/[\d.,]+/);
    if (!match) return;

    let numStr = match[0];
    if (numStr.includes('.') && numStr.includes(',')) {
        numStr = numStr.replace(/\./g, '').replace(',', '.');
    } else if (numStr.includes('.') && numStr.split('.').length > 1 && numStr.split('.')[1].length === 3) {
        numStr = numStr.replace(/\./g, '');
    } else if (numStr.includes(',')) {
        numStr = numStr.replace(',', '.');
    }
    const num = parseFloat(numStr);
    if (isNaN(num)) return;

    const tipoSeleccionado = selectTipo?.value || "";
    const codigoSel = selectEquipo?.value || "";

    // 1. Si el tipo seleccionado es explícitamente Preventiva 10.000 Km
    if (tipoSeleccionado.includes("10.000") || tipoSeleccionado.includes("Kilómetros") || tipoSeleccionado.includes("Km")) {
        inputProx.value = `${Math.round(num + 10000).toLocaleString('es-CL')} km`;
        return;
    }

    // 2. Si el tipo seleccionado es Preventiva Mayor (500 / 1000 hrs)
    if (tipoSeleccionado.includes("500") || tipoSeleccionado.includes("1000")) {
        inputProx.value = `${Math.round(num + 500).toLocaleString('es-CL')} hrs`;
        return;
    }

    // 3. Si el tipo seleccionado es Preventiva 250 Horas
    if (tipoSeleccionado.includes("250") || tipoSeleccionado.includes("Horas")) {
        inputProx.value = `${Math.round(num + 250).toLocaleString('es-CL')} hrs`;
        return;
    }

    // 4. Fallback por detección del tipo de unidad o texto
    const esKm = esUnidadPorKilometraje(codigoSel, val);
    if (esKm) {
        inputProx.value = `${Math.round(num + 10000).toLocaleString('es-CL')} km`;
    } else {
        inputProx.value = `${Math.round(num + 250).toLocaleString('es-CL')} hrs`;
    }
}

function iniciarMantencionParaEquipo(cod) {
    navegarSeccion("registrarMantencion");
    poblarSelectorEquiposMantencion();
    const select = document.getElementById("selectMantEquipo");
    if (select) {
        select.value = cod;
        manejarCambioEquipoMantencion();
        cargarInsumosSugeridosParaEquipo();
    }
}

function cargarInsumosSugeridosParaEquipo() {
    const cod = document.getElementById("selectMantEquipo")?.value;
    if (!cod) {
        return alert("Por favor seleccione un equipo de la flota primero.");
    }

    const ficha = corssenFichas[cod];
    const contenedor = document.getElementById("contenedorInsumosDeduccion");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (!ficha) {
        // Sugerir un lubricante estándar y filtro
        agregarFilaInsumoDeduccion(0, 1);
        calcularTotalMantencionForm();
        return;
    }

    // 1. Sugerir Aceite de Motor
    if (ficha.aceites && ficha.aceites.length > 0) {
        const aceiteMotor = ficha.aceites.find(a => a.tipo.toLowerCase().includes("motor")) || ficha.aceites[0];
        if (aceiteMotor) {
            const idxStock = corssenStock.findIndex(s => s.categoria.toLowerCase().includes("lubricante") || s.detalle.toLowerCase().includes("aceite") || s.detalle.toLowerCase().includes("valvoline"));
            if (idxStock !== -1) {
                // Calcular bidones o baldes aproximados
                agregarFilaInsumoDeduccion(idxStock, 1);
            }
        }
    }

    // 2. Sugerir Filtro de Aceite o Combustible
    if (ficha.filtros && ficha.filtros.length > 0) {
        const primerFiltro = ficha.filtros[0];
        const idxStockFiltro = corssenStock.findIndex(s => s.categoria.toLowerCase().includes("filtro") && (s.modelo.includes(primerFiltro.alt1 || '') || s.detalle.toLowerCase().includes("aceite") || s.detalle.toLowerCase().includes("filtro")));
        if (idxStockFiltro !== -1) {
            agregarFilaInsumoDeduccion(idxStockFiltro, 1);
        } else {
            const algunFiltro = corssenStock.findIndex(s => s.categoria.toLowerCase().includes("filtro"));
            if (algunFiltro !== -1) {
                agregarFilaInsumoDeduccion(algunFiltro, 1);
            }
        }
    }

    calcularTotalMantencionForm();
}

function agregarFilaInsumoDeduccion(preselectedStockIdx = null, preselectedCant = 1) {
    const contenedor = document.getElementById("contenedorInsumosDeduccion");
    if (!contenedor) return;

    const fila = document.createElement("div");
    fila.className = "fila-insumo-card";

    const opcionesStock = corssenStock.map((item, idx) => {
        const selected = (preselectedStockIdx !== null && idx === preselectedStockIdx) ? "selected" : "";
        const stockStatus = item.stock <= 0 ? "⚠️ AGOTADO (0)" : `${item.stock} ${item.medida}`;
        return `<option value="${idx}" data-costo="${item.costo || 0}" data-stock="${item.stock || 0}" data-medida="${item.medida}" ${selected}>
            ${item.detalle} (${item.marca} - ${item.modelo}) [Stock: ${stockStatus}] - $${(item.costo || 0).toLocaleString('es-CL')}
        </option>`;
    }).join("");

    const itemInicial = (preselectedStockIdx !== null && corssenStock[preselectedStockIdx]) ? corssenStock[preselectedStockIdx] : corssenStock[0];
    const costoUnit = itemInicial ? (itemInicial.costo || 0) : 0;
    const subtotal = costoUnit * preselectedCant;

    fila.innerHTML = `
        <div>
            <label class="label-mobile-insumo">Insumo de Bodega:</label>
            <select class="select-insumo-stock" onchange="actualizarSubtotalFilaInsumo(this.closest('.fila-insumo-card'))" style="width:100%; padding:10px 12px; border:1.5px solid #cbd5e1; border-radius:8px; font-size:13px; font-weight:600; background:#ffffff; color:#0f172a;">
                ${opcionesStock}
            </select>
        </div>
        <div class="fila-insumo-mobile-row">
            <div>
                <label class="label-mobile-insumo">Cantidad:</label>
                <div style="display:flex; align-items:center; gap:6px;">
                    <input type="number" class="input-cant-insumo" value="${preselectedCant}" min="1" max="999" oninput="actualizarSubtotalFilaInsumo(this.closest('.fila-insumo-card'))" style="width:100%; min-width:60px; padding:9px 10px; border:1.5px solid #cbd5e1; border-radius:8px; font-size:13.5px; font-weight:700; text-align:center;" placeholder="Cant.">
                </div>
            </div>
            <div style="font-size:13px; color:#475569; padding:0 4px;">
                <label class="label-mobile-insumo">Unitario:</label>
                <span class="lbl-costo-unit" style="font-weight:700; color:#0f172a;">$${costoUnit.toLocaleString('es-CL')}</span>
            </div>
            <div style="font-size:14px; font-weight:800; color:#2563eb; padding:0 4px;">
                <label class="label-mobile-insumo">Subtotal:</label>
                <span class="lbl-subtotal-fila">$${subtotal.toLocaleString('es-CL')}</span>
            </div>
            <div style="text-align:center;">
                <button type="button" class="btn-peligro" style="padding:8px 12px; font-size:14px; border-radius:8px; display:inline-flex; align-items:center; justify-content:center; min-height:38px; width:100%;" onclick="eliminarFilaInsumoDeduccion(this)" title="Quitar este insumo">
                    🗑️
                </button>
            </div>
        </div>
    `;

    contenedor.appendChild(fila);
    calcularTotalMantencionForm();
}

function eliminarFilaInsumoDeduccion(btn) {
    const fila = btn.closest(".fila-insumo-card") || btn.closest(".fila-insumo-deduccion");
    if (fila) {
        fila.remove();
        calcularTotalMantencionForm();
    }
}

function actualizarSubtotalFilaInsumo(fila) {
    if (!fila) return;
    const select = fila.querySelector(".select-insumo-stock");
    const inputCant = fila.querySelector(".input-cant-insumo");
    const lblUnit = fila.querySelector(".lbl-costo-unit");
    const lblSub = fila.querySelector(".lbl-subtotal-fila");

    const option = select?.options[select.selectedIndex];
    const costoUnit = parseFloat(option?.dataset.costo) || 0;
    const cant = parseInt(inputCant?.value) || 0;
    const subtotal = costoUnit * cant;

    if (lblUnit) lblUnit.textContent = `$${costoUnit.toLocaleString('es-CL')}`;
    if (lblSub) lblSub.textContent = `$${subtotal.toLocaleString('es-CL')}`;

    calcularTotalMantencionForm();
}

function calcularTotalMantencionForm() {
    const filas = document.querySelectorAll(".fila-insumo-card, .fila-insumo-deduccion");
    let totalInsumos = 0;

    filas.forEach(f => {
        const select = f.querySelector(".select-insumo-stock");
        const inputCant = f.querySelector(".input-cant-insumo");
        const option = select?.options[select.selectedIndex];
        const costoUnit = parseFloat(option?.dataset.costo) || 0;
        const cant = parseInt(inputCant?.value) || 0;
        totalInsumos += (costoUnit * cant);
    });

    // Calcular costo de Aceite Tambor 1 (Motor 15W-40)
    const litrosMotor = parseFloat(document.getElementById("inputLitrosAceiteDescontar")?.value) || 0;
    const costoLitroMotor = estadoTamboresAceite?.tambor1?.costoPorLitro || 2750;
    const subtotalMotor = litrosMotor * costoLitroMotor;

    const lblCostoMotor = document.getElementById("lblCostoAceiteOT");
    if (lblCostoMotor) {
        lblCostoMotor.textContent = `$${subtotalMotor.toLocaleString('es-CL')}`;
    }

    // Calcular costo de Aceite Tambor 2 (Hidráulico 10W-30)
    const litrosHidraulico = parseFloat(document.getElementById("inputLitrosAceiteHidraulicoDescontar")?.value) || 0;
    const costoLitroHidraulico = estadoTamboresAceite?.tambor2?.costoPorLitro || 2600;
    const subtotalHidraulico = litrosHidraulico * costoLitroHidraulico;

    const lblCostoHidraulico = document.getElementById("lblCostoAceiteHidraulicoOT");
    if (lblCostoHidraulico) {
        lblCostoHidraulico.textContent = `$${subtotalHidraulico.toLocaleString('es-CL')}`;
    }

    const subtotalLubricantesTotal = subtotalMotor + subtotalHidraulico;
    const litrosTotalesOT = litrosMotor + litrosHidraulico;

    const lblTotalLub = document.getElementById("lblTotalLubricantesOT");
    if (lblTotalLub) {
        lblTotalLub.textContent = `$${subtotalLubricantesTotal.toLocaleString('es-CL')}`;
    }
    const lblTotalLitrosLub = document.getElementById("lblTotalLitrosLubricantesOT");
    if (lblTotalLitrosLub) {
        lblTotalLitrosLub.textContent = `${litrosTotalesOT.toFixed(1)} Lts`;
    }

    const costoManoObra = parseFloat(document.getElementById("inputMantCostoManoObra")?.value) || 0;
    const totalOT = totalInsumos + subtotalLubricantesTotal + costoManoObra;

    const elResumenInsumos = document.getElementById("resumenCostoInsumos");
    const elCardInsumos = document.getElementById("labelSubtotalInsumosCard");
    const elTotalOT = document.getElementById("labelMantCostoTotal");

    if (elResumenInsumos) elResumenInsumos.textContent = `$${(totalInsumos + subtotalLubricantesTotal).toLocaleString('es-CL')}`;
    if (elCardInsumos) elCardInsumos.textContent = `$${(totalInsumos + subtotalLubricantesTotal).toLocaleString('es-CL')}`;
    if (elTotalOT) elTotalOT.textContent = `$${totalOT.toLocaleString('es-CL')}`;
}

function registrarNuevaMantencion(e) {
    e.preventDefault();

    const selectEquipo = document.getElementById("selectMantEquipo");
    const codigoEquipo = selectEquipo?.value;
    const fecha = document.getElementById("inputMantFecha")?.value;
    const tipo = document.getElementById("selectMantTipo")?.value;
    const horometroKm = document.getElementById("inputMantHorometroKm")?.value.trim();
    const proximoServicio = document.getElementById("inputMantProxServicio")?.value.trim();
    const tecnico = document.getElementById("inputMantTecnico")?.value.trim() || "Alexis Santos";
    const taller = document.getElementById("inputMantTaller")?.value.trim() || "Taller Central";
    const estado = document.getElementById("selectMantEstado")?.value || "Completada";
    const costoManoObra = parseFloat(document.getElementById("inputMantCostoManoObra")?.value) || 0;
    const descripcion = (document.getElementById("textareaMantDescripcion") || document.getElementById("inputMantDescripcion"))?.value.trim();

    if (!codigoEquipo) return alert("Por favor seleccione el equipo o vehículo.");
    if (!fecha) return alert("Por favor seleccione la fecha del servicio.");

    const solicitudes = new Map();
    for(const fila of document.querySelectorAll(".fila-insumo-card, .fila-insumo-deduccion")) {
        const raw=fila.querySelector(".select-insumo-stock")?.value;
        if(raw === "" || raw === undefined)continue;
        const index=Number(raw),cantidad=Number(fila.querySelector(".input-cant-insumo")?.value);
        if(!Number.isInteger(index)||!corssenStock[index]||!Number.isInteger(cantidad)||cantidad<=0)return alert("Revisa los insumos y cantidades de la orden de trabajo.");
        solicitudes.set(index,(solicitudes.get(index)||0)+cantidad);
    }
    for(const [index,cantidad] of solicitudes)if(cantidad>Number(corssenStock[index].stock||0))return alert("Stock insuficiente para completar la orden de trabajo. No se descontaron insumos.");
    for(const [inputId,tambor] of [["inputLitrosAceiteDescontar",estadoTamboresAceite?.tambor1||estadoTamborAceite],["inputLitrosAceiteHidraulicoDescontar",estadoTamboresAceite?.tambor2]]) {
        const litros=Number(document.getElementById(inputId)?.value || 0);
        if(!Number.isFinite(litros)||litros<0||litros>Number(tambor?.actual ?? 0))return alert("Saldo de aceite insuficiente o cantidad inválida. No se descontaron insumos.");
    }

    // Obtener información del equipo
    const veh = vehiculos.find(v => v.codigo === codigoEquipo || v.patente === codigoEquipo || v.id === codigoEquipo);
    const maq = maquinarias.find(m => m.numeroMaquinaria === codigoEquipo || m.id === codigoEquipo);
    const prog = corssenPrograma.find(p => p.cod === codigoEquipo);

    let patente = "";
    let equipoNombre = "";
    if (veh) {
        patente = veh.patente || "";
        equipoNombre = veh.nombre || `${veh.marca} ${veh.modelo}`;
    } else if (maq) {
        patente = maq.patenteMaquinaria || "";
        equipoNombre = `${maq.tipoMaquinaria} (${maq.marcaMaquinaria} ${maq.modeloMaquinaria})`;
    } else if (prog) {
        equipoNombre = `${prog.equipo} (${prog.marca})`;
    }

    // Generar Folio OT
    const numFolio = (mantenciones.length + 1).toString().padStart(3, '0');
    const anioActual = new Date().getFullYear();
    const folio = `OT-${anioActual}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;

    // 1. Recolectar Insumos de Bodega General para Deducción del Inventario
    const filasInsumos = document.querySelectorAll(".fila-insumo-card, .fila-insumo-deduccion");
    const insumosConsumidos = [];
    let costoInsumos = 0;

    filasInsumos.forEach(f => {
        const select = f.querySelector(".select-insumo-stock");
        const inputCant = f.querySelector(".input-cant-insumo");
        const idxStock = parseInt(select?.value);
        const cant = parseInt(inputCant?.value) || 0;

        if (!isNaN(idxStock) && corssenStock[idxStock] && cant > 0) {
            const itemStock = corssenStock[idxStock];
            const costoUnit = itemStock.costo || 0;
            const subtotal = costoUnit * cant;
            costoInsumos += subtotal;

            // Deducir del stock en tiempo real
            itemStock.stock = Math.max(0, itemStock.stock - cant);

            insumosConsumidos.push({
                detalle: itemStock.detalle,
                modelo: itemStock.modelo,
                marca: itemStock.marca,
                cantidad: cant,
                medida: itemStock.medida,
                costoUnitario: costoUnit,
                costoTotal: subtotal
            });

            // Registrar movimiento en Kárdex
            inventario.unshift({
                id: `MOV-${Date.now()}-${Math.floor(Math.random()*1000)}`,
                tipo: "EGRESO",
                fecha,
                folioOT: folio,
                codigoEquipo,
                equipoNombre,
                insumoDetalle: `${itemStock.detalle} (${itemStock.modelo})`,
                cantidad: cant,
                medida: itemStock.medida,
                costoUnitario: costoUnit,
                costoTotal: subtotal,
                responsable: tecnico,
                stockRestante: itemStock.stock
            });
        }
    });

    // 2. Deducir Aceite de Motor (Tambor 1 - 200L)
    const litrosMotor = parseFloat(document.getElementById("inputLitrosAceiteDescontar")?.value) || 0;
    let costoMotorTotal = 0;
    const t1 = estadoTamboresAceite?.tambor1 || estadoTamborAceite;

    if (litrosMotor > 0 && t1) {
        const costoLitro = t1.costoPorLitro || 2750;
        costoMotorTotal = litrosMotor * costoLitro;
        costoInsumos += costoMotorTotal;

        // Descontar saldo del tambor 1
        t1.actual = Math.max(0, (t1.actual !== undefined ? t1.actual : 200) - litrosMotor);

        insumosConsumidos.push({
            detalle: `Aceite a Granel Motor (${t1.nombre || 'Valvoline 15W-40'})`,
            modelo: "Tambor 1 (200L)",
            marca: "Valvoline",
            cantidad: litrosMotor,
            medida: "LITROS",
            costoUnitario: costoLitro,
            costoTotal: costoMotorTotal
        });

        historialConsumoAceite.unshift({
            id: `ACEITE-T1-${Date.now()}`,
            tamborId: "tambor1",
            tipoAceite: "Aceite de Motor (15W-40)",
            nombreAceite: t1.nombre || "Aceite Valvoline Premium Blue 15W40 CI-4",
            fecha,
            folioOT: folio,
            codigoEquipo,
            equipoNombre,
            tipoMantencion: tipo,
            litrosDescontados: litrosMotor,
            saldoRestante: t1.actual,
            costoTotal: costoMotorTotal,
            tecnico
        });
    }

    // 2.1. Deducir Aceite Hidráulico (Tambor 2 - 200L)
    const litrosHidraulico = parseFloat(document.getElementById("inputLitrosAceiteHidraulicoDescontar")?.value) || 0;
    let costoHidraulicoTotal = 0;
    const t2 = estadoTamboresAceite?.tambor2;

    if (litrosHidraulico > 0 && t2) {
        const costoLitroH = t2.costoPorLitro || 2600;
        costoHidraulicoTotal = litrosHidraulico * costoLitroH;
        costoInsumos += costoHidraulicoTotal;

        // Descontar saldo del tambor 2
        t2.actual = Math.max(0, (t2.actual !== undefined ? t2.actual : 200) - litrosHidraulico);

        insumosConsumidos.push({
            detalle: `Aceite a Granel Hidráulico (${t2.nombre || 'Unitrac 10W-30'})`,
            modelo: "Tambor 2 (200L)",
            marca: "Valvoline",
            cantidad: litrosHidraulico,
            medida: "LITROS",
            costoUnitario: costoLitroH,
            costoTotal: costoHidraulicoTotal
        });

        historialConsumoAceite.unshift({
            id: `ACEITE-T2-${Date.now()}`,
            tamborId: "tambor2",
            tipoAceite: "Aceite Hidráulico (10W-30)",
            nombreAceite: t2.nombre || "Aceite Hidráulico Valvoline Unitrac 10W30",
            fecha,
            folioOT: folio,
            codigoEquipo,
            equipoNombre,
            tipoMantencion: tipo,
            litrosDescontados: litrosHidraulico,
            saldoRestante: t2.actual,
            costoTotal: costoHidraulicoTotal,
            tecnico
        });
    }

    const costoTotal = costoInsumos + costoManoObra;

    // Crear registro de mantención
    const litrosAceiteTotal = litrosMotor + litrosHidraulico;
    const nuevaMantencion = {
        id: folio,
        folio,
        codigoEquipo,
        patente,
        equipoNombre,
        fecha,
        tipo,
        horometroKm,
        proximoServicio,
        tecnico,
        taller,
        descripcion: descripcion || `${tipo} ejecutada en ${taller}`,
        insumosConsumidos,
        litrosAceiteDescontados: litrosAceiteTotal,
        litrosMotorDescontados: litrosMotor,
        litrosHidraulicoDescontados: litrosHidraulico,
        costoInsumos,
        costoManoObra,
        costoTotal,
        estado,
        fechaRegistro: new Date().toISOString()
    };

    mantenciones.unshift(nuevaMantencion);

    // Actualizar historial en Ficha Técnica si existe
    if (corssenFichas[codigoEquipo]) {
        if (!corssenFichas[codigoEquipo].historial) corssenFichas[codigoEquipo].historial = [];
        const insumosResumen = insumosConsumidos.map(i => `${i.cantidad} ${i.medida || 'UN'} de ${i.detalle}`).join(", ");
        corssenFichas[codigoEquipo].historial.unshift({
            fecha,
            horometro: horometroKm,
            prox: proximoServicio,
            descripcion: `${tipo}: ${descripcion || 'Servicio ejecutado'}`,
            insumos: insumosResumen || "Sin insumos de bodega"
        });
    }

    // Actualizar horómetro/prox en Programa Maestro (corssenPrograma)
    if (prog) {
        if (horometroKm) prog.horometro = horometroKm;
        if (proximoServicio) prog.prox = proximoServicio;
        prog.estado = (estado === "En Progreso" ? "En Taller" : "Operativo");
        prog.observaciones = `Mantención ${tipo} (${folio}) ejecutada el ${fecha}`;
    } else {
        const cat = veh ? "MÓVILES" : (maq ? "GRÚAS" : "MAQUINARIA");
        corssenPrograma.push({
            cod: codigoEquipo,
            equipo: equipoNombre || codigoEquipo,
            marca: (veh ? veh.marca : (maq ? maq.marcaMaquinaria : "CORSSEN")).toUpperCase(),
            cat: cat,
            estado: (estado === "En Progreso" ? "En Taller" : "Operativo"),
            prioridad: "Media",
            horometro: horometroKm || "0",
            frecuencia: horometroKm?.includes("km") ? "10000 kilometros" : "250 horas",
            prox: proximoServicio || "250 hrs",
            responsable: tecnico,
            observaciones: `Mantención ${tipo} (${folio}) ejecutada el ${fecha}`
        });
    }

    // Actualizar kilometraje/horómetro en vehículos/maquinaria
    if (veh && horometroKm) {
        const kmNum = parseFloat(horometroKm.replace(/[^0-9]/g, ""));
        if (!isNaN(kmNum) && kmNum > 0) veh.kilometraje = kmNum;
        if (estado === "En Progreso") veh.estado = "En Mantenimiento";
        else veh.estado = "Operativo";
    } else if (maq && horometroKm) {
        const hrNum = parseFloat(horometroKm.replace(/[^0-9]/g, ""));
        if (!isNaN(hrNum) && hrNum > 0) maq.horometro = hrNum;
        if (estado === "En Progreso") maq.estado = "En Mantenimiento";
        else maq.estado = "Operativo";
    }

    // Guardar cambios y sincronizar todas las vistas
    guardarTodo();
    poblarSelectorEquiposMantencion();
    poblarSelectorEquiposCompatiblesStock();
    renderizarSelectorFichas();
    renderizarMantenciones();
    renderizarStockInsumos();
    renderizarKardexMovimientos();
    renderizarModuloAceite();
    renderizarProgramaMaestro();
    renderizarFlotaRegistrada();
    renderizarDashboard();
    renderizarAlertasMantencionesDashboard();

    if (typeof equipoSeleccionado !== "undefined" && equipoSeleccionado === codigoEquipo) {
        renderizarDetalleFichaTecnica();
    }

    // Resetear formulario y navegar a la lista
    document.getElementById("formNuevaMantencion")?.reset();
    const contenedorInsumos = document.getElementById("contenedorInsumosDeduccion");
    if (contenedorInsumos) contenedorInsumos.innerHTML = "";
    const bannerInfo = document.getElementById("bannerInfoEquipoMant");
    if (bannerInfo) bannerInfo.style.display = "none";
    const inputLitrosAceite = document.getElementById("inputLitrosAceiteDescontar");
    if (inputLitrosAceite) inputLitrosAceite.value = 0;
    const inputLitrosAceiteH = document.getElementById("inputLitrosAceiteHidraulicoDescontar");
    if (inputLitrosAceiteH) inputLitrosAceiteH.value = 0;
    calcularTotalMantencionForm();

    let msgAceite = "";
    if (litrosMotor > 0) {
        msgAceite += `🛢️ Tambor 1 (Motor): Descontados ${litrosMotor} L (Saldo: ${(t1?.actual ?? 0).toFixed(1)} L)\n`;
    }
    if (litrosHidraulico > 0) {
        msgAceite += `🛢️ Tambor 2 (Hidráulico): Descontados ${litrosHidraulico} L (Saldo: ${(t2?.actual ?? 0).toFixed(1)} L)\n`;
    }

    alert(`✓ Mantención registrada exitosamente con Folio ${folio}.\n${msgAceite}Se han descontado ${insumosConsumidos.length} insumos y registrado en el historial.`);
    navegarSeccion("gestionMantenciones");
}

function toggleMenuMobile(abrir) {
    const sidebar = document.getElementById("sidebarApp");
    const overlay = document.getElementById("sidebarMobileOverlay");
    if (!sidebar || !overlay) return;

    if (abrir === undefined) {
        abrir = !sidebar.classList.contains("mobile-open");
    }

    if (abrir) {
        sidebar.classList.add("mobile-open");
        overlay.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevenir scroll de fondo en iOS/Android
    } else {
        sidebar.classList.remove("mobile-open");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
    }
}

function navegarSeccion(idSeccion) {
    const paneles = document.querySelectorAll(".panel");
    paneles.forEach(p => p.classList.remove("active"));

    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach(m => m.classList.remove("active"));

    const panelDestino = document.getElementById(idSeccion);
    if (panelDestino) {
        panelDestino.classList.add("active");
    }

    if (idSeccion === "gestionMantenciones" && typeof renderizarMantenciones === "function") {
        renderizarMantenciones();
    }

    if (idSeccion === "respaldosMantencion") {
        const u = (sessionStorage.getItem("usuarioLogueado") || "").toLowerCase().trim();
        if (u !== "admin") {
            alert("⛔ Acceso Restringido: El módulo de Respaldos & Mantención es exclusivo para el Administrador General (admin).");
            navegarSeccion("dashboard");
            return;
        }
        if (typeof window.renderizarModuloRespaldos === "function") {
            window.renderizarModuloRespaldos();
        }
    }

    if ((idSeccion === "moduloAceite" || idSeccion === "dashboard") && typeof window.renderizarModuloAceite === "function") {
        window.renderizarModuloAceite();
    }

    if (idSeccion === "registrarCarga" && typeof renderizarModuloCombustible === "function") {
        renderizarModuloCombustible();
    }

    if (idSeccion === "fichasEquipos") {
        actualizarPermisosFichasTecnicas();
    }

    if (idSeccion === "vehiculos") {
        actualizarPermisosFlotaRegistrada();
        renderizarFlotaRegistrada();
    }

    if (idSeccion === "videoTutoriales") {
        iniciarModuloVideoTutoriales();
    }

    if (idSeccion === "controlVentanaMantenimiento") {
        const u = (sessionStorage.getItem("usuarioLogueado") || "").toLowerCase().trim();
        if (u !== "admin") {
            alert("⛔ Acceso Denegado: Este módulo de control de ventana de mantenimiento y restricción de conexiones es exclusivo para el Administrador General (admin).");
            navegarSeccion("dashboard");
            return;
        }
        if (typeof window.cargarModuloVentanaMantenimiento === "function") {
            window.cargarModuloVentanaMantenimiento();
        }
    }

    if (idSeccion === "centroSoporteInterno") {
        const u = (sessionStorage.getItem("usuarioLogueado") || "").toLowerCase().trim();
        if (u !== "admin") {
            alert("⛔ Acceso Restringido: El Centro de Mensajes & Soporte es exclusivo para el Administrador General (admin).");
            navegarSeccion("dashboard");
            return;
        }
        if (typeof window.cargarConversacionesAdmin === "function") {
            window.cargarConversacionesAdmin(true);
        }
    }

    if ((idSeccion === "registrarVehiculo" || idSeccion === "registrarMaquinaria") && !esUsuarioAdministrador()) {
        alert("⛔ Acceso Restringido: Únicamente los usuarios con rol de Administrador pueden dar de alta o editar unidades de la flota.");
        navegarSeccion("vehiculos");
        return;
    }

    const menuItemActivo = document.querySelector(`.menu-item[href="#${idSeccion}"]`);
    if (menuItemActivo) {
        menuItemActivo.classList.add("active");
    }

    // Si estamos en mobile/tablet, cerrar el menú tras hacer clic
    if (window.innerWidth <= 1024) {
        toggleMenuMobile(false);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function iniciarModuloVideoTutoriales() {
    seleccionarVideoTutorial(tutorialActivoKey, false);
}

function toggleVozNarrador() {
    tutorialVozActivada = !tutorialVozActivada;
    const btn = document.getElementById("btnToggleVozNarracion");
    const badge = document.getElementById("badgeEstadoVozVideo");

    if (tutorialVozActivada) {
        if (btn) {
            btn.innerHTML = "🔊 Voz: Activa";
            btn.style.background = "#059669";
            btn.style.borderColor = "#059669";
        }
        if (badge) {
            badge.textContent = "🔊 Narración por Voz Activa";
            badge.className = "badge badge-verde";
        }
        narrarPasoActual();
    } else {
        if (btn) {
            btn.innerHTML = "🔇 Voz: Silenciada";
            btn.style.background = "#64748b";
            btn.style.borderColor = "#64748b";
        }
        if (badge) {
            badge.textContent = "🔇 Narración Silenciada";
            badge.className = "badge badge-gris";
        }
        detenerNarracionVoz();
    }
}

function detenerNarracionVoz() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
            window.speechSynthesis.cancel();
        } catch (e) {
            // Ignorar errores de cancelación
        }
    }
    if (tutorialAudioTimeout) {
        clearTimeout(tutorialAudioTimeout);
        tutorialAudioTimeout = null;
    }
}

function narrarPasoActual() {
    detenerNarracionVoz();
    if (!tutorialVozActivada) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const tutorial = TUTORIAL_VIDEOS[tutorialActivoKey];
    if (!tutorial) return;
    const paso = tutorial.pasos[tutorialPasoIndex];
    if (!paso) return;

    const textoLocucion = `${paso.tituloPaso}. ${paso.textoExplicativo}`;

    try {
        const utter = new SpeechSynthesisUtterance(textoLocucion);
        utter.lang = "es-ES";
        utter.rate = 1.0;
        utter.pitch = 1.0;

        // Seleccionar una voz preferente en español si está disponible en el navegador
        const voces = window.speechSynthesis.getVoices();
        const vozEspanol = voces.find(v => v.lang.startsWith("es"));
        if (vozEspanol) {
            utter.voice = vozEspanol;
        }

        // Al terminar de hablar, si el video sigue reproduciéndose automáticamente, avanzar al siguiente paso
        utter.onend = function() {
            if (tutorialReproduciendo) {
                tutorialAudioTimeout = setTimeout(() => {
                    pasoTutorialSiguiente();
                }, 1800);
            }
        };

        utter.onerror = function() {
            // Si falla la síntesis, continuar el flujo
        };

        window.speechSynthesis.speak(utter);
    } catch (err) {
        console.warn("No fue posible emitir la narración de audio:", err);
    }
}

function repetirNarracionActual() {
    tutorialVozActivada = true;
    const btn = document.getElementById("btnToggleVozNarracion");
    const badge = document.getElementById("badgeEstadoVozVideo");
    if (btn) {
        btn.innerHTML = "🔊 Voz: Activa";
        btn.style.background = "#059669";
        btn.style.borderColor = "#059669";
    }
    if (badge) {
        badge.textContent = "🔊 Narración por Voz Activa";
        badge.className = "badge badge-verde";
    }
    narrarPasoActual();
}

function seleccionarVideoTutorial(key, reproducirAuto = true) {
    if (!TUTORIAL_VIDEOS[key]) key = "operador";
    tutorialActivoKey = key;
    tutorialPasoIndex = 0;

    const btnOp = document.getElementById("btnTabVideoOperador");
    const btnAd = document.getElementById("btnTabVideoAdmin");

    if (btnOp && btnAd) {
        if (key === "operador") {
            btnOp.className = "btn-primario";
            btnAd.className = "btn-secundario";
        } else {
            btnOp.className = "btn-secundario";
            btnAd.className = "btn-primario";
        }
    }

    renderizarPasoTutorialActual();
    renderizarCapitulosTutorial();

    if (reproducirAuto) {
        iniciarReproduccionTutorial();
    }
}

function renderizarPasoTutorialActual() {
    const tutorial = TUTORIAL_VIDEOS[tutorialActivoKey];
    if (!tutorial) return;

    const paso = tutorial.pasos[tutorialPasoIndex];
    if (!paso) return;

    // Encabezado
    const tituloHeader = document.getElementById("videoTituloHeader");
    const badgeRol = document.getElementById("videoBadgeRol");
    const tiempoTexto = document.getElementById("videoTiempoTexto");
    const barraProgreso = document.getElementById("videoBarraProgreso");

    if (tituloHeader) tituloHeader.textContent = tutorial.titulo;
    if (badgeRol) {
        badgeRol.textContent = tutorial.badgeTexto;
        badgeRol.className = `badge ${tutorial.badgeClase}`;
    }
    if (tiempoTexto) {
        tiempoTexto.textContent = `Paso ${tutorialPasoIndex + 1} de ${tutorial.pasos.length}`;
    }
    if (barraProgreso) {
        const pct = ((tutorialPasoIndex + 1) / tutorial.pasos.length) * 100;
        barraProgreso.style.width = `${pct}%`;
    }

    // Pantalla de la aplicación en video
    const modActual = document.getElementById("videoPantallaModuloActual");
    const usuSim = document.getElementById("videoPantallaUsuario");
    const escenario = document.getElementById("videoEscenarioContenido");

    if (modActual) modActual.textContent = paso.modulo;
    if (usuSim) usuSim.textContent = tutorial.usuarioSimulado;
    if (escenario) {
        escenario.innerHTML = `
            <div style="animation: fadeIn 0.3s ease; width:100%; display:flex; flex-direction:column; align-items:center;">
                ${paso.htmlEscenario}
            </div>
        `;
    }

    // Subtítulos y textos explicativos inferiores
    const iconoPaso = document.getElementById("videoIconoPaso");
    const subTitulo = document.getElementById("videoSubtituloTitulo");
    const subCat = document.getElementById("videoSubtituloCategoria");
    const subTexto = document.getElementById("videoSubtituloTexto");

    if (iconoPaso) iconoPaso.textContent = paso.icono || "💡";
    if (subTitulo) subTitulo.textContent = paso.tituloPaso;
    if (subCat) subCat.textContent = paso.categoria;
    if (subTexto) subTexto.textContent = paso.textoExplicativo;

    actualizarEstiloCapitulosActivos();

    // Activar narración hablada del paso
    narrarPasoActual();
}

function renderizarCapitulosTutorial() {
    const contenedor = document.getElementById("videoContenedorCapitulos");
    if (!contenedor) return;

    const tutorial = TUTORIAL_VIDEOS[tutorialActivoKey];
    if (!tutorial) return;

    contenedor.innerHTML = tutorial.pasos.map((p, idx) => {
        const esActivo = idx === tutorialPasoIndex;
        return `
            <button type="button" onclick="irAPasoTutorial(${idx})" class="btn-secundario btn-capitulo-video ${esActivo ? 'active' : ''}">
                ${p.icono} ${idx + 1}. ${p.categoria}
            </button>
        `;
    }).join("");
}

function actualizarEstiloCapitulosActivos() {
    const contenedor = document.getElementById("videoContenedorCapitulos");
    if (!contenedor) return;

    const botones = contenedor.querySelectorAll(".btn-capitulo-video");
    botones.forEach((btn, idx) => {
        const esActivo = idx === tutorialPasoIndex;
        btn.classList.toggle("active", esActivo);
    });
}

function irAPasoTutorial(idx) {
    const tutorial = TUTORIAL_VIDEOS[tutorialActivoKey];
    if (!tutorial) return;
    if (idx >= 0 && idx < tutorial.pasos.length) {
        tutorialPasoIndex = idx;
        renderizarPasoTutorialActual();
    }
}

function pasoTutorialSiguiente() {
    const tutorial = TUTORIAL_VIDEOS[tutorialActivoKey];
    if (!tutorial) return;
    if (tutorialPasoIndex < tutorial.pasos.length - 1) {
        tutorialPasoIndex++;
        renderizarPasoTutorialActual();
    } else {
        tutorialPasoIndex = 0;
        renderizarPasoTutorialActual();
    }
}

function pasoTutorialAnterior() {
    const tutorial = TUTORIAL_VIDEOS[tutorialActivoKey];
    if (!tutorial) return;
    if (tutorialPasoIndex > 0) {
        tutorialPasoIndex--;
        renderizarPasoTutorialActual();
    } else {
        tutorialPasoIndex = tutorial.pasos.length - 1;
        renderizarPasoTutorialActual();
    }
}

function togglePlayPauseTutorial() {
    const btn = document.getElementById("btnVideoPlayPause");
    if (tutorialReproduciendo) {
        pausarReproduccionTutorial();
        if (btn) btn.innerHTML = "▶️ Reanudar Video";
    } else {
        iniciarReproduccionTutorial();
        if (btn) btn.innerHTML = "⏸️ Pausar Video";
    }
}

function iniciarReproduccionTutorial() {
    if (tutorialInterval) clearInterval(tutorialInterval);
    tutorialReproduciendo = true;
    const btn = document.getElementById("btnVideoPlayPause");
    if (btn) btn.innerHTML = "⏸️ Pausar Video";

    // Si la voz está activa, el avance automático lo comanda el fin del habla del locutor.
    // Si la voz está silenciada o no soportada, avanza cada 8.5 segundos.
    tutorialInterval = setInterval(() => {
        if (!tutorialVozActivada || (typeof window !== "undefined" && !window.speechSynthesis.speaking)) {
            pasoTutorialSiguiente();
        }
    }, 9000);
}

function pausarReproduccionTutorial() {
    tutorialReproduciendo = false;
    detenerNarracionVoz();
    if (tutorialInterval) {
        clearInterval(tutorialInterval);
        tutorialInterval = null;
    }
}

function reiniciarVideoTutorial() {
    tutorialPasoIndex = 0;
    renderizarPasoTutorialActual();
    iniciarReproduccionTutorial();
}

function renderizarModuloAceite() {
    const t1 = estadoTamboresAceite?.tambor1 || {
        id: "tambor1",
        nombre: "Aceite Valvoline Premium Blue 15W40 CI-4",
        tipo: "Aceite de Motor (15W-40)",
        capacidad: 200,
        actual: 200,
        costoTotal: 550000,
        costoPorLitro: 2750,
        proveedor: "LUVAL S.A.",
        factura: "FAC-84920",
        fechaApertura: "2026-03-01"
    };

    const t2 = estadoTamboresAceite?.tambor2 || {
        id: "tambor2",
        nombre: "Aceite Hidráulico Valvoline Unitrac 10W30 / ISO 68",
        tipo: "Aceite Hidráulico (10W-30)",
        capacidad: 200,
        actual: 200,
        costoTotal: 520000,
        costoPorLitro: 2600,
        proveedor: "LUVAL S.A.",
        factura: "FAC-84925",
        fechaApertura: "2026-03-01"
    };

    // Cálculos Tambor 1 (Motor 15W-40)
    const capTotal1 = t1.capacidad || 200;
    const saldoActual1 = Math.max(0, t1.actual !== undefined ? t1.actual : 200);
    const porcentaje1 = Math.min(100, Math.max(0, (saldoActual1 / capTotal1) * 100));
    const litrosConsumidosTambor1 = Math.max(0, capTotal1 - saldoActual1);

    // Cálculos Tambor 2 (Hidráulico 10W-30)
    const capTotal2 = t2.capacidad || 200;
    const saldoActual2 = Math.max(0, t2.actual !== undefined ? t2.actual : 200);
    const porcentaje2 = Math.min(100, Math.max(0, (saldoActual2 / capTotal2) * 100));
    const litrosConsumidosTambor2 = Math.max(0, capTotal2 - saldoActual2);

    // 1. Renderizar Tarjeta Tambor 1
    const elNombre1 = document.getElementById("lblNombreTambor1");
    const elDetalle1 = document.getElementById("lblDetalleTambor1");
    const elPorcentaje1 = document.getElementById("lblPorcentajeAceite1");
    const barra1 = document.getElementById("barraProgresoAceite1");
    const elSaldoDisp1 = document.getElementById("lblLitrosDisponibles1");
    const elFecha1 = document.getElementById("lblFechaAperturaTambor1");
    const elConsumido1 = document.getElementById("lblConsumidoTambor1");
    const elProveedor1 = document.getElementById("lblProveedorTambor1");
    const elCostoLitro1 = document.getElementById("lblCostoLitroTambor1");

    if (elNombre1) elNombre1.textContent = t1.nombre || "Aceite Valvoline Premium Blue 15W40 CI-4";
    if (elDetalle1) elDetalle1.textContent = `Tambor estándar de 200 Litros (${t1.tipo || 'Aceite de Motor 15W-40'})`;
    if (elPorcentaje1) {
        elPorcentaje1.textContent = `${porcentaje1.toFixed(1)}% (${saldoActual1.toFixed(1)} / ${capTotal1} L)`;
        elPorcentaje1.style.color = saldoActual1 <= 35 ? "#dc2626" : saldoActual1 <= 70 ? "#d97706" : "#2563eb";
    }
    if (barra1) {
        barra1.style.width = `${porcentaje1}%`;
        barra1.style.background = saldoActual1 <= 35 
            ? "linear-gradient(90deg, #ef4444, #b91c1c)" 
            : saldoActual1 <= 70 
                ? "linear-gradient(90deg, #f59e0b, #d97706)" 
                : "linear-gradient(90deg, #3b82f6, #1d4ed8)";
    }
    if (elSaldoDisp1) elSaldoDisp1.textContent = `${saldoActual1.toFixed(1)} Lts`;
    if (elFecha1) elFecha1.textContent = t1.fechaApertura || "2026-03-01";
    if (elConsumido1) elConsumido1.textContent = `${litrosConsumidosTambor1.toFixed(1)} L`;
    if (elProveedor1) elProveedor1.textContent = t1.proveedor || "LUVAL S.A.";
    if (elCostoLitro1) {
        const c1 = t1.costoPorLitro || Math.round((t1.costoTotal || 550000) / capTotal1);
        elCostoLitro1.textContent = `$${c1.toLocaleString('es-CL')}`;
    }

    // Gráfico SVG 3D Tambor 1 (Motor)
    const maxTuboH = 82;
    const baseTuboY = 87;
    const hSvg1 = Math.max(2, Math.min(maxTuboH, (saldoActual1 / capTotal1) * maxTuboH));
    const ySvg1 = baseTuboY - hSvg1;
    const svgCol1 = document.getElementById("svgColumnaAceite1");
    if (svgCol1) {
        svgCol1.setAttribute("y", ySvg1.toFixed(1));
        svgCol1.setAttribute("height", hSvg1.toFixed(1));
    }
    const svgTxt1 = document.getElementById("svgTextoLitros1");
    if (svgTxt1) {
        svgTxt1.textContent = `${saldoActual1.toFixed(1)} L (${porcentaje1.toFixed(0)}%)`;
        svgTxt1.setAttribute("fill", saldoActual1 <= 35 ? "#ef4444" : "#60a5fa");
    }

    // 2. Renderizar Tarjeta Tambor 2
    const elNombre2 = document.getElementById("lblNombreTambor2");
    const elDetalle2 = document.getElementById("lblDetalleTambor2");
    const elPorcentaje2 = document.getElementById("lblPorcentajeAceite2");
    const barra2 = document.getElementById("barraProgresoAceite2");
    const elSaldoDisp2 = document.getElementById("lblLitrosDisponibles2");
    const elFecha2 = document.getElementById("lblFechaAperturaTambor2");
    const elConsumido2 = document.getElementById("lblConsumidoTambor2");
    const elProveedor2 = document.getElementById("lblProveedorTambor2");
    const elCostoLitro2 = document.getElementById("lblCostoLitroTambor2");

    if (elNombre2) elNombre2.textContent = t2.nombre || "Aceite Hidráulico Valvoline Unitrac 10W30 / ISO 68";
    if (elDetalle2) elDetalle2.textContent = `Tambor estándar de 200 Litros (${t2.tipo || 'Aceite Hidráulico 10W-30'})`;
    if (elPorcentaje2) {
        elPorcentaje2.textContent = `${porcentaje2.toFixed(1)}% (${saldoActual2.toFixed(1)} / ${capTotal2} L)`;
        elPorcentaje2.style.color = saldoActual2 <= 35 ? "#dc2626" : saldoActual2 <= 70 ? "#d97706" : "#059669";
    }
    if (barra2) {
        barra2.style.width = `${porcentaje2}%`;
        barra2.style.background = saldoActual2 <= 35 
            ? "linear-gradient(90deg, #ef4444, #b91c1c)" 
            : saldoActual2 <= 70 
                ? "linear-gradient(90deg, #f59e0b, #d97706)" 
                : "linear-gradient(90deg, #10b981, #059669)";
    }
    if (elSaldoDisp2) elSaldoDisp2.textContent = `${saldoActual2.toFixed(1)} Lts`;
    if (elFecha2) elFecha2.textContent = t2.fechaApertura || "2026-03-01";
    if (elConsumido2) elConsumido2.textContent = `${litrosConsumidosTambor2.toFixed(1)} L`;
    if (elProveedor2) elProveedor2.textContent = t2.proveedor || "LUVAL S.A.";
    if (elCostoLitro2) {
        const c2 = t2.costoPorLitro || Math.round((t2.costoTotal || 520000) / capTotal2);
        elCostoLitro2.textContent = `$${c2.toLocaleString('es-CL')}`;
    }

    // Gráfico SVG 3D Tambor 2 (Hidráulico)
    const hSvg2 = Math.max(2, Math.min(maxTuboH, (saldoActual2 / capTotal2) * maxTuboH));
    const ySvg2 = baseTuboY - hSvg2;
    const svgCol2 = document.getElementById("svgColumnaAceite2");
    if (svgCol2) {
        svgCol2.setAttribute("y", ySvg2.toFixed(1));
        svgCol2.setAttribute("height", hSvg2.toFixed(1));
    }
    const svgTxt2 = document.getElementById("svgTextoLitros2");
    if (svgTxt2) {
        svgTxt2.textContent = `${saldoActual2.toFixed(1)} L (${porcentaje2.toFixed(0)}%)`;
        svgTxt2.setAttribute("fill", saldoActual2 <= 35 ? "#ef4444" : "#6ee7b7");
    }

    // Dashboard mini-widgets de ambos tambores
    const dashNivel1 = document.getElementById("dashNivelTambor1Txt");
    const dashBarra1 = document.getElementById("dashBarraTambor1");
    const dashNombre1 = document.getElementById("dashNombreTambor1Txt");
    if (dashNivel1) dashNivel1.textContent = `${saldoActual1.toFixed(1)} / ${capTotal1} L (${porcentaje1.toFixed(0)}%)`;
    if (dashBarra1) {
        dashBarra1.style.width = `${porcentaje1}%`;
        dashBarra1.style.background = saldoActual1 <= 35 ? "#ef4444" : "#2563eb";
    }
    if (dashNombre1) dashNombre1.textContent = t1.nombre || "Aceite Valvoline Premium Blue 15W40";

    const dashNivel2 = document.getElementById("dashNivelTambor2Txt");
    const dashBarra2 = document.getElementById("dashBarraTambor2");
    const dashNombre2 = document.getElementById("dashNombreTambor2Txt");
    if (dashNivel2) dashNivel2.textContent = `${saldoActual2.toFixed(1)} / ${capTotal2} L (${porcentaje2.toFixed(0)}%)`;
    if (dashBarra2) {
        dashBarra2.style.width = `${porcentaje2}%`;
        dashBarra2.style.background = saldoActual2 <= 35 ? "#ef4444" : "#10b981";
    }
    if (dashNombre2) dashNombre2.textContent = t2.nombre || "Aceite Hidráulico Valvoline Unitrac 10W30";

    const kpiTotalesTaller = document.getElementById("kpiLitrosTotalesTaller");
    if (kpiTotalesTaller) {
        kpiTotalesTaller.textContent = `${(saldoActual1 + saldoActual2).toFixed(1)} L`;
    }
    const kpiSubDetalleTotales = document.getElementById("kpiSubDetalleLitrosTotales");
    if (kpiSubDetalleTotales) {
        kpiSubDetalleTotales.textContent = `T1: ${saldoActual1.toFixed(0)}L | T2: ${saldoActual2.toFixed(0)}L (Saldo Taller)`;
    }

    // 3. KPIs Generales del Módulo (Ambos Tambores)
    const elKpiConsumido = document.getElementById("kpiLitrosConsumidosTotal") || document.getElementById("kpiLitrosConsumidosTambor");
    const elKpiMaquinas = document.getElementById("kpiMaquinasAbastecidasAceite");
    const elKpiCostoL = document.getElementById("kpiCostoLitroAceite");
    const elKpiTambores = document.getElementById("kpiTamboresHistoricos");

    const totalLitrosConsumidos = litrosConsumidosTambor1 + litrosConsumidosTambor2;
    if (elKpiConsumido) elKpiConsumido.textContent = `${totalLitrosConsumidos.toFixed(1)} L`;
    if (elKpiMaquinas) {
        const maquinasUnicas = new Set((historialConsumoAceite || []).map(h => h.codigoEquipo)).size;
        elKpiMaquinas.textContent = maquinasUnicas;
    }
    if (elKpiCostoL) {
        const costoPromedio = Math.round(((t1.costoPorLitro || 2750) + (t2.costoPorLitro || 2600)) / 2);
        elKpiCostoL.textContent = `$${costoPromedio.toLocaleString('es-CL')}`;
    }
    if (elKpiTambores) elKpiTambores.textContent = "2 Activos";

    const costoDisponible = saldoActual1 * Number(t1.costoPorLitro ?? (Number(t1.costoTotal || 0) / capTotal1)) + saldoActual2 * Number(t2.costoPorLitro ?? (Number(t2.costoTotal || 0) / capTotal2));
    const valorStock = document.getElementById('kpiValorizacionStockAceite');
    if (valorStock) valorStock.textContent = `$${costoDisponible.toLocaleString('es-CL')}`;
    for (const [n,saldo] of [[1,saldoActual1],[2,saldoActual2]]) {
        const badge = document.getElementById(`estadoNivelAceite${n}`);
        if (badge) {badge.textContent=saldo <= 35 ? 'Nivel crítico' : saldo <= 70 ? 'Nivel bajo' : 'Nivel normal';badge.className='badge '+(saldo <= 35 ? 'badge-rojo' : saldo <= 70 ? 'badge-naranja' : 'badge-verde');}
    }

    // 4. Actualizar badge en menú lateral
    const badgeMenu = document.getElementById("badgeNivelAceiteMenu");
    if (badgeMenu) {
        const totalSaldo = saldoActual1 + saldoActual2;
        badgeMenu.textContent = `T1:${saldoActual1.toFixed(0)}L | T2:${saldoActual2.toFixed(0)}L`;
        badgeMenu.title = `Tambor 1 (Motor): ${saldoActual1.toFixed(1)} L | Tambor 2 (Hidráulico): ${saldoActual2.toFixed(1)} L`;
        if (saldoActual1 <= 35 || saldoActual2 <= 35) {
            badgeMenu.className = "badge badge-rojo";
        } else if (saldoActual1 <= 70 || saldoActual2 <= 70) {
            badgeMenu.className = "badge badge-naranja";
        } else {
            badgeMenu.className = "badge badge-azul";
        }
    }

    // 5. Actualizar saldos en formulario de mantención si está visible
    const lblSaldoMant1 = document.getElementById("lblSaldoTamborActualMant");
    const lblSaldoMant2 = document.getElementById("lblSaldoTambor2ActualMant");
    const lblNombreMant1 = document.getElementById("lblNombreTambor1EnMant");
    const lblNombreMant2 = document.getElementById("lblNombreTambor2EnMant");

    if (lblNombreMant1) lblNombreMant1.textContent = t1.nombre || "Aceite Valvoline Premium Blue 15W40";
    if (lblNombreMant2) lblNombreMant2.textContent = t2.nombre || "Aceite Hidráulico Valvoline Unitrac 10W30";
    if (lblSaldoMant1) lblSaldoMant1.innerHTML = `Saldo: <strong style="color:#1e40af;">${saldoActual1.toFixed(1)} Lts</strong>`;
    if (lblSaldoMant2) lblSaldoMant2.innerHTML = `Saldo: <strong style="color:#15803d;">${saldoActual2.toFixed(1)} Lts</strong>`;

    // 6. Renderizar tabla de historial de consumos con filtro de tambor
    const tbody = document.getElementById("tbodyHistorialConsumoAceite");
    if (!tbody) return;

    const filtro = document.getElementById("filtroTamborAceite")?.value || "TODOS";
    const busqueda = (document.getElementById('buscarConsumoAceite')?.value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
    document.querySelectorAll('[data-tambor-aceite]').forEach(btn => btn.setAttribute('aria-pressed',String(btn.dataset.tamborAceite===filtro)));
    const consumosFiltrados = (historialConsumoAceite || []).map((item,originalIndex)=>({item,originalIndex})).filter(({item}) => {
        const esT2 = item.tamborId ? item.tamborId === 'tambor2' : /hidr[aá]ulico/i.test(item.tipoAceite || '');
        const tambor = esT2 ? 'tambor2' : 'tambor1';
        const texto = [item.fecha,item.folioOT,item.codigoEquipo,item.equipoNombre,item.tipoMantencion,item.tecnico,item.tipoAceite].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
        return (filtro==='TODOS' || tambor===filtro) && (!busqueda || texto.includes(busqueda));
    });
    const contador = document.getElementById('contadorConsumosAceite');
    if (contador) contador.textContent = `${consumosFiltrados.length} de ${(historialConsumoAceite || []).length} movimientos`;
    if (!consumosFiltrados.length) {tbody.innerHTML='<tr><td colspan="6" style="text-align:center;padding:20px;">No hay consumos que coincidan con los filtros.</td></tr>';return;}
    const esc = escapeHtmlSoporte;
    tbody.innerHTML = consumosFiltrados.map(({item,originalIndex}) => {
        const id = item.id || `ACEITE-AUTO-${originalIndex}`;
        const esT2 = item.tamborId ? item.tamborId === 'tambor2' : /hidr[aá]ulico/i.test(item.tipoAceite || '');
        return `<tr><td><strong>${esc(item.fecha || '-')}</strong><small>${esc(item.folioOT || 'OT General')}</small></td><td><strong>${esc(item.codigoEquipo || '-')}</strong><small>${esc(item.equipoNombre || '')}</small></td><td><span class="badge ${esT2?'badge-verde':'badge-azul'}">${esT2?'T2 · Hidráulico 10W-30':'T1 · Motor 15W-40'}</span><small>${esc(item.tipoMantencion || 'Mantención periódica')}</small></td><td><strong>−${Number(item.litrosDescontados || 0).toLocaleString('es-CL')} L</strong><small>Saldo: ${item.saldoRestante == null ? 'Sin registro' : Number(item.saldoRestante).toLocaleString('es-CL')+' L'}</small></td><td class="aceites-costo">$${Number(item.costoTotal || 0).toLocaleString('es-CL')}</td><td>${esc(item.tecnico || 'Sin asignar')}<details class="aceites-opciones-fila"><summary>Opciones</summary><button type="button" class="btn-peligro" onclick="eliminarConsumoAceite(${esc(JSON.stringify(id))})">Eliminar consumo</button></details></td></tr>`;
    }).join('');
}

function filtrarConsumosAceite(tambor, irAlHistorial = false) {
    const selector=document.getElementById('filtroTamborAceite');
    if(selector && ['TODOS','tambor1','tambor2'].includes(tambor))selector.value=tambor;
    const buscar=document.getElementById('buscarConsumoAceite');
    if(irAlHistorial && buscar)buscar.value='';
    renderizarModuloAceite();
    if(irAlHistorial)document.getElementById('aceitesHistorial')?.scrollIntoView({block:'start',behavior:'auto'});
}

function eliminarConsumoAceite(id) {
    if (!historialConsumoAceite || historialConsumoAceite.length === 0) return;

    const idx = historialConsumoAceite.findIndex((item, index) => {
        const itemId = item.id || `ACEITE-AUTO-${index}`;
        return String(itemId) === String(id) || String(item.id) === String(id);
    });

    if (idx === -1) {
        if (typeof mostrarNotificacionToast === "function") {
            mostrarNotificacionToast("Registro de consumo de aceite no encontrado", "warning");
        } else {
            alert("Registro de consumo de aceite no encontrado.");
        }
        return;
    }

    const consumo = historialConsumoAceite[idx];
    const equipo = consumo.codigoEquipo || "la máquina seleccionada";
    const litros = parseFloat(consumo.litrosDescontados) || 0;
    const folio = consumo.folioOT || "S/F";
    const fecha = consumo.fecha || "-";

    const esT2 = consumo.tamborId === "tambor2" || (consumo.tipoAceite && (consumo.tipoAceite.toLowerCase().includes("hidráulico") || consumo.tipoAceite.toLowerCase().includes("hidraulico")));
    const tamborDestinoKey = esT2 ? "tambor2" : "tambor1";
    const tamborDestinoNombre = esT2 ? "Tambor 2 (Hidráulico 10W-30)" : "Tambor 1 (Motor 15W-40)";

    const mensajeConfirm = `¿Está seguro de eliminar el registro de consumo de aceite?\n\n` +
        `• Máquina / Equipo: ${equipo}\n` +
        `• Folio OT: ${folio}\n` +
        `• Fecha: ${fecha}\n` +
        `• Origen: ${tamborDestinoNombre}\n` +
        `• Litros descontados: ${litros.toFixed(1)} Lts\n\n` +
        `⚠️ Al eliminar este registro, los ${litros.toFixed(1)} Lts se reincorporarán automáticamente al saldo disponible de ${tamborDestinoNombre}.`;

    if (!confirm(mensajeConfirm)) return;

    // 1. Reincorporar litros al tambor específico
    if (litros > 0 && estadoTamboresAceite && estadoTamboresAceite[tamborDestinoKey]) {
        const targetDrum = estadoTamboresAceite[tamborDestinoKey];
        const capMax = Number(targetDrum.capacidad) || 200;
        const actual = Number(targetDrum.actual) || 0;
        targetDrum.actual = Math.min(capMax, actual + litros);
    }

    // 2. Eliminar del array
    historialConsumoAceite.splice(idx, 1);
    localStorage.setItem("corssen_historial_aceite_v1", JSON.stringify(historialConsumoAceite));
    localStorage.setItem("corssen_tambores_aceite_v2", JSON.stringify(estadoTamboresAceite));
    localStorage.setItem("corssen_tambor_aceite_v1", JSON.stringify(estadoTamboresAceite.tambor1));
    localStorage.setItem("corssen_ultima_modificacion_ts", String(Date.now()));

    // 3. Persistir y respaldar
    guardarTodo();
    if (typeof window.ejecutarAutoBackupSistema === "function") {
        window.ejecutarAutoBackupSistema("Consumo de aceite eliminado", "AUTOMATICO", true);
    }

    // 4. Actualizar interfaz
    renderizarModuloAceite();
    if (typeof renderizarDashboard === "function") {
        renderizarDashboard();
    }

    if (typeof mostrarNotificacionToast === "function") {
        mostrarNotificacionToast(`Registro de ${equipo} eliminado y ${litros.toFixed(1)} Lts restituidos a ${tamborDestinoNombre}.`, "success");
    } else {
        alert(`Registro de ${equipo} eliminado correctamente. Se devolvieron ${litros.toFixed(1)} Lts a ${tamborDestinoNombre}.`);
    }
}

function abrirModalNuevoTambor(tamborId) {
    const targetId = tamborId === "tambor2" ? "tambor2" : "tambor1";
    const selectTambor = document.getElementById("selectTamborApertura");
    if (selectTambor) {
        selectTambor.value = targetId;
    }

    cambiarTipoTamborModal(targetId);

    const inputFecha = document.getElementById("inputFechaAperturaTambor");
    if (inputFecha) {
        inputFecha.value = new Date().toISOString().split("T")[0];
    }

    const modal = document.getElementById("modalNuevoTamborAceite");
    if (modal) modal.style.display = "flex";
}

function cambiarTipoTamborModal(tamborId) {
    const header = document.getElementById("headerModalNuevoTambor");
    const titulo = document.getElementById("lblTituloModalNuevoTambor");
    const btnSubmit = document.getElementById("btnSubmitNuevoTambor");
    const inputNombre = document.getElementById("inputNombreAceiteTambor");
    const inputCosto = document.getElementById("inputCostoTamborTotal");
    const inputProveedor = document.getElementById("inputProveedorTambor");
    const inputCapacidad = document.getElementById("inputCapacidadTambor");

    const t = estadoTamboresAceite?.[tamborId] || {};

    if (tamborId === "tambor2") {
        if (header) header.style.background = "#047857";
        if (titulo) titulo.textContent = "🛢️ Apertura de Nuevo Tambor 2 (Aceite Hidráulico 10W-30)";
        if (btnSubmit) {
            btnSubmit.textContent = "💾 Activar y Llenar Tambor 2 (Hidráulico 200L)";
            btnSubmit.style.background = "#059669";
            btnSubmit.style.borderColor = "#059669";
        }
        if (inputNombre) inputNombre.value = t.nombre || "Aceite Hidráulico Valvoline Unitrac 10W30 / ISO 68";
        if (inputCosto) inputCosto.value = t.costoTotal || 520000;
        if (inputProveedor) inputProveedor.value = t.proveedor || "LUVAL S.A.";
    } else {
        if (header) header.style.background = "#1e40af";
        if (titulo) titulo.textContent = "🛢️ Apertura de Nuevo Tambor 1 (Aceite de Motor 15W-40)";
        if (btnSubmit) {
            btnSubmit.textContent = "💾 Activar y Llenar Tambor 1 (Motor 200L)";
            btnSubmit.style.background = "#1e40af";
            btnSubmit.style.borderColor = "#1e40af";
        }
        if (inputNombre) inputNombre.value = t.nombre || "Aceite Valvoline Premium Blue 15W40 CI-4";
        if (inputCosto) inputCosto.value = t.costoTotal || 550000;
        if (inputProveedor) inputProveedor.value = t.proveedor || "LUVAL S.A.";
    }

    if (inputCapacidad) inputCapacidad.value = t.capacidad || 200;
    actualizarCostoLitroModal();
}

function cerrarModalNuevoTambor() {
    const modal = document.getElementById("modalNuevoTamborAceite");
    if (modal) modal.style.display = "none";
}

function actualizarCostoLitroModal() {
    const cap = parseFloat(document.getElementById("inputCapacidadTambor")?.value) || 200;
    const costo = parseFloat(document.getElementById("inputCostoTamborTotal")?.value) || 0;
    const costoL = Math.round(costo / cap);
    const lbl = document.getElementById("lblCostoLitroModalCalc");
    if (lbl) {
        lbl.textContent = `$${costoL.toLocaleString('es-CL')} / Litro`;
    }
}

function guardarNuevoTamborAceite(e) {
    if (e && e.preventDefault) e.preventDefault();

    const tamborId = document.getElementById("selectTamborApertura")?.value || "tambor1";
    const esT2 = tamborId === "tambor2";

    const nombreDefault = esT2 
        ? "Aceite Hidráulico Valvoline Unitrac 10W30 / ISO 68" 
        : "Aceite Valvoline Premium Blue 15W40 CI-4";
    const tipoDefault = esT2 
        ? "Aceite Hidráulico (10W-30)" 
        : "Aceite de Motor (15W-40)";

    const nombre = document.getElementById("inputNombreAceiteTambor")?.value.trim() || nombreDefault;
    const capacidad = parseFloat(document.getElementById("inputCapacidadTambor")?.value) || 200;
    const fechaApertura = document.getElementById("inputFechaAperturaTambor")?.value || new Date().toISOString().split("T")[0];
    const costoTotal = parseFloat(document.getElementById("inputCostoTamborTotal")?.value) || (esT2 ? 520000 : 550000);
    const proveedor = document.getElementById("inputProveedorTambor")?.value.trim() || "LUVAL S.A.";
    const factura = document.getElementById("inputFacturaTambor")?.value.trim() || "";

    const costoPorLitro = Math.round(costoTotal / capacidad);

    const nuevoTambor = {
        id: tamborId,
        nombre,
        tipo: tipoDefault,
        capacidad,
        actual: capacidad, // Se inicia al 100% lleno
        costoTotal,
        costoPorLitro,
        proveedor,
        factura,
        fechaApertura,
        estado: "Activo"
    };

    if (!estadoTamboresAceite) {
        estadoTamboresAceite = {};
    }
    estadoTamboresAceite[tamborId] = nuevoTambor;
    if (tamborId === "tambor1") {
        estadoTamborAceite = nuevoTambor;
    }

    // Registrar apertura en el Kárdex general como evento de recepción
    inventario.unshift({
        id: `MOV-TAMBOR-${Date.now()}`,
        tipo: "INGRESO",
        fecha: fechaApertura,
        folioOT: factura || (esT2 ? "APERTURA-TAMBOR-2-HIDRAULICO" : "APERTURA-TAMBOR-1-MOTOR"),
        codigoEquipo: "TALLER-LUBRICANTES",
        equipoNombre: "Bodega de Lubricantes Central",
        insumoDetalle: `Nuevo Tambor de Aceite a Granel (${nuevoTambor.tipo}: ${nombre})`,
        cantidad: capacidad,
        medida: "LITROS",
        costoUnitario: costoPorLitro,
        costoTotal: costoTotal,
        responsable: "Alexis Santos",
        stockRestante: capacidad
    });

    guardarTodo();
    renderizarModuloAceite();
    renderizarKardexMovimientos();
    cerrarModalNuevoTambor();

    const tagTambor = esT2 ? "Tambor 2 (Aceite Hidráulico)" : "Tambor 1 (Aceite de Motor)";
    alert(`✓ Nuevo ${tagTambor} de ${capacidad} Litros registrado y activado con éxito.\nSaldo inicial listo para descontar en mantenciones: ${capacidad} Litros.`);
}

function exportarConsumosAceiteExcel() {
    const encabezados = [
        "Fecha",
        "Folio OT",
        "Código Equipo",
        "Nombre / Denominación",
        "Tambor / Tipo Aceite",
        "Tipo de Mantención",
        "Litros Descontados (Lts)",
        "Saldo Restante (Lts)",
        "Costo Total ($ CLP)",
        "Mecánico Responsable"
    ];

    const filas = (historialConsumoAceite || []).map(item => {
        const esT2 = item.tamborId === "tambor2" || (item.tipoAceite && (item.tipoAceite.toLowerCase().includes("hidráulico") || item.tipoAceite.toLowerCase().includes("hidraulico")));
        const tipoDesc = esT2 ? "Tambor 2 - Hidráulico (10W-30)" : "Tambor 1 - Motor (15W-40)";

        return [
            item.fecha || "",
            item.folioOT || "",
            item.codigoEquipo || "",
            item.equipoNombre || "",
            tipoDesc,
            item.tipoMantencion || "",
            item.litrosDescontados || 0,
            item.saldoRestante !== undefined ? item.saldoRestante : 0,
            item.costoTotal || 0,
            item.tecnico || "Alexis Santos"
        ];
    });

    const t1 = estadoTamboresAceite?.tambor1 || {};
    const t2 = estadoTamboresAceite?.tambor2 || {};

    const resumenTambor = [
        ["ESTADO ACTUAL DE LOS TAMBORES DE ACEITE A GRANEL (2 X 200 LITROS)"],
        ["-- TAMBOR 1: ACEITE DE MOTOR (15W-40) --"],
        ["Nombre:", t1.nombre || "Valvoline Premium Blue 15W40 CI-4"],
        ["Capacidad Inicial:", `${t1.capacidad || 200} Litros`],
        ["Saldo Actual Disponible:", `${(t1.actual !== undefined ? t1.actual : 200).toFixed(1)} Litros`],
        ["Costo Estimado por Litro:", `$${(t1.costoPorLitro || 2750).toLocaleString('es-CL')}`],
        ["Proveedor:", t1.proveedor || "LUVAL S.A."],
        ["Fecha de Apertura:", t1.fechaApertura || ""],
        ["Factura / Guía:", t1.factura || ""],
        [""],
        ["-- TAMBOR 2: ACEITE HIDRÁULICO (10W-30 / ISO 68) --"],
        ["Nombre:", t2.nombre || "Valvoline Unitrac 10W30 / ISO 68"],
        ["Capacidad Inicial:", `${t2.capacidad || 200} Litros`],
        ["Saldo Actual Disponible:", `${(t2.actual !== undefined ? t2.actual : 200).toFixed(1)} Litros`],
        ["Costo Estimado por Litro:", `$${(t2.costoPorLitro || 2600).toLocaleString('es-CL')}`],
        ["Proveedor:", t2.proveedor || "LUVAL S.A."],
        ["Fecha de Apertura:", t2.fechaApertura || ""],
        ["Factura / Guía:", t2.factura || ""],
        [""]
    ];

    const datosCompletos = [...resumenTambor, encabezados, ...filas];

    descargarLibroExcel("CORSSEN_CONTROL_ACEITE_2_TAMBORES", [{
        nombre: "Control 2 Tambores Aceite",
        datos: datosCompletos,
        anchos: [14, 16, 16, 32, 28, 26, 20, 22, 18, 22]
    }]);
}

function descargarLibroExcel(nombreArchivoBase, hojas) {
    const fechaActual = new Date().toISOString().split("T")[0];
    const nombreCompleto = nombreArchivoBase.endsWith(".xlsx") ? nombreArchivoBase : `${nombreArchivoBase}_${fechaActual}.xlsx`;

    try {
        if (typeof XLSX !== "undefined" && XLSX.utils) {
            const wb = XLSX.utils.book_new();

            hojas.forEach(hoja => {
                const ws = XLSX.utils.aoa_to_sheet(hoja.datos);
                
                // Configurar anchos de columna si están definidos
                if (hoja.anchos && Array.isArray(hoja.anchos)) {
                    ws["!cols"] = hoja.anchos.map(ancho => ({ wch: ancho }));
                }

                // Limitar nombre de hoja a 31 caracteres (límite de Microsoft Excel)
                const nombreLimpio = (hoja.nombre || "Hoja1").replace(/[:\\/?*\[\]]/g, "_").substring(0, 31);
                XLSX.utils.book_append_sheet(wb, ws, nombreLimpio);
            });

            // Generar y descargar archivo nativo binario XLSX
            XLSX.writeFile(wb, nombreCompleto);
            return;
        }
    } catch (err) {
        console.warn("SheetJS no disponible o error al generar .xlsx, usando fallback:", err);
    }

    // Fallback garantizado en formato compatible de descarga
    let csvData = "\uFEFF";
    hojas.forEach((hoja, idx) => {
        if (idx > 0) csvData += "\n\n" + "=".repeat(60) + `\nHOJA: ${hoja.nombre}\n` + "=".repeat(60) + "\n\n";
        hoja.datos.forEach(fila => {
            const filaStr = fila.map(val => {
                if (val === null || val === undefined) return '""';
                const str = String(val).replace(/"/g, '""');
                return `"${str}"`;
            }).join(";");
            csvData += filaStr + "\n";
        });
    });

    const blob = new Blob([csvData], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nombreCompleto;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function exportarPlanillaExcel() {
    const usuario = sessionStorage.getItem("nombreUsuario") || "Alexis Santos";
    const fecha = new Date().toLocaleDateString("es-CL");

    const datos = [
        ["PROGRAMA MAESTRO DE MANTENCIÓN - CORSSEN LOGÍSTICA"],
        [`Fecha de Emisión: ${fecha}`, `Emitido por: ${usuario}`, "Sistema: Control de Flota y Maquinaria"],
        [], // Fila en blanco
        [
            "CÓD. EQUIPO",
            "EQUIPO / DENOMINACIÓN",
            "MARCA",
            "CATEGORÍA",
            "ESTADO OPERACIONAL",
            "PRIORIDAD",
            "HORÓMETRO / KM",
            "FRECUENCIA SERVICIO",
            "PRÓXIMO SERVICIO",
            "RESPONSABLE",
            "OBSERVACIONES / REPARACIONES PENDIENTES"
        ]
    ];

    corssenPrograma.forEach(item => {
        datos.push([
            item.cod || "",
            item.equipo || "",
            item.marca || "",
            item.cat || "",
            item.estado || "OPERATIVA",
            item.prioridad || "Normal",
            item.horometro || "-",
            item.frecuencia || "-",
            item.prox || "-",
            item.responsable || "Alexis Santos",
            item.observaciones || ""
        ]);
    });

    // Resumen al pie
    datos.push([]);
    datos.push(["TOTAL DE EQUIPOS EN PROGRAMA", corssenPrograma.length, "", "", "", "", "", "", "", "", ""]);

    descargarLibroExcel("Programa_Mantencion_CORSSEN", [
        {
            nombre: "Programa Mantención",
            datos: datos,
            anchos: [15, 34, 18, 16, 20, 14, 18, 20, 20, 22, 45]
        }
    ]);
}

function exportarPlanillaCSV() {
    exportarPlanillaExcel();
}

function exportarMantencionesExcel() {
    const usuario = sessionStorage.getItem("nombreUsuario") || "Alexis Santos";
    const fecha = new Date().toLocaleDateString("es-CL");

    // Hoja 1: Resumen de Órdenes de Trabajo
    const datosOT = [
        ["HISTORIAL GENERAL DE MANTENCIONES Y ÓRDENES DE TRABAJO - CORSSEN LOGÍSTICA"],
        [`Fecha de Emisión: ${fecha}`, `Emitido por: ${usuario}`],
        [],
        [
            "FOLIO OT",
            "FECHA",
            "CÓD. EQUIPO",
            "PATENTE",
            "EQUIPO / MODELO",
            "TIPO MANTENCIÓN",
            "HORÓMETRO / KM",
            "PRÓXIMO SERVICIO",
            "TÉCNICO / RESPONSABLE",
            "TALLER / PROVEEDOR",
            "INSUMOS UTILIZADOS",
            "COSTO INSUMOS ($)",
            "COSTO MANO OBRA ($)",
            "INVERSIÓN TOTAL ($)",
            "ESTADO"
        ]
    ];

    let totalInsumosAcum = 0;
    let totalManoObraAcum = 0;
    let totalInversionAcum = 0;

    // Hoja 2: Detalle desglosado de insumos rebajados
    const datosInsumosDetalle = [
        ["DETALLE DE INSUMOS Y REPUESTOS DESCONTADOS POR ORDEN DE TRABAJO"],
        [`Fecha: ${fecha}`, `Emitido por: ${usuario}`],
        [],
        [
            "FOLIO OT",
            "FECHA OT",
            "CÓD. EQUIPO",
            "EQUIPO",
            "DETALLE DEL INSUMO",
            "MODELO / CÓDIGO",
            "CANTIDAD",
            "UNIDAD MEDIDA",
            "COSTO UNITARIO ($)",
            "SUBTOTAL DESCONTADO ($)",
            "TÉCNICO"
        ]
    ];

    mantenciones.forEach(m => {
        const cInsumos = Number(m.costoInsumos || 0);
        const cManoObra = Number(m.costoManoObra || 0);
        const cTotal = Number(m.costoTotal || (cInsumos + cManoObra));

        totalInsumosAcum += cInsumos;
        totalManoObraAcum += cManoObra;
        totalInversionAcum += cTotal;

        const insumosResumen = (m.insumosConsumidos || []).map(i => `${i.cantidad}x ${i.detalle} (${i.modelo || '-'})`).join("; ");

        datosOT.push([
            m.folio || m.id || "OT-000",
            m.fecha || "-",
            m.codigoEquipo || "-",
            m.patente || "-",
            m.equipoNombre || "-",
            m.tipo || "Preventiva",
            m.horometroKm || "-",
            m.proximoServicio || "-",
            m.tecnico || "Alexis Santos",
            m.taller || "Taller Central CORSSEN",
            insumosResumen || "Sin insumos de bodega",
            cInsumos,
            cManoObra,
            cTotal,
            m.estado || "Completada"
        ]);

        (m.insumosConsumidos || []).forEach(ins => {
            const cant = Number(ins.cantidad || 1);
            const unit = Number(ins.costoUnitario || 0);
            const sub = Number(ins.costoTotal || (cant * unit));

            datosInsumosDetalle.push([
                m.folio || m.id || "OT-000",
                m.fecha || "-",
                m.codigoEquipo || "-",
                m.equipoNombre || "-",
                ins.detalle || "",
                ins.modelo || "-",
                cant,
                ins.medida || "UN",
                unit,
                sub,
                m.tecnico || "Alexis Santos"
            ]);
        });
    });

    datosOT.push([]);
    datosOT.push([
        "TOTALES GENERALES",
        `${mantenciones.length} Órdenes Registradas`,
        "", "", "", "", "", "", "", "", "",
        totalInsumosAcum,
        totalManoObraAcum,
        totalInversionAcum,
        ""
    ]);

    descargarLibroExcel("Historial_Mantenciones_CORSSEN", [
        {
            nombre: "Órdenes de Trabajo (OT)",
            datos: datosOT,
            anchos: [14, 13, 15, 14, 28, 22, 18, 18, 22, 24, 38, 18, 18, 20, 16]
        },
        {
            nombre: "Detalle Insumos Descontados",
            datos: datosInsumosDetalle,
            anchos: [14, 13, 15, 26, 32, 20, 12, 14, 18, 22, 22]
        }
    ]);
}

function exportarStockExcel() {
    const usuario = sessionStorage.getItem("nombreUsuario") || "Alexis Santos";
    const fecha = new Date().toLocaleDateString("es-CL");

    // Hoja 1: Existencias detalladas
    const datosStock = [
        ["CONTROL Y EXISTENCIAS DE STOCK DE INSUMOS - CORSSEN LOGÍSTICA"],
        [`Fecha de Emisión: ${fecha}`, `Emitido por: ${usuario}`, "Bodega: Central de Abastecimiento CORSSEN"],
        [],
        [
            "DETALLE DEL INSUMO",
            "CATEGORÍA",
            "MARCA",
            "MODELO / CÓDIGO",
            "UNIDAD MEDIDA",
            "STOCK DISPONIBLE",
            "STOCK MÍNIMO",
            "ESTADO REPOSICIÓN",
            "COSTO UNITARIO ($ CLP)",
            "VALORIZACIÓN TOTAL ($ CLP)",
            "PROVEEDOR PRINCIPAL",
            "COMPATIBILIDAD Y APLICACIÓN"
        ]
    ];

    let valorTotalInventario = 0;
    let unidadesTotales = 0;
    const conteoCategorias = {};

    corssenStock.forEach(item => {
        const stock = Number(item.stock || 0);
        const costo = Number(item.costo || 0);
        const valorLinea = stock * costo;

        valorTotalInventario += valorLinea;
        unidadesTotales += stock;

        const cat = item.categoria || "GENERAL";
        if (!conteoCategorias[cat]) {
            conteoCategorias[cat] = { articulos: 0, unidades: 0, valor: 0 };
        }
        conteoCategorias[cat].articulos++;
        conteoCategorias[cat].unidades += stock;
        conteoCategorias[cat].valor += valorLinea;

        let estadoStock = "NORMAL";
        if (stock === 0) estadoStock = "AGOTADO / CRÍTICO";
        else if (stock <= (item.stockMin || 1)) estadoStock = "BAJO STOCK MÍNIMO";

        datosStock.push([
            item.detalle || "",
            cat,
            item.marca || "",
            item.modelo || "",
            item.medida || "UN",
            stock,
            item.stockMin || 1,
            estadoStock,
            costo,
            valorLinea,
            item.proveedor || "-",
            item.compatible || "-"
        ]);
    });

    datosStock.push([]);
    datosStock.push([
        "TOTALES INVENTARIO",
        `${corssenStock.length} Artículos`,
        "",
        "",
        "Total Unidades:",
        unidadesTotales,
        "",
        "",
        "Valor Total Bodega:",
        valorTotalInventario,
        "",
        ""
    ]);

    // Hoja 2: Resumen Financiero por Categoría
    const datosCategorias = [
        ["RESUMEN FINANCIERO Y VALORIZACIÓN POR CATEGORÍA DE INSUMOS"],
        [`Fecha: ${fecha}`, `Emitido por: ${usuario}`],
        [],
        [
            "CATEGORÍA",
            "NÚMERO DE ARTÍCULOS EN CATÁLOGO",
            "UNIDADES FÍSICAS DISPONIBLES",
            "VALORIZACIÓN TOTAL ($ CLP)",
            "% PARTICIPACIÓN VALOR"
        ]
    ];

    Object.keys(conteoCategorias).forEach(catKey => {
        const c = conteoCategorias[catKey];
        const pct = valorTotalInventario > 0 ? ((c.valor / valorTotalInventario) * 100).toFixed(1) + "%" : "0%";
        datosCategorias.push([
            catKey,
            c.articulos,
            c.unidades,
            c.valor,
            pct
        ]);
    });

    datosCategorias.push([]);
    datosCategorias.push([
        "TOTAL CONSOLIDADO",
        corssenStock.length,
        unidadesTotales,
        valorTotalInventario,
        "100%"
    ]);

    descargarLibroExcel("Inventario_Stock_CORSSEN", [
        {
            nombre: "Existencias en Bodega",
            datos: datosStock,
            anchos: [34, 18, 16, 20, 14, 18, 15, 20, 22, 24, 26, 38]
        },
        {
            nombre: "Resumen Categorías",
            datos: datosCategorias,
            anchos: [22, 32, 28, 26, 22]
        }
    ]);
}

function exportarKardexExcel() {
    const usuario = sessionStorage.getItem("nombreUsuario") || "Alexis Santos";
    const fecha = new Date().toLocaleDateString("es-CL");

    const datosKardex = [
        ["KÁRDEX Y TRAZABILIDAD DE MOVIMIENTOS DE BODEGA - CORSSEN LOGÍSTICA"],
        [`Fecha de Emisión: ${fecha}`, `Emitido por: ${usuario}`, "Registro de Entradas y Salidas"],
        [],
        [
            "FECHA",
            "TIPO MOVIMIENTO",
            "FOLIO OT / DOCUMENTO",
            "EQUIPO / DESTINO",
            "INSUMO O REPUESTO",
            "CANTIDAD MOVIMIENTO",
            "UNIDAD MEDIDA",
            "STOCK RESTANTE",
            "COSTO UNITARIO ($)",
            "TOTAL TRANSACCIÓN ($)",
            "RESPONSABLE / OPERADOR", "STOCK ANTERIOR", "MOTIVO", "NOTA / REFERENCIA", "FECHA Y HORA"
        ]
    ];

    let totalIngresosCLP = 0;
    let totalConsumoOTCLP = 0;

    (inventario || []).forEach(mov => {
        const esAjuste = mov.tipo === "AJUSTE";
        const esIngreso = (mov.tipo === "INGRESO" || (mov.cantidad && mov.cantidad < 0));
        const cantAbs = Math.abs(mov.cantidad || 1);
        const costoTotal = Number(mov.costoTotal || ((mov.costoUnitario || 0) * cantAbs));

        if (esAjuste) {
            // Inventory corrections are valued separately from purchases and OT consumption.
        } else if (esIngreso) {
            totalIngresosCLP += costoTotal;
        } else {
            totalConsumoOTCLP += costoTotal;
        }

        datosKardex.push([
            mov.fecha || "-",
            esAjuste ? "AJUSTE DE STOCK" : esIngreso ? "INGRESO / COMPRA" : "CONSUMO EN MANTENCIÓN OT",
            mov.folioOT || (esIngreso ? "Ingreso Bodega" : "OT General"),
            mov.codigoEquipo ? `${mov.codigoEquipo} - ${mov.equipoNombre || ''}` : "Bodega General",
            mov.insumoDetalle || "-",
            esAjuste ? mov.delta : esIngreso ? cantAbs : -cantAbs,
            mov.medida || "UN",
            mov.stockRestante !== undefined ? mov.stockRestante : "-",
            mov.costoUnitario || 0,
            costoTotal,
            mov.responsable || "-", mov.stockAnterior ?? "", mov.motivo || "", mov.nota || "", mov.fechaHora || ""
        ]);
    });

    datosKardex.push([]);
    datosKardex.push([
        "RESUMEN FINANCIERO",
        `${inventario.length} Transacciones`,
        "", "", "", "", "", "",
        "Total Ingresos Mercadería:",
        totalIngresosCLP,
        ""
    ]);
    datosKardex.push([
        "", "", "", "", "", "", "", "",
        "Total Consumido en OTs:",
        totalConsumoOTCLP,
        ""
    ]);

    descargarLibroExcel("Historial_Kardex_CORSSEN", [
        {
            nombre: "Kárdex de Movimientos",
            datos: datosKardex,
            anchos: [14, 28, 22, 28, 34, 22, 15, 16, 18, 22, 24]
        }
    ]);
}

function exportarFichaEquipoExcel() {
    const cod = (typeof equipoSeleccionadoFicha !== "undefined" && equipoSeleccionadoFicha) ? equipoSeleccionadoFicha : (typeof equipoSeleccionado !== "undefined" && equipoSeleccionado ? equipoSeleccionado : "GPC-01");
    const eq = (typeof corssenFichas !== "undefined" && corssenFichas[cod]) ? corssenFichas[cod] : null;

    if (!eq) {
        alert("Seleccione un equipo para exportar su ficha técnica.");
        return;
    }

    const usuario = sessionStorage.getItem("nombreUsuario") || "Alexis Santos";
    const fecha = new Date().toLocaleDateString("es-CL");
    const codigoMostrar = eq.codigo || cod;

    // Hoja 1: Especificaciones y Plan de Lubricación
    const datosFicha = [
        [`FICHA TÉCNICA OFICIAL • ${codigoMostrar} - ${eq.nombre}`],
        [`Marca: ${eq.marca}`, `Modelo: ${eq.modelo}`, `Año: ${eq.anio}`, `Capacidad: ${eq.capacidad}`],
        [`Motor / Patente: ${eq.motor || eq.patente || '-'}`, `Responsable: ${eq.responsable || '-'}`, `Fecha Emisión: ${fecha}`],
        [],
        ["1. ESPECIFICACIONES DE LUBRICACIÓN Y FLUIDOS"],
        ["COMPONENTE / SISTEMA", "TIPO DE LUBRICANTE / FLUIDO", "PROVEEDOR / ESPECIFICACIÓN", "CAPACIDAD APROX."]
    ];

    if (eq.aceites && Array.isArray(eq.aceites) && eq.aceites.length > 0) {
        eq.aceites.forEach(a => {
            datosFicha.push([
                a.tipo || "-",
                a.modelo || "-",
                a.proveedor || "Luval / Fabricante",
                a.cantidad || "Según nivel"
            ]);
        });
    } else if (eq.lubricacion) {
        datosFicha.push(["Motor Diésel", eq.lubricacion.motor || "-", "15W-40 CI-4 / CK-4", "Segun nivel"]);
        datosFicha.push(["Sistema Hidráulico", eq.lubricacion.hidraulico || "-", "ISO VG 68 Anti-desgaste", "Segun nivel"]);
        datosFicha.push(["Transmisión / Convertidor", eq.lubricacion.transmision || "-", "ATF / SAE 30 / TO-4", "Segun nivel"]);
        datosFicha.push(["Diferencial / Mandos Finales", eq.lubricacion.diferencial || "-", "80W-90 / 85W-140 GL-5", "Segun nivel"]);
        datosFicha.push(["Sistema de Refrigeración", eq.lubricacion.refrigerante || "-", "50/50 OAT / HOAT Larga Duración", "Segun nivel"]);
        datosFicha.push(["Puntos de Engrase", eq.lubricacion.grasa || "-", "Grasa Litio EP-2 con Molibdeno", "Cada 50 hrs"]);
    }

    datosFicha.push([]);
    datosFicha.push(["2. MATRIZ DE EQUIVALENCIAS MULTIMARCA DE FILTROS"]);
    datosFicha.push(["TIPO DE FILTRO", "OPCIÓN BALDWIN", "OPCIÓN DONALDSON", "OPCIÓN FLEETGUARD", "OPCIÓN MANN / ORIGINAL"]);

    if (eq.filtros && Array.isArray(eq.filtros)) {
        eq.filtros.forEach(f => {
            datosFicha.push([
                f.elemento || f.tipo || "",
                f.alt1 || f.baldwin || "-",
                f.alt2 || f.donaldson || "-",
                f.alt3 || f.fleetguard || "-",
                f.alt4 || f.original || "-"
            ]);
        });
    }

    // Hoja 2: Bitácora de servicios realizados a esta unidad
    const mantDeEsteEquipo = mantenciones.filter(m => (m.codigoEquipo || "").toUpperCase() === cod.toUpperCase() || (m.patente || "").toUpperCase() === (eq.patente || "").toUpperCase());
    const datosBitacora = [
        [`BITÁCORA HISTÓRICA DE MANTENCIONES • ${codigoMostrar} - ${eq.nombre}`],
        [`Total Mantenciones Registradas: ${mantDeEsteEquipo.length}`],
        [],
        [
            "FOLIO OT",
            "FECHA",
            "TIPO SERVICIO",
            "HORÓMETRO / KM",
            "PRÓXIMO SERVICIO",
            "TRABAJOS REALIZADOS",
            "INSUMOS APLICADOS",
            "INVERSIÓN TOTAL ($)",
            "TÉCNICO RESPONSABLE"
        ]
    ];

    mantDeEsteEquipo.forEach(m => {
        const insText = (m.insumosConsumidos || []).map(i => `${i.cantidad}x ${i.detalle}`).join("; ");
        datosBitacora.push([
            m.folio || m.id || "OT-000",
            m.fecha || "-",
            m.tipo || "Preventiva",
            m.horometroKm || "-",
            m.proximoServicio || "-",
            m.descripcion || "-",
            insText || "Sin insumos de bodega",
            m.costoTotal || 0,
            m.tecnico || "Alexis Santos"
        ]);
    });

    descargarLibroExcel(`Ficha_Tecnica_${eq.codigo}_CORSSEN`, [
        {
            nombre: `Ficha ${eq.codigo}`,
            datos: datosFicha,
            anchos: [28, 30, 26, 26, 26]
        },
        {
            nombre: "Bitácora de Servicios",
            datos: datosBitacora,
            anchos: [14, 13, 20, 18, 18, 40, 32, 18, 22]
        }
    ]);
}

function exportarCombustibleExcel() {
    const usuario = sessionStorage.getItem("nombreUsuario") || "Alexis Santos";
    const fecha = new Date().toLocaleDateString("es-CL");

    // Hoja 1: Despachos a Equipos y Flota
    const datosDespachos = [
        ["REGISTRO DE DESPACHOS DE COMBUSTIBLE - CORSSEN LOGÍSTICA"],
        [`Fecha de Emisión: ${fecha}`, `Emitido por: ${usuario}`],
        [],
        [
            "FECHA",
            "PATENTE / CÓD. EQUIPO",
            "CONDUCTOR / OPERADOR",
            "LITROS DESPACHADOS (LTS)",
            "PRECIO UNITARIO ($/L)",
            "TOTAL INVERSIÓN ($ CLP)",
            "ORIGEN / ESTACIÓN",
            "SALDO ESTANQUE RESTANTE (LTS)"
        ]
    ];

    let litrosTotales = 0;
    let inversionTotalCombustible = 0;

    (cargas || []).forEach(c => {
        const lts = Number(c.litros || 0);
        const precio = Number(c.precioLitro || 0);
        const tot = Number(c.total || (lts * precio));

        litrosTotales += lts;
        inversionTotalCombustible += tot;

        const origenText = c.origen === "ESTANQUE_400L" ? "Estanque Diésel 400L (Taller Central)" : (c.estacion || "Estación Externa");
        const saldoText = c.saldoPosterior !== undefined && c.saldoPosterior !== null ? Number(c.saldoPosterior).toFixed(1) : "-";

        datosDespachos.push([
            c.fecha || "-",
            c.patente || "-",
            c.conductor || "Alexis Santos",
            lts,
            precio,
            tot,
            origenText,
            saldoText
        ]);
    });

    datosDespachos.push([]);
    datosDespachos.push([
        "TOTALES GENERALES",
        `${cargas.length} Despachos Registrados`,
        "",
        litrosTotales,
        "",
        inversionTotalCombustible,
        "",
        ""
    ]);

    // Hoja 2: Historial de Recargas del Estanque 400L
    const datosRecargas = [
        ["HISTORIAL DE RECARGAS DE PETRÓLEO DIÉSEL - ESTANQUE 400 LITROS"],
        [`Fecha de Emisión: ${fecha}`, `Emitido por: ${usuario}`],
        [],
        [
            "FECHA RECARGA",
            "N° REGISTRO",
            "LITROS CARGADOS (LTS)",
            "PROVEEDOR / DISTRIBUIDOR",
            "N° GUÍA / FACTURA",
            "COSTO POR LITRO ($/L)",
            "INVERSIÓN TOTAL ($ CLP)",
            "RESPONSABLE RECEPCIÓN",
            "SALDO POSTERIOR (LTS)",
            "OBSERVACIONES"
        ]
    ];

    let totalLitrosRecargados = 0;
    let totalInversionRecargas = 0;

    (historialRecargasCombustible || []).forEach(r => {
        const lts = Number(r.litrosCargados || 0);
        const tot = Number(r.costoTotal || 0);
        totalLitrosRecargados += lts;
        totalInversionRecargas += tot;

        datosRecargas.push([
            r.fecha || "-",
            r.id || "-",
            lts,
            r.proveedor || "COPEC S.A.",
            r.factura || "-",
            Number(r.costoPorLitro || 0),
            tot,
            r.responsable || "Alexis Santos",
            Number(r.saldoPosterior || 400),
            r.observaciones || "-"
        ]);
    });

    datosRecargas.push([]);
    datosRecargas.push([
        "TOTAL RECARGADO HISTÓRICO",
        `${historialRecargasCombustible.length} Recargas Registradas`,
        totalLitrosRecargados,
        "",
        "",
        "",
        totalInversionRecargas,
        "",
        "",
        ""
    ]);

    // Hoja 3: Ficha de Estado Actual del Estanque
    const datosResumenEstanque = [
        ["ESTADO VIGENTE DEL ESTANQUE DE COMBUSTIBLE (400 LITROS)"],
        [`Fecha de Consulta: ${fecha}`],
        [],
        ["Tipo de Combustible:", estadoTanqueCombustible.nombre || "Petróleo Diésel Grado B (Ultra Diésel)"],
        ["Capacidad Nominal Máxima:", `${estadoTanqueCombustible.capacidad || 400} Litros`],
        ["Saldo Físico Disponible:", `${(estadoTanqueCombustible.actual !== undefined ? estadoTanqueCombustible.actual : (estadoTanqueCombustible.capacidad || 400)).toFixed(1)} Litros`],
        ["Porcentaje de Llenado:", `${(((estadoTanqueCombustible.actual !== undefined ? estadoTanqueCombustible.actual : (estadoTanqueCombustible.capacidad || 400)) / (estadoTanqueCombustible.capacidad || 400)) * 100).toFixed(1)}%`],
        ["Precio Promedio por Litro:", `$${(estadoTanqueCombustible.costoPorLitro || 1050).toLocaleString('es-CL')}`],
        ["Proveedor Habitual:", estadoTanqueCombustible.proveedor || "COPEC S.A."],
        ["Última Factura de Recarga:", estadoTanqueCombustible.factura || "FAC-91823"],
        ["Fecha Última Recarga:", estadoTanqueCombustible.fechaUltimaRecarga || ""],
        ["Estado Operativo:", estadoTanqueCombustible.estado || "Activo"]
    ];

    descargarLibroExcel("CORSSEN_CONTROL_COMBUSTIBLE_Y_ESTANQUE_400L", [
        {
            nombre: "Despachos a Equipos",
            datos: datosDespachos,
            anchos: [14, 24, 26, 22, 22, 24, 34, 24]
        },
        {
            nombre: "Recargas Estanque 400L",
            datos: datosRecargas,
            anchos: [16, 18, 22, 28, 20, 20, 24, 24, 22, 35]
        },
        {
            nombre: "Estado Estanque",
            datos: datosResumenEstanque,
            anchos: [28, 40]
        }
    ]);
}

function exportarTanqueCombustibleExcel() {
    exportarCombustibleExcel();
}

function exportarFlotaExcel() {
    const usuario = sessionStorage.getItem("nombreUsuario") || "Alexis Santos";
    const fecha = new Date().toLocaleDateString("es-CL");

    // Hoja 1: Vehículos Livianos y Camiones
    const datosVeh = [
        ["CATÁLOGO DE CAMIONETAS Y CAMIONES - CORSSEN LOGÍSTICA"],
        [`Fecha: ${fecha}`, `Emitido por: ${usuario}`],
        [],
        ["CÓDIGO", "PATENTE", "DENOMINACIÓN", "MARCA", "MODELO", "AÑO", "CAPACIDAD", "COMBUSTIBLE", "KILOMETRAJE", "ESTADO", "RESPONSABLE"]
    ];
    vehiculos.forEach(v => {
        datosVeh.push([
            v.codigo || v.id || "-",
            v.patente || "-",
            v.nombre || "-",
            v.marca || "-",
            v.modelo || "-",
            v.anio || 2024,
            v.capacidad || "1 TON",
            v.combustible || "Diésel",
            v.kilometraje || 0,
            v.estado || "Operativo",
            v.responsable || "Alexis Santos"
        ]);
    });

    // Hoja 2: Maquinarias y Grúas
    const datosMaq = [
        ["CATÁLOGO DE MAQUINARIA PESADA Y GRÚAS - CORSSEN LOGÍSTICA"],
        [`Fecha: ${fecha}`, `Emitido por: ${usuario}`],
        [],
        ["CÓDIGO INTERNO", "TIPO MAQUINARIA", "MARCA", "MODELO", "AÑO", "CAPACIDAD", "COMBUSTIBLE", "HORÓMETRO (HRS)", "ESTADO", "RESPONSABLE"]
    ];
    maquinarias.forEach(m => {
        datosMaq.push([
            m.numeroMaquinaria || m.id || "-",
            m.tipoMaquinaria || "-",
            m.marcaMaquinaria || "-",
            m.modeloMaquinaria || "-",
            m.anioMaquinaria || 2024,
            m.capacidadMaquinaria || "Pesado",
            m.combustibleMaquinaria || "Diésel",
            m.horometro || 0,
            m.estado || "Operativo",
            m.responsable || "Alexis Santos"
        ]);
    });

    // Hoja 3: Equipos Auxiliares
    const auxList = corssenPrograma.filter(i => i.cat === "AUXILIARES");
    const datosAux = [
        ["EQUIPOS AUXILIARES, GENERADORES Y HERRAMIENTAS - CORSSEN LOGÍSTICA"],
        [`Fecha: ${fecha}`, `Total Equipos: ${auxList.length}`],
        [],
        ["CÓDIGO", "DENOMINACIÓN DEL EQUIPO", "MARCA", "CATEGORÍA", "FRECUENCIA", "ESTADO", "RESPONSABLE", "OBSERVACIONES"]
    ];
    auxList.forEach(a => {
        datosAux.push([
            a.cod || "-",
            a.equipo || "-",
            a.marca || "-",
            a.cat || "AUXILIARES",
            a.frecuencia || "-",
            a.estado || "OPERATIVA",
            a.responsable || "Alexis Santos",
            a.observaciones || "-"
        ]);
    });

    // Hoja 4: Marítimo
    const marList = corssenPrograma.filter(i => i.cat === "MARÍTIMO");
    const datosMar = [
        ["EQUIPOS Y EMBARCACIONES MARÍTIMAS - CORSSEN LOGÍSTICA"],
        [`Fecha: ${fecha}`, `Total Unidades: ${marList.length}`],
        [],
        ["CÓDIGO", "DENOMINACIÓN", "MARCA", "FRECUENCIA", "ESTADO", "RESPONSABLE", "OBSERVACIONES"]
    ];
    marList.forEach(m => {
        datosMar.push([
            m.cod || "-",
            m.equipo || "-",
            m.marca || "-",
            m.frecuencia || "-",
            m.estado || "OPERATIVA",
            m.responsable || "Alexis Santos",
            m.observaciones || "-"
        ]);
    });

    descargarLibroExcel("Flota_Maquinarias_CORSSEN", [
        { nombre: "Camionetas y Camiones", datos: datosVeh, anchos: [14, 14, 26, 16, 18, 10, 14, 14, 16, 14, 22] },
        { nombre: "Maquinaria y Grúas", datos: datosMaq, anchos: [16, 26, 16, 18, 10, 14, 14, 18, 14, 22] },
        { nombre: "Equipos Auxiliares", datos: datosAux, anchos: [14, 30, 16, 16, 18, 14, 22, 38] },
        { nombre: "Equipos Marítimos", datos: datosMar, anchos: [14, 28, 16, 18, 14, 22, 38] }
    ]);
}

async function sincronizarConUltimoRespaldoNube(forzarRecarga = false) {
    try {
        const resp = await fetch("/api/backup/obtener/ultimo?t=" + Date.now());
        if (!resp.ok) return false;

        const backup = await resp.json();
        if (!backup || !backup.data) return false;

        const serverTs = Number(backup.timestamp || 0);
        const localTs = Number(localStorage.getItem("corssen_ultima_modificacion_ts") || 0);

        // Los respaldos NO se aplican automáticamente: solo cuando el usuario lo solicita explícitamente (forzarRecarga === true)
        if (forzarRecarga) {
            console.log(`☁️ Aplicando manualmente punto de respaldo desde la nube (Servidor: ${serverTs})...`);
            const data = backup.data;

            if (data.corssen_programa_v2) corssenPrograma = JSON.parse(JSON.stringify(data.corssen_programa_v2));
            if (data.corssen_stock_v2) corssenStock = JSON.parse(JSON.stringify(data.corssen_stock_v2));
            if (data.corssen_fichas_v2) corssenFichas = JSON.parse(JSON.stringify(data.corssen_fichas_v2));
            if (data.flota_vehiculos_v3) vehiculos = JSON.parse(JSON.stringify(data.flota_vehiculos_v3));
            if (data.flota_maquinarias_v3) maquinarias = JSON.parse(JSON.stringify(data.flota_maquinarias_v3));
            if (data.flota_cargas) cargas = JSON.parse(JSON.stringify(data.flota_cargas));
            if (data.flota_mantenciones_v3) mantenciones = JSON.parse(JSON.stringify(data.flota_mantenciones_v3));
            if (data.flota_inventario_v3) inventario = JSON.parse(JSON.stringify(data.flota_inventario_v3));
            if (data.corssen_tambores_aceite_v2) {
                estadoTamboresAceite = JSON.parse(JSON.stringify(data.corssen_tambores_aceite_v2));
                estadoTamborAceite = estadoTamboresAceite.tambor1;
            } else if (data.corssen_tambor_aceite_v1) {
                estadoTamborAceite = JSON.parse(JSON.stringify(data.corssen_tambor_aceite_v1));
                if (estadoTamboresAceite) {
                    estadoTamboresAceite.tambor1 = estadoTamborAceite;
                }
            }
            if (data.corssen_historial_aceite_v1) historialConsumoAceite = JSON.parse(JSON.stringify(data.corssen_historial_aceite_v1));
            if (data.corssen_tanque_combustible_v1) estadoTanqueCombustible = JSON.parse(JSON.stringify(data.corssen_tanque_combustible_v1));
            if (data.corssen_historial_recargas_comb_v1) historialRecargasCombustible = JSON.parse(JSON.stringify(data.corssen_historial_recargas_comb_v1));

            // Sincronizar fichas técnicas recibidas con la flota registrada y programa maestro
            if (typeof sincronizarFichasConFlotaRegistrada === "function") {
                sincronizarFichasConFlotaRegistrada();
            }

            // Guardar localmente reflejando el timestamp del servidor
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
            localStorage.setItem("corssen_ultima_modificacion_ts", String(serverTs || Date.now()));

            // Re-renderizar todos los componentes de la interfaz
            renderizarDashboard();
            renderizarProgramaMaestro();
            renderizarStockInsumos();
            renderizarKardexMovimientos();
            renderizarMantenciones();
            renderizarModuloAceite();
            renderizarModuloCombustible();
            renderizarTablasOriginales();
            poblarSelectorEquiposMantencion();
            poblarSelectorEquiposCompatiblesStock();
            renderizarSelectorFichas();
            renderizarDetalleFichaTecnica();
            renderizarFlotaRegistrada();
            actualizarPermisosFichasTecnicas();
            actualizarPermisosFlotaRegistrada();
            actualizarPermisosModuloRespaldos();
            if (typeof renderizarModuloRespaldos === "function" && (sessionStorage.getItem("usuarioLogueado") || "").toLowerCase().trim() === "admin") {
                renderizarModuloRespaldos();
            }

            const elEstado = document.querySelector(".estado-sistema");
            if (elEstado) {
                elEstado.innerHTML = `<span class="estado-punto" style="background:#10b981;"></span> Respaldo Nube ServiTec Pro`;
            }

            // Reconciliar adicionalmente con el registro individual de programa para evitar sobreescritura de estados recién editados
            sincronizarProgramaDesdeServidor();
            alert("✓ Punto de restauración aplicado exitosamente. El sistema se ha sincronizado con el respaldo de la nube.");
            return true;
        } else {
            // Modo no intrusivo: NO se aplica automáticamente para respetar el trabajo actual del usuario
            if (serverTs > 0 && serverTs > localTs) {
                console.log(`☁️ Respaldo en la nube disponible (${serverTs}). Esperando aplicación manual del usuario.`);
                const elEstado = document.querySelector(".estado-sistema");
                if (elEstado) {
                    elEstado.innerHTML = `<span class="estado-punto" style="background:#10b981;"></span> Respaldo Nube ServiTec Pro`;
                }
            } else if (localTs > 0 && localTs > serverTs) {
                // El dispositivo local tiene cambios más recientes pendientes de subir a la nube
                if (typeof window.ejecutarAutoBackupSistema === "function") {
                    window.ejecutarAutoBackupSistema("Sincronización de cambios pendientes", "AUTOMATICO", true);
                }
            }
        }
    } catch (err) {
        console.warn("Aviso de sincronización en la nube (modo offline/red lenta):", err);
    }
    return false;
}

function aplicarTemaVisual(tema, guardar = true) {
    if (!tema) tema = "sistema";
    if (guardar) {
        try {
            localStorage.setItem("corssen_tema_preferido", tema);
        } catch (_) {}
    }

    let esOscuro = false;
    if (tema === "oscuro") {
        esOscuro = true;
    } else if (tema === "claro") {
        esOscuro = false;
    } else {
        // Seguir sistema operativo
        esOscuro = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    if (typeof document !== "undefined" && document && document.documentElement) {
        if (esOscuro) {
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.setAttribute("data-theme", "claro");
        }
    }

    // Actualizar indicador del botón en la topbar
    const icono = document.getElementById("iconoTemaActual");
    const texto = document.getElementById("textoTemaActual");
    if (icono && texto) {
        if (tema === "oscuro") {
            icono.textContent = "🌙";
            texto.textContent = "Oscuro";
        } else if (tema === "claro") {
            icono.textContent = "☀️";
            texto.textContent = "Claro";
        } else {
            icono.textContent = "💻";
            texto.textContent = "Sistema";
        }
    }

    // Marcar opción activa en el dropdown
    ["claro", "oscuro", "sistema"].forEach(t => {
        const idOpt = "optTema" + t.charAt(0).toUpperCase() + t.slice(1);
        const opt = document.getElementById(idOpt);
        if (opt) {
            if (t === tema) {
                opt.classList.add("active");
            } else {
                opt.classList.remove("active");
            }
        }
    });
}

function inicializarSistemaTema() {
    let temaGuardado = "sistema";
    try {
        temaGuardado = localStorage.getItem("corssen_tema_preferido") || "sistema";
    } catch (_) {}
    aplicarTemaVisual(temaGuardado, false);

    // Escuchar cambios en la preferencia del sistema operativo en tiempo real
    if (window.matchMedia) {
        const queryMedia = window.matchMedia("(prefers-color-scheme: dark)");
        const handlerOS = () => {
            let actual = "sistema";
            try {
                actual = localStorage.getItem("corssen_tema_preferido") || "sistema";
            } catch (_) {}
            if (actual === "sistema") {
                aplicarTemaVisual("sistema", false);
            }
        };
        if (queryMedia.addEventListener) {
            queryMedia.addEventListener("change", handlerOS);
        } else if (queryMedia.addListener) {
            queryMedia.addListener(handlerOS);
        }
    }

    // Cerrar dropdown al hacer clic fuera
    document.addEventListener("click", (e) => {
        const wrapper = document.getElementById("themeSwitchWrapper");
        const menu = document.getElementById("dropdownMenuTema");
        if (menu && wrapper && !wrapper.contains(e.target)) {
            menu.style.display = "none";
            const btn = document.getElementById("btnToggleTema");
            if (btn) btn.setAttribute("aria-expanded", "false");
        }
    });
}

function escapeHtmlSoporte(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function reproducirChimeMensaje() {
    if (!sonidoChatHabilitado) return;
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        if (ctx.state === "suspended") {
            ctx.resume();
        }
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(880, ctx.currentTime);
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(1320, ctx.currentTime + 0.09);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.09);
        osc2.start(ctx.currentTime + 0.09);
        osc2.stop(ctx.currentTime + 0.25);
    } catch (_) {}
}

function obtenerRespuestaSoporte(texto) {
    const tema = SoporteBot.detectar(texto);
    return tema ? SoporteBot.temas[tema] : {titulo:"¿En qué módulo necesitas ayuda?",respuesta:"Indica el módulo, código de unidad o folio y qué ocurrió. Puedes seleccionar un tema de la lista o solicitar atención de Aron."};
}

function actualizarVisibilidadModoAdminChat() {
    const barraAdmin = document.getElementById("barraModoAdminSoporte");
    const input = document.getElementById("inputPreguntaSoporte");
    const usuarioLog = (sessionStorage.getItem("usuarioLogueado") || "").toLowerCase().trim();
    const esAdmin = (usuarioLog === "admin");

    if (barraAdmin) {
        barraAdmin.style.display = esAdmin ? "flex" : "none";
    }
    if (input) {
        if (esAdmin) {
            input.placeholder = "Escribe una respuesta como Aron Martinez (Administrador General)...";
        } else {
            const nombre = sessionStorage.getItem("nombreUsuario") || (usuarioLog === "daniel" ? "Daniel Corssen" : (usuarioLog === "rodrigo" ? "Rodrigo Silva" : "Operador"));
            input.placeholder = `Escribe tu consulta aquí a Aron Martinez, ${nombre}...`;
        }
    }
}

async function inicializarChatSoporte() {
    chatSoporteIniciado = true;
    renderizarChipsPreguntasRapidas();
    actualizarVisibilidadModoAdminChat();
    await cargarMensajesSoporteServidor(false);

    if (!intervaloPollingChatSoporte) {
        intervaloPollingChatSoporte = setInterval(() => {
            cargarMensajesSoporteServidor(true);
        }, 3500);
    }
}

async function cargarMensajesSoporteServidor(reproducirSonidoSiNuevos) {
    try {
        const usuarioChat = (sessionStorage.getItem("usuarioLogueado") || "operador").toLowerCase().trim();
        const abierto = document.getElementById("ventanaChatSoporte")?.style.display === "flex" && document.visibilityState === "visible";
        const filtro = usuarioChat === "admin" ? "" : "&usuario=" + encodeURIComponent(usuarioChat) + (abierto ? "&leido=1" : "");
        const resp = await fetch("/api/soporte/mensajes?t=" + Date.now() + filtro, {headers: {"x-usuario": usuarioChat}});
        if (!resp.ok) return;
        const data = await resp.json();

        // Verificación de solicitudes pendientes de soporte para Administrador General
        const usuarioActualSop = (sessionStorage.getItem("usuarioLogueado") || "").toLowerCase().trim();
        const esAdminActual = (usuarioActualSop === "admin");
        if (esAdminActual) {
            const countPendientes = typeof data.pendientesAdminCount === "number" ? data.pendientesAdminCount : 0;
            const badgeMenu = document.getElementById("badgeUnreadSoporteMenu");
            if (badgeMenu) {
                if (countPendientes > 0) {
                    badgeMenu.style.display = "inline-flex";
                    badgeMenu.textContent = String(countPendientes);
                } else {
                    badgeMenu.style.display = "none";
                    badgeMenu.textContent = "0";
                }
            }

            if (countPendientes > 0 && Array.isArray(data.ultimosPendientes) && data.ultimosPendientes.length > 0) {
                const primerPendiente = data.ultimosPendientes[0];
                if (typeof window.mostrarToastSoporteAdmin === "function") {
                    window.mostrarToastSoporteAdmin(primerPendiente);
                }
            }
        }

        const mensajesNuevos = Array.isArray(data.mensajes) ? data.mensajes.map(m => ({...m, avatar:m.esBot ? null : (data.perfiles?.[String(m.usuario || "").toLowerCase()] || null)})) : [];



        const habiaMensajes = mensajesChatLocales.length > 0;
        const idUltimoPrevio = habiaMensajes ? mensajesChatLocales[mensajesChatLocales.length - 1].id : null;
        const idUltimoNuevo = mensajesNuevos[mensajesNuevos.length - 1]?.id;

        if (JSON.stringify(mensajesChatLocales) !== JSON.stringify(mensajesNuevos)) {
            const esNuevoMensajeSoporte = mensajesNuevos[mensajesNuevos.length - 1]?.esSoporte;
            mensajesChatLocales = mensajesNuevos;
            renderizarMensajesEnPantalla(mensajesChatLocales);

            if (reproducirSonidoSiNuevos && habiaMensajes && esNuevoMensajeSoporte && idUltimoPrevio !== idUltimoNuevo) {
                reproducirChimeMensaje();
                const ventana = document.getElementById("ventanaChatSoporte");
                const estaAbierta = ventana && ventana.style.display === "flex";
                if (!estaAbierta) {
                    const badge = document.getElementById("badgeNotifSoporte");
                    if (badge) {
                        badge.style.display = "flex";
                        const cant = parseInt(badge.textContent || "0") + 1;
                        badge.textContent = String(cant);
                    }
                }
            }
        }
    } catch (_) {}
}

function avatarHtmlSoporte(avatar, esBot = false) {
    if (esBot) return '<span class="chat-avatar-perfil chat-avatar-bot" aria-hidden="true">🤖</span>';
    const valor = String(avatar || '').trim();
    const presets = {"avatar-mecanico":"👷‍♂️","avatar-admin":"👨‍💼","avatar-grua-porta":"🏗️","avatar-horquilla":"🚜","avatar-camion":"🚚","avatar-maritimo":"⚓","avatar-panol":"🔧","avatar-supervisora":"👩‍💼","avatar-tecnica":"👷‍♀️","avatar-electrico":"⚡","avatar-seguridad":"🛡️","avatar-planificador":"📋","avatar-combustible":"⛽","avatar-ingeniero":"🧑‍💻","avatar-corssen":"🚢"};
    const esImagen = /^data:image\/(?:png|jpe?g|webp|gif);base64,[a-z0-9+/=\s]+$/i.test(valor) || /^https?:\/\//i.test(valor) || /^\/(?!\/)/.test(valor);
    if (esImagen) return `<span class="chat-avatar-perfil" aria-hidden="true"><img src="${escapeHtmlSoporte(valor)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span hidden>👤</span></span>`;
    return `<span class="chat-avatar-perfil" aria-hidden="true">${escapeHtmlSoporte(presets[valor] || (valor && [...valor].length <= 4 ? valor : "👤"))}</span>`;
}

function generarEtiquetaRemitenteChat(msg, esMio) {
    const usuarioId = String(msg.usuario || (msg.esSoporte ? "admin" : "operador")).toLowerCase().trim();
    let nombre = msg.nombre || "";

    if (!nombre || nombre === "Usuario" || nombre === "Operador") {
        if (usuarioId === "admin" || usuarioId === "aron_soporte" || usuarioId === "aron") nombre = "Aron Martinez (Administrador General)";
        else if (usuarioId === "daniel") nombre = "Daniel Corssen";
        else if (usuarioId === "rodrigo") nombre = "Rodrigo Silva";
        else if (usuarioId === "operador") nombre = "Operador Principal";
        else nombre = usuarioId;
    }

    const esSoporteAdmin = (usuarioId === "admin" || usuarioId === "aron_soporte" || usuarioId === "aron" || Boolean(msg.esSoporte));
    const icono = msg.esBot ? "🤖" : esSoporteAdmin ? "👨‍💻" : (usuarioId === "rodrigo" ? "🔧" : "👤");
    const tag = usuarioId ? `<span class="chat-remitente-tag-usuario">@${escapeHtmlSoporte(usuarioId)}</span>` : "";
    const prefijoTuyo = esMio ? `<span style="font-size:10.5px; color:#0369a1; font-weight:800; margin-right:3px;">(Tú)</span>` : "";

    return `
        <div class="chat-remitente-nombre">
            ${avatarHtmlSoporte(msg.avatar, Boolean(msg.esBot))}
            <span>${prefijoTuyo}${escapeHtmlSoporte(nombre)}</span>
            ${tag}
        </div>
    `;
}

function etiquetaEstadoMensaje(msg) {
    const leido = Boolean(msg.leidoPorDestinatario);
    return `<span title="${leido ? "Leído por el destinatario" : "Guardado en el servidor"}" style="color:${leido ? "#0284c7" : "#64748b"}; font-size:11px;">✓✓</span>`;
}

function renderizarMensajesEnPantalla(mensajes) {
    const cuerpo = document.getElementById("cuerpoChatSoporte");
    if (!cuerpo) return;

    const miUsuario = (sessionStorage.getItem("usuarioLogueado") || "").toLowerCase().trim();
    const esAdmin = (miUsuario === "admin");

    cuerpo.innerHTML = mensajes.map(msg => {
        const remitenteId = String(msg.usuario || "").toLowerCase().trim();
        const esMio = remitenteId === miUsuario;
        const claseGlobo = esMio ? "chat-mensaje-globo chat-mensaje-usuario" : "chat-mensaje-globo chat-mensaje-bot";
        const remitenteHtml = generarEtiquetaRemitenteChat(msg, esMio);
        const checkmarks = esMio ? etiquetaEstadoMensaje(msg) : "";

        return `
            <div class="${claseGlobo}" id="msg-${msg.id}">
                ${remitenteHtml}
                ${msg.tituloContexto ? `<div style="font-weight:700; color:#0f172a; margin-bottom:4px; font-size:12px;">${escapeHtmlSoporte(msg.tituloContexto)}</div>` : ""}
                <div style="font-size:13px; line-height:1.5; white-space:pre-wrap; overflow-wrap:anywhere;">${escapeHtmlSoporte(msg.texto)}</div>
                <div class="chat-hora">
                    <span>${msg.hora || ""}</span>
                    ${checkmarks}
                </div>
            </div>
        `;
    }).join("");

    cuerpo.scrollTop = cuerpo.scrollHeight;
}

function renderizarChipsPreguntasRapidas() {
    const chipsCont = document.getElementById("chipsPreguntasRapidas");
    if (!chipsCont) return;

    chipsCont.innerHTML = PREGUNTAS_RAPIDAS_SOPORTE.map(p => `
        <button type="button" class="chip-pregunta" onclick="seleccionarChipSoporte('${p.id}', '${p.texto}')">
            ${p.texto}
        </button>
    `).join("");
}

async function enviarMensajeUsuarioSoporte(texto, idPreguntaRapida, forzarEsSoporte) {
    const cuerpo = document.getElementById("cuerpoChatSoporte");
    if (!cuerpo) return;

    const horaActual = new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
    const usuarioActual = (sessionStorage.getItem("usuarioLogueado") || "").toLowerCase().trim() || "operador";
    const esAdminGeneral = (usuarioActual === "admin");
    const esSoporte = (typeof forzarEsSoporte === "boolean") ? forzarEsSoporte : esAdminGeneral;

    let nombreActual = sessionStorage.getItem("nombreUsuario");
    if (!nombreActual || esSoporte) {
        if (usuarioActual === "admin" || usuarioActual === "aron") nombreActual = "Aron Martinez (Administrador General)";
        else if (usuarioActual === "daniel") nombreActual = "Daniel Corssen";
        else if (usuarioActual === "rodrigo") nombreActual = "Rodrigo Silva";
        else nombreActual = "Operador Principal";
    }

    const tempId = "temp-" + Date.now();
    const userDiv = document.createElement("div");
    userDiv.className = "chat-mensaje-globo chat-mensaje-usuario";
    userDiv.id = tempId;

    const remitenteHtml = generarEtiquetaRemitenteChat({
        usuario: usuarioActual,
        nombre: nombreActual,
        esSoporte: esSoporte,
        avatar: sessionStorage.getItem("avatarUsuario")
    }, true);

    userDiv.innerHTML = `
        ${remitenteHtml}
        <div style="font-size:13px; line-height:1.4;">${escapeHtmlSoporte(texto)}</div>
        <div class="chat-hora">
            <span>${horaActual}</span>
            <span id="check-${tempId}" style="color:#94a3b8; font-size:11px;">✓</span>
        </div>
    `;
    cuerpo.appendChild(userDiv);
    cuerpo.scrollTop = cuerpo.scrollHeight;

    try {
        const payload = {
            texto: texto,
            temaSoporte: idPreguntaRapida || null,
            usuario: usuarioActual,
            nombre: nombreActual,
            rol: esAdminGeneral ? "admin" : "operador",
            destinatario: esSoporte ? operadorActivoChatAdmin : "admin",
            esSoporte: esSoporte
        };

        const res = await fetch("/api/soporte/mensajes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-usuario": usuarioActual
            },
            body: JSON.stringify(payload)
        });

        const confirmacion = await res.json();
        if (!res.ok || !confirmacion.ok || !confirmacion.guardado || !confirmacion.mensajeEnviado?.id) {
            throw new Error(confirmacion.error || "El servidor no confirmó el guardado");
        }
        if (confirmacion.guardado) {
            const check = document.getElementById(`check-${tempId}`);
            if (check) {
                check.style.color = "#64748b";
                check.title = "Guardado en el servidor";
                check.textContent = "✓✓";
            }
            reproducirChimeMensaje();

            setTimeout(() => {
                cargarMensajesSoporteServidor(false);
            }, 300);
        }
    } catch (e) {
        console.error("Error enviando mensaje a la API de soporte:", e);
        const check = document.getElementById(`check-${tempId}`);
        if (check) { check.textContent = "No enviado"; check.style.color = "#dc2626"; }
        const input = document.getElementById("inputPreguntaSoporte");
        if (input && !input.value) input.value = texto;
    }
}

function mostrarToastSoporteAdmin(pendiente) {
    if (!pendiente || pendiente.id === ultimoToastNotificadoId) return;
    ultimoToastNotificadoId = pendiente.id;

    const toast = document.getElementById("toastNotificacionSoporteAdmin");
    if (!toast) return;

    const tit = document.getElementById("toastSoporteTitulo");
    const sub = document.getElementById("toastSoporteSubtitulo");
    const msg = document.getElementById("toastSoporteMensajeTexto");

    const nom = pendiente.nombre || pendiente.usuario || "Operador";
    if (tit) tit.textContent = `🔔 Solicitud de Soporte: ${nom}`;
    if (sub) sub.textContent = `Hora: ${pendiente.hora || 'Ahora'} • Requiere asistencia en app`;
    if (msg) msg.textContent = `"${pendiente.texto || ''}"`;

    toast.style.display = "block";
    if (typeof reproducirChimeMensaje === "function") {
        reproducirChimeMensaje();
    }
}

function renderizarListaConversacionesAdmin(lista) {
    const contenedor = document.getElementById("listaConversacionesAdmin");
    if (!contenedor) return;

    if (lista.length === 0) {
        contenedor.innerHTML = `<div style="text-align:center; padding:20px; color:#94a3b8; font-size:12px;">No hay operadores registrados</div>`;
        return;
    }

    contenedor.innerHTML = lista.map(c => {
        const esActivo = (c.usuario === operadorActivoChatAdmin);
        const estiloActivo = esActivo ? "background:#e0f2fe; border-color:#38bdf8;" : "background:#ffffff; border-color:#e2e8f0;";
        const badgeAtencion = c.necesitaAtencion 
            ? `<span style="background:#ef4444; color:#ffffff; font-size:10px; font-weight:800; padding:2px 6px; border-radius:10px;" class="soporte-pulso">Requiere Ayuda</span>`
            : (c.sinLeer > 0 ? `<span style="background:#0284c7; color:#ffffff; font-size:10px; font-weight:700; padding:2px 6px; border-radius:10px;">${c.sinLeer} nuevos</span>` : "");

        return `
            <div onclick="seleccionarConversacionAdmin('${c.usuario}')" class="item-conversacion-admin" style="padding:10px 12px; border-radius:10px; border:1px solid; ${estiloActivo} cursor:pointer; display:flex; align-items:center; gap:10px; transition:all 0.2s ease;">
                <div style="width:38px; height:38px; border-radius:50%; background:#f1f5f9; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0;">
                    ${avatarHtmlSoporte(c.avatar)}
                </div>
                <div style="flex:1; min-width:0;">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
                        <span style="font-weight:700; font-size:13px; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtmlSoporte(c.nombre)}</span>
                        <span style="font-size:11px; color:#94a3b8; margin-left:6px;">${c.ultimaHora || ""}</span>
                    </div>
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
                        <span style="font-size:11.5px; color:#64748b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px;">${escapeHtmlSoporte(c.ultimoMensaje || "Sin mensajes")}</span>
                        ${badgeAtencion}
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

async function cargarStreamMensajesOperador(usuarioId) {
    const stream = document.getElementById("streamMensajesAdmin");
    if (!stream) return;

    try {
        const visible = document.getElementById("centroSoporteInterno")?.classList.contains("active") && document.visibilityState === "visible";
        const resp = await fetch(`/api/soporte/mensajes?usuario=${encodeURIComponent(usuarioId)}&t=` + Date.now() + (visible ? "&leido=1" : ""), {headers: {"x-usuario": "admin"}});
        if (!resp.ok) return;
        const data = await resp.json();
        const mensajes = Array.isArray(data.mensajes) ? data.mensajes.map(m => ({...m, avatar:m.esBot ? null : (data.perfiles?.[String(m.usuario || "").toLowerCase()] || null)})) : [];

        if (mensajes.length === 0) {
            stream.innerHTML = `
                <div style="text-align:center; color:#94a3b8; font-size:13px; margin:auto; background:#ffffff; padding:18px 24px; border-radius:12px; border:1px solid #e2e8f0;">
                    💬 No hay mensajes previos con este operador.<br>
                    <span style="font-size:12px; color:#64748b;">Puedes escribirle una indicación o respuesta directa abajo.</span>
                </div>
            `;
            return;
        }

        stream.innerHTML = mensajes.map(msg => {
            const esAdminMsg = Boolean(msg.esSoporte || msg.usuario === "admin" || msg.usuario === "aron_soporte");
            const clase = esAdminMsg ? "chat-mensaje-globo chat-mensaje-usuario" : "chat-mensaje-globo chat-mensaje-bot";
            const check = esAdminMsg ? etiquetaEstadoMensaje(msg) : "";
            const remitenteHtml = generarEtiquetaRemitenteChat(msg, esAdminMsg);

            return `
                <div class="${clase}" id="admin-msg-${msg.id}">
                    ${remitenteHtml}
                    ${msg.tituloContexto ? `<div style="font-weight:700; color:#0f172a; margin-bottom:4px; font-size:12px;">${escapeHtmlSoporte(msg.tituloContexto)}</div>` : ""}
                    <div style="font-size:13px; line-height:1.4;">${escapeHtmlSoporte(msg.texto)}</div>
                    <div class="chat-hora">
                        <span>${msg.hora || ""}</span>
                        ${check}
                    </div>
                </div>
            `;
        }).join("");

        stream.scrollTop = stream.scrollHeight;
    } catch (e) {
        console.error("Error al cargar stream de operador:", e);
    }
}

function leerColaCompartida() {
    try {return JSON.parse(localStorage.getItem(claveColaCompartida) || "[]");}
    catch(error) {console.error("No se pudo leer la cola local",error);return [];}
}

function guardarColaCompartida() {guardarLocalOriginal.call(localStorage,claveColaCompartida,JSON.stringify([...cambiosCompartidos]));}

async function sincronizarEstadoCompartido() {
    if (sincronizacionOcupada || !sessionStorage.getItem("usuarioLogueado")) return;
    sincronizacionOcupada = true;
    try {
        const sessionResponse=await fetch("/api/session",{cache:"no-store"});
        if(sessionResponse.status===401 || sessionResponse.status===403){sessionStorage.clear();window.location.replace("/login.html");return;}
        if(!sessionResponse.ok)throw new Error("No se pudo verificar la sesión");
        const session=await sessionResponse.json();
        if(session.usuario!==sessionStorage.getItem("usuarioLogueado")){sessionStorage.clear();window.location.replace("/login.html");return;}
        sessionStorage.setItem("rolUsuario",session.rol);
        // Commit linked changes (OT, stock, oil and ledger) in one transaction.
        const protectedKeys=["corssen_programa_v2","corssen_fichas_v2","flota_vehiculos_v3","flota_maquinarias_v3"];
        const entries=sincronizacionPreparada ? [...cambiosCompartidos].filter(([key])=>{
            if(!esUsuarioAdministrador() && protectedKeys.includes(key) && !cambiosCompartidos.has("flota_mantenciones_v3")){conflictosCompartidos.add(key);return false;}
            return !conflictosCompartidos.has(key);
        }) : [];
        if(entries.length) {
            const response=await fetch("/api/state",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({entries:entries.map(([key,change])=>({key,...change}))})});
            if(response.status===409 || response.status===403) entries.forEach(([key])=>conflictosCompartidos.add(key));
            else {
                if(!response.ok)throw new Error("No se pudieron guardar los cambios compartidos");
                const result=await response.json();
                for(const [key,change] of entries) {
                    versionesCompartidas.set(key,result.versions[key]);
                    if(cambiosCompartidos.get(key)===change)cambiosCompartidos.delete(key);
                    else cambiosCompartidos.get(key).version=result.versions[key];
                }
                guardarColaCompartida();
            }
        }
        const resp = await fetch("/api/state",{cache:"no-store"});
        if(resp.status===401 || resp.status===403) {sessionStorage.clear();window.location.replace("/login.html");return;}
        if(!resp.ok)throw new Error("Sincronización no disponible");
        const remote = await resp.json();
        if(remote.user) {
            sessionStorage.setItem("usuarioLogueado",remote.user.usuario);
            sessionStorage.setItem("rolUsuario",remote.user.rol);
            actualizarPermisosFichasTecnicas();actualizarPermisosFlotaRegistrada();actualizarPermisosModuloRespaldos();
        }
        let changed = false;
        for(const entry of remote.entries) {
            if(!ESTADO_COMPARTIDO[entry.key])continue;
            if(cambiosCompartidos.has(entry.key)) {
                const change=cambiosCompartidos.get(entry.key);
                if(change.version===null){
                    if(JSON.stringify(change.base)===JSON.stringify(entry.value))change.version=entry.version;
                    else if(JSON.stringify(change.value)===JSON.stringify(entry.value)){cambiosCompartidos.delete(entry.key);versionesCompartidas.set(entry.key,entry.version);}
                    else conflictosCompartidos.add(entry.key);
                }
                continue;
            }
            if(versionesCompartidas.get(entry.key)===entry.version)continue;
            const serialized=JSON.stringify(entry.value);
            if(!sincronizacionPreparada && localStorage.getItem(entry.key) && localStorage.getItem(entry.key)!==serialized) {
                guardarLocalOriginal.call(localStorage,"corssen_antes_sync_"+entry.key,localStorage.getItem(entry.key));
            }
            guardarLocalOriginal.call(localStorage,entry.key,serialized);
            ESTADO_COMPARTIDO[entry.key](entry.value);
            versionesCompartidas.set(entry.key,entry.version);changed=true;
        }
        for(const [key,change] of cambiosCompartidos)if(change.version===null && !remote.entries.some(e=>e.key===key))change.version=0;
        guardarColaCompartida();
        sincronizacionPreparada=true; window.sincronizacionPreparada=true;
        if(changed) {
            for(const render of [renderizarDashboard,renderizarProgramaMaestro,renderizarStockInsumos,renderizarKardexMovimientos,renderizarMantenciones,renderizarModuloAceite,renderizarModuloCombustible,renderizarTablasOriginales,renderizarFlotaRegistrada]) {
                try {render();} catch(error) {console.error("Error actualizando una vista",error);}
            }
        }
        const indicador=document.querySelector(".estado-sistema");
        if(indicador) {
            indicador.textContent="Respaldo Nube ServiTec Pro";
            indicador.title=conflictosCompartidos.size ? "Hay cambios simultáneos pendientes de revisión; se conservaron en este dispositivo" : "Sincronizado con Cloudflare";
            if(conflictosCompartidos.size) {
                const revisar=document.createElement("button");revisar.type="button";revisar.textContent="Cargar la versión compartida";
                revisar.onclick=()=> {
                    if(!confirm("¿Cargar los cambios compartidos? Guardaremos una copia de tus cambios pendientes en este dispositivo antes de actualizar la pantalla."))return;
                    guardarLocalOriginal.call(localStorage,"corssen_conflicto_"+Date.now(),JSON.stringify([...cambiosCompartidos]));
                    for(const key of conflictosCompartidos) {cambiosCompartidos.delete(key);versionesCompartidas.delete(key);}
                    conflictosCompartidos.clear();guardarColaCompartida();sincronizarEstadoCompartido();
                };
                indicador.appendChild(revisar);
            }
        }
    } catch(error) {
        console.error("Sincronización pendiente",error);
        const indicador=document.querySelector(".estado-sistema");
        if(indicador) {
            indicador.textContent="Respaldo Nube ServiTec Pro";
            indicador.title="Sin conexión: cambios pendientes en este dispositivo";
        }
    } finally {sincronizacionOcupada=false;}
}


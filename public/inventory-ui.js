function textoSeguroInventario(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function imagenAutomaticaInsumo(item) {
    const nombre = String(item.detalle || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const texto = `${nombre} ${item.categoria || ''} ${item.modelo || ''}`.toLowerCase();
    let tipo = 'repuesto';
    if (/filtro|filter/.test(nombre)) tipo = 'filtro';
    else if (/rodamiento|cojinete|bearing/.test(texto)) tipo = 'rodamiento';
    else if (/silicona|sellador|loctite|adhesivo/.test(texto)) tipo = 'sellador';
    else if (/llave|herramienta|alicate|destornillador|martillo/.test(texto)) tipo = 'herramienta';
    else if (/perno|tornillo|tuerca|arandela/.test(texto)) tipo = 'perno';
    else if (/filtro|filter/.test(texto)) tipo = 'filtro';
    else if (/aceite|lubricante|grasa|refrigerante|coolant|15w|10w|80w/.test(texto)) tipo = 'lubricante';
    return `/assets/inventario/${tipo}.png`;
}
function filtrarReposicionInventario() {
    cambiarPestanaInventario('EXISTENCIAS');
    document.getElementById('filtroEstadoStock').value = 'CRITICO';
    renderizarStockInsumos();
}
function cerrarDialogInventario() { document.getElementById('dialogInventario').close(); }
function verDetalleInventario(idx) {
    const item = corssenStock[idx];
    if (!item) return;
    const esc = textoSeguroInventario;
    document.getElementById('contenidoDialogInventario').innerHTML = `<button class="inventario-cerrar" aria-label="Cerrar" onclick="cerrarDialogInventario()">×</button><img class="inventario-imagen-detalle" src="${imagenAutomaticaInsumo(item)}" alt="Ilustración de categoría"><p class="inventario-eyebrow">DETALLE DEL ARTÍCULO</p><h2>${esc(item.detalle)}</h2><p>${esc(item.marca)} · ${esc(item.modelo)}</p><dl><dt>Disponible en bodega</dt><dd>${Number(item.stock || 0)} ${esc(item.medida)}</dd><dt>Stock mínimo</dt><dd>${Number(item.stockMin ?? 1)}</dd><dt>Compatibilidad</dt><dd>${esc(item.compatible || 'Sin especificar')}</dd><dt>Proveedor</dt><dd>${esc(item.proveedor || 'Sin especificar')}</dd></dl><button class="btn-primario" onclick="abrirAjusteInventario(${idx})">Ajustar stock</button><p class="inventario-ayuda">Imagen representativa asignada automáticamente según el artículo.</p>`;
    document.getElementById('dialogInventario').showModal();
}
function abrirAjusteInventario(idx) {
    const item = corssenStock[idx];
    if (!item) return;
    const dialog = document.getElementById('dialogInventario');
    // Keep the original quantity and identity to detect edits received while the dialog is open.
    dialog.dataset.indice = String(idx);
    dialog.dataset.stock = String(Number(item.stock || 0));
    dialog.dataset.identidad = JSON.stringify([item.detalle, item.marca, item.modelo]);
    document.getElementById('contenidoDialogInventario').innerHTML = `<button type="button" class="inventario-cerrar" aria-label="Cerrar" onclick="cerrarDialogInventario()">×</button><p class="inventario-eyebrow">CONTROL DE EXISTENCIAS</p><h2>Ajustar stock en bodega</h2><p>${textoSeguroInventario(item.detalle)} · ${textoSeguroInventario(item.modelo)}</p><form onsubmit="guardarAjusteInventario(event)"><p>Stock actual: <strong>${Number(item.stock || 0)} ${textoSeguroInventario(item.medida)}</strong></p><label>Nueva cantidad disponible<input id="cantidadAjusteInventario" type="number" min="0" step="1" required value="${Number(item.stock || 0)}" oninput="actualizarDiferenciaInventario()"></label><p id="diferenciaAjusteInventario" aria-live="polite">Sin cambio de cantidad</p><label>Motivo del ajuste<select id="motivoAjusteInventario" required><option value="">Selecciona un motivo</option><option>Conteo físico de bodega</option><option>Corrección de registro</option><option>Merma o daño</option><option>Devolución a bodega</option></select></label><label>Nota o referencia (opcional)<textarea id="notaAjusteInventario" maxlength="500" rows="3"></textarea></label><div class="inventario-dialog-acciones"><button type="button" class="btn-secundario" onclick="cerrarDialogInventario()">Cancelar</button><button type="submit" class="btn-primario">Guardar ajuste</button></div></form>`;
    if (!dialog.open) dialog.showModal();
}
function actualizarDiferenciaInventario() {
    const antes = Number(document.getElementById('dialogInventario').dataset.stock);
    const despues = Number(document.getElementById('cantidadAjusteInventario').value);
    const delta = despues - antes;
    document.getElementById('diferenciaAjusteInventario').textContent = delta === 0 ? 'Sin cambio de cantidad' : `Diferencia: ${delta > 0 ? '+' : ''}${delta} unidades`;
}
function guardarAjusteInventario(event) {
    event.preventDefault();
    const dialog = document.getElementById('dialogInventario');
    const item = corssenStock[Number(dialog.dataset.indice)];
    const stockAnterior = Number(dialog.dataset.stock);
    const entrada = document.getElementById('cantidadAjusteInventario').value.trim();
    const stockNuevo = Number(entrada);
    const motivo = document.getElementById('motivoAjusteInventario').value;
    const motivos = ['Conteo físico de bodega','Corrección de registro','Merma o daño','Devolución a bodega'];
    if (!entrada || !Number.isSafeInteger(stockNuevo) || stockNuevo < 0 || !motivos.includes(motivo)) return alert('Indica una cantidad entera válida y un motivo.');
    if (!item || JSON.stringify([item.detalle,item.marca,item.modelo]) !== dialog.dataset.identidad || Number(item.stock || 0) !== stockAnterior) return alert('El artículo cambió mientras editabas. Cierra y abre el ajuste para revisar el stock actualizado.');
    const delta = stockNuevo - stockAnterior;
    if (!delta) return alert('La cantidad coincide con el stock actual.');
    const responsable = sessionStorage.getItem('nombreUsuario') || sessionStorage.getItem('usuarioLogueado');
    if (!responsable) return alert('Inicia sesión nuevamente para registrar al responsable.');
    const ahora = new Date().toISOString();
    item.stock = stockNuevo;
    inventario.unshift({id:`AJ-${Date.now()}`,tipo:'AJUSTE',fecha:ahora.slice(0,10),fechaHora:ahora,folioOT:'Ajuste de bodega',codigoEquipo:'BODEGA',insumoDetalle:`${item.detalle} (${item.modelo})`,cantidad:Math.abs(delta),delta,stockAnterior,stockRestante:stockNuevo,motivo,nota:document.getElementById('notaAjusteInventario').value.trim().slice(0,500),responsable,usuario:sessionStorage.getItem('usuarioLogueado'),medida:item.medida,costoUnitario:item.costo || 0,costoTotal:Math.abs(delta)*(item.costo || 0)});
    guardarTodo();
    renderizarStockInsumos();
    renderizarKardexMovimientos();
    poblarSelectorIngresoStock();
    renderizarDashboard();
    cerrarDialogInventario();
}

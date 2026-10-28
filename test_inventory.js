import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const source=fs.readFileSync('inventory-ui.js','utf8');
function setup(){
 const els={dialogInventario:{dataset:{indice:'0',stock:'5',identidad:JSON.stringify(['Filtro','Marca','W1'])},close(){}},cantidadAjusteInventario:{value:'8'},motivoAjusteInventario:{value:'Conteo físico de bodega'},notaAjusteInventario:{value:'Conteo verificado'}};
 const alerts=[];let saves=0;
 const ctx={document:{getElementById:id=>els[id]},sessionStorage:{getItem:()=> 'Usuario prueba'},alert:x=>alerts.push(x),corssenStock:[{detalle:'Filtro',marca:'Marca',modelo:'W1',stock:5,costo:100}],inventario:[],guardarTodo:()=>saves++,renderizarStockInsumos(){},renderizarKardexMovimientos(){},poblarSelectorIngresoStock(){},renderizarDashboard(){}};
 vm.createContext(ctx);vm.runInContext(source,ctx);return {ctx,els,alerts,saves:()=>saves,run:()=>ctx.guardarAjusteInventario({preventDefault(){}})};
}
test('automatic images classify existing and new articles with a local fallback',()=>{
 const {ctx}=setup();for(const [detalle,categoria,icon] of [['Filtro de aceite','ACEITE','filtro'],['Rodamiento','REPUESTO','rodamiento'],['Silicona Loctite','GENERAL','sellador'],['Aceite 15W40','ACEITE','lubricante'],['Llave de impacto','GENERAL','herramienta'],['Perno M8','REPUESTO','perno'],['Artículo nuevo desconocido','GENERAL','repuesto']]){const uri=ctx.imagenAutomaticaInsumo({detalle,categoria});assert.equal(uri,`/assets/inventario/${icon}.png`);assert.ok(fs.existsSync(`public${uri}`));}
});
test('stock adjustment records exact before/after, delta, reason and responsible together',()=>{
 const f=setup();f.run();assert.equal(f.ctx.corssenStock[0].stock,8);assert.equal(f.saves(),1);const m=f.ctx.inventario[0];assert.equal(m.tipo,'AJUSTE');assert.equal(m.stockAnterior,5);assert.equal(m.stockRestante,8);assert.equal(m.delta,3);assert.equal(m.costoTotal,300);assert.equal(m.responsable,'Usuario prueba');assert.equal(m.motivo,'Conteo físico de bodega');assert.ok(m.fechaHora);
});
test('zero stock accepted; negative, decimal, missing reason and stale edit do not mutate',()=>{
 const zero=setup();zero.els.cantidadAjusteInventario.value='0';zero.run();assert.equal(zero.ctx.corssenStock[0].stock,0);assert.equal(zero.ctx.inventario[0].delta,-5);
 for(const value of ['-1','1.5','','5','Infinity']){const f=setup();f.els.cantidadAjusteInventario.value=value;f.run();assert.equal(f.saves(),0);assert.equal(f.ctx.inventario.length,0);}
 const reason=setup();reason.els.motivoAjusteInventario.value='';reason.run();assert.equal(reason.saves(),0);
 const stale=setup();stale.ctx.corssenStock[0].stock=7;stale.run();assert.equal(stale.ctx.corssenStock[0].stock,7);assert.equal(stale.saves(),0);
});
test('ledger export separates adjustment from purchase/OT totals and includes audit columns',()=>{
 const source=fs.readFileSync('functions-operations.js','utf8');const start=source.indexOf('function exportarKardexExcel()');const end=source.indexOf('function exportarFichaEquipoExcel()',start);let sheets;
 const ctx={sessionStorage:{getItem:()=> 'Prueba'},inventario:[{tipo:'AJUSTE',cantidad:3,delta:3,stockAnterior:5,stockRestante:8,motivo:'Conteo físico',nota:'Verificado',costoTotal:300},{tipo:'INGRESO',cantidad:-2,costoTotal:200},{tipo:'CONSUMO',cantidad:1,costoTotal:100}],descargarLibroExcel:(name,data)=>sheets=data};vm.createContext(ctx);vm.runInContext(source.slice(start,end),ctx);ctx.exportarKardexExcel();const rows=sheets[0].datos;assert.equal(rows[4][1],'AJUSTE DE STOCK');assert.equal(rows[4][5],3);assert.equal(rows[4][11],5);assert.equal(rows[4][12],'Conteo físico');assert.equal(rows.at(-2)[9],200);assert.equal(rows.at(-1)[9],100);
});

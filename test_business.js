import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import ts from 'typescript';
const source=ts.createSourceFile('script.js',['functions-core.js','functions-operations.js','script.js'].map(p=>fs.readFileSync(p,'utf8')).join('\n'),ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
function fixture(name,values={},rows=[]){
 const fn=source.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name.text===name);
 const alerts=[],elements=new Map();
 const context={crypto,console,Date,Math,Number,parseFloat,parseInt,isNaN,String,alert:m=>alerts.push(m),confirm:()=>true,localStorage:{setItem(){}},sessionStorage:{getItem:()=> 'Prueba'},document:{querySelectorAll:()=>rows,getElementById:id=>{if(!elements.has(id))elements.set(id,{value:values[id]||'',reset(){},style:{},classList:{add(){},remove(){}}});return elements.get(id)}},corssenStock:[{detalle:'Filtro',modelo:'T',stock:10,costo:100}],inventario:[],mantenciones:[],vehiculos:[],maquinarias:[],corssenPrograma:[{cod:'EQ',equipo:'Equipo',marca:'Test'}],corssenFichas:{},cargas:[],historialConsumoAceite:[],historialRecargasCombustible:[],estadoTamboresAceite:{tambor1:{actual:100,capacidad:200,costoPorLitro:2},tambor2:{actual:100,capacidad:200,costoPorLitro:3}},estadoTanqueCombustible:{actual:100,capacidad:400}};
 context.estadoTamborAceite=context.estadoTamboresAceite.tambor1;context.window=context;
 function visit(node){if(ts.isCallExpression(node)&&ts.isIdentifier(node.expression)&&!(node.expression.text in context))context[node.expression.text]=()=>{};ts.forEachChild(node,visit)}visit(fn);
 vm.createContext(context);vm.runInContext(fn.getText(source),context);return {context,alerts,run:()=>context[name]({preventDefault(){}})};
}
const row=count=>({querySelector:selector=>({value:selector==='.select-insumo-stock'?'0':String(count)})});
test('fuel dispatch deducts exact liters; external fueling leaves tank unchanged',()=>{
 for(const external of [false,true]){const {context,run}=fixture('registrarCargaCombustible',{patenteCarga:'EQ',fechaCarga:'2026-10-28',litros:'20',precioLitro:'1000',selectOrigenCombustible:external?'EXTERNO':'ESTANQUE_400L'});run();assert.equal(context.cargas.length,1);assert.equal(context.cargas[0].total,20000);assert.equal(context.estadoTanqueCombustible.actual,external?100:80);}
});
test('fuel rejects shortage and overcapacity refills without mutating balances',()=>{
 const shortage=fixture('registrarCargaCombustible',{patenteCarga:'EQ',fechaCarga:'2026-10-28',litros:'101'});shortage.run();assert.equal(shortage.context.cargas.length,0);assert.equal(shortage.context.estadoTanqueCombustible.actual,100);
 const overflow=fixture('guardarRecargaTanqueCombustible',{inputLitrosRecargaTanque:'301',inputCostoTotalRecargaTanque:'100'});overflow.run();assert.equal(overflow.context.estadoTanqueCombustible.actual,100);assert.equal(overflow.context.historialRecargasCombustible.length,0);
});
test('OT rejects aggregated stock shortage and oil shortage before any deduction',()=>{
 const base={selectMantEquipo:'EQ',inputMantFecha:'2026-10-28'};
 const stock=fixture('registrarNuevaMantencion',base,[row(6),row(6)]);stock.run();assert.equal(stock.context.corssenStock[0].stock,10);assert.equal(stock.context.mantenciones.length,0);
 const oil=fixture('registrarNuevaMantencion',{...base,inputLitrosAceiteDescontar:'101'},[row(2)]);oil.run();assert.equal(oil.context.corssenStock[0].stock,10);assert.equal(oil.context.estadoTamborAceite.actual,100);assert.equal(oil.context.inventario.length,0);
});
test('valid OT deducts stock and both oils and records matching costs and ledger',()=>{
 const {context,run}=fixture('registrarNuevaMantencion',{selectMantEquipo:'EQ',inputMantFecha:'2026-10-28',inputLitrosAceiteDescontar:'5',inputLitrosAceiteHidraulicoDescontar:'3',inputMantCostoManoObra:'100'},[row(2)]);
 run();assert.equal(context.corssenStock[0].stock,8);assert.equal(context.estadoTamboresAceite.tambor1.actual,95);assert.equal(context.estadoTamboresAceite.tambor2.actual,97);assert.equal(context.mantenciones.length,1);assert.equal(context.mantenciones[0].costoTotal,319);assert.equal(context.historialConsumoAceite.length,2);
});

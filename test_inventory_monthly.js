import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {inventoryMonth,previousInventoryMonth,inventoryMonthTotals,captureInventoryMonth,inventoryMonthHistory,inventoryMonthStatement} from './inventory-monthly.js';
function fixture(){
 const sql=new DatabaseSync(':memory:');sql.exec('CREATE TABLE app_state(key TEXT PRIMARY KEY,value TEXT,version INTEGER DEFAULT 1)');
 const db={prepare(q){const s=sql.prepare(q);let args=[];return {bind(...a){args=a;return this},async run(){s.run(...args)},async first(){return s.get(...args)||null},async all(){return {results:s.all(...args)}}}},async batch(stmts){sql.exec('BEGIN');try{for(const st of stmts)await st.run();sql.exec('COMMIT')}catch(e){sql.exec('ROLLBACK');throw e}}};
 function put(key,value){sql.prepare('INSERT INTO app_state(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(key,JSON.stringify(value));}
 return {sql,db,put};
}
test('monthly periods follow Chile timezone across UTC midnight and year changes',()=>{
 assert.equal(inventoryMonth(new Date('2026-11-01T01:00:00Z')),'2026-10');assert.equal(inventoryMonth(new Date('2026-11-01T04:00:00Z')),'2026-11');assert.equal(previousInventoryMonth('2027-01'),'2026-12');
});
test('monthly totals exclude other months, preserve zero costs, and separate signed adjustments',()=>{
 const totals=inventoryMonthTotals([{fecha:'2026-09-30',tipo:'INGRESO',cantidad:-10,costoTotal:1000},{fecha:'2026-10-01',tipo:'INGRESO',cantidad:-2,costoTotal:200},{fecha:'2026-10-02',cantidad:1,costoTotal:50},{fecha:'2026-10-03',tipo:'AJUSTE',delta:-2,cantidad:2,costoUnitario:10},{fecha:'2026-10-04',cantidad:3,costoTotal:0,costoUnitario:50},{fechaHora:'2026-11-01T01:00:00Z',tipo:'INGRESO',cantidad:-1,costoTotal:25}],'2026-10');
 assert.deepEqual(totals,{income:225,consumption:50,adjustments:-20});
});
test('month boundary preserves previous close and opening despite later stock/cost changes',async()=>{
 const f=fixture();f.put('corssen_stock_v2',[{stock:10,costo:100}]);f.put('flota_inventario_v3',[]);
 await captureInventoryMonth(f.db,new Date('2026-09-30T18:00:00Z'));
 let data=await inventoryMonthHistory(f.db,new Date('2026-09-30T19:00:00Z'));assert.equal(data.months[0].opening,null);assert.equal(data.months[0].value,1000);assert.equal(data.months[0].partial,true);
 const oct=new Date('2026-10-01T04:00:00Z');await captureInventoryMonth(f.db,oct);
 f.put('corssen_stock_v2',[{stock:12,costo:100}]);f.put('flota_inventario_v3',[{fecha:'2026-10-01',tipo:'INGRESO',cantidad:-2,costoTotal:200}]);
 data=await inventoryMonthHistory(f.db,oct);assert.equal(data.months[0].opening,1000);assert.equal(data.months[0].value,1200);assert.equal(data.months[0].income,200);assert.equal(data.months[0].variation,200);assert.equal(data.months[0].valuationDifference,0);assert.equal(data.months[1].value,1000);assert.equal(data.months[1].status,'closed');
 f.put('corssen_stock_v2',[{stock:12,costo:110}]);data=await inventoryMonthHistory(f.db,oct);assert.equal(data.months[0].valuationDifference,120);assert.equal(data.months[1].value,1000);
 await captureInventoryMonth(f.db,new Date('2026-09-30T20:00:00Z'));assert.equal(JSON.parse(f.sql.prepare("SELECT stock_json FROM inventory_months WHERE month='2026-09'").get().stock_json)[0].stock,10);
});
test('snapshots rollback with failed operational batches and do not invent missing months',async()=>{
 const f=fixture();f.put('corssen_stock_v2',[{stock:2,costo:50}]);await captureInventoryMonth(f.db,new Date('2026-08-15T12:00:00Z'));
 await assert.rejects(f.db.batch([inventoryMonthStatement(f.db,new Date('2026-09-01T12:00:00Z')),f.db.prepare("INSERT INTO app_state(key,value) VALUES('corssen_stock_v2','[]')")]));
 assert.equal(f.sql.prepare("SELECT count(*) AS n FROM inventory_months WHERE month='2026-09'").get().n,0);
 const data=await inventoryMonthHistory(f.db,new Date('2026-10-15T12:00:00Z'));assert.deepEqual(data.months.map(m=>m.month),['2026-10','2026-08']);assert.equal(data.months[0].opening,null);
});

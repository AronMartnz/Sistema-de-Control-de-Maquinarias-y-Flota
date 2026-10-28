// Monthly inventory snapshots use the same D1 transaction as operational changes.
export function inventoryMonth(date = new Date()) {
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Santiago',year:'numeric',month:'2-digit'}).formatToParts(date);
 return `${parts.find(p=>p.type==='year').value}-${parts.find(p=>p.type==='month').value}`;
}
export function previousInventoryMonth(month){const [y,m]=month.split('-').map(Number);return m===1?`${y-1}-12`:`${y}-${String(m-1).padStart(2,'0')}`;}
export async function ensureInventoryMonths(db){
 await db.prepare(`CREATE TABLE IF NOT EXISTS inventory_months (
 month TEXT PRIMARY KEY, stock_json TEXT NOT NULL, ledger_json TEXT NOT NULL,
 opening_stock_json TEXT, first_observed_at TEXT NOT NULL, observed_at TEXT NOT NULL
 )`).run();
}
export function inventoryMonthStatement(db,date=new Date(),insertOnly=false){
 const month=inventoryMonth(date),previous=previousInventoryMonth(month),now=date.toISOString();
 return db.prepare(`INSERT INTO inventory_months(month,stock_json,ledger_json,opening_stock_json,first_observed_at,observed_at)
 SELECT ?,s.value,COALESCE((SELECT value FROM app_state WHERE key='flota_inventario_v3'),'[]'),
 (SELECT stock_json FROM inventory_months WHERE month=?),?,?
 FROM app_state s WHERE s.key='corssen_stock_v2' AND NOT EXISTS(SELECT 1 FROM inventory_months WHERE month>?)
 ON CONFLICT(month) ${insertOnly?'DO NOTHING':'DO UPDATE SET stock_json=excluded.stock_json,ledger_json=excluded.ledger_json,observed_at=excluded.observed_at'}`)
 .bind(month,previous,now,now,month);
}
export async function captureInventoryMonth(db,date=new Date()){
 if(!db)return;
 if(!await db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='app_state'").first())return;
 await ensureInventoryMonths(db);await db.batch([inventoryMonthStatement(db,date)]);
}
export function inventoryValue(stock){return stock.reduce((total,item)=>total+Number(item.stock||0)*Number(item.costo||0),0);}
export function inventoryMonthTotals(ledger,month){
 let income=0,consumption=0,adjustments=0;
 for(const mov of ledger){
  let period=String(mov.fecha||'').slice(0,7);
  if(mov.fechaHora){const date=new Date(mov.fechaHora);if(!Number.isNaN(date.getTime()))period=inventoryMonth(date);}
  if(period!==month)continue;
  const qty=Math.abs(Number(mov.cantidad??1));const value=Number(mov.costoTotal??(Number(mov.costoUnitario||0)*qty));
  if(mov.tipo==='AJUSTE')adjustments+=Number(mov.delta||0)*Number(mov.costoUnitario||0);
  else if(mov.tipo==='INGRESO'||Number(mov.cantidad)<0)income+=value;
  else consumption+=value;
 }
 return {income,consumption,adjustments};
}
export async function inventoryMonthHistory(db,date=new Date()){
 await captureInventoryMonth(db,date);
 await ensureInventoryMonths(db);
 const {results}=await db.prepare('SELECT * FROM inventory_months ORDER BY month DESC LIMIT 120').all();
 const currentMonth=inventoryMonth(date);
 return {currentMonth,timeZone:'America/Santiago',months:results.map(row=>{
  const value=inventoryValue(JSON.parse(row.stock_json));const opening=row.opening_stock_json===null?null:inventoryValue(JSON.parse(row.opening_stock_json));
  const totals=inventoryMonthTotals(JSON.parse(row.ledger_json),row.month);
  return {month:row.month,value,opening,...totals,variation:opening===null?null:value-opening,
   valuationDifference:opening===null?null:value-opening-totals.income+totals.consumption-totals.adjustments,
   firstObservedAt:row.first_observed_at,observedAt:row.observed_at,status:row.month===currentMonth?'current':'closed',partial:opening===null};
 })};
}

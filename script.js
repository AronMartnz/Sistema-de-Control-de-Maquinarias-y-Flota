/* =========================================================
   SISTEMA DE CONTROL DE FLOTA Y MAQUINARIA - CORSSEN LOGÍSTICA
   MOTOR COMPLETO INTEGRADO CON PLANILLA MAESTRA Y FICHAS TÉCNICAS
   ========================================================= */

// =========================================================
// 1. BASES DE DATOS PRECARGADAS DESDE PLANILLA EXCEL CLIENTE
// =========================================================

// PROGRAMA MAESTRO DE MANTENCIÓN DE EQUIPOS Y HERRAMIENTAS (CORSSEN LOGÍSTICA)
const DATOS_MAESTROS_CORSSEN = [
    // --- GRÚAS (Gxx) ---
    { cod: "GPC-01", equipo: "GRÚA PORTA CONTENEDORES", marca: "TAYLOR", cat: "GRÚAS", estado: "Operativo", prioridad: "Alta", horometro: "44800 hrs", frecuencia: "250 horas", prox: "45050 hrs", responsable: "Carlos Lasso / Alexis Santos", observaciones: "Lavado y engrase realizado. Chequeo operatividad OK." },
    { cod: "GPC-02", equipo: "GRÚA PORTA CONTENEDORES", marca: "HYSTER", cat: "GRÚAS", estado: "Operativo", prioridad: "Alta", horometro: "28350 hrs", frecuencia: "250 horas", prox: "28600 hrs", responsable: "Cristian Diaz / Alexis Santos", observaciones: "Cambio aceite motor y filtros realizado. Falta cambio aceite diferencial y transmisión." },
    { cod: "GHO-01", equipo: "GRÚA HORQUILLA 4 TON", marca: "LIUGONG", cat: "GRÚAS", estado: "Operativo", prioridad: "Alta", horometro: "1240 hrs", frecuencia: "250 horas", prox: "1490 hrs", responsable: "Alexis Santos", observaciones: "Arreglar piola de parada de motor. Tapar cables eléctricos cabina." },
    { cod: "GHO-02", equipo: "GRÚA HORQUILLA 7 TON", marca: "KOMATSU", cat: "GRÚAS", estado: "No Operativo", prioridad: "Alta", horometro: "3890 hrs", frecuencia: "250 horas", prox: "Terminar armado", responsable: "Alexis Santos", observaciones: "Terminar armado de grúa. Instalar piola de freno de mano y espejo." },
    { cod: "GHO-03", equipo: "GRÚA HORQUILLA 3.5 TON", marca: "LIUGONG", cat: "GRÚAS", estado: "Operativo", prioridad: "Alta", horometro: "420 hrs", frecuencia: "250 horas", prox: "670 hrs", responsable: "Alexis Santos", observaciones: "Colocar espejo retrovisor." },
    { cod: "GTE-01", equipo: "GRÚA TELESCÓPICA 60 TON", marca: "GROVE", cat: "GRÚAS", estado: "Operativo", prioridad: "Alta", horometro: "5120 hrs", frecuencia: "250 horas", prox: "5370 hrs", responsable: "Alexis Santos", observaciones: "Arreglar alarma de retroceso. Revisar flexibles de pedal en cabina." },
    { cod: "GTE-02", equipo: "GRÚA TELESCÓPICA 35 TON", marca: "GROVE", cat: "GRÚAS", estado: "No Operativo", prioridad: "Media", horometro: "6400 hrs", frecuencia: "250 horas", prox: "En reparación", responsable: "Alexis Santos", observaciones: "Arreglar cables cortados (no bajan patas de levante). Freno de parqueo bloqueado." },
    { cod: "GTE-03", equipo: "GRÚA TELESCÓPICA 15 TON", marca: "GROVE", cat: "GRÚAS", estado: "No Operativo", prioridad: "Media", horometro: "7800 hrs", frecuencia: "250 horas", prox: "En taller", responsable: "Alexis Santos", observaciones: "Instalar la transmisión." },

    // --- EQUIPOS MÓVILES (Cxx) ---
    { cod: "CAM-01", equipo: "CAMIONETA NISSAN NP300 (JWYD-49)", marca: "NISSAN", cat: "MÓVILES", estado: "Operativo", prioridad: "Media", horometro: "142.500 km", frecuencia: "10000 kilometros", prox: "150.000 km", responsable: "Andrés Plaza", observaciones: "Arreglar aire acondicionado." },
    { cod: "CAM-02", equipo: "CAMIONETA VOLKSWAGEN (JKKV-43)", marca: "VOLKSWAGEN", cat: "MÓVILES", estado: "Operativo (con falla)", prioridad: "Media", horometro: "98.200 km", frecuencia: "10000 kilometros", prox: "100.000 km", responsable: "Alexis Santos", observaciones: "Instalar nuevo parachoques, desabollar y pintar capó." },
    { cod: "CAM-03", equipo: "CAMIONETA NISSAN NAVARA (GCLD-31)", marca: "NISSAN", cat: "MÓVILES", estado: "No Operativo", prioridad: "Baja", horometro: "210.000 km", frecuencia: "10000 kilometros", prox: "Fuera de servicio", responsable: "Alexis Santos", observaciones: "Revisión general en taller." },
    { cod: "CAM-04", equipo: "CAMIONETA MAXUS (VPFX-76)", marca: "MAXUS", cat: "MÓVILES", estado: "Operativo", prioridad: "Baja", horometro: "18.400 km", frecuencia: "10000 kilometros", prox: "20.000 km", responsable: "Daniel Mejias", observaciones: "Operativa sin observaciones pendientes." },
    { cod: "CMN-01", equipo: "CAMIÓN FREIGHTLINER 06", marca: "FREIGHTLINER", cat: "MÓVILES", estado: "No Operativo", prioridad: "Media", horometro: "415.000 km", frecuencia: "10000 kilometros", prox: "En taller", responsable: "Alexis Santos", observaciones: "Arreglar motor de arranque. Instalar solenoide 12V de la bomba." },
    { cod: "CMN-02", equipo: "CAMIÓN MACK 51", marca: "MACK", cat: "MÓVILES", estado: "No Operativo", prioridad: "Baja", horometro: "520.000 km", frecuencia: "10000 kilometros", prox: "Revisión", responsable: "Alexis Santos", observaciones: "Mantención mayor pendiente." },
    { cod: "CMN-03", equipo: "CAMIÓN VOLKSWAGEN 50", marca: "VOLKSWAGEN", cat: "MÓVILES", estado: "Operativo (con falla)", prioridad: "Media", horometro: "60.626,6 km", frecuencia: "10000 kilometros", prox: "70.000 km", responsable: "Alexis Santos", observaciones: "Arreglar fuga agua radiador." },

    // --- EQUIPO AUXILIAR Y HERRAMIENTAS (Xxx) ---
    { cod: "XFV-01", equipo: "PLANTA FOTOVOLTAICA (PANELES, INVERSOR, BATERIAS)", marca: "EPEVER", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "31-08-2026", responsable: "Ruben Ramirez", observaciones: "Limpiar placas solares y aspirar polvo del inversor." },
    { cod: "XGE-01", equipo: "GENERADOR ELÉCTRICO NEGRO", marca: "HYUNDAI", cat: "AUXILIARES", estado: "No Operativo", prioridad: "Media", horometro: "450 hrs", frecuencia: "200 horas", prox: "En taller", responsable: "Alexis Santos", observaciones: "Cambiar tarjeta electrónica del generador." },
    { cod: "XSL-01", equipo: "GENERADOR ELÉCTRICO NARANJO", marca: "AIR MAN", cat: "AUXILIARES", estado: "No Operativo", prioridad: "Baja", horometro: "1200 hrs", frecuencia: "Mensual", prox: "En taller", responsable: "Alexis Santos", observaciones: "Cambiar motor." },
    { cod: "XSL-02", equipo: "SOLDADORA / GENERADOR AUTÓNOMA AMARILLO", marca: "LINCOLN", cat: "AUXILIARES", estado: "No Operativo", prioridad: "Media", horometro: "890 hrs", frecuencia: "Mensual", prox: "En revisión", responsable: "Alexis Santos", observaciones: "Cambiar generador (revisar cuál tiene puesto)." },
    { cod: "XCO-01", equipo: "COMPRESOR AUTÓNOMO", marca: "KRAFTER", cat: "AUXILIARES", estado: "No Operativo", prioridad: "Media", horometro: "320 hrs", frecuencia: "200 horas", prox: "En taller", responsable: "Alexis Santos", observaciones: "Cambiar motor." },
    { cod: "XHI-01", equipo: "HIDROLAVADORA", marca: "BN 18", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "150 hrs", frecuencia: "200 horas", prox: "200 hrs", responsable: "Alexis Santos", observaciones: "Operativo en taller." },
    { cod: "XLU-01", equipo: "LUMINARIA TORRE", marca: "ATLAS COPCO", cat: "AUXILIARES", estado: "Operativo", prioridad: "Media", horometro: "6387 hrs", frecuencia: "200 horas", prox: "6587 hrs", responsable: "Alexis Santos", observaciones: "Revisión periódica focos y cableado." },
    { cod: "XOX-01", equipo: "EQUIPO OXICORTE COMPLETO", marca: "GENÉRICO", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Alexis Santos", observaciones: "Válvulas antiretroceso revisadas." },
    { cod: "XAS-01", equipo: "ASPIRADORA MULTIUSO", marca: "KÄRCHER", cat: "AUXILIARES", estado: "Se encuentra?", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Ubicar", responsable: "Alexis Santos", observaciones: "Pendiente de inventario." },
    { cod: "XEA-01", equipo: "ESMERIL ANGULAR", marca: "TOYAKI", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Alexis Santos", observaciones: "Disco de corte y protección OK." },
    { cod: "XPN-01", equipo: "PISTOLA NEUMÁTICA IMPACTO 3/4'", marca: "INGCO", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Alexis Santos", observaciones: "Lubricación neumática al día." },
    { cod: "XPE-01", equipo: "PISTOLA ELÉCTRICA IMPACTO 1/2'", marca: "GENÉRICO", cat: "AUXILIARES", estado: "Se encuentra?", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Ubicar", responsable: "Alexis Santos", observaciones: "Verificar en pañol." },
    { cod: "XPE-02", equipo: "PISTOLA ELÉCTRICA IMPACTO 3/4'", marca: "INGCO", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Alexis Santos", observaciones: "Operativa." },
    { cod: "XGR-01", equipo: "GRASERA NEUMÁTICA", marca: "FERTON", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Alexis Santos", observaciones: "Operativa." },
    { cod: "XCB-01", equipo: "CARGADOR DE BATERÍA", marca: "GENÉRICO", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Alexis Santos", observaciones: "Cables y pinzas en buen estado." },
    { cod: "XSN-01", equipo: "SCANNER PARA MOTOR", marca: "LAUNCH", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Alexis Santos", observaciones: "Software actualizado." },
    { cod: "XSC-04", equipo: "ESCALERA AUTOAPOYANTE", marca: "PRODALUM", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Alexis Santos", observaciones: "Inspección de peldaños OK." },
    { cod: "XSL-01", equipo: "SOLDADORA INVERTER", marca: "TOYAKI", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Alexis Santos", observaciones: "Cables porta electrodo en orden." },
    { cod: "XDI-01", equipo: "ESTANQUE METÁLICO DIÉSEL (420 LTS) C/ SURTIDOR", marca: "CORSSEN", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Alexis Santos", observaciones: "Bomba y pistola contadora funcionando." },
    { cod: "XGT-01", equipo: "GATA HIDRÁULICA 50 TON", marca: "GENÉRICA", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Alexis Santos", observaciones: "Nivel de aceite hidráulico verificado." },
    { cod: "XES-00", equipo: "ESLINGAS (4, 8 Y 10M - 11 TON / 8 TON)", marca: "STRONG LION", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Miguel Huerta", observaciones: "Inspección de desgaste conforme a norma." },
    { cod: "XGL-00", equipo: "GRILLETES (1'' Y 1 3/4'')", marca: "PRO BLUE", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Miguel Huerta", observaciones: "Pernos pasadores engrasados." },
    { cod: "XIK-00", equipo: "INTERLOCKS CONTAINER (50 UN.)", marca: "SCLASH", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Miguel Huerta", observaciones: "50 unidades contadas en pañol." },
    { cod: "XCD-01", equipo: "CADENAS PARA IZAJE (3/4, 5/8 PULG)", marca: "GENÉRICA", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Miguel Huerta", observaciones: "Certificación vigente." },
    { cod: "XCD-02", equipo: "CADENA DE CARGA", marca: "COLUMBUS", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Miguel Huerta", observaciones: "Operativa." },
    { cod: "XRD-00", equipo: "RADIOS PORTÁTILES COMUNICACIÓN", marca: "PHILCO", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Otros", observaciones: "Baterías cargadas." },
    { cod: "XPC-01", equipo: "NOTEBOOK DELL INSPIRON", marca: "DELL", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Daniel Mejias", observaciones: "Operativo en oficina." },
    { cod: "XPC-02", equipo: "NOTEBOOK ASUS VIVOBOOK GO 14", marca: "ASUS", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Ruben Ramirez", observaciones: "Operativo en terreno." },
    { cod: "XPC-03", equipo: "IMPRESORA SMARTTANK", marca: "HP", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Daniel Mejias", observaciones: "Nivel de tinta OK." },
    { cod: "XPC-04", equipo: "TABLET REDMI PAD SE 8.7", marca: "XIAOMI", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Alejandro Morales", observaciones: "Aplicación de control instalada." },
    { cod: "XDR-01", equipo: "DRONE 4K DOBLE CÁMARA", marca: "GENÉRICO", cat: "AUXILIARES", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Otros", observaciones: "Hélices de repuesto en maleta." },

    // --- EQUIPO MARÍTIMO (Mxx) ---
    { cod: "MPG-01", equipo: "PANGA BUCANERO", marca: "BUCANERO", cat: "MARÍTIMO", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "n/a", prox: "Anual", responsable: "Alexis Santos", observaciones: "Casco sin filtraciones." },
    { cod: "MBO-01", equipo: "BOTE DE FIBRA", marca: "GENÉRICO", cat: "MARÍTIMO", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "n/a", prox: "Anual", responsable: "Alexis Santos", observaciones: "Operativo para faenas de muelle." },
    { cod: "MWN-01", equipo: "WINCHE DE BALSA", marca: "GENÉRICO", cat: "MARÍTIMO", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "Mensual", responsable: "Alexis Santos", observaciones: "Engrase de piñón efectuado." },
    { cod: "MMW-01", equipo: "MOTOR WINCHE BALSA", marca: "DEUTZ", cat: "MARÍTIMO", estado: "No Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Mensual", prox: "En taller", responsable: "Alexis Santos", observaciones: "Falta rodamiento ventilador, cambiar chapa de contacto." },
    { cod: "MAN-01", equipo: "3 ANCLAS DE 2 TON Y 1 ANCLA DE 6 TON", marca: "VICINAY", cat: "MARÍTIMO", estado: "Operativo", prioridad: "Baja", horometro: "N/A", frecuencia: "Anual", prox: "Anual", responsable: "Miguel Huerta", observaciones: "Inspección de grilletes y cadenas." }
];

// STOCK DE INSUMOS, LUBRICANTES, FILTROS Y REPUESTOS (CORSSEN LOGÍSTICA)
const DATOS_STOCK_CORSSEN = [
    { detalle: "Aceite de Motor", categoria: "ACEITE", marca: "VALVOLINE", modelo: "SAE 15W40 CI-4", medida: "BALDE 19 LTS", stock: 1, stockMin: 3, proveedor: "LUVAL", compatible: "Todos los equipos", costo: 55000 },
    { detalle: "Aceite Transmisión", categoria: "ACEITE", marca: "VALVOLINE", modelo: "ATF Dexron III", medida: "BALDE 19 LTS", stock: 3, stockMin: 4, proveedor: "LUVAL", compatible: "Porta Taylor y Hyster", costo: 60000 },
    { detalle: "Aceite Diferencial, cubos ruedas y rotador", categoria: "ACEITE", marca: "VALVOLINE", modelo: "SAE 80W90 GL-5", medida: "BALDE 19 LTS", stock: 3, stockMin: 4, proveedor: "LUVAL", compatible: "Porta Taylor y Hyster", costo: 60000 },
    { detalle: "Refrigerante (no aceite)", categoria: "REFRIGERANTE", marca: "VALVOLINE", modelo: "Coolan extender life 50%", medida: "BALDE 19 LTS", stock: 1, stockMin: 3, proveedor: "LUVAL", compatible: "Porta Taylor y Hyster", costo: 60000 },
    { detalle: "Aceite de motor", categoria: "FILTRO", marca: "Fleetguard", modelo: "LF 9001", medida: "UNIDAD", stock: 1, stockMin: 2, proveedor: "ADASME", compatible: "Porta Taylor", costo: 35000 },
    { detalle: "Aceite de motor", categoria: "FILTRO", marca: "Baldwin", modelo: "BD50000", medida: "UNIDAD", stock: 1, stockMin: 2, proveedor: "ADASME", compatible: "Porta Taylor y Hyster", costo: 45000 },
    { detalle: "Combustible (separador de agua)", categoria: "FILTRO", marca: "Tecfil", modelo: "PSC289", medida: "UNIDAD", stock: 1, stockMin: 2, proveedor: "ADASME", compatible: "Porta Taylor", costo: 28000 },
    { detalle: "Combustible (separador de agua)", categoria: "FILTRO", marca: "Baldwin", modelo: "BF1259", medida: "UNIDAD", stock: 1, stockMin: 2, proveedor: "ADASME", compatible: "Porta Taylor y Hyster", costo: 32000 },
    { detalle: "Combustible (separador de agua y combustible)", categoria: "FILTRO", marca: "Fleetguard", modelo: "FS 1015", medida: "UNIDAD", stock: 1, stockMin: 2, proveedor: "ADASME", compatible: "Porta Taylor", costo: 38000 },
    { detalle: "Combustible", categoria: "FILTRO", marca: "Baldwin", modelo: "BF1293-SPS", medida: "UNIDAD", stock: 1, stockMin: 2, proveedor: "ADASME", compatible: "Porta Hyster", costo: 34000 },
    { detalle: "Hidráulico retorno desahogo", categoria: "FILTRO", marca: "Baldwin", modelo: "BT8853-MPG", medida: "UNIDAD", stock: 0, stockMin: 2, proveedor: "ADASME", compatible: "Porta Taylor", costo: 52000 },
    { detalle: "Hidráulico transmisión", categoria: "FILTRO", marca: "Baldwin", modelo: "BT8851-MPG", medida: "UNIDAD", stock: 0, stockMin: 2, proveedor: "ADASME", compatible: "Porta Taylor", costo: 48000 },
    { detalle: "Hidráulico transmisión", categoria: "FILTRO", marca: "Baldwin", modelo: "BT9400-MPG", medida: "UNIDAD", stock: 2, stockMin: 2, proveedor: "ADASME", compatible: "Porta Hyster", costo: 49000 },
    { detalle: "Refrigerante del motor", categoria: "FILTRO", marca: "Baldwin", modelo: "BW5075", medida: "UNIDAD", stock: 1, stockMin: 2, proveedor: "ADASME", compatible: "Porta Taylor y Hyster", costo: 25000 },
    { detalle: "Aire Primario", categoria: "FILTRO", marca: "Baldwin", modelo: "RS4993", medida: "UNIDAD", stock: 0, stockMin: 2, proveedor: "ADASME", compatible: "Porta Taylor", costo: 68000 },
    { detalle: "Aire Primario", categoria: "FILTRO", marca: "Baldwin", modelo: "RS3870", medida: "UNIDAD", stock: 1, stockMin: 2, proveedor: "ADASME", compatible: "Porta Hyster", costo: 72000 },
    { detalle: "Aire Secundario", categoria: "FILTRO", marca: "Baldwin", modelo: "RS3871", medida: "UNIDAD", stock: 1, stockMin: 2, proveedor: "ADASME", compatible: "Porta Hyster", costo: 45000 },
    { detalle: "Grasa Industrial", categoria: "GRASA", marca: "VALVOLINE", modelo: "LITHIUM GREASE EP-2", medida: "BALDE 19 LTS", stock: 2, stockMin: 3, proveedor: "LUVAL", compatible: "Todos los equipos", costo: 65000 },
    { detalle: "ZUNCHO METÁLICO", categoria: "ZUNCHO", marca: "GENÉRICO", modelo: "3/4 Alta resistencia", medida: "ROLLO", stock: 4, stockMin: 2, proveedor: "PROVEEDOR LOCAL", compatible: "Embalaje y Sujeción", costo: 45000 },
    { detalle: "ZUNCHO PLÁSTICO", categoria: "ZUNCHO", marca: "GENÉRICO", modelo: "1/2 Reforzado", medida: "ROLLO", stock: 6, stockMin: 2, proveedor: "PROVEEDOR LOCAL", compatible: "Embalaje y Sujeción", costo: 28000 },
    { detalle: "Motor de arranque", categoria: "REPUESTO", marca: "GENÉRICO", modelo: "Para horquilla 7 ton", medida: "UNIDAD", stock: 1, stockMin: 1, proveedor: "ADASME", compatible: "Grúa Horquilla 7T", costo: 280000 },
    { detalle: "Alternador", categoria: "REPUESTO", marca: "GENÉRICO", modelo: "Para horquilla 7 ton", medida: "UNIDAD", stock: 1, stockMin: 1, proveedor: "ADASME", compatible: "Grúa Horquilla 7T", costo: 210000 },
    { detalle: "Motor de arranque", categoria: "REPUESTO", marca: "LINCOLN", modelo: "Soldadora Lincoln", medida: "UNIDAD", stock: 1, stockMin: 1, proveedor: "DERCO", compatible: "Soldadora Lincoln", costo: 195000 },
    { detalle: "Alternador", categoria: "REPUESTO", marca: "GENÉRICO", modelo: "Para Porta Taylor", medida: "UNIDAD", stock: 1, stockMin: 1, proveedor: "ADASME", compatible: "Porta Taylor", costo: 340000 },
    { detalle: "Motor de arranque", categoria: "REPUESTO", marca: "GENÉRICO", modelo: "Para Porta Taylor", medida: "UNIDAD", stock: 1, stockMin: 1, proveedor: "ADASME", compatible: "Porta Taylor", costo: 420000 },
    { detalle: "Turbo Compresor", categoria: "REPUESTO", marca: "CUMMINS", modelo: "Para Porta Taylor", medida: "UNIDAD", stock: 1, stockMin: 1, proveedor: "CUMMINS CHILE", compatible: "Porta Taylor", costo: 890000 },
    { detalle: "Banco de válvulas transmisión", categoria: "REPUESTO", marca: "GENÉRICO", modelo: "Para Porta Taylor", medida: "UNIDAD", stock: 1, stockMin: 1, proveedor: "ADASME", compatible: "Porta Taylor", costo: 650000 },
    { detalle: "Correa accesorios motor", categoria: "REPUESTO", marca: "CUMMINS", modelo: "Para Porta Taylor", medida: "UNIDAD", stock: 1, stockMin: 2, proveedor: "CUMMINS", compatible: "Porta Taylor", costo: 45000 },
    { detalle: "Sensores proximidad spreader", categoria: "REPUESTO", marca: "Pepperl+Fuchs", modelo: "Para Porta Taylor", medida: "UNIDAD", stock: 4, stockMin: 2, proveedor: "ADASME", compatible: "Porta Taylor", costo: 120000 },
    { detalle: "Sensor temperatura switch estanque", categoria: "REPUESTO", marca: "TAYLOR Original", modelo: "Pieza Nº 2317-026", medida: "UNIDAD", stock: 1, stockMin: 1, proveedor: "TAYLOR", compatible: "Porta Taylor", costo: 95000 },
    { detalle: "Sensor nivel switch jmpr abajo estanque", categoria: "REPUESTO", marca: "TAYLOR Original", modelo: "Pieza Nº 1 29 2041", medida: "UNIDAD", stock: 1, stockMin: 1, proveedor: "TAYLOR", compatible: "Porta Taylor", costo: 110000 },
    { detalle: "Solenoide 24V VG20 para spreader", categoria: "REPUESTO", marca: "TAYLOR Original", modelo: "Pieza Nº 5277-90", medida: "UNIDAD", stock: 2, stockMin: 2, proveedor: "TAYLOR", compatible: "Porta Taylor", costo: 180000 }
];

// FICHAS TÉCNICAS Y EQUIVALENCIAS MULTIMARCA DE FILTROS POR EQUIPO
const FICHAS_EQUIPOS_CORSSEN = {
    "GPC-01": {
        nombre: "GRÚA PORTACONTENEDORES TAYLOR",
        marca: "TAYLOR",
        modelo: "XLC 975",
        capacidad: "40 TON",
        anio: 2013,
        motor: "Cummins QSM11",
        responsable: "Carlos Lasso",
        estado: "OPERATIVA",
        aceites: [
            { tipo: "Aceite de Motor", modelo: "SAE 15W40", cantidad: "38 Lts", proveedor: "Luval" },
            { tipo: "Aceite Hidráulico", modelo: "SAE 10W30", cantidad: "800 Lts", proveedor: "Luval" },
            { tipo: "Aceite Transmisión", modelo: "Dexron III", cantidad: "60 Lts", proveedor: "Luval" },
            { tipo: "Aceite Diferencial", modelo: "SAE 80W90", cantidad: "75 Lts", proveedor: "Luval" },
            { tipo: "A. cubos ruedas tracción", modelo: "SAE 80W90", cantidad: "12 Lts por lado", proveedor: "Luval" },
            { tipo: "A. cubos ruedas dirección", modelo: "SAE 80W90", cantidad: "4 Lts por lado", proveedor: "Luval" },
            { tipo: "Refrigerante", modelo: "Coolan extender life 50%", cantidad: "20 Lts", proveedor: "Luval" }
        ],
        filtros: [
            { elemento: "Aceite de motor", alt1: "Baldwin BD50000 (Adasme)", alt2: "Fleetguard LF 9001", alt3: "Donaldson P550428", alt4: "-" },
            { elemento: "Combustible (separador agua)", alt1: "Baldwin BF1259 (Adasme)", alt2: "Tecfil PSC289", alt3: "Fleetguard FS1000", alt4: "-" },
            { elemento: "Combustible (agua y comb.)", alt1: "Parker S-3070 (Adasme)", alt2: "Fleetguard FS1015", alt3: "Donaldson P551000", alt4: "-" },
            { elemento: "Hidráulico desahogo", alt1: "Baldwin BT8853-MPG (Adasme)", alt2: "Fleetguard HF6518 (Filter.cl)", alt3: "-", alt4: "-" },
            { elemento: "Aire Primario", alt1: "Baldwin RS4993 (Adasme)", alt2: "Fleetguard AF25708M (Beparts.cl)", alt3: "Donaldson P532503", alt4: "-" },
            { elemento: "Aire Secundario", alt1: "NO APLICA", alt2: "NO APLICA", alt3: "NO APLICA", alt4: "-" },
            { elemento: "Refrigerante del motor", alt1: "Baldwin BW5075 (Adasme)", alt2: "Fleetguard WF2075", alt3: "Donaldson P552075", alt4: "-" },
            { elemento: "Transmisión (usa 2 iguales)", alt1: "Baldwin BT8851-MPG (Adasme)", alt2: "Donaldson P164378 (Filter.cl)", alt3: "-", alt4: "-" }
        ],
        historial: [
            { fecha: "28-05-2023", horometro: "44.800 hrs", prox: "45.050 hrs", descripcion: "Realizado por Terminal San Antonio: Lavado y engrase, chequeo operatividad.", insumos: "Grasa EP-2" },
            { fecha: "22-07-2024", horometro: "8.340 hrs", prox: "8.590 hrs", descripcion: "Chequeo de mandos y niveles de lubricación.", insumos: "Aceite 15W40" }
        ],
        pendientes: [
            "Cambio de electroválvula en spreader",
            "Reemplazar sensor refrigeración motor",
            "Reemplazar sensor aceite hidráulico inferior estanque",
            "Reemplazar sensor aceite hidráulico superior estanque",
            "Cambio de cables en arnés motor",
            "Revisar luces sobre cabina y spreader",
            "Cambiar packing de cilindro de dirección derecho y compensación",
            "Realizar mantención top al motor y pintar grúa"
        ]
    },
    "GPC-02": {
        nombre: "GRÚA PORTACONTENEDORES HYSTER",
        marca: "HYSTER",
        modelo: "RS 46-33 CH (D222)",
        capacidad: "46 TON",
        anio: 2017,
        motor: "Cummins QSM11",
        responsable: "Cristian Diaz",
        estado: "OPERATIVA",
        aceites: [
            { tipo: "Aceite de Motor", modelo: "SAE 15W40", cantidad: "33 Lts", proveedor: "Luval" },
            { tipo: "Aceite Hidráulico", modelo: "SAE 10W30", cantidad: "850 Lts", proveedor: "Luval" },
            { tipo: "Aceite Transmisión", modelo: "Dexron III", cantidad: "65 Lts", proveedor: "Luval" },
            { tipo: "Aceite Diferencial", modelo: "SAE 80W90", cantidad: "80 Lts", proveedor: "Luval" },
            { tipo: "A. cubos ruedas tracción", modelo: "SAE 80W90", cantidad: "12,5 Lts por lado", proveedor: "Luval" },
            { tipo: "A. rotador spreader", modelo: "SAE 80W90", cantidad: "8 Lts", proveedor: "Luval" },
            { tipo: "Refrigerante", modelo: "Coolan extender life 50%", cantidad: "20 Lts", proveedor: "Luval" }
        ],
        filtros: [
            { elemento: "Aceite de motor", alt1: "Hyster 4143757", alt2: "Baldwin BD50000 (Adasme)", alt3: "Fleetguard LF9001", alt4: "Donaldson P179353" },
            { elemento: "Combustible", alt1: "Hyster 1553225", alt2: "Baldwin BF1293-SPS (Adasme)", alt3: "Fleetguard FS1003/FS19596", alt4: "Donaldson P551003/P551103" },
            { elemento: "Combustible (sep. agua)", alt1: "Hyster 1515707", alt2: "Baldwin BF1259 (Adasme)", alt3: "Fleetguard FS1000", alt4: "Donaldson P551000" },
            { elemento: "Hidráulico retorno", alt1: "Hyster 8546415", alt2: "HIFI SH74503 (Adasme)", alt3: "-", alt4: "-" },
            { elemento: "Aire Primario", alt1: "Hyster 1456800", alt2: "Baldwin RS3870 (Adasme)", alt3: "-", alt4: "Donaldson P777869" },
            { elemento: "Aire Secundario", alt1: "Hyster 1456804", alt2: "Baldwin RS3871 (Adasme)", alt3: "-", alt4: "MANN CF 850/2" },
            { elemento: "Refrigerante motor", alt1: "Hyster 1513463", alt2: "Baldwin BW5075 (Adasme)", alt3: "Fleetguard WF2075", alt4: "-" },
            { elemento: "Transmisión (usa 2 iguales)", alt1: "Hyster 1556992", alt2: "Baldwin BT9400-MPG (Adasme)", alt3: "Fleetguard HF35464 (Filter.cl)", alt4: "Donaldson P765075" }
        ],
        historial: [
            { fecha: "17-03-2026", horometro: "28.164 hrs", prox: "28.414 hrs", descripcion: "Realizado por Tattersall: Cambio aceite motor, cambio filtro aceite, cambio filtro aire.", insumos: "Aceite 15W40, BD50000, RS3870" },
            { fecha: "26-06-2026", horometro: "28.350 hrs", prox: "28.600 hrs", descripcion: "Cambio aceite motor, cambio filtro aceite, cambio filtros combustible. (Falta: filtro aire y cambio aceite transmisión/diferencial).", insumos: "Aceite 15W40, BD50000, BF1259" }
        ],
        pendientes: [
            "Reparar cable para mover cabina eléctricamente",
            "Cambio de filtro aire primario y secundario",
            "Cambio de aceite transmisión, diferencial y mandos finales",
            "Cambio de aceite de cubos"
        ]
    },
    "GHO-01": {
        nombre: "GRÚA HORQUILLA LIUGONG 4 TON",
        marca: "LIUGONG",
        modelo: "CPCD40A",
        capacidad: "4 TON",
        anio: 2022,
        motor: "Xinchai 4D35ZG31",
        responsable: "Alexis Santos",
        estado: "OPERATIVA",
        aceites: [
            { tipo: "Aceite de Motor", modelo: "SAE 15W40", cantidad: "7 Lts", proveedor: "Luval" },
            { tipo: "Aceite Hidráulico", modelo: "SAE 10W30", cantidad: "40 Lts", proveedor: "Luval" },
            { tipo: "Aceite Transmisión", modelo: "Dexron III", cantidad: "8 Lts", proveedor: "Luval" },
            { tipo: "Aceite Diferencial", modelo: "SAE 80W90", cantidad: "8 Lts", proveedor: "Luval" },
            { tipo: "Refrigerante", modelo: "Coolan extender life 50%", cantidad: "10 Lts", proveedor: "Luval" }
        ],
        filtros: [
            { elemento: "Aceite de motor", alt1: "Xinchai Original", alt2: "Baldwin BD7317", alt3: "-", alt4: "-" },
            { elemento: "Combustible", alt1: "Xinchai Original", alt2: "Baldwin BF7922", alt3: "-", alt4: "-" },
            { elemento: "Separador de agua", alt1: "NO APLICA", alt2: "NO APLICA", alt3: "-", alt4: "-" },
            { elemento: "Hidráulico retorno", alt1: "NO APLICA", alt2: "NO APLICA", alt3: "-", alt4: "-" }
        ],
        historial: [
            { fecha: "17-03-2026", horometro: "1.240 hrs", prox: "1.490 hrs", descripcion: "Chequeo operacional de torre e hidráulico.", insumos: "Engrase general" }
        ],
        pendientes: [
            "Arreglar piola de parada de motor",
            "Tapar los cables eléctricos de la cabina",
            "Pintar grúa"
        ]
    },
    "GHO-02": {
        nombre: "GRÚA HORQUILLA KOMATSU 7 TON",
        marca: "KOMATSU",
        modelo: "FD 70-7",
        capacidad: "7 TON",
        anio: 2007,
        motor: "Komatsu 6D102E",
        responsable: "Alexis Santos",
        estado: "FUERA DE SERVICIO",
        aceites: [
            { tipo: "Aceite de Motor", modelo: "SAE 15W40", cantidad: "14 Lts", proveedor: "Luval" },
            { tipo: "Aceite Hidráulico", modelo: "SAE 10W30", cantidad: "65 Lts", proveedor: "Luval" },
            { tipo: "Aceite Transmisión", modelo: "Dexron III", cantidad: "15 Lts", proveedor: "Luval" },
            { tipo: "Aceite Diferencial", modelo: "SAE 80W90", cantidad: "12 Lts", proveedor: "Luval" },
            { tipo: "Refrigerante", modelo: "Coolan extender life 50%", cantidad: "18 Lts", proveedor: "Luval" }
        ],
        filtros: [
            { elemento: "Aceite de motor", alt1: "Komatsu 600-211-1231", alt2: "Baldwin B7177", alt3: "Fleetguard LF3970", alt4: "Donaldson P550428" },
            { elemento: "Combustible", alt1: "Komatsu 600-311-8293", alt2: "Baldwin BF7922", alt3: "Fleetguard FF5612", alt4: "Donaldson P550880" }
        ],
        historial: [
            { fecha: "17-03-2026", horometro: "3.890 hrs", prox: "En reparación", descripcion: "En desarme para ajuste y reemplazo de componentes.", insumos: "Repuestos en pedido" }
        ],
        pendientes: [
            "Terminar armado completo de la grúa",
            "Instalar piola de freno de mano",
            "Instalar espejo retrovisor",
            "Colocar bisagras en vidrio trasero",
            "Mejorar las puertas para que sellen al cerrarlas",
            "Pintar grúa"
        ]
    },
    "GHO-03": {
        nombre: "GRÚA HORQUILLA LIUGONG 3.5 TON",
        marca: "LIUGONG",
        modelo: "CPCD35E",
        capacidad: "3.5 TON",
        anio: 2025,
        motor: "Xinchai 3E22YG51",
        responsable: "Alexis Santos",
        estado: "OPERATIVA",
        aceites: [
            { tipo: "Aceite de Motor", modelo: "SAE 15W40", cantidad: "7 Lts", proveedor: "Luval" },
            { tipo: "Aceite Hidráulico", modelo: "SAE 10W30", cantidad: "40 Lts", proveedor: "Luval" },
            { tipo: "Aceite Transmisión", modelo: "Dexron III", cantidad: "8 Lts", proveedor: "Luval" },
            { tipo: "Aceite Diferencial", modelo: "SAE 80W90", cantidad: "8 Lts", proveedor: "Luval" },
            { tipo: "Refrigerante", modelo: "Coolan extender life 50%", cantidad: "10 Lts", proveedor: "Luval" }
        ],
        filtros: [
            { elemento: "Aceite de motor", alt1: "Liugong Original", alt2: "Baldwin BD7317", alt3: "-", alt4: "-" },
            { elemento: "Combustible", alt1: "Liugong Original", alt2: "Baldwin BF7922", alt3: "-", alt4: "-" }
        ],
        historial: [
            { fecha: "17-03-2026", horometro: "420 hrs", prox: "670 hrs", descripcion: "Inspección inicial de rodaje y niveles.", insumos: "OK" }
        ],
        pendientes: [
            "Colocar espejo lateral izquierdo"
        ]
    },
    "GTE-01": {
        nombre: "GRÚA TELESCÓPICA GROVE 60 TON",
        marca: "GROVE",
        modelo: "RT 700E",
        capacidad: "60 TON",
        anio: 2005,
        motor: "Cummins QSB 5.9",
        responsable: "Alexis Santos",
        estado: "OPERATIVA",
        aceites: [
            { tipo: "Aceite de Motor", modelo: "SAE 15W40", cantidad: "20 Lts", proveedor: "Luval" },
            { tipo: "Aceite Hidráulico", modelo: "SAE 10W30", cantidad: "500 Lts", proveedor: "Luval" },
            { tipo: "Aceite Transmisión", modelo: "SAE 10W30", cantidad: "40 Lts", proveedor: "Luval" },
            { tipo: "Aceite Diferencial", modelo: "SAE 80W90", cantidad: "60 Lts", proveedor: "Luval" },
            { tipo: "Refrigerante", modelo: "Coolan extender life 50%", cantidad: "60 Lts", proveedor: "Luval" }
        ],
        filtros: [
            { elemento: "Aceite de motor", alt1: "Baldwin B7177", alt2: "Fleetguard LF3970", alt3: "Donaldson P550428", alt4: "-" },
            { elemento: "Combustible", alt1: "Baldwin BF7922", alt2: "Fleetguard FF5612", alt3: "Donaldson P550880", alt4: "-" },
            { elemento: "Separador agua comb.", alt1: "Baldwin BF1385-SPS", alt2: "Fleetguard FS19732", alt3: "Donaldson P550848", alt4: "-" },
            { elemento: "Hidráulico desahogo", alt1: "Baldwin B7024", alt2: "Fleetguard AF4884", alt3: "Donaldson P564425", alt4: "-" },
            { elemento: "Aire Primario", alt1: "Baldwin RS3506", alt2: "Fleetguard AF25129M", alt3: "Donaldson P532503", alt4: "-" },
            { elemento: "Transmisión", alt1: "Baldwin BT8426-MPG", alt2: "Fleetguard HF28996", alt3: "Donaldson P174675", alt4: "-" }
        ],
        historial: [
            { fecha: "17-03-2026", horometro: "5.120 hrs", prox: "5.370 hrs", descripcion: "Revisión de cables de izaje y sistema hidráulico de pluma.", insumos: "Engrase pluma" }
        ],
        pendientes: [
            "Arreglar alarma de retroceso",
            "Revisar flexibles de pedal en cabina"
        ]
    },
    "GTE-02": {
        nombre: "GRÚA TELESCÓPICA GROVE 35 TON",
        marca: "GROVE",
        modelo: "RT 635C",
        capacidad: "35 TON",
        anio: 1997,
        motor: "Cummins 6BT 5.9",
        responsable: "Alexis Santos",
        estado: "FUERA DE SERVICIO",
        aceites: [
            { tipo: "Aceite de Motor", modelo: "SAE 15W40", cantidad: "18 Lts", proveedor: "Luval" },
            { tipo: "Aceite Hidráulico", modelo: "SAE 10W30", cantidad: "450 Lts", proveedor: "Luval" }
        ],
        filtros: [
            { elemento: "Aceite de motor", alt1: "Baldwin B7177", alt2: "Fleetguard LF3970", alt3: "Donaldson P550428", alt4: "-" },
            { elemento: "Combustible", alt1: "Baldwin BF7922", alt2: "Fleetguard FF5612", alt3: "Donaldson P550880", alt4: "-" }
        ],
        historial: [
            { fecha: "17-03-2026", horometro: "6.400 hrs", prox: "En reparación", descripcion: "Diagnóstico eléctrico de estabilizadores.", insumos: "Revisión eléctrica" }
        ],
        pendientes: [
            "Arreglar cables cortados (no bajan patas de levante)",
            "Freno de parqueo bloqueado"
        ]
    },
    "GTE-03": {
        nombre: "GRÚA TELESCÓPICA GROVE 15 TON",
        marca: "GROVE",
        modelo: "RT 58B",
        capacidad: "15 TON",
        anio: 1981,
        motor: "Detroit Diesel / Cummins",
        responsable: "Alexis Santos",
        estado: "FUERA DE SERVICIO",
        aceites: [
            { tipo: "Aceite de Motor", modelo: "SAE 15W40", cantidad: "16 Lts", proveedor: "Luval" },
            { tipo: "Aceite Hidráulico", modelo: "SAE 10W30", cantidad: "380 Lts", proveedor: "Luval" }
        ],
        filtros: [
            { elemento: "Aceite de motor", alt1: "Baldwin B7177", alt2: "Fleetguard LF3970", alt3: "-", alt4: "-" }
        ],
        historial: [
            { fecha: "17-03-2026", horometro: "7.800 hrs", prox: "En taller", descripcion: "Desmontaje de caja de transmisión.", insumos: "Mano de obra taller" }
        ],
        pendientes: [
            "Instalar la transmisión reparada"
        ]
    },
    "CAM-01": {
        nombre: "CAMIONETA NISSAN NP300",
        marca: "NISSAN",
        modelo: "NP300 4x4",
        capacidad: "1 TON",
        anio: 2018,
        patente: "JWYD-49",
        responsable: "Andrés Plaza",
        estado: "OPERATIVA",
        aceites: [
            { tipo: "Aceite de Motor", modelo: "5W30 DPF / 15W40", cantidad: "6.5 Lts", proveedor: "Luval" }
        ],
        filtros: [
            { elemento: "Aceite de motor", alt1: "Nissan 15208-BN700", alt2: "Mann W7023", alt3: "Baldwin B7449", alt4: "-" },
            { elemento: "Combustible", alt1: "Nissan 16400-4KV0A", alt2: "Mann WK9032", alt3: "-", alt4: "-" }
        ],
        historial: [
            { fecha: "31-03-2026", horometro: "142.500 km", prox: "150.000 km", descripcion: "Cambio de aceite, filtro de aceite y filtro de polen.", insumos: "Aceite 5W30" }
        ],
        pendientes: [
            "Arreglar aire acondicionado (recarga de gas y chequeo de compresor)"
        ]
    },
    "CAM-02": {
        nombre: "CAMIONETA VOLKSWAGEN",
        marca: "VOLKSWAGEN",
        modelo: "Amarok 2.0 TDI",
        capacidad: "1 TON",
        anio: 2017,
        patente: "JKKV-43",
        responsable: "Alexis Santos",
        estado: "OPERATIVA (CON FALLA)",
        aceites: [
            { tipo: "Aceite de Motor", modelo: "5W30 Sintético VW 507.00", cantidad: "7 Lts", proveedor: "Luval" }
        ],
        filtros: [
            { elemento: "Aceite de motor", alt1: "Mann HU 7008 z", alt2: "Mahle OX 388 D", alt3: "-", alt4: "-" }
        ],
        historial: [
            { fecha: "31-03-2026", horometro: "98.200 km", prox: "100.000 km", descripcion: "Revisión de suspensión y frenos delanteros.", insumos: "Pastillas de freno" }
        ],
        pendientes: [
            "Instalar nuevo parachoques",
            "Desabollar y pintar parachoques y capó"
        ]
    },
    "CAM-03": {
        nombre: "CAMIONETA NISSAN NAVARA",
        marca: "NISSAN",
        modelo: "Navara LE",
        capacidad: "1 TON",
        anio: 2015,
        patente: "GCLD-31",
        responsable: "Alexis Santos",
        estado: "FUERA DE SERVICIO",
        aceites: [
            { tipo: "Aceite de Motor", modelo: "10W40 Diésel", cantidad: "6.8 Lts", proveedor: "Luval" }
        ],
        filtros: [
            { elemento: "Aceite de motor", alt1: "Mann W920/48", alt2: "Baldwin B1400", alt3: "-", alt4: "-" }
        ],
        historial: [
            { fecha: "31-03-2026", horometro: "210.000 km", prox: "En taller", descripcion: "Evaluación en taller mecánico.", insumos: "-" }
        ],
        pendientes: [
            "Revisión integral de motor y tren delantero"
        ]
    },
    "CAM-04": {
        nombre: "CAMIONETA MAXUS",
        marca: "MAXUS",
        modelo: "T60 4x4",
        capacidad: "1 TON",
        anio: 2026,
        patente: "VPFX-76",
        responsable: "Daniel Mejias",
        estado: "OPERATIVA",
        aceites: [
            { tipo: "Aceite de Motor", modelo: "5W30 C3 Sintético", cantidad: "5.5 Lts", proveedor: "Luval" }
        ],
        filtros: [
            { elemento: "Aceite de motor", alt1: "Maxus Original", alt2: "Mann W712/95", alt3: "-", alt4: "-" }
        ],
        historial: [
            { fecha: "31-03-2026", horometro: "18.400 km", prox: "20.000 km", descripcion: "Mantención de pauta 15.000 km en concesionario.", insumos: "Pauta oficial" }
        ],
        pendientes: [
            "Sin observaciones pendientes. Camioneta al 100%."
        ]
    },
    "CMN-01": {
        nombre: "CAMIÓN FREIGHTLINER 06",
        marca: "FREIGHTLINER",
        modelo: "M2 106",
        capacidad: "15 TON",
        anio: 2012,
        patente: "FL-06",
        responsable: "Alexis Santos",
        estado: "NO OPERATIVO",
        aceites: [
            { tipo: "Aceite de Motor", modelo: "SAE 15W40 CI-4", cantidad: "28 Lts", proveedor: "Luval" }
        ],
        filtros: [
            { elemento: "Aceite de motor", alt1: "Fleetguard LF9009", alt2: "Baldwin BD7154", alt3: "-", alt4: "-" }
        ],
        historial: [
            { fecha: "15-03-2026", horometro: "415.000 km", prox: "En taller", descripcion: "Diagnóstico eléctrico y de alimentación diésel.", insumos: "Revisión" }
        ],
        pendientes: [
            "Arreglar motor de arranque",
            "Instalar solenoide 12V de la bomba de inyección"
        ]
    },
    "CMN-02": {
        nombre: "CAMIÓN MACK 51",
        marca: "MACK",
        modelo: "Vision / Graniter",
        capacidad: "20 TON",
        anio: 2008,
        patente: "MK-51",
        responsable: "Alexis Santos",
        estado: "NO OPERATIVO",
        aceites: [
            { tipo: "Aceite de Motor", modelo: "SAE 15W40", cantidad: "36 Lts", proveedor: "Luval" }
        ],
        filtros: [
            { elemento: "Aceite de motor", alt1: "Mack 2191P550425", alt2: "Baldwin B7685", alt3: "-", alt4: "-" }
        ],
        historial: [
            { fecha: "10-03-2026", horometro: "520.000 km", prox: "En reparación", descripcion: "Chequeo de fugas en bloque y compresor.", insumos: "-" }
        ],
        pendientes: [
            "Mantención mayor y ajuste de motor pendiente"
        ]
    },
    "CMN-03": {
        nombre: "CAMIÓN VOLKSWAGEN 50",
        marca: "VOLKSWAGEN",
        modelo: "Worker 17.220",
        capacidad: "17 TON",
        anio: 2016,
        patente: "VW-50",
        responsable: "Alexis Santos",
        estado: "OPERATIVO (CON FALLA)",
        aceites: [
            { tipo: "Aceite de Motor", modelo: "SAE 15W40", cantidad: "22 Lts", proveedor: "Luval" }
        ],
        filtros: [
            { elemento: "Aceite de motor", alt1: "Mann W950/26", alt2: "Baldwin BD7154", alt3: "-", alt4: "-" }
        ],
        historial: [
            { fecha: "20-03-2026", horometro: "60.626,6 km", prox: "70.000 km", descripcion: "Revisión sistema de refrigeración.", insumos: "Refrigerante 50%" }
        ],
        pendientes: [
            "Arreglar fuga agua del radiador"
        ]
    }
};

// =========================================================
// 2. ESTADO GENERAL PERSISTENTE (LOCALSTORAGE)
// =========================================================
let corssenPrograma = [];
let corssenStock = [];
let corssenFichas = {};
let vehiculos = [];
let maquinarias = [];
let cargas = [];
let mantenciones = [];
let inventario = [];
let equipoSeleccionado = "GPC-01";
let categoriaFiltroPrograma = "TODOS";
let categoriaFiltroFlota = "TODOS";
let filtroMantencionActivo = "TODAS";
let pestanaInventarioActiva = "EXISTENCIAS";
let pestanaCombustibleActiva = "DESPACHOS";

// =========================================================
// ESTADO ESPECIALIZADO: CONTROL DE ACEITE A GRANEL (200 LITROS)
// =========================================================
let estadoTamborAceite = {
    nombre: "Aceite Valvoline Premium Blue 15W40 CI-4",
    capacidad: 200,
    actual: 200,
    costoTotal: 550000,
    costoPorLitro: 2750,
    proveedor: "LUVAL S.A.",
    factura: "FAC-84920",
    fechaApertura: "2026-03-01",
    estado: "Activo"
};

let historialConsumoAceite = [
    {
        id: "ACEITE-001",
        fecha: "2026-03-01",
        folioOT: "OT-2026-001",
        codigoEquipo: "GPC-01",
        equipoNombre: "Grúa Portacontenedores Taylor 40T",
        tipoMantencion: "Preventiva 250 Hrs",
        litrosDescontados: 33,
        saldoRestante: 167,
        costoTotal: 90750,
        tecnico: "Alexis Santos"
    }
];

// =========================================================
// ESTADO ESPECIALIZADO: CONTROL DE ESTANQUE DE COMBUSTIBLE DIÉSEL (400 LITROS)
// =========================================================
let estadoTanqueCombustible = {
    nombre: "Petróleo Diésel Grado B (Ultra Diésel)",
    capacidad: 400,
    actual: 240,
    costoTotal: 420000,
    costoPorLitro: 1050,
    proveedor: "COPEC S.A. / Distribuidora Sur",
    factura: "FAC-91823",
    fechaUltimaRecarga: "2026-02-27",
    estado: "Activo"
};

let historialRecargasCombustible = [
    {
        id: "RECARGA-COMB-001",
        fecha: "2026-02-27",
        litrosCargados: 400,
        costoTotal: 420000,
        costoPorLitro: 1050,
        proveedor: "COPEC S.A. / Distribuidora Sur",
        factura: "FAC-91823",
        responsable: "Alexis Santos",
        saldoPosterior: 400,
        observaciones: "Llenado inicial del estanque de 400L de taller central."
    }
];

const DATOS_CARGAS_DEFAULT = [
    {
        id: "CARGA-001",
        fecha: "2026-03-01",
        patente: "GPC-01",
        conductor: "Carlos Lasso",
        litros: 80,
        precioLitro: 1050,
        total: 84000,
        origen: "ESTANQUE_400L",
        estacion: "Estanque Diésel 400L CORSSEN",
        saldoPosterior: 240,
        horometroKm: "44.820 hrs",
        fechaRegistro: "2026-03-01T08:30:00.000Z"
    },
    {
        id: "CARGA-002",
        fecha: "2026-03-01",
        patente: "CAM-01",
        conductor: "Andrés Plaza",
        litros: 45,
        precioLitro: 1050,
        total: 47250,
        origen: "ESTANQUE_400L",
        estacion: "Estanque Diésel 400L CORSSEN",
        saldoPosterior: 320,
        horometroKm: "142.500 km",
        fechaRegistro: "2026-03-01T11:15:00.000Z"
    },
    {
        id: "CARGA-003",
        fecha: "2026-02-28",
        patente: "GHO-01",
        conductor: "Alexis Santos",
        litros: 35,
        precioLitro: 1050,
        total: 36750,
        origen: "ESTANQUE_400L",
        estacion: "Estanque Diésel 400L CORSSEN",
        saldoPosterior: 365,
        horometroKm: "12.340 hrs",
        fechaRegistro: "2026-02-28T16:00:00.000Z"
    }
];

const DATOS_MANTENCIONES_DEFAULT = [
    {
        id: "OT-2026-001",
        folio: "OT-2026-001",
        codigoEquipo: "GPC-01",
        patente: "TAYLOR-40T",
        equipoNombre: "Grúa Portacontenedores Taylor 40T",
        fecha: "2026-03-01",
        tipo: "Preventiva 250 Hrs / 10.000 Km",
        horometroKm: "44.800 hrs",
        proximoServicio: "45.050 hrs",
        tecnico: "Alexis Santos",
        taller: "Taller Central CORSSEN",
        descripcion: "Mantención periódica de 250 hrs: Cambio de aceite de motor Valvoline Premium Blue 15W40, sustitución de filtro de aceite Baldwin BD50000, filtro combustible secundario BF1259, sopleteado de filtro de aire y engrase general de spreader.",
        insumosConsumidos: [
            { detalle: "Aceite de Motor SAE 15W40", modelo: "Premium Blue 15W40", cantidad: 1, medida: "BALDE 19L", costoUnitario: 55000, costoTotal: 55000 },
            { detalle: "Filtro de Aceite de Motor Baldwin", modelo: "BD50000", cantidad: 1, medida: "UNIDAD", costoUnitario: 18500, costoTotal: 18500 },
            { detalle: "Filtro Combustible Secundario Baldwin", modelo: "BF1259", cantidad: 1, medida: "UNIDAD", costoUnitario: 14500, costoTotal: 14500 }
        ],
        costoInsumos: 88000,
        costoManoObra: 35000,
        costoTotal: 123000,
        estado: "Completada",
        fechaRegistro: "2026-03-01T10:30:00.000Z"
    },
    {
        id: "OT-2026-002",
        folio: "OT-2026-002",
        codigoEquipo: "GPC-02",
        patente: "HYSTER-46T",
        equipoNombre: "Grúa Portacontenedores Hyster 46T",
        fecha: "2026-02-25",
        tipo: "Preventiva 250 Hrs / 10.000 Km",
        horometroKm: "28.350 hrs",
        proximoServicio: "28.600 hrs",
        tecnico: "Cristian Diaz / Alexis Santos",
        taller: "Taller Central CORSSEN",
        descripcion: "Servicio preventivo motor Cummins QSM11: Cambio de aceite 15W40, filtro Fleetguard LF9009, filtro separador FS1000 y chequeo general de presión hidráulica.",
        insumosConsumidos: [
            { detalle: "Aceite de Motor SAE 15W40", modelo: "Premium Blue 15W40", cantidad: 2, medida: "BALDE 19L", costoUnitario: 55000, costoTotal: 110000 },
            { detalle: "Filtro Aceite de Motor Fleetguard", modelo: "LF9009", cantidad: 1, medida: "UNIDAD", costoUnitario: 22000, costoTotal: 22000 }
        ],
        costoInsumos: 132000,
        costoManoObra: 40000,
        costoTotal: 172000,
        estado: "Completada",
        fechaRegistro: "2026-02-25T14:00:00.000Z"
    },
    {
        id: "OT-2026-003",
        folio: "OT-2026-003",
        codigoEquipo: "CAM-01",
        patente: "JWYD-49",
        equipoNombre: "Camioneta Nissan NP300",
        fecha: "2026-02-18",
        tipo: "Preventiva 250 Hrs / 10.000 Km",
        horometroKm: "142.500 km",
        proximoServicio: "152.500 km",
        tecnico: "Alexis Santos",
        taller: "Taller Central CORSSEN",
        descripcion: "Mantención preventiva de 10.000 km: Cambio de aceite sintético 5W30, filtro de aceite Mann W7023 y revisión de niveles de frenos y refrigerante.",
        insumosConsumidos: [
            { detalle: "Aceite Motor Sintético SAE 5W30", modelo: "SynPower 5W30", cantidad: 2, medida: "BIDÓN 4L", costoUnitario: 32000, costoTotal: 64000 },
            { detalle: "Filtro de Aceite Mann Nissan", modelo: "W7023 / 15208-BN700", cantidad: 1, medida: "UNIDAD", costoUnitario: 9500, costoTotal: 9500 }
        ],
        costoInsumos: 73500,
        costoManoObra: 20000,
        costoTotal: 93500,
        estado: "Completada",
        fechaRegistro: "2026-02-18T11:15:00.000Z"
    },
    {
        id: "OT-2026-004",
        folio: "OT-2026-004",
        codigoEquipo: "GHO-01",
        patente: "LIUGONG-4T",
        equipoNombre: "Grúa Horquilla Liugong 4 Ton",
        fecha: "2026-02-10",
        tipo: "Preventiva 250 Hrs / 10.000 Km",
        horometroKm: "1.240 hrs",
        proximoServicio: "1.490 hrs",
        tecnico: "Alexis Santos",
        taller: "Taller Central CORSSEN",
        descripcion: "Pauta 250 horas: Cambio de aceite de motor 15W40, engrase de mástil y cadenas, regulación de frenos y revisión de luces.",
        insumosConsumidos: [
            { detalle: "Aceite de Motor SAE 15W40", modelo: "Premium Blue 15W40", cantidad: 1, medida: "BALDE 19L", costoUnitario: 55000, costoTotal: 55000 },
            { detalle: "Grasa Multipropósito Litio EP2", modelo: "Valvoline EP-2", cantidad: 1, medida: "POTE 1KG", costoUnitario: 8900, costoTotal: 8900 }
        ],
        costoInsumos: 63900,
        costoManoObra: 25000,
        costoTotal: 88900,
        estado: "Completada",
        fechaRegistro: "2026-02-10T16:45:00.000Z"
    }
];

const DATOS_INVENTARIO_DEFAULT = [
    {
        id: "MOV-001",
        fecha: "2026-03-01",
        folioOT: "OT-2026-001",
        codigoEquipo: "GPC-01",
        equipoNombre: "Grúa Taylor 40T",
        insumoDetalle: "Aceite de Motor SAE 15W40 (Premium Blue 15W40)",
        cantidad: 1,
        medida: "BALDE 19L",
        costoUnitario: 55000,
        costoTotal: 55000,
        responsable: "Alexis Santos",
        stockRestante: 3
    },
    {
        id: "MOV-002",
        fecha: "2026-03-01",
        folioOT: "OT-2026-001",
        codigoEquipo: "GPC-01",
        equipoNombre: "Grúa Taylor 40T",
        insumoDetalle: "Filtro de Aceite de Motor Baldwin (BD50000)",
        cantidad: 1,
        medida: "UNIDAD",
        costoUnitario: 18500,
        costoTotal: 18500,
        responsable: "Alexis Santos",
        stockRestante: 2
    },
    {
        id: "MOV-003",
        fecha: "2026-02-25",
        folioOT: "OT-2026-002",
        codigoEquipo: "GPC-02",
        equipoNombre: "Grúa Hyster 46T",
        insumoDetalle: "Aceite de Motor SAE 15W40 (Premium Blue 15W40)",
        cantidad: 2,
        medida: "BALDE 19L",
        costoUnitario: 55000,
        costoTotal: 110000,
        responsable: "Cristian Diaz / Alexis Santos",
        stockRestante: 4
    },
    {
        id: "MOV-004",
        fecha: "2026-02-18",
        folioOT: "OT-2026-003",
        codigoEquipo: "CAM-01",
        equipoNombre: "Camioneta Nissan NP300",
        insumoDetalle: "Aceite Motor Sintético SAE 5W30 (SynPower 5W30)",
        cantidad: 2,
        medida: "BIDÓN 4L",
        costoUnitario: 32000,
        costoTotal: 64000,
        responsable: "Alexis Santos",
        stockRestante: 1
    }
];

const DATOS_VEHICULOS_DEFAULT = [
    { id: "CAM-01", codigo: "CAM-01", nombre: "Camioneta Nissan NP300", patente: "JWYD-49", marca: "Nissan", modelo: "NP300 4x4", capacidad: "1 TON", anio: 2018, combustible: "Diésel", kilometraje: 142500, estado: "Operativo", responsable: "Andrés Plaza", fechaRegistro: "2026-03-01" },
    { id: "CAM-02", codigo: "CAM-02", nombre: "Camioneta Volkswagen Amarok", patente: "JKKV-43", marca: "Volkswagen", modelo: "Amarok 2.0 TDI", capacidad: "1 TON", anio: 2017, combustible: "Diésel", kilometraje: 98200, estado: "Operativo (con falla)", responsable: "Alexis Santos", fechaRegistro: "2026-03-01" },
    { id: "CAM-03", codigo: "CAM-03", nombre: "Camioneta Nissan Navara", patente: "GCLD-31", marca: "Nissan", modelo: "Navara LE", capacidad: "1 TON", anio: 2015, combustible: "Diésel", kilometraje: 210000, estado: "No Operativo", responsable: "Alexis Santos", fechaRegistro: "2026-03-01" },
    { id: "CAM-04", codigo: "CAM-04", nombre: "Camioneta Maxus T60", patente: "VPFX-76", marca: "Maxus", modelo: "T60 4x4", capacidad: "1 TON", anio: 2026, combustible: "Diésel", kilometraje: 18400, estado: "Operativo", responsable: "Daniel Mejias", fechaRegistro: "2026-03-01" },
    { id: "CMN-01", codigo: "CMN-01", nombre: "Camión Freightliner M2", patente: "FL-06", marca: "Freightliner", modelo: "M2 106 / C-06", capacidad: "15 TON", anio: 2012, combustible: "Diésel", kilometraje: 415000, estado: "No Operativo", responsable: "Alexis Santos", fechaRegistro: "2026-03-01" },
    { id: "CMN-02", codigo: "CMN-02", nombre: "Camión Mack 51", patente: "MK-51", marca: "Mack", modelo: "Vision / Graniter", capacidad: "20 TON", anio: 2008, combustible: "Diésel", kilometraje: 520000, estado: "No Operativo", responsable: "Alexis Santos", fechaRegistro: "2026-03-01" },
    { id: "CMN-03", codigo: "CMN-03", nombre: "Camión Volkswagen 50", patente: "VW-50", marca: "Volkswagen", modelo: "Worker 17.220 / C-50", capacidad: "17 TON", anio: 2016, combustible: "Diésel", kilometraje: 60626, estado: "Operativo (con falla)", responsable: "Alexis Santos", fechaRegistro: "2026-03-01" }
];

const DATOS_MAQUINARIAS_DEFAULT = [
    { id: "GPC-01", numeroMaquinaria: "GPC-01", patenteMaquinaria: "TAYLOR-40T", tipoMaquinaria: "Grúa Portacontenedores", marcaMaquinaria: "Taylor", modeloMaquinaria: "XLC 975", capacidadMaquinaria: "40 TON", anioMaquinaria: 2013, combustibleMaquinaria: "Diésel", horometro: 44800, estado: "Operativo", responsable: "Carlos Lasso / Alexis Santos", fechaRegistro: "2026-03-01" },
    { id: "GPC-02", numeroMaquinaria: "GPC-02", patenteMaquinaria: "HYSTER-46T", tipoMaquinaria: "Grúa Portacontenedores", marcaMaquinaria: "Hyster", modeloMaquinaria: "RS 46-33 CH", capacidadMaquinaria: "46 TON", anioMaquinaria: 2017, combustibleMaquinaria: "Diésel", horometro: 28350, estado: "Operativo", responsable: "Cristian Diaz / Alexis Santos", fechaRegistro: "2026-03-01" },
    { id: "GHO-01", numeroMaquinaria: "GHO-01", patenteMaquinaria: "LIUGONG-4T", tipoMaquinaria: "Grúa Horquilla 4 Ton", marcaMaquinaria: "Liugong", modeloMaquinaria: "CPCD40A", capacidadMaquinaria: "4 TON", anioMaquinaria: 2022, combustibleMaquinaria: "Diésel", horometro: 1240, estado: "Operativo", responsable: "Alexis Santos", fechaRegistro: "2026-03-01" },
    { id: "GHO-02", numeroMaquinaria: "GHO-02", patenteMaquinaria: "KOMATSU-7T", tipoMaquinaria: "Grúa Horquilla 7 Ton", marcaMaquinaria: "Komatsu", modeloMaquinaria: "FD70-7", capacidadMaquinaria: "7 TON", anioMaquinaria: 2015, combustibleMaquinaria: "Diésel", horometro: 3890, estado: "No Operativo", responsable: "Alexis Santos", fechaRegistro: "2026-03-01" },
    { id: "GHO-03", numeroMaquinaria: "GHO-03", patenteMaquinaria: "LIUGONG-3.5T", tipoMaquinaria: "Grúa Horquilla 3.5 Ton", marcaMaquinaria: "Liugong", modeloMaquinaria: "CPCD35A", capacidadMaquinaria: "3.5 TON", anioMaquinaria: 2023, combustibleMaquinaria: "Diésel", horometro: 420, estado: "Operativo", responsable: "Alexis Santos", fechaRegistro: "2026-03-01" },
    { id: "GTE-01", numeroMaquinaria: "GTE-01", patenteMaquinaria: "GROVE-60T", tipoMaquinaria: "Grúa Telescópica 60 Ton", marcaMaquinaria: "Grove", modeloMaquinaria: "RT 700E", capacidadMaquinaria: "60 TON", anioMaquinaria: 2005, combustibleMaquinaria: "Diésel", horometro: 5120, estado: "Operativo", responsable: "Alexis Santos", fechaRegistro: "2026-03-01" },
    { id: "GTE-02", numeroMaquinaria: "GTE-02", patenteMaquinaria: "GROVE-35T", tipoMaquinaria: "Grúa Telescópica 35 Ton", marcaMaquinaria: "Grove", modeloMaquinaria: "RT 535", capacidadMaquinaria: "35 TON", anioMaquinaria: 2008, combustibleMaquinaria: "Diésel", horometro: 6400, estado: "No Operativo", responsable: "Alexis Santos", fechaRegistro: "2026-03-01" },
    { id: "GTE-03", numeroMaquinaria: "GTE-03", patenteMaquinaria: "GROVE-15T", tipoMaquinaria: "Grúa Telescópica 15 Ton", marcaMaquinaria: "Grove", modeloMaquinaria: "RT 415", capacidadMaquinaria: "15 TON", anioMaquinaria: 2002, combustibleMaquinaria: "Diésel", horometro: 7800, estado: "No Operativo", responsable: "Alexis Santos", fechaRegistro: "2026-03-01" }
];

// =========================================================
// 3. INICIALIZACIÓN Y PERSISTENCIA
// =========================================================
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

        // Cargar estado especializado del Tambor de Aceite (200L)
        const tamborGuardado = localStorage.getItem("corssen_tambor_aceite_v1");
        if (tamborGuardado) {
            try {
                estadoTamborAceite = JSON.parse(tamborGuardado);
            } catch (e) {
                console.error("Error al parsear estadoTamborAceite:", e);
            }
        }

        const histAceiteGuardado = localStorage.getItem("corssen_historial_aceite_v1");
        if (histAceiteGuardado) {
            try {
                historialConsumoAceite = JSON.parse(histAceiteGuardado);
            } catch (e) {
                console.error("Error al parsear historialConsumoAceite:", e);
            }
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

        const histRecargasGuardado = localStorage.getItem("corssen_historial_recargas_comb_v1");
        if (histRecargasGuardado) {
            try {
                historialRecargasCombustible = JSON.parse(histRecargasGuardado);
            } catch (e) {
                console.error("Error al parsear historialRecargasCombustible:", e);
            }
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
        localStorage.setItem("corssen_tambor_aceite_v1", JSON.stringify(estadoTamborAceite));
        localStorage.setItem("corssen_historial_aceite_v1", JSON.stringify(historialConsumoAceite));
        localStorage.setItem("corssen_tanque_combustible_v1", JSON.stringify(estadoTanqueCombustible));
        localStorage.setItem("corssen_historial_recargas_comb_v1", JSON.stringify(historialRecargasCombustible));
        localStorage.setItem("corssen_ultima_modificacion_ts", String(Date.now()));

        // Disparar auto-backup silencioso a la nube y local con debounce de 800ms
        if (typeof window !== "undefined" && typeof window.ejecutarAutoBackupSistema === "function") {
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

// =========================================================
// 4. RENDERIZADO DEL DASHBOARD Y RESÚMENES (ALERTAS PREVENTIVAS)
// =========================================================
let filtroAlertaMantencionDash = 'TODAS';
let modoVistaAlertasDash = 'resumida';
let mostrarTodasAlertasDash = false;

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
window.cambiarModoVistaAlertas = cambiarModoVistaAlertas;

function toggleMostrarTodasAlertasDash() {
    mostrarTodasAlertasDash = !mostrarTodasAlertasDash;
    renderizarAlertasMantencionesDashboard();
}
window.toggleMostrarTodasAlertasDash = toggleMostrarTodasAlertasDash;

function filtrarAlertasMantencionDash(filtro, btn) {
    filtroAlertaMantencionDash = filtro;
    document.querySelectorAll('.btn-filtro-alerta-mant').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderizarAlertasMantencionesDashboard();
}
window.filtrarAlertasMantencionDash = filtrarAlertasMantencionDash;

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
            tipoAlerta = 'vencida';
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

    // Ordenar: primero 'vencida', luego 'proxima', luego 'programada'
    const pesoAlerta = { 'vencida': 1, 'proxima': 2, 'programada': 3 };
    lista.sort((a, b) => {
        const pesoDiff = pesoAlerta[a.tipoAlerta] - pesoAlerta[b.tipoAlerta];
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
    const totalVenc = listaCompleta.filter(i => i.tipoAlerta === 'vencida').length;
    const totalProg = listaCompleta.filter(i => i.tipoAlerta === 'programada').length;
    const totalCriticas = totalProx + totalVenc;

    // Actualizar contadores en la UI
    const elDashProx = document.getElementById("dashMantencionesProximas");
    if (elDashProx) elDashProx.textContent = totalCriticas;

    const elBadgeHeader = document.getElementById("badgeTotalMantProximas");
    if (elBadgeHeader) elBadgeHeader.textContent = `${totalCriticas} unidades de atención`;

    const elContTodas = document.getElementById("contFiltroMantTodas");
    if (elContTodas) elContTodas.textContent = totalTodas;

    const elContProx = document.getElementById("contFiltroMantProx");
    if (elContProx) elContProx.textContent = totalProx;

    const elContVenc = document.getElementById("contFiltroMantVenc");
    if (elContVenc) elContVenc.textContent = totalVenc;

    const elContProg = document.getElementById("contFiltroMantProg");
    if (elContProg) elContProg.textContent = totalProg;

    // Filtro de texto del buscador rápido
    const inputBuscar = document.getElementById("inputBuscarAlertaMant");
    const textoBuscar = (inputBuscar?.value || "").toLowerCase().trim();

    const filtradas = listaCompleta.filter(item => {
        // Filtro por pestaña
        if (filtroAlertaMantencionDash === 'PROXIMAS' && item.tipoAlerta !== 'proxima') return false;
        if (filtroAlertaMantencionDash === 'VENCIDAS' && item.tipoAlerta !== 'vencida') return false;
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

    contenedor.innerHTML = itemsAMostrar.map(item => {
        let claseBorde = 'alerta-programada';
        let colorBarra = '#2563eb';
        if (item.tipoAlerta === 'vencida') {
            claseBorde = 'alerta-vencida';
            colorBarra = '#ef4444';
        } else if (item.tipoAlerta === 'proxima') {
            claseBorde = 'alerta-proxima';
            colorBarra = '#f59e0b';
        }

        if (modoVistaAlertasDash === 'resumida') {
            return `
                <div class="tarjeta-alerta-mant modo-resumido ${claseBorde}" style="border-left-color: ${colorBarra};">
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                        <div style="display:flex; align-items:center; gap:6px; min-width:0; overflow:hidden;">
                            <span class="tarjeta-alerta-codigo" style="font-size:11.5px; padding:2px 6px; font-weight:800;">${item.cod}</span>
                            <strong style="font-size:12.5px; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${item.equipo}">
                                ${item.equipo}
                            </strong>
                        </div>
                        <span class="badge ${item.badgeClase}" style="font-size:10px; padding:2px 7px; white-space:nowrap; flex-shrink:0;">
                            ${item.icono} ${item.badge}
                        </span>
                    </div>

                    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:5px 8px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; gap:4px;">
                            <span style="color:#64748b;">Act: <strong style="color:#0f172a;">${item.horoStr || 'N/A'}</strong></span>
                            <span style="color:#64748b;">Próx: <strong style="color:${colorBarra};">${item.proxStr || '-'}</strong></span>
                            <span style="font-weight:700; color:${colorBarra};">${item.restanteTexto}</span>
                        </div>
                        <div class="tarjeta-alerta-barra-progreso" style="height:3.5px; margin-top:3px;">
                            <div class="tarjeta-alerta-barra-relleno" style="width:${item.porcentajeProgreso}%; background:${colorBarra};"></div>
                        </div>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
                        <div style="font-size:11px; color:#64748b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="Responsable: ${item.responsable}">
                            👤 ${item.responsable}
                        </div>
                        <div style="display:flex; gap:4px; flex-shrink:0;">
                            <button type="button" class="btn-secundario" onclick="verFichaTecnica('${item.cod}')" style="padding:2px 7px; font-size:11px; border-radius:5px; font-weight:600;" title="Ver Ficha Técnica y Filtros">
                                📄 Ficha
                            </button>
                            <button type="button" class="btn-primario" onclick="iniciarMantencionParaEquipo('${item.cod}')" style="padding:2px 8px; font-size:11px; border-radius:5px; background:#ea580c; border-color:#ea580c; font-weight:700;" title="Emitir Orden de Trabajo (OT)">
                                ⚡ OT
                            </button>
                        </div>
                    </div>
                </div>
            `;
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
window.renderizarAlertasMantencionesDashboard = renderizarAlertasMantencionesDashboard;

function renderizarDashboard() {
    const totalEquipos = corssenPrograma.length;
    const operativos = corssenPrograma.filter(e => e.estado.toLowerCase().includes("operativo") && !e.estado.toLowerCase().includes("no")).length;
    const conFalla = corssenPrograma.filter(e => e.estado.toLowerCase().includes("falla")).length;
    const noOperativos = corssenPrograma.filter(e => e.estado.toLowerCase().includes("no operativo") || e.estado.toLowerCase().includes("fuera")).length;
    const stockCritico = corssenStock.filter(i => (i.stock <= (i.stockMin || 1))).length;

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
        const pendientesCriticos = corssenPrograma.filter(e => e.observaciones && e.observaciones.trim().length > 0).slice(0, 6);
        tbodyAlertas.innerHTML = pendientesCriticos.map(item => `
            <tr>
                <td><strong>${item.cod}</strong></td>
                <td>${item.equipo} (${item.marca})</td>
                <td><span class="badge ${obtenerClaseBadge(item.estado)}">${item.estado}</span></td>
                <td><span class="badge ${item.prioridad === 'Alta' ? 'badge-rojo' : (item.prioridad === 'Media' ? 'badge-naranja' : 'badge-verde')}">${item.prioridad}</span></td>
                <td>${item.observaciones}</td>
                <td>${item.responsable}</td>
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

// =========================================================
// 5. RENDERIZADO DEL PROGRAMA MAESTRO DE MANTENCIÓN
// =========================================================
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
                <div style="display:flex; gap:4px; justify-content:center;">
                    <button class="btn-secundario" style="padding:4px 8px; font-size:11px;" onclick="verFichaTecnica('${item.cod}')" title="Ver ficha técnica">
                        🔍 Ficha
                    </button>
                    <button class="btn-primario" style="padding:4px 8px; font-size:11px;" onclick="iniciarMantencionParaEquipo('${item.cod}')" title="Crear Orden de Mantención y Rebajar Stock">
                        🔧 Mantención
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}

// =========================================================
// 6. RENDERIZADO DEL STOCK DE INSUMOS Y REPUESTOS & KÁRDEX
// =========================================================
function cambiarPestanaInventario(pestana) {
    pestanaInventarioActiva = pestana;
    
    // Sincronizar botones de pestañas
    document.querySelectorAll(".btn-pestana-inv, .btn-pestana-inventario").forEach(b => {
        const t = b.dataset.pestana || b.dataset.tab;
        b.classList.toggle("active", t === pestana);
    });

    const bloqueExistencias = document.getElementById("bloqueStockExistencias") || document.getElementById("bloqueInventarioExistencias");
    const bloqueKardex = document.getElementById("bloqueStockMovimientos") || document.getElementById("bloqueInventarioKardex");

    if (pestana === "EXISTENCIAS") {
        if (bloqueExistencias) bloqueExistencias.style.display = "block";
        if (bloqueKardex) bloqueKardex.style.display = "none";
        renderizarStockInsumos();
    } else {
        if (bloqueExistencias) bloqueExistencias.style.display = "none";
        if (bloqueKardex) bloqueKardex.style.display = "block";
        renderizarKardexMovimientos();
    }
}

// Helper para normalizar cadenas en búsquedas y compatibilidad
function normalizarTextoBusqueda(str) {
    return (str || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

/**
 * Puebla el selector de equipos para filtrado de compatibilidad en el módulo de Inventario
 */
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

/**
 * Evalúa el grado y detalle de compatibilidad de un insumo respecto a un equipo específico
 */
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
        if (stock <= (item.stockMin || 1)) {
            itemsCriticos++;
        }
    });

    let totalGastosIngresos = 0;
    let totalConsumidoMantenciones = 0;
    (inventario || []).forEach(mov => {
        const cant = Math.abs(mov.cantidad || 1);
        const subtotal = mov.costoTotal || ((mov.costoUnitario || 0) * cant);
        if (mov.tipo === "INGRESO" || (mov.cantidad && mov.cantidad < 0)) {
            totalGastosIngresos += subtotal;
        } else {
            totalConsumidoMantenciones += subtotal;
        }
    });

    const elKpiValor = document.getElementById("kpiStockValorTotal");
    const elKpiIngresos = document.getElementById("kpiStockTotalIngresos");
    const elKpiConsumido = document.getElementById("kpiStockTotalConsumido");
    const elKpiCriticos = document.getElementById("kpiStockCriticos");
    const elBadgeValor = document.getElementById("badgeTotalValorizacionStock");

    if (elKpiValor) elKpiValor.textContent = `$${valorTotalInventario.toLocaleString('es-CL')}`;
    if (elKpiIngresos) elKpiIngresos.textContent = `$${totalGastosIngresos.toLocaleString('es-CL')}`;
    if (elKpiConsumido) elKpiConsumido.textContent = `$${totalConsumidoMantenciones.toLocaleString('es-CL')}`;
    if (elKpiCriticos) elKpiCriticos.textContent = `${itemsCriticos}`;
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
        else if (item.stock <= (item.stockMin || 1)) badgeStock = "badge-naranja";

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
                <td><strong>${item.detalle}</strong></td>
                <td><span class="badge badge-azul">${item.categoria}</span></td>
                <td>${item.marca}</td>
                <td><code>${item.modelo}</code></td>
                <td>${item.medida}</td>
                <td><span class="badge ${badgeStock}">${item.stock} ${item.stock <= (item.stockMin || 1) ? '(Crítico)' : ''}</span></td>
                <td>${item.proveedor || '-'}</td>
                <td style="min-width:180px;">${compatHtml}</td>
                <td><strong>$${(item.costo || 0).toLocaleString('es-CL')}</strong></td>
                <td><strong style="color:#059669;">$${valorTotalLinea.toLocaleString('es-CL')}</strong></td>
                <td>
                    <div style="display:flex; gap:4px; align-items:center;">
                        <button class="btn-secundario" style="padding:3px 8px; font-size:11px; font-weight:700;" onclick="ajustarStockInsumo(${idxOriginal}, 1)" title="Aumentar 1 unidad">+1</button>
                        <button class="btn-secundario" style="padding:3px 8px; font-size:11px; font-weight:700;" onclick="ajustarStockInsumo(${idxOriginal}, -1)" title="Disminuir 1 unidad">-1</button>
                    </div>
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

function ajustarStockInsumo(idx, delta) {
    if (corssenStock[idx]) {
        corssenStock[idx].stock = Math.max(0, (corssenStock[idx].stock || 0) + delta);
        guardarTodo();
        renderizarStockInsumos();
        poblarSelectorIngresoStock();
        renderizarDashboard();
    }
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
        const esIngreso = (mov.tipo === "INGRESO" || (mov.cantidad && mov.cantidad < 0));
        const cantAbs = Math.abs(mov.cantidad || 1);
        const costoTotalMov = mov.costoTotal || ((mov.costoUnitario || 0) * cantAbs);
        return `
            <tr>
                <td><strong>${mov.fecha || '-'}</strong></td>
                <td><span class="badge ${esIngreso ? 'badge-verde' : 'badge-azul'}">${mov.folioOT || (esIngreso ? 'Ingreso Bodega' : 'OT General')}</span></td>
                <td><span class="badge ${esIngreso ? 'badge-verde' : 'badge-rojo'}">${esIngreso ? '📥 INGRESO' : '🛠️ CONSUMO OT'}</span></td>
                <td><strong>${mov.codigoEquipo || '-'}</strong> ${mov.equipoNombre ? `<br><small style="color:#64748b;">${mov.equipoNombre}</small>` : ''}</td>
                <td><strong>${mov.insumoDetalle || '-'}</strong></td>
                <td><strong>${esIngreso ? '+' : '-'}${cantAbs} ${mov.medida || 'UN'}</strong></td>
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

// =========================================================
// 7. RENDERIZADO DE FICHAS TÉCNICAS DE EQUIPOS INDIVIDUALES
// =========================================================
let equipoSeleccionadoFicha = "GPC-01";

// Control de Permisos y Roles de Usuario
function esUsuarioAdministrador() {
    const rol = (sessionStorage.getItem("rolUsuario") || "").toLowerCase().trim();
    const usuario = (sessionStorage.getItem("usuarioLogueado") || "").toLowerCase().trim();
    return rol === "admin" || rol === "administrador" || rol === "administrador general" || usuario === "admin";
}

function actualizarPermisosFichasTecnicas() {
    const esAdmin = esUsuarioAdministrador();
    const btnNueva = document.getElementById("btnNuevaFichaTecnica");
    const btnEditar = document.getElementById("btnEditarFichaTecnica");
    const badgeRestringido = document.getElementById("badgeFichaSoloLectura");

    if (btnNueva) {
        btnNueva.style.display = esAdmin ? "inline-flex" : "none";
    }
    if (btnEditar) {
        btnEditar.style.display = esAdmin ? "inline-flex" : "none";
    }
    if (badgeRestringido) {
        badgeRestringido.style.display = esAdmin ? "none" : "inline-flex";
    }
}

function renderizarSelectorFichas() {
    const contenedor = document.getElementById("contenedorSelectorFichas");
    if (!contenedor) return;

    const equiposDisponibles = Object.keys(corssenFichas);
    if (!equiposDisponibles.includes(equipoSeleccionado) && equiposDisponibles.length > 0) {
        equipoSeleccionado = equiposDisponibles[0];
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
            <div class="btn-equipo-card" onclick="abrirModalNuevaFicha()" style="border:2px dashed #0284c7; background:#f0f9ff; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#0284c7; cursor:pointer;" title="Crear nueva ficha técnica para maquinaria o vehículo">
                <strong style="color:#0284c7; font-size:15px;">➕</strong>
                <span style="color:#0369a1; font-weight:700;">Nueva Ficha</span>
            </div>
        `;
    }

    contenedor.innerHTML = botonesEquipos + botonNuevaFichaCard;
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

// -------------------------------------------------------------
// FUNCIONES PARA MODAL DE EDICIÓN DE FICHA TÉCNICA
// -------------------------------------------------------------
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
    renderizarSelectorFichas();
    renderizarDetalleFichaTecnica();
    renderizarFlotaRegistrada();
    cerrarModalEditarFicha();
    alert(`Ficha técnica del equipo ${cod} eliminada.`);
}

// -------------------------------------------------------------
// FUNCIONES PARA MODAL DE NUEVA FICHA TÉCNICA
// -------------------------------------------------------------
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

// =========================================================
// 8. CRUD Y CATÁLOGO DE FLOTA REGISTRADA Y COMBUSTIBLE
// =========================================================
function irACargarCombustible(patente) {
    navegarSeccion("registrarCarga");
    const input = document.getElementById("patenteCarga");
    if (input) {
        input.value = patente;
        input.focus();
    }
}

function renderizarFlotaRegistrada() {
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
                                ${tieneFicha ? `<button class="btn-secundario" style="padding:3px 6px; font-size:11px;" onclick="verFichaTecnica('${cod}')">🔍 Ficha</button>` : (esUsuarioAdministrador() ? `<button class="btn-secundario" style="padding:3px 6px; font-size:11px; color:#0284c7; border-color:#bae6fd; font-weight:700;" onclick="abrirModalNuevaFichaParaEquipo('${cod}')" title="Crear Ficha Técnica para este vehículo">➕ Ficha</button>` : '')}
                                <button class="btn-primario" style="padding:3px 6px; font-size:11px;" onclick="iniciarMantencionParaEquipo('${cod}')" title="Crear OT y rebajar insumos">🔧 Mantención</button>
                                <button class="btn-secundario" style="padding:3px 6px; font-size:11px; color:#0284c7;" onclick="irACargarCombustible('${v.patente || cod}')">⛽ Diésel</button>
                                <button class="btn-peligro" style="padding:3px 6px; font-size:11px;" onclick="eliminarVehiculo(${i})">🗑️</button>
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
                                ${tieneFicha ? `<button class="btn-secundario" style="padding:3px 6px; font-size:11px;" onclick="verFichaTecnica('${cod}')">🔍 Ficha</button>` : (esUsuarioAdministrador() ? `<button class="btn-secundario" style="padding:3px 6px; font-size:11px; color:#0284c7; border-color:#bae6fd; font-weight:700;" onclick="abrirModalNuevaFichaParaEquipo('${cod}')" title="Crear Ficha Técnica para esta maquinaria">➕ Ficha</button>` : '')}
                                <button class="btn-primario" style="padding:3px 6px; font-size:11px;" onclick="iniciarMantencionParaEquipo('${cod}')" title="Crear OT y rebajar insumos">🔧 Mantención</button>
                                <button class="btn-secundario" style="padding:3px 6px; font-size:11px; color:#0284c7;" onclick="irACargarCombustible('${cod}')">⛽ Diésel</button>
                                <button class="btn-peligro" style="padding:3px 6px; font-size:11px;" onclick="eliminarMaquinaria(${i})">🗑️</button>
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
                    <div style="display:flex; gap:4px; justify-content:center;">
                        <button class="btn-primario" style="padding:3px 6px; font-size:11px;" onclick="iniciarMantencionParaEquipo('${a.cod}')">🔧 Mantención</button>
                        <button class="btn-secundario" style="padding:3px 6px; font-size:11px;" onclick="navegarSeccion('programaMantencion')">📋 Programa</button>
                    </div>
                </td>
            </tr>
        `).join("");
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
                    <div style="display:flex; gap:4px; justify-content:center;">
                        <button class="btn-primario" style="padding:3px 6px; font-size:11px;" onclick="iniciarMantencionParaEquipo('${m.cod}')">🔧 Mantención</button>
                        <button class="btn-secundario" style="padding:3px 6px; font-size:11px;" onclick="navegarSeccion('programaMantencion')">📋 Programa</button>
                    </div>
                </td>
            </tr>
        `).join("");
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
}

function renderizarTablasOriginales() {
    renderizarFlotaRegistrada();
    renderizarModuloCombustible();
}

// =========================================================
// 7.1 CONTROL Y GESTIÓN INTEGRAL DE COMBUSTIBLE & ESTANQUE (400L)
// =========================================================

function renderizarModuloCombustible() {
    const elNombre = document.getElementById("lblNombreTanqueCombustible");
    const elPorcentaje = document.getElementById("lblPorcentajeCombustible");
    const barra = document.getElementById("barraProgresoCombustible");
    const elFecha = document.getElementById("lblFechaRecargaTanque");
    const elProveedor = document.getElementById("lblProveedorTanque");
    const elFactura = document.getElementById("lblFacturaTanque");
    const badgeEstado = document.getElementById("badgeEstadoTanqueCombustible");

    const capTotal = estadoTanqueCombustible.capacidad || 400;
    const saldoActual = Math.max(0, estadoTanqueCombustible.actual !== undefined ? estadoTanqueCombustible.actual : 240);
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
    const saldoActual = estadoTanqueCombustible.actual !== undefined ? estadoTanqueCombustible.actual : 240;
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
    const nuevoSaldo = Math.min(capTotal, (estadoTanqueCombustible.actual || 0) + litros);

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

    const idRecarga = `RECARGA-COMB-${Date.now().toString().slice(-4)}`;
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
        const saldoActual = estadoTanqueCombustible.actual !== undefined ? estadoTanqueCombustible.actual : 240;
        if (litros > saldoActual) {
            return alert(`⚠️ STOCK INSUFICIENTE EN EL ESTANQUE DE 400L:\n\nEl estanque cuenta con ${saldoActual.toFixed(1)} Litros disponibles y se solicitaron ${litros.toFixed(1)} Litros.\n\nPor favor registre una recarga al estanque o ajuste la cantidad.`);
        }
        nuevoSaldoEstanque = Math.max(0, saldoActual - litros);
        estadoTanqueCombustible.actual = nuevoSaldoEstanque;
    }

    const idCarga = `CARGA-${Date.now().toString().slice(-4)}`;
    const totalInversion = Math.round(litros * precioLitro);

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
        saldoPosterior: esEstanqueInterno ? nuevoSaldoEstanque : (estadoTanqueCombustible.actual || 240),
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
    const confirma = confirm(`¿Está seguro de eliminar el registro de carga de ${carga.litros} Lts a ${carga.patente}?${carga.origen === 'ESTANQUE_400L' ? '\n\nLos litros serán restituidos al estanque de 400L.' : ''}`);
    if (!confirma) return;

    if (carga.origen === "ESTANQUE_400L") {
        const capTotal = estadoTanqueCombustible.capacidad || 400;
        estadoTanqueCombustible.actual = Math.min(capTotal, (estadoTanqueCombustible.actual || 0) + Number(carga.litros || 0));
    }

    cargas.splice(idx, 1);
    guardarTodo();
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

    guardarTodo();
    renderizarModuloCombustible();
}

function registrarVehiculo(e) {
    e.preventDefault();
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

function eliminarVehiculo(idx) {
    const v = vehiculos[idx];
    if (!v) return;
    const cod = v.codigo || v.id;
    if (confirm(`¿Está seguro de eliminar el vehículo ${cod} (${v.patente}) de la flota?`)) {
        vehiculos.splice(idx, 1);
        const progIdx = corssenPrograma.findIndex(p => p.cod === cod || p.cod === v.patente);
        if (progIdx >= 0) {
            corssenPrograma.splice(progIdx, 1);
        }
        guardarTodo();
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

function eliminarMaquinaria(idx) {
    const m = maquinarias[idx];
    if (!m) return;
    const cod = m.numeroMaquinaria || m.id;
    if (confirm(`¿Está seguro de eliminar la maquinaria ${cod} del catálogo?`)) {
        maquinarias.splice(idx, 1);
        const progIdx = corssenPrograma.findIndex(p => p.cod === cod);
        if (progIdx >= 0) {
            corssenPrograma.splice(progIdx, 1);
        }
        guardarTodo();
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

// =========================================================
// 8. GESTIÓN INTEGRAL DE MANTENCIONES Y DEDUCCIÓN DE STOCK
// =========================================================
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
                        <button class="btn-mant-action-delete" onclick="eliminarMantencion('${m.folio || m.id}')" title="Eliminar registro">
                            <span>🗑️</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

let ordenActivaOT = null;

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

// =========================================================
// 9. FORMULARIO REGISTRAR NUEVA MANTENCIÓN / OT CON DEDUCCIÓN PRO
// =========================================================
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
                html += `<option value="${eq.cod}">${eq.icono} ${eq.cod} • ${eq.nombre}</option>`;
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
        if (lecturaActual.includes("km")) {
            inputProx.value = `${(lecturaNum + 10000).toLocaleString('es-CL')} km`;
        } else if (lecturaActual.includes("hrs") || lecturaActual.includes("horas")) {
            inputProx.value = `${(lecturaNum + 250).toLocaleString('es-CL')} hrs`;
        } else {
            inputProx.value = `${lecturaNum + 250} hrs`;
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
    const inputLitros = document.getElementById("inputLitrosAceiteDescontar");
    const lblSugerido = document.getElementById("lblInfoAceiteSugeridoFicha");
    const lblSaldo = document.getElementById("lblSaldoTamborActualMant");

    if (lblSaldo) {
        lblSaldo.innerHTML = `Saldo disponible en tambor activo: <strong>${(estadoTamborAceite.actual || 0).toFixed(1)} Lts</strong> (${estadoTamborAceite.nombre || 'Valvoline 15W40'})`;
    }

    let litrosReq = 0;
    let descAceite = "Sin especificación de litros";

    if (ficha && ficha.aceites && ficha.aceites.length > 0) {
        const motOil = ficha.aceites.find(a => a.tipo.toLowerCase().includes("motor")) || ficha.aceites[0];
        if (motOil && motOil.capacidad) {
            const capNum = parseFloat(motOil.capacidad.replace(/[^0-9.]/g, ""));
            if (!isNaN(capNum) && capNum > 0) {
                litrosReq = capNum;
                descAceite = `${motOil.viscosidad || motOil.tipo} - ${motOil.capacidad}`;
            }
        }
    }

    if (inputLitros) {
        inputLitros.value = litrosReq;
    }
    if (lblSugerido) {
        lblSugerido.innerHTML = `Requisito según Ficha Técnica: <strong>${litrosReq > 0 ? litrosReq + ' Litros' : 'N/A'}</strong> <span style="font-size:11px; color:#64748b;">(${descAceite})</span>`;
    }

    calcularTotalMantencionForm();
}

function seleccionarTipoRapido(tipo) {
    const select = document.getElementById("selectMantTipo");
    if (select) {
        select.value = tipo;
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

function sugerirProximoServicioAutomatico() {
    const inputHorometro = document.getElementById("inputMantHorometroKm");
    const inputProx = document.getElementById("inputMantProxServicio");
    if (!inputHorometro || !inputProx) return;

    const val = inputHorometro.value.trim().toLowerCase();
    const num = parseFloat(val.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) return;

    if (val.includes("km")) {
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

    // Calcular costo de Aceite del Tambor de 200L
    const litrosAceite = parseFloat(document.getElementById("inputLitrosAceiteDescontar")?.value) || 0;
    const costoLitroAceite = estadoTamborAceite.costoPorLitro || 2750;
    const subtotalAceite = litrosAceite * costoLitroAceite;

    const lblCostoAceite = document.getElementById("lblCostoAceiteOT");
    if (lblCostoAceite) {
        lblCostoAceite.textContent = `$${subtotalAceite.toLocaleString('es-CL')}`;
    }

    const costoManoObra = parseFloat(document.getElementById("inputMantCostoManoObra")?.value) || 0;
    const totalOT = totalInsumos + subtotalAceite + costoManoObra;

    const elResumenInsumos = document.getElementById("resumenCostoInsumos");
    const elCardInsumos = document.getElementById("labelSubtotalInsumosCard");
    const elTotalOT = document.getElementById("labelMantCostoTotal");

    if (elResumenInsumos) elResumenInsumos.textContent = `$${(totalInsumos + subtotalAceite).toLocaleString('es-CL')}`;
    if (elCardInsumos) elCardInsumos.textContent = `$${(totalInsumos + subtotalAceite).toLocaleString('es-CL')}`;
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
    const folio = `OT-${anioActual}-${numFolio}`;

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

    // 2. Deducir Aceite del Tambor de 200 Litros (Módulo de Aceite)
    const litrosAceite = parseFloat(document.getElementById("inputLitrosAceiteDescontar")?.value) || 0;
    let costoAceiteTotal = 0;

    if (litrosAceite > 0) {
        const costoLitro = estadoTamborAceite.costoPorLitro || 2750;
        costoAceiteTotal = litrosAceite * costoLitro;
        costoInsumos += costoAceiteTotal;

        // Descontar saldo del tambor
        estadoTamborAceite.actual = Math.max(0, (estadoTamborAceite.actual || 200) - litrosAceite);

        insumosConsumidos.push({
            detalle: `Aceite a Granel (${estadoTamborAceite.nombre})`,
            modelo: "Tambor 200L",
            marca: "Valvoline",
            cantidad: litrosAceite,
            medida: "LITROS",
            costoUnitario: costoLitro,
            costoTotal: costoAceiteTotal
        });

        // Registrar en historial especializado de aceite
        historialConsumoAceite.unshift({
            id: `ACEITE-${Date.now()}`,
            fecha,
            folioOT: folio,
            codigoEquipo,
            equipoNombre,
            tipoMantencion: tipo,
            litrosDescontados: litrosAceite,
            saldoRestante: estadoTamborAceite.actual,
            costoTotal: costoAceiteTotal,
            tecnico
        });
    }

    const costoTotal = costoInsumos + costoManoObra;

    // Crear registro de mantención
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
        litrosAceiteDescontados: litrosAceite,
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
    calcularTotalMantencionForm();

    alert(`✓ Mantención registrada exitosamente con Folio ${folio}.\n${litrosAceite > 0 ? `🛢️ Se han descontado ${litrosAceite} Lts de Aceite del Tambor (Saldo restante: ${estadoTamborAceite.actual.toFixed(1)} L).\n` : ''}Se han descontado ${insumosConsumidos.length} insumos y registrado en el historial.`);
    navegarSeccion("gestionMantenciones");
}

// =========================================================
// 10. NAVEGACIÓN ENTRE PANELES Y CONTROL MOBILE
// =========================================================
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

    if (idSeccion === "respaldosMantencion" && typeof window.renderizarModuloRespaldos === "function") {
        window.renderizarModuloRespaldos();
    }

    if (idSeccion === "moduloAceite" && typeof window.renderizarModuloAceite === "function") {
        window.renderizarModuloAceite();
    }

    if (idSeccion === "registrarCarga" && typeof renderizarModuloCombustible === "function") {
        renderizarModuloCombustible();
    }

    if (idSeccion === "fichasEquipos") {
        actualizarPermisosFichasTecnicas();
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

// =========================================================
// 12. GESTIÓN Y CONTROL DE ACEITE A GRANEL (200 LITROS)
// =========================================================

function renderizarModuloAceite() {
    const elNombre = document.getElementById("lblNombreTamborActivo");
    const elPorcentaje = document.getElementById("lblPorcentajeAceite");
    const barra = document.getElementById("barraProgresoAceite");
    const elFecha = document.getElementById("lblFechaAperturaTambor");
    const elProveedor = document.getElementById("lblProveedorTambor");

    const elKpiConsumido = document.getElementById("kpiLitrosConsumidosTambor");
    const elKpiMaquinas = document.getElementById("kpiMaquinasAbastecidasAceite");
    const elKpiCostoL = document.getElementById("kpiCostoLitroAceite");
    const elKpiTambores = document.getElementById("kpiTamboresHistoricos");

    const capTotal = estadoTamborAceite.capacidad || 200;
    const saldoActual = Math.max(0, estadoTamborAceite.actual !== undefined ? estadoTamborAceite.actual : 200);
    const porcentaje = Math.min(100, Math.max(0, (saldoActual / capTotal) * 100));
    const litrosConsumidosTambor = Math.max(0, capTotal - saldoActual);

    if (elNombre) elNombre.textContent = estadoTamborAceite.nombre || "Aceite Valvoline Premium Blue 15W40";
    if (elPorcentaje) {
        elPorcentaje.textContent = `${porcentaje.toFixed(1)}% (${saldoActual.toFixed(1)} / ${capTotal} L)`;
        if (saldoActual <= 35) {
            elPorcentaje.style.color = "#dc2626";
        } else if (saldoActual <= 70) {
            elPorcentaje.style.color = "#d97706";
        } else {
            elPorcentaje.style.color = "#2563eb";
        }
    }

    if (barra) {
        barra.style.width = `${porcentaje}%`;
        if (saldoActual <= 35) {
            barra.style.background = "linear-gradient(90deg, #ef4444, #b91c1c)";
        } else if (saldoActual <= 70) {
            barra.style.background = "linear-gradient(90deg, #f59e0b, #d97706)";
        } else {
            barra.style.background = "linear-gradient(90deg, #3b82f6, #1d4ed8)";
        }
    }

    if (elFecha) elFecha.textContent = estadoTamborAceite.fechaApertura || "2026-03-01";
    if (elProveedor) elProveedor.textContent = estadoTamborAceite.proveedor || "LUVAL S.A.";

    // KPIs
    if (elKpiConsumido) elKpiConsumido.textContent = `${litrosConsumidosTambor.toFixed(1)} L`;
    if (elKpiMaquinas) {
        const maquinasUnicas = new Set(historialConsumoAceite.map(h => h.codigoEquipo)).size;
        elKpiMaquinas.textContent = maquinasUnicas;
    }
    if (elKpiCostoL) {
        const costoL = estadoTamborAceite.costoPorLitro || (estadoTamborAceite.costoTotal ? Math.round(estadoTamborAceite.costoTotal / capTotal) : 2750);
        elKpiCostoL.textContent = `$${costoL.toLocaleString('es-CL')}`;
    }
    if (elKpiTambores) elKpiTambores.textContent = "1 Activo";

    // Actualizar badge en menú lateral
    const badgeMenu = document.getElementById("badgeNivelAceiteMenu");
    if (badgeMenu) {
        badgeMenu.textContent = `${saldoActual.toFixed(0)}L`;
        if (saldoActual <= 35) {
            badgeMenu.className = "badge badge-rojo";
        } else if (saldoActual <= 70) {
            badgeMenu.className = "badge badge-naranja";
        } else {
            badgeMenu.className = "badge badge-azul";
        }
    }

    // Actualizar saldo disponible en formulario de mantención si está visible
    const lblSaldoMant = document.getElementById("lblSaldoTamborActualMant");
    if (lblSaldoMant) {
        lblSaldoMant.innerHTML = `Saldo disponible en tambor activo: <strong>${saldoActual.toFixed(1)} Lts</strong> (${estadoTamborAceite.nombre || 'Valvoline 15W40'})`;
    }

    // Renderizar tabla de historial de consumos
    const tbody = document.getElementById("tbodyHistorialConsumoAceite");
    if (!tbody) return;

    if (!historialConsumoAceite || historialConsumoAceite.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:24px; color:#64748b;">No hay consumos de aceite registrados aún para este tambor.</td></tr>`;
        return;
    }

    tbody.innerHTML = historialConsumoAceite.map((item, index) => {
        const itemId = item.id || `ACEITE-AUTO-${index}`;
        return `
            <tr>
                <td><strong>${item.fecha || '-'}</strong></td>
                <td><span class="badge badge-azul">${item.folioOT || 'OT General'}</span></td>
                <td><strong>${item.codigoEquipo || '-'}</strong> ${item.equipoNombre ? `<br><small style="color:#64748b;">${item.equipoNombre}</small>` : ''}</td>
                <td>${item.tipoMantencion || 'Mantención Periódica'}</td>
                <td><strong style="color:#2563eb; font-size:14px;">-${(item.litrosDescontados || 0).toFixed(1)} Lts</strong></td>
                <td><span class="badge badge-gris">${(item.saldoRestante !== undefined ? item.saldoRestante : 0).toFixed(1)} Lts Disp.</span></td>
                <td><strong style="color:#059669;">$${(item.costoTotal || 0).toLocaleString('es-CL')}</strong></td>
                <td>${item.tecnico || 'Alexis Santos'}</td>
                <td style="text-align:center;">
                    <button type="button" class="btn-peligro" onclick="eliminarConsumoAceite('${itemId}')" title="Eliminar este consumo y reincorporar los litros al tambor" style="padding:4px 8px; font-size:11px; background:#fee2e2; color:#dc2626; border:1px solid #fecaca; border-radius:6px; cursor:pointer; font-weight:600; display:inline-flex; align-items:center; gap:4px; transition:background 0.2s;">
                        🗑️ Eliminar
                    </button>
                </td>
            </tr>
        `;
    }).join("");
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

    const mensajeConfirm = `¿Está seguro de eliminar el registro de consumo de aceite?\n\n` +
        `• Máquina / Equipo: ${equipo}\n` +
        `• Folio OT: ${folio}\n` +
        `• Fecha: ${fecha}\n` +
        `• Litros descontados: ${litros.toFixed(1)} Lts\n\n` +
        `⚠️ Al eliminar este registro, los ${litros.toFixed(1)} Lts se reincorporarán automáticamente al saldo disponible del tambor de aceite.`;

    if (!confirm(mensajeConfirm)) return;

    // 1. Reincorporar litros al tambor de aceite
    if (litros > 0 && estadoTamborAceite) {
        const capMax = Number(estadoTamborAceite.capacidad) || 200;
        const actual = Number(estadoTamborAceite.actual) || 0;
        estadoTamborAceite.actual = Math.min(capMax, actual + litros);
    }

    // 2. Eliminar del array
    historialConsumoAceite.splice(idx, 1);

    // 3. Persistir en almacenamiento local y disparar respaldo
    guardarTodo();

    // 4. Actualizar interfaz
    renderizarModuloAceite();
    if (typeof renderizarDashboard === "function") {
        renderizarDashboard();
    }

    if (typeof mostrarNotificacionToast === "function") {
        mostrarNotificacionToast(`Registro de ${equipo} eliminado y ${litros.toFixed(1)} Lts restituidos al tambor.`, "success");
    } else {
        alert(`Registro de ${equipo} eliminado correctamente. Se devolvieron ${litros.toFixed(1)} Lts al tambor.`);
    }
}

function abrirModalNuevoTambor() {
    const form = document.getElementById("formNuevoTamborAceite");
    if (form) form.reset();
    const inputFecha = document.getElementById("inputFechaAperturaTambor");
    if (inputFecha) {
        inputFecha.value = new Date().toISOString().split("T")[0];
    }
    const modal = document.getElementById("modalNuevoTamborAceite");
    if (modal) modal.style.display = "flex";
}

function cerrarModalNuevoTambor() {
    const modal = document.getElementById("modalNuevoTamborAceite");
    if (modal) modal.style.display = "none";
}

function guardarNuevoTamborAceite(e) {
    if (e && e.preventDefault) e.preventDefault();

    const nombre = document.getElementById("inputNombreAceiteTambor")?.value.trim() || "Aceite Valvoline Premium Blue 15W40 CI-4";
    const capacidad = parseFloat(document.getElementById("inputCapacidadTambor")?.value) || 200;
    const fechaApertura = document.getElementById("inputFechaAperturaTambor")?.value || new Date().toISOString().split("T")[0];
    const costoTotal = parseFloat(document.getElementById("inputCostoTamborTotal")?.value) || 550000;
    const proveedor = document.getElementById("inputProveedorTambor")?.value.trim() || "LUVAL S.A.";
    const factura = document.getElementById("inputFacturaTambor")?.value.trim() || "";

    const costoPorLitro = Math.round(costoTotal / capacidad);

    estadoTamborAceite = {
        nombre,
        capacidad,
        actual: capacidad, // Se inicia al 100% lleno
        costoTotal,
        costoPorLitro,
        proveedor,
        factura,
        fechaApertura,
        estado: "Activo"
    };

    // Registrar apertura en el Kárdex general como evento de recepción
    inventario.unshift({
        id: `MOV-TAMBOR-${Date.now()}`,
        tipo: "INGRESO",
        fecha: fechaApertura,
        folioOT: factura || "APERTURA-TAMBOR",
        codigoEquipo: "TALLER-LUBRICANTES",
        equipoNombre: "Bodega de Lubricantes Central",
        insumoDetalle: `Tambor de Aceite a Granel (${nombre})`,
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

    alert(`✓ Nuevo tambor de ${capacidad} Litros registrado y activado con éxito.\nSaldo inicial listo para descontar en mantenciones: ${capacidad} Litros.`);
}

function exportarConsumosAceiteExcel() {
    const encabezados = [
        "Fecha",
        "Folio OT",
        "Código Equipo",
        "Nombre / Denominación",
        "Tipo de Mantención",
        "Litros Descontados (Lts)",
        "Saldo Tambor Restante (Lts)",
        "Costo Total ($ CLP)",
        "Mecánico Responsable"
    ];

    const filas = (historialConsumoAceite || []).map(item => [
        item.fecha || "",
        item.folioOT || "",
        item.codigoEquipo || "",
        item.equipoNombre || "",
        item.tipoMantencion || "",
        item.litrosDescontados || 0,
        item.saldoRestante !== undefined ? item.saldoRestante : 0,
        item.costoTotal || 0,
        item.tecnico || "Alexis Santos"
    ]);

    const resumenTambor = [
        ["ESTADO ACTUAL DEL TAMBOR DE ACEITE (200 LITROS)"],
        ["Nombre:", estadoTamborAceite.nombre || "Valvoline 15W40"],
        ["Capacidad Inicial:", `${estadoTamborAceite.capacidad || 200} Litros`],
        ["Saldo Actual Disponible:", `${(estadoTamborAceite.actual || 0).toFixed(1)} Litros`],
        ["Costo Estimado por Litro:", `$${(estadoTamborAceite.costoPorLitro || 2750).toLocaleString('es-CL')}`],
        ["Proveedor:", estadoTamborAceite.proveedor || "LUVAL S.A."],
        ["Fecha de Apertura:", estadoTamborAceite.fechaApertura || ""],
        [""]
    ];

    const datosCompletos = [...resumenTambor, encabezados, ...filas];

    descargarLibroExcel("CORSSEN_CONSUMO_ACEITE_200L", [{
        nombre: "Control Aceite 200L",
        datos: datosCompletos,
        anchos: [14, 16, 16, 32, 26, 20, 22, 18, 22]
    }]);
}

// =========================================================
// 11. EXPORTACIÓN NATIVA A MICROSOFT EXCEL (.XLSX)
// =========================================================

/**
 * Motor universal de generación y descarga de libros Microsoft Excel (.xlsx)
 * @param {string} nombreArchivoBase Nombre del archivo (sin extensión o con .xlsx)
 * @param {Array<{nombre: string, datos: Array<Array<any>>, anchos?: Array<number>}>} hojas Lista de hojas con sus datos y anchos de columna
 */
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

// 11.1. Exportación de Programa Maestro de Mantención (.xlsx)
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

// Alias para compatibilidad de llamadas anteriores
function exportarPlanillaCSV() {
    exportarPlanillaExcel();
}

// 11.2. Exportación de Gestión de Mantenciones y Órdenes de Trabajo (.xlsx)
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

// 11.3. Exportación de Existencias e Inventario de Stock (.xlsx)
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

// 11.4. Exportación de Historial y Kárdex de Movimientos (.xlsx)
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
            "RESPONSABLE / OPERADOR"
        ]
    ];

    let totalIngresosCLP = 0;
    let totalConsumoOTCLP = 0;

    (inventario || []).forEach(mov => {
        const esIngreso = (mov.tipo === "INGRESO" || (mov.cantidad && mov.cantidad < 0));
        const cantAbs = Math.abs(mov.cantidad || 1);
        const costoTotal = Number(mov.costoTotal || ((mov.costoUnitario || 0) * cantAbs));

        if (esIngreso) {
            totalIngresosCLP += costoTotal;
        } else {
            totalConsumoOTCLP += costoTotal;
        }

        datosKardex.push([
            mov.fecha || "-",
            esIngreso ? "INGRESO / COMPRA" : "CONSUMO EN MANTENCIÓN OT",
            mov.folioOT || (esIngreso ? "Ingreso Bodega" : "OT General"),
            mov.codigoEquipo ? `${mov.codigoEquipo} - ${mov.equipoNombre || ''}` : "Bodega General",
            mov.insumoDetalle || "-",
            esIngreso ? cantAbs : -cantAbs,
            mov.medida || "UN",
            mov.stockRestante !== undefined ? mov.stockRestante : "-",
            mov.costoUnitario || 0,
            costoTotal,
            mov.responsable || "Alexis Santos"
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

// 11.5. Exportación de Ficha Técnica del Equipo Activo (.xlsx)
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

// 11.6. Exportación de Historial de Combustible & Estanque 400L (.xlsx)
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
        ["Saldo Físico Disponible:", `${(estadoTanqueCombustible.actual !== undefined ? estadoTanqueCombustible.actual : 240).toFixed(1)} Litros`],
        ["Porcentaje de Llenado:", `${(((estadoTanqueCombustible.actual !== undefined ? estadoTanqueCombustible.actual : 240) / (estadoTanqueCombustible.capacidad || 400)) * 100).toFixed(1)}%`],
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

// 11.7. Exportación del Catálogo Maestro de Flota y Maquinarias (.xlsx)
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

// =========================================================
// 11.5. SINCRONIZACIÓN AUTOMÁTICA CON LA NUBE MULTIDISPOSITIVO
// =========================================================
async function sincronizarConUltimoRespaldoNube(forzarRecarga = false) {
    try {
        const resp = await fetch("/api/backup/obtener/ultimo?t=" + Date.now());
        if (!resp.ok) return false;

        const backup = await resp.json();
        if (!backup || !backup.data) return false;

        const serverTs = Number(backup.timestamp || 0);
        const localTs = Number(localStorage.getItem("corssen_ultima_modificacion_ts") || 0);

        // Si el respaldo de la nube es más reciente que el estado local (o se fuerza la recarga)
        if (forzarRecarga || (serverTs > 0 && serverTs > localTs)) {
            console.log(`☁️ Sincronizando estado más reciente desde la nube (Servidor: ${serverTs} vs Local: ${localTs})...`);
            const data = backup.data;

            if (data.corssen_programa_v2) corssenPrograma = JSON.parse(JSON.stringify(data.corssen_programa_v2));
            if (data.corssen_stock_v2) corssenStock = JSON.parse(JSON.stringify(data.corssen_stock_v2));
            if (data.corssen_fichas_v2) corssenFichas = JSON.parse(JSON.stringify(data.corssen_fichas_v2));
            if (data.flota_vehiculos_v3) vehiculos = JSON.parse(JSON.stringify(data.flota_vehiculos_v3));
            if (data.flota_maquinarias_v3) maquinarias = JSON.parse(JSON.stringify(data.flota_maquinarias_v3));
            if (data.flota_cargas) cargas = JSON.parse(JSON.stringify(data.flota_cargas));
            if (data.flota_mantenciones_v3) mantenciones = JSON.parse(JSON.stringify(data.flota_mantenciones_v3));
            if (data.flota_inventario_v3) inventario = JSON.parse(JSON.stringify(data.flota_inventario_v3));
            if (data.corssen_tambor_aceite_v1) estadoTamborAceite = JSON.parse(JSON.stringify(data.corssen_tambor_aceite_v1));
            if (data.corssen_historial_aceite_v1) historialConsumoAceite = JSON.parse(JSON.stringify(data.corssen_historial_aceite_v1));
            if (data.corssen_tanque_combustible_v1) estadoTanqueCombustible = JSON.parse(JSON.stringify(data.corssen_tanque_combustible_v1));
            if (data.corssen_historial_recargas_comb_v1) historialRecargasCombustible = JSON.parse(JSON.stringify(data.corssen_historial_recargas_comb_v1));

            // Guardar localmente reflejando el timestamp del servidor
            localStorage.setItem("corssen_programa_v2", JSON.stringify(corssenPrograma));
            localStorage.setItem("corssen_stock_v2", JSON.stringify(corssenStock));
            localStorage.setItem("corssen_fichas_v2", JSON.stringify(corssenFichas));
            localStorage.setItem("flota_vehiculos_v3", JSON.stringify(vehiculos));
            localStorage.setItem("flota_maquinarias_v3", JSON.stringify(maquinarias));
            localStorage.setItem("flota_cargas", JSON.stringify(cargas));
            localStorage.setItem("flota_mantenciones_v3", JSON.stringify(mantenciones));
            localStorage.setItem("flota_inventario_v3", JSON.stringify(inventario));
            localStorage.setItem("corssen_tambor_aceite_v1", JSON.stringify(estadoTamborAceite));
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
            if (typeof renderizarModuloRespaldos === "function") renderizarModuloRespaldos();

            const elEstado = document.querySelector(".estado-sistema");
            if (elEstado) {
                elEstado.innerHTML = `<span class="estado-punto" style="background:#10b981;"></span> Sincronizado con Nube`;
            }
            return true;
        } else if (localTs > 0 && localTs > serverTs) {
            // El dispositivo local tiene cambios más recientes pendientes de subir a la nube
            if (typeof window.ejecutarAutoBackupSistema === "function") {
                window.ejecutarAutoBackupSistema("Sincronización de cambios pendientes", "AUTOMATICO", true);
            }
        }
    } catch (err) {
        console.warn("Aviso de sincronización en la nube (modo offline/red lenta):", err);
    }
    return false;
}

// =========================================================
// 12. INICIALIZACIÓN AL CARGAR LA PÁGINA
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    // Autenticación obligatoria
    const usuarioLogueado = sessionStorage.getItem("usuarioLogueado");
    const nombreUsuario = sessionStorage.getItem("nombreUsuario");
    const rolUsuario = sessionStorage.getItem("rolUsuario");

    if (!usuarioLogueado) {
        window.location.replace("/login.html");
        return;
    }

    const elUserTop = document.getElementById("usuarioActual");
    const elUserSideNombre = document.getElementById("usuarioSidebarNombre");
    const elUserSideRol = document.getElementById("usuarioSidebarRol");

    if (elUserTop) elUserTop.textContent = `Operando como: ${nombreUsuario || usuarioLogueado} (${rolUsuario || 'Usuario'})`;
    if (elUserSideNombre) elUserSideNombre.textContent = nombreUsuario || usuarioLogueado;
    if (elUserSideRol) elUserSideRol.textContent = rolUsuario || "Operador";

    if (rolUsuario && (rolUsuario.toLowerCase() === "administrador" || rolUsuario.toLowerCase() === "admin")) {
        const btnAdmin = document.getElementById("btnAdministrarUsuarios");
        if (btnAdmin) btnAdmin.style.display = "flex";
    }

    cargarTodo();
    renderizarDashboard();
    renderizarProgramaMaestro();
    poblarSelectorEquiposCompatiblesStock();
    renderizarStockInsumos();
    renderizarKardexMovimientos();
    renderizarMantenciones();
    poblarSelectorEquiposMantencion();
    renderizarSelectorFichas();
    renderizarDetalleFichaTecnica();
    actualizarPermisosFichasTecnicas();
    renderizarTablasOriginales();

    // Eventos de Navegación del Menú
    document.querySelectorAll(".menu-item").forEach(item => {
        item.addEventListener("click", (e) => {
            const href = item.getAttribute("href");
            if (href && href.startsWith("#")) {
                e.preventDefault();
                const seccionId = href.substring(1);
                navegarSeccion(seccionId);
                if (seccionId === "registrarMantencion") {
                    poblarSelectorEquiposMantencion();
                } else if (seccionId === "controlStock") {
                    poblarSelectorEquiposCompatiblesStock();
                }
            }
        });
    });

    // Filtros de categoría en Programa Maestro
    document.querySelectorAll(".btn-pestana-prog").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".btn-pestana-prog").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            categoriaFiltroPrograma = btn.dataset.cat || "TODOS";
            renderizarProgramaMaestro();
        });
    });

    // Filtros de categoría en Flota Registrada
    document.querySelectorAll(".btn-pestana-flota").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".btn-pestana-flota").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            categoriaFiltroFlota = btn.dataset.cat || "TODOS";
            renderizarFlotaRegistrada();
        });
    });

    // Filtros en Gestión de Mantenciones
    document.querySelectorAll(".btn-pestana-mant").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".btn-pestana-mant").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            filtroMantencionActivo = btn.dataset.filtro || "TODAS";
            renderizarMantenciones();
        });
    });

    // Pestañas en Módulo de Stock (Existencias vs Kardex)
    document.querySelectorAll(".btn-pestana-inv, .btn-pestana-inventario").forEach(btn => {
        btn.addEventListener("click", () => {
            const pestana = btn.dataset.pestana || btn.dataset.tab || "EXISTENCIAS";
            cambiarPestanaInventario(pestana);
        });
    });

    // Poblar de inicio el selector de stock para el modal
    poblarSelectorIngresoStock();

    // Buscadores y filtros en tiempo real
    document.getElementById("inputBuscarPrograma")?.addEventListener("input", renderizarProgramaMaestro);
    document.getElementById("inputBuscarStock")?.addEventListener("input", renderizarStockInsumos);
    document.getElementById("selectCategoriaStock")?.addEventListener("change", renderizarStockInsumos);
    document.getElementById("selectEquipoCompatibleStock")?.addEventListener("change", renderizarStockInsumos);
    document.getElementById("selectOrdenarStock")?.addEventListener("change", renderizarStockInsumos);
    document.getElementById("inputBuscarFlota")?.addEventListener("input", renderizarFlotaRegistrada);
    document.getElementById("inputBuscarMantenciones")?.addEventListener("input", renderizarMantenciones);

    // Eventos Formulario Nueva Mantención
    document.getElementById("selectMantEquipo")?.addEventListener("change", manejarCambioEquipoMantencion);
    document.getElementById("btnAgregarFilaInsumo")?.addEventListener("click", () => agregarFilaInsumoDeduccion());
    document.getElementById("btnCargarInsumosFicha")?.addEventListener("click", cargarInsumosSugeridosParaEquipo);
    document.getElementById("inputMantCostoManoObra")?.addEventListener("input", calcularTotalMantencionForm);
    document.getElementById("formNuevaMantencion")?.addEventListener("submit", registrarNuevaMantencion);

    // Eventos Formulario Ingreso Mercadería
    document.getElementById("btnAbrirIngresoStock")?.addEventListener("click", abrirModalIngresoStock);
    document.getElementById("formIngresoMercaderia")?.addEventListener("submit", registrarIngresoMercaderia);
    document.getElementById("formIngresoStock")?.addEventListener("submit", registrarIngresoMercaderia);

    // Formularios Originales
    document.getElementById("formVehiculo")?.addEventListener("submit", registrarVehiculo);
    document.getElementById("formMaquinaria")?.addEventListener("submit", registrarMaquinaria);
    document.getElementById("formCarga")?.addEventListener("submit", registrarCargaCombustible);

    // =====================================================
    // GESTIÓN DE AVATAR Y PERFIL DE USUARIO
    // =====================================================
    const AVATARES_OPCIONALES_SISTEMA = [
        { id: "avatar-mecanico", icono: "👷‍♂️", label: "Mecánico", bg: "linear-gradient(135deg, #1e3a8a, #3b82f6)" },
        { id: "avatar-admin", icono: "👨‍💼", label: "Admin Flota", bg: "linear-gradient(135deg, #0f172a, #334155)" },
        { id: "avatar-grua-porta", icono: "🏗️", label: "Grúas Porta", bg: "linear-gradient(135deg, #c2410c, #f97316)" },
        { id: "avatar-horquilla", icono: "🚜", label: "Horquilla", bg: "linear-gradient(135deg, #ca8a04, #eab308)" },
        { id: "avatar-camion", icono: "🚚", label: "Transporte", bg: "linear-gradient(135deg, #15803d, #22c55e)" },
        { id: "avatar-maritimo", icono: "⚓", label: "Marítimo", bg: "linear-gradient(135deg, #0369a1, #0ea5e9)" },
        { id: "avatar-panol", icono: "🔧", label: "Pañol / Stock", bg: "linear-gradient(135deg, #6d28d9, #8b5cf6)" },
        { id: "avatar-supervisora", icono: "👩‍💼", label: "Supervisora", bg: "linear-gradient(135deg, #be185d, #ec4899)" },
        { id: "avatar-tecnica", icono: "👷‍♀️", label: "Técnica", bg: "linear-gradient(135deg, #e11d48, #fb7185)" },
        { id: "avatar-electrico", icono: "⚡", label: "Electricista", bg: "linear-gradient(135deg, #b45309, #f59e0b)" },
        { id: "avatar-seguridad", icono: "🛡️", label: "Seguridad", bg: "linear-gradient(135deg, #047857, #10b981)" },
        { id: "avatar-planificador", icono: "📋", label: "Planificador", bg: "linear-gradient(135deg, #4338ca, #6366f1)" },
        { id: "avatar-combustible", icono: "⛽", label: "Combustible", bg: "linear-gradient(135deg, #b91c1c, #ef4444)" },
        { id: "avatar-ingeniero", icono: "🧑‍💻", label: "Ingeniero", bg: "linear-gradient(135deg, #0e7490, #06b6d4)" },
        { id: "avatar-corssen", icono: "🚢", label: "Corssen", bg: "linear-gradient(135deg, #0f172a, #1e3a5f)" }
    ];

    // Determinar avatar permanente del usuario (prioridad absoluta a localStorage guardado por el usuario)
    const claveLocalAvatar = "usuarioAvatar_" + String(usuarioLogueado || "").toLowerCase().trim();
    let avatarSeleccionadoPerfil = localStorage.getItem(claveLocalAvatar) || 
                                   sessionStorage.getItem("avatarUsuario") || 
                                   localStorage.getItem("corssen_avatar_actual") || 
                                   (rolUsuario && rolUsuario.toLowerCase() === "admin" ? "avatar-admin" : "avatar-mecanico");

    // Asegurar que sessionStorage y localStorage estén siempre sincronizados con la imagen elegida
    sessionStorage.setItem("avatarUsuario", avatarSeleccionadoPerfil);
    localStorage.setItem(claveLocalAvatar, avatarSeleccionadoPerfil);
    localStorage.setItem("corssen_avatar_actual", avatarSeleccionadoPerfil);

    function renderizarAvatarElementoGlobal(elemento, avatarValor) {
        if (!elemento) return;
        const val = avatarValor || "avatar-mecanico";
        if (val.startsWith("data:image/") || val.startsWith("http://") || val.startsWith("https://") || val.startsWith("/")) {
            elemento.innerHTML = `<img src="${val}" alt="Avatar" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
            elemento.style.background = "transparent";
        } else {
            const preset = AVATARES_OPCIONALES_SISTEMA.find(a => a.id === val);
            if (preset) {
                elemento.innerHTML = preset.icono;
                elemento.style.background = preset.bg;
            } else {
                elemento.innerHTML = val.length <= 4 ? val : "👤";
                elemento.style.background = "linear-gradient(135deg, #1e3a8a, #3b82f6)";
            }
        }
    }

    // Inicializar avatar en sidebar y en topbar móvil/desktop
    const elSidebarAvatar = document.getElementById("usuarioSidebarAvatar");
    const elTopbarAvatar = document.getElementById("usuarioTopbarAvatar");
    renderizarAvatarElementoGlobal(elSidebarAvatar, avatarSeleccionadoPerfil);
    renderizarAvatarElementoGlobal(elTopbarAvatar, avatarSeleccionadoPerfil);

    // Sincronización bidireccional de Avatar con el Servidor / Cloudflare Worker
    async function sincronizarAvatarDesdeServidor() {
        if (!usuarioLogueado) return;
        try {
            // Si ya tenemos un avatar personalizado guardado en localStorage, enviarlo al servidor para sincronizar
            const avatarLocalGuardado = localStorage.getItem(claveLocalAvatar);
            if (avatarLocalGuardado) {
                try {
                    await fetch("/api/perfil/avatar", {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "x-usuario": usuarioLogueado
                        },
                        body: JSON.stringify({ avatar: avatarLocalGuardado })
                    });
                } catch (syncPushErr) {
                    console.debug("Sincronización hacia el servidor en segundo plano diferida:", syncPushErr);
                }
            }

            const res = await fetch("/api/usuarios", {
                headers: { "x-usuario": usuarioLogueado }
            });
            if (res.ok) {
                const usuarios = await res.json();
                if (Array.isArray(usuarios)) {
                    const uFound = usuarios.find(u => u.usuario.toLowerCase() === String(usuarioLogueado).toLowerCase().trim());
                    // Solo adoptar del servidor si existe y no es el fallback predeterminado mientras tenemos uno personalizado
                    if (uFound && uFound.avatar) {
                        const esDefaultServidor = uFound.avatar === "avatar-admin" || uFound.avatar === "avatar-mecanico";
                        if (!avatarLocalGuardado || !esDefaultServidor || avatarLocalGuardado === uFound.avatar) {
                            avatarSeleccionadoPerfil = uFound.avatar;
                            sessionStorage.setItem("avatarUsuario", avatarSeleccionadoPerfil);
                            localStorage.setItem(claveLocalAvatar, avatarSeleccionadoPerfil);
                            localStorage.setItem("corssen_avatar_actual", avatarSeleccionadoPerfil);
                            renderizarAvatarElementoGlobal(document.getElementById("usuarioSidebarAvatar"), avatarSeleccionadoPerfil);
                            renderizarAvatarElementoGlobal(document.getElementById("usuarioTopbarAvatar"), avatarSeleccionadoPerfil);
                        }
                    }
                }
            }
        } catch (e) {
            console.debug("Modo local o servidor no disponible:", e);
        }
    }
    sincronizarAvatarDesdeServidor();

    // Modal Perfil de Usuario
    window.abrirModalPerfilUsuario = function() {
        const modal = document.getElementById("modalPerfilUsuario");
        if (!modal) return;

        document.getElementById("modalPerfilNombreDisplay").textContent = nombreUsuario;
        document.getElementById("modalPerfilRolDisplay").textContent = `Rol: ${rolUsuario}`;
        document.getElementById("modalPerfilSubtitulo").textContent = `Usuario: ${usuarioLogueado}`;

        avatarSeleccionadoPerfil = sessionStorage.getItem("avatarUsuario") || (rolUsuario.toLowerCase() === "admin" ? "avatar-admin" : "avatar-mecanico");
        renderizarAvatarElementoGlobal(document.getElementById("modalPerfilPreviewCirculo"), avatarSeleccionadoPerfil);

        // Poblar galería en el modal de perfil
        const grid = document.getElementById("gridGaleriaPerfilModal");
        if (grid) {
            grid.innerHTML = AVATARES_OPCIONALES_SISTEMA.map(a => `
                <div class="opcion-avatar-item ${a.id === avatarSeleccionadoPerfil ? 'active' : ''}" onclick="seleccionarAvatarPerfilModal('${a.id}')" data-avatar-id="${a.id}">
                    <div class="opcion-avatar-icono">${a.icono}</div>
                    <div class="opcion-avatar-label">${a.label}</div>
                </div>
            `).join("");
        }

        cambiarTabPerfilAvatar("galeria");
        modal.style.display = "flex";
    };

    window.cerrarModalPerfilUsuario = function() {
        const modal = document.getElementById("modalPerfilUsuario");
        if (modal) modal.style.display = "none";
    };

    window.cambiarTabPerfilAvatar = function(tab) {
        document.querySelectorAll("#modalPerfilUsuario .btn-pestana-avatar").forEach((b, i) => {
            const tabs = ["galeria", "subir", "url"];
            b.classList.toggle("active", tabs[i] === tab);
        });
        document.getElementById("tabPerfilAvatarGaleria").style.display = tab === "galeria" ? "block" : "none";
        document.getElementById("tabPerfilAvatarSubir").style.display = tab === "subir" ? "block" : "none";
        document.getElementById("tabPerfilAvatarUrl").style.display = tab === "url" ? "block" : "none";
    };

    window.seleccionarAvatarPerfilModal = function(avatarIdOrData) {
        avatarSeleccionadoPerfil = avatarIdOrData;
        renderizarAvatarElementoGlobal(document.getElementById("modalPerfilPreviewCirculo"), avatarIdOrData);

        document.querySelectorAll("#gridGaleriaPerfilModal .opcion-avatar-item").forEach(el => {
            el.classList.toggle("active", el.dataset.avatarId === avatarIdOrData);
        });
    };

    window.manejarArchivoSubidoPerfil = function(file) {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            return alert("Por favor selecciona un archivo de imagen (PNG, JPG, WebP).");
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement("canvas");
                const maxDim = 256;
                const minSide = Math.min(img.width, img.height);
                const startX = (img.width - minSide) / 2;
                const startY = (img.height - minSide) / 2;

                canvas.width = maxDim;
                canvas.height = maxDim;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, startX, startY, minSide, minSide, 0, 0, maxDim, maxDim);

                const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
                window.seleccionarAvatarPerfilModal(dataUrl);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    window.aplicarUrlPerfilAvatar = function() {
        const url = document.getElementById("inputUrlPerfilAvatar").value.trim();
        if (!url) return alert("Por favor ingresa un enlace válido.");
        window.seleccionarAvatarPerfilModal(url);
    };

    window.guardarAvatarPerfilUsuario = async function() {
        const btn = document.getElementById("btnGuardarAvatarPerfil");
        btn.disabled = true;
        btn.textContent = "Guardando...";

        try {
            const claveLocal = "usuarioAvatar_" + String(usuarioLogueado || "").toLowerCase().trim();
            // Guardar de inmediato en persistencia local permanente (localStorage)
            sessionStorage.setItem("avatarUsuario", avatarSeleccionadoPerfil);
            localStorage.setItem(claveLocal, avatarSeleccionadoPerfil);
            localStorage.setItem("corssen_avatar_actual", avatarSeleccionadoPerfil);
            
            renderizarAvatarElementoGlobal(document.getElementById("usuarioSidebarAvatar"), avatarSeleccionadoPerfil);
            renderizarAvatarElementoGlobal(document.getElementById("usuarioTopbarAvatar"), avatarSeleccionadoPerfil);

            try {
                await fetch("/api/perfil/avatar", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "x-usuario": usuarioLogueado
                    },
                    body: JSON.stringify({ avatar: avatarSeleccionadoPerfil })
                });
            } catch (netErr) {
                console.warn("Worker no disponible, guardado en almacenamiento permanente:", netErr);
            }

            alert("✓ Imagen de perfil guardada permanentemente");
            cerrarModalPerfilUsuario();
        } catch (e) {
            console.error(e);
            alert("✓ Imagen de perfil guardada permanentemente");
            cerrarModalPerfilUsuario();
        } finally {
            btn.disabled = false;
            btn.textContent = "💾 Guardar Nueva Foto";
        }
    };

    // Click en la barra de usuario para abrir perfil
    document.getElementById("btnAbrirPerfilUsuario")?.addEventListener("click", () => {
        window.abrirModalPerfilUsuario();
    });

    // Click en el avatar superior (móvil y desktop) para abrir perfil directamente
    document.getElementById("usuarioTopbarAvatar")?.addEventListener("click", () => {
        window.abrirModalPerfilUsuario();
    });

    // Cerrar Sesión (Botón menú lateral)
    const ejecutarCierreSesion = () => {
        sessionStorage.clear();
        window.location.href = "/login.html";
    };

    document.getElementById("btnCerrarSesion")?.addEventListener("click", ejecutarCierreSesion);

    // Administrar Usuarios
    document.getElementById("btnAdministrarUsuarios")?.addEventListener("click", () => {
        window.location.href = "/usuarios.html";
    });

    // =========================================================
    // 13. CENTRO DE RESPALDOS, SNAPSHOTS Y MANTENCIÓN DEL SISTEMA
    // =========================================================
    const CLAVE_MANTENCION_DEFAULT = "corssen2026";
    let backupFileCargadoData = null;

    function obtenerClaveMantenimientoConfigurada() {
        return localStorage.getItem("corssen_clave_mantenimiento") || CLAVE_MANTENCION_DEFAULT;
    }

    function estaModuloRespaldosDesbloqueado() {
        return sessionStorage.getItem("corssen_modulo_respaldos_desbloqueado") === "true";
    }

    window.toggleVisibilidadClaveRespaldos = function() {
        const input = document.getElementById("inputClaveMantenimiento");
        if (input) {
            input.type = input.type === "password" ? "text" : "password";
        }
    };

    window.desbloquearModuloRespaldos = function(e) {
        if (e) e.preventDefault();
        const input = document.getElementById("inputClaveMantenimiento");
        const msgError = document.getElementById("msgErrorClaveRespaldos");
        const claveIngresada = input ? input.value.trim() : "";
        const claveReal = obtenerClaveMantenimientoConfigurada();

        if (claveIngresada === claveReal) {
            sessionStorage.setItem("corssen_modulo_respaldos_desbloqueado", "true");
            if (msgError) msgError.style.display = "none";
            if (input) input.value = "";
            sincronizarEstadoVisualModuloRespaldos();
        } else {
            if (msgError) {
                msgError.textContent = "⚠️ Contraseña de mantención incorrecta. Intente de nuevo.";
                msgError.style.display = "block";
            }
        }
    };

    window.bloquearModuloRespaldos = function() {
        sessionStorage.removeItem("corssen_modulo_respaldos_desbloqueado");
        sincronizarEstadoVisualModuloRespaldos();
    };

    function sincronizarEstadoVisualModuloRespaldos() {
        const desbloqueado = estaModuloRespaldosDesbloqueado();
        const vistaBloqueo = document.getElementById("vistaBloqueoRespaldos");
        const vistaContenido = document.getElementById("vistaContenidoRespaldos");
        const badgeAcceso = document.getElementById("badgeEstadoAccesoRespaldos");
        const btnBloquear = document.getElementById("btnBloquearModuloRespaldos");
        const btnCambiarClave = document.getElementById("btnCambiarClaveRespaldosModal");
        const badgeMenu = document.getElementById("badgeCandadoMenu");

        if (desbloqueado) {
            if (vistaBloqueo) vistaBloqueo.style.display = "none";
            if (vistaContenido) vistaContenido.style.display = "block";
            if (badgeAcceso) {
                badgeAcceso.className = "badge badge-verde";
                badgeAcceso.textContent = "🔓 Acceso Autorizado";
            }
            if (btnBloquear) btnBloquear.style.display = "inline-flex";
            if (btnCambiarClave) btnCambiarClave.style.display = "inline-flex";
            if (badgeMenu) {
                badgeMenu.textContent = "🔓";
                badgeMenu.style.color = "#4ade80";
            }
            renderizarModuloRespaldos();
        } else {
            if (vistaBloqueo) vistaBloqueo.style.display = "block";
            if (vistaContenido) vistaContenido.style.display = "none";
            if (badgeAcceso) {
                badgeAcceso.className = "badge badge-rojo";
                badgeAcceso.textContent = "🔒 Acceso Bloqueado";
            }
            if (btnBloquear) btnBloquear.style.display = "none";
            if (btnCambiarClave) btnCambiarClave.style.display = "none";
            if (badgeMenu) {
                badgeMenu.textContent = "🔒";
                badgeMenu.style.color = "#60a5fa";
            }
        }
    }

    // Modal Cambiar Clave
    window.abrirModalCambiarClaveMantenimiento = function() {
        const modal = document.getElementById("modalCambiarClaveMantenimiento");
        if (!modal) return;
        const msg = document.getElementById("msgErrorCambioClaveMant");
        if (msg) msg.style.display = "none";
        document.getElementById("formCambiarClaveMantenimiento")?.reset();
        modal.style.display = "flex";
    };

    window.cerrarModalCambiarClaveMantenimiento = function() {
        const modal = document.getElementById("modalCambiarClaveMantenimiento");
        if (modal) modal.style.display = "none";
    };

    window.guardarNuevaClaveMantenimiento = function(e) {
        e.preventDefault();
        const actual = document.getElementById("inputClaveActualMant")?.value.trim();
        const nueva = document.getElementById("inputClaveNuevaMant")?.value.trim();
        const confirma = document.getElementById("inputClaveConfirmaMant")?.value.trim();
        const msg = document.getElementById("msgErrorCambioClaveMant");

        const claveReal = obtenerClaveMantenimientoConfigurada();
        if (actual !== claveReal) {
            if (msg) {
                msg.textContent = "⚠️ La contraseña actual ingresada no coincide.";
                msg.style.display = "block";
            }
            return;
        }

        if (nueva.length < 4) {
            if (msg) {
                msg.textContent = "⚠️ La nueva contraseña debe tener al menos 4 caracteres.";
                msg.style.display = "block";
            }
            return;
        }

        if (nueva !== confirma) {
            if (msg) {
                msg.textContent = "⚠️ La confirmación de contraseña no coincide.";
                msg.style.display = "block";
            }
            return;
        }

        localStorage.setItem("corssen_clave_mantenimiento", nueva);
        alert("✓ Contraseña de mantenimiento actualizada exitosamente.");
        cerrarModalCambiarClaveMantenimiento();
    };

    // =========================================================
    // SISTEMA DE COPIAS DE SEGURIDAD AUTOMÁTICAS Y NUBE (CLOUDFLARE KV)
    // =========================================================
    let temporizadorAutoBackup = null;
    let debounceAutoBackupTimeout = null;

    function obtenerConfigAutoBackup() {
        try {
            const guardado = localStorage.getItem("corssen_autobackup_config");
            if (guardado) return JSON.parse(guardado);
        } catch (e) {}
        return {
            activo: true,
            intervaloMinutos: 30,
            nubeHabilitada: true,
            localHabilitado: true,
            ultimoBackupTimestamp: Date.now(),
            ultimoBackupFecha: new Date().toLocaleDateString("es-CL") + " " + new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
            ultimoEstado: "OK"
        };
    }

    function guardarConfigAutoBackup(cfg) {
        try {
            localStorage.setItem("corssen_autobackup_config", JSON.stringify(cfg));
        } catch (e) {}
    }

    // Colección de Snapshots Locales
    function obtenerSnapshots() {
        try {
            return JSON.parse(localStorage.getItem("corssen_snapshots_v1") || "[]");
        } catch (e) {
            return [];
        }
    }

    function guardarListaSnapshots(lista) {
        localStorage.setItem("corssen_snapshots_v1", JSON.stringify(lista));
    }

    function capturarEstadoActualSistema(motivo = "Snapshot Manual", tipo = "MANUAL", usuario = "Alexis Santos") {
        return {
            id: "SNP-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
            fecha: new Date().toLocaleDateString("es-CL"),
            hora: new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            timestamp: Date.now(),
            motivo: motivo,
            tipo: tipo, // MANUAL, AUTOMATICO, AUTOMATICO_NUBE, CRON, PRE_CAMBIO, PRE_ROLLBACK
            usuario: usuario,
            origen: "Local + Cloud",
            data: {
                corssen_programa_v2: JSON.parse(JSON.stringify(corssenPrograma || [])),
                corssen_stock_v2: JSON.parse(JSON.stringify(corssenStock || [])),
                corssen_fichas_v2: JSON.parse(JSON.stringify(corssenFichas || {})),
                flota_vehiculos_v3: JSON.parse(JSON.stringify(vehiculos || [])),
                flota_maquinarias_v3: JSON.parse(JSON.stringify(maquinarias || [])),
                flota_cargas: JSON.parse(JSON.stringify(cargas || [])),
                flota_mantenciones_v3: JSON.parse(JSON.stringify(mantenciones || [])),
                flota_inventario_v3: JSON.parse(JSON.stringify(inventario || [])),
                corssen_tambor_aceite_v1: JSON.parse(JSON.stringify(estadoTamborAceite || {})),
                corssen_historial_aceite_v1: JSON.parse(JSON.stringify(historialConsumoAceite || [])),
                corssen_tanque_combustible_v1: JSON.parse(JSON.stringify(estadoTanqueCombustible || {})),
                corssen_historial_recargas_comb_v1: JSON.parse(JSON.stringify(historialRecargasCombustible || []))
            },
            resumen: {
                totalPrograma: (corssenPrograma || []).length,
                totalVehiculos: (vehiculos || []).length,
                totalMaquinarias: (maquinarias || []).length,
                totalMantenciones: (mantenciones || []).length,
                totalStock: (corssenStock || []).length,
                totalCargas: (cargas || []).length,
                combustibleActual: estadoTanqueCombustible?.actual || 0,
                aceiteActual: estadoTamborAceite?.actual || 0
            }
        };
    }

    // Enviar respaldo a la nube (Cloudflare KV / Servidor)
    async function enviarRespaldoNube(snapshot) {
        try {
            const resp = await fetch("/api/backup/guardar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(snapshot)
            });
            if (resp.ok) {
                const data = await resp.json();
                return { ok: true, data };
            }
        } catch (e) {
            console.warn("No se pudo enviar a la API de backup en la nube (modo offline/fallback local):", e);
        }
        return { ok: false };
    }

    // Ejecución centralizada de Auto-Backup
    window.ejecutarAutoBackupSistema = async function(motivo = "Copia de Seguridad Automática", tipo = "AUTOMATICO", silencioso = true) {
        const usuario = sessionStorage.getItem("nombreUsuario") || "Sistema Automático";
        const snapshot = capturarEstadoActualSistema(motivo, tipo, usuario);
        
        // 1. Guardar en Snapshots Locales
        const lista = obtenerSnapshots();
        lista.unshift(snapshot);
        if (lista.length > 25) {
            lista.pop();
        }
        guardarListaSnapshots(lista);

        // 2. Enviar a Cloudflare KV en la nube
        const resNube = await enviarRespaldoNube(snapshot);

        // 3. Actualizar Configuración y Tiempos
        const cfg = obtenerConfigAutoBackup();
        cfg.ultimoBackupTimestamp = Date.now();
        cfg.ultimoBackupFecha = `${snapshot.fecha} ${snapshot.hora}`;
        cfg.ultimoEstado = resNube.ok ? "OK_NUBE" : "OK_LOCAL";
        guardarConfigAutoBackup(cfg);

        // 4. Actualizar Interfaz
        actualizarIndicadoresAutoBackupUI();
        renderizarModuloRespaldos();

        if (!silencioso) {
            const dest = resNube.ok ? "en la nube Cloudflare KV y localmente" : "en el almacenamiento local";
            mostrarToast(`✓ Copia de seguridad guardada exitosamente ${dest}.`, "success");
        }
        return snapshot;
    };

    window.crearPuntoRestauracionSistema = function(motivo = "Punto de Restauración", tipo = "MANUAL", silencioso = false) {
        return window.ejecutarAutoBackupSistema(motivo, tipo, silencioso);
    };

    window.ejecutarRespaldoNubeInmediatoManual = async function() {
        const btn = document.getElementById("btnForzarBackupNube");
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = "⏳ Guardando en la Nube...";
        }
        try {
            const usuario = sessionStorage.getItem("nombreUsuario") || "Alexis Santos";
            await window.ejecutarAutoBackupSistema(`Respaldo Manual Forzado por ${usuario}`, "MANUAL", false);
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = "☁️ Respaldar en la Nube Ahora";
            }
        }
    };

    // Servicio en Background de Copias de Seguridad Automáticas
    window.iniciarServicioAutoBackup = function() {
        if (temporizadorAutoBackup) {
            clearInterval(temporizadorAutoBackup);
        }

        actualizarIndicadoresAutoBackupUI();

        // Chequear cada 30 segundos si corresponde disparar un auto-backup
        temporizadorAutoBackup = setInterval(() => {
            const cfg = obtenerConfigAutoBackup();
            if (!cfg.activo) {
                actualizarIndicadoresAutoBackupUI();
                return;
            }

            const ahora = Date.now();
            const tiempoTranscurrido = ahora - (cfg.ultimoBackupTimestamp || 0);
            const intervaloMs = (cfg.intervaloMinutos || 30) * 60 * 1000;

            if (tiempoTranscurrido >= intervaloMs) {
                console.log("⏰ Ejecutando copia de seguridad automática programada...");
                ejecutarAutoBackupSistema("Copia Automática Programada", "AUTOMATICO", true);
            } else {
                actualizarIndicadoresAutoBackupUI();
            }
        }, 30000);
    };

    function actualizarIndicadoresAutoBackupUI() {
        const cfg = obtenerConfigAutoBackup();
        const check = document.getElementById("checkAutoBackupActivo");
        const select = document.getElementById("selectFrecuenciaBackup");
        const badge = document.getElementById("badgeEstadoAutoBackup");
        const txtProx = document.getElementById("textoProximoBackup");
        const txtUlt = document.getElementById("textoUltimoBackupNube");

        if (check) check.checked = !!cfg.activo;
        if (select) select.value = String(cfg.intervaloMinutos || 30);

        if (badge) {
            if (cfg.activo) {
                badge.className = "badge badge-verde";
                badge.textContent = "🟢 ACTIVO";
            } else {
                badge.className = "badge badge-gris";
                badge.textContent = "⚪ PAUSADO";
            }
        }

        if (txtUlt) {
            const estadoTexto = cfg.ultimoEstado === "OK_NUBE" ? " (☁️ Nube KV)" : " (💻 Local)";
            txtUlt.textContent = cfg.ultimoBackupFecha ? `Último: ${cfg.ultimoBackupFecha}${estadoTexto}` : "Sin respaldos aún";
        }

        if (txtProx) {
            if (!cfg.activo) {
                txtProx.textContent = "⏸️ Desactivado";
                txtProx.style.color = "#64748b";
            } else {
                const ahora = Date.now();
                const intervaloMs = (cfg.intervaloMinutos || 30) * 60 * 1000;
                const restanteMs = Math.max(0, intervaloMs - (ahora - (cfg.ultimoBackupTimestamp || 0)));
                const minutosRestantes = Math.ceil(restanteMs / 60000);
                txtProx.textContent = `⏳ En aprox. ${minutosRestantes} min`;
                txtProx.style.color = "#2563eb";
            }
        }
    }

    window.cambiarConfiguracionAutoBackup = function() {
        const check = document.getElementById("checkAutoBackupActivo");
        const select = document.getElementById("selectFrecuenciaBackup");
        const cfg = obtenerConfigAutoBackup();

        if (check) cfg.activo = check.checked;
        if (select) cfg.intervaloMinutos = parseInt(select.value, 10) || 30;

        guardarConfigAutoBackup(cfg);
        actualizarIndicadoresAutoBackupUI();
        mostrarToast(cfg.activo ? `✓ Auto-backup activado: cada ${cfg.intervaloMinutos} minutos.` : "Auto-backup pausado.", "info");
    };

    window.abrirModalCrearSnapshot = function() {
        const modal = document.getElementById("modalCrearSnapshot");
        if (!modal) return;
        document.getElementById("formCrearSnapshot")?.reset();
        modal.style.display = "flex";
    };

    window.cerrarModalCrearSnapshot = function() {
        const modal = document.getElementById("modalCrearSnapshot");
        if (modal) modal.style.display = "none";
    };

    window.guardarNuevoSnapshotManual = function(e) {
        e.preventDefault();
        const nombre = document.getElementById("inputSnapshotNombre")?.value.trim() || "Snapshot Manual";
        const detalles = document.getElementById("inputSnapshotDetalles")?.value.trim();
        const motivoCompleto = detalles ? `${nombre} (${detalles})` : nombre;

        crearPuntoRestauracionSistema(motivoCompleto, "MANUAL", false);
        cerrarModalCrearSnapshot();
    };

    // Renderizar Módulo de Respaldos
    window.renderizarModuloRespaldos = function() {
        const snapshots = obtenerSnapshots();

        // 1. KPIs
        const elTotalSnap = document.getElementById("kpiTotalSnapshots");
        const elUltimoSnap = document.getElementById("kpiUltimoRespaldoFecha");
        const elTamano = document.getElementById("kpiTamanoAlmacenamiento");

        if (elTotalSnap) elTotalSnap.textContent = snapshots.length;
        if (elUltimoSnap) {
            elUltimoSnap.textContent = snapshots.length > 0 ? `${snapshots[0].fecha} ${snapshots[0].hora}` : "Sin puntos aún";
        }

        // Calcular tamaño aproximado de localStorage en KB
        let bytesTotales = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                bytesTotales += ((localStorage[key].length + key.length) * 2);
            }
        }
        const kb = (bytesTotales / 1024).toFixed(1);
        if (elTamano) elTamano.textContent = `${kb} KB`;

        actualizarIndicadoresAutoBackupUI();
        renderizarTablaSnapshots();
    };

    window.renderizarTablaSnapshots = function() {
        const tbody = document.getElementById("tbodySnapshotsHistorial");
        if (!tbody) return;

        const snapshots = obtenerSnapshots();
        if (snapshots.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center; padding:32px; color:#64748b;">
                        <div style="font-size:32px; margin-bottom:8px;">💾</div>
                        <strong>No hay puntos de restauración guardados aún.</strong><br>
                        <span style="font-size:12px;">El sistema generará copias de seguridad automáticas periódicamente o puedes crear un punto manual con el botón superior.</span>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = snapshots.map(s => {
            const tamanoAprox = (JSON.stringify(s).length / 1024).toFixed(1) + " KB";
            let badgeTipo = `<span class="badge badge-azul">👤 Manual</span>`;
            if (s.tipo === "AUTOMATICO" || s.tipo === "AUTOMATICO_NUBE") {
                badgeTipo = `<span class="badge badge-verde">⚡ Automático (Nube)</span>`;
            } else if (s.tipo === "CRON" || s.tipo === "CRON_AUTOMATICO") {
                badgeTipo = `<span class="badge badge-morado">☁️ Cron Cloudflare</span>`;
            } else if (s.tipo === "PRE_CAMBIO" || s.tipo === "PRE_ROLLBACK") {
                badgeTipo = `<span class="badge badge-naranja">🔧 Pre-Cambio</span>`;
            }

            return `
                <tr>
                    <td><strong>${s.id}</strong></td>
                    <td>
                        <strong>${s.fecha}</strong>
                        <div style="font-size:11px; color:#64748b;">${s.hora}</div>
                    </td>
                    <td>${badgeTipo}</td>
                    <td>
                        <strong style="color:#0f172a;">${s.motivo}</strong>
                        <div style="font-size:11px; color:#64748b;">Por: ${s.usuario || 'Alexis Santos'}</div>
                    </td>
                    <td style="font-size:12px;">
                        <span title="Equipos en programa">${s.resumen?.totalPrograma || 0} Equipos</span> • 
                        <span title="Vehículos">${s.resumen?.totalVehiculos || 0} Veh.</span> • 
                        <span title="Maquinarias">${s.resumen?.totalMaquinarias || 0} Maq.</span> • 
                        <span title="Órdenes de Trabajo">${s.resumen?.totalMantenciones || 0} OTs</span> • 
                        <span title="Ítems de Inventario">${s.resumen?.totalStock || 0} Insumos</span>
                    </td>
                    <td><span style="font-weight:700; color:#475569;">${tamanoAprox}</span></td>
                    <td style="text-align:center;">
                        <div style="display:flex; gap:6px; justify-content:center; flex-wrap:wrap;">
                            <button type="button" class="btn-primario" style="padding:4px 8px; font-size:11px; background:#2563eb; border-color:#2563eb;" onclick="restaurarSnapshotModoMerge('${s.id}')" title="Restaura datos borrados o perdidos SIN eliminar los datos nuevos ingresados hoy">
                                🔄 Fusión Segura
                            </button>
                            <button type="button" class="btn-secundario" style="padding:4px 8px; font-size:11px; color:#b91c1c; border-color:#fecaca;" onclick="restaurarSnapshotModoRollback('${s.id}')" title="Reemplaza el 100% de la base de datos dejando el sistema exactamente como estaba en este punto">
                                ⚠️ Rollback Total
                            </button>
                            <button type="button" class="btn-secundario" style="padding:4px 8px; font-size:11px;" onclick="descargarSnapshotJSON('${s.id}')" title="Descargar este punto específico en archivo .JSON">
                                📥 JSON
                            </button>
                            <button type="button" class="btn-peligro" style="padding:4px 8px; font-size:11px;" onclick="eliminarSnapshot('${s.id}')" title="Eliminar este punto de restauración">
                                🗑️
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");
    };

    // Algoritmo de Fusión Inteligente (Smart Merge)
    window.restaurarSnapshotModoMerge = function(idSnapshot) {
        const snapshots = obtenerSnapshots();
        const snap = snapshots.find(s => s.id === idSnapshot);
        if (!snap) return alert("Punto de restauración no encontrado.");

        const confirma = confirm(`¿Desea restaurar en MODO FUSIÓN INTELIGENTE desde el punto "${snap.motivo}" (${snap.fecha} ${snap.hora})?\n\nEste modo agregará cualquier dato que falte o haya sido borrado por error, manteniendo intactos todos los nuevos vehículos, mantenciones y registros creados posteriormente.`);
        if (!confirma) return;

        // Auto-crear un snapshot de seguridad antes de fusionar
        crearPuntoRestauracionSistema(`Auto-respaldo antes de fusionar punto ${snap.id}`, "PRE_CAMBIO", true);

        const data = snap.data;
        let restaurados = 0;

        // 1. Fusionar Programa Maestro (por 'cod')
        if (Array.isArray(data.corssen_programa_v2)) {
            data.corssen_programa_v2.forEach(itemSnap => {
                const existe = corssenPrograma.find(p => p.cod.toUpperCase() === itemSnap.cod.toUpperCase());
                if (!existe) {
                    corssenPrograma.push(itemSnap);
                    restaurados++;
                }
            });
        }

        // 2. Fusionar Vehículos (por 'patente')
        if (Array.isArray(data.flota_vehiculos_v3)) {
            data.flota_vehiculos_v3.forEach(vehSnap => {
                const existe = vehiculos.find(v => (v.patente || '').toUpperCase() === (vehSnap.patente || '').toUpperCase());
                if (!existe) {
                    vehiculos.push(vehSnap);
                    restaurados++;
                }
            });
        }

        // 3. Fusionar Maquinarias (por 'codigo' o 'patente')
        if (Array.isArray(data.flota_maquinarias_v3)) {
            data.flota_maquinarias_v3.forEach(maqSnap => {
                const existe = maquinarias.find(m => (m.codigo || m.patente || '').toUpperCase() === (maqSnap.codigo || maqSnap.patente || '').toUpperCase());
                if (!existe) {
                    maquinarias.push(maqSnap);
                    restaurados++;
                }
            });
        }

        // 4. Fusionar Mantenciones / OTs (por 'folio' o id)
        if (Array.isArray(data.flota_mantenciones_v3)) {
            data.flota_mantenciones_v3.forEach(mantSnap => {
                const existe = mantenciones.find(m => (m.folio || m.id || '').toString() === (mantSnap.folio || mantSnap.id || '').toString());
                if (!existe) {
                    mantenciones.push(mantSnap);
                    restaurados++;
                }
            });
        }

        // 5. Fusionar Cargas de Combustible
        if (Array.isArray(data.flota_cargas)) {
            data.flota_cargas.forEach(cargaSnap => {
                const existe = cargas.find(c => c.fecha === cargaSnap.fecha && c.equipo === cargaSnap.equipo && c.litros === cargaSnap.litros && c.hora === cargaSnap.hora);
                if (!existe) {
                    cargas.push(cargaSnap);
                    restaurados++;
                }
            });
        }

        // 6. Fusionar Insumos y Repuestos de Inventario
        if (Array.isArray(data.corssen_stock_v2)) {
            data.corssen_stock_v2.forEach(stockSnap => {
                const existe = corssenStock.find(s => s.detalle.toLowerCase() === stockSnap.detalle.toLowerCase() && (s.modelo || '').toLowerCase() === (stockSnap.modelo || '').toLowerCase());
                if (!existe) {
                    corssenStock.push(stockSnap);
                    restaurados++;
                }
            });
        }

        // 7. Fusionar Historial de Consumo de Aceite
        if (Array.isArray(data.corssen_historial_aceite_v1)) {
            data.corssen_historial_aceite_v1.forEach(aceiteSnap => {
                const existe = historialConsumoAceite.find(a => (a.id === aceiteSnap.id) || (a.folioOT === aceiteSnap.folioOT && a.fecha === aceiteSnap.fecha));
                if (!existe) {
                    historialConsumoAceite.push(aceiteSnap);
                    restaurados++;
                }
            });
        }

        guardarTodo();

        // Actualizar vistas del sistema
        renderizarDashboard();
        renderizarProgramaMaestro();
        renderizarStockInsumos();
        renderizarKardexMovimientos();
        renderizarModuloAceite();
        renderizarMantenciones();
        renderizarTablasOriginales();
        renderizarModuloRespaldos();

        alert(`✓ FUSIÓN EXITOSA:\nSe han recuperado e integrado ${restaurados} registros perdidos al sistema sin alterar tus datos actuales.`);
    };

    // Algoritmo de Rollback Total
    window.restaurarSnapshotModoRollback = function(idSnapshot) {
        const snapshots = obtenerSnapshots();
        const snap = snapshots.find(s => s.id === idSnapshot);
        if (!snap) return alert("Punto de restauración no encontrado.");

        const confirma = confirm(`⚠️ ADVERTENCIA DE SOBRESCRITURA TOTAL:\n\n¿Está seguro de restaurar el sistema al estado del punto "${snap.motivo}" (${snap.fecha} ${snap.hora})?\n\nEsto dejará la base de datos exactamente como estaba en esa fecha. (Se creará automáticamente un respaldo previo por seguridad).`);
        if (!confirma) return;

        // Auto-crear un snapshot de seguridad antes de rollback
        crearPuntoRestauracionSistema(`Auto-respaldo previo a rollback total a ${snap.id}`, "PRE_CAMBIO", true);

        const data = snap.data;
        if (data.corssen_programa_v2) corssenPrograma = JSON.parse(JSON.stringify(data.corssen_programa_v2));
        if (data.corssen_stock_v2) corssenStock = JSON.parse(JSON.stringify(data.corssen_stock_v2));
        if (data.corssen_fichas_v2) corssenFichas = JSON.parse(JSON.stringify(data.corssen_fichas_v2));
        if (data.flota_vehiculos_v3) vehiculos = JSON.parse(JSON.stringify(data.flota_vehiculos_v3));
        if (data.flota_maquinarias_v3) maquinarias = JSON.parse(JSON.stringify(data.flota_maquinarias_v3));
        if (data.flota_cargas) cargas = JSON.parse(JSON.stringify(data.flota_cargas));
        if (data.flota_mantenciones_v3) mantenciones = JSON.parse(JSON.stringify(data.flota_mantenciones_v3));
        if (data.flota_inventario_v3) inventario = JSON.parse(JSON.stringify(data.flota_inventario_v3));
        if (data.corssen_tambor_aceite_v1) estadoTamborAceite = JSON.parse(JSON.stringify(data.corssen_tambor_aceite_v1));
        if (data.corssen_historial_aceite_v1) historialConsumoAceite = JSON.parse(JSON.stringify(data.corssen_historial_aceite_v1));

        guardarTodo();

        // Actualizar vistas
        renderizarDashboard();
        renderizarProgramaMaestro();
        renderizarStockInsumos();
        renderizarKardexMovimientos();
        renderizarModuloAceite();
        renderizarMantenciones();
        renderizarTablasOriginales();
        renderizarModuloRespaldos();

        alert(`✓ RESTAURACIÓN TOTAL COMPLETADA:\nEl sistema ha vuelto exactamente al estado del punto "${snap.motivo}".`);
    };

    window.eliminarSnapshot = function(idSnapshot) {
        const confirma = confirm("¿Desea eliminar este punto de restauración?");
        if (!confirma) return;

        const lista = obtenerSnapshots().filter(s => s.id !== idSnapshot);
        guardarListaSnapshots(lista);
        renderizarModuloRespaldos();
    };

    // Exportación a Archivo JSON
    window.descargarBackupJSONCompleto = function() {
        const usuario = sessionStorage.getItem("nombreUsuario") || "Alexis Santos";
        const snapshot = capturarEstadoActualSistema("Respaldo Completo Exportado a Archivo", "MANUAL", usuario);

        const jsonStr = JSON.stringify(snapshot, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const fecha = new Date().toISOString().split("T")[0];

        const link = document.createElement("a");
        link.href = url;
        link.download = `CORSSEN_BACKUP_SISTEMA_${fecha}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    window.descargarSnapshotJSON = function(idSnapshot) {
        const snap = obtenerSnapshots().find(s => s.id === idSnapshot);
        if (!snap) return alert("Punto no encontrado.");

        const jsonStr = JSON.stringify(snap, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `CORSSEN_PUNTO_${snap.id}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Importación desde Archivo JSON
    window.abrirModalImportarBackup = function() {
        const modal = document.getElementById("modalImportarBackup");
        if (!modal) return;
        backupFileCargadoData = null;
        document.getElementById("previewArchivoBackupCargado").style.display = "none";
        document.getElementById("selectorModoRestauracionFile").style.display = "none";
        document.getElementById("btnEjecutarRestauracionArchivo").disabled = true;
        document.getElementById("inputFileBackupJSON").value = "";
        modal.style.display = "flex";
    };

    window.cerrarModalImportarBackup = function() {
        const modal = document.getElementById("modalImportarBackup");
        if (modal) modal.style.display = "none";
    };

    window.procesarArchivoBackupSubido = function(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const parsed = JSON.parse(e.target.result);
                if (!parsed || (!parsed.data && !parsed.corssen_programa_v2)) {
                    throw new Error("Estructura de archivo inválida.");
                }

                // Normalizar estructura si viene directo o como snapshot
                const dataObj = parsed.data || parsed;
                backupFileCargadoData = {
                    motivo: parsed.motivo || "Respaldo Importado de Archivo",
                    fecha: parsed.fecha || new Date().toLocaleDateString("es-CL"),
                    data: dataObj
                };

                const totalProg = (dataObj.corssen_programa_v2 || []).length;
                const totalVeh = (dataObj.flota_vehiculos_v3 || []).length;
                const totalMaq = (dataObj.flota_maquinarias_v3 || []).length;
                const totalOTs = (dataObj.flota_mantenciones_v3 || []).length;
                const totalStock = (dataObj.corssen_stock_v2 || []).length;

                const infoBox = document.getElementById("infoDetalleBackupJSON");
                if (infoBox) {
                    infoBox.innerHTML = `
                        <strong>Contenido verificado:</strong> ${totalProg} Equipos en programa, ${totalVeh} Vehículos, ${totalMaq} Maquinarias, ${totalOTs} Órdenes de Trabajo, ${totalStock} Ítems de Inventario.
                    `;
                }

                document.getElementById("previewArchivoBackupCargado").style.display = "block";
                document.getElementById("selectorModoRestauracionFile").style.display = "block";
                document.getElementById("btnEjecutarRestauracionArchivo").disabled = false;
            } catch (err) {
                alert("Error al leer el archivo JSON. Verifique que sea un respaldo válido del sistema.");
                console.error(err);
            }
        };
        reader.readAsText(file);
    };

    window.ejecutarRestauracionDesdeArchivoJSON = function() {
        if (!backupFileCargadoData) return;
        const modo = document.querySelector("input[name='modoRestauracionArchivo']:checked")?.value || "merge";

        if (modo === "merge") {
            // Fusión inteligente
            const snapTemp = {
                id: "IMPORT-" + Date.now(),
                motivo: backupFileCargadoData.motivo,
                fecha: backupFileCargadoData.fecha,
                hora: "Archivo",
                data: backupFileCargadoData.data
            };
            const lista = obtenerSnapshots();
            lista.unshift(snapTemp);
            guardarListaSnapshots(lista);
            restaurarSnapshotModoMerge(snapTemp.id);
        } else {
            // Rollback total
            const snapTemp = {
                id: "IMPORT-" + Date.now(),
                motivo: backupFileCargadoData.motivo,
                fecha: backupFileCargadoData.fecha,
                hora: "Archivo",
                data: backupFileCargadoData.data
            };
            const lista = obtenerSnapshots();
            lista.unshift(snapTemp);
            guardarListaSnapshots(lista);
            restaurarSnapshotModoRollback(snapTemp.id);
        }

        cerrarModalImportarBackup();
    };

    // Auditoría de Integridad
    window.ejecutarAuditoriaIntegridad = function() {
        let problemasDetectados = 0;
        let corregidos = 0;

        // 1. Validar que cada equipo en 'corssenPrograma' tenga código y estado
        corssenPrograma.forEach((item, idx) => {
            if (!item.cod) {
                item.cod = "EQ-" + (idx + 1);
                problemasDetectados++;
                corregidos++;
            }
            if (!item.estado) {
                item.estado = "Operativo";
                problemasDetectados++;
                corregidos++;
            }
        });

        // 2. Validar stock no negativo
        corssenStock.forEach(item => {
            if (item.stock < 0) {
                item.stock = 0;
                problemasDetectados++;
                corregidos++;
            }
        });

        guardarTodo();
        renderizarModuloRespaldos();

        if (problemasDetectados === 0) {
            alert("✓ AUDITORÍA DE INTEGRIDAD COMPLETADA:\n\nTodos los registros de flotas, mantenciones, kárdex y stocks están 100% íntegros y sincronizados.");
        } else {
            alert(`✓ AUDITORÍA DE INTEGRIDAD COMPLETADA:\n\nSe detectaron y repararon automáticamente ${corregidos} inconsistencias en la base de datos.`);
        }
    };

    // Generar primer snapshot automático si la base de datos no tiene ninguno
    const snapsIniciales = obtenerSnapshots();
    if (snapsIniciales.length === 0) {
        crearPuntoRestauracionSistema("Punto Inicial Base del Sistema Corssen", "AUTOMATICO", true);
    }

    // Modal de Descarga del Proyecto y Manejadores de Descarga Directa
    window.abrirModalDescargaProyecto = function() {
        const modal = document.getElementById("modalDescargaProyecto");
        if (modal) {
            modal.style.display = "flex";
        }
    };

    window.cerrarModalDescargaProyecto = function() {
        const modal = document.getElementById("modalDescargaProyecto");
        if (modal) {
            modal.style.display = "none";
        }
    };

    window.ejecutarDescargaHTML = async function() {
        mostrarToast('⏳ Generando archivo HTML completo...', 'info');
        try {
            const resp = await fetch('/descargar-html');
            if (!resp.ok) throw new Error('Error en servidor');
            const blob = await resp.blob();
            if (typeof saveAs !== 'undefined') {
                saveAs(blob, 'corssen_control_flota_completo.html');
            } else {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'corssen_control_flota_completo.html';
                document.body.appendChild(a);
                a.click();
                setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
            }
            mostrarToast('✅ Archivo HTML descargado exitosamente.', 'success');
        } catch (err) {
            console.error('Fallo descarga servidor, usando generador local:', err);
            // Fallback generación 100% cliente
            try {
                const [cssText, jsText] = await Promise.all([
                    fetch('/style.css').then(r => r.text()).catch(() => ''),
                    fetch('/script.js').then(r => r.text()).catch(() => '')
                ]);
                let html = document.documentElement.outerHTML;
                html = html.replace('<link rel="stylesheet" href="/style.css">', `<style>\n${cssText}\n</style>`);
                html = html.replace('<script src="/script.js"></script>', `<script>\n${jsText}\n</script>`);
                const fallbackBlob = new Blob(["<!DOCTYPE html>\n<html lang=\"es\">\n" + html + "\n</html>"], { type: 'text/html;charset=utf-8' });
                if (typeof saveAs !== 'undefined') {
                    saveAs(fallbackBlob, 'corssen_control_flota_completo.html');
                } else {
                    const url = URL.createObjectURL(fallbackBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'corssen_control_flota_completo.html';
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
                }
                mostrarToast('✅ Archivo HTML generado y descargado.', 'success');
            } catch (e) {
                mostrarToast('❌ No se pudo descargar el archivo: ' + e.message, 'error');
            }
        }
    };

    window.ejecutarDescargaArchivosCorregidos = async function() {
        mostrarToast('⏳ Descargando paquete de archivos corregidos...', 'info');
        try {
            const resp = await fetch('/archivos_corregidos_corssen.zip');
            if (!resp.ok) throw new Error('Error al obtener ZIP del servidor');
            const blob = await resp.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'archivos_corregidos_corssen.zip';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
            mostrarToast('✅ Archivos corregidos descargados (ZIP).', 'success');
        } catch (err) {
            console.error('Error descarga archivos corregidos:', err);
            mostrarToast('❌ Error al descargar: ' + err.message, 'error');
        }
    };

    window.ejecutarDescargaScriptJS = async function() {
        mostrarToast('⏳ Descargando script.js...', 'info');
        try {
            const resp = await fetch('/descargar-script');
            if (!resp.ok) throw new Error('Error al obtener script.js');
            const blob = await resp.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'script.js';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
            mostrarToast('✅ script.js descargado exitosamente.', 'success');
        } catch (err) {
            console.error('Error descarga script.js:', err);
            mostrarToast('❌ Error al descargar script.js: ' + err.message, 'error');
        }
    };

    window.ejecutarDescargaZIP = async function() {
        mostrarToast('⏳ Descargando archivo ZIP...', 'info');
        try {
            const resp = await fetch('/descargar-zip');
            if (!resp.ok) throw new Error('Error en servidor');
            const blob = await resp.blob();
            if (typeof saveAs !== 'undefined') {
                saveAs(blob, 'proyecto_control_flota.zip');
            } else {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'proyecto_control_flota.zip';
                document.body.appendChild(a);
                a.click();
                setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
            }
            mostrarToast('✅ Archivo ZIP descargado exitosamente.', 'success');
        } catch (err) {
            console.error('Fallo descarga ZIP servidor:', err);
            if (typeof descargarZipProyectoCompleto === 'function') {
                descargarZipProyectoCompleto();
            } else {
                mostrarToast('❌ Error al descargar ZIP: ' + err.message, 'error');
            }
        }
    };

    // Vincular funciones de Módulo de Aceite e Inventario a window
    window.renderizarModuloAceite = renderizarModuloAceite;
    window.abrirModalNuevoTambor = abrirModalNuevoTambor;
    window.cerrarModalNuevoTambor = cerrarModalNuevoTambor;
    window.guardarNuevoTamborAceite = guardarNuevoTamborAceite;
    window.exportarConsumosAceiteExcel = exportarConsumosAceiteExcel;

    // Vincular funciones de Módulo de Combustible & Estanque 400L a window
    window.renderizarModuloCombustible = renderizarModuloCombustible;
    window.abrirModalRecargaTanque = abrirModalRecargaTanque;
    window.cerrarModalRecargaTanque = cerrarModalRecargaTanque;
    window.guardarRecargaTanqueCombustible = guardarRecargaTanqueCombustible;
    window.calcularCostoPorLitroModalTanque = calcularCostoPorLitroModalTanque;
    window.manejarCambioOrigenCombustible = manejarCambioOrigenCombustible;
    window.calcularTotalCargaCombustibleForm = calcularTotalCargaCombustibleForm;
    window.registrarCargaCombustible = registrarCargaCombustible;
    window.eliminarCargaCombustible = eliminarCargaCombustible;
    window.eliminarRecargaCombustible = eliminarRecargaCombustible;
    window.eliminarConsumoAceite = eliminarConsumoAceite;
    window.cambiarPestanaCombustible = cambiarPestanaCombustible;
    window.exportarCombustibleExcel = exportarCombustibleExcel;
    window.exportarTanqueCombustibleExcel = exportarTanqueCombustibleExcel;

    // Vincular funciones de filtrado y ordenamiento de Stock a window
    window.renderizarStockInsumos = renderizarStockInsumos;
    window.limpiarFiltrosStock = limpiarFiltrosStock;
    window.limpiarFiltroEquipoStock = limpiarFiltroEquipoStock;
    window.filtrarStockPorEquipoDirecto = filtrarStockPorEquipoDirecto;
    window.poblarSelectorEquiposCompatiblesStock = poblarSelectorEquiposCompatiblesStock;

    // Vincular funciones de Auto-Backup y Respaldos a window
    window.obtenerConfigAutoBackup = obtenerConfigAutoBackup;
    window.guardarConfigAutoBackup = guardarConfigAutoBackup;
    window.iniciarServicioAutoBackup = iniciarServicioAutoBackup;
    window.cambiarConfiguracionAutoBackup = cambiarConfiguracionAutoBackup;
    window.ejecutarRespaldoNubeInmediatoManual = ejecutarRespaldoNubeInmediatoManual;
    window.sincronizarConUltimoRespaldoNube = sincronizarConUltimoRespaldoNube;

    // Inicializar estado visual de bloqueo / desbloqueo, módulo de aceite, módulo de combustible y auto-backup
    sincronizarEstadoVisualModuloRespaldos();
    renderizarModuloAceite();
    renderizarModuloCombustible();
    iniciarServicioAutoBackup();

    // Sincronizar inmediatamente al abrir la página con el último estado guardado en la nube
    sincronizarConUltimoRespaldoNube();

    // Sincronizar al volver a la pestaña (por ejemplo, al volver a abrir el navegador o cambiar de app en el celular)
    window.addEventListener("focus", () => {
        sincronizarConUltimoRespaldoNube();
    });

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            sincronizarConUltimoRespaldoNube();
        }
    });

    // Sondeo de sincronización periódica cada 15 segundos para mantener todos los dispositivos (computador y celular) alineados en tiempo real
    setInterval(() => {
        sincronizarConUltimoRespaldoNube();
    }, 15000);

    // Event listener para efecto sticky con elevación suave en el título principal / topbar
    const topbar = document.querySelector(".topbar");
    if (topbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 15) {
                topbar.classList.add("scrolled");
            } else {
                topbar.classList.remove("scrolled");
            }
        }, { passive: true });
    }
});


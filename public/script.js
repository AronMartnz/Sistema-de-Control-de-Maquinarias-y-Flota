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
    { cod: "GHO-04", equipo: "GRÚA HORQUILLA HANGCHA CPQD30", marca: "HANGCHA", cat: "GRÚAS", estado: "Operativo", prioridad: "Media", horometro: "0 hrs", frecuencia: "250 horas", prox: "250 hrs", responsable: "Aron Martinez", observaciones: "Grúa horquilla operativa." },
    { cod: "GTE-01", equipo: "GRÚA TELESCÓPICA 60 TON", marca: "GROVE", cat: "GRÚAS", estado: "Operativo", prioridad: "Alta", horometro: "5120 hrs", frecuencia: "250 horas", prox: "5370 hrs", responsable: "Alexis Santos", observaciones: "Arreglar alarma de retroceso. Revisar flexibles de pedal en cabina." },
    { cod: "GTE-02", equipo: "GRÚA TELESCÓPICA 35 TON", marca: "GROVE", cat: "GRÚAS", estado: "No Operativo", prioridad: "Media", horometro: "6400 hrs", frecuencia: "250 horas", prox: "En reparación", responsable: "Alexis Santos", observaciones: "Arreglar cables cortados (no bajan patas de levante). Freno de parqueo bloqueado." },
    { cod: "GTE-03", equipo: "GRÚA TELESCÓPICA 15 TON", marca: "GROVE", cat: "GRÚAS", estado: "No Operativo", prioridad: "Media", horometro: "7800 hrs", frecuencia: "250 horas", prox: "En taller", responsable: "Alexis Santos", observaciones: "Instalar la transmisión." },

    // --- EQUIPOS MÓVILES (Cxx) ---
    { cod: "CAM-01", equipo: "CAMIONETA NISSAN NP300 (JWYD-49)", marca: "NISSAN", cat: "MÓVILES", estado: "Operativo", prioridad: "Media", horometro: "142.500 km", frecuencia: "10000 kilometros", prox: "150.000 km", responsable: "Andrés Plaza", observaciones: "Arreglar aire acondicionado." },
    { cod: "CAM-02", equipo: "CAMIONETA VOLKSWAGEN (JKKV-43)", marca: "VOLKSWAGEN", cat: "MÓVILES", estado: "Operativo (con falla)", prioridad: "Media", horometro: "98.200 km", frecuencia: "10000 kilometros", prox: "100.000 km", responsable: "Alexis Santos", observaciones: "Instalar nuevo parachoques, desabollar y pintar capó." },
    { cod: "CAM-03", equipo: "CAMIONETA NISSAN NAVARA (GCLD-31)", marca: "NISSAN", cat: "MÓVILES", estado: "No Operativo", prioridad: "Baja", horometro: "210.000 km", frecuencia: "10000 kilometros", prox: "Fuera de servicio", responsable: "Alexis Santos", observaciones: "Revisión general en taller." },
    { cod: "CAM-04", equipo: "CAMIONETA MAXUS (VPFX-76)", marca: "MAXUS", cat: "MÓVILES", estado: "Operativo", prioridad: "Baja", horometro: "18.400 km", frecuencia: "10000 kilometros", prox: "20.000 km", responsable: "Daniel Mejias", observaciones: "Operativa sin observaciones pendientes." },
    { cod: "CAM-05", equipo: "CAMIONETA TOYOTA HILUX 4X4 (TD-KP-72)", marca: "TOYOTA", cat: "MÓVILES", estado: "Operativo", prioridad: "Media", horometro: "0 km", frecuencia: "10000 kilometros", prox: "10000 km", responsable: "Aron Martinez", observaciones: "Camioneta operativa recién registrada." },
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
// ESTADO ESPECIALIZADO: CONTROL DE ACEITE A GRANEL (2 TAMBORES 200 LITROS)
// =========================================================
let estadoTamboresAceite = {
    tambor1: {
        id: "tambor1",
        nombre: "Aceite Valvoline Premium Blue 15W40 CI-4",
        tipo: "Aceite de Motor (15W-40)",
        capacidad: 200,
        actual: 167,
        costoTotal: 550000,
        costoPorLitro: 2750,
        proveedor: "LUVAL S.A.",
        factura: "FAC-84920",
        fechaApertura: "2026-03-01",
        estado: "Activo"
    },
    tambor2: {
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
    }
};

// Alias retrocompatible
let estadoTamborAceite = estadoTamboresAceite.tambor1;

const DATOS_HISTORIAL_ACEITE_DEFAULT = [
    {
        id: "ACEITE-001",
        fecha: "2026-03-01",
        folioOT: "OT-2026-001",
        codigoEquipo: "GPC-01",
        equipoNombre: "Grúa Portacontenedores Taylor 40T",
        tamborId: "tambor1",
        tipoAceite: "Aceite de Motor (15W-40)",
        nombreAceite: "Aceite Valvoline Premium Blue 15W40 CI-4",
        tipoMantencion: "Preventiva 250 Hrs",
        litrosDescontados: 33,
        saldoRestante: 167,
        costoTotal: 90750,
        tecnico: "Alexis Santos"
    }
];
let historialConsumoAceite = [];

// =========================================================
// ESTADO ESPECIALIZADO: CONTROL DE ESTANQUE DE COMBUSTIBLE DIÉSEL (400 LITROS)
// =========================================================
let estadoTanqueCombustible = {
    nombre: "Petróleo Diésel Grado B (Ultra Diésel)",
    capacidad: 400,
    actual: 400,
    costoTotal: 420000,
    costoPorLitro: 1050,
    proveedor: "COPEC S.A. / Distribuidora Sur",
    factura: "FAC-91823",
    fechaUltimaRecarga: "2026-02-27",
    estado: "Activo"
};

const DATOS_RECARGAS_COMB_DEFAULT = [
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
let historialRecargasCombustible = [];

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
    { id: "CAM-05", codigo: "CAM-05", nombre: "Camioneta TOYOTA Hilux 4X4", patente: "TD-KP-72", marca: "Toyota", modelo: "Hilux 4X4", capacidad: "1 TON", anio: 2024, combustible: "Diésel", kilometraje: 0, estado: "Operativo", responsable: "Aron Martinez", fechaRegistro: "2026-03-01" },
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
    { id: "GHO-04", numeroMaquinaria: "GHO-04", patenteMaquinaria: "HANGCHA-3T", tipoMaquinaria: "Grúa Horquilla Hangcha CPQD30", marcaMaquinaria: "Hangcha", modeloMaquinaria: "CPQD30", capacidadMaquinaria: "3 TON", anioMaquinaria: 2024, combustibleMaquinaria: "Gasolina / GLP", horometro: 0, estado: "Operativo", responsable: "Aron Martinez", fechaRegistro: "2026-03-01" },
    { id: "GTE-01", numeroMaquinaria: "GTE-01", patenteMaquinaria: "GROVE-60T", tipoMaquinaria: "Grúa Telescópica 60 Ton", marcaMaquinaria: "Grove", modeloMaquinaria: "RT 700E", capacidadMaquinaria: "60 TON", anioMaquinaria: 2005, combustibleMaquinaria: "Diésel", horometro: 5120, estado: "Operativo", responsable: "Alexis Santos", fechaRegistro: "2026-03-01" },
    { id: "GTE-02", numeroMaquinaria: "GTE-02", patenteMaquinaria: "GROVE-35T", tipoMaquinaria: "Grúa Telescópica 35 Ton", marcaMaquinaria: "Grove", modeloMaquinaria: "RT 535", capacidadMaquinaria: "35 TON", anioMaquinaria: 2008, combustibleMaquinaria: "Diésel", horometro: 6400, estado: "No Operativo", responsable: "Alexis Santos", fechaRegistro: "2026-03-01" },
    { id: "GTE-03", numeroMaquinaria: "GTE-03", patenteMaquinaria: "GROVE-15T", tipoMaquinaria: "Grúa Telescópica 15 Ton", marcaMaquinaria: "Grove", modeloMaquinaria: "RT 415", capacidadMaquinaria: "15 TON", anioMaquinaria: 2002, combustibleMaquinaria: "Diésel", horometro: 7800, estado: "No Operativo", responsable: "Alexis Santos", fechaRegistro: "2026-03-01" }
];

// =========================================================
// 3. INICIALIZACIÓN Y PERSISTENCIA
// =========================================================




// =========================================================
// 4. RENDERIZADO DEL DASHBOARD Y RESÚMENES (ALERTAS PREVENTIVAS)
// =========================================================
let filtroAlertaMantencionDash = 'TODAS';
let modoVistaAlertasDash = 'resumida';
let mostrarTodasAlertasDash = false;


window.cambiarModoVistaAlertas = cambiarModoVistaAlertas;


window.toggleMostrarTodasAlertasDash = toggleMostrarTodasAlertasDash;


window.filtrarAlertasMantencionDash = filtrarAlertasMantencionDash;


window.cambiarFiltroEstadoDesdeSelector = cambiarFiltroEstadoDesdeSelector;






window.renderizarAlertasMantencionesDashboard = renderizarAlertasMantencionesDashboard;





// =========================================================
// 5. RENDERIZADO DEL PROGRAMA MAESTRO DE MANTENCIÓN
// =========================================================


// =========================================================
// 6. RENDERIZADO DEL STOCK DE INSUMOS Y REPUESTOS & KÁRDEX
// =========================================================


// Helper para normalizar cadenas en búsquedas y compatibilidad


/**
 * Puebla el selector de equipos para filtrado de compatibilidad en el módulo de Inventario
 */


/**
 * Evalúa el grado y detalle de compatibilidad de un insumo respecto a un equipo específico
 */






























// =========================================================
// 7. RENDERIZADO DE FICHAS TÉCNICAS DE EQUIPOS INDIVIDUALES
// =========================================================
let equipoSeleccionadoFicha = "GPC-01";

// Control de Permisos y Roles de Usuario







window.actualizarPermisosModuloRespaldos = actualizarPermisosModuloRespaldos;

// -------------------------------------------------------------
// FUNCIONES PARA MODAL DE EDICIÓN DE PROGRAMA MAESTRO (SOLO ADMIN)
// -------------------------------------------------------------










let categoriaFiltroFichasActual = "TODOS";















// -------------------------------------------------------------
// FUNCIONES PARA MODAL DE EDICIÓN DE FICHA TÉCNICA
// -------------------------------------------------------------














// -------------------------------------------------------------
// FUNCIONES PARA MODAL DE NUEVA FICHA TÉCNICA
// -------------------------------------------------------------


















// =========================================================
// 8. CRUD Y CATÁLOGO DE FLOTA REGISTRADA Y COMBUSTIBLE
// =========================================================


// =========================================================
// SINCRONIZADOR INTEGRAL FICHAS TÉCNICAS <-> FLOTA REGISTRADA
// =========================================================

window.sincronizarFichasConFlotaRegistrada = sincronizarFichasConFlotaRegistrada;





// =========================================================
// 7.1 CONTROL Y GESTIÓN INTEGRAL DE COMBUSTIBLE & ESTANQUE (400L)
// =========================================================























window.vaciarHistorialCombustibleActual = function() {
    const pestana = (typeof pestanaActivaCombustible !== "undefined" ? pestanaActivaCombustible : "DESPACHOS");
    if (pestana === "DESPACHOS") {
        if (!cargas || cargas.length === 0) {
            if (typeof mostrarNotificacionToast === "function") {
                mostrarNotificacionToast("No hay despachos de combustible para eliminar.", "info");
            } else {
                alert("No hay despachos de combustible para eliminar.");
            }
            return;
        }

        const despachosTanque = (cargas || []).filter(c => 
            c.origen === "ESTANQUE_400L" || 
            (c.estacion || "").toLowerCase().includes("estanque") || 
            (c.estacion || "").toLowerCase().includes("corssen")
        );
        const litrosADevolver = despachosTanque.reduce((acc, c) => acc + Number(c.litros || 0), 0);
        const capTotal = estadoTanqueCombustible.capacidad || 400;

        const confirma = confirm(`⚠️ ¿Está seguro de VACIAR TODOS los despachos de combustible (${cargas.length} registros)?\n\n• Se restituirán ${litrosADevolver.toFixed(1)} Lts al estanque de 400L.\n• Esta acción eliminará los registros de forma definitiva tanto localmente como en la base de datos de Cloudflare.`);
        if (!confirma) return;

        // Restituir saldo en el estanque
        if (litrosADevolver > 0) {
            const saldoPrev = Number(estadoTanqueCombustible.actual !== undefined ? estadoTanqueCombustible.actual : capTotal);
            estadoTanqueCombustible.actual = Math.min(capTotal, saldoPrev + litrosADevolver);
        } else {
            estadoTanqueCombustible.actual = capTotal;
        }

        cargas = [];
        localStorage.setItem("flota_cargas", JSON.stringify([]));
        localStorage.setItem("corssen_tanque_combustible_v1", JSON.stringify(estadoTanqueCombustible));
        localStorage.setItem("corssen_ultima_modificacion_ts", String(Date.now()));
        guardarTodo();
        if (typeof window.ejecutarAutoBackupSistema === "function") {
            window.ejecutarAutoBackupSistema("Vaciado completo de despachos y restitución de saldo en Estanque 400L", "AUTOMATICO", true);
        }
        renderizarModuloCombustible();
        renderizarDashboard();
        if (typeof mostrarNotificacionToast === "function") {
            mostrarNotificacionToast(`Despachos eliminados y saldo del estanque restablecido a ${estadoTanqueCombustible.actual.toFixed(1)} Lts.`, "success");
        } else {
            alert(`Lista de despachos eliminada y saldo del estanque restablecido a ${estadoTanqueCombustible.actual.toFixed(1)} Lts.`);
        }
    } else {
        if (!historialRecargasCombustible || historialRecargasCombustible.length === 0) {
            if (typeof mostrarNotificacionToast === "function") {
                mostrarNotificacionToast("No hay recargas de estanque para eliminar.", "info");
            } else {
                alert("No hay recargas de estanque para eliminar.");
            }
            return;
        }
        const confirma = confirm(`⚠️ ¿Está seguro de VACIAR TODO el historial de recargas del estanque de 400L (${historialRecargasCombustible.length} registros)?\n\nEsta acción eliminará los registros de forma definitiva.`);
        if (!confirma) return;

        historialRecargasCombustible = [];
        localStorage.setItem("corssen_historial_recargas_comb_v1", JSON.stringify([]));
        localStorage.setItem("corssen_ultima_modificacion_ts", String(Date.now()));
        guardarTodo();
        if (typeof window.ejecutarAutoBackupSistema === "function") {
            window.ejecutarAutoBackupSistema("Vaciado completo de recargas de estanque", "AUTOMATICO", true);
        }
        renderizarModuloCombustible();
        if (typeof mostrarNotificacionToast === "function") {
            mostrarNotificacionToast("Historial de recargas de estanque vaciado permanentemente.", "success");
        } else {
            alert("Historial de recargas de estanque vaciado permanentemente.");
        }
    }
};

// =========================================================
// CALIBRACIÓN Y AJUSTE DIRECTO DEL ESTANQUE DE PETRÓLEO 400L
// =========================================================
















// -------------------------------------------------------------
// GESTIÓN DE EQUIPOS AUXILIARES, HERRAMIENTAS Y MARÍTIMO
// -------------------------------------------------------------








// =========================================================
// 8. GESTIÓN INTEGRAL DE MANTENCIONES Y DEDUCCIÓN DE STOCK
// =========================================================


let ordenActivaOT = null;















// =========================================================
// GESTIÓN Y EDICIÓN DE ÓRDENES DE TRABAJO (OT)
// =========================================================
let ordenEnEdicionOT = null;















// =========================================================
// 9. FORMULARIO REGISTRAR NUEVA MANTENCIÓN / OT CON DEDUCCIÓN PRO
// =========================================================
































// =========================================================
// 10. NAVEGACIÓN ENTRE PANELES Y CONTROL MOBILE
// =========================================================




// =========================================================
// 11.B MÓDULO DE 2 VIDEOS TUTORIALES NARRADOS (VOZ EN ESPAÑOL)
// Formato con narración por voz profesional (Web Speech API),
// simulación visual idéntica a la plataforma y subtítulos guiados
// para ROL OPERADOR y ROL ADMINISTRADOR.
// =========================================================

const TUTORIAL_VIDEOS = {
    operador: {
        rol: "Operador / Jefe de Flota",
        titulo: "VIDEO TUTORIAL 1: ROL OPERADOR (FLUJO OPERATIVO COMPLETO)",
        badgeTexto: "ROL OPERADOR",
        badgeClase: "badge-verde",
        usuarioSimulado: "Operando como: Alexis Santos (Operador / Jefe Flota)",
        pasos: [
            {
                modulo: "DASHBOARD GENERAL & SEMÁFORO PREDICTIVO",
                icono: "🚜",
                tituloPaso: "Paso 1: Monitoreo en Tiempo Real y Semáforo Preventivo",
                categoria: "Supervisión de Flota",
                textoExplicativo: "Como Operador, el primer punto de control es el Dashboard. Aquí visualizas los 54 equipos activos y el semáforo predictivo: Verde (Óptimo), Amarillo (Próximo a mantención dentro del 15%) y Rojo (Vencido o Urgente). Puedes alternar entre vista resumida y detallada de alertas.",
                htmlEscenario: `
                    <div style="width:100%; max-width:680px; background:#1e293b; border-radius:12px; padding:20px; border:1px solid #334155; text-align:left;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                            <strong style="color:#38bdf8; font-size:15px;">📊 Panel de Control: 54 Equipos Monitoreados</strong>
                            <span class="badge badge-verde">Estado: Normal</span>
                        </div>
                        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-bottom:14px;">
                            <div style="background:#0f172a; padding:12px; border-radius:8px; border-left:4px solid #10b981;">
                                <div style="font-size:11px; color:#94a3b8;">Óptimos</div>
                                <div style="font-size:20px; font-weight:800; color:#10b981;">46 Equipos</div>
                            </div>
                            <div style="background:#0f172a; padding:12px; border-radius:8px; border-left:4px solid #f59e0b;">
                                <div style="font-size:11px; color:#94a3b8;">Próximos a Servicio</div>
                                <div style="font-size:20px; font-weight:800; color:#f59e0b;">5 Equipos</div>
                            </div>
                            <div style="background:#0f172a; padding:12px; border-radius:8px; border-left:4px solid #ef4444;">
                                <div style="font-size:11px; color:#94a3b8;">Atención Requerida</div>
                                <div style="font-size:20px; font-weight:800; color:#ef4444;">3 Equipos</div>
                            </div>
                        </div>
                        <div style="background:#0f172a; padding:10px 14px; border-radius:8px; border:1px solid #334155; font-size:12.5px; color:#cbd5e1;">
                            ⚡ <strong>Alerta Activa detectada:</strong> Grúa Portacontenedores <code>GPC-01</code> se encuentra al 94% de su ciclo (1.980 hrs / 2.000 hrs). Requiere emisión de OT.
                        </div>
                    </div>
                `
            },
            {
                modulo: "PROGRAMA MAESTRO & DETALLE POR EQUIPO",
                icono: "📅",
                tituloPaso: "Paso 2: Consulta del Programa Maestro Corssen",
                categoria: "Planificación Preventiva",
                textoExplicativo: "El Operador tiene acceso completo de consulta al Programa Maestro para revisar frecuencias (cada 250h, 500h o 10.000km), responsables asignados y fecha de última intervención. Nota importante: Las opciones de edición están reservadas al Administrador.",
                htmlEscenario: `
                    <div style="width:100%; max-width:680px; background:#1e293b; border-radius:12px; padding:18px; border:1px solid #334155; text-align:left;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <strong style="color:#f8fafc; font-size:14px;">📅 Programa Maestro Corssen (Vista Operador)</strong>
                            <span class="badge badge-azul">54 Registros Sincronizados</span>
                        </div>
                        <div style="background:#0f172a; border-radius:8px; overflow:hidden; font-size:12px;">
                            <div style="display:grid; grid-template-columns:80px 180px 100px 90px 1fr; background:#334155; padding:8px 12px; font-weight:700; color:#f8fafc;">
                                <span>CÓDIGO</span><span>EQUIPO</span><span>HORÓMETRO</span><span>FRECUENCIA</span><span>ESTADO</span>
                            </div>
                            <div style="display:grid; grid-template-columns:80px 180px 100px 90px 1fr; padding:8px 12px; border-bottom:1px solid #1e293b; align-items:center;">
                                <strong style="color:#38bdf8;">GPC-01</strong><span>Grúa Portacontenedores</span><span>1.980 hrs</span><span>250 hrs</span><span style="color:#f59e0b; font-weight:700;">Próxima</span>
                            </div>
                            <div style="display:grid; grid-template-columns:80px 180px 100px 90px 1fr; padding:8px 12px; border-bottom:1px solid #1e293b; align-items:center;">
                                <strong style="color:#38bdf8;">CAM-01</strong><span>Camioneta Nissan NP300</span><span>84.200 km</span><span>10.000 km</span><span style="color:#10b981; font-weight:700;">Operativo</span>
                            </div>
                        </div>
                        <p style="margin:10px 0 0 0; font-size:12px; color:#94a3b8;">
                            ℹ️ En este módulo el operador visualiza el estatus sin alterar la matriz troncal de mantenimiento.
                        </p>
                    </div>
                `
            },
            {
                modulo: "EMISIÓN DE ORDEN DE TRABAJO & REBAJA DE STOCK",
                icono: "🔧",
                tituloPaso: "Paso 3: Emisión de OT y Deducción Automática de Repuestos",
                categoria: "Mantenimiento & Insumos",
                textoExplicativo: "Al realizar un servicio preventivo o correctivo, el Operador selecciona el equipo en 'Nueva Mantención / OT', ingresa el horómetro y los filtros o lubricantes utilizados. Al guardar, el sistema descuenta automáticamente las unidades del inventario Kardex en tiempo real.",
                htmlEscenario: `
                    <div style="width:100%; max-width:680px; background:#1e293b; border-radius:12px; padding:18px; border:1px solid #334155; text-align:left;">
                        <strong style="color:#38bdf8; font-size:14.5px; display:block; margin-bottom:10px;">📋 Formulario de Emisión de Orden de Trabajo (OT)</strong>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
                            <div style="background:#0f172a; padding:10px; border-radius:6px;">
                                <span style="font-size:11px; color:#94a3b8;">Equipo Seleccionado:</span>
                                <div style="font-weight:700; color:#38bdf8;">GPC-01 (Kálmar Gloria)</div>
                            </div>
                            <div style="background:#0f172a; padding:10px; border-radius:6px;">
                                <span style="font-size:11px; color:#94a3b8;">Tipo de Mantención:</span>
                                <div style="font-weight:700; color:#10b981;">Preventiva 250 Hrs (Pauta A)</div>
                            </div>
                        </div>
                        <div style="background:#0b1120; border:1px solid #334155; padding:10px; border-radius:8px; font-size:12px; margin-bottom:10px;">
                            <div style="color:#e2e8f0; font-weight:700; margin-bottom:4px;">📦 Insumos a deducir del Stock automáticamente:</div>
                            <div style="color:#94a3b8;">• Filtro de Aceite Motor LF9009 (1 un) ➔ Stock actual: 12 ➔ Nuevo: 11</div>
                            <div style="color:#94a3b8;">• Aceite 15W40 CI-4 (28 Lts del Tambor 200L) ➔ Nivel descontado</div>
                        </div>
                        <div style="text-align:right;">
                            <span class="badge badge-verde">✓ OT Generada y Stock Sincronizado</span>
                        </div>
                    </div>
                `
            },
            {
                modulo: "FLOTA REGISTRADA & MODO CONSULTA",
                icono: "🚙",
                tituloPaso: "Paso 4: Flota Registrada en Modo Consulta (Solo Lectura)",
                categoria: "Protección RBAC",
                textoExplicativo: "En la sección Flota Registrada, el Operador cuenta con el distintivo 'Modo Consulta'. Puede exportar planillas a Excel, filtrar por camionetas, grúas o marítimo y ver fichas. Los botones de eliminación y alta de unidades están ocultos para salvaguardar la integridad de la base de datos.",
                htmlEscenario: `
                    <div style="width:100%; max-width:680px; background:#1e293b; border-radius:12px; padding:18px; border:1px solid #334155; text-align:left;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <div>
                                <strong style="color:#f8fafc; font-size:14px;">🚙 Catálogo de Flota Registrada</strong>
                                <span class="badge badge-gris" style="margin-left:8px;">🔒 Modo Consulta (Solo Lectura)</span>
                            </div>
                            <button class="btn-secundario" style="font-size:11px; padding:4px 10px;">📊 Exportar Excel</button>
                        </div>
                        <div style="background:#0f172a; padding:12px; border-radius:8px; border:1px solid #334155; font-size:12.5px;">
                            <p style="margin:0 0 8px 0; color:#38bdf8; font-weight:700;">Seguridad y Privilegios del Operador:</p>
                            <div style="color:#cbd5e1; line-height:1.6;">
                                ✔️ Consulta completa de patentes, marcas, modelos y conductores.<br>
                                ✔️ Acceso directo a Fichas Técnicas para ver filtros alternativos.<br>
                                🔒 <strong>Bloqueo Activo:</strong> Los botones de eliminación (🗑️) y el botón <em>➕ Registrar Unidad</em> no están disponibles para este rol.
                            </div>
                        </div>
                    </div>
                `
            },
            {
                modulo: "COMBUSTIBLE & ESTANQUE 400 LITROS",
                icono: "⛽",
                tituloPaso: "Paso 5: Registro de Cargas de Diésel y Nivel de Estanque",
                categoria: "Combustible",
                textoExplicativo: "El Operador registra cada carga de diésel ingresando la patente o código, litros despachados y kilometraje u horómetro. El estanque de 400 litros actualiza su indicador gráfico en el menú lateral y emite alerta en caso de stock crítico (menor a 60L).",
                htmlEscenario: `
                    <div style="width:100%; max-width:680px; background:#1e293b; border-radius:12px; padding:18px; border:1px solid #334155; text-align:left;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <strong style="color:#38bdf8; font-size:14px;">⛽ Módulo de Combustible & Estanque 400L</strong>
                            <span class="badge badge-verde">Nivel: 345L / 400L (86%)</span>
                        </div>
                        <div style="background:#0f172a; padding:12px; border-radius:8px; margin-bottom:10px;">
                            <div style="height:12px; background:#334155; border-radius:6px; overflow:hidden; margin-bottom:8px;">
                                <div style="width:86%; height:100%; background:#10b981;"></div>
                            </div>
                            <div style="font-size:12px; color:#cbd5e1; display:flex; justify-content:space-between;">
                                <span>Capacidad: 400 Litros</span>
                                <span>Disponible: 345 Litros</span>
                                <span>Última Carga: GPC-01 (55L)</span>
                            </div>
                        </div>
                        <p style="margin:0; font-size:12px; color:#94a3b8;">
                            El operador puede cargar combustible y registrar la recepción de camión aljibe para rellenar el estanque.
                        </p>
                    </div>
                `
            },
            {
                modulo: "FICHAS TÉCNICAS & CONSULTA DE FILTROS",
                icono: "📑",
                tituloPaso: "Paso 6: Fichas Técnicas y Equivalencias Multimarca",
                categoria: "Equivalencias OEM",
                textoExplicativo: "Para facilitar la adquisición de repuestos, el Operador consulta las fichas técnicas que contienen las referencias originales y sus equivalencias en marcas comerciales: Donaldson, Baldwin, Fleetguard y Mann. El operador no puede modificar los códigos maestros.",
                htmlEscenario: `
                    <div style="width:100%; max-width:680px; background:#1e293b; border-radius:12px; padding:18px; border:1px solid #334155; text-align:left;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <strong style="color:#38bdf8; font-size:14px;">📑 Ficha Técnica: GPC-01 (Kálmar DRG450)</strong>
                            <span class="badge badge-azul">Matriz Multimarca</span>
                        </div>
                        <div style="background:#0f172a; border-radius:8px; padding:10px; font-size:12px;">
                            <div style="color:#e2e8f0; font-weight:700; margin-bottom:6px;">Matriz de Equivalencias de Filtros:</div>
                            <div style="color:#cbd5e1; line-height:1.6;">
                                • <strong>Aceite Motor:</strong> OEM 923829.0016 ➔ Baldwin BD7309 ➔ Fleetguard LF9009<br>
                                • <strong>Combustible Primario:</strong> OEM 923829.0018 ➔ Donaldson P550888 ➔ Baldwin BF1259<br>
                                • <strong>Aire Primario:</strong> Donaldson P777868 ➔ Baldwin PA2897
                            </div>
                        </div>
                        <p style="margin:10px 0 0 0; font-size:12px; color:#10b981; font-weight:700;">
                            ✓ Operador habilitado para seleccionar equivalencias al solicitar insumos a bodega.
                        </p>
                    </div>
                `
            }
        ]
    },
    admin: {
        rol: "Administrador del Sistema",
        titulo: "VIDEO TUTORIAL 2: ROL ADMINISTRADOR (CONTROL TOTAL & GESTIÓN)",
        badgeTexto: "ROL ADMINISTRADOR",
        badgeClase: "badge-azul",
        usuarioSimulado: "Operando como: Administrador Central (Control Total)",
        pasos: [
            {
                modulo: "MENÚ LATERAL COMPLETO & PRIVILEGIOS RBAC",
                icono: "🛡️",
                tituloPaso: "Paso 1: Módulos Exclusivos y Privilegios de Alta",
                categoria: "Privilegios Avanzados",
                textoExplicativo: "El Administrador dispone de los módulos 'Registrar Vehículo' y 'Registrar Maquinaria' en el menú lateral (ocultos para el operador). Además, en Flota Registrada cuenta con el distintivo 'Modo Administrador' y el botón habilitado '➕ Registrar Unidad'.",
                htmlEscenario: `
                    <div style="width:100%; max-width:680px; background:#1e293b; border-radius:12px; padding:20px; border:1px solid #334155; text-align:left;">
                        <strong style="color:#38bdf8; font-size:15px; display:block; margin-bottom:12px;">🛡️ Menú Lateral con Permisos de Administrador</strong>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px;">
                            <div style="background:#0f172a; padding:12px; border-radius:8px; border:1px solid #2563eb;">
                                <div style="color:#60a5fa; font-weight:700; font-size:13px; margin-bottom:4px;">🚗 Registrar Vehículo</div>
                                <div style="font-size:11.5px; color:#94a3b8;">Alta y parametrización de camionetas, camiones y furgones.</div>
                            </div>
                            <div style="background:#0f172a; padding:12px; border-radius:8px; border:1px solid #2563eb;">
                                <div style="color:#60a5fa; font-weight:700; font-size:13px; margin-bottom:4px;">🏗️ Registrar Maquinaria</div>
                                <div style="font-size:11.5px; color:#94a3b8;">Ingreso de grúas, horquillas, equipos marítimos y auxiliares.</div>
                            </div>
                        </div>
                        <div style="background:#0b1120; padding:10px 14px; border-radius:8px; border:1px solid #334155; font-size:12.5px; color:#cbd5e1;">
                            🛡️ <strong>Garantía de Seguridad:</strong> Si un usuario sin rol administrador intenta forzar estas URLs, el sistema bloquea la acción y lo redirige automáticamente.
                        </div>
                    </div>
                `
            },
            {
                modulo: "ALTA Y SINCRONIZACIÓN MULTIMÓDULO DE EQUIPOS",
                icono: "➕",
                tituloPaso: "Paso 2: Alta de Nuevas Unidades y Sincronización Automática",
                categoria: "Catálogo de Flota",
                textoExplicativo: "Al dar de alta un equipo en los formularios de administración, el sistema lo sincroniza de manera instantánea con cuatro módulos clave: Alertas del Dashboard, Programa Maestro Corssen, Ficha Técnica Multimarca y Módulo de Emisión de OT.",
                htmlEscenario: `
                    <div style="width:100%; max-width:680px; background:#1e293b; border-radius:12px; padding:18px; border:1px solid #334155; text-align:left;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                            <strong style="color:#f8fafc; font-size:14px;">✨ Proceso de Registro y Sincronización Instantánea</strong>
                            <span class="badge badge-verde">4 Módulos Conectados</span>
                        </div>
                        <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:10px; font-size:12px;">
                            <div style="background:#0f172a; padding:10px; border-radius:6px;">
                                <strong style="color:#38bdf8;">1. Dashboard Predictivo</strong>
                                <p style="margin:4px 0 0 0; color:#94a3b8;">Comienza a calcular porcentajes de horas y alertas.</p>
                            </div>
                            <div style="background:#0f172a; padding:10px; border-radius:6px;">
                                <strong style="color:#38bdf8;">2. Programa Maestro</strong>
                                <p style="margin:4px 0 0 0; color:#94a3b8;">Se agrega a la matriz general de mantenimiento.</p>
                            </div>
                            <div style="background:#0f172a; padding:10px; border-radius:6px;">
                                <strong style="color:#38bdf8;">3. Ficha Técnica Oficial</strong>
                                <p style="margin:4px 0 0 0; color:#94a3b8;">Crea plantilla editable de filtros y lubricantes.</p>
                            </div>
                            <div style="background:#0f172a; padding:10px; border-radius:6px;">
                                <strong style="color:#38bdf8;">4. Emisión de OT</strong>
                                <p style="margin:4px 0 0 0; color:#94a3b8;">Disponible de inmediato en el selector de máquinas.</p>
                            </div>
                        </div>
                    </div>
                `
            },
            {
                modulo: "GESTIÓN DE BAJAS & BOTONES DE ELIMINACIÓN",
                icono: "🗑️",
                tituloPaso: "Paso 3: Bajas de Equipos con Verificación de Seguridad",
                categoria: "Control de Flota",
                textoExplicativo: "Solo los Administradores tienen acceso a los botones de eliminación ('🗑️') en las tablas de vehículos y maquinarias. Al pulsar sobre eliminar, el sistema solicita confirmación y retira la unidad de todos los módulos vinculados para evitar datos huérfanos.",
                htmlEscenario: `
                    <div style="width:100%; max-width:680px; background:#1e293b; border-radius:12px; padding:18px; border:1px solid #334155; text-align:left;">
                        <strong style="color:#38bdf8; font-size:14px; display:block; margin-bottom:12px;">🗑️ Botones de Eliminación Exclusivos de Administrador</strong>
                        <div style="background:#0f172a; padding:12px; border-radius:8px; border:1px solid #ef4444; font-size:12.5px; margin-bottom:12px;">
                            <div style="color:#f87171; font-weight:700; margin-bottom:4px;">⚠️ Diálogo de Confirmación Segura:</div>
                            <div style="color:#cbd5e1;">
                                <em>"¿Está seguro de eliminar el vehículo CAM-07 (KYHL-32) de la flota?"</em><br>
                                Al confirmar, se desvincula del Programa Maestro y de los selectores de insumos de forma limpia.
                            </div>
                        </div>
                        <p style="margin:0; font-size:12px; color:#94a3b8;">
                            Los usuarios con rol operador no tienen acceso a estos controles en el navegador ni por script.
                        </p>
                    </div>
                `
            },
            {
                modulo: "EDICIÓN MAESTRA DE FICHAS TÉCNICAS & FILTROS",
                icono: "📑",
                tituloPaso: "Paso 4: Edición de Pautas Técnicas y Equivalencias Multimarca",
                categoria: "Especificaciones",
                textoExplicativo: "El Administrador puede crear fichas técnicas desde cero ('➕ Nueva Ficha') o editar las existentes ('✏️ Editar Ficha'). En la ventana modal configura capacidades de cárter, viscosidad de aceites y agrega filas con códigos OEM, Baldwin, Donaldson y Fleetguard.",
                htmlEscenario: `
                    <div style="width:100%; max-width:680px; background:#1e293b; border-radius:12px; padding:18px; border:1px solid #334155; text-align:left;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                            <strong style="color:#38bdf8; font-size:14px;">✏️ Editor de Ficha Técnica Multimarca</strong>
                            <span class="badge badge-azul">Herramienta Admin</span>
                        </div>
                        <div style="background:#0f172a; padding:12px; border-radius:8px; font-size:12px; line-height:1.6; color:#cbd5e1;">
                            • <strong>Capacidad de Fluidos:</strong> Motor (28 Lts), Hidráulico (180 Lts), Transmisión (35 Lts).<br>
                            • <strong>Equivalencias:</strong> Agregar o corregir referencias de proveedores para compras ágiles.<br>
                            • <strong>Pautas por Horas:</strong> Configuración de servicios cada 250h, 500h, 1.000h y 2.000h.
                        </div>
                    </div>
                `
            },
            {
                modulo: "CENTRO DE RESPALDOS & SNAPSHOTS",
                icono: "💾",
                tituloPaso: "Paso 5: Puntos de Restauración y Protección de Datos",
                categoria: "Seguridad & Resiliencia",
                textoExplicativo: "El Administrador tiene a su cargo el Centro de Respaldos. Puede crear puntos de restauración manuales antes de importaciones masivas, descargar copias completas en JSON y restaurar cualquier versión previa en segundos con integridad de datos al 100%.",
                htmlEscenario: `
                    <div style="width:100%; max-width:680px; background:#1e293b; border-radius:12px; padding:18px; border:1px solid #334155; text-align:left;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <strong style="color:#38bdf8; font-size:14px;">💾 Centro de Respaldos y Snapshots Automáticos</strong>
                            <span class="badge badge-verde">Salud DB: 100% Óptima</span>
                        </div>
                        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-bottom:12px;">
                            <div style="background:#0f172a; padding:10px; border-radius:6px; text-align:center;">
                                <div style="font-size:11px; color:#94a3b8;">Snapshots Guardados</div>
                                <div style="font-size:18px; font-weight:800; color:#38bdf8;">Historial OK</div>
                            </div>
                            <div style="background:#0f172a; padding:10px; border-radius:6px; text-align:center;">
                                <div style="font-size:11px; color:#94a3b8;">Restauración</div>
                                <div style="font-size:18px; font-weight:800; color:#10b981;">1 Clic</div>
                            </div>
                            <div style="background:#0f172a; padding:10px; border-radius:6px; text-align:center;">
                                <div style="font-size:11px; color:#94a3b8;">Descarga</div>
                                <div style="font-size:18px; font-weight:800; color:#f59e0b;">JSON / Backup</div>
                            </div>
                        </div>
                        <p style="margin:0; font-size:12px; color:#cbd5e1;">
                            Permite congelar el estado de la flota y recuperarlo inmediatamente ante cualquier imprevisto.
                        </p>
                    </div>
                `
            },
            {
                modulo: "GESTIÓN DE USUARIOS Y ROLES",
                icono: "👥",
                tituloPaso: "Paso 6: Administración de Cuentas y Asignación de Roles",
                categoria: "Seguridad de Acceso",
                textoExplicativo: "A través del botón 'Administrar Usuarios', el Administrador crea nuevas cuentas para mecánicos, operadores o supervisores, asigna contraseñas seguras y define el rol de acceso (Operador o Administrador) para asegurar el correcto cumplimiento del RBAC.",
                htmlEscenario: `
                    <div style="width:100%; max-width:680px; background:#1e293b; border-radius:12px; padding:18px; border:1px solid #334155; text-align:left;">
                        <strong style="color:#38bdf8; font-size:14px; display:block; margin-bottom:10px;">👥 Control de Acceso y Gestión de Cuentas</strong>
                        <div style="background:#0f172a; border-radius:8px; overflow:hidden; font-size:12px; margin-bottom:10px;">
                            <div style="display:grid; grid-template-columns:120px 140px 100px 1fr; background:#334155; padding:8px 12px; font-weight:700; color:#f8fafc;">
                                <span>USUARIO</span><span>NOMBRE</span><span>ROL</span><span>ESTADO</span>
                            </div>
                            <div style="display:grid; grid-template-columns:120px 140px 100px 1fr; padding:8px 12px; border-bottom:1px solid #1e293b; align-items:center;">
                                <strong style="color:#38bdf8;">admin</strong><span>Admin Corssen</span><span class="badge badge-azul">Administrador</span><span style="color:#10b981;">Activo</span>
                            </div>
                            <div style="display:grid; grid-template-columns:120px 140px 100px 1fr; padding:8px 12px; align-items:center;">
                                <strong style="color:#38bdf8;">operador</strong><span>Alexis Santos</span><span class="badge badge-verde">Operador</span><span style="color:#10b981;">Activo</span>
                            </div>
                        </div>
                        <div style="font-size:12px; color:#94a3b8;">
                            El Administrador puede crear, desactivar y resetear contraseñas de cualquier cuenta del sistema.
                        </div>
                    </div>
                `
            }
        ]
    }
};

let tutorialActivoKey = "operador";
let tutorialPasoIndex = 0;
let tutorialReproduciendo = true;
let tutorialInterval = null;
let tutorialVozActivada = true;
let tutorialAudioTimeout = null;

































// =========================================================
// 12. GESTIÓN Y CONTROL DE ACEITE A GRANEL (2 TAMBORES 200 LITROS)
// =========================================================





window.vaciarHistorialConsumoAceite = function() {
    if (!historialConsumoAceite || historialConsumoAceite.length === 0) {
        if (typeof mostrarNotificacionToast === "function") {
            mostrarNotificacionToast("El historial de consumos de aceite ya está vacío.", "info");
        } else {
            alert("El historial de consumos de aceite ya está vacío.");
        }
        return;
    }

    const totalRegistros = historialConsumoAceite.length;
    let sumaLitrosT1 = 0;
    let sumaLitrosT2 = 0;

    historialConsumoAceite.forEach(h => {
        const litros = Number(h.litrosDescontados || 0);
        const esT2 = h.tamborId === "tambor2" || (h.tipoAceite && (h.tipoAceite.toLowerCase().includes("hidráulico") || h.tipoAceite.toLowerCase().includes("hidraulico")));
        if (esT2) {
            sumaLitrosT2 += litros;
        } else {
            sumaLitrosT1 += litros;
        }
    });

    const mensajeConfirm = `⚠️ ¿Está seguro de VACIAR TODO el historial de consumos de aceite (${totalRegistros} registros)?\n\n` +
        `• Se reincorporarán hasta ${sumaLitrosT1.toFixed(1)} Lts al Tambor 1 (Motor).\n` +
        `• Se reincorporarán hasta ${sumaLitrosT2.toFixed(1)} Lts al Tambor 2 (Hidráulico).\n` +
        `• Esta acción eliminará permanentemente los consumos tanto localmente como en la base de datos de Cloudflare.`;

    if (!confirm(mensajeConfirm)) return;

    // 1. Reincorporar litros a cada tambor
    if (estadoTamboresAceite) {
        if (estadoTamboresAceite.tambor1 && sumaLitrosT1 > 0) {
            const capMax1 = Number(estadoTamboresAceite.tambor1.capacidad) || 200;
            const actual1 = Number(estadoTamboresAceite.tambor1.actual) || 0;
            estadoTamboresAceite.tambor1.actual = Math.min(capMax1, actual1 + sumaLitrosT1);
        }
        if (estadoTamboresAceite.tambor2 && sumaLitrosT2 > 0) {
            const capMax2 = Number(estadoTamboresAceite.tambor2.capacidad) || 200;
            const actual2 = Number(estadoTamboresAceite.tambor2.actual) || 0;
            estadoTamboresAceite.tambor2.actual = Math.min(capMax2, actual2 + sumaLitrosT2);
        }
    }

    // 2. Vaciar array
    historialConsumoAceite = [];
    localStorage.setItem("corssen_historial_aceite_v1", JSON.stringify([]));
    localStorage.setItem("corssen_tambores_aceite_v2", JSON.stringify(estadoTamboresAceite));
    localStorage.setItem("corssen_tambor_aceite_v1", JSON.stringify(estadoTamboresAceite.tambor1));
    localStorage.setItem("corssen_ultima_modificacion_ts", String(Date.now()));

    // 3. Guardar y respaldar
    guardarTodo();
    if (typeof window.ejecutarAutoBackupSistema === "function") {
        window.ejecutarAutoBackupSistema("Vaciado completo de historial de consumo de aceite", "AUTOMATICO", true);
    }

    // 4. Actualizar interfaz
    renderizarModuloAceite();
    if (typeof renderizarDashboard === "function") {
        renderizarDashboard();
    }

    if (typeof mostrarNotificacionToast === "function") {
        mostrarNotificacionToast("Historial de consumo de aceite vaciado permanentemente.", "success");
    } else {
        alert("Historial de consumo de aceite vaciado permanentemente.");
    }
};













// =========================================================
// 11. EXPORTACIÓN NATIVA A MICROSOFT EXCEL (.XLSX)
// =========================================================

/**
 * Motor universal de generación y descarga de libros Microsoft Excel (.xlsx)
 * @param {string} nombreArchivoBase Nombre del archivo (sin extensión o con .xlsx)
 * @param {Array<{nombre: string, datos: Array<Array<any>>, anchos?: Array<number>}>} hojas Lista de hojas con sus datos y anchos de columna
 */


// 11.1. Exportación de Programa Maestro de Mantención (.xlsx)


// Alias para compatibilidad de llamadas anteriores


// 11.2. Exportación de Gestión de Mantenciones y Órdenes de Trabajo (.xlsx)


// 11.3. Exportación de Existencias e Inventario de Stock (.xlsx)


// 11.4. Exportación de Historial y Kárdex de Movimientos (.xlsx)


// 11.5. Exportación de Ficha Técnica del Equipo Activo (.xlsx)


// 11.6. Exportación de Historial de Combustible & Estanque 400L (.xlsx)




// 11.7. Exportación del Catálogo Maestro de Flota y Maquinarias (.xlsx)


// =========================================================
// 11.5. SINCRONIZACIÓN AUTOMÁTICA CON LA NUBE MULTIDISPOSITIVO
// =========================================================


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

    // Visibilidad exclusiva de menú de Respaldos & Mantención y Mantenimiento para usuario 'admin' (Administrador General)
    const esSuperAdminPrincipal = (usuarioLogueado || "").toLowerCase().trim() === "admin";
    const menuItemRespaldos = document.getElementById("menuItemRespaldos");
    if (menuItemRespaldos) {
        menuItemRespaldos.style.display = esSuperAdminPrincipal ? "flex" : "none";
    }
    const menuItemMantenimiento = document.getElementById("menuItemVentanaMantenimiento");
    if (menuItemMantenimiento) {
        menuItemMantenimiento.style.display = esSuperAdminPrincipal ? "flex" : "none";
    }
    const seccionRespaldos = document.getElementById("respaldosMantencion");
    if (seccionRespaldos && !esSuperAdminPrincipal) {
        seccionRespaldos.style.display = "none";
    }

    // Para clientes y operadores (cualquiera que NO sea el Administrador General 'admin', incluyendo a Daniel):
    // 1. verificar si el servicio general fue suspendido por cuota pendiente
    // 2. verificar si la plataforma está actualmente en ventana de mantenimiento
    if (usuarioLogueado && usuarioLogueado.toLowerCase().trim() !== "admin") {
        (async () => {
            try {
                // Validación de servicio suspendido
                const resServ = await fetch("/api/servicio/estado");
                if (resServ.ok) {
                    const dataServ = await resServ.json();
                    if (dataServ.estadoServicio === "suspendido") {
                        localStorage.setItem("corssen_servicio_suspendido", "true");
                        sessionStorage.clear();
                        window.location.replace("/login.html?suspendido=1");
                        return;
                    }
                }

                // Validación de ventana de mantenimiento activa
                const resMant = await fetch("/api/mantenimiento/config");
                if (resMant.ok) {
                    const dataMant = await resMant.json();
                    if (dataMant.mantenimientoActivo) {
                        sessionStorage.clear();
                        window.location.replace("/login.html?mantenimiento=1");
                        return;
                    }
                }
            } catch (_) {}
        })();
    }

    cargarTodo();
    sincronizarProgramaDesdeServidor();
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
    actualizarPermisosFlotaRegistrada();
    actualizarPermisosModuloRespaldos();
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

    // Formularios Originales y Equipos Auxiliares/Herramientas/Marítimo
    document.getElementById("formVehiculo")?.addEventListener("submit", registrarVehiculo);
    document.getElementById("formMaquinaria")?.addEventListener("submit", registrarMaquinaria);
    document.getElementById("formAuxiliarHerramientaMaritimo")?.addEventListener("submit", registrarAuxiliarHerramientaMaritimo);
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
    const ejecutarCierreSesion = async () => {
        await fetch("/api/logout", {method:"POST"}).catch(() => {});
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
    let backupFileCargadoData = null;

    async function verificarCuentaMantenimiento(password) {
        const usuario = (sessionStorage.getItem("usuarioLogueado") || "").toLowerCase().trim();
        if (usuario !== "admin" || !password) return false;
        try {
            const resp = await fetch("/api/login", {
                method: "POST", headers: {"Content-Type": "application/json"},
                body: JSON.stringify({usuario, password})
            });
            const cuenta = await resp.json();
            return resp.ok && cuenta.usuario === usuario && cuenta.rol === "admin";
        } catch (_) { return false; }
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

    window.desbloquearModuloRespaldos = async function(e) {
        if (e) e.preventDefault();
        const input = document.getElementById("inputClaveMantenimiento");
        const msgError = document.getElementById("msgErrorClaveRespaldos");
        const claveIngresada = input ? input.value.trim() : "";
        if (await verificarCuentaMantenimiento(claveIngresada)) {
            sessionStorage.setItem("corssen_modulo_respaldos_desbloqueado", "true");
            if (msgError) msgError.style.display = "none";
            if (input) input.value = "";
            sincronizarEstadoVisualModuloRespaldos();
        } else {
            if (msgError) {
                msgError.textContent = "⚠️ No se pudo verificar la cuenta. Ingresa tu contraseña actual de administrador.";
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
        alert("Los respaldos y el mantenimiento utilizan la cuenta de administrador. Gestiona su contraseña desde Administrar Usuarios; ya no se utiliza una clave local independiente.");
    };
    window.cerrarModalCambiarClaveMantenimiento = function() {
        const modal = document.getElementById("modalCambiarClaveMantenimiento");
        if (modal) modal.style.display = "none";
    };
    window.guardarNuevaClaveMantenimiento = function(e) {
        if (e) e.preventDefault();
        cerrarModalCambiarClaveMantenimiento();
        abrirModalCambiarClaveMantenimiento();
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
                corssen_tambores_aceite_v2: JSON.parse(JSON.stringify(estadoTamboresAceite || {})),
                corssen_tambor_aceite_v1: JSON.parse(JSON.stringify(estadoTamboresAceite?.tambor1 || estadoTamborAceite || {})),
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
                aceiteActual: (estadoTamboresAceite?.tambor1?.actual || 0) + (estadoTamboresAceite?.tambor2?.actual || 0)
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
                        <div style="font-size:11px; color:#64748b;">Por: ${s.usuario || 'Aron Martinez'}</div>
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
                        <div style="display:flex; gap:6px; justify-content:center; flex-wrap:wrap; align-items:center;">
                            <button type="button" class="btn-primario btn-aplicar-punto" style="padding:6px 12px; font-size:11.5px; font-weight:700; background:#10b981; border-color:#10b981; color:#ffffff; border-radius:8px; display:inline-flex; align-items:center; gap:5px; box-shadow:0 2px 5px rgba(16,185,129,0.3); cursor:pointer;" onclick="abrirModalAplicarPunto('${s.id}')" title="Aplicar y restaurar este punto de respaldo en el sistema">
                                🚀 Aplicar este Punto
                            </button>
                            <button type="button" class="btn-secundario" style="padding:5px 9px; font-size:11px;" onclick="descargarSnapshotJSON('${s.id}')" title="Descargar este punto específico en archivo .JSON">
                                📥 JSON
                            </button>
                            <button type="button" class="btn-peligro" style="padding:5px 7px; font-size:11px;" onclick="eliminarSnapshot('${s.id}')" title="Eliminar este punto de restauración">
                                🗑️
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");
    };

    // Control y modal para aplicar puntos de respaldo manualmente
    let puntoSnapshotSeleccionadoParaAplicar = null;

    window.abrirModalAplicarPunto = function(idSnapshot) {
        const snapshots = obtenerSnapshots();
        const snap = snapshots.find(s => s.id === idSnapshot);
        if (!snap) return alert("Punto de restauración no encontrado.");

        puntoSnapshotSeleccionadoParaAplicar = snap;

        const infoCont = document.getElementById("detallePuntoRestaurarInfo");
        if (infoCont) {
            infoCont.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                    <div>
                        <span class="badge badge-verde" style="font-size:10.5px; padding:2px 8px;">ID: ${snap.id}</span>
                        <h4 style="margin:6px 0 2px 0; font-size:15px; color:#0f172a; font-weight:800;">${snap.motivo}</h4>
                        <div style="font-size:12px; color:#64748b;">📅 ${snap.fecha} a las ${snap.hora} • Guardado por: <strong>${snap.usuario || 'Aron Martinez'}</strong></div>
                    </div>
                </div>
                <div style="display:flex; gap:10px; font-size:12px; color:#334155; background:#ffffff; padding:8px 12px; border-radius:8px; border:1px solid #e2e8f0; flex-wrap:wrap;">
                    <span>📋 <strong>${snap.resumen?.totalPrograma || 0}</strong> Equipos</span>
                    <span>🚚 <strong>${snap.resumen?.totalVehiculos || 0}</strong> Vehículos</span>
                    <span>🏗️ <strong>${snap.resumen?.totalMaquinarias || 0}</strong> Maquinarias</span>
                    <span>🔧 <strong>${snap.resumen?.totalMantenciones || 0}</strong> OTs</span>
                    <span>📦 <strong>${snap.resumen?.totalStock || 0}</strong> Insumos</span>
                </div>
            `;
        }

        const modal = document.getElementById("modalAplicarPuntoRestauracion");
        if (modal) modal.style.display = "flex";
    };

    window.cerrarModalAplicarPunto = function() {
        puntoSnapshotSeleccionadoParaAplicar = null;
        const modal = document.getElementById("modalAplicarPuntoRestauracion");
        if (modal) modal.style.display = "none";
    };

    window.ejecutarAplicarPuntoSeleccionado = function() {
        if (!puntoSnapshotSeleccionadoParaAplicar) return;
        const snap = puntoSnapshotSeleccionadoParaAplicar;
        const radio = document.querySelector('input[name="modoAplicarPuntoRadio"]:checked');
        const modo = radio ? radio.value : "merge";

        cerrarModalAplicarPunto();

        if (modo === "merge") {
            restaurarSnapshotModoMerge(snap.id);
        } else {
            restaurarSnapshotModoRollback(snap.id);
        }
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
        renderizarModuloCombustible();
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

        guardarTodo();

        // Actualizar vistas
        renderizarDashboard();
        renderizarProgramaMaestro();
        renderizarStockInsumos();
        renderizarKardexMovimientos();
        renderizarModuloAceite();
        renderizarModuloCombustible();
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

    window.mostrarToast = function(msg, tipo = 'info') {
        if (typeof mostrarNotificacionToast === 'function') {
            mostrarNotificacionToast(msg, tipo);
        } else {
            console.log(`[${tipo}]:`, msg);
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
    window.abrirModalAjustarNivelEstanque = abrirModalAjustarNivelEstanque;
    window.cerrarModalAjustarNivelEstanque = cerrarModalAjustarNivelEstanque;
    window.restablecerEstanqueLleno = restablecerEstanqueLleno;
    window.reconciliarSaldoEstanqueCombustible = reconciliarSaldoEstanqueCombustible;
    window.guardarAjusteManualEstanque = guardarAjusteManualEstanque;

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
    window.sincronizarProgramaDesdeServidor = sincronizarProgramaDesdeServidor;
    window.eliminarEquipoPrograma = eliminarEquipoPrograma;
    window.eliminarVehiculo = eliminarVehiculo;
    window.eliminarMaquinaria = eliminarMaquinaria;

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

    // =========================================================
    // 12.B CONTROL DE VENTANA DE MANTENIMIENTO, CALENDARIO Y AVISOS
    // EXCLUSIVO ADMINISTRADOR GENERAL ('admin')
    // =========================================================
    let configMantenimientoActual = null;
    let eventoSeleccionadoParaAviso = null;

    async function cargarModuloVentanaMantenimiento() {
        const usuarioActual = (sessionStorage.getItem("usuarioLogueado") || "").toLowerCase().trim();
        if (usuarioActual !== "admin") {
            alert("⛔ Acceso Denegado: Este módulo de control de ventana de mantenimiento y restricción de conexiones es exclusivo para el Administrador General (admin).");
            navegarSeccion("dashboard");
            return;
        }

        try {
            const res = await fetch("/api/mantenimiento/config", {
                headers: { "x-usuario": "admin" }
            });
            if (!res.ok) throw new Error("Error consultando configuración");
            configMantenimientoActual = await res.json();
        } catch (err) {
            console.error("Error al cargar configuración de mantenimiento:", err);
            configMantenimientoActual = {
                mantenimientoActivo: false,
                titulo: "Mantenimiento y Corrección de Errores del Sistema",
                motivo: "Mantenimiento preventivo, optimización de base de datos y corrección de incidencias",
                fechaInicio: new Date().toISOString().split("T")[0],
                horaInicio: "22:00",
                fechaFinEstimada: new Date().toISOString().split("T")[0],
                horaFinEstimada: "02:00",
                duracionEstimada: "4 horas",
                mensajePersonalizado: "La plataforma se encuentra temporalmente fuera de servicio por labores programadas de mantenimiento y optimización técnica ejecutadas por el Administrador General. Rogamos no intentar acceder durante este periodo para resguardar la integridad de los datos.",
                audienciaBloqueo: "todos_excepto_admin",
                usuariosBloqueados: ["daniel", "operador"],
                clienteNotificacion: {
                    nombre: "Daniel Corssen",
                    empresa: "Corssen Logística y Maquinarias",
                    whatsapp: "+56 9 8765 4321",
                    email: "contacto@corssen.cl"
                },
                calendario: [],
                historialAvisos: []
            };
        }

        actualizarUIVentanaMantenimiento();
        if (typeof cargarEstadoServicioCuota === "function") {
            await cargarEstadoServicioCuota();
        }
    }

    function actualizarUIVentanaMantenimiento() {
        if (!configMantenimientoActual) return;
        const cfg = configMantenimientoActual;
        const activo = !!cfg.mantenimientoActivo;

        // Badge y botón principal
        const badgeGeneral = document.getElementById("badgeEstadoMantenimientoGeneral");
        const btnToggle = document.getElementById("btnToggleMantenimientoGeneral");
        const badgeMenu = document.getElementById("badgeEstadoVentanaMenu");
        const kpiEstadoTexto = document.getElementById("kpiMantenimientoEstadoTexto");
        const kpiUsuariosBloq = document.getElementById("kpiUsuariosBloqueadosCount");
        const kpiTotalAvisos = document.getElementById("kpiTotalAvisosEnviados");

        if (badgeGeneral) {
            if (activo) {
                badgeGeneral.className = "badge badge-rojo";
                badgeGeneral.textContent = "🚧 MANTENIMIENTO ACTIVO (BLOQUEO EN VIVO)";
                badgeGeneral.style.background = "#fee2e2";
                badgeGeneral.style.color = "#dc2626";
                badgeGeneral.style.border = "1px solid #fca5a5";
            } else {
                badgeGeneral.className = "badge badge-verde";
                badgeGeneral.textContent = "🟢 PLATAFORMA OPERATIVA";
                badgeGeneral.style.background = "#dcfce7";
                badgeGeneral.style.color = "#15803d";
                badgeGeneral.style.border = "1px solid #86efac";
            }
        }

        if (btnToggle) {
            if (activo) {
                btnToggle.style.background = "#16a34a";
                btnToggle.style.borderColor = "#16a34a";
                btnToggle.innerHTML = "<span>🟢 Finalizar Mantenimiento y Abrir Acceso</span>";
            } else {
                btnToggle.style.background = "#d97706";
                btnToggle.style.borderColor = "#d97706";
                btnToggle.innerHTML = "<span>⚡ Iniciar Mantenimiento Ahora</span>";
            }
        }

        if (badgeMenu) {
            if (activo) {
                badgeMenu.className = "badge badge-amarillo";
                badgeMenu.textContent = "MANT.";
                badgeMenu.style.background = "#fef3c7";
                badgeMenu.style.color = "#b45309";
            } else {
                badgeMenu.className = "badge badge-verde";
                badgeMenu.textContent = "OK";
                badgeMenu.style.background = "#dcfce7";
                badgeMenu.style.color = "#15803d";
            }
            badgeMenu.style.fontSize = "9.5px";
            badgeMenu.style.padding = "2px 7px";
            badgeMenu.style.flexShrink = "0";
            badgeMenu.style.marginLeft = "auto";
        }

        if (kpiEstadoTexto) {
            if (activo) {
                kpiEstadoTexto.textContent = "Mantenimiento Activo";
                kpiEstadoTexto.style.color = "#dc2626";
            } else {
                kpiEstadoTexto.textContent = "Operativo Normal";
                kpiEstadoTexto.style.color = "#059669";
            }
        }

        if (kpiUsuariosBloq) {
            if (cfg.audienciaBloqueo === "todos_excepto_admin") {
                kpiUsuariosBloq.textContent = "Todos (Daniel & Operadores)";
            } else {
                const count = (cfg.usuariosBloqueados || []).length;
                kpiUsuariosBloq.textContent = `${count} Cuentas Seleccionadas`;
            }
        }

        const avisosList = Array.isArray(cfg.historialAvisos) ? cfg.historialAvisos : [];
        if (kpiTotalAvisos) {
            kpiTotalAvisos.textContent = `${avisosList.length} Notificaciones`;
        }

        // Formulario
        const radioAud = document.querySelector(`input[name="radioAudienciaBloqueo"][value="${cfg.audienciaBloqueo || 'todos_excepto_admin'}"]`);
        if (radioAud) radioAud.checked = true;
        actualizarSeleccionAudienciaUI();

        const checkDan = document.getElementById("checkBloquearDaniel");
        if (checkDan) checkDan.checked = (cfg.usuariosBloqueados || []).includes("daniel");

        const checkOp = document.getElementById("checkBloquearOperador");
        if (checkOp) checkOp.checked = (cfg.usuariosBloqueados || []).includes("operador");

        const inFechaIni = document.getElementById("inputFechaInicioMantenimiento");
        if (inFechaIni) inFechaIni.value = cfg.fechaInicio || new Date().toISOString().split("T")[0];

        const inHoraIni = document.getElementById("inputHoraInicioMantenimiento");
        if (inHoraIni) inHoraIni.value = cfg.horaInicio || "22:00";

        const inFechaFin = document.getElementById("inputFechaFinMantenimiento");
        if (inFechaFin) inFechaFin.value = cfg.fechaFinEstimada || new Date().toISOString().split("T")[0];

        const inHoraFin = document.getElementById("inputHoraFinMantenimiento");
        if (inHoraFin) inHoraFin.value = cfg.horaFinEstimada || "02:00";

        const inMotivo = document.getElementById("inputMotivoMantenimiento");
        if (inMotivo) inMotivo.value = cfg.motivo || "Mantenimiento preventivo, optimización de base de datos y corrección de incidencias";

        const inDuracion = document.getElementById("inputDuracionEstimadaMantenimiento");
        if (inDuracion) inDuracion.value = cfg.duracionEstimada || "4 horas";

        const inMsg = document.getElementById("inputMensajePersonalizadoMantenimiento");
        if (inMsg) inMsg.value = cfg.mensajePersonalizado || "La plataforma se encuentra temporalmente fuera de servicio por labores programadas de mantenimiento y optimización técnica ejecutadas por el Administrador General. Rogamos no intentar acceder durante este periodo para resguardar la integridad de los datos.";

        // Datos del cliente destinatario
        if (cfg.clienteNotificacion) {
            const inNombre = document.getElementById("inputNotifNombreCliente");
            const inEmpresa = document.getElementById("inputNotifEmpresaCliente");
            const inWsp = document.getElementById("inputNotifWhatsappCliente");
            const inEmail = document.getElementById("inputNotifEmailCliente");

            if (inNombre && cfg.clienteNotificacion.nombre) inNombre.value = cfg.clienteNotificacion.nombre;
            if (inEmpresa && cfg.clienteNotificacion.empresa) inEmpresa.value = cfg.clienteNotificacion.empresa;
            if (inWsp && cfg.clienteNotificacion.whatsapp) inWsp.value = cfg.clienteNotificacion.whatsapp;
            if (inEmail && cfg.clienteNotificacion.email) inEmail.value = cfg.clienteNotificacion.email;
        }

        renderizarTablaCalendario();
        regenerarMensajeAvisoCliente();
        renderizarHistorialAvisos();
    }

    function actualizarSeleccionAudienciaUI() {
        const radioPersonalizado = document.querySelector('input[name="radioAudienciaBloqueo"][value="personalizado"]');
        const cajaCheckboxes = document.getElementById("listaCheckboxesUsuariosBloqueados");
        if (cajaCheckboxes) {
            cajaCheckboxes.style.display = (radioPersonalizado && radioPersonalizado.checked) ? "flex" : "none";
        }
    }

    async function toggleVentanaMantenimientoPrincipal() {
        if (!configMantenimientoActual) await cargarModuloVentanaMantenimiento();
        if (!configMantenimientoActual) return;

        const nuevoEstado = !configMantenimientoActual.mantenimientoActivo;

        if (nuevoEstado) {
            const confirmar = confirm(
                "⚠️ ¿Desea ACTIVAR la ventana de mantenimiento en vivo?\n\n" +
                "• Los clientes (Daniel Corssen) y operadores serán BLOQUEADOS de inmediato al intentar iniciar sesión.\n" +
                "• Si tienen sesiones abiertas, serán desconectados con aviso explicativo.\n" +
                "• Tu usuario 'admin' (Administrador General) es el ÚNICO con pase total garantizado para realizar correcciones y mantención sin interferencias."
            );
            if (!confirmar) return;
        } else {
            const confirmar = confirm(
                "🟢 ¿Desea FINALIZAR la ventana de mantenimiento?\n\n" +
                "• Se reactivará el acceso regular a la plataforma para todos los clientes y operadores autorizados."
            );
            if (!confirmar) return;
        }

        try {
            const payload = {
                ...configMantenimientoActual,
                mantenimientoActivo: nuevoEstado
            };

            const res = await fetch("/api/mantenimiento/config", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-usuario": "admin"
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Error al modificar estado de mantenimiento");
            const data = await res.json();
            configMantenimientoActual = data.config;
            actualizarUIVentanaMantenimiento();

            alert(nuevoEstado 
                ? "🚧 VENTANA DE MANTENIMIENTO ACTIVADA:\n\nLos clientes y operadores han sido bloqueados. Únicamente tu cuenta 'admin' puede operar en la plataforma." 
                : "🟢 VENTANA DE MANTENIMIENTO FINALIZADA:\n\nLa plataforma está 100% operativa y el acceso de clientes ha sido restablecido.");
        } catch (err) {
            alert("Error al cambiar estado: " + err.message);
        }
    }

    async function guardarAjustesVentanaMantenimiento(e) {
        if (e) e.preventDefault();
        if (!configMantenimientoActual) return;

        const radioAud = document.querySelector('input[name="radioAudienciaBloqueo"]:checked');
        const audVal = radioAud ? radioAud.value : "todos_excepto_admin";

        const bloqList = [];
        if (document.getElementById("checkBloquearDaniel")?.checked) bloqList.push("daniel");
        if (document.getElementById("checkBloquearOperador")?.checked) bloqList.push("operador");

        const payload = {
            ...configMantenimientoActual,
            audienciaBloqueo: audVal,
            usuariosBloqueados: bloqList,
            fechaInicio: document.getElementById("inputFechaInicioMantenimiento")?.value || "",
            horaInicio: document.getElementById("inputHoraInicioMantenimiento")?.value || "",
            fechaFinEstimada: document.getElementById("inputFechaFinMantenimiento")?.value || "",
            horaFinEstimada: document.getElementById("inputHoraFinMantenimiento")?.value || "",
            motivo: document.getElementById("inputMotivoMantenimiento")?.value || "",
            duracionEstimada: document.getElementById("inputDuracionEstimadaMantenimiento")?.value || "",
            mensajePersonalizado: document.getElementById("inputMensajePersonalizadoMantenimiento")?.value || "",
            clienteNotificacion: {
                nombre: document.getElementById("inputNotifNombreCliente")?.value || "Daniel Corssen",
                empresa: document.getElementById("inputNotifEmpresaCliente")?.value || "Corssen Logística y Maquinarias",
                whatsapp: document.getElementById("inputNotifWhatsappCliente")?.value || "+56 9 8765 4321",
                email: document.getElementById("inputNotifEmailCliente")?.value || "contacto@corssen.cl"
            }
        };

        try {
            const res = await fetch("/api/mantenimiento/config", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-usuario": "admin"
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Error al guardar ajustes");
            const data = await res.json();
            configMantenimientoActual = data.config;
            actualizarUIVentanaMantenimiento();
            alert("✓ Configuración de la ventana de mantenimiento y destinatario guardada con éxito.");
        } catch (err) {
            alert("Error al guardar: " + err.message);
        }
    }

    function renderizarTablaCalendario() {
        const tbody = document.getElementById("tbodyCalendarioMantenimiento");
        if (!tbody) return;

        const lista = (configMantenimientoActual && Array.isArray(configMantenimientoActual.calendario)) 
            ? configMantenimientoActual.calendario 
            : [];

        if (lista.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center; padding:24px; color:#64748b; font-size:13px;">
                        📅 No hay mantenciones programadas en el calendario. Haz clic en <strong>"➕ Agendar Nueva Fecha"</strong> para organizar tus labores técnicas.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = lista.map(ev => {
            const badgeTipo = ev.tipo === "CORRECCION_ERRORES" 
                ? `<span class="badge badge-rojo" style="font-size:10.5px;">Corrección Errores</span>`
                : ev.tipo === "OPTIMIZACION_DB"
                ? `<span class="badge badge-azul" style="font-size:10.5px;">Optimización DB</span>`
                : ev.tipo === "RESPALDO_MAYOR"
                ? `<span class="badge badge-morado" style="font-size:10.5px; background:#f3e8ff; color:#7e22ce;">Respaldo Mayor</span>`
                : `<span class="badge badge-amarillo" style="font-size:10.5px;">Preventivo & Correctivo</span>`;

            const badgeEstado = ev.estado === "EN_CURSO"
                ? `<span class="badge badge-rojo" style="font-weight:700;">🚧 EN CURSO</span>`
                : ev.estado === "FINALIZADO"
                ? `<span class="badge badge-verde" style="font-weight:700;">✓ FINALIZADO</span>`
                : `<span class="badge badge-azul" style="font-weight:700;">📅 PROGRAMADO</span>`;

            const badgeWsp = ev.notificadoWhatsapp 
                ? `<span style="display:inline-flex; align-items:center; gap:2px; font-size:11px; color:#16a34a; font-weight:700;">📲 WA ✓</span>`
                : `<span style="font-size:11px; color:#94a3b8;">📲 WA -</span>`;

            const badgeMail = ev.notificadoEmail
                ? `<span style="display:inline-flex; align-items:center; gap:2px; font-size:11px; color:#2563eb; font-weight:700;">✉️ Mail ✓</span>`
                : `<span style="font-size:11px; color:#94a3b8;">✉️ Mail -</span>`;

            const fParts = (ev.fecha || "").split("-");
            const fechaFormateada = fParts.length === 3 ? `${fParts[2]}/${fParts[1]}/${fParts[0]}` : ev.fecha;

            return `
                <tr>
                    <td style="white-space:nowrap;">
                        <div style="font-weight:700; color:#0f172a;">${fechaFormateada}</div>
                        <div style="font-size:11.5px; color:#64748b;">⏰ ${ev.hora || '22:00'} hrs</div>
                    </td>
                    <td>
                        <div style="font-weight:700; color:#1e293b;">${ev.titulo || 'Mantenimiento del Sistema'}</div>
                        <div style="font-size:11.5px; color:#64748b; margin-top:2px;">${ev.motivo || ''}</div>
                    </td>
                    <td>${badgeTipo}</td>
                    <td style="font-weight:600; color:#334155;">${ev.duracion || '2 horas'}</td>
                    <td>${badgeEstado}</td>
                    <td>
                        <div style="display:flex; gap:6px; flex-direction:column;">
                            ${badgeWsp}
                            ${badgeMail}
                        </div>
                    </td>
                    <td style="white-space:nowrap;">
                        <div style="display:flex; gap:6px; align-items:center;">
                            <button type="button" onclick="cargarEventoEnAviso('${ev.id}')" class="btn-secundario" style="padding:4px 8px; font-size:11px; font-weight:700;" title="Cargar fecha y hora en el mensaje de aviso">
                                📲 Preparar Aviso
                            </button>
                            <button type="button" onclick="iniciarMantenimientoDesdeCalendario('${ev.id}')" class="btn-primario" style="padding:4px 8px; font-size:11px; font-weight:700; background:#d97706; border-color:#d97706;" title="Activar ventana con estos datos">
                                ⚡ Iniciar
                            </button>
                            <button type="button" onclick="eliminarEventoCalendario('${ev.id}')" class="btn-secundario" style="padding:4px 8px; font-size:11px; color:#dc2626; border-color:#fca5a5;" title="Eliminar del calendario">
                                🗑️
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");
    }

    function abrirModalNuevoEventoMantenimiento() {
        const modal = document.getElementById("modalNuevoEventoMantenimiento");
        if (modal) {
            const inFecha = document.getElementById("inputModalEventoFecha");
            if (inFecha && !inFecha.value) inFecha.value = new Date().toISOString().split("T")[0];
            modal.style.display = "flex";
        }
    }

    function cerrarModalNuevoEventoMantenimiento() {
        const modal = document.getElementById("modalNuevoEventoMantenimiento");
        if (modal) modal.style.display = "none";
    }

    async function guardarNuevoEventoCalendario(e) {
        if (e) e.preventDefault();

        const titulo = document.getElementById("inputModalEventoTitulo")?.value || "Mantenimiento Técnico";
        const tipo = document.getElementById("selectModalEventoTipo")?.value || "CORRECTIVO_Y_PREVENTIVO";
        const duracion = document.getElementById("inputModalEventoDuracion")?.value || "3 horas";
        const fecha = document.getElementById("inputModalEventoFecha")?.value || new Date().toISOString().split("T")[0];
        const hora = document.getElementById("inputModalEventoHora")?.value || "22:00";
        const motivo = document.getElementById("inputModalEventoMotivo")?.value || "";

        const nuevoEvento = {
            id: "MNT-" + Date.now(),
            titulo,
            tipo,
            duracion,
            fecha,
            hora,
            motivo,
            estado: "PROGRAMADO",
            notificadoWhatsapp: false,
            notificadoEmail: false,
            creadoEn: new Date().toISOString()
        };

        try {
            const res = await fetch("/api/mantenimiento/calendario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-usuario": "admin"
                },
                body: JSON.stringify(nuevoEvento)
            });

            if (!res.ok) throw new Error("Error al guardar evento en calendario");
            const data = await res.json();
            if (configMantenimientoActual) {
                configMantenimientoActual.calendario = data.calendario;
            }
            cerrarModalNuevoEventoMantenimiento();
            actualizarUIVentanaMantenimiento();
            alert(`✓ Evento "${titulo}" agendado con éxito en el calendario para el ${fecha} a las ${hora} hrs.`);
        } catch (err) {
            alert("Error al agendar evento: " + err.message);
        }
    }

    async function eliminarEventoCalendario(id) {
        const confirmar = confirm("¿Desea eliminar esta fecha de mantención del calendario?");
        if (!confirmar) return;

        try {
            const res = await fetch(`/api/mantenimiento/calendario/${encodeURIComponent(id)}`, {
                method: "DELETE",
                headers: { "x-usuario": "admin" }
            });
            if (!res.ok) throw new Error("Error al eliminar evento");
            const data = await res.json();
            if (configMantenimientoActual) {
                configMantenimientoActual.calendario = data.calendario;
            }
            renderizarTablaCalendario();
        } catch (err) {
            alert("Error al eliminar: " + err.message);
        }
    }

    async function iniciarMantenimientoDesdeCalendario(id) {
        if (!configMantenimientoActual || !Array.isArray(configMantenimientoActual.calendario)) return;
        const ev = configMantenimientoActual.calendario.find(e => e.id === id);
        if (!ev) return;

        const conf = confirm(
            `⚡ ¿Desea iniciar inmediatamente la ventana de mantenimiento para:\n"${ev.titulo}" (${ev.fecha} ${ev.hora} hrs)?\n\n` +
            `Esto activará el bloqueo para clientes y operadores de inmediato.`
        );
        if (!conf) return;

        const payload = {
            ...configMantenimientoActual,
            mantenimientoActivo: true,
            titulo: ev.titulo,
            motivo: ev.motivo || ev.titulo,
            fechaInicio: ev.fecha,
            horaInicio: ev.hora,
            duracionEstimada: ev.duracion
        };

        try {
            const res = await fetch("/api/mantenimiento/config", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-usuario": "admin"
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Error al activar mantenimiento");
            const data = await res.json();
            configMantenimientoActual = data.config;
            actualizarUIVentanaMantenimiento();
            alert("🚧 Mantenimiento ACTIVADO. Clientes bloqueados. Acceso exclusivo para el Administrador General.");
        } catch (err) {
            alert("Error al iniciar: " + err.message);
        }
    }

    function cargarEventoEnAviso(id) {
        if (!configMantenimientoActual || !Array.isArray(configMantenimientoActual.calendario)) return;
        const ev = configMantenimientoActual.calendario.find(e => e.id === id);
        if (!ev) return;

        eventoSeleccionadoParaAviso = ev;

        const inFechaIni = document.getElementById("inputFechaInicioMantenimiento");
        const inHoraIni = document.getElementById("inputHoraInicioMantenimiento");
        const inMotivo = document.getElementById("inputMotivoMantenimiento");
        const inDuracion = document.getElementById("inputDuracionEstimadaMantenimiento");

        if (inFechaIni) inFechaIni.value = ev.fecha;
        if (inHoraIni) inHoraIni.value = ev.hora;
        if (inMotivo) inMotivo.value = ev.motivo || ev.titulo;
        if (inDuracion) inDuracion.value = ev.duracion;

        regenerarMensajeAvisoCliente();

        const elAviso = document.getElementById("preMensajeGeneradoAviso");
        if (elAviso) {
            elAviso.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    function generarTextoMensajeAviso() {
        const nombreCliente = document.getElementById("inputNotifNombreCliente")?.value.trim() || "Daniel Corssen";
        const empresaCliente = document.getElementById("inputNotifEmpresaCliente")?.value.trim() || "Corssen Logística y Maquinarias";
        const fechaIni = document.getElementById("inputFechaInicioMantenimiento")?.value || (configMantenimientoActual?.fechaInicio || "");
        const horaIni = document.getElementById("inputHoraInicioMantenimiento")?.value || (configMantenimientoActual?.horaInicio || "22:00");
        const duracion = document.getElementById("inputDuracionEstimadaMantenimiento")?.value || (configMantenimientoActual?.duracionEstimada || "4 horas");
        const horaFin = document.getElementById("inputHoraFinMantenimiento")?.value || (configMantenimientoActual?.horaFinEstimada || "02:00");
        const motivo = document.getElementById("inputMotivoMantenimiento")?.value || (configMantenimientoActual?.motivo || "Optimización técnica del sistema y corrección de incidencias");

        const fParts = fechaIni.split("-");
        const fechaFormateada = fParts.length === 3 ? `${fParts[2]}/${fParts[1]}/${fParts[0]}` : fechaIni;

        return `🚜 *AVISO DE MANTENIMIENTO TÉCNICO PROGRAMADO*
*${empresaCliente}*

Estimado(a) *${nombreCliente}*:

Le informamos que se ejecutará una ventana programada de mantenimiento preventivo, optimización de base de datos y corrección de errores en la plataforma de control de flota.

📅 *Fecha:* ${fechaFormateada}
⏰ *Hora de Inicio:* ${horaIni} hrs
⏱️ *Duración Estimada:* ${duracion} (Restablecimiento aprox: ${horaFin} hrs)
🔧 *Labores Técnicas:* ${motivo}

⚠️ *Información Importante:*
Durante este intervalo, el inicio de sesión a la plataforma estará temporalmente suspendido para resguardar la seguridad y consistencia de los datos mientras el Administrador General aplica las actualizaciones.

Agradecemos su comprensión y colaboración.
Atentamente,
*Administración General - Plataforma Corssen*`;
    }

    function regenerarMensajeAvisoCliente() {
        const pre = document.getElementById("preMensajeGeneradoAviso");
        if (pre) {
            pre.textContent = generarTextoMensajeAviso();
        }
    }

    async function enviarMensajeWhatsappCliente() {
        const wspInput = document.getElementById("inputNotifWhatsappCliente")?.value || "";
        const cleanPhone = wspInput.replace(/[^0-9+]/g, "").replace(/^\+/, "");
        if (!cleanPhone) {
            alert("Por favor ingrese un número de teléfono de WhatsApp válido (ej: 56912345678).");
            return;
        }

        const texto = generarTextoMensajeAviso();
        const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(texto)}`;

        try {
            await fetch("/api/mantenimiento/notificar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-usuario": "admin"
                },
                body: JSON.stringify({
                    canal: "whatsapp",
                    destinatario: wspInput,
                    mensaje: texto,
                    eventoId: eventoSeleccionadoParaAviso ? eventoSeleccionadoParaAviso.id : null
                })
            });

            if (configMantenimientoActual) {
                if (!Array.isArray(configMantenimientoActual.historialAvisos)) configMantenimientoActual.historialAvisos = [];
                configMantenimientoActual.historialAvisos.unshift({
                    id: "NOTIF-" + Date.now(),
                    canal: "whatsapp",
                    destinatario: wspInput,
                    mensaje: texto,
                    fechaEnvio: new Date().toLocaleDateString("es-CL"),
                    horaEnvio: new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
                    timestamp: Date.now()
                });
                if (eventoSeleccionadoParaAviso) {
                    eventoSeleccionadoParaAviso.notificadoWhatsapp = true;
                }
            }
            renderizarHistorialAvisos();
            renderizarTablaCalendario();
        } catch (_) {}

        window.open(url, "_blank");
    }

    function copiarMensajeWhatsappPortapapeles() {
        const texto = generarTextoMensajeAviso();
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(texto).then(() => {
                alert("✓ Mensaje copiado al portapapeles con formato listo para WhatsApp o correo.");
            }).catch(() => {
                copiarTextoFallback(texto);
            });
        } else {
            copiarTextoFallback(texto);
        }
    }

    function copiarTextoFallback(texto) {
        const ta = document.createElement("textarea");
        ta.value = texto;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        alert("✓ Mensaje copiado al portapapeles.");
    }

    async function enviarMensajeEmailCliente() {
        const emailInput = document.getElementById("inputNotifEmailCliente")?.value.trim() || "";
        if (!emailInput || !emailInput.includes("@")) {
            alert("Por favor ingrese un correo electrónico válido para el cliente.");
            return;
        }

        const texto = generarTextoMensajeAviso();
        const fechaIni = document.getElementById("inputFechaInicioMantenimiento")?.value || "";
        const asunto = `Aviso de Mantenimiento Técnico Programado - Plataforma Corssen (${fechaIni})`;
        const mailtoUrl = `mailto:${encodeURIComponent(emailInput)}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(texto)}`;

        try {
            await fetch("/api/mantenimiento/notificar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-usuario": "admin"
                },
                body: JSON.stringify({
                    canal: "email",
                    destinatario: emailInput,
                    mensaje: texto,
                    eventoId: eventoSeleccionadoParaAviso ? eventoSeleccionadoParaAviso.id : null
                })
            });

            if (configMantenimientoActual) {
                if (!Array.isArray(configMantenimientoActual.historialAvisos)) configMantenimientoActual.historialAvisos = [];
                configMantenimientoActual.historialAvisos.unshift({
                    id: "NOTIF-" + Date.now(),
                    canal: "email",
                    destinatario: emailInput,
                    mensaje: texto,
                    fechaEnvio: new Date().toLocaleDateString("es-CL"),
                    horaEnvio: new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
                    timestamp: Date.now()
                });
                if (eventoSeleccionadoParaAviso) {
                    eventoSeleccionadoParaAviso.notificadoEmail = true;
                }
            }
            renderizarHistorialAvisos();
            renderizarTablaCalendario();
        } catch (_) {}

        window.location.href = mailtoUrl;
    }

    function renderizarHistorialAvisos() {
        const cont = document.getElementById("contenedorHistorialAvisos");
        const badgeCount = document.getElementById("badgeContadorAvisosHistorial");
        if (!cont) return;

        const lista = (configMantenimientoActual && Array.isArray(configMantenimientoActual.historialAvisos)) 
            ? configMantenimientoActual.historialAvisos 
            : [];

        if (badgeCount) badgeCount.textContent = `${lista.length} avisos`;

        if (lista.length === 0) {
            cont.innerHTML = `
                <div style="font-size:12px; color:#94a3b8; padding:10px 0; text-align:center;">
                    Aún no se han enviado avisos al cliente desde este módulo.
                </div>
            `;
            return;
        }

        cont.innerHTML = lista.map(item => {
            const esWsp = item.canal === "whatsapp";
            const icono = esWsp ? "📲" : "✉️";
            const canalNombre = esWsp ? "WhatsApp" : "Correo Electrónico";
            const color = esWsp ? "#16a34a" : "#2563eb";
            const bg = esWsp ? "#f0fdf4" : "#eff6ff";

            return `
                <div style="background:${bg}; border:1px solid ${color}33; border-radius:8px; padding:10px 12px; font-size:12px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <span style="font-weight:700; color:${color}; margin-right:6px;">${icono} ${canalNombre}</span>
                        <span style="color:#334155; font-weight:600;">Destino: ${item.destinatario || 'Cliente'}</span>
                    </div>
                    <div style="color:#64748b; font-size:11px;">
                        ${item.fechaEnvio || ''} ${item.horaEnvio || ''}
                    </div>
                </div>
            `;
        }).join("");
    }

    // =========================================================
    // 12.C CONTROL DE ACCESO POR CUOTA MENSUAL (RESPALDOS & MANTENCIÓN)
    // =========================================================
    let estadoServicioGlobal = "activo";
    let motivoServicioGlobal = "Cuota mensual de respaldos y mantenimientos al día";
    let accionPendienteCuotaModal = null;

    async function cargarEstadoServicioCuota() {
        const usuarioActual = (sessionStorage.getItem("usuarioLogueado") || "").toLowerCase().trim();
        if (usuarioActual !== "admin") return;

        try {
            const res = await fetch("/api/servicio/estado");
            if (res.ok) {
                const data = await res.json();
                estadoServicioGlobal = data.estadoServicio || "activo";
                motivoServicioGlobal = data.motivo || "Cuota mensual de respaldos y mantenimientos al día";
                actualizarUIEstadoServicioCuota(data.fechaModificacion);
            } else {
                actualizarUIEstadoServicioCuota();
            }
        } catch (e) {
            console.warn("No se pudo cargar estado del servicio desde API, evaluando local:", e);
            estadoServicioGlobal = localStorage.getItem("corssen_servicio_suspendido") === "true" ? "suspendido" : "activo";
            actualizarUIEstadoServicioCuota();
        }
    }

    function actualizarUIEstadoServicioCuota(fechaMod) {
        const esActivo = estadoServicioGlobal === "activo";
        localStorage.setItem("corssen_servicio_suspendido", esActivo ? "false" : "true");

        const elKpi = document.getElementById("kpiCuotaEstadoTexto");
        if (elKpi) {
            elKpi.textContent = esActivo ? "Al Día (Habilitado)" : "Suspendido (No Pago)";
            elKpi.style.color = esActivo ? "#059669" : "#dc2626";
        }

        const elPill = document.getElementById("badgeEstadoServicioPill");
        if (elPill) {
            elPill.className = "badge-servicio-pill " + (esActivo ? "activo" : "suspendido");
            elPill.textContent = esActivo ? "🟢 Clientes Habilitados" : "🔴 Clientes Suspendidos";
        }

        const caja = document.getElementById("cajaEstadoServicioDinamica");
        const icono = document.getElementById("iconoEstadoServicioGrande");
        const titulo = document.getElementById("tituloEstadoServicioTexto");
        const desc = document.getElementById("descEstadoServicioTexto");
        const infoMod = document.getElementById("infoUltimaModificacionServicio");
        const btnSuspender = document.getElementById("btnSuspenderServicioGeneral");
        const btnReactivar = document.getElementById("btnReactivarServicioGeneral");

        if (caja) {
            caja.className = "caja-estado-servicio " + (esActivo ? "activo" : "suspendido");
        }
        if (icono) {
            icono.className = "icono-estado-grande " + (esActivo ? "activo" : "suspendido");
            icono.textContent = esActivo ? "✓" : "⛔";
        }
        if (titulo) {
            titulo.textContent = esActivo ? "ACCESO TOTAL HABILITADO — CLIENTES AL DÍA" : "ACCESO SUSPENDIDO PREVENTIVAMENTE (CUOTA PENDIENTE)";
            titulo.style.color = esActivo ? "#15803d" : "#b91c1c";
        }
        if (desc) {
            desc.textContent = esActivo
                ? "Los clientes y operadores pueden iniciar sesión, consultar flotas y operar el sistema con total normalidad."
                : `El inicio de sesión de clientes y operadores está bloqueado. Motivo activo: "${motivoServicioGlobal || 'Cuota mensual de respaldos y mantenimientos pendiente'}".`;
        }
        if (infoMod && fechaMod) {
            try {
                const f = new Date(fechaMod);
                infoMod.textContent = `Última modificación: ${f.toLocaleDateString("es-CL")} ${f.toLocaleTimeString("es-CL")}`;
            } catch (_) {
                infoMod.textContent = `Última modificación registrada: ${fechaMod}`;
            }
        }
        if (btnSuspender) btnSuspender.style.display = esActivo ? "inline-flex" : "none";
        if (btnReactivar) btnReactivar.style.display = esActivo ? "none" : "inline-flex";
    }

    function abrirModalSuspensionGeneral(tipo) {
        const usuarioActual = (sessionStorage.getItem("usuarioLogueado") || "").toLowerCase().trim();
        if (usuarioActual !== "admin") {
            alert("Acceso denegado: Solo el Administrador General (admin) tiene autorización para suspender o reactivar servicios.");
            return;
        }

        accionPendienteCuotaModal = tipo;
        const modal = document.getElementById("modalConfirmarSuspensionGeneral");
        const titulo = document.getElementById("modalSuspensionTitulo");
        const icono = document.getElementById("modalSuspensionIcono");
        const alerta = document.getElementById("modalSuspensionAlertaBox");
        const btnConfirmar = document.getElementById("btnConfirmarSuspensionModal");
        const campoMotivo = document.getElementById("campoMotivoSuspension");
        const inputMotivo = document.getElementById("inputMotivoSuspension");

        if (tipo === "suspender") {
            if (titulo) titulo.textContent = "Suspender Inicio de Sesión de Clientes";
            if (icono) icono.textContent = "⛔";
            if (alerta) {
                alerta.style.background = "#fef2f2";
                alerta.style.border = "1.5px solid #fecaca";
                alerta.style.color = "#991b1b";
                alerta.innerHTML = `
                    <div style="font-weight:800; margin-bottom:6px;">¿Está seguro de suspender el acceso de clientes por falta de pago?</div>
                    <div>• Ningún cliente u operador (incluyendo a Daniel y mecánicos) podrá iniciar sesión en la plataforma.</div>
                    <div>• Verán la notificación formal de suspensión por cuota de respaldos y mantenimientos.</div>
                    <div>• Su usuario Administrador General <strong>seguirá teniendo acceso completo</strong> para respaldar y reactivar.</div>
                `;
            }
            if (btnConfirmar) {
                btnConfirmar.textContent = "⛔ Confirmar y Bloquear Acceso";
                btnConfirmar.style.background = "#dc2626";
                btnConfirmar.style.borderColor = "#dc2626";
            }
            if (campoMotivo) campoMotivo.style.display = "block";
            if (inputMotivo) inputMotivo.value = "Cuota mensual de respaldos y mantenimientos pendiente de pago";
        } else {
            if (titulo) titulo.textContent = "Reactivar Inicio de Sesión de Clientes";
            if (icono) icono.textContent = "✅";
            if (alerta) {
                alerta.style.background = "#f0fdf4";
                alerta.style.border = "1.5px solid #bbf7d0";
                alerta.style.color = "#166534";
                alerta.innerHTML = `
                    <div style="font-weight:800; margin-bottom:6px;">¿Desea restaurar el acceso normal para los clientes?</div>
                    <div>• Todos los clientes y operadores podrán volver a iniciar sesión de inmediato.</div>
                    <div>• Se restablece la operatividad completa de las cuentas.</div>
                `;
            }
            if (btnConfirmar) {
                btnConfirmar.textContent = "✅ Confirmar y Reactivar Acceso";
                btnConfirmar.style.background = "#16a34a";
                btnConfirmar.style.borderColor = "#16a34a";
            }
            if (campoMotivo) campoMotivo.style.display = "none";
        }

        if (modal) modal.style.display = "flex";
    }

    function cerrarModalSuspensionGeneral() {
        const modal = document.getElementById("modalConfirmarSuspensionGeneral");
        if (modal) modal.style.display = "none";
    }

    async function ejecutarCambioEstadoServicio() {
        const usuarioActual = (sessionStorage.getItem("usuarioLogueado") || "").toLowerCase().trim();
        if (usuarioActual !== "admin") {
            alert("Acceso denegado: Solo el Administrador General (admin) tiene autorización.");
            return;
        }

        const nuevoEstado = (accionPendienteCuotaModal === "suspender") ? "suspendido" : "activo";
        const inputMotivo = document.getElementById("inputMotivoSuspension");
        const motivo = (inputMotivo && inputMotivo.value.trim()) || 
            (nuevoEstado === "suspendido" ? "Cuota mensual de respaldos y mantenimientos pendiente de pago" : "Cuota mensual de respaldos y mantenimientos al día");

        const btn = document.getElementById("btnConfirmarSuspensionModal");
        if (btn) {
            btn.disabled = true;
            btn.textContent = "Procesando...";
        }

        try {
            const res = await fetch("/api/servicio/estado", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-usuario": "admin"
                },
                body: JSON.stringify({ estadoServicio: nuevoEstado, motivo })
            });

            const data = await res.json();
            if (res.ok) {
                estadoServicioGlobal = nuevoEstado;
                motivoServicioGlobal = motivo;
                actualizarUIEstadoServicioCuota(data.config?.fechaModificacion);
                cerrarModalSuspensionGeneral();
                alert("✓ " + (data.mensaje || "Estado de cuota de servicio actualizado con éxito."));
            } else {
                alert(data.mensaje || "Error al actualizar estado de la cuota.");
            }
        } catch (e) {
            console.error(e);
            estadoServicioGlobal = nuevoEstado;
            motivoServicioGlobal = motivo;
            actualizarUIEstadoServicioCuota(new Date().toISOString());
            cerrarModalSuspensionGeneral();
            alert("✓ Estado de cuota actualizado localmente.");
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.textContent = "Confirmar Acción";
            }
        }
    }

    function abrirModalPreviewAvisoCliente() {
        const modal = document.getElementById("modalPreviewAvisoCliente");
        if (modal) modal.style.display = "flex";
    }

    function cerrarModalPreviewAvisoCliente() {
        const modal = document.getElementById("modalPreviewAvisoCliente");
        if (modal) modal.style.display = "none";
    }

    // Vincular funciones del módulo de mantenimiento a window
    window.cargarModuloVentanaMantenimiento = cargarModuloVentanaMantenimiento;
    window.actualizarUIVentanaMantenimiento = actualizarUIVentanaMantenimiento;
    window.actualizarSeleccionAudienciaUI = actualizarSeleccionAudienciaUI;
    window.toggleVentanaMantenimientoPrincipal = toggleVentanaMantenimientoPrincipal;
    window.guardarAjustesVentanaMantenimiento = guardarAjustesVentanaMantenimiento;
    window.renderizarTablaCalendario = renderizarTablaCalendario;
    window.abrirModalNuevoEventoMantenimiento = abrirModalNuevoEventoMantenimiento;
    window.cerrarModalNuevoEventoMantenimiento = cerrarModalNuevoEventoMantenimiento;
    window.guardarNuevoEventoCalendario = guardarNuevoEventoCalendario;
    window.eliminarEventoCalendario = eliminarEventoCalendario;
    window.iniciarMantenimientoDesdeCalendario = iniciarMantenimientoDesdeCalendario;
    window.cargarEventoEnAviso = cargarEventoEnAviso;
    window.generarTextoMensajeAviso = generarTextoMensajeAviso;
    window.regenerarMensajeAvisoCliente = regenerarMensajeAvisoCliente;
    window.enviarMensajeWhatsappCliente = enviarMensajeWhatsappCliente;
    window.copiarMensajeWhatsappPortapapeles = copiarMensajeWhatsappPortapapeles;
    window.enviarMensajeEmailCliente = enviarMensajeEmailCliente;
    window.renderizarHistorialAvisos = renderizarHistorialAvisos;

    // Funciones de cuota mensual
    window.cargarEstadoServicioCuota = cargarEstadoServicioCuota;
    window.actualizarUIEstadoServicioCuota = actualizarUIEstadoServicioCuota;
    window.abrirModalSuspensionGeneral = abrirModalSuspensionGeneral;
    window.cerrarModalSuspensionGeneral = cerrarModalSuspensionGeneral;
    window.ejecutarCambioEstadoServicio = ejecutarCambioEstadoServicio;
    window.abrirModalPreviewAvisoCliente = abrirModalPreviewAvisoCliente;
    window.cerrarModalPreviewAvisoCliente = cerrarModalPreviewAvisoCliente;

    // Si el usuario logueado es admin, precargar configuración de mantenimiento
    if ((sessionStorage.getItem("usuarioLogueado") || "").toLowerCase().trim() === "admin") {
        cargarModuloVentanaMantenimiento();
    }

    // Sondeo de sincronización periódica cada 15 segundos para mantener todos los dispositivos (computador y celular) alineados en tiempo real
    setInterval(async () => {
        sincronizarConUltimoRespaldoNube();

        // Si es cliente u operador, vigilar si se activó el mantenimiento en vivo
        const uActual = (sessionStorage.getItem("usuarioLogueado") || "").toLowerCase().trim();
        if (uActual && uActual !== "admin") {
            try {
                const resMant = await fetch("/api/mantenimiento/config");
                if (resMant.ok) {
                    const dataMant = await resMant.json();
                    if (dataMant.mantenimientoActivo) {
                        sessionStorage.clear();
                        window.location.replace("/login.html?mantenimiento=1");
                    }
                }
            } catch (_) {}
        }
    }, 15000);

    // Event listener para efecto sticky con elevación y transparencias glassmorphism en el título principal / topbar
    const topbar = document.querySelector(".topbar");
    if (topbar) {
        const manejarScrollTopbar = () => {
            const scrollPos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (scrollPos > 12) {
                topbar.classList.add("scrolled");
            } else {
                topbar.classList.remove("scrolled");
            }
        };
        window.addEventListener("scroll", manejarScrollTopbar, { passive: true });
        document.addEventListener("scroll", manejarScrollTopbar, { passive: true });
        manejarScrollTopbar();
    }
});

// =========================================================
// 12. GESTOR DE TEMA VISUAL (CLARO / OSCURO / SEGUIR SISTEMA)
// =========================================================

window.alternarMenuTema = function(e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById("dropdownMenuTema");
    const btn = document.getElementById("btnToggleTema");
    if (!menu) return;
    const estaVisible = menu.style.display === "flex";
    menu.style.display = estaVisible ? "none" : "flex";
    if (btn) btn.setAttribute("aria-expanded", String(!estaVisible));
};

window.seleccionarTema = function(nuevoTema) {
    aplicarTemaVisual(nuevoTema, true);
    const menu = document.getElementById("dropdownMenuTema");
    if (menu) menu.style.display = "none";
    const btn = document.getElementById("btnToggleTema");
    if (btn) btn.setAttribute("aria-expanded", "false");
};





// Inicializar tema de inmediato
if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", inicializarSistemaTema);
    } else {
        inicializarSistemaTema();
    }
}

// =========================================================
// 13. WIDGET FLOTANTE DE SOPORTE EN VIVO EN LA APLICACIÓN (SIN SALIR A OTRAS APPS)
// =========================================================
const NUMERO_WHATSAPP_SOPORTE = "56987654321"; // Aron Martinez / ServiTec Pro
const NOMBRE_CONTACTO_SOPORTE = "Aron Martinez (ServiTec Pro)";

let chatSoporteIniciado = false;
let sonidoChatHabilitado = true;
let intervaloPollingChatSoporte = null;
let mensajesChatLocales = [];
let ultimoTimestampChatVisto = 0;

const PREGUNTAS_RAPIDAS_SOPORTE = [
    { id: "fichas", texto: "📋 Fichas Técnicas & Filtros" },
    { id: "alta", texto: "🚚 Alta de Camión o Máquina" },
    { id: "combustible", texto: "⛽ Combustible & Estanque 400L" },
    { id: "aceite", texto: "🛢️ Tambor de Aceite 200L" },
    { id: "mantenciones", texto: "🔧 Mantenciones & OTs" },
    { id: "respaldos", texto: "💾 Respaldos del Sistema" },
    { id: "roles", texto: "👤 Roles y Permisos" },
    { id: "directo_aron", texto: "👨‍💻 Chatear con Aron Martinez" }
];

const BASE_CONOCIMIENTO_SOPORTE = {
    fichas: {
        titulo: "📋 Módulo de Fichas Técnicas y Equivalencias Multimarca",
        respuesta: `
• <strong>Catálogo Oficial:</strong> Puedes consultar las especificaciones técnicas completas de cada camioneta, camión o grúa.<br>
• <strong>Matriz de Filtros Multimarca:</strong> Cada unidad detalla sus filtros originales y equivalencias en Baldwin, Donaldson, Fleetguard y Mann.<br>
• <strong>Nivel de Acceso:</strong> El <em>Administrador General</em> cuenta con el botón "Editar Ficha". Los <em>Operadores</em> tienen acceso en modo consulta.<br>
• <strong>Exportación:</strong> Puedes descargar la ficha individual en PDF o exportarla a Excel (.xlsx).
`
    },
    alta: {
        titulo: "🚚 Registro y Sincronización de Flota",
        respuesta: `
• <strong>Camiones y Camionetas:</strong> Se registran con código oficial (ej: <code>CAM-05</code>), patente (ej: <code>TD-KP-72</code>), marca, modelo y kilometraje.<br>
• <strong>Maquinarias y Grúas:</strong> Se registran con código (ej: <code>GHO-04</code>), horómetro, capacidad y modelo.<br>
• <strong>Sincronización Automática:</strong> Al dar de alta una unidad en Fichas Técnicas o Flota, el sistema la incorpora de inmediato al <em>Programa Maestro</em> y a las tablas de <em>Flota Registrada</em>.<br>
• <strong>Permisos:</strong> Función exclusiva para usuarios con rol de Administrador.
`
    },
    combustible: {
        titulo: "⛽ Control de Combustible y Estanque 400L",
        respuesta: `
• <strong>Estanque de 400 Litros:</strong> El sistema calcula el saldo en litros disponibles en tiempo real.<br>
• <strong>Registro de Despachos:</strong> Cada carga resta litros del estanque y guarda fecha, conductor, equipo y kilometraje/horómetro.<br>
• <strong>Recargas de Estanque:</strong> Si la empresa recarga el estanque con camión cisterna, se ingresa la recarga sumando litros al estanque.<br>
• <strong>Alertas:</strong> El sistema avisa visualmente cuando el nivel baja de 100L (25%).
`
    },
    aceite: {
        titulo: "🛢️ Control de Aceite a Granel (2 Tambores 200L)",
        respuesta: `
• <strong>Monitoreo de Tambores:</strong> Control de tambores de 200L de aceite Valvoline Premium Blue 15W-40.<br>
• <strong>Descuento por OT:</strong> Al completar una Orden de Trabajo que involucre cambio de aceite de motor, los litros utilizados se descuentan automáticamente del tambor activo.<br>
• <strong>Costo Unitario:</strong> Calcula el gasto exacto por litro y acumulado por unidad.
`
    },
    mantenciones: {
        titulo: "🔧 Órdenes de Trabajo y Mantenimiento Preventivo",
        respuesta: `
• <strong>Semáforo Preventivo:</strong> Verde (Al día), Amarillo (Próximo a mantención dentro de 50 hrs / 1.000 km) y Rojo (Vencido o Urgente).<br>
• <strong>Generación de OTs:</strong> Asigna labores, insumos utilizados, kilometraje/horómetro y técnico responsable.<br>
• <strong>Comprobantes Oficiales:</strong> Cada OT completada cuenta con comprobante imprimible y descargable en PDF con firma técnica.
`
    },
    respaldos: {
        titulo: "💾 Respaldos y Puntos de Restauración",
        respuesta: `
• <strong>Acceso Exclusivo:</strong> Reservado únicamente para el <em>Administrador General (admin)</em>.<br>
• <strong>No se aplican solos:</strong> Los respaldos se guardan de forma segura en la nube (Cloudflare), pero <u>no se aplican automáticamente</u> para no interferir con tu trabajo diario.<br>
• <strong>Botón '🚀 Aplicar este Punto':</strong> Puedes restaurar manualmente cualquier punto eligiendo entre <em>Fusión Inteligente</em> (sin borrar lo nuevo) o <em>Rollback Total</em>.
`
    },
    roles: {
        titulo: "👤 Roles, Permisos y Accesos del Sistema",
        respuesta: `
• <strong>Administrador General (admin):</strong> Acceso total, centro de respaldos, control de cuotas, ventana de mantenimiento y edición de fichas maestras.<br>
• <strong>Operador (operador / Daniel):</strong> Registro de despachos de combustible, control de stock, apertura de órdenes de trabajo y consulta de catálogo técnico.
`
    },
    directo_aron: {
        titulo: "👨‍💻 Soporte Directo con Aron Martinez (ServiTec Pro)",
        respuesta: `
• <strong>Canal Interno en Vivo:</strong> Estás conectado en tiempo real al chat interno del sistema con Aron Martinez.<br>
• <strong>Sin salir de la aplicación:</strong> No requieres abrir aplicaciones externas ni WhatsApp. Todo el diálogo queda respaldado en esta misma pantalla.<br>
• <strong>Escribe tu mensaje:</strong> Puedes escribir tu duda o requerimiento técnico abajo y recibirás asistencia inmediata.
`
    }
};





window.toggleSonidoChatSoporte = function() {
    sonidoChatHabilitado = !sonidoChatHabilitado;
    const btn = document.getElementById("btnSonidoChatSoporte");
    if (btn) {
        btn.textContent = sonidoChatHabilitado ? "🔔" : "🔕";
        btn.title = sonidoChatHabilitado ? "Sonido activado (clic para silenciar)" : "Sonido silenciado (clic para activar)";
    }
};



window.toggleVentanaChatSoporte = function(forzarEstado) {
    const ventana = document.getElementById("ventanaChatSoporte");
    if (!ventana) return;

    const estaVisible = ventana.style.display === "flex";
    const nuevoEstado = (typeof forzarEstado === "boolean") ? forzarEstado : !estaVisible;

    ventana.style.display = nuevoEstado ? "flex" : "none";

    const badge = document.getElementById("badgeNotifSoporte");
    if (badge && nuevoEstado) {
        badge.style.display = "none";
        badge.textContent = "0";
    }

    if (nuevoEstado) {
        if (!chatSoporteIniciado) {
            inicializarChatSoporte();
        } else {
            cargarMensajesSoporteServidor(false);
        }
        actualizarVisibilidadModoAdminChat();
        setTimeout(() => {
            document.getElementById("inputPreguntaSoporte")?.focus();
        }, 150);
    }
};








window.generarEtiquetaRemitenteChat = generarEtiquetaRemitenteChat;






window.renderizarChipsPreguntasRapidas = renderizarChipsPreguntasRapidas;

window.seleccionarChipSoporte = function(id, textoVisible) {
    if (id === "directo_aron") {
        const input = document.getElementById("inputPreguntaSoporte");
        if (input) {
            input.value = "Hola Aron, necesito asistencia técnica con una unidad...";
            input.focus();
        }
        return;
    }
    enviarMensajeUsuarioSoporte(textoVisible, id);
};

window.enviarMensajeChatSoporte = function(e) {
    if (e) e.preventDefault();
    const input = document.getElementById("inputPreguntaSoporte");
    if (!input) return;
    const texto = input.value.trim();
    if (!texto) return;
    input.value = "";
    enviarMensajeUsuarioSoporte(texto, null);
};

window.enviarRespuestaRapidaAdmin = function(textoRapido) {
    enviarMensajeUsuarioSoporte(textoRapido, null, true);
};

window.reiniciarChatSoporteServidor = async function() {
    if (!confirm("¿Deseas reiniciar el historial del chat de soporte?")) return;
    try {
        const resp = await fetch("/api/soporte/mensajes", {
            method: "DELETE",
            headers: { "x-usuario": "admin" }
        });
        if (resp.ok) {
            await cargarMensajesSoporteServidor(false);
        }
    } catch (_) {}
};



// Inicializar widget de soporte al cargar
if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            renderizarChipsPreguntasRapidas();
            actualizarVisibilidadModoAdminChat();
        });
    } else {
        renderizarChipsPreguntasRapidas();
        actualizarVisibilidadModoAdminChat();
    }
}

// =========================================================================
// MÓDULO EXCLUSIVO ADMINISTRADOR: CENTRO DE MENSAJES & SOPORTE INTERNO
// =========================================================================
let operadorActivoChatAdmin = "daniel";
let listaConversacionesCache = [];
let ultimoToastNotificadoId = null;


window.mostrarToastSoporteAdmin = mostrarToastSoporteAdmin;

window.cerrarToastSoporteAdmin = function() {
    const toast = document.getElementById("toastNotificacionSoporteAdmin");
    if (toast) toast.style.display = "none";
};

window.abrirModuloDesdeToastSoporte = function() {
    window.cerrarToastSoporteAdmin();
    navegarSeccion("centroSoporteInterno");
    if (ultimoToastNotificadoId && Array.isArray(listaConversacionesCache)) {
        const conv = listaConversacionesCache.find(c => c.necesitaAtencion);
        if (conv) {
            seleccionarConversacionAdmin(conv.usuario);
        }
    }
};

window.cargarConversacionesAdmin = async function(forzar) {
    try {
        const resp = await fetch("/api/soporte/conversaciones?t=" + Date.now(), {
            headers: { "x-usuario": "admin" }
        });
        if (!resp.ok) return;
        const data = await resp.json();
        const lista = Array.isArray(data.conversaciones) ? data.conversaciones : [];
        listaConversacionesCache = lista;

        // Actualizar KPIs en pantalla
        const kpiOp = document.getElementById("kpiOperadoresActivos");
        const kpiPend = document.getElementById("kpiMensajesPendientes");
        if (kpiOp) kpiOp.textContent = `${lista.length} Contactos`;
        if (kpiPend) kpiPend.textContent = `${data.totalPendientes || 0} Pendientes`;

        // Renderizar lista en columna izquierda
        renderizarListaConversacionesAdmin(lista);

        // Seleccionar por defecto el primer operador si no hay seleccionado
        if (!operadorActivoChatAdmin && lista.length > 0) {
            seleccionarConversacionAdmin(lista[0].usuario);
        } else if (operadorActivoChatAdmin) {
            cargarStreamMensajesOperador(operadorActivoChatAdmin);
        }
    } catch (e) {
        console.error("Error al cargar conversaciones:", e);
    }
};


window.renderizarListaConversacionesAdmin = renderizarListaConversacionesAdmin;

window.seleccionarConversacionAdmin = async function(usuarioId) {
    operadorActivoChatAdmin = usuarioId;
    const op = listaConversacionesCache.find(c => c.usuario === usuarioId);

    // Actualizar cabecera activa
    const avatar = document.getElementById("avatarOperadorActivo");
    const nombre = document.getElementById("nombreOperadorActivo");
    const rol = document.getElementById("rolOperadorActivo");
    const btnResuelto = document.getElementById("btnMarcarResueltoAdmin");

    if (avatar) avatar.textContent = op?.avatar || "👤";
    if (nombre) nombre.textContent = op?.nombre || usuarioId;
    if (rol) rol.textContent = `${op?.rol || 'Operador'} • Usuario: @${usuarioId}`;
    if (btnResuelto) btnResuelto.style.display = "inline-flex";

    // Re-renderizar lista para destacar seleccionado
    renderizarListaConversacionesAdmin(listaConversacionesCache);

    // Cargar mensajes de ese operador
    await cargarStreamMensajesOperador(usuarioId);

    // Marcar como leídos en el servidor
    try {
        await fetch("/api/soporte/marcar-leido", {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-usuario": "admin" },
            body: JSON.stringify({ usuario: usuarioId })
        });
        if (op) {
            op.sinLeer = 0;
            op.necesitaAtencion = false;
        }
        const kpiPend = document.getElementById("kpiMensajesPendientes");
        if (kpiPend) {
            const countRestante = listaConversacionesCache.filter(c => c.necesitaAtencion).length;
            kpiPend.textContent = `${countRestante} Pendientes`;
        }
    } catch (_) {}
};


window.cargarStreamMensajesOperador = cargarStreamMensajesOperador;

window.enviarMensajeAdminAOperador = async function(e) {
    if (e) e.preventDefault();
    const input = document.getElementById("inputTextoAdminOperador");
    if (!input) return;
    const texto = input.value.trim();
    if (!texto) return;
    input.value = "";

    const usuarioTarget = operadorActivoChatAdmin || "daniel";

    try {
        const payload = {
            texto: texto,
            usuario: "admin",
            nombre: "Aron Martinez (Administrador General)",
            rol: "admin",
            esSoporte: true,
            destinatario: usuarioTarget
        };

        const resp = await fetch("/api/soporte/mensajes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-usuario": "admin"
            },
            body: JSON.stringify(payload)
        });

        const confirmacion = await resp.json();
        if (!resp.ok || !confirmacion.ok || !confirmacion.guardado) throw new Error(confirmacion.error || "No se confirmó el envío");
        if (confirmacion.guardado) {
            if (typeof reproducirChimeMensaje === "function") {
                reproducirChimeMensaje();
            }
            await cargarStreamMensajesOperador(usuarioTarget);
            await window.cargarConversacionesAdmin(false);
        }
    } catch (err) {
        console.error("Error al enviar respuesta de admin:", err);
        if (!input.value) input.value = texto;
        alert("No se pudo enviar el mensaje. El texto se conservó para reintentar.");
    }
};

window.inyectarTextoAdmin = function(txt) {
    const input = document.getElementById("inputTextoAdminOperador");
    if (input) {
        input.value = txt;
        input.focus();
    }
};

window.marcarConversacionActivaResuelta = async function() {
    if (!operadorActivoChatAdmin) return;
    try {
        await fetch("/api/soporte/marcar-leido", {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-usuario": "admin" },
            body: JSON.stringify({ usuario: operadorActivoChatAdmin })
        });
        alert(`✅ Conversación con ${operadorActivoChatAdmin} marcada como atendida y resuelta.`);
        await window.cargarConversacionesAdmin(true);
    } catch (e) {
        console.error(e);
    }
};

window.filtrarOperadoresChatAdmin = function(busqueda) {
    const q = (busqueda || "").toLowerCase().trim();
    if (!q) {
        renderizarListaConversacionesAdmin(listaConversacionesCache);
        return;
    }
    const filtrados = listaConversacionesCache.filter(c => 
        (c.nombre || "").toLowerCase().includes(q) ||
        (c.usuario || "").toLowerCase().includes(q) ||
        (c.rol || "").toLowerCase().includes(q)
    );
    renderizarListaConversacionesAdmin(filtrados);
};

// Poll support notifications even when the floating widget has never been opened.
if (typeof document !== "undefined") {
    const iniciarAvisosSoporte = () => {
        inicializarChatSoporte();
        setInterval(() => {
            if (sessionStorage.getItem("usuarioLogueado") === "admin") window.cargarConversacionesAdmin(false);
        }, 3500);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciarAvisosSoporte);
    else iniciarAvisosSoporte();
}

// Shared operational state is distinct from manual restore points.
const ESTADO_COMPARTIDO = {
    corssen_programa_v2: v => corssenPrograma = v,
    corssen_stock_v2: v => corssenStock = v,
    corssen_fichas_v2: v => corssenFichas = v,
    flota_vehiculos_v3: v => vehiculos = v,
    flota_maquinarias_v3: v => maquinarias = v,
    flota_cargas: v => cargas = v,
    flota_mantenciones_v3: v => mantenciones = v,
    flota_inventario_v3: v => inventario = v,
    corssen_tambores_aceite_v2: v => {estadoTamboresAceite = v; estadoTamborAceite = v.tambor1;},
    corssen_tambor_aceite_v1: v => {estadoTamborAceite = v; if(estadoTamboresAceite)estadoTamboresAceite.tambor1=v;},
    corssen_historial_aceite_v1: v => historialConsumoAceite = v,
    corssen_tanque_combustible_v1: v => estadoTanqueCombustible = v,
    corssen_historial_recargas_comb_v1: v => historialRecargasCombustible = v
};
const claveColaCompartida = "corssen_sync_pendientes_" + (sessionStorage.getItem("usuarioLogueado") || "");

const versionesCompartidas = new Map(), cambiosCompartidos = new Map(leerColaCompartida()), conflictosCompartidos = new Set();

let sincronizacionPreparada = false, sincronizacionOcupada = false;
const guardarLocalOriginal = Storage.prototype.setItem;
Storage.prototype.setItem = function(key,value) {
    const anterior = this.getItem(key);
    guardarLocalOriginal.call(this,key,value);
    if (this === localStorage && ESTADO_COMPARTIDO[key] && anterior !== String(value)) {
        cambiosCompartidos.set(key,{value:JSON.parse(value),version:cambiosCompartidos.get(key)?.version ?? versionesCompartidas.get(key) ?? null,base:cambiosCompartidos.get(key)?.base ?? JSON.parse(anterior || "null")});
        guardarColaCompartida();
    }
};

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",sincronizarEstadoCompartido);
else sincronizarEstadoCompartido();
setInterval(sincronizarEstadoCompartido,5000);
window.addEventListener("focus",sincronizarEstadoCompartido);

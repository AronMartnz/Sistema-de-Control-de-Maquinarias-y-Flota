-- ==========================================================
-- CORSSEN LOGÍSTICA - ESQUEMA DE BASE DE DATOS CLOUDFLARE D1
-- ==========================================================

-- 1. Tabla de Usuarios y Autenticación RBAC
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    nombre TEXT NOT NULL,
    rol TEXT NOT NULL CHECK (rol IN ('admin', 'operador')),
    avatar TEXT DEFAULT 'avatar-mecanico',
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Fichas Técnicas de Equipos y Filtros
CREATE TABLE IF NOT EXISTS corssen_fichas (
    cod TEXT PRIMARY KEY,
    equipo TEXT NOT NULL,
    marca TEXT,
    modelo TEXT,
    motor TEXT,
    chasis_vin TEXT,
    numero_serie TEXT,
    capacidad TEXT,
    anio TEXT,
    ubicacion TEXT,
    observaciones TEXT,
    filtros_json TEXT, -- JSON con array de filtros y equivalencias
    especificaciones_json TEXT,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Repuestos, Insumos y Control de Stock
CREATE TABLE IF NOT EXISTS corssen_stock (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    detalle TEXT NOT NULL,
    categoria TEXT NOT NULL,
    marca TEXT,
    modelo TEXT,
    medida TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    stock_min INTEGER NOT NULL DEFAULT 1,
    proveedor TEXT,
    compatible TEXT,
    costo REAL DEFAULT 0,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Programa Maestro de Flota y Mantenciones
CREATE TABLE IF NOT EXISTS corssen_programa (
    cod TEXT PRIMARY KEY,
    equipo TEXT NOT NULL,
    marca TEXT,
    cat TEXT NOT NULL,
    estado TEXT DEFAULT 'Operativo',
    prioridad TEXT DEFAULT 'Media',
    horometro TEXT,
    frecuencia TEXT,
    prox TEXT,
    responsable TEXT,
    observaciones TEXT,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla de Historial y Copias de Seguridad (Backups)
CREATE TABLE IF NOT EXISTS corssen_backups (
    id TEXT PRIMARY KEY,
    timestamp INTEGER NOT NULL,
    fecha TEXT NOT NULL,
    hora TEXT NOT NULL,
    motivo TEXT,
    tipo TEXT DEFAULT 'AUTOMATICO_SERVIDOR',
    usuario TEXT DEFAULT 'Sistema Corssen',
    resumen_json TEXT,
    data_json TEXT,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabla de Control de Estanque Móvil Diésel (400L / 420L)
CREATE TABLE IF NOT EXISTS corssen_combustible (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    capacidad_litros REAL DEFAULT 420,
    litros_actuales REAL DEFAULT 420,
    historial_cargas_json TEXT,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabla de Control de Tambor Aceite a Granel 15W40 (200L)
CREATE TABLE IF NOT EXISTS corssen_tambor_aceite (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    capacidad_litros REAL DEFAULT 200,
    litros_actuales REAL DEFAULT 200,
    historial_consumos_json TEXT,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- DATOS INICIALES (SEED DATA)
-- ==========================================================

-- Usuarios predeterminados del sistema
INSERT OR REPLACE INTO usuarios (usuario, password, nombre, rol, avatar)
VALUES 
('admin', '$2b$10$uYTOyaJeHb9FQfOosVFElehPB3AntqhXGSMUTUbJGjYTXv.KLx/x2', 'Administrador General', 'admin', 'avatar-admin'),
('operador', '$2b$10$qac5xGf7UI3udD4j88V/O.OiWQUFBa5qJX3Yb.V5YpbmMR8FWzYL6', 'Operador Principal', 'operador', 'avatar-mecanico');

-- Configuración inicial de combustible y tambor de aceite
INSERT OR REPLACE INTO corssen_combustible (id, capacidad_litros, litros_actuales, historial_cargas_json)
VALUES (1, 420, 380, '[]');

INSERT OR REPLACE INTO corssen_tambor_aceite (id, capacidad_litros, litros_actuales, historial_consumos_json)
VALUES (1, 200, 160, '[]');

-- Migration 0002: Agregar columna de estado de acceso para usuarios en Cloudflare D1
ALTER TABLE usuarios ADD COLUMN estado TEXT DEFAULT 'activo';

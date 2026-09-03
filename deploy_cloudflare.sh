#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "🚀 CORSSEN LOGÍSTICA - DESPLIEGUE A CLOUDFLARE"
echo "=========================================================="

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "⚠️ AVISO: No se detectó la variable CLOUDFLARE_API_TOKEN en el entorno."
    echo "   Para desplegar a tu cuenta de Cloudflare, debes configurar:"
    echo "   - CLOUDFLARE_API_TOKEN"
    echo "   - CLOUDFLARE_ACCOUNT_ID (opcional si el token tiene acceso directo)"
    echo "   O ejecutar localmente: npx wrangler login"
    echo ""
    echo "🧪 Probando empaquetado y validación de assets en modo dry-run..."
    npx wrangler deploy --dry-run
    exit 0
fi

echo "🔑 Token de Cloudflare detectado. Verificando autenticación..."
npx wrangler whoami

echo "📦 1. Creando o verificando Base de Datos Cloudflare D1 (corssen_db)..."
npx wrangler d1 create corssen_db || true

echo "🗄️ 2. Aplicando migraciones de esquema en Cloudflare D1..."
npx wrangler d1 execute corssen_db --remote --file=./migrations/0001_initial_schema.sql || true

echo "🌐 3. Desplegando Worker con Assets e integración de almacenamiento..."
npx wrangler deploy

echo "✅ Despliegue en Cloudflare completado exitosamente."

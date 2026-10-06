import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('--- Iniciando compilación de CORSSEN Logística ---');

// 1. Compilar server.ts para Node / Cloud Run
try {
  execSync('esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs', { stdio: 'inherit' });
} catch (e) {
  console.error('Error al compilar server.ts:', e);
}

// 2. Asegurar que dist/ existe
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

// 3. Sincronizar archivos raíz clave a public/ (para Cloudflare Workers Assets y Cloudflare Pages)
const rootFiles = [
  'index.html',
  'style.css',
  'script.js',
  'login.html',
  'usuarios.html',
  'logo.svg',
  'logo_isotipo.svg',
  'usuarios.json',
  'config_servicio.json',
  'config_mantenimiento.json'
];

if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

for (const file of rootFiles) {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('public', file));
    console.log(`Sincronizado ${file} -> public/${file}`);
  }
}

// 4. Copiar todos los archivos de public/ a dist/
const publicFiles = fs.readdirSync('public');
for (const file of publicFiles) {
  const src = path.join('public', file);
  const dest = path.join('dist', file);
  if (fs.statSync(src).isFile()) {
    fs.copyFileSync(src, dest);
    console.log(`Copiado public/${file} -> dist/${file}`);
  }
}

console.log('--- Build finalizado con éxito para Cloudflare y Node.js ---');

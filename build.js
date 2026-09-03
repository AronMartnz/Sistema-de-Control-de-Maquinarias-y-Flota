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

// 3. Copiar todos los archivos de public/ a dist/
if (fs.existsSync('public')) {
  const publicFiles = fs.readdirSync('public');
  for (const file of publicFiles) {
    const src = path.join('public', file);
    const dest = path.join('dist', file);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
      console.log(`Copiado public/${file} -> dist/${file}`);
    }
  }
}

// 4. Copiar archivos raíz clave a dist/ si no estaban
const rootFiles = [
  'index.html',
  'style.css',
  'script.js',
  'login.html',
  'usuarios.html',
  'logo.svg',
  'logo_isotipo.svg',
  'usuarios.json'
];

for (const file of rootFiles) {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('dist', file));
    console.log(`Copiado ${file} -> dist/${file}`);
  }
}

console.log('--- Build finalizado con éxito para Cloudflare y Node.js ---');

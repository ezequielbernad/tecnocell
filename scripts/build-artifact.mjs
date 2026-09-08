/**
 * Genera una versión de la web en un único archivo HTML (CSS y JS embebidos).
 * Sirve para publicarla como página estática o para compartirla sin servidor.
 *
 *   npm run build:artifact   →   artifact/tecnocell.html
 *
 * Usa rutas por hash (#/smartphones) porque no hay servidor que reescriba URLs.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = join(root, 'dist-artifact');

execFileSync(process.execPath, [join(root, 'node_modules', 'vite', 'bin', 'vite.js'), 'build'], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, VITE_HASH_ROUTER: '1' },
});

const css = readFileSync(join(out, 'app.css'), 'utf8');
const js = readFileSync(join(out, 'app.js'), 'utf8');

const fonts =
  'https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=Manrope:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';

const html = `<title>Tecnocell</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fonts}">
<style>
${css}
</style>
<div id="root"></div>
<script>
${js}
</script>
`;

const dir = join(root, 'artifact');
mkdirSync(dir, { recursive: true });
const file = join(dir, 'tecnocell.html');
writeFileSync(file, html, 'utf8');

console.log(`\nArchivo único: ${file} (${(html.length / 1024).toFixed(0)} kB)`);

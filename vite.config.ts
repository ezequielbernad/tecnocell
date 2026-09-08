import { realpathSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// La raíz se resuelve a su ruta real: en Windows algunas carpetas se acceden a
// través de rutas redirigidas y Vite necesita la ruta canónica para servir los
// módulos transformados.
const root = realpathSync(dirname(fileURLToPath(import.meta.url)));

/**
 * VITE_HASH_ROUTER=1 → build de un solo archivo (ver scripts/build-artifact.mjs):
 * rutas por hash, sin división de código y CSS en un único archivo, para poder
 * publicarlo en cualquier hosting estático sin reescritura de rutas.
 */
const singleFile = process.env.VITE_HASH_ROUTER === '1';

export default defineConfig({
  root,
  plugins: [react()],
  base: './',
  define: {
    'import.meta.env.VITE_HASH_ROUTER': JSON.stringify(singleFile ? '1' : '0'),
  },
  build: {
    outDir: singleFile ? 'dist-artifact' : 'dist',
    assetsInlineLimit: 4096,
    cssCodeSplit: false,
    rollupOptions: singleFile
      ? {
          output: {
            format: 'iife',
            inlineDynamicImports: true,
            entryFileNames: 'app.js',
            assetFileNames: 'app.[ext]',
          },
        }
      : undefined,
  },
});

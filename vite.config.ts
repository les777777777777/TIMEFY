import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import fs from 'fs';

// Auto-copy generated PWA icons
const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const sourcePath = path.resolve(process.cwd(), 'src/assets/images/kairos_icon_1779573018228.png');
if (fs.existsSync(sourcePath)) {
  fs.copyFileSync(sourcePath, path.join(publicDir, 'icon-512.png'));
  fs.copyFileSync(sourcePath, path.join(publicDir, 'icon-192.png'));
  console.log('PWA Icons successfully copied!');
} else {
  const imgDir = path.resolve(process.cwd(), 'src/assets/images');
  if (fs.existsSync(imgDir)) {
    const files = fs.readdirSync(imgDir);
    const iconFile = files.find(f => f.startsWith('kairos_icon') && f.endsWith('.png'));
    if (iconFile) {
      fs.copyFileSync(path.join(imgDir, iconFile), path.join(publicDir, 'icon-512.png'));
      fs.copyFileSync(path.join(imgDir, iconFile), path.join(publicDir, 'icon-192.png'));
      console.log('PWA Icons copied from auto-detected file:', iconFile);
    }
  }
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: './',
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});

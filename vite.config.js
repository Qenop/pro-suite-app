console.log('>>> vite.config.js is loaded <<<');

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ command }) => {
  console.log('Vite command:', command);

  const isBuild = command === 'build';
  if (isBuild) console.log('Including visualizer plugin...');

  return {
    plugins: [
      react(),
      ...(isBuild ? [visualizer({
        filename: 'bundle-analysis.html',
        open: false,  // set false to avoid auto open for now
        gzipSize: true,
        brotliSize: true,
      })] : []),
    ],
  };
});

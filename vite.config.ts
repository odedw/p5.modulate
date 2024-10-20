// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      entry: resolve(__dirname, 'main.ts'),
      name: 'p5Modulate',
      fileName: (format) => `p5.modulate.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['p5'],
      output: {
        globals: {
          p5: 'p5',
        },
      },
    },
  },
});

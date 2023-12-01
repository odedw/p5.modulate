// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'main.ts'),
      name: 'p5.modulate',
      // the proper extensions will be added
      fileName: 'p5.modulate',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['p5'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          p5: 'p5',
        },
      },
    },
  },
});

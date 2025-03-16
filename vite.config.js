import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'main.js'),
        processing: path.resolve(__dirname, 'processing.js'),
        index: path.resolve(__dirname, 'index.html'),
        load: path.resolve(__dirname, 'load.html'),
        decoder: path.resolve(__dirname, 'decoder.js'),
      },
    },
  },
});
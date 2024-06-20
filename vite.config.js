import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import path from "path";

export default defineConfig({
  plugins: [glsl()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'three': path.resolve(__dirname, 'node_modules/three')
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './src/main.js',
    },
  },
});

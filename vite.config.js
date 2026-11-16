import { defineConfig } from 'vite';

export default defineConfig({
  base: '/SHADOW-PROTOCOL/',
  server: { host: true },
  build: { target: 'es2022' }
});

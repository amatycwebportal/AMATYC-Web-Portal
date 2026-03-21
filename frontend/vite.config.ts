import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@backend': path.resolve(__dirname, '../backend'),
      '@shared': path.resolve(__dirname, '../shared'),
      '@lib': path.resolve(__dirname, '../backend/src/lib'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@theme': path.resolve(__dirname, './src/theme'),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000", // your backend API
        changeOrigin: true,
        secure: false,
      },
      "/universities": {
        target: "https://universities.hipolabs.com", // external university API
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/universities/, "/search"), // API path
      },
    },
  },
});

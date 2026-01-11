import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  envDir: '../',
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: [
      '.trycloudflare.com',
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
    hmr: {
      clientPort: 443,
    },
  },
});

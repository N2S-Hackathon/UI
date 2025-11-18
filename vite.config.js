import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://barbie-euplastic-gibbously.ngrok-free.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Add Basic Auth header
            const credentials = Buffer.from('noise2signal:zestyIsAOK').toString('base64');
            proxyReq.setHeader('Authorization', `Basic ${credentials}`);
            proxyReq.setHeader('ngrok-skip-browser-warning', 'true');
          });
        }
      }
    }
  }
})


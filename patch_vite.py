import re

with open('vite.config.ts', 'r') as f:
    content = f.read()

new_config = """import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage'],
            ui: ['lucide-react', 'motion/react']
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
"""

with open('vite.config.ts', 'w') as f:
    f.write(new_config)


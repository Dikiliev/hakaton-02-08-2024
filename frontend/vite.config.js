import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";
import { resolve } from 'path';

export default defineConfig({
  optimizeDeps: {
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@mui/material/Tooltip'
    ],
  },

  plugins: [react(), svgr()],

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@utils': resolve(__dirname, './src/utils'),
      '@store': resolve(__dirname, './src/store'),

      '@assets': resolve(__dirname, './src/assets'),
      '@styles': resolve(__dirname, './src/styles'),
    }
  }
})

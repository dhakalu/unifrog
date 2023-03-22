import { defineConfig } from 'vite'
import mfes from '@unifrog/vite-plugin-mfes'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mfes({
      name: 'app',
      remotes: {
        dummyApp: 'dummy.js',
      },
      shared: ['react','react-dom']
    })
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: ['./src/index.ts'],
      formats: ['es', 'cjs']
    },
    target: 'node18',
    minify: false,
    rollupOptions: {
      external: ['fs', 'path', 'crypto', 'magic-string'],
      output: {
        minifyInternalExports: false
      }
    }
  }
})
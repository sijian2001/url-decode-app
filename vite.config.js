import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/index.html'
    }
  },
  server: {
    port: 5173,
    open: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['../tests/setup.js'],
    // Only run unit/integration/performance in Vitest; Playwright specs are run via npm run test:e2e
    include: [
      '../tests/unit/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      '../tests/integration/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      '../tests/performance/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ]
  }
});

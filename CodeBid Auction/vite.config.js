import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Move all dependencies to a separate chunk
          }
        }
      }
    },
    chunkSizeWarningLimit: 700, // Increase the limit to avoid warnings (optional)
  }
});

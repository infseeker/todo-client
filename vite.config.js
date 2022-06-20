import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [vue()],
    server: {
      host: '0.0.0.0',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {},

    css: {
      devSourcemap: true,
    },

    esbuild: {
      // drop: ['console', 'debugger'],
    },
  };
});

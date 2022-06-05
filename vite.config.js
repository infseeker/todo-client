import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [vue()],
    server: {
      host: env.HOST
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        // vue: 'vue/dist/vue.esm-bundler.js'
      },
    },
    define: {
      api: JSON.stringify(env.API_URL)
    },
  
    css: {
      devSourcemap: true,
    },
  }
});

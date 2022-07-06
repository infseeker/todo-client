import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default ({ command, mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    plugins: [vue()],
    server: {
      host: '0.0.0.0',
      proxy: {
        '/todo/api': {
          target: process.env.VITE_API_SERVER,
        },
      }
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
      drop: ['console', 'debugger'],
    },
  });
};

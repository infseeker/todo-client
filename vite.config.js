import { defineConfig, loadEnv } from 'vite';
import path, { resolve } from 'path';

import vue from '@vitejs/plugin-vue';
import ViteI18n from '@intlify/vite-plugin-vue-i18n';

export default ({ command, mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [
      vue(),
      ViteI18n({
        include: [resolve(__dirname, './src/locales/**')],
      }),
    ],

    server: {
      host: '0.0.0.0',
      proxy: {
        '/todo/api': {
          target: process.env.VITE_API_SERVER,
        },
      },
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    define: {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false,
    },

    css: {
      devSourcemap: true,
    },

    esbuild: {
      drop: ['console', 'debugger'],
    },

    build: {
      chunkSizeWarningLimit: 1600,
    },
  });
};

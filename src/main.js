import { createApp, reactive } from 'vue';
import { user } from './models/User';

import { createI18n } from 'vue-i18n';
import messages from '@intlify/vite-plugin-vue-i18n/messages';
import { getDefaultLocale } from './helpers/i18n';

import Toast, { useToast, POSITION } from 'vue-toastification';
import { loader } from './helpers/loader';

import 'bootstrap';
import 'vue-toastification/dist/index.css';
import 'vue-loading-overlay/dist/vue-loading.css';
import './assets/css/boxicons.css';
import './assets/css/sneat-theme-core.min.css';
import './assets/css/sneat-theme-default.min.css';
import './assets/css/sneat-theme-custom.css';

import App from './App.vue';
import router from '@/router';

export const app = createApp(App);

app.config.globalProperties.$user = reactive(user);
app.config.globalProperties.$store = reactive({ lists: [] });
app.config.globalProperties.$loader = reactive(loader);
app.config.globalProperties.$toast = useToast();

const toast = {
  position: POSITION.BOTTOM_RIGHT,
  timeout: 8000,
  maxToasts: 5,
  newestOnTop: true,
  transition: 'Vue-Toastification__fade',
};

const i18n = createI18n({
  messages,
  locale: getDefaultLocale(),
  fallbackLocale: getDefaultLocale(),
});

app.use(router).use(i18n).use(Toast, toast).mount('#app');

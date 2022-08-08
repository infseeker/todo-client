import { createApp, reactive } from 'vue';

import { createI18n } from 'vue-i18n';
import { getBrowserLocale, getLocaleMessages } from './helpers/i18n';

import Toast, { useToast, POSITION } from 'vue-toastification';
import { loader } from './helpers/loader';

import { user } from './models/User';

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
const $user = app.config.globalProperties.$user;

app.config.globalProperties.$store = reactive({ lists: [] });
app.config.globalProperties.$loader = reactive(loader);
app.config.globalProperties.$toast = useToast();

$user.locale = getBrowserLocale({ countryCodeOnly: true }) || 'en';

const i18n = createI18n({
  locale: $user.locale,
  messages: await getLocaleMessages($user.locale),
});

const toast = {
  position: POSITION.BOTTOM_RIGHT,
  timeout: 8000,
  maxToasts: 5,
  newestOnTop: true,
  transition: 'Vue-Toastification__fade',
};

app.use(router).use(i18n).use(Toast, toast).mount('#app');

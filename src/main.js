import { createApp, reactive } from 'vue';

import { user } from './models/User';
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

app
  .use(router)
  .use(Toast, {
    position: POSITION.BOTTOM_RIGHT,
    timeout: 8000,
    maxToasts: 5,
    newestOnTop: true,
    transition: 'Vue-Toastification__fade',
  })
  .mount('#app');

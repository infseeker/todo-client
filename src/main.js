import { createApp, reactive } from 'vue';
import { VueReCaptcha } from 'vue-recaptcha-v3';

import { user } from './models/User';

import 'bootstrap';

import 'boxicons/css/boxicons.min.css';
import './assets/css/sneat-theme-core.min.css';
import './assets/css/sneat-theme-default.min.css';
import './assets/css/sneat-theme-custom.css';

import App from './App.vue';
import router from '@/router';

export const app = createApp(App);

app.config.globalProperties.$user = reactive(user);
app.config.globalProperties.$store = reactive({});
app.config.globalProperties.$store.lists = [];

app
  .use(router)
  .use(VueReCaptcha, { siteKey: '6LcX-58gAAAAAJ94B93UPTv-K3YnLZn8J3M2j-wr' })
  .mount('#app');

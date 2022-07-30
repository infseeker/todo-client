import { createApp, reactive } from 'vue';

import { user } from './models/User';
import { loader } from './helpers/loader'

import 'bootstrap';

import 'boxicons/css/boxicons.min.css';
import 'vue-loading-overlay/dist/vue-loading.css';
import './assets/css/sneat-theme-core.min.css';
import './assets/css/sneat-theme-default.min.css';
import './assets/css/sneat-theme-custom.css';

import App from './App.vue';
import router from '@/router';

export const app = createApp(App);

app.config.globalProperties.$user = reactive(user);
app.config.globalProperties.$store = reactive({ lists: [] });
app.config.globalProperties.$loader = reactive(loader);

app.use(router).mount('#app');

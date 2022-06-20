import { createApp, reactive } from 'vue';
import { user } from './models/User';
import { csrf } from './models/CSRF';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import App from './App.vue';
import router from '@/router';

export const app = createApp(App);

app.config.globalProperties.$user = reactive(user);
app.config.globalProperties.$csrf = reactive(csrf);
app.config.globalProperties.$store = reactive({});

app.use(router).mount('#app');

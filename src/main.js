import { createApp, ref, reactive } from 'vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import App from './App.vue';
import router from '@/router';

export const app = createApp(App);

app.config.globalProperties.$user = reactive({});
app.config.globalProperties.$csrf = reactive({});
app.config.globalProperties.$store = reactive({});

app.use(router).mount('#app');

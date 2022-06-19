import { createApp } from 'vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import App from './App.vue';
import router from '@/router';

export const app = createApp(App);

app.config.globalProperties.$user = {
  isAuth: false,
  isAdmin: false,
  isLoaded: false,

  login: function (data) {
    this.isAuth = data.login || false;
    this.isAdmin = data.admin || false;
    this.isDeleted = data.deleted || false;
  },

  logout: function () {
    this.isAuth = false;
    this.isAdmin = false;
  },
};

app.config.globalProperties.$csrf = { token: '' };

app.config.globalProperties.$store = {};

app.use(router).mount('#app');

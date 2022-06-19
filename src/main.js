import { createApp } from 'vue';
import UserService from './services/UserService'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import App from './App.vue';
import router from '@/router';

export const app = createApp(App);

app.config.globalProperties.$user = {};
app.config.globalProperties.$csrf = { token: '' };
app.config.globalProperties.$store = {};

UserService.getSession().then((data) => {
  const user = app.config.globalProperties.$user;
  const csrf = app.config.globalProperties.$csrf;

  user.isLoaded = true;
  user.isAuth = data.login || false;
  user.isAdmin = data.admin || false;

  user.login = function (data) {
    this.isAuth = data.login || false;
    this.isAdmin = data.admin || false;
    this.isDeleted = data.deleted || false;
  };


  user.logout = function () {
    this.isAuth = false;
    this.isAdmin = false;
  };

  UserService.getCSRFToken().then((res) => {
    csrf.token = res.headers.get(['X-CSRFToken']);
  });

  console.log('Before user load:', user, csrf);
  
  app.use(router).mount('#app');

  router.beforeResolve((to) => {
    console.log(user);
    if (to.meta.authRequired && !user.isAuth) {
      router.push({ name: 'login' });
      console.log({ message: 'You are not authenticated' });
    }

    if (to.meta.adminRequired && !user.isAdmin) {
      router.push({ name: 'login' });
      console.log({ message: 'You do not have permissions enough' });
    }

    if (to.meta.guestRequired && user.isAuth) {
      if (user.isAdmin) {
        router.push({ name: 'admin-users' });
      } else {
        router.push({ name: 'lists' });
      }
    }
  });
});

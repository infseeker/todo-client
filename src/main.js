import { createApp } from 'vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import App from './App.vue';
import router from '@/router';
import UserService from './services/UserService';

const app = createApp(App);

app.config.globalProperties.$user = {
  isAuth: false,
  isAdmin: false,
  isLoaded: false
};

app.config.globalProperties.$store = {};

router.beforeResolve(async (to) => {
  const user = app.config.globalProperties.$user;

  function checkPermissions() {
    if (to.meta.authRequired && !user.isAuth) {
      router.push({ name: 'login' });
      console.log({ message: 'You are not authenticated' });
    }

    if (to.meta.adminRequired && !user.isAdmin) {
      router.push({ name: 'login' });
      console.log({ message: 'You do not have permissions enough' });
    }
  }

  if (!user.isLoaded) {
    await UserService.getSession().then((data) => {
      user.isLoaded = true;
      user.isAuth = data.login || false;
      user.isAdmin = data.admin || false;

      console.log(user);
      checkPermissions();
    });
  } else {
    console.log(user);
    checkPermissions();
  }
});

app.use(router).mount('#app');

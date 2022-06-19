<template>
  <router-link to="/settings">Настройки</router-link>
  <router-link to="/">Гостевая</router-link>
  <router-link to="/login">Авторизация</router-link>
  <router-link to="/registration">Регистрация</router-link>
  <router-link to="/lists">Списки</router-link>
  <router-link to="/profile">Профиль</router-link>
  <router-link to="/admin/users">Админ юзеры</router-link>
  <router-link to="/admin/users/656">Админ юзер 656</router-link>

  <router-view></router-view>

  <button
    class="btn btn-primary"
    data-bs-target="#collapseTarget"
    data-bs-toggle="collapse"
  >
    Bootstrap collapse
  </button>

  <div class="collapse py-2" id="collapseTarget">
    This is the toggle-able content!
  </div>
</template>

<script>
import UserService from './services/UserService';

export default {
  async beforeCreate() {
    const csrf = this.$csrf;
    const router = this.$router;
    const user = this.$user;

    await router.beforeResolve(async (to) => {
      function checkPermissions() {
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
      }

      if (!user.isLoaded) {
        await UserService.getSession().then(async (data) => {
          user.isLoaded = true;
          user.isAuth = data.login || false;
          user.isAdmin = data.admin || false;

          console.log('Before user load:', user);
          checkPermissions();

          await UserService.getCSRFToken().then((res) => {
            csrf.token = res.headers.get([
              'X-CSRFToken',
            ]);
          });
        });
      } else {
        console.log('After user load:', user);
        checkPermissions();
      }
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

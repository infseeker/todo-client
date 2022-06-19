<template>
  <UserNavigation v-if="user.isLoaded"></UserNavigation>
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
import { ref, reactive } from 'vue';
import { app } from './main.js';
import UserService from './services/UserService';
import UserNavigation from './components/user/UserNavigation.vue';

export default {
  components: {
    UserNavigation,
  },

  data() {
    return {
      user: this.$user,
    };
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

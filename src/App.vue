<template>
  <UserNavigation></UserNavigation>
  <div>{{ this.$user }}}</div>
  <router-link to="/settings">Настройки</router-link>
  <router-link to="/">Гостевая</router-link>
  <router-link to="/login">Авторизация</router-link>
  <router-link to="/registration">Регистрация</router-link>
  <router-link to="/lists">Списки</router-link>
  <router-link to="/profile">Профиль</router-link>
  <router-link to="/admin/users">Админ юзеры</router-link>
  <router-link to="/admin/users/656">Админ юзер 656</router-link>

  <router-view></router-view>
</template>

<script>
import UserService from './services/UserService';
import UserNavigation from './components/user/UserNavigation.vue';

export default {
  components: {
    UserNavigation,
  },

  data() {
    return {};
  },

  methods: {
    loadAuthData() {
      // Load user auth data
      UserService.getSession().then((data) => {
        this.$user.setAuthData(data);

        // Set first and other routes depend of user permissions
        this.$router.setInitialRouteByUserPermissions(this.$route, this.$user);
      });

      // Load and set csrf token
      UserService.getCSRFToken().then((res) => {
        this.$csrf.setToken(res.headers.get(['X-CSRFToken']));
      });
    },
  },

  created() {
    this.loadAuthData();
  },
};
</script>

<template>
  <UserNavigation v-if="user.isLoaded"></UserNavigation>
  <div>{{user}}</div>
  <router-link to="/settings">Настройки</router-link>
  <router-link to="/">Гостевая</router-link>
  <router-link to="/login">Авторизация</router-link>
  <router-link to="/registration">Регистрация</router-link>
  <router-link to="/lists">Списки</router-link>
  <router-link to="/profile">Профиль</router-link>
  <router-link to="/admin/users">Админ юзеры</router-link>
  <router-link to="/admin/users/656">Админ юзер 656</router-link>

  <router-view></router-view>

  <div class="collapse py-2" id="collapseTarget">
    This is the toggle-able content!
  </div>
</template>

<script>
import UserService from './services/UserService';
import UserNavigation from './components/user/UserNavigation.vue';

export default {
  components: {
    UserNavigation,
  },

  data() {
    return {
      user: {},
    };
  },

  methods: {
    loadUserAuthData() {
      UserService.getSession().then((data) => {
        this.$user.isLoaded = true;
        this.$user.isAuth = data.login || false;
        this.$user.isAdmin = data.admin || false;

        this.$user.login = function (data) {
          this.isAuth = data.login || false;
          this.isAdmin = data.admin || false;
          this.isDeleted = data.deleted || false;
        };

        this.$user.logout = function () {
          this.isAuth = false;
          this.isAdmin = false;
        };

        this.user = this.$user;
        console.log('Before user load:', this.$user, this.$csrf);

        this.setOriginRoute(this.$route, this.$user);

        const router = this.$router;
        router.beforeResolve((to) => {
          this.setOriginRoute(to, this.$user);
        });
      });
    },

    setOriginRoute(route, user) {
      const router = this.$router;
      if (route.meta.authRequired && !user.isAuth) {
        router.push({ name: 'login' });
        console.log({ message: 'You are not authenticated' });
      }

      if (route.meta.adminRequired && !user.isAdmin) {
        router.push({ name: 'login' });
        console.log({ message: 'You do not have permissions enough' });
      }

      if (route.meta.guestRequired && user.isAuth) {
        if (user.isAdmin) {
          router.push({ name: 'admin-users' });
        } else {
          router.push({ name: 'lists' });
        }
        console.log({message: 'You are already logged in'})
      }
    },
  },

  created() {
    UserService.getCSRFToken().then((res) => {
      this.$csrf.token = res.headers.get(['X-CSRFToken']);
    });
  },

  beforeMount() {
    this.loadUserAuthData();
  },

  mounted() {
    console.log(this.$user);
  }
};
</script>

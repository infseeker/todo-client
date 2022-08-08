<template>
  <div>
    <loading v-model:active="this.$loader.shown" loader="dots" :height="100" :width="100" color="#696cff"></loading>

    <div v-if="isLoaded" class="container-sm bg-gray-50 dark bg-gray-900">
      <user-navigation v-if="!this.$route.meta.hideNav"></user-navigation>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import UserService from './services/UserService';
import UserNavigation from './components/user/NavBar.vue';

export default {
  data() {
    return {
      isLoaded: false,
    }
  },

  components: {
    Loading,
    UserNavigation,
  },

  methods: {
    loadAuthData() {
      this.$loader.show();

      // Load user auth data
      UserService.getSession().then((data) => {
        this.$user.login(data);

        // Set first and other routes depend of user permissions
        this.$router.setInitialRouteByUserPermissions(this.$route, this.$user);
      });

      // Load and set csrf token
      UserService.getCSRFToken().then((r) => {
        if (r.code === 200) {
          this.$loader.hide();
          this.isLoaded = true;
        } else {
          this.$toast.error('Не удалось загрузить CSRF-токен, перезагрузите страницу');
        }
      });
    },
  },

  mounted() {
    this.loadAuthData();
  }
};
</script>
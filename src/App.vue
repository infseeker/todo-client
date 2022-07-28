<template>
<div>
  <loading v-model:active="this.$isLoading.value"></loading>
  <div class="container-sm bg-gray-50 dark bg-gray-900">
    <UserNavigation v-if="!this.$route.meta.hideNav"></UserNavigation>
    <router-view></router-view>
  </div>
</div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import UserService from './services/UserService';
import UserNavigation from './components/user/UserNavigation.vue';

export default {
  computed: {
    currentRoute() {
      return this.$route
    }
  },

  components: {
    Loading,
    UserNavigation,
  },

  methods: {
    loadAuthData() {
      // Load user auth data
      UserService.getSession().then((data) => {
        this.$user.login(data);

        // Set first and other routes depend of user permissions
        this.$router.setInitialRouteByUserPermissions(this.$route, this.$user);
      });

      // Load and set csrf token
      UserService.getCSRFToken();
    },
  },

  mounted() {
    this.loadAuthData();
  }
};
</script>

<style>
</style>
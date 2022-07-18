<template>
  <div class="container-sm bg-gray-50 dark bg-gray-900">
    <UserNavigation v-if="!this.$route.meta.hideNav"></UserNavigation>
    <router-view></router-view>
  </div>
</template>

<script>
import UserService from './services/UserService';
import UserNavigation from './components/user/UserNavigation.vue';

export default {
  computed: {
    currentRoute() {
      return this.$route
    }
  },

  components: {
    UserNavigation,
  },

  methods: {
    loadAuthData() {
      // Load user auth data
      this.$user.initialPath = window.location.pathname
      console.log(this.$user);

      UserService.getSession().then((data) => {
        this.$user.login(data);

        // Set first and other routes depend of user permissions
        this.$router.setInitialRouteByUserPermissions(this.$router.resolve({ path: this.$user.initialPath }), this.$user);
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
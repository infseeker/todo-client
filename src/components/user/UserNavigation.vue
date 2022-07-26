<template>
  <nav class="layout-navbar navbar navbar-detached align-items-center bg-navbar-theme">
    <div class="navbar-nav-right d-flex align-items-center">

      <router-link :to="{ name: 'home' }" class="align-items-center home-link">
        <i v-if="this.$user.isAdmin" class='bx bx-news'></i>
        <i v-else class='bx bx-list-check'></i>
      </router-link>

      <ul class="navbar-nav flex-row align-items-center ms-auto">
        <li v-if="!this.$user.isAuth">
          <router-link :to="{ name: 'registration' }" class="btn btn-primary" title="Регистрация">
            <i class='bx bx-user-plus'></i>
          </router-link>
        </li>

        <li v-if="!this.$user.isAuth">
          <router-link :to="{ name: 'login' }" class="btn btn-primary ms-2" title="Вход">
            <i class='bx bx-log-in'></i>
          </router-link>
        </li>

        <li v-if="this.$user.isAuth && this.$user.isAdmin">
          <router-link :to="{ name: 'lists' }" class="btn btn-primary ms-2" title="Мои списки">
            <i class='bx bx-list-check'></i>
          </router-link>
        </li>
        
        <li v-if="this.$user.isAuth">
          <router-link :to="{ name: 'profile' }" class="btn btn-primary ms-2" title="Профиль">
            <i class='bx bx-user'></i>
          </router-link>
        </li>

        <li v-if="this.$user.isAuth">
          <a href="/logout" onclick="event.preventDefault(); event.stopPropagation();" @click="logout"
            style="cursor: pointer" class="btn btn-primary ms-2" title="Выход"><i class='bx bx-log-out'></i></a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import UserService from '../../services/UserService';

export default {
  data() {
    return {
    };
  },

  methods: {
    logout() {
      UserService.logout().then((data) => {
        this.$user.logout();
        this.$store.lists = [];

        this.$router.push('/');

        console.log(data);
      });
    },
  }
};
</script>

<style scoped>
.btn {
  font-weight: 600;
}
</style>

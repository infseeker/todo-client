<template>
  <nav class="layout-navbar navbar navbar-detached align-items-center bg-navbar-theme">
    <div class="navbar-nav-right d-flex align-items-center">
      <router-link :to="{ name: 'home' }" class="navbar-nav align-items-center fs-4">
        <i class='bx bxs-cat' style="font-size: 3rem;"></i>
      </router-link>
      <ul class="navbar-nav flex-row align-items-center ms-auto">
        <li v-if="!this.$user.isAuth">
          <router-link :to="{ name: 'registration' }" class="btn btn-primary">Регистрация</router-link>
        </li>
        <li v-if="!this.$user.isAuth">
          <router-link :to="{ name: 'login' }" class="btn btn-primary ms-2">Вход</router-link>
        </li>
        <li v-if="this.$user.isAuth && this.$user.isAdmin">
          <router-link :to="{ name: 'registration' }" class="btn btn-primary ms-2">Админка</router-link>
        </li>
        <li v-if="this.$user.isAuth">
          <router-link :to="{ name: 'profile' }" class="btn btn-primary ms-2">Профиль</router-link>
        </li>
        <li v-if="this.$user.isAuth">
          <a href="/logout" onclick="event.preventDefault(); event.stopPropagation();" @click="logout"
            style="cursor: pointer" class="btn btn-primary ms-2">Выход</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import UserService from '../../services/UserService';

export default {
  data() {
    return {};
  },

  methods: {
    logout() {
      UserService.logout().then((data) => {
        this.$user.logout();
        this.$router.push('/');

        console.log(data);
      });
    },
  },
};
</script>

<style scoped>
.btn {
  font-weight: 600;
}
</style>

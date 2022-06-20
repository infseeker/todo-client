<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link
        v-if="!this.$user.isAuth"
        :to="{ name: 'home' }"
        class="navbar-brand"
        >ToDo by @infseeker</router-link
      >
      <router-link
        v-if="this.$user.isAuth && !this.$user.isAdmin"
        :to="{ name: 'lists' }"
        class="navbar-brand"
        >ToDo by @infseeker</router-link
      >
      <router-link
        v-if="this.$user.isAuth && this.$user.isAdmin"
        :to="{ name: 'admin-users' }"
        class="navbar-brand"
        >ToDo by @infseeker</router-link
      >
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item" v-if="!this.$user.isAuth">
            <router-link :to="{ name: 'login' }" class="nav-link"
              >Вход</router-link
            >
          </li>
          <li class="nav-item" v-if="!this.$user.isAuth">
            <router-link :to="{ name: 'registration' }" class="nav-link"
              >Регистрация</router-link
            >
          </li>
          <li class="nav-item" v-if="this.$user.isAuth && this.$user.isAdmin">
            <router-link :to="{ name: 'registration' }" class="nav-link"
              >Админка</router-link
            >
          </li>
          <li class="nav-item" v-if="this.$user.isAuth">
            <router-link :to="{ name: 'profile' }" class="nav-link"
              >Профиль</router-link
            >
          </li>
          <li class="nav-item" v-if="this.$user.isAuth">
            <a
              href="/logout"
              onclick="event.preventDefault(); event.stopPropagation();"
              @click="logout"
              class="nav-link"
              style="cursor: pointer"
              >Выход</a
            >
          </li>
        </ul>
      </div>
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

<style></style>

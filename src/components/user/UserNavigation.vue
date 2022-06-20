<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">ToDo by @infseeker</a>
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
        <ul class="navbar-nav ms-auto" v-if="!user.isAuth">
          <li class="nav-item">
            <router-link :to="{name: 'login'}" class="nav-link">Вход</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{name: 'registration'}" class="nav-link">Регистрация</router-link>
          </li>
        </ul>

        <ul class="navbar-nav ms-auto" v-if="user.isAuth && !user.isAdmin">
          <li class="nav-item">
            <router-link :to="{name: 'profile'}" class="nav-link">Профиль</router-link>
          </li>
          <li class="nav-item">
            <a @click="logout" class="nav-link" style="cursor: pointer">Выход</a>
          </li>
        </ul>

        <ul class="navbar-nav ms-auto" v-if="user.isAuth && user.isAdmin">
          <li class="nav-item">
            <a class="nav-link" href="#">Админка</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Профиль</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Выход</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import UserService from '../../services/UserService'


export default {
  data() {
    return {
      user: this.$user,
    };
  },

  methods: {
    async logout() {
      await UserService.logout().then((data) => {
        this.$user.logout();
        this.$router.push('/')
        console.log(data);
        console.log(this.$user);
      });
    }
  },

  mounted() {
    console.log(this.$user)
    // this.user = this.$user
  }
};
</script>

<style></style>

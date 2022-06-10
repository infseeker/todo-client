<template>
  <router-link to="/">Главная</router-link>
  <router-link to="/login">Авторизация</router-link>
  <router-link to="/registration">Регистрация</router-link>

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
export default {};
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

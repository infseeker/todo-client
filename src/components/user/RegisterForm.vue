<template>
  <div class="login-form">
    <input placeholder="username" v-model="username" />
    <br />
    <br />
    <input placeholder="email" v-model="email" />
    <br />
    <br />
    <input placeholder="password" v-model="password" />
    <br />
    <br />
    <button @click="register(username, email, password)">Register</button>
  </div>
</template>

<script>
export default {
  name: 'register-form',
  data() {
    return {};
  },
};
</script>

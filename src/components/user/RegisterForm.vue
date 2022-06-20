<template>
  <div class="login-form">
    <input placeholder="username" v-model="user.username" />
    <br />
    <br />
    <input placeholder="email" v-model="user.email" />
    <br />
    <br />
    <input placeholder="password" v-model="user.password" />
    <br />
    <br />
    <button @click="register(user.username, user.email, user.password)">Register</button>
  </div>
</template>

<script>
export default {
  name: 'register-form',
  data() {
    return {
      user: {}
    };
  },
};
</script>

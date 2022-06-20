<template>
  <div class="login-form">
    <input placeholder="введите имя / email" v-model="user.username" /><br />
    <br />
    <input placeholder="введите пароль" v-model="user.password" />
    <br />
    <br />
    <button @click="login(user.username, user.password)">Войти</button>
  </div>
</template>

<script>
import UserService from '../../services/UserService'

export default {
  name: 'login-form',
  data() {
    return {
      user: {},
    };
  },

  methods: {
    async login(username, password) {
      console.log(username, password);
      await UserService.login(username, password).then((data) => {
        this.$user.login(data);

        if (this.$user.isAuth) {
          if (this.$user.isAdmin) {
            this.$router.push({ name: 'admin-users' });
          } else {
            this.$router.push({ name: 'lists' });
          }
        }

        if (this.$user.isDeleted) {
          alert('Your account was deleted. You may restore it.');
        }
      });
    },
  },
};
</script>

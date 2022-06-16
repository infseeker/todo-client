<template>
  <TodoList v-if="!user.isAuth"></TodoList>
  <TodoLists v-if="user.isAuth && !user.isAdmin"></TodoLists>
  <UserList v-if="user.isAuth && user.isAdmin"></UserList>

  <button id="csrf" @click="getCSRF">CSRF</button>
  <br />
  <br />
  <input placeholder="username" v-model="username" />
  <button @click="checkUsername(username)">Check Username</button>
  <br />
  <br />
  <input placeholder="email" v-model="email" />
  <button @click="checkEmail(email)">Check Email</button>
  <br />
  <br />
  <input placeholder="username" v-model="username" />
  <input placeholder="email" v-model="email" />
  <input placeholder="password" v-model="password" />
  <button @click="register(username, email, password)">Register</button>
  <br />
  <br />
  <input placeholder="email" v-model="email" />
  <input placeholder="access code" v-model="code" />
  <button @click="activate(email, code)">activate</button>
  <br />
  <br />
  <input placeholder="email" v-model="email" />
  <button @click="restoreEmail(email)">restore Email</button>
  <br />
  <br />
  <input placeholder="email" v-model="email" />
  <input placeholder="access code" v-model="code" />
  <input placeholder="new password" v-model="newPassword" />
  <button @click="restore(email, code, newPassword)">restore</button>
  <br />
  <br />
  <input placeholder="username / email" v-model="username" />
  <input placeholder="password" v-model="password" />
  <button @click="login(username, password)">login</button>
  <br />
  <br />
  <button @click="getSession">get Session</button>
  <br />
  <br />
  <button @click="getUserData">get User Data</button>
  <br />
  <br />
  <button @click="logout">logout</button>
  <br />
  <br />
  <input placeholder="new password" v-model="newPassword" />
  <button @click="userUpdate(newPassword)">user Update</button>
  <br />
  <br />
  <input placeholder="password" v-model="password" />
  <button @click="userDelete(password)">user Delete</button>
  <br />
  <br />
</template>

<script>
import TodoList from '@/views/TodoList.vue';
import TodoLists from '@/views/TodoLists.vue';
import UserList from '@/views/UserList.vue';
import UserService from '@/services/UserService';

export default {
  components: {
    TodoList,
    TodoLists,
    UserList,
  },

  data() {
    const user = {
      isAuth: true,
      isAdmin: true,
    };

    return {
      email: '',
      username: '',
      password: '',
      code: '',
      newPassword: '',
      user: user,
    };
  },

  methods: {
    async getCSRF() {
      await UserService.getCSRFToken().then((data) => {
        console.log(data);
      });
    },

    async checkUsername(username) {
      console.log(username);
      await UserService.checkUsername(username).then((data) => {
        console.log(data);
      });
    },

    async checkEmail(email) {
      console.log(email);
      await UserService.checkEmail(email).then((data) => {
        console.log(data);
      });
    },

    async register(username, email, password) {
      console.log(username, email, password);
      await UserService.register(username, email, password).then((data) => {
        console.log(data);
      });
    },

    async activate(email, code) {
      console.log(email, code);
      await UserService.activate(email, code).then((data) => {
        console.log(data);
      });
    },

    async restoreEmail(email) {
      console.log(email);
      await UserService.sendRestorationEmail(email).then((data) => {
        console.log(data);
      });
    },

    async restore(email, code, newPassword) {
      console.log(email, code, newPassword);
      await UserService.restore(email, code, newPassword).then((data) => {
        console.log(data);
      });
    },

    async login(username, password) {
      console.log(username, password);
      await UserService.login(username, password).then((data) => {
        console.log(data);
      });
    },

    async getSession() {
      await UserService.getSession().then((data) => {
        console.log(data);
      });
    },

    async getUserData() {
      await UserService.getUserData().then((data) => {
        console.log(data);
      });
    },

    async logout() {
      await UserService.logout().then((data) => {
        console.log(data);
      });
    },

    async userUpdate(password) {
      console.log(password);
      await UserService.update(password).then((data) => {
        console.log(data);
      });
    },

    async userDelete(password) {
      console.log(password);
      await UserService.delete(password).then((data) => {
        console.log(data);
      });
    },
  },
};
</script>

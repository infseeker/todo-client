<template>
  <TodoList v-if="!user.isAuth"></TodoList>
  <TodoLists v-if="user.isAuth && !user.isAdmin"></TodoLists>
  <UserList v-if="user.isAuth && user.isAdmin"></UserList>

  <button id="csrf" @click="getCSRF">CSRF</button>
  <br />
  <br />
  <input placeholder="username" type="text" v-model="username" />
  <button
    id="check-username"
    @click="checkUsername(username)"
  >
    Check Username
  </button>
  <br />
  <br />
  <input placeholder="email" type="text" v-model="email" />
  <button id="check-email" @click="checkEmail(email)">
    Check Email
  </button>
  <br />
  <br />
  <input placeholder="username" type="text" v-model="username" />
  <input placeholder="email" type="text" v-model="email" />
  <input placeholder="password" type="password" v-model="password" />
  <button id="register" @click="register(username, email, password)">
    Register
  </button>
  <br />
  <br />
  <input placeholder="email" type="text" v-model="email" />
  <input placeholder="access code" type="text" v-model="code" />
  <button id="activate" @click="activate(email, code)">activate</button>
  <br />
  <br />
  <input placeholder="email" type="text" v-model="email" />
  <button id="restore-Email" @click="restoreEmail(email)">
    restore Email
  </button>
  <br />
  <br />
  <input placeholder="email" type="text" v-model="email" />
  <input placeholder="access code" type="code" v-model="code" />
  <input placeholder="new password" type="text" v-model="newPassword" />
  <button id="restore" @click="restore(email, code, newPassword)">
    restore
  </button>
  <br />
  <br />
  <input placeholder="username" type="text" v-model="username" />
  <input placeholder="password" type="text" v-model="password" />
  <button id="login" @click="login(username, password)">login</button>
  <br />
  <br />
  <button id="getSession" @click="getSession">get Session</button>
  <br />
  <br />
  <button id="getUserData" @click="getUserData">get User Data</button>
  <br />
  <br />
  <button id="logout" @click="logout">logout</button>
  <br />
  <br />
  <input placeholder="new password" type="text" v-model="newPassword" />
  <button id="userUpdate" @click="userUpdate(newPassword)">user Update</button>
  <br />
  <br />
    <input placeholder="password" type="text" v-model="password" />
  <button id="userDelete" @click="userDelete(password)">user Delete</button>
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

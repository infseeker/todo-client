<template>
  <TodoList v-if="!user.isAuth"></TodoList>
  <TodoLists v-if="user.isAuth && !user.isAdmin"></TodoLists>
  <UserList v-if="user.isAuth && user.isAdmin"></UserList>
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
      user: user,
    };
  },
  async mounted() {
    UserService.login({ username: 'mail@mail.com', password: '123123aa' });
    UserService.getUserData();
  },
};
</script>

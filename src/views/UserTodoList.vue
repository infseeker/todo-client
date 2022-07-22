<template>
  <div class="guest-todo-list">
    <todo-list :listItems="listItems" @create="create" @check="check" @range="range" @save-title="saveTitle"
      @like="like" @delete="remove">
    </todo-list>
  </div>
</template>

<script>
import TodoList from '../components/todo/TodoList.vue';
import ListService from '../services/ListService';

export default {
  data() {
    return {
      listItems: [],
    }
  },

  components: {
    TodoList,
  },

  methods: {
    create(title) {
      console.log('create', title);
    },

    check(listItem) {
      console.log('check', listItem);
    },

    range(listItem) {
      console.log('range', listItem);
    },

    saveTitle(listItem) {
      console.log('save title', listItem);
    },

    like(listItem) {
      console.log('like', listItem);
    },

    remove(listItem) {
      console.log('delete', listItem);
      // this.listItems = this.listItems.filter(item => item !== listItem);
    }
  },

  mounted() {
    ListService.getListItems(this.$route.params.list_id).then(r => {
      if (r.code === 200) {
        this.listItems = r.data || [];
      } else {
        console.log('Something went wrong');
      }
    })
  }
};
</script>

<template>
  <div class="guest-todo-list">
    <todo-list :listItems="listItems" @create="saveDataToLocalStorage" @check="saveDataToLocalStorage"
      @range="saveDataToLocalStorage" @save-title="saveDataToLocalStorage" @like="saveDataToLocalStorage"
      @delete="deleteListItem">
    </todo-list>
  </div>
</template>

<script>
import TodoList from '../components/todo/TodoList.vue';

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
    getDataFromLocalStorage() {
      this.listItems = JSON.parse(localStorage.getItem('listItems')) || [];
    },

    saveDataToLocalStorage() {
      localStorage.setItem('listItems', JSON.stringify(this.listItems));
    },

    deleteListItem(listItem) {
      this.listItems = this.listItems.filter(item => item !== listItem);
      this.saveDataToLocalStorage();
    }
  },

  mounted() {
    this.getDataFromLocalStorage();
  }
};
</script>

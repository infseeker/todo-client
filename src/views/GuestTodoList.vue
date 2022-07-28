<template>
  <div class="guest-todo-list">
    <todo-list :listItems="listItems" @create="createListItem" @check="checkListItem" @range="saveDataToLocalStorage"
      @save-title="saveListItemTitle" @like="likeListItem" @delete="deleteListItem">
    </todo-list>
  </div>
</template>

<script>
import TodoList from '../components/todo/TodoList.vue';
import ListItem from '../models/ListItem'

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
      const data = JSON.parse(localStorage.getItem('listItems')) || []
      data.forEach(i => {
        this.listItems.push(new ListItem(i));
      });
    },

    saveDataToLocalStorage() {
      localStorage.setItem('listItems', JSON.stringify(this.listItems));
    },

    createListItem(title) {
      this.listItems.push(new ListItem({ title: title }));
      this.saveDataToLocalStorage();
    },

    checkListItem(listItem) {
      listItem.check();
      this.saveDataToLocalStorage();
    },

    saveListItemTitle(listItem, title) {
      listItem.saveTitle(title);
      this.saveDataToLocalStorage();
    },

    likeListItem(listItem) {
      listItem.like();
      this.saveDataToLocalStorage();
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

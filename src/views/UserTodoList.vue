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
    async getLists() {
      await ListService.getLists().then(r => {
        if (r.code === 200) {
          this.$store.lists = r.data;
        } else if (r.code === 404) {
          console.log('Lists of current user not found');
        } else {
          console.log('Something went wrong');
        }
      });
    },

    async getListItems() {
      const listId = parseInt(this.$route.params.list_id);
      const list = this.$store.lists.find(list => list.id === listId);

      console.log(list, this.$store.lists, this.$route.params.list_id);
      if (list) {
        console.log(list)
        if (!list.items || !list.items.length) {
          await ListService.getListItems(listId).then(r => {
            if (r.code === 200) {
              list.items = r.data || [];
              this.listItems = list.items;
            } else if (r.code === 404) {
              console.log(`List #${listId} not found`);
            } else {
              console.log('Something went wrong');
            }
          })
        } else {
          console.log('List items already exist in array');
        }
      } else {
        console.log(`List #${listId} not found in array`);
      }
    },

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
    if (!this.$store.lists.length) {
      this.getLists(r => {
        this.$store.lists = r.data;
      }).then(() => {
        this.getListItems();
      })
    } else {
      this.getListItems();
    }
  }
};
</script>

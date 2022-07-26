<template>
  <div class="guest-todo-list">
    <todo-list v-if="list && list.items" :list="list" :listTitle="list.title" :listItems="list.items" @create="create"
      @check="check" @range="range" @save-title="saveTitle" @like="like" @delete="deleteItem"
      @save-list-title="saveListTitle" @delete-list="deleteList">
    </todo-list>
  </div>
</template>

<script>
import TodoList from '../components/todo/TodoList.vue';
import ListService from '../services/ListService';

export default {
  data() {
    return {
      list: {},
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
      const listId = parseInt(this.$route.params.listId);
      const list = this.$store.lists.find(list => list.id === listId);
      this.list = list;

      console.log(this.list);

      if (list) {
        if (!list.items || !list.items.length) {

          await ListService.getListItems(listId).then(r => {
            if (r.code === 200) {
              list.items = r.data || [];

            } else if (r.code === 404) {
              console.log(`List #${listId} not found`);

            } else {
              console.log('Something went wrong');
            }
          })
        } else {
          this.listItems = list.items;ition: 0

          console.log(`Items for list #${listId} already exist in list array`);
        }
      } else {
        this.$router.push({ name: 'not-found' })
        console.log(`List #${listId} not found in list array`);
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

    deleteItem(listItem) {
      console.log('delete', listItem);
      // this.listItems = this.listItems.filter(item => item !== listItem);
    },

    saveListTitle(listTitle) {
      this.list.title = listTitle;

      ListService.updateList(this.list).then(r => {
        if (r.code === 200) {
          console.log(`List #${this.list.id} was updated`);
        }
      })
      console.log('save list title', listTitle);
    },

    deleteList(list) {
      ListService.deleteList(list).then(r => {
        if (r.code === 200) {
          console.log(`List #${list.id} was deleted`);

          this.$store.lists = this.$store.lists.filter(item => item !== list);
          this.$router.push({ name: 'lists' });
        }
      });
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

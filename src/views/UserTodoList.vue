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
import List from '../models/List'
import ListItem from '../models/ListItem'
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
          r.data.forEach(i => {
            this.$store.lists.push(new List(i));
          });
        } else if (r.code === 404) {
          console.log('Lists of current user not found');
        } else {
          console.log('Something went wrong');
        }
      });
    },

    async getListItems() {
      const listId = parseInt(this.$route.params.listId);
      const list = this.$store.lists.find(i => i.id === listId);
      this.list = list;

      if (list) {
        if (!list.items || !list.items.length) {

          await ListService.getListItems(listId).then(r => {
            if (r.code === 200) {
              const items = [];

              r.data.forEach(i => {
                items.push(new ListItem(i));
              })

              items.sort((a, b) => a.id - b.id);

              list.loadItems(items);
            } else if (r.code === 404) {
              this.$router.push({ name: 'not-found' });
            } else {
              console.log('Something went wrong');
            }
          })
        } else {
          this.listItems = list.items;
        }
      } else {
        this.$router.push({ name: 'not-found' })
      }
    },

    create(title) {
      ListService.createListItem(this.list, title).then(r => {
        if (r.code === 200) {
          this.list.addItem(new ListItem(r.data));
        }
      })
    },

    check(listItem) {
      listItem.check();
      ListService.updateListItem({ id: listItem.id, listId: listItem.listId, done: !listItem.done }).then(r => {
      });
    },

    range(listItem) {
      console.log('range', listItem);
    },

    saveTitle(listItem, title) {
      listItem.saveTitle(title);
      ListService.updateListItem({ id: listItem.id, listId: listItem.listId, title: title }).then(r => {
      });
    },

    like(listItem) {
      listItem.like();
      ListService.updateListItem({ id: listItem.id, listId: listItem.listId, liked: !listItem.liked }).then(r => {
      });
    },

    deleteItem(listItem) {
      this.list.items = this.list.items.filter(item => item !== listItem);
      ListService.deleteListItem(listItem).then(r => {
      });
    },

    saveListTitle(title) {
      this.list.saveTitle(title);

      ListService.updateList({ id: this.list.id, title: title }).then(r => {
        if (r.code === 200) {
        }
      });
    },

    deleteList(list) {
      this.$store.lists = this.$store.lists.filter(item => item !== list);
      this.$router.push({ name: 'lists' });

      ListService.deleteList(list).then(r => {
        if (r.code === 200) {
        }
      });
    }
  },

  mounted() {
    if (!this.$store.lists.length) {
      this.getLists().then(() => {
        this.getListItems();
      })
    } else {
      this.getListItems();
    }
  }
};
</script>

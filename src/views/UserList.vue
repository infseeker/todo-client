<template>
  <div class="guest-todo-list">
    <todo-list v-if="list && list.items" :list="list" :listTitle="list.title" :listItems="list.items" @create="create"
      @check="check" @range="range" @save-title="saveTitle" @like="like" @delete="deleteItem"
      @save-list-title="saveListTitle">
    </todo-list>
  </div>
</template>

<script>
import { io } from 'socket.io-client'

import { api } from '../../public/server-api'
import TodoList from '../components/todo/List.vue';
import List from '../models/List'
import ListItem from '../models/ListItem'
import ListService from '../services/ListService';

export default {
  data() {
    return {
      list: {},
      socket: null,
    }
  },

  components: {
    TodoList,
  },

  methods: {
    async getLists() {
      this.$loader.show();

      await ListService.getLists().then(r => {
        this.$loader.hide();

        if (r.code === 200) {
          r.data.forEach(i => {
            this.$store.lists.push(new List(i));
          });
        }
      });
    },

    async getListItems() {
      const listId = parseInt(this.$route.params.listId);
      const list = this.$store.lists.find(i => i.id === listId);
      this.list = list;

      if (this.list.shared.length > 0) {
        this.connectWebSocket();
      }

      if (list) {
        if (!list.items || !list.items.length) {
          this.$loader.show();

          await ListService.getListItems(listId).then(r => {
            this.$loader.hide();

            if (r.code === 200) {
              const items = [];

              r.data.forEach(i => {
                items.push(new ListItem(i));
              })

              items.sort((a, b) => a.position - b.position);

              list.loadItems(items);
            } else if (r.code === 404) {
              this.$router.push({ name: 'not-found' });
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
      this.$loader.show(false);
      const lastListItem = this.list.items[this.list.items.length - 1];
      const position = lastListItem ? lastListItem.position + 1 : 1

      ListService.createListItem(this.list, title, position).then(r => {
        this.$loader.hide();

        if (r.code === 200) {
          this.list.addItem(new ListItem(r.data));
        }
      })
    },

    check(listItem) {
      listItem.check();
      ListService.updateListItem(listItem).then(r => {
      });
    },

    range(listItem, newIndex) {
      const items = this.list.items;

      if (newIndex === 0) {
        listItem.position = items[1].position / 2;
      } else if (newIndex === items.length - 1) {
        listItem.position = items[newIndex - 1].position + 1;
      } else {
        listItem.position = (items[newIndex - 1].position + items[newIndex + 1].position) / 2;
      }

      ListService.updateListItem(listItem).then(r => {
        if (r.code === 200) {
        }
      })
    },

    saveTitle(listItem, title) {
      listItem.saveTitle(title);
      ListService.updateListItem(listItem).then(r => {
      });
    },

    like(listItem) {
      listItem.like();
      ListService.updateListItem(listItem).then(r => {
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

    connectWebSocket() {
      this.socket = io({ path: api.lists.shared_list });

      this.socket.on('connect', () => {
        console.log('connect', this.socket.id);
      });

      this.socket.on('disconnect', () => {
        console.log('disconnect', this.socket.id);
      });

      this.socket.emit('check', { 'data': 'Server' })
    },

    disconnectWebSocket() {
      if (this.socket) this.socket.disconnect();
    },
  },

  mounted() {
    if (!this.$store.lists.length) {
      this.getLists().then(() => {
        this.getListItems();
      })
    } else {
      this.getListItems();
    }
  },

  unmounted() {
    this.disconnectWebSocket();
  },
};
</script>

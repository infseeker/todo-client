<template>
  <div class="todo-list mt-4">
    <div class="card w-100">
      <div class="card-body">
        <div class="guest-todo-list">
          <div v-if="list" class="todo-list-title-wrapper">
            <h4 v-if="!listTitleEdit" class="todo-list-title">{{ list.title }} <i v-if="list.shared.length" class="bx"
                :class="[list.owner.id === this.$user.id ? 'bx-group' : 'bxs-group']"></i></h4>

            <form v-if="listTitleEdit">
              <input :placeholder="this.$t('list.title')" ref="listTitleInput"
                @keypress.enter.prevent.stop="saveListTitle($event)" @keyup.esc="discardListTitleEdit"
                @blur="saveListTitle($event)" v-model="tempListTitle" type="text"
                class="todo-list-title-edit form-control">
            </form>

            <list-menu :list="list" @edit="editListTitle"></list-menu>
          </div>

          <div v-if="list && list.shared.length" class="list-users">
            <ul>
              <li>
                <img :src="list.owner.image ? list.owner.image : blankUserImageUrl" alt="List owner image" :title="list.owner.email"
                  :class="{ online: list.owner.online }">
              </li>
              <li v-for="user in list.shared" v-bind:key="user.id">
                <img :src="user.image ? user.image : blankUserImageUrl" alt="User image" :title="user.email" :class="{ online: user.online }">
              </li>
            </ul>
          </div>

          <todo-list v-if="list && list.items" :list="list" :listItems="list.items" @create="create" @check="check"
            @range="range" @save-title="saveTitle" @like="like" @delete="deleteItem" @save-list-title="saveListTitle"
            @update="update">
          </todo-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client'

import { api } from '../../public/server-api'
import TodoList from '../components/todo/List.vue';
import ListMenu from '../components/todo/ListMenu.vue'
import List from '../models/List'
import ListItem from '../models/ListItem'
import ListService from '../services/ListService';
import { removeUselessSymbols } from '../helpers/string-utils'

export default {
  data() {
    return {
      list: null,
      socket: null,
      listTitleEdit: false,
      tempListTitle: '',
      discardedListTitleEdit: false,
      blankUserImageUrl: new URL(`../assets/img/icons/bx-user-circle-big.svg`, import.meta.url),
    }
  },

  components: {
    TodoList,
    ListMenu,
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

          this.$store.lists.sort((a, b) => a.id - b.id);
        }
      });
    },

    async getListItems() {
      const listId = parseInt(this.$route.params.listId);
      const list = this.$store.lists.find(i => i.id === listId);
      this.list = list;

      if (list) {
        if (this.list && this.list.shared && this.list.shared.length) {
          await this.connectWebSocket();
        }

        if (!list.items || !list.items.length || this.socket) {
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

              console.log(list);
            } else if (r.code === 404) {
              this.$router.push({ name: 'not-found' });
            }
          })
        } else {
          this.listItems = list.items;
          console.log(list);
        }
      } else {
        this.$router.push({ name: 'not-found' })
      }
    },

    editListTitle(list) {
      console.log(list.title);
      this.listTitleEdit = true;
      this.tempListTitle = list.title;

      this.$nextTick(() => {
        this.$refs['listTitleInput'].focus();
      })
    },

    saveListTitle($event) {
      if (this.discardedListTitleEdit) {
        this.discardedListTitleEdit = false;
        return;
      }

      if (!$event.target.value || $event.target.value.trim().length === 0) return;

      if ($event.type === 'keypress') this.isListItemEnterKey = true;
      else if ($event.type === 'blur' && this.isListItemEnterKey) {
        this.isListItemEnterKey = false;
        return;
      }

      this.listTitleEdit = false;
      const title = removeUselessSymbols($event.target.value.trim(), 'all');

      this.list.saveTitle(title);

      ListService.updateList({ id: this.list.id, title: title }).then(r => {
        if (r.code === 200) {
          if (this.socket) {
            this.socket.emit('list_title_rename', { title: title, list_id: this.list.id });
          }
        }
      });
    },

    discardListTitleEdit() {
      this.discardedListTitleEdit = true;
      this.listTitleEdit = false;
    },

    create(title) {
      this.$loader.show(false);
      const lastListItem = this.list.items[this.list.items.length - 1];
      const position = lastListItem ? lastListItem.position + 1 : 1


      ListService.createListItem(this.list, title, position).then(r => {
        this.$loader.hide();

        if (r.code === 200) {
          if (!this.socket) {
            this.list.addItem(new ListItem(r.data));
          } else {
            this.socket.emit('create_list_item', { ...r.data });
          }
        }
      });
    },

    check(listItem) {
      listItem.check();
      ListService.updateListItem(listItem).then(r => {
        if (r.code === 200 && this.socket) this.socket.emit('check_list_item', { ...r.data })
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
        if (r.code === 200 && this.socket) this.socket.emit('range_list_item', { ...r.data });
      })
    },

    saveTitle(listItem, title) {
      listItem.saveTitle(title);
      ListService.updateListItem(listItem).then(r => {
        if (r.code === 200 && this.socket) this.socket.emit('edit_list_item_title', { ...r.data });
      });
    },

    like(listItem) {
      listItem.like();
      ListService.updateListItem(listItem).then(r => {
        if (r.code === 200 && this.socket) this.socket.emit('like_list_item', { ...r.data });
      });
    },

    deleteItem(listItem) {
      this.list.items = this.list.items.filter(item => item !== listItem);
      ListService.deleteListItem(listItem).then(r => {
        if (r.code === 200 && this.socket) this.socket.emit('delete_list_item', { ...r.data });
      });
    },

    update() {
      if (this.list.shared && this.list.shared.length && !this.socket)
        this.connectWebSocket();
    },

    connectWebSocket() {
      this.socket = io({ path: api.lists.shared_list, auth: { list_id: this.list.id } });

      this.socket.on('connected', (r) => {
        console.log(r);
        setUserOnline(this.list, r.data);
      });

      this.socket.on('disconnected', (r) => {
        console.log(r);

        if (r) {
          if (this.list.owner.id === r.data.id) {
            this.list.owner.online = false;
          } else {
            const user = this.list.shared.find(u => u.id === r.data.id);
            if (user) user.online = false;
          }
        }
      });

      this.socket.on('list_title_renamed', (r) => {
        setUserOnline(this.list, r.user);
        this.list.saveTitle(r.data.title);
      });

      this.socket.on('list_item_created', (r) => {
        setUserOnline(this.list, r.user);
        this.list.addItem(new ListItem(r.data));
      });

      this.socket.on('list_item_title_edited', (r) => {
        setUserOnline(this.list, r.user);
        const listItem = this.list.items.find(i => i.id === r.data.id);
        if (listItem && this.$user.id !== r.user.id) listItem.saveTitle(r.data.title);
      });

      this.socket.on('list_item_checked', (r) => {
        setUserOnline(this.list, r.user);
        const listItem = this.list.items.find(i => i.id === r.data.id);
        if (listItem && this.$user.id !== r.user.id) listItem.check();
      });

      this.socket.on('list_item_liked', (r) => {
        setUserOnline(this.list, r.user);
        const listItem = this.list.items.find(i => i.id === r.data.id);
        if (listItem && this.$user.id !== r.user.id) listItem.like();
      });

      this.socket.on('list_item_ranged', (r) => {
        setUserOnline(this.list, r.user);
        const listItem = this.list.items.find(i => i.id === r.data.id);
        if (listItem && this.$user.id !== r.user.id) {
          listItem.position = r.data.position;
          this.list.items.sort((a, b) => a.position - b.position);
        }
      });

      this.socket.on('list_item_deleted', (r) => {
        setUserOnline(this.list, r.user);
        const listItem = this.list.items.find(i => i.id === r.data.id);
        if (listItem && this.$user.id !== r.user.id) this.list.items = this.list.items.filter(item => item !== listItem);
      });

      function setUserOnline(currentList, userData) {
        if (userData) {
          if (currentList.owner.id === userData.id) {
            currentList.owner.online = true;
          } else {
            currentList.shared.find(u => u.id === userData.id).online = true;
          }
        }
      }
    },

    disconnectWebSocket() {
      if (this.socket) {
        this.socket.emit('user_disconnect', {});
      }

    },
  },

  created() {
    window.addEventListener('beforeunload', this.disconnectWebSocket);
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

<style scoped>
.todo-list-title .bxs-group,
.todo-list-title .bx-group {
  width: 1.4rem;
  height: 1.4rem;
  position: relative;
  margin-left: 0.1rem;
  top: 0.25rem;
}

.list-users ul {
  display: flex;
  gap: 0.1rem;
  list-style: none;
}

.list-users img {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 3px solid rgba(0, 0, 0, 0);
}

.list-users .online {
  border: 3px solid #68d333;
}
</style>
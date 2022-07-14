<template>
  <div class="todo-list mt-4">
    <div class="card">
      <div class="card-body">
        <div class="new-todo-list-item mb-2">
          <i class='bx bxs-plus-circle' @click="addListItem(newListItemTitle)"></i>
          <input v-model.trim="newListItemTitle" @keyup.enter="addListItem(newListItemTitle)" class="form-control"
            type="text" placeholder="Что будем делать?">
        </div>

        <ul class="todo-list-item-filters">
          <li :class="{ 'todo-list-current-filter': currentListItemFilter === 'all' }"
            @click="setListItemFilter('all')">Все</li>
          <li :class="{ 'todo-list-current-filter': currentListItemFilter === 'liked' }"
            @click="setListItemFilter('liked')">Избранное</li>
          <li :class="{ 'todo-list-current-filter': currentListItemFilter === 'done' }"
            @click="setListItemFilter('done')">Готово</li>
        </ul>

        <draggable :list="listItems" @change="rangeListItem" tag="ul"
          handle=".todo-list-item-handle" item-key="id" :delay="200" :animation="300"
          easing="cubic-bezier(0.37, 0, 0.63, 1)" :force-fallback="true" :force-autoscroll-fallback="true"
          :scroll-sensitivity="30" :scroll-speed="200" class="todo-list-items list-group list-group-flush">

          <template #item="{ element: item }">

            <li class="todo-list-item list-group-item" :class="{ 'todo-list-item-liked': item.liked }"
              v-if="currentListItemFilter === 'all' || (currentListItemFilter === 'liked' && item.liked) || (currentListItemFilter === 'done' && item.done)">

              <i class='todo-list-item-check bx bx-check-circle'
                :class="{ 'bx-check-circle': item.done, 'bx-circle': !item.done }" @click="checkListItem(item)"></i>

              <span class="todo-list-item-title todo-list-item-handle" :class="{ 'todo-list-item-done': item.done }"
                @dblclick="editListItemTitle(item)" v-if="!item.titleEdit">{{ item.title }}</span>

              <textarea rows="1" class="todo-list-item-edit form-control" type="text" v-model="currentListItemTitle"
                v-if="item.titleEdit" :ref="`editTitleOfListItem-${listItems.indexOf(item)}`"
                @keyup.enter.exact.prevent="saveEditedListItemTitle(item)" @input="checkIfEnterKey(item)"
                @blur="discardEditedListItemTitle(item)" @keyup.esc="discardEditedListItemTitle(item)"></textarea>

              <div class="dropdown todo-list-item-menu">
                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown"
                  aria-expanded="false" @click="openItemMenu($event, item)">
                  <i class="bx bx-dots-vertical-rounded"></i>
                </button>

                <ul class="dropdown-menu" style="">
                  <li class="dropdown-item" @click="editListItemTitle(item)">
                    <i class="bx bx-edit-alt me-1"></i> Редактировать
                  </li>

                  <li class="dropdown-item" v-if="!item.liked" @click="like(item)">
                    <i class="bx bx-heart me-1"></i> В избранное
                  </li>

                  <li class="dropdown-item" v-if="item.liked" @click="unlike(item)">
                    <i class="bx bxs-heart me-1"></i> Из избранного
                  </li>

                  <li class="dropdown-item" @click="deleteListItem(item)">
                    <i class='todo-list-item-delete bx bx-trash-alt me-1'></i> Удалить
                  </li>
                </ul>
              </div>
            </li>

          </template>
        </draggable>

      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  data() {
    return {
      newListItemTitle: '',
      currentListItemTitle: '',
      listItems: [],
      filteredListItems: [],
      currentListItemFilter: 'all',
    }
  },

  components: {
    draggable,
  },

  methods: {
    addListItem(listItemTitle) {
      if (!listItemTitle) return;

      this.listItems.push({ title: listItemTitle, done: false, liked: false });

      if (this.$user && !this.$user.isAuth) {
        localStorage.setItem('listItems', JSON.stringify(this.listItems));
      }

      this.newListItemTitle = '';
    },

    setListItemFilter(filter) {
      this.currentListItemFilter = filter;
    },

    checkListItem(item) {
      item.done = !item.done

      if (this.$user && !this.$user.isAuth) {
        localStorage.setItem('listItems', JSON.stringify(this.listItems));
      }
    },

    rangeListItem() {
      if (this.$user && !this.$user.isAuth) {
        localStorage.setItem('listItems', JSON.stringify(this.listItems));
      }
    },

    editListItemTitle(item) {
      item.titleEdit = true;
      this.currentListItemTitle = item.title;

      this.$nextTick(() => {
        const editField = this.$refs[`editTitleOfListItem-${this.listItems.indexOf(item)}`];
        editField.style.height = editField.scrollHeight > 20 && editField.scrollHeight < 50 ? editField.scrollHeight + 2 + 'px' : 74 + 'px';
        editField.focus();
      });
    },

    saveEditedListItemTitle(item) {
      item.titleEdit = false;

      if (!this.currentListItemTitle.trim()) return

      this.currentListItemTitle = this.currentListItemTitle.replace(/[\r\n]/gm, '');
      item.title = this.currentListItemTitle.trim();

      if (this.$user && !this.$user.isAuth) {
        localStorage.setItem('listItems', JSON.stringify(this.listItems));
      }
    },

    checkIfEnterKey(item) {
      const lineBreakRegexMatch = /\r|\n/.exec(this.currentListItemTitle);

      if (lineBreakRegexMatch) {
        this.saveEditedListItemTitle(item);
      }
    },

    discardEditedListItemTitle(item) {
      item.titleEdit = false;
    },

    like(item) {
      item.liked = true

      if (this.$user && !this.$user.isAuth) {
        localStorage.setItem('listItems', JSON.stringify(this.listItems));
      }
    },

    unlike(item) {
      item.liked = false

      if (this.$user && !this.$user.isAuth) {
        localStorage.setItem('listItems', JSON.stringify(this.listItems));
      }
    },

    deleteListItem(listItem) {
      this.listItems = this.listItems.filter(item => item !== listItem);

      if (this.$user && !this.$user.isAuth) {
        localStorage.setItem('listItems', JSON.stringify(this.listItems));
      }
    },

    openItemMenu($event, item) {
      $event.preventDefault();
    }
  },

  mounted() {
    if (this.$user && !this.$user.isAuth) {
      this.listItems = JSON.parse(localStorage.getItem('listItems')) || [];
    }
  }
}
</script>

<style scoped>
@media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
  .card-body {
    padding: 0.5rem 0;
  }

  .new-todo-list-item {
    margin: 0.9rem;
    margin-bottom: 0.5rem
  }
}

.new-todo-list-item {
  display: flex;
}

.new-todo-list-item i {
  font-size: 3rem;
  padding-right: 0.5rem;
}

.new-todo-list-item input {
  display: inline-block;
  flex: 2;
}

.todo-list-item-filters {
  display: flex;
  margin: 0;
  margin-top: 1rem;
  padding: 0;
  justify-content: center;
  list-style: none;
}

.todo-list-item-filters li {
  margin: 0 0.3rem;
  cursor: pointer;
}

.todo-list-current-filter {
  color: #696cff;
}

.todo-list-item {
  display: flex;
  align-items: center;
}

.todo-list-item-check {
  font-size: 1.5rem;
  margin-right: 0.5rem;
  cursor: pointer;
}

.todo-list-item-title {
  font-size: 1.2rem;
  flex: 1;
}

.todo-list-item-delete {
  font-size: 1.2rem;
  margin-left: auto;
  cursor: pointer;
}

.todo-list-item.sortable-chosen {
  cursor: move;
  cursor: -webkit-grabbing;
}

.todo-list-item.sortable-ghost {
  opacity: 0.5;
}

.todo-list-item.sortable-drag {
  padding-top: 1.5rem;
  padding-left: 1.5rem;
}

.todo-list-item-done {
  text-decoration: line-through;
}

.todo-list-item-liked {
  color: #696cff;
}

.todo-list-item-edit {
  resize: none;
  margin-right: 0.5rem;
}

.todo-list-item-menu li {
  cursor: default;
}

.todo-list-item-menu .bxs-heart {
  color: #696cff;
}
</style>
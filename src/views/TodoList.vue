<template>
  <div class="todo-list mt-4">
    <div class="card">
      <div class="card-body">
        <div class="new-todo-list-item mb-2">
          <i class='bx bxs-plus-circle' @click="addListItem(newListItemTitle)"></i>
          <input v-model.trim="newListItemTitle" @keyup.enter="addListItem(newListItemTitle)" class="form-control"
            type="text" placeholder="Что будем делать?">
        </div>

        <draggable :list="listItems" @change="rangeListItem" item-key="id" handle=".todo-list-item-handle"
          :disabled="false" :delay="200" :animation="300" :force-fallback="true" easing="cubic-bezier(0.37, 0, 0.63, 1)"
          tag="ul" class="todo-list-items list-group list-group-flush">
          <template #item="{ element: item }">
            <li class="todo-list-item list-group-item">

              <i class='todo-list-item-check bx bx-check-circle'
                :class="{ 'bx-check-circle': item.done, 'bx-circle': !item.done }" @click="checkListItem(item)"></i>

              <span class="todo-list-item-title todo-list-item-handle" :class="{ 'todo-list-item-done': item.done }"
                @dblclick="editListItemTitle(item)" v-if="!item.titleEdit">{{ item.title }}</span>

              <textarea rows="1" class="todo-list-item-edit form-control" type="text" v-model="currentListItemTitle"
                v-if="item.titleEdit" :ref="`editTitleOfListItem-${listItems.indexOf(item)}`"
                @keyup.enter.exact.prevent="saveEditedListItemTitle($event, item)" @input="test($event, item)"
                @blur="discardEditedListItemTitle(item)" @keyup.esc="discardEditedListItemTitle(item)"></textarea>

              <i class='todo-list-item-delete bx bx-trash-alt' @click="deleteListItem(item)"></i>

              <!-- <i class="bx bx-dots-vertical-rounded" @click="item.showMenu = true" style="font-size: 1.2rem"></i>

              <div class="dropdown-menu" :class="{ show: item.showMenu }" @blur="item.showMenu = false" style="position: absolute; top: 41%; right: 11%; margin: 0px;">
                <a class="dropdown-item" href="javascript:void(0);"><i class="bx bx-heart me-1"></i> В избранное</a>
                <a class="dropdown-item" href="javascript:void(0);"><i class="bx bx-trash me-1"></i> Удалить</a>
              </div> -->
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
    }
  },

  components: {
    draggable,
  },

  methods: {
    addListItem(listItemTitle) {
      if (!listItemTitle) return;
      console.log(listItemTitle);

      this.listItems.push({ title: listItemTitle, done: false, liked: false });

      if (this.$user && !this.$user.isAuth) {
        localStorage.setItem('listItems', JSON.stringify(this.listItems));
      }

      this.newListItemTitle = '';
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

    saveEditedListItemTitle($event, item) {
      item.titleEdit = false;
      this.currentListItemTitle = this.currentListItemTitle.replace(/[\r\n]/gm, '');
      item.title = this.currentListItemTitle;

      if (this.$user && !this.$user.isAuth) {
        localStorage.setItem('listItems', JSON.stringify(this.listItems));
      }
    },

    test($event, item) {
      if ($event.inputType === 'insertLineBreak') {
        $event.preventDefault();
        this.saveEditedListItemTitle($event, item);
      }

    },

    discardEditedListItemTitle(item) {
      item.titleEdit = false;
    },

    deleteListItem(listItem) {
      this.listItems = this.listItems.filter(item => item !== listItem);

      if (this.$user && !this.$user.isAuth) {
        localStorage.setItem('listItems', JSON.stringify(this.listItems));
      }
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

.todo-list-item-edit {
  margin-right: 0.5rem;
}
</style>
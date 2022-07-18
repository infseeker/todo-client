<template>
  <div class="todo-list mt-4">
    <div class="card">
      <div class="card-body">
        <div class="new-todo-list-item mb-2">
          <i class='bx bxs-plus-circle' @click="createListItem($event, newListItemTitle)"></i>
          <input :value="newListItemTitle" @keypress.enter.exact="createListItem($event, newListItemTitle)" class="form-control"
            type="text" placeholder="Что будем делать?">
        </div>

        <ul class="todo-list-item-filters">
          <li :class="{ 'todo-list-current-filter': currentListItemFilter === 'all' }"
            @click="currentListItemFilter = 'all'">
            Все</li>
          <li :class="{ 'todo-list-current-filter': currentListItemFilter === 'liked' }"
            @click="currentListItemFilter = 'liked'">Избранное</li>
          <li :class="{ 'todo-list-current-filter': currentListItemFilter === 'done' }"
            @click="currentListItemFilter = 'done'">Готово</li>
        </ul>

        <!-- Hidden copy of current editing list item title to calculate textarea height to its resizing -->
        <ul class="todo-list-item-hidden-title todo-list-items list-group list-group-flush">
          <li class="todo-list-item">
            <i class='todo-list-item-check bx bx-check-circle'></i>
            <pre ref="hiddenTitleOfListItem" class="todo-list-item-title">{{ currentListItemTitle }}</pre>
            <div class="dropdown todo-list-item-menu">
              <button type="button" class="btn p-0 dropdown-toggle hide-arrow">
                <i class="bx bx-dots-vertical-rounded"></i>
              </button>
            </div>
          </li>
        </ul>

        <div class="todo-list-empty mb-3" v-if="(currentListItemFilter === 'all' && allListItems.length === 0) ||
        (currentListItemFilter === 'liked' && allListItems.filter(item => item.liked === true).length === 0) ||
        (currentListItemFilter === 'done' && allListItems.filter(item => item.done === true).length === 0)">
          Здесь пока ничего нет
        </div>

        <draggable ref="draggableList" :list="allListItems" @change="rangeListItem" tag="ul"
          handle=".todo-list-item-handle" item-key="id" :delay="200" :animation="300"
          easing="cubic-bezier(0.37, 0, 0.63, 1)" :force-fallback="true" :force-autoscroll-fallback="true"
          :scroll-sensitivity="30" :scroll-speed="200" class="todo-list-items list-group list-group-flush">

          <template #item="{ element: item }">
            <li class="todo-list-item list-group-item" :class="{ 'todo-list-item-liked': item.liked }"
              v-if="currentListItemFilter === 'all' || (currentListItemFilter === 'liked' && item.liked) || (currentListItemFilter === 'done' && item.done)">

              <i class='todo-list-item-check bx bx-check-circle'
                :class="{ 'bx-check-circle': item.done, 'bx-circle': !item.done }" @click="checkListItem(item)"></i>

              <span :ref="`titleOfListItem-${allListItems.indexOf(item)}`"
                class="todo-list-item-title todo-list-item-handle" :class="{ 'todo-list-item-done': item.done }"
                @dblclick="editListItemTitle(item)" v-if="!item.titleEdit">{{ item.title }}</span>

              <textarea rows="1" class="todo-list-item-edit form-control" type="text" :value="currentListItemTitle"
                v-if="item.titleEdit" :ref="`editTitleOfListItem-${allListItems.indexOf(item)}`"
                @keypress.enter.exact="saveEditedListItemTitle(item)" @input="inputListItemTitleText($event, item)"
                @blur.prevent="discardEditedListItemTitle(item)" @keyup.esc.exact="discardEditedListItemTitle(item)"
                @keydown="keyPressOnListItemTitleText($event)" @paste="pasteListItemTitleText()"></textarea>

              <div class="dropdown todo-list-item-menu">
                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown"
                  aria-expanded="false">
                  <i class="bx bx-dots-vertical-rounded"></i>
                </button>

                <ul class="dropdown-menu dropdown-menu-end">
                  <li class="dropdown-item" @click="editListItemTitle(item)">
                    <i class="bx bx-edit-alt me-1"></i> Редактировать
                  </li>

                  <li class="dropdown-item" @click="toggleLikeListItem(item)">
                    <i class="bx me-1" :class="{ 'bx-heart': !item.liked, 'bxs-heart': item.liked }"></i>
                    {{ item.liked ? 'Из избранного' : 'В избранное' }}
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
      allListItems: [],
      currentListItemFilter: 'all',
      isPastedText: false,
      isEnterKey: false,
    }
  },

  components: {
    draggable,
  },

  methods: {
    getDataFromLocalStorage() {
      this.allListItems = JSON.parse(localStorage.getItem('listItems')) || [];
    },

    saveDataToLocalStorage() {
      localStorage.setItem('listItems', JSON.stringify(this.allListItems));
    },

    removeUselessSymbols(todoListItemTitle, mode) {
      switch (mode) {
        case 'all':
          return todoListItemTitle.replace(/([\r\n])|( +(?= ))|(^\s)/g, '');

        case 'breaks':
          return todoListItemTitle.replace(/[\r\n]/g, ' ').replace(/ +(?= )/g, '');
      }
    },

    createListItem($event) {
      let title = $event.target.value;
      if (!title.trim()) return;

      title = this.removeUselessSymbols(title, 'all').trim();

      this.allListItems.push({ title: title, done: false, liked: false });

      this.newListItemTitle = '';

      this.saveDataToLocalStorage();
    },

    checkListItem(listItem) {
      listItem.done = !listItem.done

      this.saveDataToLocalStorage();
    },

    rangeListItem() {
      this.saveDataToLocalStorage();
    },

    editListItemTitle(item) {
      const hiddenField = this.$refs.hiddenTitleOfListItem;
      const pageYOffset = window.pageYOffset;

      item.titleEdit = true;
      this.currentListItemTitle = item.title;

      this.$nextTick(() => {
        const editField = this.$refs[`editTitleOfListItem-${this.allListItems.indexOf(item)}`];
        hiddenField.style.width = editField.clientWidth + 'px';
        editField.style.height = hiddenField.clientHeight + 'px';
        editField.focus({ preventScroll: true });

        // Fix scroll position for some browsers
        scrollTo(0, pageYOffset);

        setTimeout(() => {
          scrollTo(0, pageYOffset);
        });
      });
    },

    keyPressOnListItemTitleText($event) {
      const key = $event.which || $event.keyCode || 0;
      this.isEnterKey = key === 13 ? true : false;
    },

    inputListItemTitleText($event, item) {
      // Not using v-model is for fixing mobile chromium browser bug (not updates model every input event, only every word)
      if (this.isPastedText) {
        $event.target.value = this.removeUselessSymbols($event.target.value, 'breaks');
      }
      this.isPastedText = false;

      this.currentListItemTitle = $event.target.value;

      // Rerender after every input to redraw textarea for proper resizing edit field
      this.$nextTick(() => {
        const text = $event.target.value;
        const start = $event.target.selectionStart;

        // Hack to recognize Enter key on android devices
        if (this.isEnterKey || (text.charAt(start - 2).charCodeAt() !== 32 && text.charAt(start - 1).charCodeAt() === 10)) {
          this.isEnterKey = false;
          this.saveEditedListItemTitle(item);
        }

        const hiddenField = this.$refs.hiddenTitleOfListItem;

        if (!this.currentListItemTitle) {
          // To keep size if hidden field is empty
          hiddenField.innerHTML = '0';
        }

        const editField = this.$refs[`editTitleOfListItem-${this.allListItems.indexOf(item)}`];

        if (hiddenField.clientWidth !== editField.clientWidth) {
          hiddenField.style.width = editField.clientWidth + 'px';
        }

        if (hiddenField.clientHeight !== editField.clientHeight) {
          editField.style.height = hiddenField.clientHeight + 'px';
        }
      });
    },

    pasteListItemTitleText() {
      this.isPastedText = true;
    },

    saveEditedListItemTitle(item) {
      item.titleEdit = false;

      if (!this.currentListItemTitle.trim()) return

      this.currentListItemTitle = this.removeUselessSymbols(this.currentListItemTitle, 'all').trim();
      item.title = this.currentListItemTitle;

      this.currentListItemTitle = '';

      this.saveDataToLocalStorage();
    },

    discardEditedListItemTitle(item) {
      item.titleEdit = false;
      this.currentListItemTitle = '';
    },

    toggleLikeListItem(item) {
      item.liked = !item.liked

      this.saveDataToLocalStorage();
    },

    deleteListItem(listItem) {
      this.allListItems = this.allListItems.filter(item => item !== listItem);

      this.saveDataToLocalStorage();
    },
  },

  mounted() {
    this.getDataFromLocalStorage();
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

@supports (-webkit-touch-callout: none) {
  .todo-list-item-filters {
    font-size: 1.1rem;
    margin: 0.6rem !important;
    margin-top: 1.5rem !important;
  }
}

.new-todo-list-item {
  display: flex;
}

.new-todo-list-item i {
  font-size: 3rem;
  padding-right: 0.5rem;
  cursor: pointer;
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

.todo-list-empty {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  color: #697a8d73;
  font-size: 1.2rem;
}

.todo-list-item-hidden-title {
  visibility: hidden;
  position: relative;
  z-index: 0;
}

.todo-list-item-hidden-title li {
  position: fixed;
}

.todo-list-item-hidden-title pre {
  font-family: "Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  display: inline-block;
  white-space: pre-wrap;
}

.todo-list-items {
  list-style: none;
}

.todo-list-item {
  display: flex;
  align-items: center;
  padding: 0.4rem 0.9rem !important;
  overflow-x: clip;
}

.todo-list-item-check {
  font-size: 1.6rem;
  margin-right: 0.3rem;
  cursor: pointer;
}

.todo-list-item-title {
  box-sizing: border-box;
  display: block;
  font-size: 1.2rem;
  padding: 0.2rem 0.4rem;
  margin: 0;
  flex: 1;
  overflow-wrap: anywhere;
}

.todo-list-item-edit {
  box-sizing: border-box;
  box-shadow: 0 0 0 1px #d9dee3;
  min-height: 0;
  display: block;
  padding: 0.2rem 0.4rem;
  margin: 0;
  resize: none;
  font-size: 1.2rem;
  overflow: hidden;
  border: none;
  overflow-wrap: anywhere;
}

.todo-list-item-edit:focus {
  box-shadow: 0 0 0 1px #696cff;
}

.todo-list-item.sortable-chosen {
  opacity: 0.5;
  cursor: move;
}

.todo-list-item-done {
  text-decoration: line-through;
}

.todo-list-item-liked {
  color: #696cff;
}

.todo-list-item-menu .dropdown-menu {
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
  margin: 0
}

.todo-list-item-menu .dropdown-item {
  display: flex;
}

.todo-list-item-menu li {
  cursor: pointer;
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
}

.todo-list-item-menu .bx-dots-vertical-rounded {
  font-size: 1.6rem;
}

.todo-list-item-menu i {
  font-size: 1.4rem;
  padding-right: 0.2rem;
}

.todo-list-item-menu .bxs-heart {
  color: #696cff;
}
</style>
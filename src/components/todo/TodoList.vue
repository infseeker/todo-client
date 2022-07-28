<template>
  <div class="todo-list mt-4">
    <div class="card w-100">
      <div class="card-body">
        <div>
          <div v-if="listTitle" class="todo-list-title-wrapper">
            <h4 v-if="!listTitleEdit" class="todo-list-title">{{ listTitle }}</h4>

            <form v-if="listTitleEdit">
              <input ref="listTitleInput" @keypress.enter.prevent="saveListTitle($event)"
                @keyup.esc="discardListTitleEdit" @blur="discardListTitleEdit" v-model="tempListTitle" type="text"
                class="todo-list-title-edit form-control">
            </form>

            <div class="todo-list-menu dropdown">
              <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown"
                aria-expanded="false" data-bs-offset="-10, 0">
                <i class="bx bx-dots-vertical-rounded"></i>
              </button>

              <ul class="dropdown-menu dropdown-menu-end">
                <li @click="editListTitle(listTitle)" class="dropdown-item">
                  <i class="bx bx-edit-alt me-1"></i> Редактировать название
                </li>

                <li class="dropdown-item" data-bs-toggle="modal" data-bs-target="#listDeletionModal">
                  <i class="bx bx-trash-alt me-1"></i> Удалить список
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="new-todo-list-item mb-4">
          <i class='bx bxs-plus-circle' @click="createListItem($event, newListItemTitle)"></i>
          <input v-model="newListItemTitle" @keypress.enter="createListItem($event, newListItemTitle)"
            class="form-control" type="text" placeholder="Что будем делать?">
        </div>

        <ul class="todo-list-item-filters mb-2">
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

        <div class="todo-list-empty mb-3" v-if="(currentListItemFilter === 'all' && listItems.length === 0) ||
        (currentListItemFilter === 'liked' && listItems.filter(item => item.liked === true).length === 0) ||
        (currentListItemFilter === 'done' && listItems.filter(item => item.done === true).length === 0)">
          Здесь пока ничего нет
        </div>

        <draggable ref="draggableList" :list="listItems" @change="rangeListItem" tag="ul"
          handle=".todo-list-item-handle" item-key="id" :delay="200" :animation="300"
          easing="cubic-bezier(0.37, 0, 0.63, 1)" :force-fallback="true" :force-autoscroll-fallback="true"
          :scroll-sensitivity="30" :scroll-speed="200" class="todo-list-items list-group list-group-flush">

          <template #item="{ element: item }">
            <li class="todo-list-item list-group-item" :class="{ 'todo-list-item-liked': item.liked }"
              v-if="currentListItemFilter === 'all' || (currentListItemFilter === 'liked' && item.liked) || (currentListItemFilter === 'done' && item.done)">

              <i class='todo-list-item-check bx bx-check-circle'
                :class="{ 'bx-check-circle': item.done, 'bx-circle': !item.done }" @click="checkListItem(item)"></i>

              <span :ref="`titleOfListItem-${listItems.indexOf(item)}`"
                class="todo-list-item-title todo-list-item-handle" :class="{ 'todo-list-item-done': item.done }"
                @dblclick="editListItemTitle(item)" v-if="!item.titleEdit">{{ item.title }}</span>

              <textarea rows="1" class="todo-list-item-edit form-control" type="text" :value="currentListItemTitle"
                v-if="item.titleEdit" :ref="`editTitleOfListItem-${listItems.indexOf(item)}`"
                @keypress.enter="saveEditedListItemTitle(item)" @input="inputListItemTitleText($event, item)"
                @blur.prevent="discardEditedListItemTitle(item)" @keyup.esc="discardEditedListItemTitle(item)"
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

        <TodoListDeletionModal v-if="list" :list="this.list" @delete-list="deleteList"></TodoListDeletionModal>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import TodoListDeletionModal from './TodoListDeletionModal.vue';

export default {
  props: ['list', 'listItems', 'listTitle'],

  data() {
    return {
      newListItemTitle: '',
      currentListItemTitle: '',
      currentListItemFilter: 'all',
      isPastedText: false,
      isEnterKey: false,
      listTitleEdit: false,
      tempListTitle: '',
    }
  },

  components: {
    draggable,
    TodoListDeletionModal
  },

  methods: {
    editListTitle(title) {
      this.listTitleEdit = true;
      this.tempListTitle = title;

      this.$nextTick(() => {
        this.$refs['listTitleInput'].focus();
      })
    },

    saveListTitle($event) {
      if (!$event.target.value || $event.target.value.trim().length === 0) return;

      this.listTitleEdit = false;
      const title = this.removeUselessSymbols($event.target.value.trim(), 'all');
      
      this.$emit('saveListTitle', title);
    },

    discardListTitleEdit() {
      this.listTitleEdit = false;
    },

    removeUselessSymbols(todoListItemTitle, mode) {
      switch (mode) {
        case 'all':
          return todoListItemTitle.replace(/([\r\n])|( +(?= ))|(^\s)/g, '');

        case 'breaks':
          return todoListItemTitle.replace(/[\r\n]/g, ' ').replace(/ +(?= )/g, '');
      }
    },

    createListItem($event, newListItemTitle) {
      let title = $event.target.value || newListItemTitle;
      if (!title.trim()) return;

      title = this.removeUselessSymbols(title, 'all').trim();

      this.newListItemTitle = '';
      $event.target.value = '';

      this.$emit('create', title);
    },

    checkListItem(item) {
      this.$emit('check', item);
    },

    rangeListItem(item) {
      this.$emit('range', item);
    },

    editListItemTitle(item) {
      const hiddenField = this.$refs.hiddenTitleOfListItem;
      const pageYOffset = window.pageYOffset;

      item.titleEdit = true;
      this.currentListItemTitle = item.title;

      this.$nextTick(() => {
        const editField = this.$refs[`editTitleOfListItem-${this.listItems.indexOf(item)}`];
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

        const editField = this.$refs[`editTitleOfListItem-${this.listItems.indexOf(item)}`];

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
      this.$emit('saveTitle', item, this.currentListItemTitle);
      this.currentListItemTitle = '';
    },

    discardEditedListItemTitle(item) {
      item.titleEdit = false;
      this.currentListItemTitle = '';
    },

    toggleLikeListItem(item) {
      this.$emit('like', item);
    },

    deleteListItem(listItem) {
      this.$emit('delete', listItem);
    },

    deleteList(list) {
      this.$emit('deleteList', list);
    }
  }
}
</script>
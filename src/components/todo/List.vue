<template>
  <div class="new-todo-list-item mb-4">
    <i class='bx bxs-plus-circle' @click="createListItem($event, newListItemTitle)"></i>
    <input v-model="newListItemTitle" @keypress.enter="createListItem($event, newListItemTitle)" class="form-control"
      type="text" :placeholder="this.$t('list.item.placeholder')">
  </div>

  <ul class="todo-list-item-filters mb-2">
    <li v-for="filter in listItemFilters" v-bind:key="filter" @click="currentListItemFilter = filter"
      :class="{ 'todo-list-current-filter': currentListItemFilter === filter }">{{ filter.title }}</li>
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

  <div class="todo-list-empty mb-3" v-if="isCurrentFilterEmpty">
    {{ this.$t('list.item.nothing') }}
  </div>

  <draggable v-else ref="draggableList" :list="list.items" @change="rangeListItem" tag="ul"
    handle=".todo-list-item-handle" item-key="id" :delay="200" :animation="300" easing="cubic-bezier(0.37, 0, 0.63, 1)"
    :force-fallback="true" :force-autoscroll-fallback="true" :scroll-sensitivity="30" :scroll-speed="200"
    class="todo-list-items list-group list-group-flush">

    <template #item="{ element: item }">
      <li
        v-if="currentListItemFilter.name === 'all' || (currentListItemFilter.name === 'liked' && item.liked) || (currentListItemFilter.name === 'done' && item.done)"
        class="todo-list-item list-group-item" :class="{ 'todo-list-item-liked': item.liked }">

        <i class='todo-list-item-check bx' :class="{ 'bx-check-circle': item.done, 'bx-circle': !item.done }"
          @click="checkListItem(item)"></i>

        <span :ref="`titleOfListItem-${list.items.indexOf(item)}`" class="todo-list-item-title todo-list-item-handle"
          :class="{ 'todo-list-item-done': item.done }" @dblclick="editListItemTitle(item)" v-if="!item.titleEdit">{{
              item.title
          }}</span>

        <textarea :placeholder="this.$t('list.item.placeholder')" rows="1" class="todo-list-item-edit form-control"
          type="text" :value="currentListItemTitle" v-if="item.titleEdit"
          :ref="`editTitleOfListItem-${list.items.indexOf(item)}`" @keypress.enter="saveEditedListItemTitle(item)"
          @input="inputListItemTitleText($event, item)" @blur.prevent="saveEditedListItemTitle(item)"
          @keyup.esc="discardEditedListItemTitle(item)" @keydown="keyPressOnListItemTitleText($event)"
          @paste="pasteListItemTitleText()"></textarea>

        <div class="dropdown todo-list-item-menu">
          <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown"
            aria-expanded="false">
            <i class="bx bx-dots-vertical-rounded"></i>
          </button>

          <ul class="dropdown-menu dropdown-menu-end">
            <li class="dropdown-item" @click="editListItemTitle(item)">
              <i class="bx bx-edit-alt me-1"></i> {{ this.$t('common.edit') }}
            </li>

            <li class="dropdown-item" @click="toggleLikeListItem(item)">
              <i class="bx me-1" :class="{ 'bx-heart': !item.liked, 'bxs-heart': item.liked }"></i>
              {{ item.liked ? this.$t('list.item.unfavorite') : this.$t('list.item.favorite') }}
            </li>

            <li class="dropdown-item" @click="deleteListItem(item)">
              <i class='todo-list-item-delete bx bx-trash-alt me-1'></i> {{ this.$t('common.delete') }}
            </li>
          </ul>
        </div>
      </li>

    </template>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'
import { removeUselessSymbols } from '../../helpers/string-utils'

export default {
  emits: ['create', 'check', 'range', 'saveTitle', 'like', 'delete', 'saveListTitle', 'update'],
  props: ['list', 'listTitle'],

  data() {
    const filters = [
      { name: 'all', title: this.$t('list.item.all') },
      { name: 'liked', title: this.$t('list.item.favorites') },
      { name: 'done', title: this.$t('list.item.done') }
    ];

    return {
      newListItemTitle: '',
      currentListItemTitle: '',
      listItemFilters: filters,
      currentListItemFilter: filters[0],
      isPastedText: false,
      isEnterKey: false,
      isListItemEnterKey: false,
      discardedListItemTitleEdit: false,
    }
  },

  computed: {
    isCurrentFilterEmpty() {
      if (this.list && this.list.items) {
        if (this.currentListItemFilter.name === 'all') {
          return this.list.items.length ? false : true;

        } else if (this.currentListItemFilter.name === 'liked') {
          return this.list.items.filter(i => i.liked).length ? false : true;

        } else if (this.currentListItemFilter.name === 'done') {
          return this.list.items.filter(i => i.done).length ? false : true;
        }
      }
    }
  },

  components: {
    draggable,
  },

  methods: {
    createListItem($event, newListItemTitle) {
      let title = $event.target.value || newListItemTitle;
      if (!title.trim()) return;

      title = removeUselessSymbols(title, 'all').trim();

      this.newListItemTitle = '';
      $event.target.value = '';

      this.$emit('create', title);
    },

    checkListItem(item) {
      this.$emit('check', item);
    },

    rangeListItem(movedItem) {
      const item = movedItem.moved.element;
      const newIndex = movedItem.moved.newIndex;
      this.$emit('range', item, newIndex);
    },

    editListItemTitle(item) {
      const hiddenField = this.$refs.hiddenTitleOfListItem;
      const pageYOffset = window.pageYOffset;

      item.titleEdit = true;
      this.currentListItemTitle = item.title;

      this.$nextTick(() => {
        const editField = this.$refs[`editTitleOfListItem-${this.list.items.indexOf(item)}`];
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
        $event.target.value = removeUselessSymbols($event.target.value, 'breaks');
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

        const editField = this.$refs[`editTitleOfListItem-${this.list.items.indexOf(item)}`];

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

      if (this.discardedListItemTitleEdit) {
        this.discardedListItemTitleEdit = false;
        return;
      }

      if (!this.currentListItemTitle.trim()) return;

      this.currentListItemTitle = removeUselessSymbols(this.currentListItemTitle, 'all').trim();
      this.$emit('saveTitle', item, this.currentListItemTitle);
      this.currentListItemTitle = '';
    },

    discardEditedListItemTitle(item) {
      this.discardedListItemTitleEdit = true;
      item.titleEdit = false;
      this.currentListItemTitle = '';
    },

    toggleLikeListItem(item) {
      this.$emit('like', item);
    },

    deleteListItem(listItem) {
      this.$emit('delete', listItem);
    }
  },

  updated() {
    this.$emit('update');
  }
}
</script>
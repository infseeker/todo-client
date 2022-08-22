<template>
  <div class="todo-list mt-4">
    <div class="card w-100">
      <div class="card-body">
        <div>
          <div v-if="!listTitle && !isUnsavedListMessageHidden"
            class="unsaved-list-message alert alert-primary alert-dismissible" role="alert">
            <span
              v-html="this.$t('list.unsavedMessage', [`<a href='/registration'>${this.$t('user.register')}</a>`, `<a href='/login'>${this.$t('user.login')}</a>`])"></span>

            <button type="button" class="btn-close" @click="hideUnsavedListMessage" data-bs-dismiss="alert"
              aria-label="Close">
            </button>
          </div>
          <div v-if="!listTitle" class="todo-list-title-wrapper">
            <h4 class="todo-list-title">{{ this.$t('list.unsaved') }}</h4>
          </div>

          <div v-if="listTitle" class="todo-list-title-wrapper">
            <h4 v-if="!listTitleEdit" class="todo-list-title">{{ listTitle }} <i v-if="list.shared.length"
                class="bx" :class="[list.owner.id === this.$user.id ? 'bx-group' : 'bxs-group']"></i></h4>

            <form v-if="listTitleEdit">
              <input :placeholder="this.$t('list.title')" ref="listTitleInput"
                @keypress.enter.prevent="saveListTitle($event)" @keyup.esc="discardListTitleEdit"
                @blur="saveListTitle($event)" v-model="tempListTitle" type="text"
                class="todo-list-title-edit form-control">
            </form>

            <div class="todo-list-menu dropdown">
              <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown"
                aria-expanded="false" data-bs-offset="-10, 0">
                <i class="bx bx-dots-vertical-rounded"></i>
              </button>

              <ul v-if="list.owner.id === this.$user.id" class="dropdown-menu dropdown-menu-end">
                <li @click="editListTitle(listTitle)" class="dropdown-item">
                  <i class="bx bx-edit-alt me-1"></i> {{ this.$t('list.edit') }}
                </li>

                <li class="dropdown-item" @click="showListSharingModal = true">
                  <i class="bx bxs-group me-1"></i> {{ this.$t('list.share') }}
                </li>

                <li class="dropdown-item" @click="showListDeletionModal = true">
                  <i class="bx bx-trash-alt me-1"></i> {{ this.$t('list.delete') }}
                </li>
              </ul>

              <ul v-else class="dropdown-menu dropdown-menu-end">
                  <li class="dropdown-item">
                  <i class="bx bx-group me-1"></i> Unsubscribe
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="new-todo-list-item mb-4">
          <i class='bx bxs-plus-circle' @click="createListItem($event, newListItemTitle)"></i>
          <input v-model="newListItemTitle" @keypress.enter="createListItem($event, newListItemTitle)"
            class="form-control" type="text" :placeholder="this.$t('list.item.placeholder')">
        </div>

        <ul class="todo-list-item-filters mb-2">
          <li :class="{ 'todo-list-current-filter': currentListItemFilter === 'all' }"
            @click="currentListItemFilter = 'all'">
            {{ this.$t('list.item.all') }}</li>
          <li :class="{ 'todo-list-current-filter': currentListItemFilter === 'liked' }"
            @click="currentListItemFilter = 'liked'">{{ this.$t('list.item.favorites') }}</li>
          <li :class="{ 'todo-list-current-filter': currentListItemFilter === 'done' }"
            @click="currentListItemFilter = 'done'">{{ this.$t('list.item.done') }}</li>
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
          {{ this.$t('list.item.nothing') }}
        </div>

        <draggable ref="draggableList" :list="listItems" @change="rangeListItem" tag="ul"
          handle=".todo-list-item-handle" item-key="id" :delay="200" :animation="300"
          easing="cubic-bezier(0.37, 0, 0.63, 1)" :force-fallback="true" :force-autoscroll-fallback="true"
          :scroll-sensitivity="30" :scroll-speed="200" class="todo-list-items list-group list-group-flush">

          <template #item="{ element: item }">
            <li class="todo-list-item list-group-item" :class="{ 'todo-list-item-liked': item.liked }"
              v-if="currentListItemFilter === 'all' || (currentListItemFilter === 'liked' && item.liked) || (currentListItemFilter === 'done' && item.done)">

              <i class='todo-list-item-check bx' :class="{ 'bx-check-circle': item.done, 'bx-circle': !item.done }"
                @click="checkListItem(item)"></i>

              <span :ref="`titleOfListItem-${listItems.indexOf(item)}`"
                class="todo-list-item-title todo-list-item-handle" :class="{ 'todo-list-item-done': item.done }"
                @dblclick="editListItemTitle(item)" v-if="!item.titleEdit">{{ item.title }}</span>

              <textarea :placeholder="this.$t('list.item.placeholder')" rows="1"
                class="todo-list-item-edit form-control" type="text" :value="currentListItemTitle" v-if="item.titleEdit"
                :ref="`editTitleOfListItem-${listItems.indexOf(item)}`" @keypress.enter="saveEditedListItemTitle(item)"
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

        <ListDeletionModal v-if="list && showListDeletionModal" :list="this.list"
          @close="showListDeletionModal = false"></ListDeletionModal>

        <ListSharingModal v-if="list && showListSharingModal" :list="this.list" @close="showListSharingModal = false">
        </ListSharingModal>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import ListSharingModal from './ListSharingModal.vue';
import ListDeletionModal from './ListDeletionModal.vue';

export default {
  props: ['list', 'listItems', 'listTitle'],

  data() {
    return {
      isUnsavedListMessageHidden: false,

      listTitleEdit: false,
      tempListTitle: '',
      discardedListTitleEdit: false,

      newListItemTitle: '',
      currentListItemTitle: '',
      currentListItemFilter: 'all',
      isPastedText: false,
      isEnterKey: false,
      discardedListItemTitleEdit: false,

      showListSharingModal: false,
      showListDeletionModal: false,
    }
  },

  components: {
    draggable,
    ListSharingModal,
    ListDeletionModal
  },

  methods: {
    toggleUnsavedListMessage() {
      const lsItem = localStorage.getItem('unsavedListMessageHide');
      this.isUnsavedListMessageHidden = lsItem === 'true' ? true : false;
    },

    hideUnsavedListMessage() {
      localStorage.setItem('unsavedListMessageHide', true);
    },

    editListTitle(title) {
      this.listTitleEdit = true;
      this.tempListTitle = title;

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

      this.listTitleEdit = false;
      const title = this.removeUselessSymbols($event.target.value.trim(), 'all');

      this.$emit('saveListTitle', title);
    },

    discardListTitleEdit() {
      this.discardedListTitleEdit = true;
      this.listTitleEdit = false;
    },

    removeUselessSymbols(listItemTitle, mode) {
      switch (mode) {
        case 'all':
          return listItemTitle.replace(/([\r\n])|( +(?= ))|(^\s)/g, '');

        case 'breaks':
          return listItemTitle.replace(/[\r\n]/g, ' ').replace(/ +(?= )/g, '');
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

      if (this.discardedListItemTitleEdit) {
        this.discardedListItemTitleEdit = false;
        return;
      }

      if (!this.currentListItemTitle.trim()) return;

      this.currentListItemTitle = this.removeUselessSymbols(this.currentListItemTitle, 'all').trim();
      this.$emit('saveTitle', item, this.currentListItemTitle);
      this.currentListItemTitle = '';
    },

    discardEditedListItemTitle(item) {
      console.log('discard');
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

  mounted() {
    this.toggleUnsavedListMessage();
  }
}
</script>

<style scoped>
@media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
  .unsaved-list-message {
    margin: 0.7rem 1rem;
  }
}

.unsaved-list-message a {
  text-decoration: underline;
}

.todo-list-title .bxs-group, .todo-list-title .bx-group {
  width: 1.4rem;
  height: 1.4rem;
  position: relative;
  margin-left: 0.1rem;
  top: 0.25rem
}
</style>
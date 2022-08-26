<template>
  <div class="todo-list-menu dropdown">
    <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown" aria-expanded="false"
      data-bs-offset="-10, 0">
      <i class="bx bx-dots-vertical-rounded"></i>
    </button>

    <ul v-if="list.owner.id === this.$user.id" class="dropdown-menu dropdown-menu-end">
      <li class="dropdown-item" @click="$emit('edit', list)">
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
      <li class="dropdown-item" @click="showListUnsubscribeModal = true">
        <i class="bx bx-group me-1"></i> {{ this.$t('list.unsubscribe') }}
      </li>
    </ul>
  </div>

  <ListDeletionModal v-if="list && showListDeletionModal" :list="this.list" @close="showListDeletionModal = false">
  </ListDeletionModal>

  <ListSharingModal v-if="list && showListSharingModal" :listId="this.list.id" @close="showListSharingModal = false">
  </ListSharingModal>

  <ListUnsubscribeModal v-if="list && showListUnsubscribeModal" :listId="this.list.id"
    @close="showListUnsubscribeModal = false">
  </ListUnsubscribeModal>
</template>

<script>
import ListSharingModal from './ListSharingModal.vue';
import ListUnsubscribeModal from './ListUnsubscribeModal.vue';
import ListDeletionModal from './ListDeletionModal.vue';

export default {
  emits: ['edit'],

  data() {
    return {
      showListSharingModal: false,
      showListDeletionModal: false,
      showListUnsubscribeModal: false,
    }
  },

  props: ['list'],

  components: {
    ListSharingModal,
    ListUnsubscribeModal,
    ListDeletionModal,
  },

  methods: {

  }
}
</script>


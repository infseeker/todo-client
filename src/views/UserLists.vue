<template>
  <div class="lists mt-4">
    <div class="card">
      <div class="card-body">
        <div class="lists-title-wrapper mb-3">
          <h4 class="mb-0">{{ this.$t('list.heading') }}</h4>
          <button @click="showListCreationModal = true" type="button" class="new-list btn btn-primary"
            :title="this.$t('list.new')">
            <i class='bx bx-list-plus'></i>
          </button>
        </div>

        <ul v-if="this.$store.lists && this.$store.lists.length" class="user-lists list-group list-group-flush">
          <li class="list list-group-item" v-for="list in this.$store.lists" v-bind:key="list.id">
            <router-link :to="{ name: 'list', params: { listId: list.id } }">{{ list.title }}</router-link>

            <div class="dropdown">
              <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown"
                aria-expanded="false" data-bs-offset="-10, 0">
                <i class="bx bx-dots-vertical-rounded"></i>
              </button>

              <ul class="dropdown-menu dropdown-menu-end">
                <li class="dropdown-item" @click="currentList = list; showListEditingModal = true">
                  <i class="bx bx-edit-alt me-1"></i> {{ this.$t('list.edit') }}
                </li>

                <li class="dropdown-item" @click="currentList = list; showListDeletionModal = true">
                  <i class='bx bx-trash-alt me-1'></i> {{ this.$t('list.delete') }}
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <div v-else class="no-lists mb-3">{{ this.$t('list.nothing') }}</div>
      </div>
    </div>
  </div>

  <UnsavedListSavingModal v-if="showUnsavedListSavingModal" @close="showUnsavedListSavingModal = false">
  </UnsavedListSavingModal>
  <ListCreationModal v-if="showListCreationModal" @close="showListCreationModal = false"></ListCreationModal>
  <ListEditingModal v-if="showListEditingModal" :list="this.currentList" @close="showListEditingModal = false">
  </ListEditingModal>
  <ListDeletionModal v-if="showListDeletionModal" :list="this.currentList" @close="showListDeletionModal = false">
  </ListDeletionModal>
</template>

<script>
import List from '../models/List'
import ListService from '../services/ListService';

import UnsavedListSavingModal from '../components/todo/UnsavedListSavingModal.vue';
import ListCreationModal from '../components/todo/ListCreationModal.vue'
import ListEditingModal from '../components/todo/ListEditingModal.vue'
import ListDeletionModal from '../components/todo/ListDeletionModal.vue'

export default {
  data() {
    return {
      currentList: {},

      showUnsavedListSavingModal: false,
      showListCreationModal: false,
      showListEditingModal: false,
      showListDeletionModal: false,
    }
  },

  props: ['unsavedList'],

  components: {
    UnsavedListSavingModal,
    ListCreationModal,
    ListEditingModal,
    ListDeletionModal,
  },

  methods: {
    getLists() {
      if (this.unsavedList) {
        const hideUnsavedListModal = JSON.parse(localStorage.getItem('hideUnsavedListModal'));
        
        if (!hideUnsavedListModal) {
          this.showUnsavedListSavingModal = true;
        }
      }

      if (!this.$store.lists.length) {
        this.$loader.show();

        ListService.getLists().then(r => {
          this.$loader.hide();

          if (r.code === 200) {
            r.data.forEach(i => {
              this.$store.lists.push(new List(i));
            });
          }
        });
      }
    },
  },

  mounted() {
    this.getLists();
  }
}
</script>
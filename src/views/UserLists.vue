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

        <ul v-if="sharedLists.length" class="list-filters mb-2">
          <li :class="{ 'list-filter': listFilter === 'all' }" @click="listFilter = 'all'">
            {{ this.$t('list.all') }} ({{ this.$store.lists.length }})
          </li>
          <li :class="{ 'list-filter': listFilter === 'shared' }" @click="listFilter = 'shared'">
            {{ this.$t('list.shared') }} ({{ sharedLists.length }})
          </li>
        </ul>

        <ul v-if="filteredLists && filteredLists.length" class="user-lists list-group list-group-flush">
          <li class="list list-group-item" v-for="list in filteredLists" v-bind:key="list.id">

            <router-link :to="{ name: 'list', params: { listId: list.id } }">
              {{ list.title }}
              <i v-if="list.shared.length" class="bx" :class="[list.owner.id === this.$user.id ? 'bx-group' : 'bxs-group']"></i>
            </router-link>

            <div class="dropdown">
              <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown"
                aria-expanded="false" data-bs-offset="-10, 0">
                <i class="bx bx-dots-vertical-rounded"></i>
              </button>

              <ul v-if="list.owner.id === this.$user.id" class="dropdown-menu dropdown-menu-end">
                <li class="dropdown-item" @click="currentList = list; showListEditingModal = true">
                  <i class="bx bx-edit-alt me-1"></i> {{ this.$t('list.edit') }}
                </li>

                <li class="dropdown-item" @click="currentList = list; showListSharingModal = true">
                  <i class='bx bxs-group me-1'></i> {{ this.$t('list.share') }}
                </li>

                <li class="dropdown-item" @click="currentList = list; showListDeletionModal = true">
                  <i class='bx bx-trash-alt me-1'></i> {{ this.$t('list.delete') }}
                </li>
              </ul>

              <ul v-else class="dropdown-menu dropdown-menu-end">
                <li class="dropdown-item">
                  <i class="bx bx-group me-1"></i> Unsubscribe
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
  <ListSharingModal v-if="showListSharingModal" :list="this.currentList" @close="showListSharingModal = false">
  </ListSharingModal>
</template>

<script>
import List from '../models/List'
import ListService from '../services/ListService';

import UnsavedListSavingModal from '../components/todo/UnsavedListSavingModal.vue';
import ListCreationModal from '../components/todo/ListCreationModal.vue'
import ListEditingModal from '../components/todo/ListEditingModal.vue'
import ListDeletionModal from '../components/todo/ListDeletionModal.vue'
import ListSharingModal from '../components/todo/ListSharingModal.vue'

export default {
  data() {
    return {
      currentList: {},
      listFilter: 'all',
      sharedLists: this.$store.lists.filter(l => l.shared.length),

      showUnsavedListSavingModal: false,
      showListCreationModal: false,
      showListEditingModal: false,
      showListDeletionModal: false,
      showListSharingModal: false,
    }
  },

  props: ['unsavedList'],

  computed: {
    filteredLists() {
      if (this.listFilter === 'all') {
        return this.$store.lists;
      } else if (this.listFilter === 'shared') {
        return this.$store.lists.filter(l => l.shared.length);
      }
    }
  },

  components: {
    UnsavedListSavingModal,
    ListCreationModal,
    ListEditingModal,
    ListDeletionModal,
    ListSharingModal,
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

            this.$store.lists.sort((a, b) => a.id - b.id);

            this.sharedLists = this.$store.lists.filter(l => l.shared.length);
            console.log(this.$user, this.$store.lists)
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

<style scoped>
.list-filters {
  display: flex;
  margin: 0;
  margin-top: 1rem;
  padding: 0;
  justify-content: center;
  list-style: none;
}

.list-filters li {
  margin: 0 0.3rem;
  cursor: pointer;
}

.list-filter {
  color: #696cff;
}

a .bxs-group, a .bx-group {
  width: 1.2rem;
  height: 1.2rem;
  position: relative;
  margin-left: 0.2rem;
  top: 0.3rem
}
</style>
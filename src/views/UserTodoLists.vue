<template>
  <div class="lists mt-4">
    <div class="card">
      <div class="card-body">
        <div class="lists-title-wrapper mb-3">
          <h4 class="mb-0">Мои списки</h4>
          <button @click="showTodoListCreationModal = true" type="button" class="new-list btn btn-primary" title="Новый список">
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
                <li class="dropdown-item" @click="currentList = list; showTodoListEditingModal = true">
                  <i class="bx bx-edit-alt me-1"></i> Редактировать название
                </li>

                <li class="dropdown-item" @click="currentList = list; showTodoListDeletionModal = true">
                  <i class='bx bx-trash-alt me-1'></i> Удалить список
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <div v-else class="no-lists mb-3">Здесь ещё нет ни одного списка</div>
      </div>
    </div>
  </div>

  <TodoListCreationModal v-if="showTodoListCreationModal" @close="showTodoListCreationModal = false"></TodoListCreationModal>
  <TodoListEditingModal v-if="showTodoListEditingModal" :list="this.currentList" @close="showTodoListEditingModal = false"></TodoListEditingModal>
  <TodoListDeletionModal v-if="showTodoListDeletionModal" :list="this.currentList" @close="showTodoListDeletionModal = false"></TodoListDeletionModal>
</template>

<script>
import List from '../models/List'
import ListService from './../services/ListService';

import TodoListCreationModal from '../components/todo/TodoListCreationModal.vue'
import TodoListEditingModal from '../components/todo/TodoListEditingModal.vue'
import TodoListDeletionModal from '../components/todo/TodoListDeletionModal.vue'

export default {
  data() {
    return {
      currentList: {},

      showTodoListCreationModal: false,
      showTodoListEditingModal: false,
      showTodoListDeletionModal: false,
    }
  },

  components: {
    TodoListCreationModal,
    TodoListEditingModal,
    TodoListDeletionModal,
  },

  methods: {
    getLists() {
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
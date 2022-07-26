<template>
  <div class="lists mt-4">
    <div class="card">
      <div class="card-body">
        <div class="lists-title-wrapper mb-3">
          <h4 class="mb-0">Мои списки</h4>
          <button @click="this.title = ''; this.isEdit = false;" type="button" class="new-list btn btn-primary"
            title="Новый список" data-bs-toggle="modal" data-bs-target="#listModal">
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
                <li class="dropdown-item" data-bs-toggle="modal" data-bs-target="#listModal" @click="edit(list)">
                  <i class="bx bx-edit-alt me-1"></i> Редактировать название
                </li>

                <li class="dropdown-item" data-bs-toggle="modal" data-bs-target="#listDeletionModal"
                  @click="currentList = list;">
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

  <div class="list-new-edit-modal">
    <div ref="listModal" class="modal fade" id="listModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 v-if="!isEdit" class="modal-title" id="exampleModalLabel1">Новый список</h5>
            <h5 v-else class="modal-title" id="exampleModalLabel1">Редактирование списка</h5>

            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col mb-3">
                <input v-if="!isEdit" v-model.trim="title" @keyup.enter.exact="create(title)" type="text"
                  class="form-control" placeholder="Введите название списка">

                <input v-else v-model.trim="title" @keyup.enter.exact="save(this.currentList, title)"
                  type="text" class="form-control" placeholder="Введите название списка">

                <div v-if="this.v$.title.$error" class="invalid-feedback d-block mx-2">Введите название списка
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>

            <button v-if="!isEdit" @click="create(title)" type="button" class="btn btn-primary"
              data-bs-dismiss="modal">Создать</button>
            <button ref="saveTitleButton" v-else @click="save(this.currentList, title)" type="button"
              class="btn btn-primary">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <TodoListDeletionModal :list="this.currentList" @delete-list="deleteList"></TodoListDeletionModal>
</template>

<script>
import ListService from './../services/ListService';
import useValidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { Modal } from 'bootstrap'

import TodoListDeletionModal from '../components/todo/TodoListDeletionModal.vue'

export default {
  data() {
    return {
      v$: useValidate(),
      currentList: {},
      title: '',
      isEdit: false,
    }
  },

  validations() {
    return {
      title: {
        required,
      },
    }
  },

  components: {
    TodoListDeletionModal,
  },

  methods: {
    getLists() {
      if (!this.$store.lists.length) {
        ListService.getLists().then(r => {
          if (r.code === 200) {
            this.$store.lists = r.data;
          } else if (r.code === 404) {
            console.log('Lists of current user not found');
          } else {
            console.log('Something went wrong');
          }
        });
      }
    },

    create(title) {
      this.v$.$validate();

      if (!this.v$.$error) {
        ListService.createList(title).then(r => {
          if (r.code === 200) {
            this.$store.lists.push(r.data);
            this.title = '';
            this.v$.$reset();
            this.$router.push({ name: 'list', params: { 'listId': r.data.id } });
          }
        });
      }
    },

    edit(list) {
      this.isEdit = true;
      this.currentList = list;
      this.title = list.title;
    },

    save(list, title) {
      this.v$.$validate();

      if (!this.v$.$error) {
        list.title = title;

        ListService.updateList(list).then(r => {
          if (r.code === 200) {
            console.log(`List #${list.id} was updated`);

            Modal.getInstance(this.$refs['listModal']).hide();
          }
        });
      }
    },

    deleteList(list) {
      ListService.deleteList(list).then(r => {
        if (r.code === 200) {
          console.log(`List #${list.id} was deleted`);
          this.$store.lists = this.$store.lists.filter(item => item !== list);
        }
      })
    }
  },

  mounted() {
    this.getLists();
  }
}
</script>

<style>
.lists .lists-title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lists .btn.new-list {
  padding: 0.2rem 0.3rem;
}

.lists .btn.new-list i {
  font-size: 1.4rem;
  position: relative;
  top: 0.16rem;
}

.lists .user-lists {
  padding: 0;
  margin: 0;
  list-style: none;
}

.lists .list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0.6rem 0.8rem 0.9rem !important;
  overflow-x: clip;
}

.lists .list .btn .bx {
  position: relative;
  top: 0.2rem;
  font-size: 1.6rem;
}

.lists .user-lists a {
  display: block;
  font-size: 1.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lists .no-lists {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  color: #697a8d73;
  font-size: 1.2rem;
}
</style>
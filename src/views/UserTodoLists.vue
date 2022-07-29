<template>
  <div class="lists mt-4">
    <div class="card">
      <div class="card-body">
        <div class="lists-title-wrapper mb-3">
          <h4 class="mb-0">Мои списки</h4>
          <button @click="showListCreationModal" type="button" class="new-list btn btn-primary" title="Новый список"
            data-bs-toggle="modal" data-bs-target="#listModal">
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
                <input v-if="!isEdit" type="text" ref="createListTitleInput" :value="title"
                  @keypress.enter="create($event)" class="form-control" placeholder="Введите название списка">

                <input v-else type="text" ref="editListTitleInput" :value="title"
                  @keypress.enter="save($event, this.currentList)" class="form-control"
                  placeholder="Введите название списка">

                <div v-if="this.v$.title.$error" class="invalid-feedback d-block mx-2">Введите название списка</div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>

            <button :disabled="isDisabled" v-if="!isEdit" @click="create($event)" type="button"
              class="btn btn-primary">Создать</button>

            <button :disabled="isDisabled" ref="saveTitleButton" v-else @click="save($event, this.currentList)"
              type="button" class="btn btn-primary">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <TodoListDeletionModal :list="this.currentList" @delete-list="deleteList"></TodoListDeletionModal>
</template>

<script>
import List from '../models/List'
import ListService from './../services/ListService';
import useValidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { Modal } from 'bootstrap'
import { setFocusOnModalInput } from '../helpers/modalInputFocus'

import TodoListDeletionModal from '../components/todo/TodoListDeletionModal.vue'

export default {
  data() {
    return {
      v$: useValidate(),
      currentList: {},
      title: '',
      isEdit: false,
      isDisabled: false,
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
    setFocusOnModalInputCreateEdit() {
      this.$nextTick(() => {
        const modal = this.$refs['listModal'];
        const input = this.$refs['createListTitleInput'];
        const secondInput = this.$refs['editListTitleInput'];
        const condition = this.isEdit;

        setFocusOnModalInput(this, modal, input, condition, secondInput);
      })
    },

    getLists() {
      if (!this.$store.lists.length) {
        this.$loader.show();

        ListService.getLists().then(r => {
          this.$loader.hide();

          if (r.code === 200) {
            r.data.forEach(i => {
              this.$store.lists.push(new List(i));
            });
          } else if (r.code === 404) {
            console.log('Lists of current user not found');
          } else {
            console.log('Something went wrong');
          }
        });
      }
    },

    showListCreationModal() {
      this.title = '';
      this.isEdit = false;
      this.v$.$reset();

      this.setFocusOnModalInputCreateEdit()
    },

    create($event) {
      this.title = $event.target.value.trim() || this.$refs['createListTitleInput'].value.trim();
      this.title = this.title.replace(/([\r\n])|( +(?= ))|(^\s)/g, '');

      this.v$.$validate();

      if (!this.v$.$error) {
        this.$loader.show();
        this.isDisabled = true;

        ListService.createList(this.title).then(r => {
          this.$loader.hide();
          this.isDisabled = false;

          if (r.code === 200) {
            this.$store.lists.push(new List(r.data));
            this.title = '';
            this.v$.$reset();

            Modal.getInstance(this.$refs['listModal']).hide();
            this.$router.push({ name: 'list', params: { 'listId': r.data.id } });
          }
        });
      }
    },

    edit(list) {
      this.currentList = list;
      this.title = list.title;
      this.isEdit = true;

      this.setFocusOnModalInputCreateEdit();
    },

    save($event, list) {
      this.title = $event.target.value.trim() || this.$refs['editListTitleInput'].value.trim();
      this.v$.$validate();

      if (!this.v$.$error) {
        list.title = this.title.replace(/([\r\n])|( +(?= ))|(^\s)/g, '');
        this.title = '';
        this.v$.$reset();

        Modal.getInstance(this.$refs['listModal']).hide();

        ListService.updateList(list).then(r => {
          if (r.code === 200) {
          }
        });
      }
    },

    deleteList(list) {
      this.$store.lists = this.$store.lists.filter(item => item !== list);
      ListService.deleteList(list).then(r => {
        if (r.code === 200) {
        }
      })
    }
  },

  mounted() {
    this.getLists();
  }
}
</script>
<template>
  <div class="todo-list mt-4">
    <div class="card w-100">
      <div class="card-body">
        <div v-if="!isUnsavedListMessageHidden" class="unsaved-list-message alert alert-primary alert-dismissible"
          role="alert">
          <span
            v-html="this.$t('list.unsavedMessage', [`<a href='/registration'>${this.$t('user.register')}</a>`, `<a href='/login'>${this.$t('user.login')}</a>`])"></span>

          <button type="button" class="btn-close" @click="hideUnsavedListMessage" data-bs-dismiss="alert"
            aria-label="Close">
          </button>
        </div>

        <div class="todo-list-title-wrapper">
          <h4 class="todo-list-title mb-4">{{ this.$t('list.unsaved') }}</h4>
        </div>

        <div class="guest-todo-list">
          <todo-list :list="{ items: listItems }" @create="createListItem" @check="checkListItem"
            @range="saveDataToLocalStorage" @save-title="saveListItemTitle" @like="likeListItem"
            @delete="deleteListItem">
          </todo-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TodoList from '../components/todo/List.vue';
import ListItem from '../models/ListItem'

export default {
  data() {
    return {
      listItems: [],
      isUnsavedListMessageHidden: false,
    }
  },

  components: {
    TodoList,
  },

  methods: {
    getDataFromLocalStorage() {
      const data = JSON.parse(localStorage.getItem(this.$lsItems.unsaved)) || []
      data.forEach(i => {
        this.listItems.push(new ListItem(i));
      });
    },

    saveDataToLocalStorage() {
      localStorage.setItem(this.$lsItems.unsaved, JSON.stringify(this.listItems));
    },

    createListItem(title) {
      this.listItems.push(new ListItem({ title: title }));
      this.saveDataToLocalStorage();
    },

    checkListItem(listItem) {
      listItem.check();
      this.saveDataToLocalStorage();
    },

    saveListItemTitle(listItem, title) {
      listItem.saveTitle(title);
      this.saveDataToLocalStorage();
    },

    likeListItem(listItem) {
      listItem.like();
      this.saveDataToLocalStorage();
    },

    deleteListItem(listItem) {
      this.listItems = this.listItems.filter(item => item !== listItem);
      this.saveDataToLocalStorage();
    },

    toggleUnsavedListMessage() {
      const lsItem = localStorage.getItem(this.$lsItems.hideUnsaved);
      this.isUnsavedListMessageHidden = lsItem === 'true' ? true : false;
    },

    hideUnsavedListMessage() {
      localStorage.setItem(this.$lsItems.hideUnsaved, true);
    },
  },

  mounted() {
    this.getDataFromLocalStorage();
    this.toggleUnsavedListMessage();
  }
};
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
</style>
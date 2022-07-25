

<template>
  <div class="lists mt-4">
    <div class="card">
      <div class="card-body">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <h4 class="mb-0">Мои списки</h4>
          <button type="button" class="new-list btn btn-primary" title="Новый список">
            <i class='bx bx-list-plus'></i>
          </button>
        </div>
        <ul class="user-lists">
          <li v-for="list in this.$store.lists" v-bind:key="list.id">
            <router-link :to="{ name: 'list', params: { listId: list.id } }">{{ list.title }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ListService from './../services/ListService';

export default {
  data() {
    return {
    }
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
    }
  },

  mounted() {
    this.getLists();
  }
}
</script>

<style>
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

.lists li {
  overflow: hidden;
  margin: 0.4rem 0;
}

.lists .user-lists a {
  font-size: 1.2rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>
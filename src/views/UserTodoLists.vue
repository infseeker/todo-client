<template>
  <div class="lists">
    <h1>Lists</h1>
    <ul>
      <li v-for="list in this.$store.lists" v-bind:key="list.id">{{ list.title }}</li>
    </ul>
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
          } else if(r.code === 404) {
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
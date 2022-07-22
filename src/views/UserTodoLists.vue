<template>
  <div class="lists">
    <h1>Lists</h1>
    <div>{{ this.$store.lists }}</div>
  </div>
</template>

<script>
import ListService from './../services/ListService';

export default {
  data() {
    return {

    }
  },
  components: {

  },
  mounted() {
    if (!this.$store.lists) {
      ListService.getLists().then(data => {
        if (data.code === 200) {
          this.$store.lists = data.data;
          console.log(this.$store);
        } else {
          console.log('Something went wrong');
        }
      });
    }
  }
}
</script>
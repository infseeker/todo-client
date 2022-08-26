<template>
  <modal>
    <template v-slot:title>
      {{ this.$t('list.unsubscribing') }}
    </template>

    <template v-slot:content>
      <span v-html="this.$t('list.unsubscribe?', [`<mark>${list.title}</mark>`])"></span>
    </template>

    <template v-slot:buttons>
      <button @click="unsubscribe(list, this.$user.email)" type="button" class="btn btn-primary"
        data-bs-dismiss="modal">
        {{ this.$t('list.unsubscribe') }}
      </button>
    </template>
  </modal>
</template>

<script>
import Modal from '../common/Modal.vue'
import ListService from '../../services/ListService';

export default {
  data() {
    return {
      list: this.$store.lists.find(l => l.id === this.listId),
    }
  },

  props: ['listId'],

  components: {
    Modal
  },

  methods: {
    unsubscribe(list, email) {
      // Hack:
      // It is not known why the interface is not rerender after the removal of the last element of this.$store.lists
      // $nextTick function doesn't work in this case
      setTimeout(() => {
        this.$store.lists = this.$store.lists.filter(item => item !== list);
      }, 0);

      this.$router.push({ name: 'lists' });

      ListService.unshareList(list, email).then(r => {
        if (r.code === 200)
          this.$toast.success(this.$t('list.unsubscribed', [list.title]));
        else
          this.$toast.warning(this.$t('user.dataNotValid'));
      });
    }
  }
}
</script>
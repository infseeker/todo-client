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
import { io } from 'socket.io-client'
import { api } from '/public/server-api'

export default {
  data() {
    return {
      list: this.$store.lists.find(l => l.id === this.listId),
      socket: null,
    }
  },

  props: ['listId'],

  components: {
    Modal
  },

  methods: {
    unsubscribe(list, email) {
      ListService.unshareList(list, email).then(r => {
        if (r.code === 200) {
          this.$toast.info(this.$t('list.unsubscribed', [list.title]));
          this.socket.emit('unshare_list', { list_id: this.list.id, data: r.data });

          setTimeout(() => {
            this.$store.lists = this.$store.lists.filter(item => item !== list);
          }, 0);

          this.$router.push({ name: 'lists' });
        } else {
          this.$toast.warning(this.$t('user.dataNotValid'));
        }
      });
    }
  },

  mounted() {
    this.socket = io({ path: api.lists.shared_list, auth: { list_id: this.list.id } });
  }
}
</script>
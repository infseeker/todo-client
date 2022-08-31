<template>
  <modal>
    <template v-slot:title>
      {{ this.$t('list.deletion') }}
    </template>

    <template v-slot:content>
      <span v-html="this.$t('list.delete?', [`<mark>${list.title}</mark>`])" class="lh-2"></span>
    </template>

    <template v-slot:buttons>
      <button @click="deleteList(list)" type="button" class="btn btn-danger" data-bs-dismiss="modal">{{
          this.$t('common.delete')
      }}</button>
    </template>
  </modal>
</template>

<script>
import Modal from '../common/Modal.vue'
import ListService from '../../services/ListService';
import { io } from 'socket.io-client'
import { api } from '/public/server-api'

export default {
  props: ['list'],

  components: {
    Modal
  },

  methods: {
    async deleteList(list) {
      if (!list.shared.length) {
        // Hack:
        // It is not known why the interface is not rerender after the removal of the last element of this.$store.lists
        // $nextTick function doesn't work in this case
        setTimeout(() => {
          this.$store.lists = this.$store.lists.filter(item => item !== list);
        }, 0);

        this.$router.push({ name: 'lists' });

        ListService.deleteList(list).then(r => {
          if (r.code === 200) {
            this.$toast.info(this.$t('list.deleted', [list.title]));
          }
        });
      } else {
        const socket = await io({ path: api.lists.shared_list, auth: { list_id: list.id } });

        socket.on('connected', () => {
          ListService.deleteList(list).then(r => {
            if (r.code === 200) {
              socket.emit('delete_list', { list_id: list.id });
            }
          });
        });
      }
    }
  }
}
</script>
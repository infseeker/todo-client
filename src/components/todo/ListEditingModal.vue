<template>
  <modal>
    <template v-slot:title>
      {{ this.$t('list.editing') }}
    </template>

    <template v-slot:content>
      <input type="text" ref="title" v-model="title" @keypress.enter="save($event)" class="form-control"
        :placeholder="this.$t('list.placeholder')">
    </template>

    <template v-slot:buttons>
      <button :disabled="isDisabled" @click="save($event)" type="button" class="btn btn-primary">{{
          this.$t('common.save')
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

  data() {
    return {
      title: '',
      isDisabled: false,
    }
  },

  components: {
    Modal
  },

  methods: {
    save($event) {
      const input = this.$refs['title'];
      let title = $event.target.value.trim() || input.value.trim();
      title = title.replace(/([\r\n])|( +(?= ))|(^\s)/g, '');

      if (!title) return;

      this.list.title = title;

      this.$emit('close');

      ListService.updateList(this.list).then(async r => {
        if (r.code === 200) {
          if (this.list.shared.length) {
            const socket = await io({ path: api.lists.shared_list, auth: { list_id: this.list.id } });

            socket.on('connected', () => {
              socket.emit('list_title_rename', { title: title, list_id: this.list.id });
            });
          }
        }
      });
    }
  },

  mounted() {
    this.title = this.list.title;
  }
}
</script>
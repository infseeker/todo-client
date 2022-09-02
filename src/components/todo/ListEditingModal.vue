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
      socket: null,
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

      ListService.updateList(this.list).then(r => {
        if (r.code === 200) {
          if (this.socket) {
            this.socket.emit('list_title_rename', { title: title, list_id: this.list.id });
            this.socket.emit('user_disconnect', {});
          }
        }
      });
    }
  },

  mounted() {
    this.title = this.list.title;
    
    if (this.list.shared.length) {
      this.socket = io({ path: api.lists.shared_list, auth: { list_id: this.list.id } });
    }
  },

  unmounted() {
    if (this.socket) {
      setTimeout(() => {
        this.socket.emit('user_disconnect', {});
      }, 5000);
    }
  }
}
</script>
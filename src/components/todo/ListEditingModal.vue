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
      <button :disabled="isDisabled" @click="save($event)" type="button"
        class="btn btn-primary">{{ this.$t('common.save') }}</button>
    </template>
  </modal>
</template>

<script>
import Modal from '../common/Modal.vue'
import ListService from '../../services/ListService';

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

      if(!title) return;

      this.list.title = title;

      this.$emit('close');

      ListService.updateList(this.list).then(r => {
        if (r.code === 200) {
        }
      });
    }
  },

  mounted() {
    this.title = this.list.title;
  }
}
</script>
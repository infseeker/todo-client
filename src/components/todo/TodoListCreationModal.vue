<template>
  <modal>
    <template v-slot:title>
      {{ this.$t('list.new') }}
    </template>

    <template v-slot:content>
      <input type="text" ref="createListTitleInput" @keypress.enter="create($event)" class="form-control"
        :placeholder="this.$t('list.placeholder')">
    </template>

    <template v-slot:buttons>
      <button :disabled="isDisabled" @click="create($event)" type="button"
        class="btn btn-primary">{{ this.$t('common.create') }}</button>
    </template>
  </modal>
</template>

<script>
import Modal from '../common/Modal.vue'
import List from '../../models/List'
import ListService from '../../services/ListService';

export default {
  data() {
    return {
      isDisabled: false,
    }
  },

  components: {
    Modal
  },

  methods: {
    create($event) {
      const input = this.$refs['createListTitleInput'];
      let title = $event.target.value.trim() || input.value.trim();
      title = title.replace(/([\r\n])|( +(?= ))|(^\s)/g, '');

      if(!title) return

      this.$loader.show();
      this.isDisabled = true;

      ListService.createList(title).then(r => {
        this.$loader.hide();
        this.isDisabled = false;

        if (r.code === 200) {
          this.$store.lists.push(new List(r.data));
          this.$router.push({ name: 'list', params: { 'listId': r.data.id } });

          this.$emit('close');
          this.$toast.success(this.$t('list.created'));
        }
      });
    },
  }
}
</script>
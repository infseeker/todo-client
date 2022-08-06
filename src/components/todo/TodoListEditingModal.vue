<template>
  <modal>
    <template v-slot:title>
      Редактирование списка
    </template>

    <template v-slot:content>
      <input type="text" ref="editListTitleInput" v-model="title" @keypress.enter="save($event)" class="form-control"
        placeholder="Введите название списка">
    </template>

    <template v-slot:buttons>
      <button :disabled="isDisabled" ref="saveTitleButton" @click="save($event)" type="button"
        class="btn btn-primary">Сохранить</button>
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
      const input = this.$refs['editListTitleInput'];
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
<template>
  <modal>
    <template v-slot:title>
      Удаление списка
    </template>

    <template v-slot:content>
      <span class="lh-2">
        Вы уверены, что хотите удалить список
        <mark>{{ list.title }}</mark>
        и всё его содержимое?</span>
    </template>

    <template v-slot:buttons>
      <button @click="deleteList(list)" type="button" class="btn btn-danger"
        data-bs-dismiss="modal">Удалить</button>
    </template>
  </modal>
</template>

<script>
import Modal from '../common/Modal.vue'
import ListService from '../../services/ListService';

export default {
  props: ['list'],

  components: {
    Modal
  },

  methods: {
    deleteList(list) {
      // Hack:
      // It is not known why the interface is not rerender after the removal of the last element of this.$store.lists
      // $nextTick function doesn't work in this case
      setTimeout(() => {
        this.$store.lists = this.$store.lists.filter(item => item !== list);
      }, 0);

      this.$router.push({ name: 'lists' });

      ListService.deleteList(list).then(r => {
        if (r.code === 200) {
          this.$toast.success('Список удалён');
        }
      });
    }
  }
}
</script>
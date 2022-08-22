<template>
  <modal>
    <template v-slot:title>
      List sharing
    </template>

    <template v-slot:content>
      <p>Choose users by email you want to share this list</p>
      <input v-model="user" type="email" placeholder="Enter user's email" class="form-control">
    </template>

    <template v-slot:buttons>
      <button @click="share(list, user)" type="button" class="btn btn-primary">Share</button>
      <button @click="unshare(list, user)" type="button" class="btn btn-primary">Unshare</button>
    </template>
  </modal>
</template>

<script>
import Modal from '../common/Modal.vue'
import ListService from '../../services/ListService';

export default {
  data() {
    return {
      user: '',
    }
  },

  props: ['list'],

  components: {
    Modal
  },

  methods: {
    share(list, user) {
      console.log(list, user)
      ListService.shareList(list, user).then(r => {
        console.log(r)
      })
    },

    unshare(list, user) {
      console.log(list, user)
      ListService.unshareList(list, user).then(r => {
        console.log(r)
      })
    }
  }
}
</script>
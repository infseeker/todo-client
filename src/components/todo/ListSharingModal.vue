<template>
  <modal>
    <template v-slot:title>
      {{ this.$t('list.sharing') }}
    </template>

    <template v-slot:content>
      <p>{{ this.$t('list.sharingWith') }}</p>
      <input v-model.trim="email" @keypress.enter="share(list, email)" :placeholder="this.$t('user.emailPlaceholder')" type="email" class="form-control" />
      <div v-if="this.v$.email.$error" class="invalid-feedback d-block mx-2">{{ this.$t('validations.email') }}
      </div>
    </template>

    <template v-slot:buttons>
      <button @click="share(list, email)" type="button" class="btn btn-primary">Share</button>
    </template>
  </modal>
</template>

<script>
import Modal from '../common/Modal.vue'
import ListService from '../../services/ListService';
import useValidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { email } from '../../helpers/validations'

export default {
  data() {
    return {
      v$: useValidate(),
      email: '',
    }
  },

  props: ['list'],

  components: {
    Modal
  },

  validations() {
    return {
      email: {
        required,
        email,
      },
    }
  },

  methods: {
    share(list, email) {
      console.log(list, email)

      this.v$.$validate();

      if (!this.v$.$error) {
        ListService.shareList(list, email).then(r => {
          if (r.code === 200) {
            list.shared.push(r.data);
            this.$toast.success(this.$t('list.sharedWith', [email]));
          }
          else if(r.code === 404)
            this.$toast.error(this.$t('user.notFoundByEmail'));
          else if(r.code === 409)
            this.$toast.info(this.$t('list.alreadyShared', [email]));
          else if(r.code === 400)
            this.$toast.warning(this.$t('user.dataNotValid'));
        })
      }
    },

    unshare(list, email) {
      console.log(list, email)
      ListService.unshareList(list, email).then(r => {
        console.log(r)
      })
    }
  }
}
</script>
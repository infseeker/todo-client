<template>
  <modal>
    <template v-slot:title>
      {{ this.$t('list.sharing') }}
    </template>

    <template v-slot:content>
      <form>
        <p>{{ this.$t('list.sharingMessage') }}</p>
        <p v-html="this.$t('list.sharingWith', [`<mark>${list.title}</mark>`])"></p>
        <input ref="input" v-model.trim="email" @keypress.enter.prevent="share(list, email)"
          :placeholder="this.$t('user.emailPlaceholder')" type="email" class="form-control" />
        <div v-if="this.v$.email.$error" class="invalid-feedback d-block mx-2">{{ this.$t('validations.email') }}
        </div>
      </form>

      <ul class="email-badges list-group">
        <li v-for="user in list.shared" v-bind:key="user.id" class="email-badge">
          <span class="badge bg-label-dark">{{ user.email }} <span @click="unshare(list, user.email)"
              class="email-badge__delete">✕</span></span>
        </li>
      </ul>
    </template>

    <template v-slot:buttons>
      <button @click="share(list, email)" :disabled="isDisabled" type="button" class="btn btn-primary">{{
          this.$t('list.share')
      }}</button>
    </template>
  </modal>
</template>

<script>
import Modal from '../common/Modal.vue'
import ListService from '../../services/ListService';
import useValidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { email } from '../../helpers/validations'
import { io } from 'socket.io-client'
import { api } from '/public/server-api'

export default {
  data() {
    return {
      v$: useValidate(),
      list: this.$store.lists.find(l => l.id === this.listId),
      email: '',
      isDisabled: false,
      socket: null,
    }
  },

  props: ['listId'],

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
      this.v$.$validate();

      if (!this.v$.$error) {
        this.isDisabled = true;
        this.$loader.show();

        ListService.shareList(list, email).then(r => {
          this.isDisabled = false;
          this.$loader.hide();
          this.v$.$reset();
          this.$refs.input.focus();

          if (r.code === 200) {
            if (r.data.image) r.data.image = api.user.get_image(r.data.image);
            list.shared.push(r.data);
            this.email = '';
            this.$toast.success(this.$t('list.sharedWith', [email]));

            list.owner.online = true;
            this.socket.emit('share_list', { list_id: this.list.id, data: r.data });
          }
          else if (r.code === 404)
            this.$toast.error(this.$t('user.notFoundByEmail'));
          else if (r.code === 409)
            this.$toast.info(this.$t('list.alreadyShared', [email]));
          else if (r.code === 400)
            this.$toast.warning(this.$t('user.dataNotValid'));
        })
      }
    },

    unshare(list, email) {
      ListService.unshareList(list, email).then(r => {
        if (r.code === 200) {
          list.shared = list.shared.filter(u => u.email !== email);
          this.$toast.success(this.$t('list.unshared', [email]));

          this.socket.emit('unshare_list', { list_id: this.list.id, data: r.data });
        }
        else if (r.code === 404)
          this.$toast.error(this.$t('user.notFoundByEmail'));
        else if (r.code === 400)
          this.$toast.warning(this.$t('user.dataNotValid'));
      })
    }
  },

  mounted() {
    this.socket = io({ path: api.lists.shared_list, auth: { list_id: this.list.id } });
  },

  unmounted() {
    this.socket.emit('user_disconnect', {});
  }
}
</script>

<style>
mark {
  padding: 0.1rem 0.4rem;
}

.email-badges {
  flex-flow: row wrap;
  margin-top: 0.5rem;
  list-style: none;
}

.email-badge {
  margin-bottom: 0.2rem;
}

.email-badge .badge {
  margin-right: 0.2rem;
}

.email-badge__delete {
  cursor: pointer;
}
</style>
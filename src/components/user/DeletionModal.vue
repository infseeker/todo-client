<template>
  <modal>
    <template v-slot:title>
      {{ this.$t('user.accountDeleting') }}
    </template>

    <template v-slot:content>
      <div class="form-password-toggle">
        <div class="input-group input-group-merge">
          <input v-if="showPassword" @keypress.enter="deleteUser(password)" v-model.trim="password" type="text"
            :placeholder="this.$t('user.passwordPlaceholder')" class="form-control" />

          <input v-else @keypress.enter="deleteUser(password)" type="password" v-model.trim="password"
            :placeholder="this.$t('user.passwordPlaceholder')" class="form-control" />

          <span @click="showPassword = !showPassword" class="input-group-text cursor-pointer">
            <i v-if="showPassword" class="bx bx-show"></i>
            <i v-else class="bx bx-hide"></i>
          </span>
        </div>
      </div>
    </template>

    <template v-slot:buttons>
      <button :disabled="isDisabled" @click="deleteUser(password)" type="button" class="btn btn-danger">
        {{ this.$t('common.delete') }}
      </button>
    </template>
  </modal>
</template>

<script>
import Modal from '../common/Modal.vue'
import UserService from '../../services/UserService'

export default {
  data() {
    return {
      password: '',
      showPassword: false,
      isDisabled: false,
    }
  },

  components: {
    Modal
  },

  methods: {
    deleteUser(password) {
      if (!password) {
        this.$toast.error(this.$t('user.passwordPlaceholder'));
        return;
      }

      this.$loader.show();
      this.isDisabled = true;

      UserService.delete(password).then((r) => {
        this.$loader.hide();
        this.isDisabled = false;

        if (r.code === 200) {
          UserService.logout().then(() => {
            this.$user.logout();
            this.$router.push('/');

            this.$toast.info(this.$t('user.accountDeleted'));
          });
        } else if (r.code === 400) {
          this.$toast.error(this.$t('user.wrongPassword'));
        }
      });
    }
  }
}
</script>
<template>
  <modal>
    <template v-slot:title>
      {{ this.$t('user.passwordChanging') }}
    </template>

    <template v-slot:content>
      <div @keypress.enter="changePassword(oldPassword, newPassword)">
        <div class="form-password-toggle">
          <div class="input-group input-group-merge">
            <input v-if="showPassword" v-model.trim="oldPassword" type="text"
              :placeholder="this.$t('user.currentPasswordPlaceholder')" class="form-control" />

            <input v-else type="password" v-model.trim="oldPassword"
              :placeholder="this.$t('user.currentPasswordPlaceholder')" class="form-control" />

            <span @click="showPassword = !showPassword" class="input-group-text cursor-pointer">
              <i v-if="showPassword" class="bx bx-show"></i>
              <i v-else class="bx bx-hide"></i>
            </span>
          </div>

          <div v-if="this.v$.oldPassword.$error" class="invalid-feedback d-block mx-2">
            {{ this.$t('validations.required') }}
          </div>
        </div>

        <div class="form-password-toggle mt-3">
          <div class="input-group input-group-merge">
            <input v-if="showPassword" v-model.trim="newPassword" type="text"
              :placeholder="this.$t('user.newPasswordPlaceholder')" class="form-control" />

            <input v-else type="password" v-model.trim="newPassword"
              :placeholder="this.$t('user.newPasswordPlaceholder')" class="form-control" />

            <span @click="showPassword = !showPassword" class="input-group-text cursor-pointer">
              <i v-if="showPassword" class="bx bx-show"></i>
              <i v-else class="bx bx-hide"></i>
            </span>
          </div>

          <div v-if="this.v$.newPassword.$error" class="invalid-feedback d-block mx-2">
            {{ this.$t('validations.password') }}
          </div>
        </div>
      </div>
    </template>

    <template v-slot:buttons>
      <button :disabled="isDisabled" @click="changePassword(oldPassword, newPassword)" type="button"
        class="btn btn-primary">{{ this.$t('common.save') }}</button>
    </template>
  </modal>
</template>

<script>
import Modal from '../common/Modal.vue'
import UserService from '../../services/UserService'

import useValidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { password } from '../../helpers/validations'

export default {
  data() {
    return {
      v$: useValidate(),
      oldPassword: '',
      newPassword: '',
      showPassword: false,
      isDisabled: false,
    }
  },

  validations() {
    return {
      oldPassword: {
        required,
      },

      newPassword: {
        required,
        password,
      },
    }
  },

  components: {
    Modal
  },

  methods: {
    changePassword(oldPassword, newPassword) {
      this.v$.$validate();

      if (!this.v$.$error) {
        this.$loader.show();
        this.isDisabled = true;
        this.wrongOldPassword = false;

        UserService.changePassword(oldPassword, newPassword).then((r) => {
          this.$loader.hide();
          this.isDisabled = false;

          if (r.code === 200) {
            this.$emit('close');
            this.$toast.success(this.$t('user.passwordChanged'));
          } else if(r.code === 400) {
            this.$toast.error(this.$t('user.wrongCurrentPassword'));
          }
        });
      }
    }
  }
}
</script>
<template>
  <user-form>
    <template v-slot:title>
      <span>{{ this.$t('user.restorationEmail') }}</span>
      <i class='bx bx-envelope'></i>
    </template>

    <template v-slot:content>
      <div @keypress.enter="restoreEmail(email)">
        <p>
          {{ this.$t('user.enterRestorationEmail') }}
        </p>
        <p>
          {{ this.$t('user.restorationCodeWillSend') }}
        </p>
        <div class="mb-3">
          <input v-model="email" type="email" :placeholder="this.$t('user.emailPlaceholder')" class="form-control" />
          <div v-if="this.v$.email.$error" class="invalid-feedback d-block mx-2">
            {{ this.$t('validations.email') }}
          </div>
        </div>
      </div>
    </template>

    <template v-slot:button>
      <button @click="restoreEmail(email)" :disabled="isDisabled" type="button" class="btn btn-primary w-100">
      {{ this.$t('user.getRestorationCode') }}
      </button>
    </template>
  </user-form>
</template>


<script>
import UserForm from './UserForm.vue'
import UserService from '../../services/UserService'
import useValidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { email } from '../../helpers/validations'
import { recaptcha } from '../../helpers/recaptcha'

export default {
  data() {
    return {
      v$: useValidate(),
      email: '',
      showPassword: false,
      isDisabled: false,
    };
  },

  validations() {
    return {
      email: {
        required,
        email
      },
    }
  },

  components: {
    UserForm,
  },

  methods: {
    async restoreEmail(email) {
      this.v$.$validate();

      if (!this.v$.$error) {
        this.$loader.show();
        this.isDisabled = true;

        recaptcha().then((token) => {
          UserService.sendRestorationEmail(email, token).then((data) => {
            this.$loader.hide();

            if (data.code === 200) {
              this.$user.email = email;
              this.$router.push({ name: 'restoration' });

            } else if (data.code === 404) {
              this.isDisabled = false;
              this.$toast.error(this.$t('user.notFoundByEmail'));
              
            } else if (data.code === 403) {
              this.isDisabled = false;
              this.$toast.error(this.$t('user.notActivated'));
            }
          });
        })
      }
    },
  }
}
</script>
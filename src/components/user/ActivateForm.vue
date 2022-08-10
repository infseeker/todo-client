<template>
  <user-form>
    <template v-slot:title>
      <span>{{ this.$t('user.activation') }}</span>
      <i class='bx bx-user-check'></i>
    </template>

    <template v-slot:content>
      <div @keypress.enter="activate(email, code)">
        <p v-if="!showEmailField"
          v-html="this.$t('user.activationCodeSent', [`<span class='badge bg-label-primary'>${this.email}</span>`])">
        </p>
        <p>
          {{ this.$t('user.activationCodeValidFor', ['15']) }}
        </p>
        <p>
          {{ this.$t('user.ifNotActivate') }}
        </p>

        <div v-if="showEmailField" class="mb-3">
          <input :placeholder="this.$t('user.emailPlaceholder')" v-model.trim="email" type="email" class="form-control" />

          <div v-if="this.v$.email.$error" class="invalid-feedback d-block mx-2">
            {{ this.$t('validations.email') }}
          </div>
        </div>

        <div class="mb-3">
          <input @paste="checkCodeFormat" @keypress="checkCodeFormat" v-model.trim="code"
            :placeholder="this.$t('user.activationCodePlaceholder')" inputmode="numeric" class="form-control" />

          <div v-if="this.v$.code.$error" class="invalid-feedback d-block mx-2">
            {{ this.$t('validations.accessCode', ['4']) }}
          </div>
        </div>
      </div>
    </template>

    <template v-slot:button>
      <button @click="activate(email, code)" :disabled="isDisabled" type="button" class="btn btn-primary w-100">
        {{ this.$t('user.activate') }}
      </button>
    </template>
  </user-form>
</template>

<script>
import UserForm from './UserForm.vue'
import UserService from '../../services/UserService'
import useValidate from '@vuelidate/core'
import { required, numeric, maxLength, minLength } from '@vuelidate/validators'
import { email } from '../../helpers/validations'
import { recaptcha } from '../../helpers/recaptcha'

export default {
  data() {
    return {
      v$: useValidate(),
      code: '',
      email: this.$user.email || '',
      showEmailField: false,
      showPassword: false,
      submitError: false,
      storage: {},
      isDisabled: false,
    };
  },

  validations() {
    return {
      code: {
        required,
        numeric,
        maxLength: maxLength(4),
        minLength: minLength(4),
      },

      email: {
        required,
        email,
      },
    }
  },

  components: {
    UserForm,
  },

  methods: {
    checkCodeFormat(event) {
      if (event.type === 'paste') {
        if (!/^[0-9]{4}$/.test(event.clipboardData.getData('text'))) return event.preventDefault();
      }

      if (event.type === 'keypress') {
        if (!/^[0-9]$/.test(event.key) || this.code.toString().length > 3) return event.preventDefault();
      }
    },

    async activate(email, code) {
      this.v$.$validate();

      if (!this.v$.$error) {
        this.$loader.show();
        this.isDisabled = true;

        recaptcha().then((token) => {
          UserService.activate(email, code, token).then((data) => {
            this.$loader.hide();
            this.isDisabled = false;

            if (data.code === 200) {
              this.$router.push({ name: 'login' });
              this.$toast.success(this.$t('user.activated'));

            } else if (data.code === 400) {
              this.$toast.error(this.$t('user.wrongActivationCode'));

            } else if (data.code === 404) {
              this.$toast.error(this.$t('user.notFoundByEmail'));

            } else if (data.code === 409) {
              this.$toast.warning(this.$t('user.alreadyActivated'));
            }
          });
        })
      }
    },
  },

  mounted() {
    if (!this.$user.email) {
      this.showEmailField = true;
    }
  }
}
</script>

<style>
</style>
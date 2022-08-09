<template>
  <div class="login-form authentication-wrapper authentication-basic container-p-y">
    <div class="authentication-inner">
      <div class="card">
        <div class="card-body" v-on:keyup.enter="activate(email, code)">

          <h5 class="mb-4 d-flex justify-content-between">
            <span>{{ this.$t('user.activation') }}</span>
            <i class='bx bx-user-check'></i>
          </h5>

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
            <input :placeholder="this.$t('user.emailPlaceholder')" v-model="email" class="form-control" />
            <div v-if="this.v$.email.$error" class="invalid-feedback d-block mx-2">{{ this.$t('validations.email') }}
            </div>
          </div>

          <div class="mb-3">
            <input @paste="checkCodeFormat" @keypress="checkCodeFormat" v-model="code"
              :placeholder="this.$t('user.activationCodePlaceholder')" class="form-control" />
            <div v-if="this.v$.code.$error" class="invalid-feedback d-block mx-2">{{ this.$t('validations.accessCode',
                ['4'])
            }}
            </div>
          </div>

          <div class="mb-3">
            <button @click="activate(email, code)" :disabled="isDisabled" type="button" class="btn btn-primary w-100">{{
                this.$t('user.activate')
            }}</button>
          </div>

          <recaptcha></recaptcha>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserService from '../../services/UserService'
import useValidate from '@vuelidate/core'
import { required, numeric, maxLength, minLength } from '@vuelidate/validators'
import { email } from '../../helpers/validations'
import { recaptcha } from '../../helpers/recaptcha'
import Recaptcha from './Recaptcha.vue'



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
    Recaptcha,
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

    const input = document.querySelector('input') || document.querySelector('textarea') || null;
    input.focus();
  }
}
</script>

<style>
</style>
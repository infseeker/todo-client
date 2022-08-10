<template>
  <user-form>
    <template v-slot:title>
      <span>{{ this.$t('user.restoration') }}</span>
      <i class='bx bx-key'></i>
    </template>

    <template v-slot:content>
      <div @keypress.enter="restore(email, password, code)">
        <p v-if="!showEmailField"
          v-html="this.$t('user.restorationCodeSent', [`<span class='badge bg-label-primary'>${this.email}</span>`])">
        </p>
        <p>
          {{ this.$t('user.restorationCodeValidFor', ['15']) }}
        </p>
        <div v-if="showEmailField" class="mb-3">
          <input :placeholder="this.$t('user.emailPlaceholder')" v-model.trim="email" type="email"
            class="form-control" />
          <div v-if="this.v$.email.$error" class="invalid-feedback d-block mx-2">
            {{ this.$t('validations.email') }}
          </div>
        </div>

        <div class="mb-3 form-password-toggle">
          <div class="input-group input-group-merge">
            <input v-if="showPassword" :placeholder="this.$t('user.newPasswordPlaceholder')" v-model.trim="password"
              class="form-control" />
            <input v-else type="password" :placeholder="this.$t('user.newPasswordPlaceholder')" v-model.trim="password"
              class="form-control" />
            <span @click="showPassword = !showPassword" class="input-group-text cursor-pointer">
              <i v-if="showPassword" class="bx bx-show"></i>
              <i v-else class="bx bx-hide"></i>
            </span>
          </div>
          <div v-if="this.v$.password.$error" class="invalid-feedback d-block mx-2">
            {{ this.$t('validations.password') }}
          </div>
        </div>

        <div class="mb-3">
          <input @paste="checkCodeFormat" @keypress="checkCodeFormat" v-model.trim="code"
            :placeholder="this.$t('user.restorationCodePlaceholder')" inputmode="numeric" class="form-control" />
          <div v-if="this.v$.code.$error" class="invalid-feedback d-block mx-2">
            {{ this.$t('validations.accessCode', ['4']) }}
          </div>
        </div>
      </div>
    </template>

    <template v-slot:button>
      <button @click="restore(email, password, code)" :disabled="isDisabled" type="button"
        class="btn btn-primary w-100">
        {{ this.$t('user.restore') }}
      </button>
    </template>
  </user-form>
</template>


<script>
import UserForm from './UserForm.vue'
import UserService from '../../services/UserService'
import useValidate from '@vuelidate/core'
import { required, numeric, maxLength, minLength } from '@vuelidate/validators'
import { email, password } from '../../helpers/validations'
import { recaptcha } from '../../helpers/recaptcha'

export default {
  data() {
    return {
      v$: useValidate(),
      code: '',
      email: this.$user.email || '',
      showEmailField: false,
      password: '',
      showPassword: false,
      isDisabled: false,
    };
  },

  validations() {
    return {
      email: {
        required,
        email,
      },

      password: {
        required,
        password
      },

      code: {
        required,
        numeric,
        maxLength: maxLength(4),
        minLength: minLength(4),
      },
    }
  },

  components: {
    UserForm
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

    async restore(email, password, code) {
      this.v$.$validate();

      if (!this.v$.$error) {
        this.$loader.show();
        this.isDisabled = true;

        recaptcha().then((token) => {
          UserService.restore(email, password, code, token).then((data) => {
            this.$loader.hide();

            if (data.code === 200) {
              this.$user.isDeleted = false;
              this.$router.push({ name: 'login' });

              this.$toast.success(this.$t('user.restored'));
            } else if (data.code === 400) {
              this.isDisabled = false;
              this.$toast.error(this.$t('user.wrongRestorationCode'));

            } else if (data.code === 403) {
              this.isDisabled = false;
              this.$toast.error(this.$t('user.notActivated'));
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
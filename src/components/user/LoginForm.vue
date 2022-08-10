<template>
  <user-form>
    <template v-slot:title>
      <span>{{ this.$t('user.auth') }}</span>
      <i class="bx bx-log-in"></i>
    </template>

    <template v-slot:content>
      <div @keypress.enter="login(username, password)">
        <div class="mb-3">
          <input :placeholder="this.$t('user.usernameEmailPlaceholder')" type="email" v-model.trim="username" class="form-control" />
          <div v-if="this.v$.username.$error" class="invalid-feedback d-block mx-2">
            {{ this.$t('validations.required') }}
          </div>
        </div>

        <div class="mb-3 form-password-toggle">
          <div class="input-group input-group-merge">
            <input v-if="showPassword" :placeholder="this.$t('user.passwordPlaceholder')" v-model.trim="password" class="form-control" />
            <input v-else type="password" :placeholder="this.$t('user.passwordPlaceholder')" v-model.trim="password" class="form-control" />
            <span @click="showPassword = !showPassword" class="input-group-text cursor-pointer">
              <i v-if="showPassword" class="bx bx-show"></i>
              <i v-else class="bx bx-hide"></i>
            </span>
          </div>
          <div v-if="this.v$.password.$error" class="invalid-feedback d-block mx-2">
            {{ this.$t('validations.required') }}
          </div>
        </div>

        <div class="mb-4">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="remember-me" checked>
            <div class="d-flex justify-content-between">
              <label class="form-check-label" for="remember-me">
                {{ this.$t('user.remember') }}
              </label>
              <router-link :to="{ name: 'restoration-email' }">
                <small>{{ this.$t('user.forgot?') }}</small>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:button>
      <button @click="login(username, password)" :disabled="isDisabled" type="button"
        class="btn btn-primary w-100">{{ this.$t('user.login') }}</button>
    </template>

    <template v-slot:footer>
      <p class="text-center">
        {{ this.$t('user.noAccount?') }}
        <router-link :to="{ name: 'registration' }">{{ this.$t('user.register') }}</router-link>
      </p>
    </template>
  </user-form>
</template>

<script>
import UserForm from './UserForm.vue'
import UserService from '../../services/UserService'
import { i18nUtils } from '../../helpers/i18n';
import useValidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { recaptcha } from '../../helpers/recaptcha'


export default {
  data() {
    return {
      v$: useValidate(),
      username: '',
      password: '',
      showPassword: false,
      isDisabled: false
    };
  },

  validations() {
    return {
      username: {
        required,

      },
      password: {
        required,
      },
    }
  },

  components: {
    UserForm,
  },

  methods: {
    login(username, password) {
      this.v$.$validate();

      if (!this.v$.$error) {
        this.$loader.show();
        this.isDisabled = true;

        recaptcha().then((token) => {
          UserService.login(username, password, token).then(r => {
            this.$loader.hide();

            if (r.code === 200) {
              this.$user.login(r);
              i18nUtils.setLocale(this.$user.locale);

              if (this.$user.isAuth) {
                if (this.$user.isAdmin) {
                  this.$router.push({ name: 'admin-users' });
                } else {
                  this.$router.push({ name: 'lists' });
                }
              }
            } else {
              if (r.deleted) {
                this.$user.isDeleted = true;
                this.$router.push({ name: 'deleted-user' })
                
              } else if (r.inactive) {
                this.$user.isNotActivated = true;
                this.$user.email = r.email;
                this.$router.push({ name: 'activation' })

                this.$toast.warning(this.$t('user.notActivated'));
                
              } else if (r.code === 400) {
                this.isDisabled = false;
                this.$toast.error(this.$t('user.wrongCredentials'));
              }
            }
          });
        })
      }
    },
  },
}
</script>
<template>
  <user-form>
    <template v-slot:title>
      <span>{{ this.$t('user.registration')}}</span>
      <i class="bx bx-user-plus"></i>
    </template>

    <template v-slot:content>
      <div @keypress.enter="register(username, email, password)">
        <div class="mb-3">
          <input :placeholder="this.$t('user.usernamePlaceholder')" v-model="username" class="form-control" />
          <div v-if="this.v$.username.$error" class="invalid-feedback d-block mx-2">{{ this.$t('validations.username') }}
          </div>
        </div>

        <div class="mb-3">
          <input :placeholder="this.$t('user.emailPlaceholder')" v-model="email" type="email" class="form-control" />
          <div v-if="this.v$.email.$error" class="invalid-feedback d-block mx-2">{{ this.$t('validations.email') }}
          </div>
        </div>

        <div class="mb-3 form-password-toggle">
          <div class="input-group input-group-merge">
            <input v-if="showPassword" :placeholder="this.$t('user.passwordPlaceholder')" v-model="password" class="form-control" />
            <input v-else type="password" :placeholder="this.$t('user.passwordPlaceholder')" v-model="password" class="form-control" />
            <span @click="showPassword = !showPassword" class="input-group-text cursor-pointer">
              <i v-if="showPassword" class="bx bx-show"></i>
              <i v-else class="bx bx-hide"></i>
            </span>
          </div>
          <div v-if="this.v$.password.$error" class="invalid-feedback d-block mx-2">{{ this.$t('validations.password') }}</div>
        </div>
      </div>
    </template>

    <template v-slot:button>
      <button @click="register(username, email, password)" :disabled="isDisabled" type="button"
        class="btn btn-primary w-100">{{ this.$t('user.register') }}</button>
    </template>

    <template v-slot:footer>
      <p class="text-center">
        <span>{{ this.$t('user.haveAccount?') }} </span>
        <router-link :to="{ name: 'login' }">
          <span>{{ this.$t('user.login') }}</span>
        </router-link>
      </p>
    </template>
  </user-form>
</template>

<script>
import UserForm from './UserForm.vue'
import UserService from '../../services/UserService'
import useValidate from '@vuelidate/core'
import { required, minLength, maxLength, alpha } from '@vuelidate/validators'
import { email, password } from '../../helpers/validations'
import { recaptcha } from '../../helpers/recaptcha'

export default {
  data() {
    return {
      v$: useValidate(),
      username: '',
      email: '',
      password: '',
      showPassword: false,
      isDisabled: false
    };
  },

  validations() {
    return {
      username: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(15),
        alpha
      },

      email: {
        required,
        email,
      },

      password: {
        required,
        password
      },
    }
  },

  components: {
    UserForm,
  },

  methods: {
    async register(username, email, password) {
      this.usernameExists = false;
      this.emailExists = false;

      this.v$.$validate();

      if (!this.v$.$error) {
        this.$loader.show();
        this.isDisabled = true;

        recaptcha().then((token) => {
          UserService.checkUsername(username).then((data) => {
            if (data.code === 200) {

              UserService.checkEmail(email).then((data) => {
                if (data.code === 200) {

                  UserService.register(username, email, password, token).then((data) => {
                    if (data.code === 200) {
                      this.$loader.hide();
                      this.$user.email = email;
                      this.$router.push({ name: 'activation' });
                    } else {
                      this.$loader.hide();
                      this.isDisabled = false;
                      this.$toast.error(this.$t('user.dataNotValid'));
                    }
                  })
                } else if (data.code === 409) {
                  this.$loader.hide();
                  this.isDisabled = false;
                  this.$toast.error(this.$t('user.alreadyExistsByEmail'));
                }
              })
            } else if (data.code === 409) {
              this.$loader.hide();
              this.isDisabled = false;
              this.$toast.error(this.$t('user.alreadyExistsByName'));
            }
          })
        })
      }
    },
  },
}
</script>

<style>
</style>
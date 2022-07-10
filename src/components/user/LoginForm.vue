<template>
  <div class="login-form authentication-wrapper authentication-basic container-p-y">
    <div class="authentication-inner">
      <div class="card">
        <div class="card-body" v-on:keyup.enter="login(username, password)">
          <h4 class="mb-4">ToDo by
            <a href="https://github.com/infseeker">@infseeker</a> 👋
          </h4>
          <div v-if="submitError" class="mb-3">
            <div class="alert alert-danger" role="alert">
              Неправильное имя пользователя или пароль.
            </div>
          </div>
          <div v-if="activated" class="mb-3">
            <div class="alert alert-success" role="alert">
              Ваша учётная запись была активирована. Теперь вы можете войти.
            </div>
          </div>
          <div v-if="restored" class="mb-3">
            <div class="alert alert-success" role="alert">
              Ваша учётная запись была восстановлена. Теперь вы можете войти.
            </div>
          </div>
          <div class="mb-3">
            <input placeholder="Введите имя / email" v-model="username" class="form-control" />
            <div v-if="this.v$.username.$error" class="invalid-feedback d-block mx-2">Введите имя пользователя / email
            </div>
          </div>
          <div class="mb-3 form-password-toggle">
            <div class="input-group input-group-merge">
              <input v-if="showPassword" placeholder="Введите пароль" v-model="password" class="form-control" />
              <input v-else type="password" placeholder="Введите пароль" v-model="password" class="form-control" />
              <span @click="showPassword = !showPassword" class="input-group-text cursor-pointer">
                <i v-if="showPassword" class="bx bx-show"></i>
                <i v-else class="bx bx-hide"></i>
              </span>
            </div>
            <div v-if="this.v$.password.$error" class="invalid-feedback d-block mx-2">Введите пароль</div>
          </div>
          <div class="mb-4">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="remember-me" checked>
              <div class="d-flex justify-content-between">
                <label class="form-check-label" for="remember-me">
                  Запомнить меня
                </label>
                <router-link :to="{ name: 'restoration-email' }">
                  <small>Забыли пароль?</small>
                </router-link>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <button @click="login(username, password)" :disabled="isDisabled" type="button"
              class="btn btn-primary w-100">Войти</button>
          </div>

          <p class="text-center">
            <span>Ещё нет аккаунта? </span>
            <router-link :to="{ name: 'registration' }">
              <span>Зарегистрироваться</span>
            </router-link>
          </p>

          <small style="opacity: 0.5">This site is protected by reCAPTCHA and the Google
            <a href="https://policies.google.com/privacy">Privacy Policy</a> and
            <a href="https://policies.google.com/terms">Terms of Service</a> apply.</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserService from '../../services/UserService'
import useValidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useReCaptcha } from "vue-recaptcha-v3";


export default {
  setup() {
    const { executeRecaptcha, recaptchaLoaded } = useReCaptcha()

    const recaptcha = async () => {
      await recaptchaLoaded();

      const token = await executeRecaptcha('login')

      return token;
    }

    return {
      recaptcha
    }
  },

  data() {
    return {
      v$: useValidate(),
      username: '',
      password: '',
      showPassword: false,
      submitError: false,
      restored: false,
      activated: false,
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

  methods: {
    async login(username, password) {
      console.log(username, password);

      this.submitError = false;
      this.v$.$validate();

      if (!this.v$.$error) {
        this.isDisabled = true;

        this.recaptcha().then((token) => {
          UserService.login(username, password, token).then((data) => {
            if (data.code === 200) {
              data.login = true;
              this.$user.login(data);

              if (this.$user.isAuth) {
                if (this.$user.isAdmin) {
                  this.$router.push({ name: 'admin-users' });
                } else {
                  this.$router.push({ name: 'lists' });
                }
              }
            } else {
              if (data.deleted) {
                this.$user.isDeleted = true;
                this.$router.push({ name: 'deleted-user' })
              } else if (data.inactive) {
                this.$user.isNotActivated = true;
                this.$user.email = data.email;
                this.$router.push({ name: 'activation' })
              } else {
                this.submitError = true;
                this.isDisabled = false;
              }
            }
          });
        })
      }
    },
  },

  mounted() {
    this.restored = this.$user.isRestored;
    this.activated = this.$user.isActivated;
  }
}
</script>

<style>
</style>
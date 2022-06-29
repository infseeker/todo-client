<template>
  <div class="login-form authentication-wrapper authentication-basic container-p-y">
    <div class="authentication-inner">
      <div class="card">
        <div class="card-body" v-on:keyup.enter="restoreEmail(email)">
          <h4 class="mb-4">ToDo by
            <a href="https://github.com/infseeker">@infseeker</a> 👋
          </h4>
          <div v-if="submitError" class="mb-3">
            <div class="alert alert-danger" role="alert">
              Пользователя с таким email не существует
            </div>
          </div>
          <p>
            Для восстановления доступа введите email, который был указан при регистрации.
          </p>
          <p>
            На email будет выслано письмо с кодом восстановления доступа.
          </p>

          <div class="mb-3">
            <input v-model="email" placeholder="Введите email" class="form-control" />
            <div v-if="this.v$.email.$error" class="invalid-feedback d-block mx-2">Email: некорректный формат
            </div>
          </div>

          <div class="mb-3">
            <button @click="restoreEmail(email)" :disabled="isDisabled" type="button"
              class="btn btn-primary w-100">Получить код восстаноления</button>
          </div>

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
import { helpers, required, minLength } from '@vuelidate/validators'
import { useReCaptcha } from "vue-recaptcha-v3";

const emailFormat = helpers.regex(/(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)/);

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
      email: '',
      showPassword: false,
      submitError: false,
      isDisabled: false,
    };
  },

  validations() {
    return {
      email: {
        required,
        minLength: minLength(5),
        emailFormat
      },
    }
  },

  methods: {
    async restoreEmail(email) {
      console.log(email);

      this.v$.$validate();

      if (!this.v$.$error) {
        this.isDisabled = true;
        
        this.recaptcha().then((token) => {
          UserService.sendRestorationEmail(email, token).then((data) => {
            if (data.success) {
              this.$user.email = email;
              localStorage.email = email;
              this.$router.push({ name: 'restoration' });
            } else {
              this.submitError = true;
              this.isDisabled = false;
            }
          });
        })
      }
    },
  },
}
</script>

<style>
</style>
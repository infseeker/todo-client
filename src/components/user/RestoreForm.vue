<template>
  <div class="login-form authentication-wrapper authentication-basic container-p-y">
    <div class="authentication-inner">
      <div class="card">
        <div class="card-body" v-on:keyup.enter="restore(email, password, code)">
          <h4 class="mb-4">ToDo by
            <a href="https://github.com/infseeker">@infseeker</a> 👋
          </h4>
          <div v-if="submitError" class="mb-3">
            <div class="alert alert-danger" role="alert">
              Неверный код восстановления
            </div>
          </div>
          <p>
            На электронный адрес {{ this.email }} было отправлено письмо с кодом
            восстановления.
          </p>
          <p>
            Код восстановления действителен в течение 15 минут.
          </p>

          <div class="mb-3 form-password-toggle">
            <div class="input-group input-group-merge">
              <input v-if="showPassword" placeholder="Введите новый пароль" v-model="password" class="form-control" />
              <input v-else type="password" placeholder="Введите новый пароль" v-model="password"
                class="form-control" />
              <span @click="showPassword = !showPassword" class="input-group-text cursor-pointer">
                <i v-if="showPassword" class="bx bx-show"></i>
                <i v-else class="bx bx-hide"></i>
              </span>
            </div>
            <div v-if="this.v$.password.$error" class="invalid-feedback d-block mx-2">Пароль (длина: 8-15
              символов, латинские буквы, мин. 1 цифра)</div>
          </div>

          <div class="mb-3 form-password-toggle">
            <div class="input-group input-group-merge">
              <input v-if="showPassword" placeholder="Повторите новый пароль" v-model="passwordRepeat" class="form-control" />
              <input v-else type="password" placeholder="Повторите новый пароль" v-model="passwordRepeat"
                class="form-control" />
              <span @click="showPassword = !showPassword" class="input-group-text cursor-pointer">
                <i v-if="showPassword" class="bx bx-show"></i>
                <i v-else class="bx bx-hide"></i>
              </span>
            </div>
            <div v-if="this.v$.passwordRepeat.$error" class="invalid-feedback d-block mx-2">Повторите пароль</div>
          </div>

          <div class="mb-3">
            <input @paste="checkCodeFormat" @keypress="checkCodeFormat" v-model="code"
              placeholder="Введите код восстановления" class="form-control" />
            <div v-if="this.v$.code.$error" class="invalid-feedback d-block mx-2">Код восстановления (4 цифры)
            </div>
          </div>


          <div class="mb-3">
            <button @click="restore(email, password, code)" :disabled="isDisabled" type="button"
              class="btn btn-primary w-100">Восстановить доступ</button>
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
import { helpers, required, numeric, maxLength, minLength, sameAs } from '@vuelidate/validators'
import { useReCaptcha } from "vue-recaptcha-v3";

const passwordFormat = helpers.regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@\-$!%*#?&]{8,15}$/);

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
      code: '',
      email: this.$user.email || this.getUserEmailFromLocalStorage(),
      password: '',
      passwordRepeat: '',
      showPassword: false,
      submitError: false,
      storage: {},
      isDisabled: false,
    };
  },

  validations() {
    return {
      password: {
        required,
        passwordFormat
      },

      passwordRepeat: {
        required,
        sameAs: sameAs(this.password)
      },

      code: {
        required,
        numeric,
        maxLength: maxLength(4),
        minLength: minLength(4),
      },
    }
  },

  methods: {
    getUserEmailFromLocalStorage() {
      return localStorage.getItem('email');
    },

    checkCodeFormat(event) {
      if (event.type === 'paste') {
        if (!/^[0-9]{4}$/.test(event.clipboardData.getData('text'))) return event.preventDefault();
      }

      if (event.type === 'keypress') {
        if (!/^[0-9]$/.test(event.key) || this.code.toString().length > 3) return event.preventDefault();
      }
    },

    async restore(email, password, code) {
      console.log(email, password, code);

      this.v$.$validate();

      if (!this.v$.$error) {
        this.isDisabled = true;

        this.recaptcha().then((token) => {
          UserService.restore(email, password, code, token).then((data) => {
            if (data.success) {
              localStorage.removeItem('email');
              localStorage.restored = true;

              this.$user.isDeleted = false;
              this.$router.push({ name: 'login' });
            } else {
              this.submitError = true;
              this.isDisabled = false;
            }
          });
        })
      }
    },
  },

  mounted() {
    if (!this.email) {
      this.$router.push({ name: 'restoration-email' })
    }
  }
}
</script>

<style>
</style>
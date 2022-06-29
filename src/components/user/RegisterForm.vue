<template>
  <div class="login-form authentication-wrapper authentication-basic container-p-y">
    <div class="authentication-inner">
      <div class="card">
        <div class="card-body" v-on:keyup.enter="register(username, email, password)">
          <h4 class="mb-4">ToDo by
            <a href="https://github.com/infseeker">@infseeker</a> 👋
          </h4>
          <div v-if="submitError" class="mb-3">
            <div class="alert alert-danger" role="alert">
              Проверьте корректность данных
            </div>
          </div>
          <div class="mb-3">
            <input placeholder="Введите имя пользователя" v-model="username" class="form-control" />
            <div v-if="this.v$.username.$error" class="invalid-feedback d-block mx-2">Имя (длина: от 3 до 15 символов,
              только латинские буквы)
            </div>
            <div v-if="usernameExists" class="invalid-feedback d-block mx-2">Пользователь с таким именем уже существует
            </div>
          </div>
          <div class="mb-3">
            <input placeholder="Введите email" v-model="email" class="form-control" />
            <div v-if="this.v$.email.$error" class="invalid-feedback d-block mx-2">Email (длина: от 5 символов,
              корректный формат email)
            </div>
            <div v-if="emailExists" class="invalid-feedback d-block mx-2">Пользователь с таким email уже существует
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
            <div v-if="this.v$.password.$error" class="invalid-feedback d-block mx-2">Формат пароля (длина: 8-15
              символов, латинские буквы, мин. 1 цифра)</div>
          </div>
          <div class="mb-3 form-password-toggle">
            <div class="input-group input-group-merge">
              <input v-if="showPassword" placeholder="Повторите пароль" v-model="passwordRepeat" class="form-control" />
              <input v-else type="password" placeholder="Повторите пароль" v-model="passwordRepeat"
                class="form-control" />
              <span @click="showPassword = !showPassword" class="input-group-text cursor-pointer">
                <i v-if="showPassword" class="bx bx-show"></i>
                <i v-else class="bx bx-hide"></i>
              </span>
            </div>
            <div v-if="this.v$.passwordRepeat.$error" class="invalid-feedback d-block mx-2">Повторите пароль</div>
          </div>
          <div class="mb-4 input-group custom-file-button">
            <label class="input-group-text" for="inputGroupFile">Выберите аватар</label>
            <input type="file" class="form-control" id="inputGroupFile">
          </div>
          <div class="mb-3">
            <button @click="register(username, email, password)" :disabled="isDisabled" type="button"
              class="btn btn-primary w-100">Зарегистрироваться</button>
          </div>
          <p class="text-center">
            <span>Уже есть аккаунт? </span>
            <router-link :to="{ name: 'login' }">
              <span>Войти</span>
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
import { helpers, required, minLength, maxLength, alpha, sameAs } from '@vuelidate/validators'
import { useReCaptcha } from "vue-recaptcha-v3";

// Backend formats
const passwordFormat = helpers.regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@\-$!%*#?&]{8,15}$/)
const emailFormat = helpers.regex(/(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)/)

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
      email: '',
      password: '',
      passwordRepeat: '',
      showPassword: false,
      submitError: false,
      usernameExists: false,
      emailExists: false,
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
        emailFormat,
      },

      password: {
        required,
        passwordFormat
      },

      passwordRepeat: {
        required,
        sameAs: sameAs(this.password)
      }
    }
  },

  methods: {
    async register(username, email, password) {
      console.log(username, email, password);

      this.submitError = false;
      this.usernameExists = false;
      this.emailExists = false;

      this.v$.$validate();

      if (!this.v$.$error) {
        this.isDisabled = true;
        
        this.recaptcha().then((token) => {
          UserService.checkUsername(username).then((data) => {
            console.log(data);
            if (data.success) {
              UserService.checkEmail(email).then((data) => {
                if (data.success) {
                  UserService.register(username, email, password, token).then((data) => {
                    console.log(data);
                    if (data.success) {
                      this.$user.email = email;
                      localStorage.email = email;
                      this.$router.push({ name: 'activation' });
                    } else {
                      this.submitError = true;
                      this.isDisabled = false;
                    }
                  })
                } else {
                  this.emailExists = true;
                  this.submitError = true;
                  this.isDisabled = false;
                }
              })
            } else {
              this.usernameExists = true;
              this.submitError = true;
              this.isDisabled = false;
            }
          })
        })
      }
    },
  }
}
</script>

<style>
.custom-file-button input[type=file] {
  margin-left: -2px !important;
}

.custom-file-button input[type=file]::-webkit-file-upload-button {
  display: none;
}

.custom-file-button input[type=file]::file-selector-button {
  display: none;
}

.custom-file-button:hover label {
  /* background-color: #dde0e3; */
  cursor: pointer;
}
</style>
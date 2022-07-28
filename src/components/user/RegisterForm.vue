<template>
  <div class="login-form authentication-wrapper authentication-basic container-p-y">
    <div class="authentication-inner">
      <div class="card">
        <div class="card-body" v-on:keyup.enter="register(username, email, password)">
          <h5 class="mb-4 d-flex justify-content-between">
            <span>Регистрация</span>
            <i class="bx bx-user-plus"></i>
          </h5>
          <div v-if="submitError" class="mb-3">
            <div class="alert alert-danger" role="alert">
              Проверьте корректность данных.
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
            <input placeholder="Введите email" v-model="email" type="email" class="form-control" />
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
import { required, minLength, maxLength, alpha } from '@vuelidate/validators'
import { email, password } from '../../helpers/validations'
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
      email: '',
      password: '',
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
        email,
      },

      password: {
        required,
        password
      },
    }
  },

  methods: {
    async register(username, email, password) {
      this.submitError = false;
      this.usernameExists = false;
      this.emailExists = false;

      this.v$.$validate();

      if (!this.v$.$error) {
        this.$isLoading.value = true;
        this.isDisabled = true;

        this.recaptcha().then((token) => {
          UserService.checkUsername(username).then((data) => {
            if (data.code === 200) {

              UserService.checkEmail(email).then((data) => {
                if (data.code === 200) {
                  
                  UserService.register(username, email, password, token).then((data) => {
                    if (data.code === 200) {
                      this.$isLoading.value = false;

                      this.$user.email = email;
                      this.$router.push({ name: 'activation' });
                    } else {
                      this.$isLoading.value = false;

                      this.submitError = true;
                      this.isDisabled = false;
                    }
                  })
                } else {
                  this.$isLoading.value = false;

                  this.emailExists = true;
                  this.submitError = true;
                  this.isDisabled = false;
                }
              })
            } else {
              this.$isLoading.value = false;

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
</style>
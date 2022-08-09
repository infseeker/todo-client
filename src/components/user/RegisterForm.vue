<template>
  <user-form>
    <template v-slot:title>
      <span>Регистрация</span>
      <i class="bx bx-user-plus"></i>
    </template>

    <template v-slot:content>
      <div @keypress.enter="register(username, email, password)">
        <div class="mb-3">
          <input placeholder="Введите имя пользователя" v-model="username" class="form-control" />
          <div v-if="this.v$.username.$error" class="invalid-feedback d-block mx-2">Имя (длина: от 3 до 15 символов,
            только латинские буквы)
          </div>
        </div>

        <div class="mb-3">
          <input placeholder="Введите email" v-model="email" type="email" class="form-control" />
          <div v-if="this.v$.email.$error" class="invalid-feedback d-block mx-2">Email (длина: от 5 символов,
            корректный формат email)
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
      </div>
    </template>

    <template v-slot:button>
      <button @click="register(username, email, password)" :disabled="isDisabled" type="button"
        class="btn btn-primary w-100">Зарегистрироваться</button>
    </template>

    <template v-slot:footer>
      <p class="text-center">
        <span>Уже есть аккаунт? </span>
        <router-link :to="{ name: 'login' }">
          <span>Войти</span>
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
                      this.$toast.error('Проверьте корректность данных');
                    }
                  })
                } else if (data.code === 409) {
                  this.$loader.hide();

                  this.isDisabled = false;
                  this.$toast.error('Пользователь с таким Email уже существует');
                }
              })
            } else {
              this.$loader.hide();

              this.isDisabled = false;
              this.$toast.error('Пользователь с таким именем уже существует');
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
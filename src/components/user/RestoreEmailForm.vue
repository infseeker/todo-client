<template>
  <user-form>
    <template v-slot:title>
      <span>Почта восстановления</span>
      <i class='bx bx-envelope'></i>
    </template>

    <template v-slot:content>
      <div @keypress.enter="restoreEmail(email)">
        <p>
          Для восстановления доступа введите email, который был указан при регистрации.
        </p>
        <p>
          На email будет выслано письмо с кодом восстановления доступа.
        </p>

        <div class="mb-3">
          <input v-model="email" type="email" placeholder="Введите email" class="form-control" />
          <div v-if="this.v$.email.$error" class="invalid-feedback d-block mx-2">Email: некорректный формат
          </div>
        </div>
      </div>
    </template>

    <template v-slot:button>
      <button @click="restoreEmail(email)" :disabled="isDisabled" type="button" class="btn btn-primary w-100">Получить
        код восстаноления</button>
    </template>
  </user-form>
</template>


<script>
import UserForm from './UserForm.vue'
import UserService from '../../services/UserService'
import useValidate from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import { email } from '../../helpers/validations'
import { recaptcha } from '../../helpers/recaptcha'

export default {
  data() {
    return {
      v$: useValidate(),
      email: '',
      showPassword: false,
      isDisabled: false,
    };
  },

  validations() {
    return {
      email: {
        required,
        minLength: minLength(5),
        email
      },
    }
  },

  components: {
    UserForm,
  },

  methods: {
    async restoreEmail(email) {
      this.v$.$validate();

      if (!this.v$.$error) {
        this.$loader.show();
        this.isDisabled = true;

        recaptcha().then((token) => {
          UserService.sendRestorationEmail(email, token).then((data) => {
            this.$loader.hide();

            if (data.code === 200) {
              this.$user.email = email;
              this.$router.push({ name: 'restoration' });
            } else if (data.code === 404) {
              this.isDisabled = false;
              this.$toast.error('Пользователя с таким email не существует');
            } else if (data.code === 403) {
              this.isDisabled = false;
              this.$toast.error('Пользователь с таким email ещё не активирован');
            }
          });
        })
      }
    },
  }
}
</script>
<template>
  <user-form>
    <template v-slot:title>
      <span>Восстановление доступа</span>
      <i class='bx bx-key'></i>
    </template>

    <template v-slot:content>
      <div @keypress.enter="restore(email, password, code)">
        <p v-if="!showEmailField">
          На электронный адрес
          <span class="badge bg-label-primary">{{ this.email }}</span>
          было отправлено письмо с кодом восстановления.
        </p>
        <p>
          Код восстановления действителен в течение 15 минут.
        </p>

        <div v-if="showEmailField" class="mb-3">
          <input placeholder="Введите email" v-model="email" type="email" class="form-control" />
          <div v-if="this.v$.email.$error" class="invalid-feedback d-block mx-2">Email (длина: от 5 символов,
            корректный формат email)
          </div>
        </div>

        <div class="mb-3 form-password-toggle">
          <div class="input-group input-group-merge">
            <input v-if="showPassword" placeholder="Введите новый пароль" v-model="password" class="form-control" />
            <input v-else type="password" placeholder="Введите новый пароль" v-model="password" class="form-control" />
            <span @click="showPassword = !showPassword" class="input-group-text cursor-pointer">
              <i v-if="showPassword" class="bx bx-show"></i>
              <i v-else class="bx bx-hide"></i>
            </span>
          </div>
          <div v-if="this.v$.password.$error" class="invalid-feedback d-block mx-2">Пароль (длина: 8-15
            символов, латинские буквы, мин. 1 цифра)</div>
        </div>

        <div class="mb-3">
          <input @paste="checkCodeFormat" @keypress="checkCodeFormat" v-model="code"
            placeholder="Введите код восстановления" class="form-control" />
          <div v-if="this.v$.code.$error" class="invalid-feedback d-block mx-2">Код восстановления (4 цифры)
          </div>
        </div>
      </div>
    </template>

    <template v-slot:button>
      <button @click="restore(email, password, code)" :disabled="isDisabled" type="button"
        class="btn btn-primary w-100">Восстановить доступ</button>
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

              this.$toast.success('Ваша учётная запись восстановлена');
            } else {
              this.isDisabled = false;

              this.$toast.error('Код восстановления неверен, либо уже истёк');
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

    const input = document.querySelector('input') || document.querySelector('textarea') || null;
    input.focus();
  }
}
</script>

<style>
</style>
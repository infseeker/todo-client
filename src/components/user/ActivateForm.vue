<template>
  <div class="login-form authentication-wrapper authentication-basic container-p-y">
    <div class="authentication-inner">
      <div class="card">
        <div class="card-body" v-on:keyup.enter="activate(email, code)">

          <h5 class="mb-4 d-flex justify-content-between">
            <span>Активация</span>
            <i class='bx bx-user-check'></i>
          </h5>

          <p v-if="!showEmailField">
            На электронный адрес <span class="badge bg-label-primary">{{ this.email }}</span> было отправлено письмо с
            кодом
            активации.
          </p>
          <p>
            Код активации действителен в течение 15 минут.
          </p>
          <p>
            Если учётная запись не будет активирована в течение указанного времени, она будет удалена.
          </p>

          <div v-if="showEmailField" class="mb-3">
            <input placeholder="Введите email" v-model="email" class="form-control" />
            <div v-if="this.v$.email.$error" class="invalid-feedback d-block mx-2">Email (длина: от 5 символов,
              корректный формат email)
            </div>
          </div>

          <div class="mb-3">
            <input @paste="checkCodeFormat" @keypress="checkCodeFormat" v-model="code"
              placeholder="Введите код активации" class="form-control" />
            <div v-if="this.v$.code.$error" class="invalid-feedback d-block mx-2">Код активации (4 цифры)
            </div>
          </div>

          <div class="mb-3">
            <button @click="activate(email, code)" :disabled="isDisabled" type="button"
              class="btn btn-primary w-100">Активировать</button>
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
import { required, numeric, maxLength, minLength } from '@vuelidate/validators'
import { email } from '../../helpers/validations'
import { recaptcha } from '../../helpers/recaptcha'



export default {
  data() {
    return {
      v$: useValidate(),
      code: '',
      email: this.$user.email || '',
      showEmailField: false,
      showPassword: false,
      submitError: false,
      storage: {},
      isDisabled: false,
    };
  },

  validations() {
    return {
      code: {
        required,
        numeric,
        maxLength: maxLength(4),
        minLength: minLength(4),
      },

      email: {
        required,
        email,
      },
    }
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

    async activate(email, code) {
      this.v$.$validate();

      if (!this.v$.$error) {
        this.$loader.show();
        this.isDisabled = true;

        recaptcha().then((token) => {
          UserService.activate(email, code, token).then((data) => {
            this.$loader.hide();

            if (data.code === 200) {
              this.$router.push({ name: 'login' });

              this.$toast.success('Ваша учётная запись активирована');
            } else {
              this.isDisabled = false;

              this.$toast.error('Код активации неверен, либо уже истёк');
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
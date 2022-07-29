<template>
  <modal>
    <template v-slot:title>
      Удаление учётной записи
    </template>

    <template v-slot:content>
      <div v-if="incorrectPassword" class="alert alert-danger" role="alert">
        Неверный пароль.
      </div>

      <input ref="password" v-model="deletionPassword" type="password" @keypress.enter="deleteUser()" class="form-control"
        placeholder="Введите текущий пароль">

      <div v-if="this.v$.deletionPassword.$error" class="invalid-feedback d-block mx-2">Пароль: длина - 8-15
        символов, мин. 1 лат. буква, мин. 1 цифра</div>
    </template>

    <template v-slot:buttons>
      <button :disabled="isDisabled" @click="deleteUser()" type="button" class="btn btn-danger">Удалить</button>
    </template>
  </modal>
</template>

<script>
import useValidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { password } from '../../helpers/validations'
import Modal from '../common/Modal.vue'

import UserService from '../../services/UserService'

export default {
  data() {
    return {
      v$: useValidate(),
      deletionPassword: '',
      isDisabled: false,
      incorrectPassword: false
    }
  },

  validations: {
    deletionPassword: {
      required,
      password
    },
  },

  components: {
    Modal
  },

  methods: {
    deleteUser() {
      this.v$.$validate();

      if (!this.v$.$error) {
        this.$loader.show();
        this.isDisabled = true;
        this.incorrectPassword = false;

        const password = this.$refs.password.value;

        UserService.delete(password).then((r) => {
          this.$loader.hide();
          this.isDisabled = false;

          if (r.code === 200) {
            UserService.logout().then(() => {
              this.$user.logout();
              this.$router.push('/');
            });
          } else {
            this.incorrectPassword = true;
          }
        });
      }
    }
  }
}
</script>
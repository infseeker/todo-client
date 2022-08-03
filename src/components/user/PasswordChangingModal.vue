<template>
  <modal>
    <template v-slot:title>
      Изменение пароля
    </template>

    <template v-slot:content>
      <div v-if="wrongOldPassword" class="alert alert-danger" role="alert">
        Неверный текущий пароль
      </div>

      <div @keypress.enter="changePassword(oldPassword, newPassword)">
        <div class="form-password-toggle">
          <div class="input-group input-group-merge">
            <input v-if="showPassword" v-model.trim="oldPassword" type="text" placeholder="Введите текущий пароль"
              class="form-control" />

            <input v-else type="password" v-model.trim="oldPassword" placeholder="Введите текущий пароль"
              class="form-control" />

            <span @click="showPassword = !showPassword" class="input-group-text cursor-pointer">
              <i v-if="showPassword" class="bx bx-show"></i>
              <i v-else class="bx bx-hide"></i>
            </span>
          </div>

          <div v-if="this.v$.oldPassword.$error" class="invalid-feedback d-block mx-2">Текущий пароль обязателен</div>
        </div>

        <div class="form-password-toggle mt-3">
          <div class="input-group input-group-merge">
            <input v-if="showPassword" v-model.trim="newPassword" type="text" placeholder="Введите новый пароль"
              class="form-control" />

            <input v-else type="password" v-model.trim="newPassword" placeholder="Введите новый пароль"
              class="form-control" />

            <span @click="showPassword = !showPassword" class="input-group-text cursor-pointer">
              <i v-if="showPassword" class="bx bx-show"></i>
              <i v-else class="bx bx-hide"></i>
            </span>
          </div>

          <div v-if="this.v$.newPassword.$error" class="invalid-feedback d-block mx-2">Формат пароля (длина: 8-15
            символов, латинские буквы, мин. 1 цифра)</div>
        </div>
      </div>
    </template>

    <template v-slot:buttons>
      <button :disabled="isDisabled" @click="changePassword(oldPassword, newPassword)" type="button"
        class="btn btn-primary">Сохранить</button>
    </template>
  </modal>
</template>

<script>
import Modal from '../common/Modal.vue'
import UserService from '../../services/UserService'

import useValidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { password } from '../../helpers/validations'

export default {
  data() {
    return {
      v$: useValidate(),
      oldPassword: '',
      newPassword: '',
      showPassword: false,
      isDisabled: false,
      wrongOldPassword: false,
    }
  },

  validations() {
    return {
      oldPassword: {
        required,
      },

      newPassword: {
        required,
        password,
      },
    }
  },

  components: {
    Modal
  },

  methods: {
    changePassword(oldPassword, newPassword) {
      this.v$.$validate();

      if (!this.v$.$error) {
        this.$loader.show();
        this.isDisabled = true;
        this.wrongOldPassword = false;

        UserService.changePassword(oldPassword, newPassword).then((r) => {
          this.$loader.hide();
          this.isDisabled = false;

          if (r.code === 200) {
            this.$emit('close');
          } else {
            this.wrongOldPassword = true;
          }
        });
      }
    }
  }
}
</script>
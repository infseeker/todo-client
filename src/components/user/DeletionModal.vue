<template>
  <modal>
    <template v-slot:title>
      Удаление учётной записи
    </template>

    <template v-slot:content>
      <div v-if="incorrectPassword" class="alert alert-danger" role="alert">
        Неверный пароль.
      </div>

      <div class="form-password-toggle">
        <div class="input-group input-group-merge">
          <input v-if="showPassword" @keypress.enter="deleteUser(password)" v-model.trim="password" type="text"
            placeholder="Введите пароль" class="form-control" />
            
          <input v-else @keypress.enter="deleteUser(password)" type="password" v-model.trim="password"
            placeholder="Введите пароль" class="form-control" />

          <span @click="showPassword = !showPassword" class="input-group-text cursor-pointer">
            <i v-if="showPassword" class="bx bx-show"></i>
            <i v-else class="bx bx-hide"></i>
          </span>
        </div>
      </div>
    </template>

    <template v-slot:buttons>
      <button :disabled="isDisabled" @click="deleteUser(password)" type="button" class="btn btn-danger">Удалить</button>
    </template>
  </modal>
</template>

<script>
import Modal from '../common/Modal.vue'
import UserService from '../../services/UserService'

export default {
  data() {
    return {
      password: '',
      showPassword: false,
      isDisabled: false,
      incorrectPassword: false
    }
  },

  components: {
    Modal
  },

  methods: {
    deleteUser(password) {
      if (!password) {
        this.incorrectPassword = true;
        return;
      }

      this.$loader.show();
      this.isDisabled = true;
      this.incorrectPassword = false;

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
</script>
<template>
  <user-form>
    <template v-slot:title>
      Удалённая учётная запись
    </template>

    <template v-slot:content>
      <p>
        Ваша учётная запись была удалена. Хотите восстановить доступ?
      </p>
    </template>

    <template v-slot:button>
      <router-link :to="{ name: 'restoration-email' }" class="btn btn-primary w-100">Восстановить доступ
      </router-link>
    </template>
  </user-form>
</template>

<script>
import UserForm from '../components/user/UserForm.vue'

export default {
  components: {
    UserForm,
  },

  mounted() {
    if (!this.$user.isDeleted) {
      this.$router.push({ name: 'restoration-email' })
    }
  }
}
</script>
<template>
  <user-form>
    <template v-slot:title>
      {{ this.$t('user.deletedAccount')}}
    </template>

    <template v-slot:content>
      <p>{{ this.$t('user.wantRestore?')}}</p>
    </template>

    <template v-slot:button>
      <router-link :to="{ name: 'restoration-email' }" class="btn btn-primary w-100">
        {{ this.$t('user.restore') }}
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
<template>
  <div class="login">
    <h1>Login Page</h1>
    <LoginForm></LoginForm>
  </div>
</template>

<script>
import LoginForm from '../components/user/LoginForm.vue';

export default {
  components: {
    LoginForm
  }
}
</script>
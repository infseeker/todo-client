<template>
  <div class="registration">
    <h1>Registration</h1>
    <RegisterForm></RegisterForm>
  </div>
</template>

<script>
import RegisterForm from '../components/user/RegisterForm.vue';

export default {
  components: {
    RegisterForm,
  },
};
</script>

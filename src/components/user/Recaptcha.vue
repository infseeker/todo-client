<template>
  <div class="recaptcha">
    <small v-html="this.$t('user.recaptchaMessage', [
      `<a href='https://policies.google.com/privacy'>${this.$t('user.recaptchaPrivacy')}</a>`,
      `<a href='https://policies.google.com/terms'>${this.$t('user.recaptchaService')}</a>`
    ])"></small>
  </div>
</template>

<style scoped>
small {
  opacity: 0.5;
}
</style>
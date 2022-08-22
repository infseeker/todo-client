<template>
  <div class="not-found mt-5">
    <img :src="imageUrl" alt="Страница не найдена" @click="meow">
    <h2>{{ this.$t('app.notFound') }}</h2>
    <p><router-link :to="{ path: '/' }">{{ this.$t('app.backToMain') }}</router-link></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: new URL(`../../assets/img/status/404.svg`, import.meta.url),
      meowUrl: new URL(`../../assets/sounds/cat-meow-1.mp3`, import.meta.url),
    }
  },

  methods: {
    meow() {
      new Audio(this.meowUrl).play();
    }
  }
}
</script>

<style scoped>
img {
  width: 100%;
  max-height: 70vh;
}

h2,
p {
  text-align: center;
}

a {
  font-size: 1.1rem;
}

h2 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}
</style>
<template>
  <div class="not-found mt-5">
    <img :src="imageUrl" alt="Страница не найдена" style="width: 100%; max-height: 70vh" @click="meow">
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
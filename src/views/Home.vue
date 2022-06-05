<template>
  <div class="home">
    <h1>Home</h1>
  </div>
</template>

<script>

// Test data fetching from the backend
export default {
  data() {
    return {
      test: ''
    }
  },
  mounted() {
    fetch(api)
    .then(response => response.json())
    .then(data => console.log(data))
  }
}
</script>

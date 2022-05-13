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
    fetch('http://localhost:5000')
    .then((response)=>{console.log(response)})
  }
}
</script>

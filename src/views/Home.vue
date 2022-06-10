<template></template>

<script>
// Test data fetching from the backend
export default {
  data() {
    const user = {
      isAuth: true,
      isAdmin: false,
    };

    return {
      user: user,
    };
  },
  data() {
    return {
      test: '',
    };
  },
  async mounted() {
    await fetch('http://localhost:5000/todo/api/user/check-username', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'asdfasdf1' }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  },
};
</script>

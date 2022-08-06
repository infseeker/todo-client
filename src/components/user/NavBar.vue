<template>
  <nav class="layout-navbar navbar navbar-detached align-items-center bg-navbar-theme">
    <div class="navbar-nav-right d-flex align-items-center">

      <router-link :to="{ name: 'home' }" class="align-items-center home-link">
        <i v-if="this.$user.isAdmin" class='bx bx-news'></i>
        <i v-else class='bx bx-list-check'></i>
      </router-link>

      <ul class="navbar-nav flex-row align-items-center ms-auto">
        <li v-if="!this.$user.isAuth">
          <router-link :to="{ name: 'login' }" class="btn btn-primary ms-2" title="Вход">
            <i class='bx bx-log-in'></i>
          </router-link>
        </li>

        <li v-if="this.$user.isAuth && this.$user.isAdmin">
          <router-link :to="{ name: 'lists' }" class="btn btn-primary ms-2" title="Мои списки">
            <i class='bx bx-list-check'></i>
          </router-link>
        </li>

        <li v-if="this.$user.isAuth">

          <router-link :to="{ name: 'profile' }" title="Профиль пользователя">
            <img v-if="this.$user.image" :src="this.$user.image" class="user-image" alt="Изображение пользователя">
            <img v-if="!this.$user.image" :src="this.emptyUserImageUrl" class="blank-user-image bx-gray"
              alt="Изображение пользователя">
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import UserService from '../../services/UserService';

export default {
  data() {
    return {
      emptyUserImageUrl: new URL(`../../assets/img/icons/bx-user-circle.svg`, import.meta.url),
    };
  },

  methods: {
    logout() {
      this.$loader.show();

      UserService.logout().then(r => {
        this.$loader.hide();

        this.$user.logout();
        this.$store.lists = [];

        this.$router.push('/');
      });
    },
  }
};
</script>

<style scoped>
.btn {
  font-weight: 600;
}

.user-image, .blank-user-image {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
}
</style>

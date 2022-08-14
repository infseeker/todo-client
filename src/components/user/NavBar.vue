<template>
  <nav class="layout-navbar navbar navbar-detached align-items-center bg-navbar-theme">
    <div class="navbar-nav-right d-flex align-items-center">

      <router-link :to="{ name: 'home' }" class="align-items-center home-link">
        <i v-if="this.$user.isAdmin" class='bx bx-news'></i>
        <i v-else class='bx bx-list-check'></i>
      </router-link>

      <ul class="navbar-nav flex-row align-items-center ms-auto">
        <li v-if="!this.$user.isAuth">
          <router-link :to="{ name: 'login' }" class="btn btn-primary ms-2" :title="this.$t('user.login')">
            <i class='bx bx-log-in'></i>
          </router-link>
        </li>

        <li v-if="this.$user.isAuth && this.$user.isAdmin">
          <router-link :to="{ name: 'lists' }" class="admin-lists-link" title="Мои списки">
            <i class='bx bx-list-check'></i>
          </router-link>
        </li>

        <li v-if="this.$user.isAuth">
          <router-link :to="{ name: 'profile' }" :title="this.$t('user.profile')">
            <img v-if="this.$user.image" :src="this.$user.image" class="user-image" :alt="this.$t('user.image')">
            <img v-if="!this.$user.image" :src="this.blankUserImageUrl" class="blank-user-image bx-gray"
              :alt="this.$t('user.image')">
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      blankUserImageUrl: new URL(`../../assets/img/icons/bx-user-circle.svg`, import.meta.url),
    };
  },
};
</script>

<style scoped>
.user-image,
.blank-user-image {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
}

.admin-lists-link .bx {
  width: 3rem;
  height: 3rem;
  margin-top: 0.4rem;
  margin-right: 0.5rem;
  filter: brightness(0) saturate(100%) invert(51%) sepia(84%) saturate(4427%) hue-rotate(222deg) brightness(101%) contrast(102%);
}
</style>

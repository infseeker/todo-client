<template>
  <div class="profile-form mt-4">
    <div class="card">
      <div class="card-body" v-on:keyup.enter="save(password)">
        <h5 class="header mb-0">{{ this.$t('user.profileSettings') }}</h5>

        <div class="user-image">
          <img v-if="!this.$user.image" @click="meow" :src="this.catImage" :alt="this.$t('user.petCat')"
            :title="this.$t('user.petCat')" class="mb-3 mt-3 cat-user-image">
          <img v-if="this.$user.image" :src="this.$user.image" :alt="this.$t('user.image')" class="mb-3 mt-3">
          <span v-if="this.$user.image" class="user-image-delete" :title="this.$t('user.deleteImage')"
            @click="deleteUserImage"></span>
        </div>

        <div class="mb-2">
          <span class="name-label form-label mb-0">{{ this.$t('user.name') }} </span>
          <span class="badge bg-label-primary ">{{ this.$user.username }}</span>
        </div>

        <div class="mb-3">
          <span class="email-label form-label mb-0">{{ this.$t('user.email') }} </span>
          <span class="badge bg-label-primary ">{{ this.$user.email }}</span>
        </div>

        <div class="locales">
          <label for="defaultSelect" class="form-label">{{ this.$t('user.lang') }} </label>

          <select v-model="this.$user.locale" @change="changeLocale($event)" class="form-select">
            <option v-for="locale in locales" :value="locale.code" :key="locale.code" class="dropdown-item">
              {{ this.$t(`user.${locale.language}`) }}
            </option>
          </select>
        </div>

        <div class="mt-3">
          <button @click="showImageChangingModal = true" type="button" class="btn btn-primary w-100">
            {{ this.$t('user.changeImage') }}
          </button>
        </div>

        <div class="mt-3">
          <button @click="showPasswordChangingModal = true" type="button" class="btn btn-primary w-100">
            {{ this.$t('user.changePassword') }}
          </button>
        </div>

        <div class="mt-3">
          <button @click="logout()" type="button" class="btn btn-primary w-100">{{ this.$t('user.logout') }}</button>
        </div>
      </div>
    </div>

    <div class="card mt-4">
      <div class="card-body">
        <button @click="showDeletionUserModal = true" type="button" class="btn btn-danger w-100">
          {{ this.$t('user.deleteAccount') }}
        </button>
      </div>
    </div>
  </div>

  <image-changing-modal v-if="showImageChangingModal" @close="showImageChangingModal = false"></image-changing-modal>

  <password-changing-modal v-if="showPasswordChangingModal" @close="showPasswordChangingModal = false">
  </password-changing-modal>

  <deletion-modal v-if="showDeletionUserModal" @close="showDeletionUserModal = false"></deletion-modal>
</template>

<script>
import UserService from '../../services/UserService'
import { i18nUtils } from '../../helpers/i18n';
import ImageChangingModal from './ImageChangingModal.vue'
import PasswordChangingModal from './PasswordChangingModal.vue'
import DeletionModal from './DeletionModal.vue'

export default {
  data() {
    return {
      userImage: '',
      catImage: new URL(`../../assets/img/user-blank-${Math.floor(Math.random() * 3) + 1}.svg`, import.meta.url),
      locales: i18nUtils.locales,

      showImageChangingModal: false,
      showPasswordChangingModal: false,
      showDeletionUserModal: false,
    }
  },

  components: {
    ImageChangingModal,
    PasswordChangingModal,
    DeletionModal,
  },

  methods: {
    deleteUserImage() {
      this.$loader.show();

      UserService.deleteUserImage().then(data => {
        this.$loader.hide();

        if (data.code === 200) {
          this.$user.image = '';
        }
      })
    },

    changeLocale($event) {
      const locale = $event.target.value;
      i18nUtils.setLocale(locale);

      UserService.changeLocale(locale).then(r => {
      });
    },

    meow() {
      const catMeowSoundUrl = new URL(`../../assets/sounds/cat-meow-${Math.floor(Math.random() * 3) + 1}.mp3`, import.meta.url);
      const audio = new Audio(catMeowSoundUrl);
      audio.play();
    },

    logout() {
      this.$loader.show();

      UserService.logout().then(r => {
        this.$loader.hide();

        this.$user.logout();
        this.$store.lists = [];

        this.$router.push('/');
      });
    }
  },
}
</script>

<style scoped>
.card {
  align-items: center;
}

.card-body {
  width: 100%;
  max-width: 400px;
  position: relative;
}

.name-label,
.email-label {
  display: inline-block;
  min-width: 2.5rem;
}

.locales {
  display: flex;
  align-items: center;
}

.locales label {
  margin: 0;
  margin-right: 0.7rem;
}

.locales select {
  width: auto;
  flex-grow: 1
}

.user-image,
.user-image img {
  border-radius: 50%;
}

.user-image .cat-user-image {
  cursor: pointer
}

.user-image {
  width: 45%;
  height: 45%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: end;
  position: relative;
}

.user-image img {
  width: 8rem;
  height: 8rem;
  display: block;
  margin: auto;
}

.user-image:after:hover {
  content: '\A';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 1);
  opacity: 1;
  transition: all 1s;
  -webkit-transition: all 1s;
}

.user-image:hover .user-image-delete {
  display: block;
}

.user-image-delete {
  display: none;
  position: absolute;
  right: 2%;
  top: 7%;
  width: 1.2rem;
  height: 1.2rem;
  opacity: 0.7;
}

.user-image-delete:hover {
  opacity: 1;
  cursor: pointer;
}

.user-image-delete:before,
.user-image-delete:after {
  position: absolute;
  content: ' ';
  height: 1rem;
  width: 2px;
  background-color: #566a7f;
}

.user-image-delete:before {
  transform: rotate(45deg);
}

.user-image-delete:after {
  transform: rotate(-45deg);
}
</style>
<template>
  <div class="profile-form mt-4">
    <div class="card">
      <div class="card-body" v-on:keyup.enter="save(password)">
        <h5 class="header mb-0">Настройки профиля</h5>

        <div v-if="saved" class="mt-3">
          <div class="alert alert-success mb-0" role="alert">
            Изменения сохранены.
          </div>
        </div>

        <div v-if="errorOnImageDelete" class="mt-3">
          <div class="alert alert-danger mb-0" role="alert">
            При попытке удалить изображение возникла ошибка.
          </div>
        </div>

        <div v-if="errorOnSave" class="mt-3">
          <div class="alert alert-danger mb-0" role="alert">
            Изменения не сохранены. Проверьте введённые данные.
          </div>
        </div>

        <div class="user-image">
          <img v-if="!userImage" @click="meow" :src="this.catImage" alt="Погладь котика" title="Погладь котика"
            class="mb-3 mt-3 cat-user-image">
          <img v-if="userImage" :src="this.userImage" alt="Изображение пользователя" class="mb-3 mt-3">
          <span v-if="userImage" class="user-image-delete" title="Удалить изображение" @click="deleteUserImage"></span>
        </div>

        <div class="mb-2">
          <span class="badge bg-label-primary"><span class="form-label mb-0">Имя: </span>{{ this.$user.username
          }}</span>
        </div>

        <div class="mb-3">

          <span class="badge bg-label-primary"><span class="form-label mb-0">Email: </span>{{ this.$user.email }}</span>
        </div>

        <div class="mt-3">
          <button @click="showImageChangingModal = true" type="button" class="btn btn-primary w-100">Изменить
            изображение</button>
        </div>

        <div class="mt-3">
          <button @click="showPasswordChangingModal = true" type="button" class="btn btn-primary w-100">Изменить
            пароль</button>
        </div>

        <div class="mt-3">
          <button @click="logout()" type="button" class="btn btn-primary w-100">Выход</button>
        </div>

        <!-- <div class="mb-3 mt-3 form-password-toggle">
          <div class="input-group input-group-merge">
            <input v-if="showPassword" placeholder="Введите новый пароль" v-model="password" class="form-control" />
            <input v-else type="password" placeholder="Введите новый пароль" v-model="password" class="form-control" />
            <span @click="showPassword = !showPassword" class="input-group-text cursor-pointer">
              <i v-if="showPassword" class="bx bx-show"></i>
              <i v-else class="bx bx-hide"></i>
            </span>
          </div>
          <div v-if="this.v$.password.$error" class="invalid-feedback d-block mx-2">Пароль: длина - 8-15
            символов, мин. 1 лат. буква, мин. 1 цифра</div>
        </div>

        <div class="mt-4">
          <button @click="save()" :disabled="isDisabled" type="button" class="btn btn-primary w-100">Сохранить</button>
        </div> -->
      </div>
    </div>

    <div class="card mt-4">
      <div class="card-body">
        <button @click="showDeletionUserModal = true" type="button" class="btn btn-danger w-100">Удалить учётную
          запись</button>
      </div>
    </div>
  </div>

  <image-changing-modal v-if="showImageChangingModal" @change-image="changeUserImage"
    @close="showImageChangingModal = false"></image-changing-modal>

  <password-changing-modal v-if="showPasswordChangingModal" @close="showPasswordChangingModal = false">
  </password-changing-modal>

  <deletion-modal v-if="showDeletionUserModal" @close="showDeletionUserModal = false"></deletion-modal>
</template>

<script>
import UserService from '../../services/UserService'
import useValidate from '@vuelidate/core'
import { password } from '../../helpers/validations'

import ImageChangingModal from './ImageChangingModal.vue'
import PasswordChangingModal from './PasswordChangingModal.vue'
import DeletionModal from './DeletionModal.vue'

export default {
  data() {
    return {
      v$: useValidate(),
      password: '',
      showPassword: false,
      isDisabled: false,
      saved: false,
      errorOnSave: false,
      errorOnImageDelete: false,
      userImage: '',
      catImage: new URL(`../../assets/img/user-blank-${Math.floor(Math.random() * 3) + 1}.svg`, import.meta.url),


      showImageChangingModal: false,
      showPasswordChangingModal: false,
      showDeletionUserModal: false,
    }
  },

  validations() {
    return {
      password: {
        password
      },
    }
  },

  components: {
    ImageChangingModal,
    PasswordChangingModal,
    DeletionModal,
  },

  methods: {
    save() {
      this.saved = false;
      this.errorOnSave = false;

      const password = this.password;
      let image = '';

      if (password) {
        this.v$.password.$validate();
      }



      if (password || image) {
        if (!this.v$.password.$error) {
          this.$loader.show();
          this.isDisabled = true;

          UserService.update(password, image).then((data) => {
            this.$loader.hide();

            if (data.code === 200) {
              this.saved = true;

              if (image) {
                this.userImage = image;
              }

              if (password) {
                this.$user.logout()
                this.$router.push({ name: 'login' })
              }
            } else {
              this.errorOnSave = true;
            }

            this.isDisabled = false;
            this.password = '';
          });
        }
      } else {
        this.errorOnSave = true;
      }
    },

    changeUserImage(image) {
      this.userImage = image;
    },

    deleteUserImage() {
      this.$loader.show();
      this.errorOnImageDelete = false;

      UserService.deleteUserImage().then(data => {
        this.$loader.hide();

        if (data.code === 200) {
          this.userImage = '';
        } else {
          this.errorOnImageDelete = true;
        }
      })
    },

    meow() {
      const catMeowSoundUrl = new URL(`../../assets/sounds/cat-meow-${Math.floor(Math.random() * 3) + 1}.mp3`, import.meta.url);
      const audio = new Audio(catMeowSoundUrl);
      audio.play();
    },

    logout() {

    }
  },

  mounted() {
    UserService.getUserImage().then(data => {
      if (data.code === 200) {
        this.userImage = data.image;
      }
    });
  }
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
  width: 80%;
  height: 80%;
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
  right: 5%;
  top: 10%;
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
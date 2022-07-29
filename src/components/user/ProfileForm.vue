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
            class="mb-3 mt-3">
          <img v-if="userImage" :src="this.userImage" alt="Аватар пользователя" class="mb-3 mt-3">
          <span v-if="userImage" class="user-image-delete" title="Удалить аватар" @click="deleteUserImage"></span>
        </div>

        <div class="mb-2">
          <span class="badge bg-label-primary"><span class="form-label mb-0">Имя: </span>{{ this.$user.username
          }}</span>
        </div>

        <div class="mb-3">

          <span class="badge bg-label-primary"><span class="form-label mb-0">Email: </span>{{ this.$user.email }}</span>
        </div>

        <div class="mb-3 form-password-toggle">
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

        <div class="">
          <div class="input-group custom-file-button">
            <label class="input-group-text" for="inputGroupFile">Выберите аватар</label>
            <input type="file" class="form-control" id="inputGroupFile" @change="uploadImage($event)" accept="image/*"
              ref="file" />
          </div>
          <div v-if="wrongImgFormat" class="invalid-feedback d-block mx-2">Изображение: jpeg, png, макс. размер - 5 Мб
          </div>
        </div>

        <cropper v-show="showCropper" :stencil-component="$options.components.CircleStencil" ref="cropper"
          class="cropper mt-3" :src="image.src" :canvas="{ height: 256, width: 256 }" />

        <div class="mt-4">
          <button @click="save()" :disabled="isDisabled" type="button" class="btn btn-primary w-100">Сохранить</button>
        </div>
      </div>
    </div>

    <!-- User deletion -->
    <div class="card mt-4">
      <div class="card-body" v-on:keyup.enter="deleteUser(deletePassword)">
        <h5 class="header mb-3">Удаление учётной записи</h5>

        <button @click="showDeletionUserModal = true" type="button" class="btn btn-danger w-100">Удалить учётную
          запись</button>
      </div>
    </div>
  </div>

  <deletion-modal v-if="showDeletionUserModal" :incorrectPassword="wrongDeletionPassword" @close="showDeletionUserModal = false" @delete-user="deleteUser">
  </deletion-modal>
</template>

<script>
import UserService from '../../services/UserService'
import useValidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { password } from '../../helpers/validations'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

import DeletionModal from './DeletionModal.vue'

export default {
  data() {
    return {
      v$: useValidate(),
      password: '',
      deletionPassword: '',
      wrongDeletionPassword: false,
      showPassword: false,
      isDisabled: false,
      delIsDisabled: false,
      showCropper: false,
      wrongImgFormat: false,
      saved: false,
      errorOnSave: false,
      errorOnImageDelete: false,
      userImage: '',
      catImage: new URL(`../../assets/img/user-blank-${Math.floor(Math.random() * 3) + 1}.svg`, import.meta.url),
      image: {
        src: '',
        type: '',
      },

      showDeletionUserModal: false,
    }
  },

  validations() {
    return {
      password: {
        password
      },

      deletionPassword: {
        required,
        password
      },
    }
  },

  components: {
    Cropper,
    CircleStencil,
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

      if (this.image.src) {
        if (this.image.type === 'image/jpeg' || this.image.type === 'image/png') {
          const { canvas } = this.$refs.cropper.getResult();
          if (canvas) {
            image = canvas.toDataURL(this.image.type);
          }
        }
      }

      if (password || image) {
        if (!this.v$.password.$error) {
          this.$isLoading.value = true;
          this.isDisabled = true;

          UserService.update(password, image).then((data) => {
            this.$isLoading.value = false;

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
            this.showCropper = false;
            this.$refs.file.value = null;
            this.password = '';
            this.image.src = '';
          });
        }
      } else {
        this.errorOnSave = true;
      }
    },

    uploadImage(event) {
      const { files } = event.target;

      if (files && files[0]) {
        if (this.image.src) {
          URL.revokeObjectURL(this.image.src)
        }
        const blob = URL.createObjectURL(files[0]);

        const reader = new FileReader();
        reader.onload = (e) => {
          this.image = {
            src: blob,
            type: this.getMimeType(e.target.result, files[0].type),
          };

          if (this.image.src && (this.image.type === 'image/jpeg' || this.image.type === 'image/png') && this.$refs.file.value && this.$refs.file.files[0].size < 5242880) {
            this.wrongImgFormat = false;
            this.isDisabled = false;
            this.showCropper = true;
          } else {
            this.wrongImgFormat = true;
            this.isDisabled = true;
            this.showCropper = false;
          }
        };

        reader.readAsArrayBuffer(files[0]);
      }
    },

    deleteUserImage() {
      this.$isLoading.value = true;
      this.errorOnImageDelete = false;

      UserService.deleteUserImage().then(data => {
        this.$isLoading.value = false;

        if (data.code === 200) {
          this.userImage = '';
        } else {
          this.errorOnImageDelete = true;
        }
      })
    },

    getMimeType(file, fallback = null) {
      const byteArray = (new Uint8Array(file)).subarray(0, 4);
      let header = '';
      for (let i = 0; i < byteArray.length; i++) {
        header += byteArray[i].toString(16);
      }
      switch (header) {
        case "89504e47":
          return "image/png";
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
          return "image/jpeg";
        default:
          return fallback;
      }
    },

    deleteUser(password) {
      if (!this.v$.deletionPassword.$error) {
        
      }
    },

    meow() {
      const catMeowSoundUrl = new URL(`../../assets/sounds/cat-meow-${Math.floor(Math.random() * 3) + 1}.mp3`, import.meta.url);
      const audio = new Audio(catMeowSoundUrl);
      audio.play();
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

.cropper {
  max-width: 70vw;
  min-width: 100%;
  border-radius: 0.375rem;
}

.vue-advanced-cropper__foreground,
.vue-advanced-cropper__background,
.vue-advanced-cropper__image-wrapper,
.vue-advanced-cropper__image-wrapper img {
  border-radius: 0.375rem;
}

.vue-advanced-cropper__background {
  background-image: linear-gradient(45deg, #e6e6e6 25%, transparent 25%), linear-gradient(-45deg, #e6e6e6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e6e6e6 75%), linear-gradient(-45deg, transparent 75%, #e6e6e6 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  background-color: rgba(255, 255, 255);
}

.user-image,
.user-image img {
  border-radius: 50%;
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
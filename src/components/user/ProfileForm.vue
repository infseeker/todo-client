<template>
  <div class="profile-form mt-4">
    <div class="card">
      <div class="card-body" v-on:keyup.enter="save(password)">
        <h4 class="header mb-4">Профиль</h4>
        <div v-if="saved" class="mb-3">
          <div class="alert alert-success" role="alert">
            Изменения сохранены.
          </div>
        </div>
        <div v-if="errorOnSave" class="mb-3">
          <div class="alert alert-danger" role="alert">
            Изменения не сохранены. Проверьте введённые данные.
          </div>
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

        <div class="input-group custom-file-button mb-4">
          <label class="input-group-text" for="inputGroupFile">Выберите аватар</label>
          <input type="file" class="form-control" id="inputGroupFile" @change="uploadImage($event)" accept="image/*" />
        </div>

        <cropper :stencil-component="$options.components.CircleStencil" :debounce="false" ref="cropper" class="cropper"
          @change="onChange" :src="image.src" :canvas="{ height: 256, width: 256 }" />
        <div class="button-wrapper">
          <button class="button" @click="cropImage()">Crop image</button>
        </div>

        <!-- <preview v-if="image.src" :width="120" :height="120" :image="result.image" :coordinates="result.coordinates" /> -->

        <div class="mb-3">
          <button @click="save()" :disabled="isDisabled" type="button" class="btn btn-primary w-100">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import UserService from '../../services/UserService'
import useValidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { password } from '../../helpers/validations'
import { Cropper, CircleStencil, Preview } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

export default {
  data() {
    return {
      v$: useValidate(),
      password: '',
      showPassword: false,
      isDisabled: false,
      saved: false,
      errorOnSave: false,
      image: {
        src: '',
        type: "image/jpg",
      },
      result: {
        coordinates: null,
        image: null
      },
    }
  },

  validations() {
    return {
      password: {
        required,
        password
      },
    }
  },

  components: {
    Cropper,
    CircleStencil,
    Preview
  },

  methods: {
    save(password) {
      this.v$.$validate();

      if (!this.v$.$error) {
        this.isDisabled = true;
        this.saved = false;
        this.errorOnSave = false;

        UserService.update(password).then((data) => {
          if (data.code === 200) {
            this.saved = true;
            this.isDisabled = false;
          } else {
            this.errorOnSave = true;
            this.isDisabled = false;
          }
        });
      }
    },

    uploadImage(event) {
      /// Reference to the DOM input element
      const { files } = event.target;
      // Ensure that you have a file before attempting to read it
      if (files && files[0]) {
        // 1. Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
        if (this.image.src) {
          URL.revokeObjectURL(this.image.src);
        }
        // 2. Create the blob link to the file to optimize performance:
        const blob = URL.createObjectURL(files[0]);

        // 3. Update the image. The type will be derived from the extension and it can lead to an incorrect result:
        this.image = {
          src: blob,
          type: files[0].type,
        };
      }
    },

    cropImage() {
      const result = this.$refs.cropper.getResult();
      const newTab = window.open();
      newTab.document.body.innerHTML = `<img src="${result.canvas.toDataURL(
        this.image.type
      )}"></img>`;
    },

    destroyed() {
      // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
      if (this.image.src) {
        URL.revokeObjectURL(this.image.src);
      }
    },

    onChange({ coordinates, image }) {
      this.result = {
        coordinates,
        image
      };
    },
  },
}
</script>

<style>
.card {
  align-items: center;
}

.card-body {
  max-width: 400px;
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

.vue-preview {
  border-radius: 50%;
}
</style>
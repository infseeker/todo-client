<template>
  <modal>
    <template v-slot:title>
      Изменение изображения
    </template>

    <template v-slot:content>
      <div class="">
        <div class="input-group custom-file-button">
          <label class="input-group-text" for="inputGroupFile">Выберите изображение</label>
          <input type="file" class="form-control" id="inputGroupFile" @change="uploadImage($event)" accept="image/*"
            ref="file" />
        </div>
        <div v-if="wrongImgFormat" class="invalid-feedback d-block mx-2">Изображение: jpeg, png, макс. размер - 5 Мб
        </div>
      </div>

      <cropper v-show="showCropper" :stencil-component="$options.components.CircleStencil" ref="cropper"
        class="cropper mt-3" :src="image.src" :canvas="{ height: 256, width: 256 }" />
    </template>

    <template v-slot:buttons>
      <button :disabled="isDisabled" @click="saveImage()" type="button" class="btn btn-primary">Сохранить</button>
    </template>
  </modal>
</template>

<script>
import Modal from '../common/Modal.vue'
import UserService from '../../services/UserService'

import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

export default {
  data() {
    return {
      showCropper: false,
      image: {
        src: '',
        type: '',
      },
      wrongImgFormat: false,
      isDisabled: true,
    }
  },

  components: {
    Modal,
    Cropper,
    CircleStencil,
  },

  methods: {
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

    saveImage() {
      let image;

      if (this.image.src) {
        if (this.image.type === 'image/jpeg' || this.image.type === 'image/png') {
          const { canvas } = this.$refs.cropper.getResult();
          if (canvas) {
            image = canvas.toDataURL(this.image.type);
          }
        }
      }

      if (image) {
        this.$loader.show();
        this.isDisabled = true;

        UserService.changeUserImage(image).then((r) => {
          this.$loader.hide();
          this.isDisabled = false;
          console.log(r);

          if (r.code === 200) {
            this.$user.image = UserService.getUserImage(r.data);
            this.$emit('close');
          }
        });
      }
    },
  }
}
</script>

<style>
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
</style>
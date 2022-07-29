<template>
  <div class="user-deletion-modal">
    <div ref="modal" class="modal fade" tabindex="-1" aria-hidden="true" data-bs-keyboard="false" @keyup.esc="close()">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <slot name="title"></slot>
            </h5>

            <button type="button" class="btn-close" @click="close()"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col mb-3">
                <slot name="content"></slot>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" @click="close()" class="btn btn-outline-secondary">Отмена</button>

            <slot name="buttons"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useValidate from '@vuelidate/core'
import { Modal } from 'bootstrap'

export default {
  data() {
    return {
      v$: useValidate(),
      isDisabled: false,
    }
  },

  methods: {
    setEventListeners(modalEl, input) {
      modalEl.addEventListener('shown.bs.modal', () => {
        this.$nextTick(() => {
          if (input) input.focus();
        })
      });

      modalEl.addEventListener('hidden.bs.modal', () => {
        this.$emit('close');
      });

      modalEl.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
          this.close();
        }
      });
    },

    open() {
      const modalEl = this.$refs.modal;
      const modal = new Modal(modalEl);
      const input = modalEl.querySelector('input') || modalEl.querySelector('textarea') || null;

      this.setEventListeners(modalEl, input);

      modal.show();
    },

    close() {
      const modalEl = this.$refs.modal;
      const modal = Modal.getInstance(modalEl);
      modal.hide();
    }
  },

  mounted() {
    this.open();
  }
}
</script>
<template>
  <div ref="modal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" @keyup.esc="close()">
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
          <button type="button" @click="close()" class="btn btn-outline-secondary">{{ this.$t('common.cancel')
          }}</button>
          <slot name="buttons"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'

export default {
  methods: {
    addEventListeners(modalEl, input) {
      modalEl.addEventListener('shown.bs.modal', () => {
        this.$nextTick(() => {
          if (input) input.focus();
        })
      });

      modalEl.addEventListener('hidden.bs.modal', () => {
        this.$emit('close');
      });
    },

    open() {
      const modalEl = this.$refs.modal;
      const modal = new Modal(modalEl);
      const input = modalEl.querySelector('input') || modalEl.querySelector('textarea') || null;

      this.addEventListeners(modalEl, input);
      modal.show();
    },

    close() {
      const modalEl = this.$refs.modal;
      const modal = Modal.getInstance(modalEl);

      modal.hide();
      this.$emit('close');
    }
  },

  mounted() {
    this.open();
  },

  beforeUnmount() {
    this.close();
  }
}
</script>
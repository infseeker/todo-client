<template>
  <modal>
    <template v-slot:title>
      {{ this.$t('list.saving') }}
    </template>

    <template v-slot:content>
      <div class="mb-3">
        <span>{{ this.$t('list.haveUnsaved') }}</span>
      </div>

      <div class="form-password-toggle">
        <div class="input-group input-group-merge">
          <input @keypress.enter="save(title)" v-model.trim="title" type="text"
            :placeholder="this.$t('list.placeholder')" class="form-control" />
        </div>
      </div>

      <!-- If you need hide this modal on login, you can uncomment this sector -->
      <!-- <div class="form-check">
        <input v-model="notAsk" @change="doNotAsk(notAsk)" class="form-check-input" type="checkbox" id="do-not-ask">
        <label class="form-check-label" for="do-not-ask">
          {{ this.$t('list.doNotAsk') }}
        </label>
      </div> -->
    </template>

    <template v-slot:buttons>
      <button :disabled="isDisabled" @click="save(title)" type="button" class="btn btn-danger">
        {{ this.$t('common.save') }}
      </button>
    </template>
  </modal>
</template>

<script>
import Modal from '../common/Modal.vue'
import List from '../../models/List'
import ListService from '../../services/ListService'

export default {
  data() {
    return {
      title: '',
      isDisabled: false,
      notAsk: false,
    }
  },

  components: {
    Modal
  },

  methods: {
    doNotAsk(notAsk) {
      localStorage.setItem('hideUnsavedListModal', notAsk);
    },

    save(title) {
      if (!title) {
        this.$toast.warning(this.$t('list.placeholder'));
        return;
      }

      const listItems = JSON.parse(localStorage.getItem('listItems'));
      if (!listItems) {
        this.$toast.warning(this.$t('list.nothingToSave'));
        this.$emit('close');
        return;
      };

      listItems.forEach((el, i) => el.position = i + 1);

      ListService.createList(title, listItems).then((r) => {
        this.$loader.hide();
        this.isDisabled = false;

        if (r.code === 200) {
          this.$store.lists.push(new List(r.data));
          localStorage.removeItem('listItems');

          this.$toast.success(this.$t('list.saved', [title]));
          this.$emit('close');
        } else {
          this.$toast.error(this.$t('list.savingFailed'));
        }
      });
    }
  }
}
</script>
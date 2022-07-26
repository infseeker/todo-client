<template>
  <div class="list-deletion-modal">
    <div ref="listDeletionModal" class="modal fade" id="listDeletionModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Удаление списка #{{ list.id }}</h5>

            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col mb-3">
                <span class="lh-2">
                  Вы уверены, что хотите удалить список 
                  <mark>{{ list.title }}</mark> 
                  и всё его содержимое?</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>
            <button @click="$emit('deleteList', list)" type="button" class="btn btn-danger"
              data-bs-dismiss="modal">Удалить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['list'],
}
</script>
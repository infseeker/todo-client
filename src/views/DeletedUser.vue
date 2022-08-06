<template>
  <div class="deleted-user authentication-wrapper authentication-basic container-p-y">
    <div class="authentication-inner">
      <div class="card">
        <div class="card-body">
          <h4 class="mb-4">Удалённая учётная запись</h4>
          <p>
            Ваша учётная запись была удалена. Хотите восстановить доступ?
          </p>

          <div class="mb-3">
            <router-link :to="{ name: 'restoration-email' }" class="btn btn-primary w-100">Восстановить доступ
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    if (!this.$user.isDeleted) {
      this.$router.push({ name: 'restoration-email' })
    }
  }
}
</script>
<template>
  <div class="layout-auth">
    <main class="auth-content">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;

.layout-auth {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: $bg;
  padding: 24px 20px;
}

.auth-content {
  width: 100%;
}
</style>

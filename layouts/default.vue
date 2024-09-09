<template>
  <div class="app-wrapper">
    <header class="glass-header">
      <NuxtLink to="/" class="header-title">
        News Feed App
      </NuxtLink>
    </header>

    <v-main class="main-content">
      <slot />
    </v-main>
  </div>
</template>

<script setup>

</script>

<style>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.glass-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px; /* Adjust this value as needed */
  display: flex;
  align-items: center;
  padding: 0 16px;
  background-color: rgba(235, 235, 235, 0.7);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
}

.header-title {
  text-decoration: none;
  color: rgba(0, 0, 0, 0.87);
  font-size: 1.25rem;
  font-weight: 500;
}

.header-title:hover {
  opacity: 0.8;
}

.main-content {
  padding-top: 80px; /* Increased from 64px to add more space */
}

/* For webkit browsers like Chrome and Safari */
@supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
  .glass-header {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
}
</style>
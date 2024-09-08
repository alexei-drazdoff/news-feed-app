<!-- layouts/default.vue -->
<template>
  <v-app>
    <v-app-bar app :elevation="0" class="glass-header">
      <v-toolbar-title>
        <NuxtLink to="/" class="header-title">
          News Feed App
        </NuxtLink>
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
// You can add any layout-specific logic here
</script>

<style scoped>
.glass-header {
  background-color: rgba(235, 235, 235, 0.7) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

/* For webkit browsers like Chrome and Safari */
@supports (-webkit-backdrop-filter: none) {
  .glass-header {
    -webkit-backdrop-filter: blur(10px);
  }
}

/* Optional: Change text color for better contrast */
.glass-header .v-toolbar-title {
  color: rgba(0, 0, 0, 0.87);
}

.header-title {
  text-decoration: none;
  color: inherit;
}

.header-title:hover {
  opacity: 0.8;
}
</style>
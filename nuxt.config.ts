export default defineNuxtConfig({
  // Remove this line if you're importing styles in the plugin
  // css: ['vuetify/lib/styles/main.sass'],

  build: {
    transpile: ['vuetify'],
  },

  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    // Add this to ensure Vuetify styles are processed correctly
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: '@use "vuetify/styles" as *\n',
        },
      },
    },
  },

  plugins: ['@/plugins/vuetify'],

  // Add this to ensure ssr compatibility
  ssr: true,

  compatibilityDate: '2024-09-07',
})
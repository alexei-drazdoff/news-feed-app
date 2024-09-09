export default defineNuxtConfig({
  ssr: true,
  modules: ['@pinia/nuxt', '@nuxt/image'],
  build: {
    transpile: ['vuetify'],
  },

  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: '@use "vuetify/styles" as *\n',
        },
      },
    },
  },

  plugins: ['@/plugins/vuetify'],
  compatibilityDate: '2024-09-07',
  runtimeConfig: {
    apiRetries: parseInt(process.env.API_RETRIES!, 10),
    apiRetryDelay: parseInt(process.env.API_RETRY_DELAY!, 10),
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      newsRssUrl: process.env.NEWS_RSS_URL,
      apiTimeout: parseInt(process.env.API_TIMEOUT!, 10),
    }
  },
})
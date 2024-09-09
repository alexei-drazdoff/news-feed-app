// plugins/vuetify.js
import { createVuetify } from 'vuetify'
import { VApp, VBtn, VIcon, VContainer, VCard, VCardText, VCardTitle, VCardSubtitle, VProgressCircular, VCarousel, VCarouselItem, VImg, VRow, VChip, VChipGroup, VDialog, VSpacer, VCol, VTextField, VDatePicker, VPagination, VAlert, VMain } from 'vuetify/components'
import { Ripple } from 'vuetify/directives'
import { ru } from 'vuetify/locale'

// Ensure styles are imported
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components: {
      VApp,
      VMain,
      VBtn,
      VIcon,
      VContainer,
      VCard,
      VCardText,
      VCardTitle,
      VCardSubtitle,
      VProgressCircular,
      VCarousel,
      VCarouselItem,
      VImg,
      VRow,
      VChip,
      VChipGroup,
      VDialog,
      VSpacer,
      VCol,
      VTextField,
      VDatePicker,
      VPagination,
      VAlert
    },
    directives: {
      Ripple
    },
    theme: {
      defaultTheme: 'light'
    },
    locale: {
      locale: 'ru',
      messages: { ru }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
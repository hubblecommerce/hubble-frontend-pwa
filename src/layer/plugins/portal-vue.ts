import PortalVue from 'portal-vue'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PortalVue)
})

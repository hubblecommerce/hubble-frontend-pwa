import { destr } from 'destr'
import { storeToRefs } from 'pinia'
import { useCart, useLocalisation, defineNuxtRouteMiddleware, useNuxtApp } from '#imports'
import { hblGetRequestCookie } from '@/utils/helper'

export default defineNuxtRouteMiddleware((to, from) => {
    const app = useNuxtApp()
    const cartStore = useCart()
    const { miniCart } = storeToRefs(cartStore)
    const { navigateToI18n } = useLocalisation(to)

    if (import.meta.server) {
        const serverCookie = app.$config.public.cartCookie as { name: string, options: any }
        const cookie = hblGetRequestCookie(app, serverCookie.name)
        // https://v3.nuxtjs.org/api/composables/use-cookie/#decode
        if (cookie != null) {
            miniCart.value = destr(decodeURIComponent(cookie))
        }
    }

    if (miniCart.value?.qty != null && miniCart.value?.qty > 0) {
        return true
    }

    return navigateToI18n('/cart')
})

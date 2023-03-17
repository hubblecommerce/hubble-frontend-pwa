import destr from 'destr'
import { defineNuxtRouteMiddleware, useNuxtApp, navigateTo } from '#app'
import { storeToRefs } from 'pinia'
import { useCart } from '#imports'
import { hblGetRequestCookie } from '@/utils/helper'

export default defineNuxtRouteMiddleware(() => {
    const app = useNuxtApp()
    const cartStore = useCart()
    const { miniCart } = storeToRefs(cartStore)

    if (process.server) {
        const cookie = hblGetRequestCookie(app, app.$config.public.cartCookie.name)
        // https://v3.nuxtjs.org/api/composables/use-cookie/#decode
        if (cookie != null) {
            miniCart.value = destr(decodeURIComponent(cookie))
        }
    }

    if (miniCart.value?.qty != null && miniCart.value?.qty > 0) {
        return true
    }

    return navigateTo('/cart')
})

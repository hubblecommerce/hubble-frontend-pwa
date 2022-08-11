import destr from 'destr'
import { defineNuxtRouteMiddleware, useNuxtApp, navigateTo } from '#app'
import { useCart } from '#imports'
import { getRequestCookie } from '@hubblecommerce/hubble/commons'

export default defineNuxtRouteMiddleware(() => {
    const app = useNuxtApp()
    const { miniCart } = useCart()

    if (process.server) {
        const cookie = getRequestCookie(app, app.$config.public.cartCookie.name)
        // https://v3.nuxtjs.org/api/composables/use-cookie/#decode
        miniCart.value = destr(decodeURIComponent(cookie))
    }

    if (miniCart.value?.qty > 0) {
        return true
    }

    return navigateTo('/cart')
})

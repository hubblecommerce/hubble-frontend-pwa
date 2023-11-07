import { destr } from 'destr'
import { CookieOptions, defineNuxtRouteMiddleware, useNuxtApp } from '#imports'
import { storeToRefs } from 'pinia'
import { useCart, useLocalisation } from '#imports'
import { hblGetRequestCookie } from '@/utils/helper'

export default defineNuxtRouteMiddleware((to, from) => {
    const app = useNuxtApp()
    const cartStore = useCart()
    const { miniCart } = storeToRefs(cartStore)
    const { navigateToI18n } = useLocalisation(to)

    if (process.server) {
        const serverCookie = app.$config.public.cartCookie as { name: string, options: CookieOptions }
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

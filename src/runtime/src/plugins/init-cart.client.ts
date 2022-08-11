import { defineNuxtPlugin, useRuntimeConfig, useCookie } from '#app'
import { useCart } from '#imports'

export default defineNuxtPlugin(() => {
    const { cartCookie } = useRuntimeConfig()
    const cookie = useCookie(cartCookie.name)

    if (cookie.value === undefined) {
        return
    }

    const { miniCart } = useCart()
    // @ts-ignore
    miniCart.value = cookie.value
})

import { defineNuxtPlugin, useRuntimeConfig, useCookie } from '#app'
import { storeToRefs } from 'pinia'
import { useCart } from '#imports'

export default defineNuxtPlugin(() => {
    const { cartCookie } = useRuntimeConfig().public
    const cookie = useCookie(cartCookie.name)

    if (cookie.value === undefined) {
        return
    }

    const cartStore = useCart()
    const { miniCart } = storeToRefs(cartStore)

    // @ts-ignore
    miniCart.value = cookie.value
})

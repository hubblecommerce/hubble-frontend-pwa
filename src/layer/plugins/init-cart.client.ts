import { storeToRefs } from 'pinia'
import { defineNuxtPlugin, useRuntimeConfig, useCookie, useCart } from '#imports'

export default defineNuxtPlugin(() => {
    const { cartCookie }: any = useRuntimeConfig().public
    const cookie = useCookie(cartCookie.name)

    if (cookie.value === undefined) {
        return
    }

    const cartStore = useCart()
    const { miniCart } = storeToRefs(cartStore)

    // @ts-ignore
    miniCart.value = cookie.value
})

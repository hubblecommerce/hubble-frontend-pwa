import { defineNuxtPlugin, useRuntimeConfig, useCookie } from '#app'
import { storeToRefs } from 'pinia'
import { useWishlist } from '#imports'

export default defineNuxtPlugin(() => {
    const { wishlistCookie } = useRuntimeConfig().public
    const cookie = useCookie(wishlistCookie.name)

    if (cookie.value === undefined) {
        return
    }

    const cartStore = useWishlist()
    const { miniWishlist } = storeToRefs(cartStore)

    // @ts-ignore
    miniWishlist.value = cookie.value
})

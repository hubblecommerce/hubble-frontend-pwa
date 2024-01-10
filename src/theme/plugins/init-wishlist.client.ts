import { storeToRefs } from 'pinia'
import { defineNuxtPlugin, useRuntimeConfig, useCookie, useWishlist } from '#imports'

export default defineNuxtPlugin(() => {
    const { wishlistCookie }: any = useRuntimeConfig().public
    const cookie = useCookie(wishlistCookie.name)

    if (cookie.value === undefined) {
        return
    }

    const cartStore = useWishlist()
    const { miniWishlist } = storeToRefs(cartStore)

    // @ts-ignore
    miniWishlist.value = cookie.value
})

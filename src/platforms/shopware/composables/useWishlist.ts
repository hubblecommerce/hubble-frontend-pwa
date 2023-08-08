import { Ref, ref, watch } from 'vue'
import { CookieOptions, useCookie, useRuntimeConfig } from '#app'
import { defineStore, storeToRefs } from 'pinia'
import { hblMapWishlist, useCustomer, useNotification } from '#imports'
import { HblWishlist, HblIUseWishlist, HblProduct } from '@/utils/types'
import { WishlistShopware } from '@hubblecommerce/hubble/platforms/shopware/api-client'

export const useWishlist = defineStore('use-wishlist', (): HblIUseWishlist => {
    const wishlist: Ref<HblWishlist | null> = ref(null)
    const miniWishlist: Ref<string[]> = ref([])

    const { wishlistCookie } = useRuntimeConfig().public as { wishlistCookie: { name: string, options: CookieOptions } }
    const error: Ref = ref(false)
    const loading: Ref<boolean> = ref(false)
    const { showNotification } = useNotification()

    async function getWishlist (): Promise<HblWishlist | void> {
        loading.value = true
        error.value = false

        try {
            // @ts-ignore
            const response = await WishlistShopware.readCustomerWishlist()

            const mappedData = hblMapWishlist(response)
            wishlist.value = mappedData
            loading.value = false

            return mappedData
        } catch (e) {
            handleWishlistApiError(e)
        }
    }

    async function addToWishlist (productId: string): Promise<void> {
        error.value = false
        loading.value = true

        try {
            await WishlistShopware.addProductOnWishlist(productId)

            // update wishlist because endpoint doesn't answer with the new wishlist
            // @ts-ignore
            const response = await WishlistShopware.readCustomerWishlist()
            wishlist.value = hblMapWishlist(response)

            showNotification('Product added to wishlist', 'success')
            loading.value = false
        } catch (e) {
            handleWishlistApiError(e)
            showNotification(error.value, 'error')
        }
    }

    async function removeFromWishlist (productId: string): Promise<void> {
        error.value = false
        loading.value = true

        try {
            await WishlistShopware.deleteProductOnWishlist(productId)

            // update wishlist because endpoint doesn't answer with the new wishlist
            // @ts-ignore
            const response = await WishlistShopware.readCustomerWishlist()
            wishlist.value = hblMapWishlist(response)

            showNotification('Product removed from wishlist', 'success')
            loading.value = false
        } catch (e) {
            handleWishlistApiError(e)
            showNotification(error.value, 'error')
        }
    }

    function handleWishlistApiError (e) {
        if (e.statusCode === 404) {
            wishlist.value = null
        } else if (e.statusCode === 403) {
            const customerStore = useCustomer()
            const { customer } = storeToRefs(customerStore)

            if (customer.value !== null) {
                error.value = 'Wishlist is currently not available'
            } else {
                error.value = 'Login to create your own wishlist'
            }
            clearWishlist()
        } else {
            error.value = e
        }
        loading.value = false
    }

    function saveWishlist (): void {
        const cookie = useCookie(wishlistCookie.name, wishlistCookie.options)
        miniWishlist.value = wishlist.value ? wishlist.value?.products?.map((product: HblProduct) => product.id) : []

        // @ts-ignore
        cookie.value = miniWishlist.value
    }

    function clearWishlist (): void {
        wishlist.value = []
        miniWishlist.value = []
    }

    watch(wishlist, (value, oldValue, onCleanup) => {
        saveWishlist()
    })

    return {
        wishlist,
        miniWishlist,
        getWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        loading,
        error
    }
})

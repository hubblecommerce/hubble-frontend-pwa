import { type Ref, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { CartShopware } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { useNotification, usePlatform, hblMapCart, hblCartIncludes, hblMapMiniCart, useCookie, useRuntimeConfig } from '#imports'
import { type HblCart, type HblIUseCart, type HblMiniCart, type HblLineItem, type MiniCartItem } from '../types'

export const useCart = defineStore('use-cart', (): HblIUseCart => {
    const cart: Ref<HblCart | null> = ref(null)
    const miniCart: Ref<HblMiniCart | null> = ref(null)

    const { cartCookie } = useRuntimeConfig().public as { cartCookie: { name: string, options: any } }
    const error: Ref = ref(false)
    const loading: Ref<boolean> = ref(false)
    const { setSessionToken } = usePlatform()
    const { showNotification } = useNotification()

    async function getCart (): Promise<HblCart | void> {
        loading.value = true
        error.value = false

        try {
            // @ts-ignore
            const response = await CartShopware.readCart({
                includes: hblCartIncludes
            })

            if (response.token !== undefined) {
                setSessionToken(response.token)
            }

            const mappedData = hblMapCart(response)
            cart.value = mappedData
            loading.value = false

            return mappedData
        } catch (e) {
            loading.value = false
            error.value = e
        }
    }

    async function deleteCart (): Promise<void> {
        error.value = false
        loading.value = true

        try {
            await CartShopware.deleteCart()
            cart.value = null
            loading.value = false
        } catch (e) {
            loading.value = false
            error.value = e
        }
    }

    async function removeLineItem (id: string): Promise<HblCart | void> {
        error.value = false
        loading.value = true

        try {
            const items = []
            items.push(id)

            const response = await CartShopware.removeLineItem({ ids: items })

            if (response.token !== undefined) {
                setSessionToken(response.token)
            }

            const mappedData = hblMapCart(response)
            cart.value = mappedData
            showNotification('Product removed from cart', 'success')
            loading.value = false

            return mappedData
        } catch (e) {
            loading.value = false
            error.value = e
        }
    }

    function updateLineItem (lineItem: HblLineItem | MiniCartItem, updatedQty: number) {
        return CartShopware.updateLineItem(
            {
                includes: hblCartIncludes,
                items: [
                    // @ts-ignore
                    {
                        id: lineItem.id,
                        quantity: updatedQty
                    }
                ]
            }
        )
    }

    function addLineItem (itemId: string, qty: number) {
        return CartShopware.addLineItem(
            {
                items: [
                    {
                        id: itemId,
                        type: 'product',
                        quantity: qty
                    }
                ]
            }
        )
    }

    async function addToCart (qty: number, itemId: string): Promise<HblCart | void> {
        error.value = false
        loading.value = true

        try {
            const response = await addLineItem(itemId, qty)

            if (response.token !== undefined) {
                setSessionToken(response.token)
            }

            const mappedData = hblMapCart(response)
            cart.value = mappedData
            showNotification('Product added to cart', 'success')
            loading.value = false

            return mappedData
        } catch (e) {
            loading.value = false
            error.value = e
        }
    }

    function saveCart (): void {
        miniCart.value = cart.value != null ? hblMapMiniCart(cart.value) : null

        const cookie = useCookie(cartCookie.name, cartCookie.options)
        // @ts-ignore
        cookie.value = miniCart.value
    }

    async function addCoupon (code: string): Promise<HblCart | void> {
        error.value = false
        loading.value = true

        try {
            code = code.trim()

            if (code === '') {
                loading.value = false
                return
            }

            const response = await CartShopware.addLineItem(
                {
                    includes: hblCartIncludes,
                    items: [
                        // @ts-ignore
                        {
                            type: 'promotion',
                            referencedId: code
                        }
                    ]
                }
            )

            if (response.errors != null) {
                Object.keys(response.errors).forEach((key) => {
                    if (!key.includes('promotion-discount-added')) {
                        // @ts-ignore
                        throw new Error(response?.errors[key].message)
                    }
                })
            }

            if (response.token !== undefined) {
                setSessionToken(response.token)
            }

            if (response.lineItems?.length === 0) {
                loading.value = false
                return
            }

            const mappedData = hblMapCart(response)
            cart.value = mappedData
            showNotification('Coupon added to cart', 'success')
            loading.value = false

            return mappedData
        } catch (e) {
            loading.value = false
            error.value = e
        }
    }

    watch(cart, (value, oldValue, onCleanup) => {
        saveCart()
    })

    return {
        cart,
        miniCart,
        getCart,
        deleteCart,
        addToCart,
        removeLineItem,
        addCoupon,
        loading,
        error
    }
})

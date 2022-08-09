import { Ref, ref } from 'vue'
import { useCookie, useRuntimeConfig } from '#app'
import { useNotification, usePlatform } from '#imports'
import { Cart, IUseCart, MiniCart } from '@hubblecommerce/hubble/commons'
import type { CartItems } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { Cart as SwCart, CartShopware } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { mapCart, mapMiniCart } from '@hubblecommerce/hubble/platforms/shopware/api-client/utils'

const cart: Ref<Cart | null> = ref(null)
const miniCart: Ref<MiniCart | null> = ref(null)

export const useCart = function (): IUseCart {
    const { cartCookie } = useRuntimeConfig()
    const error: Ref<boolean | string> = ref(false)
    const loading: Ref<boolean> = ref(false)
    const { setSessionToken } = usePlatform()
    const { showNotification } = useNotification()

    async function getCart (): Promise<Cart> {
        loading.value = true
        error.value = false

        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const { data } = await CartShopware.readCart()

            if (data.value.token !== undefined) {
                setSessionToken(data.value.token)
            }

            loading.value = false
            return updateCart(data.value)
        } catch (e) {
            loading.value = false
            error.value = e
            return e
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
            return e
        }
    }

    async function addToCart (qty: number, itemId: string): Promise<Cart> {
        error.value = false
        loading.value = true

        try {
            const lineItem = miniCart.value?.items.find((item) => {
                return item.itemId === itemId
            })

            if (lineItem) {
                const updatedQty = lineItem.qty + qty

                const requestBody: CartItems = {
                    items: [
                        {
                            id: lineItem.id,
                            quantity: updatedQty
                        }
                    ]
                }

                // @ts-ignore
                const { data, pending, refresh } = await CartShopware.updateLineItem('application/json', 'application/json', requestBody)

                if (data.value.token !== undefined) {
                    setSessionToken(data.value.token)
                }

                loading.value = false

                showNotification('Updated item in cart', 'success')

                return updateCart(data.value)
            } else {
                const requestBody: CartItems = {
                    items: [
                        {
                            type: 'product',
                            referencedId: itemId,
                            quantity: qty
                        }
                    ]
                }

                // @ts-ignore
                const { data, pending, refresh } = await CartShopware.addLineItem('application/json', 'application/json', requestBody)

                if (data.value.token !== undefined) {
                    setSessionToken(data.value.token)
                }

                loading.value = false

                showNotification('Product added to cart', 'success')

                return updateCart(data.value)
            }
        } catch (e) {
            loading.value = false
            error.value = e
            return e
        }
    }

    function updateCart (swCart: SwCart): Cart {
        cart.value = mapCart(swCart)
        miniCart.value = mapMiniCart(cart.value)

        const cookie = useCookie(cartCookie.name, cartCookie.options)
        // @ts-ignore
        cookie.value = miniCart.value

        return cart.value
    }

    return {
        cart,
        miniCart,
        getCart,
        deleteCart,
        addToCart,
        loading,
        error
    }
}

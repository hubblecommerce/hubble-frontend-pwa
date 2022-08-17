import { Ref, ref, watch } from 'vue'
import { useCookie, useRuntimeConfig } from '#app'
import { useNotification, usePlatform } from '#imports'
import { Cart, IUseCart, MiniCart } from '@hubblecommerce/hubble/commons'
import { CartShopware } from '@hubblecommerce/hubble/platforms/shopware/api-client'
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
            // @ts-ignore
            const response = await CartShopware.readCart()

            if (response.token !== undefined) {
                setSessionToken(response.token)
            }

            const mappedData = mapCart(response)
            cart.value = mappedData
            loading.value = false

            return mappedData
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

    async function removeLineItem (id: string): Promise<Cart> {
        error.value = false
        loading.value = true

        try {
            const items = []
            items.push(id)

            const response = await CartShopware.removeLineItem(items)

            if (response.token !== undefined) {
                setSessionToken(response.token)
            }

            const mappedData = mapCart(response)
            cart.value = mappedData
            showNotification('Product removed from cart', 'success')
            loading.value = false

            return mappedData
        } catch (e) {
            loading.value = false
            error.value = e
            return e
        }
    }

    function updateLineItem (lineItem, updatedQty) {
        return CartShopware.updateLineItem(
            'application/json',
            'application/json',
            {
                items: [
                    {
                        id: lineItem.id,
                        quantity: updatedQty
                    }
                ]
            }
        )
    }

    function addLineItem (itemId, qty) {
        return CartShopware.addLineItem(
            'application/json',
            'application/json',
            {
                items: [
                    {
                        type: 'product',
                        referencedId: itemId,
                        quantity: qty
                    }
                ]
            }
        )
    }

    async function addToCart (qty: number, itemId: string): Promise<Cart> {
        error.value = false
        loading.value = true

        try {
            const lineItem = miniCart.value?.items.find((item) => {
                return item.itemId === itemId
            })

            const updatedQty = lineItem ? lineItem.qty + qty : null

            const response = lineItem ? await updateLineItem(lineItem, updatedQty) : await addLineItem(itemId, qty)

            if (response.token !== undefined) {
                setSessionToken(response.token)
            }

            const mappedData = mapCart(response)
            cart.value = mappedData
            showNotification('Product added to cart', 'success')
            loading.value = false

            return mappedData
        } catch (e) {
            loading.value = false
            error.value = e
            return e
        }
    }

    function saveCart (): void {
        miniCart.value = cart.value != null ? mapMiniCart(cart.value) : null

        const cookie = useCookie(cartCookie.name, cartCookie.options)
        // @ts-ignore
        cookie.value = miniCart.value
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
        loading,
        error
    }
}

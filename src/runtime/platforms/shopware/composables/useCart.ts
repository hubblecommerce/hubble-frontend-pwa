import { Ref, ref } from 'vue'
import { usePlatform } from '#imports'
import { Cart, IUseCart } from '@hubblecommerce/hubble/commons'
import type { Cart as CartSw } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { CartShopware } from '@hubblecommerce/hubble/platforms/shopware/api-client'

const cart: Ref<Cart | null> = ref(null)

function mapCart (cart: CartSw): Cart {
    return {
        name: cart.name,
        qty: 0
    }
}

export const useCart = function (): IUseCart {
    const error: Ref<boolean> = ref(false)
    const loading: Ref<boolean> = ref(false)
    const { setSessionToken } = usePlatform()

    async function getCart (): Promise<Cart> {
        loading.value = true
        error.value = false

        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const { data } = await CartShopware.readCart()
            const mappedData = mapCart(data.value)
            cart.value = mappedData

            if (data.value.token !== undefined) {
                setSessionToken(data.value.token)
            }

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

    return {
        cart,
        getCart,
        deleteCart,
        loading,
        error
    }
}

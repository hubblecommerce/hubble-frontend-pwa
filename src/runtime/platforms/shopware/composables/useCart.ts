import { Ref, ref } from 'vue'
import { usePlatform } from '#imports'
import { Cart, IUseCart } from '../../../commons'
import type { Cart as CartSw } from '../api-client/generated'
import { CartShopware } from '../api-client/generated'

const cart: Ref<Cart | null> = ref(null)
const error: Ref<boolean> = ref(false)
const loading: Ref<boolean> = ref(false)

function mapCart (cart: CartSw): Cart {
    return {
        name: cart.name,
        qty: 0
    }
}

export const useCart = function (): IUseCart {
    const { setSessionToken } = usePlatform()

    async function getCart (): Promise<Cart> {
        loading.value = true
        error.value = false

        try {
            const response = await CartShopware.readCart()
            const mappedData = mapCart(response)
            cart.value = mappedData

            if (response.token !== undefined) {
                setSessionToken(response.token)
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

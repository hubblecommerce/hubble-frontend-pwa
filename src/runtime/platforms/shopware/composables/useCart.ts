import { ref } from 'vue'
import { Cart, IUseCart } from '@hubblecommerce/hubble/commons'
import { useCartStore } from '../../../src/store/useCartStore'
import type { Cart as CartSw } from '../api-client/generated'
import { CartShopware } from '../api-client/generated'

const loading = ref(false)
const error = ref(false)

function mapCart (cart: CartSw): Cart {
    return {
        name: cart.name,
        qty: 0
    }
}

async function getCart (): Promise<Cart> {
    error.value = false
    loading.value = true

    try {
        const response = await CartShopware.readCart()
        const mappedData = mapCart(response)

        const cartStore = useCartStore()
        cartStore.setCartData(mappedData)

        loading.value = false
        return mappedData
    } catch (e) {
        loading.value = false
        error.value = e
        return e
    }
}

export const useCart = function (): IUseCart {
    const cartStore = useCartStore()
    const cart = ref(cartStore.data)

    return {
        cart,
        getCart,
        loading,
        error
    }
}

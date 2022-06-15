import { ref } from 'vue'
import { Cart } from '@hubblecommerce/hubble/runtime/commons'
import { useCartStore } from '@hubblecommerce/hubble/runtime/src/store/cart'
import type { Cart as CartSw } from '../api-client/generated'
import { CartShopware } from '../api-client/generated'

function mapCart (cart: CartSw): Cart {
    return {
        name: cart.name,
        qty: 0
    }
}

export const useCart = function () {
    const cartStore = useCartStore()
    const cart = ref(cartStore.data)

    return {
        cart,
        getCart
    }
}

const getCart = async (): Promise<Cart> => {
    const response = await CartShopware.readCart()
    const cartStore = useCartStore()
    const mappedData = mapCart(response)

    cartStore.setCartData(mappedData)

    return mapCart(mappedData)
}

import { ref } from 'vue'
import { Cart, IUseCart } from '@hubblecommerce/hubble/runtime/commons'
import { useCartStore } from '@hubblecommerce/hubble/runtime/src/store/useCartStore'
import type { Cart as CartSw } from '../api-client/generated'
import { CartShopware } from '../api-client/generated'

function mapCart (cart: CartSw): Cart {
    return {
        name: cart.name,
        qty: 0
    }
}

async function getCart (): Promise<Cart> {
    const response = await CartShopware.readCart()
    const cartStore = useCartStore()
    const mappedData = mapCart(response)

    cartStore.setCartData(mappedData)

    return mapCart(mappedData)
}

export const useCart = function (): IUseCart {
    const cartStore = useCartStore()
    const cart = ref(cartStore.data)

    return {
        cart,
        getCart
    }
}

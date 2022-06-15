import { defineStore } from 'pinia'
import { Cart } from '../../commons'

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useCartStore = defineStore('cartStore', {
    state: () => {
        return {
            data: undefined as Cart | undefined
        }
    },
    actions: {
        setCartData<Cart> (data: Cart) {
            this.data = data
        }
    }
})

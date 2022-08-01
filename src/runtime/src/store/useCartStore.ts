import { defineStore } from 'pinia'
import { Cart } from '@hubblecommerce/hubble/commons'

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

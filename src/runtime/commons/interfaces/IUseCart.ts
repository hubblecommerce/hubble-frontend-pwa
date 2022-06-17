import { Ref } from 'vue'
import { Cart } from './Cart'

export interface IUseCart {
    cart: Ref<Cart>,
    getCart(): Promise<Cart>
}

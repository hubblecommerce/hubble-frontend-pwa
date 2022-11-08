import { Ref } from 'vue'
import { Cart } from './Cart'
import { MiniCart } from './MiniCart'

export interface IUseCart {
    cart: Ref<Cart | null>,
    miniCart: Ref<MiniCart | null>,
    getCart(): Promise<Cart | void>,
    deleteCart(): Promise<void>,
    loading: Ref<boolean>,
    error: Ref,
    addToCart(qty: number, productId: string): Promise<Cart | void>,
    removeLineItem(id: string): Promise<Cart | void>,
    addCoupon (code: string): Promise<Cart | void>
}

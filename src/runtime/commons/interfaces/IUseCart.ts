import { Ref } from 'vue'
import { Cart } from './Cart'
import { MiniCart } from './MiniCart'

export interface IUseCart {
    cart: Ref<Cart | null>,
    miniCart: Ref<MiniCart | null>,
    getCart(): Promise<Cart>,
    deleteCart(): Promise<void>,
    loading: Ref<boolean>,
    error: Ref<boolean | string>,
    addToCart(qty: number, productId: string): Promise<Cart>,
    removeLineItem(id: string): Promise<Cart>,
    addCoupon (code: string): Promise<Cart>
}

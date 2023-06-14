import { Ref } from 'vue'
import { HblCart } from '@/utils/types/HblCart'
import { HblMiniCart } from '@/utils/types/HblMiniCart'

export interface HblIUseCart {
    cart: Ref<HblCart | null>,
    miniCart: Ref<HblMiniCart | null>,
    getCart(): Promise<HblCart | void>,
    deleteCart(): Promise<void>,
    loading: Ref<boolean>,
    error: Ref,
    addToCart(qty: number, productId: string): Promise<HblCart | void>,
    removeLineItem(id: string): Promise<HblCart | void>,
    addCoupon (code: string): Promise<HblCart | void>
}

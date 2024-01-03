import { type Ref } from 'vue'
import { type HblWishlist } from '@/utils/types/HblWishlist'

export interface HblIUseWishlist {
    wishlist: Ref<HblWishlist | null>,
    miniWishlist: Ref<string[]>,
    getWishlist (): Promise<HblWishlist | void>,
    addToWishlist (productId: string): Promise<void>,
    removeFromWishlist (productId: string): Promise<void>,
    clearWishlist (): void,
    loading: Ref<boolean>,
    error: Ref,
}

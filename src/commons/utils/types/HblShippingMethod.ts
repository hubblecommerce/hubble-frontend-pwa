import { HblMedia } from '@/utils/types/HblMedia'

export interface HblShippingMethod {
    id: string,
    position: number,
    name: string,
    deliveryTime?: string,
    description?: string,
    media?: HblMedia,
    price: number,
    tax?: number
}

import { HblMedia } from '@/utils/types/HblMedia'

export interface HblPaymentMethod {
    id: string,
    code: string,
    name: string,
    position: number,
    description?: string,
    media?: HblMedia,
    synchronous?: boolean,
    asynchronous?: boolean
}

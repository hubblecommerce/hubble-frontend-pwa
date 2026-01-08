import { type HblMedia } from './HblMedia'

export interface HblCategory {
    id: string,
    active: boolean,
    name: string,
    media: HblMedia,
    description: string,
    metaTitle: string,
    metaDescription: string,
    url: string,
    pathInfo: string
}

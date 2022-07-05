import { Media } from './Media'

export interface Category {
    id: string,
    active: boolean,
    name: string,
    media: Media,
    description: string,
    metaTitle: string,
    metaDescription: string
}

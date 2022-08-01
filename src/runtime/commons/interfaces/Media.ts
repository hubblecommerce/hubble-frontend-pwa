export interface Thumbnail {
    id?: string,
    width: number,
    height: number,
    url?: string
}

export interface Media {
    id?: string,
    alt: string,
    position?: number,
    title: string,
    url: string,
    thumbnails: Thumbnail[]
}

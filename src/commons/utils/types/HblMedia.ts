export interface HblThumbnail {
    id?: string,
    width: number,
    height: number,
    url?: string
}

export interface HblMedia {
    id?: string,
    alt: string,
    position?: number,
    title: string,
    url: string,
    thumbnails: HblThumbnail[]
}

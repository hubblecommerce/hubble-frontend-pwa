import { Category } from './Category'
import { Product } from './Product'

export interface Slot {
    type?: string
    slot?: string
    data: any
}

export interface Block {
    id: string
    type?: string
    cssClass?: string
    slots: Slot[]
}

export interface Section {
    id: string
    type?: string
    cssClass?: string
    blocks: Block[]
}

export type PageType = 'category' | 'detail' | 'cms'

export interface BreadcrumbItem {
    name: string,
    path: string
}

export interface Breadcrumb {
    [key: string]: BreadcrumbItem
}

export interface Page {
    id: string,
    canonicalUrl?: string,
    type: PageType,
    structure: Section[],
    breadcrumb?: Breadcrumb,
    product?: Product,
    category?: Category,
}

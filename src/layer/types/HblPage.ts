import { type HblCategory } from './HblCategory'
import { type HblProduct } from './HblProduct'
import { type HblMedia } from './HblMedia'
import { type HblCms } from './HblCms'
import { type HblProductListing } from './HblProductListing'

export interface HblSlot {
    type?: string
    position?: string
    data: Record<string, unknown> | string,
    productListing?: HblProductListing | null,
    media?: HblMedia | null
}

export interface HblBlock {
    id: string
    sectionPosition?: string | 'main' | 'sidebar'
    type: string
    cssClass?: string | null
    backgroundColor?: string | null
    backgroundMedia?: HblMedia | null
    backgroundMediaMode?: string | null
    slots: HblSlot[]
}

export interface HblSection {
    type: string | 'default' | 'sidebar'
    sizingMode: string | 'boxed' | 'fullwidth'
    cssClass?: string | null
    backgroundColor?: string | null
    backgroundMedia?: HblMedia | null
    backgroundMediaMode?: string | null
    mobileSidebarBehavior?: string | 'wrap' | 'hidden'
    blocks: HblBlock[]
}

export type HblPageType = 'category' | 'detail' | 'cms'

export interface HblBreadcrumbItem {
    name: string,
    path: string
}

export interface HblBreadcrumb {
    [key: string]: HblBreadcrumbItem
}

export interface HblPage {
    id: string,
    canonicalUrl?: string,
    type: HblPageType,
    structure: HblSection[] | null,
    breadcrumb?: HblBreadcrumb,
    detail?: HblProduct,
    category?: HblCategory,
    cms?: HblCms,
}

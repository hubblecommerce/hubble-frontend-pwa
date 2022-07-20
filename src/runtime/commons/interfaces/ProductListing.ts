import { Product } from './Product'

export interface ProductListing {
    products: Product[]
    currentSorting?: string,
    availableSorting?: any,
    currentFilters?: any,
    availableFilters?: any,
    total: number,
    limit: number,
    page: number
}

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CalculatedPrice } from './CalculatedPrice';
import type { Category } from './Category';
import type { CmsPage } from './CmsPage';
import type { DeliveryTime } from './DeliveryTime';
import type { ListPrice } from './ListPrice';
import type { MainCategory } from './MainCategory';
import type { ProductConfiguratorSetting } from './ProductConfiguratorSetting';
import type { ProductCrossSelling } from './ProductCrossSelling';
import type { ProductDownload } from './ProductDownload';
import type { ProductManufacturer } from './ProductManufacturer';
import type { ProductMedia } from './ProductMedia';
import type { ProductReview } from './ProductReview';
import type { ProductStream } from './ProductStream';
import type { PropertyGroupOption } from './PropertyGroupOption';
import type { ReferencePrice } from './ReferencePrice';
import type { SeoUrl } from './SeoUrl';
import type { Tag } from './Tag';
import type { Tax } from './Tax';
import type { Unit } from './Unit';
/**
 * Represents a product along with detailed information required to display a variant selection.
 */
export type Product = {
    id: string;
    versionId?: string;
    parentId?: string;
    parentVersionId?: string;
    manufacturerId?: string;
    productManufacturerVersionId?: string;
    unitId?: string;
    taxId: string;
    coverId?: string;
    productMediaVersionId?: string;
    deliveryTimeId?: string;
    canonicalProductId?: string;
    cmsPageId?: string;
    cmsPageVersionId?: string;
    productNumber: string;
    restockTime?: number;
    active?: boolean;
    readonly available?: boolean;
    isCloseout?: boolean;
    readonly availableStock?: number;
    stock: number;
    readonly displayGroup?: string;
    manufacturerNumber?: string;
    ean?: string;
    purchaseSteps?: number;
    maxPurchase?: number;
    minPurchase?: number;
    purchaseUnit?: number;
    referenceUnit?: number;
    shippingFree?: boolean;
    markAsTopseller?: boolean;
    weight?: number;
    width?: number;
    height?: number;
    length?: number;
    releaseDate?: string;
    readonly ratingAverage?: number;
    readonly categoryTree?: Array<string>;
    readonly propertyIds?: Array<string>;
    readonly optionIds?: Array<string>;
    readonly streamIds?: Array<string>;
    readonly tagIds?: Array<string>;
    readonly categoryIds?: Array<string>;
    readonly childCount?: number;
    readonly sales?: number;
    readonly states?: Array<string>;
    metaDescription?: string;
    name: string;
    keywords?: string;
    description?: string;
    metaTitle?: string;
    packUnit?: string;
    packUnitPlural?: string;
    customFields?: Record<string, any>;
    calculatedPrice: CalculatedPrice;
    calculatedPrices: Array<CalculatedPrice>;
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    calculatedMaxPurchase?: number;
    calculatedCheapestPrice?: (CalculatedPrice & {
        unitPrice?: number;
        quantity?: number;
        totalPrice?: number;
        referencePrice?: ReferencePrice | null;
        listPrice?: ListPrice | null;
        regulationPrice?: {
            price: number;
        } | null;
        hasRange?: boolean;
        variantId?: string | null;
        apiAlias?: 'calculated_cheapest_price';
    });
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    isNew?: boolean;
    sortedProperties?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: Record<string, any>;
    downloads?: Array<ProductDownload>;
    parent?: Product;
    children?: Array<Product>;
    deliveryTime?: DeliveryTime;
    tax?: Tax;
    manufacturer?: ProductManufacturer;
    unit?: Unit;
    cover?: ProductMedia;
    cmsPage?: CmsPage;
    canonicalProduct?: Product;
    media?: Array<ProductMedia>;
    crossSellings?: Array<ProductCrossSelling>;
    configuratorSettings?: Array<ProductConfiguratorSetting>;
    productReviews?: Array<ProductReview>;
    mainCategories?: Array<MainCategory>;
    seoUrls?: Array<SeoUrl>;
    options?: Array<PropertyGroupOption>;
    properties?: Array<PropertyGroupOption>;
    categories?: Array<Category>;
    streams?: Array<ProductStream>;
    categoriesRo?: Array<Category>;
    tags?: Array<Tag>;
    seoCategory: Category;
    apiAlias: 'product';
    variantListingConfig?: {
        displayParent?: boolean;
    } | null;
};


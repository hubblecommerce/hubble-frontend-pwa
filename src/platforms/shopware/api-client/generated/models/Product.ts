/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Category } from './Category';
import type { CmsPage } from './CmsPage';
import type { DeliveryTime } from './DeliveryTime';
import type { MainCategory } from './MainCategory';
import type { ProductConfiguratorSetting } from './ProductConfiguratorSetting';
import type { ProductCrossSelling } from './ProductCrossSelling';
import type { ProductDownload } from './ProductDownload';
import type { ProductManufacturer } from './ProductManufacturer';
import type { ProductMedia } from './ProductMedia';
import type { ProductReview } from './ProductReview';
import type { ProductStream } from './ProductStream';
import type { PropertyGroupOption } from './PropertyGroupOption';
import type { SeoUrl } from './SeoUrl';
import type { Tax } from './Tax';
import type { Unit } from './Unit';

/**
 * Added since version: 6.0.0.0
 */
export type Product = {
    id?: string;
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
    stock: number;
    restockTime?: number;
    active?: boolean;
    readonly availableStock?: number;
    readonly available?: boolean;
    isCloseout?: boolean;
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
    calculatedPrice?: Record<string, any>;
    calculatedPrices?: Array<any>;
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    calculatedMaxPurchase?: number;
    calculatedCheapestPrice?: Record<string, any>;
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    isNew?: boolean;
    sortedProperties?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: Record<string, any>;
    downloads?: ProductDownload;
    parent?: Product;
    children?: Product;
    deliveryTime?: DeliveryTime;
    tax?: Tax;
    manufacturer?: ProductManufacturer;
    unit?: Unit;
    cover?: ProductMedia;
    cmsPage?: CmsPage;
    canonicalProduct?: Product;
    media?: Array<ProductMedia>;
    crossSellings?: ProductCrossSelling;
    configuratorSettings?: ProductConfiguratorSetting;
    productReviews?: ProductReview;
    mainCategories?: MainCategory;
    seoUrls?: SeoUrl;
    options?: PropertyGroupOption;
    properties?: PropertyGroupOption;
    categories?: Category;
    streams?: ProductStream;
    categoriesRo?: Category;
    seoCategory?: Category;
};


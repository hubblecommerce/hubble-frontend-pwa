/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { resource } from './resource';

/**
 * Added since version: 6.0.0.0
 */
export type ProductJsonApi = (resource & {
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
    /**
     * @deprecated
     */
    mainVariantId?: string;
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
    customFields?: any;
    calculatedPrice?: any;
    calculatedPrices?: Array<any>;
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    calculatedMaxPurchase?: number;
    calculatedCheapestPrice?: any;
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    isNew?: boolean;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: any;
    relationships?: any;
});


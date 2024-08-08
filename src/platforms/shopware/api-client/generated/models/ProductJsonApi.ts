/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { resource } from './resource';
/**
 * Added since version: 6.0.0.0
 */
export type ProductJsonApi = (resource & {
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
    calculatedPrice?: Record<string, any>;
    calculatedPrices?: Array<Record<string, any>>;
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
    relationships?: {
        downloads?: {
            links?: {
                related?: string;
            };
            data?: Array<{
                type?: string;
                id?: string;
            }>;
        };
        parent?: {
            links?: {
                related?: string;
            };
            data?: {
                type?: string;
                id?: string;
            };
        };
        children?: {
            links?: {
                related?: string;
            };
            data?: Array<{
                type?: string;
                id?: string;
            }>;
        };
        deliveryTime?: {
            links?: {
                related?: string;
            };
            data?: {
                type?: string;
                id?: string;
            };
        };
        tax?: {
            links?: {
                related?: string;
            };
            data?: {
                type?: string;
                id?: string;
            };
        };
        manufacturer?: {
            links?: {
                related?: string;
            };
            data?: {
                type?: string;
                id?: string;
            };
        };
        unit?: {
            links?: {
                related?: string;
            };
            data?: {
                type?: string;
                id?: string;
            };
        };
        cover?: {
            links?: {
                related?: string;
            };
            data?: {
                type?: string;
                id?: string;
            };
        };
        cmsPage?: {
            links?: {
                related?: string;
            };
            data?: {
                type?: string;
                id?: string;
            };
        };
        canonicalProduct?: {
            links?: {
                related?: string;
            };
            data?: {
                type?: string;
                id?: string;
            };
        };
        media?: {
            links?: {
                related?: string;
            };
            data?: Array<{
                type?: string;
                id?: string;
            }>;
        };
        crossSellings?: {
            links?: {
                related?: string;
            };
            data?: Array<{
                type?: string;
                id?: string;
            }>;
        };
        configuratorSettings?: {
            links?: {
                related?: string;
            };
            data?: Array<{
                type?: string;
                id?: string;
            }>;
        };
        productReviews?: {
            links?: {
                related?: string;
            };
            data?: Array<{
                type?: string;
                id?: string;
            }>;
        };
        mainCategories?: {
            links?: {
                related?: string;
            };
            data?: Array<{
                type?: string;
                id?: string;
            }>;
        };
        seoUrls?: {
            links?: {
                related?: string;
            };
            data?: Array<{
                type?: string;
                id?: string;
            }>;
        };
        options?: {
            links?: {
                related?: string;
            };
            data?: Array<{
                type?: string;
                id?: string;
            }>;
        };
        properties?: {
            links?: {
                related?: string;
            };
            data?: Array<{
                type?: string;
                id?: string;
            }>;
        };
        categories?: {
            links?: {
                related?: string;
            };
            data?: Array<{
                type?: string;
                id?: string;
            }>;
        };
        streams?: {
            links?: {
                related?: string;
            };
            data?: Array<{
                type?: string;
                id?: string;
            }>;
        };
        categoriesRo?: {
            links?: {
                related?: string;
            };
            data?: Array<{
                type?: string;
                id?: string;
            }>;
        };
        tags?: {
            links?: {
                related?: string;
            };
            data?: Array<{
                type?: string;
                id?: string;
            }>;
        };
        seoCategory?: {
            links?: {
                related?: string;
            };
            data?: {
                type?: string;
                id?: string;
            };
        };
    };
});


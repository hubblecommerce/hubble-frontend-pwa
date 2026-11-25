/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Category } from '../models/Category';
import type { Product } from '../models/Product';
import type { PropertyGroup } from '../models/PropertyGroup';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StoreApiShopware {
    /**
     * Resolves a page by its relative `path`. Additional information, like *breadcrumb*, an associated *product* or *category* and the type of resource is fetched along with it.
     * Resolve a page for a given resource and resource identification or path
     * First, a PageLoaderContext object is assembled, which includes information about the resource, request and context.
     * Then, the page is loaded through the page loader only given the page loader context.
     * @param requestBody
     * @returns any The resolved page including additional data.
     * @throws ApiError
     */
    public static pwaResolvePage(
        requestBody: {
            /**
             * Relative path to the page that should be resolved
             */
            path?: string;
        },
    ): CancelablePromise<({
        /**
         * Type of page that was fetched. Indicates whether it is a product page or a category page.
         */
        resourceType?: 'frontend.detail.page';
        /**
         * The product associated with the loaded pag.
         */
        product?: Product;
        /**
         * List of property groups with their corresponding options and information on how to display them.
         */
        configuration?: PropertyGroup;
    } | {
        /**
         * Type of page that was fetched. Indicates whether it is a product page or a category page.
         */
        resourceType?: 'frontend.navigation.page';
        /**
         * The category associated with the loaded page.
         */
        category?: Category;
    } | {
        /**
         * Type of page that was fetched. Indicates whether it is a product page or a category page.
         */
        resourceType?: 'frontend.landing.page';
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/pwa/page',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `The resource could not be resolved or no path is provided..`,
            },
        });
    }
}

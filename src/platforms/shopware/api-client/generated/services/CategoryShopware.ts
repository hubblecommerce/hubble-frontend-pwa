/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Category } from '../models/Category';
import type { Criteria } from '../models/Criteria';
import type { EntitySearchResult } from '../models/EntitySearchResult';
import type { NavigationRouteResponse } from '../models/NavigationRouteResponse';
import type { NavigationType } from '../models/NavigationType';
import type { ProductListingCriteria } from '../models/ProductListingCriteria';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategoryShopware {
    /**
     * Fetch a navigation menu
     * This endpoint returns categories that can be used as a page navigation. You can either return them as a tree or as a flat list. You can also control the depth of the tree.
     *
     * Instead of passing uuids, you can also use one of the following aliases for the activeId and rootId parameters to get the respective navigations of your sales channel.
     *
     * * main-navigation
     * * service-navigation
     * * footer-navigation
     * @param activeId Identifier of the active category in the navigation tree (if not used, just set to the same as rootId).
     * @param rootId Identifier of the root category for your desired navigation tree. You can use it to fetch sub-trees of your navigation tree.
     * @param requestBody
     * @param swIncludeSeoUrls Instructs Shopware to try and resolve SEO URLs for the given navigation item
     * @returns NavigationRouteResponse All available navigations
     * @throws ApiError
     */
    public static readNavigation(
        activeId: (string | NavigationType),
        rootId: (string | NavigationType),
        requestBody: (Criteria & {
            /**
             * Determines the depth of fetched navigation levels.
             */
            depth?: number;
            /**
             * Return the categories as a tree or as a flat list.
             */
            buildTree?: Array<Record<string, any>>;
        }),
        swIncludeSeoUrls?: boolean,
    ): CancelablePromise<NavigationRouteResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/navigation/{activeId}/{rootId}',
            path: {
                'activeId': activeId,
                'rootId': rootId,
            },
            headers: {
                'sw-include-seo-urls': swIncludeSeoUrls,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Fetch a list of categories
     * Perform a filtered search for categories.
     * @param requestBody
     * @returns any Entity search result containing categories.
     * @throws ApiError
     */
    public static readCategoryList(
        requestBody?: Criteria,
    ): CancelablePromise<({
        elements?: Array<Category>;
    } & EntitySearchResult)> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/category',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Fetch a single category
     * This endpoint returns information about the category, as well as a fully resolved (hydrated with mapping values) CMS page, if one is assigned to the category. You can pass slots which should be resolved exclusively.
     * @param navigationId Identifier of the category to be fetched
     * @param swIncludeSeoUrls Instructs Shopware to try and resolve SEO URLs for the given navigation item
     * @param slots Resolves only the given slot identifiers. The identifiers have to be seperated by a '|' character
     * @param requestBody
     * @returns Category The loaded category with cms page
     * @throws ApiError
     */
    public static readCategory(
        navigationId: string,
        swIncludeSeoUrls?: boolean,
        slots?: string,
        requestBody?: (Criteria & ProductListingCriteria),
    ): CancelablePromise<Category> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/category/{navigationId}',
            path: {
                'navigationId': navigationId,
            },
            headers: {
                'sw-include-seo-urls': swIncludeSeoUrls,
            },
            query: {
                'slots': slots,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}

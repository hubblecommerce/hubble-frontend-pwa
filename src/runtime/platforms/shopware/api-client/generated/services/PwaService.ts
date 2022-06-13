/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Category } from '../models/Category';
import type { CmsPage } from '../models/CmsPage';
import type { Criteria } from '../models/Criteria';
import type { Product } from '../models/Product';
import type { PropertyGroup } from '../models/PropertyGroup';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PwaService {

    /**
     * Resolves a page by its relative `path`. Additional information, like *breadcrumb*, an associated *product* or *category* and the type of resource is fetched along with it.
     * @param requestBody
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns any The resolved page including additional data.
     * @throws ApiError
     */
    public static pwaResolvePage(
        requestBody: (Criteria & {
            /**
             * Relative path to the page that should be resolved
             */
            path: string;
        }),
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<({
        /**
         * Type of page that was fetched. Indicates whether it is a product page or a category page
         */
        resourceType?: 'frontend.detail.page' | 'frontend.navigation.page' | 'frontend.landing.page';
        /**
         * Identifier of the page that was fetched
         */
        resourceIdentifier?: string;
        /**
         * Canonical path of the resolved page
         */
        canonicalPathInfo?: string;
        cmsPage?: CmsPage;
        /**
         * Contains information about the category path to the loaded page.
         * Each element has the category identifier as its key and contains a `path` as well as a `name`. Elements are ordered by descending hierarchy in the category tree
         */
        breadcrumb?: any;
    } & ({
        product?: Product;
        configurator?: PropertyGroup;
    } | {
        category?: Category;
    }))> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/pwa/page',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not Found`,
            },
        });
    }

}

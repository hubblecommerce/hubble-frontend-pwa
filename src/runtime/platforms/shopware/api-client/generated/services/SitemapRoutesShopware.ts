/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Criteria } from '../models/Criteria';
import type { EntitySearchResult } from '../models/EntitySearchResult';
import type { SeoUrl } from '../models/SeoUrl';
import type { Sitemap } from '../models/Sitemap';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SitemapRoutesShopware {

    /**
     * Fetch SEO routes
     * Perform a filtered search for seo urls.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns any Entity search result containing seo urls.
     * @throws ApiError
     */
    public static readSeoUrl(
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: Criteria,
    ): CancelablePromise<({
        elements?: Array<SeoUrl>;
    } & EntitySearchResult)> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/seo-url',
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

    /**
     * Fetch sitemaps
     * Fetches a list of compressed sitemap files, which are often used by search engines.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns Sitemap Returns a list of available sitemaps.
     * @throws ApiError
     */
    public static readSitemap(
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<Array<Sitemap>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sitemap',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
        });
    }

}

/* generated using openapi-typescript-codegen -- do no edit */
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
     * @param requestBody
     * @returns any Entity search result containing seo urls.
     * @throws ApiError
     */
    public static readSeoUrl(
        requestBody?: Criteria,
    ): CancelablePromise<({
        elements: Array<SeoUrl>;
    } & EntitySearchResult)> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/seo-url',
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
     * @returns Sitemap Returns a list of available sitemaps.
     * @throws ApiError
     */
    public static readSitemap(): CancelablePromise<Array<Sitemap>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sitemap',
        });
    }
}

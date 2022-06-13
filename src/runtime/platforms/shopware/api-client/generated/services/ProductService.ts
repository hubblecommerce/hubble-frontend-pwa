/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Criteria } from '../models/Criteria';
import type { CrossSellingElementCollection } from '../models/CrossSellingElementCollection';
import type { EntitySearchResult } from '../models/EntitySearchResult';
import type { Product } from '../models/Product';
import type { ProductDetailResponse } from '../models/ProductDetailResponse';
import type { ProductListingCriteria } from '../models/ProductListingCriteria';
import type { ProductListingFlags } from '../models/ProductListingFlags';
import type { ProductListingResult } from '../models/ProductListingResult';
import type { ProductReview } from '../models/ProductReview';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ProductService {

    /**
     * Fetch cross-selling groups of a product
     * This route is used to load the cross sellings for a product. A product has several cross selling definitions in which several products are linked. The route returns the cross sellings together with the linked products
     * @param productId Product ID
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns CrossSellingElementCollection Found cross sellings
     * @throws ApiError
     */
    public static readProductCrossSellings(
        productId: string,
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<CrossSellingElementCollection> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/product/{productId}/cross-selling',
            path: {
                'productId': productId,
            },
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
        });
    }

    /**
     * Fetch a single product
     * This route is used to load a single product with the corresponding details. In addition to loading the data, the best variant of the product is determined when a parent id is passed.
     * @param productId Product ID
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns ProductDetailResponse Product information along with variant groups and options
     * @throws ApiError
     */
    public static readProductDetail(
        productId: string,
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<ProductDetailResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/product/{productId}',
            path: {
                'productId': productId,
            },
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
        });
    }

    /**
     * Fetch a product listing by category
     * Fetches a product listing for a specific category. It also provides filters, sortings and property aggregations, analogous to the /search endpoint.
     * @param categoryId Identifier of a category.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns ProductListingResult Returns a product listing containing all products and additional fields to display a listing.
     * @throws ApiError
     */
    public static readProductListing(
        categoryId: string,
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: (ProductListingCriteria & ProductListingFlags),
    ): CancelablePromise<ProductListingResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/product-listing/{categoryId}',
            path: {
                'categoryId': categoryId,
            },
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch a list of products
     * List products that match the given criteria. For performance ressons a limit should always be set.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns any Entity search result containing products
     * @throws ApiError
     */
    public static readProduct(
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: Criteria,
    ): CancelablePromise<({
        elements?: Array<Product>;
    } & EntitySearchResult)> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/product',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch product reviews
     * Perform a filtered search for product reviews.
     * @param productId Identifier of the product.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns any Entity search result containing product reviews
     * @throws ApiError
     */
    public static readProductReviews(
        productId: string,
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: Criteria,
    ): CancelablePromise<({
        elements?: Array<ProductReview>;
    } & EntitySearchResult)> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/product/{productId}/reviews',
            path: {
                'productId': productId,
            },
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Save a product review
     * Saves a review for a product. Reviews have to be activated in the settings.
     * @param productId Identifier of the product which is reviewed.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns any Success response indicating the review was saved successfuly.
     * @throws ApiError
     */
    public static saveProductReview(
        productId: string,
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: {
            /**
             * The name of the review author. If not set, the first name of the customer is chosen.
             */
            name?: string;
            /**
             * The email address of the review author. If not set, the email of the customer is chosen.
             */
            email?: string;
            /**
             * The title of the review.
             */
            title: any;
            /**
             * The content of review.
             */
            content: any;
            /**
             * The review rating for the product.
             */
            points: any;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/product/{productId}/review',
            path: {
                'productId': productId,
            },
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Search for products
     * Performs a search for products which can be used to display a product listing.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns ProductListingResult Returns a product listing containing all products and additional fields to display a listing.
     * @throws ApiError
     */
    public static searchPage(
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: ({
            /**
             * Using the search parameter, the server performs a text search on all records based on their data model and weighting as defined in the entity definition using the SearchRanking flag.
             */
            search: string;
        } & ProductListingCriteria & ProductListingFlags),
    ): CancelablePromise<ProductListingResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/search',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Search for products (suggest)
     * Can be used to implement search previews or suggestion listings, that don’t require any interaction.
     * @param requestBody
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns ProductListingResult Returns a product listing containing all products and additional fields.
     *
     * Note: Aggregations, currentFilters and availableSortings are empty in this response. If you need them to display a listing, use the /search route instead.
     * @throws ApiError
     */
    public static searchSuggest(
        requestBody: ({
            /**
             * Using the search parameter, the server performs a text search on all records based on their data model and weighting as defined in the entity definition using the SearchRanking flag.
             */
            search: string;
        } & ProductListingFlags),
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<ProductListingResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/search-suggest',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Export product export
     * @param accessKey Access Key
     * @param fileName File Name
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns any
     * @throws ApiError
     */
    public static readProductExport(
        accessKey: string,
        fileName: string,
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/product-export/{accessKey}/{fileName}',
            path: {
                'accessKey': accessKey,
                'fileName': fileName,
            },
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
        });
    }

}

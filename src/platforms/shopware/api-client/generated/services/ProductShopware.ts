/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Criteria } from '../models/Criteria';
import type { CrossSellingElementCollection } from '../models/CrossSellingElementCollection';
import type { EntitySearchResult } from '../models/EntitySearchResult';
import type { FindProductVariantRouteResponse } from '../models/FindProductVariantRouteResponse';
import type { Product } from '../models/Product';
import type { ProductDetailResponse } from '../models/ProductDetailResponse';
import type { ProductListingCriteria } from '../models/ProductListingCriteria';
import type { ProductListingFlags } from '../models/ProductListingFlags';
import type { ProductListingResult } from '../models/ProductListingResult';
import type { ProductReview } from '../models/ProductReview';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ProductShopware {

    /**
     * Export product export
     * @param accessKey Access Key
     * @param fileName File Name
     * @returns any
     * @throws ApiError
     */
    public static readProductExport(
        accessKey: string,
        fileName: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/product-export/{accessKey}/{fileName}',
            path: {
                'accessKey': accessKey,
                'fileName': fileName,
            },
        });
    }

    /**
     * Fetch a product listing by category
     * Fetches a product listing for a specific category. It also provides filters, sortings and property aggregations, analogous to the /search endpoint.
     * @param categoryId Identifier of a category.
     * @param requestBody
     * @returns ProductListingResult Returns a product listing containing all products and additional fields to display a listing.
     * @throws ApiError
     */
    public static readProductListing(
        categoryId: string,
        requestBody?: (ProductListingCriteria & ProductListingFlags),
    ): CancelablePromise<ProductListingResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/product-listing/{categoryId}',
            path: {
                'categoryId': categoryId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch cross-selling groups of a product
     * This route is used to load the cross sellings for a product. A product has several cross selling definitions in which several products are linked. The route returns the cross sellings together with the linked products
     * @param productId Product ID
     * @returns CrossSellingElementCollection Found cross sellings
     * @throws ApiError
     */
    public static readProductCrossSellings(
        productId: string,
    ): CancelablePromise<CrossSellingElementCollection> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/product/{productId}/cross-selling',
            path: {
                'productId': productId,
            },
        });
    }

    /**
     * Fetch a single product
     * This route is used to load a single product with the corresponding details. In addition to loading the data, the best variant of the product is determined when a parent id is passed.
     * @param productId Product ID
     * @returns ProductDetailResponse Product information along with variant groups and options
     * @throws ApiError
     */
    public static readProductDetail(
        productId: string,
    ): CancelablePromise<ProductDetailResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/product/{productId}',
            path: {
                'productId': productId,
            },
        });
    }

    /**
     * Fetch a list of products
     * List products that match the given criteria. For performance ressons a limit should always be set.
     * @param requestBody
     * @returns any Entity search result containing products
     * @throws ApiError
     */
    public static readProduct(
        requestBody?: Criteria,
    ): CancelablePromise<({
        elements?: Array<Product>;
    } & EntitySearchResult)> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/product',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch product reviews
     * Perform a filtered search for product reviews.
     * @param productId Identifier of the product.
     * @param requestBody
     * @returns any Entity search result containing product reviews
     * @throws ApiError
     */
    public static readProductReviews(
        productId: string,
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
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Save a product review
     * Saves a review for a product. Reviews have to be activated in the settings.
     * @param productId Identifier of the product which is reviewed.
     * @param requestBody
     * @returns any Success response indicating the review was saved successfuly.
     * @throws ApiError
     */
    public static saveProductReview(
        productId: string,
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
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Search for a matching variant by product options.
     * Performs a search for product variants and returns the best matching variant.
     * @param productId Product ID
     * @param requestBody
     * @returns FindProductVariantRouteResponse Returns an FoundCombination struct containing the ids matching the search.
     * @throws ApiError
     */
    public static searchProductVariantIds(
        productId: string,
        requestBody?: {
            /**
             * The options parameter for the variant to find.
             */
            options: Array<string>;
            /**
             * The id of the option group that has been switched.
             */
            switchedGroup?: string;
        },
    ): CancelablePromise<FindProductVariantRouteResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/product/{productId}/find-variant',
            path: {
                'productId': productId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Search for products (suggest)
     * Can be used to implement search previews or suggestion listings, that don’t require any interaction.
     * @param requestBody
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
    ): CancelablePromise<ProductListingResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/search-suggest',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Search for products
     * Performs a search for products which can be used to display a product listing.
     * @param requestBody
     * @returns ProductListingResult Returns a product listing containing all products and additional fields to display a listing.
     * @throws ApiError
     */
    public static searchPage(
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
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}

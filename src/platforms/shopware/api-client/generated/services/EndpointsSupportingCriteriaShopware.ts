/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Category } from '../models/Category';
import type { CmsPage } from '../models/CmsPage';
import type { Country } from '../models/Country';
import type { CountryState } from '../models/CountryState';
import type { Criteria } from '../models/Criteria';
import type { Currency } from '../models/Currency';
import type { Customer } from '../models/Customer';
import type { CustomerAddress } from '../models/CustomerAddress';
import type { Document } from '../models/Document';
import type { EntitySearchResult } from '../models/EntitySearchResult';
import type { LandingPage } from '../models/LandingPage';
import type { Language } from '../models/Language';
import type { NavigationRouteResponse } from '../models/NavigationRouteResponse';
import type { OrderRouteResponse } from '../models/OrderRouteResponse';
import type { PaymentMethod } from '../models/PaymentMethod';
import type { Product } from '../models/Product';
import type { ProductListingCriteria } from '../models/ProductListingCriteria';
import type { ProductReview } from '../models/ProductReview';
import type { PropertyGroup } from '../models/PropertyGroup';
import type { Salutation } from '../models/Salutation';
import type { SeoUrl } from '../models/SeoUrl';
import type { ShippingMethod } from '../models/ShippingMethod';
import type { WishlistLoadRouteResponse } from '../models/WishlistLoadRouteResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class EndpointsSupportingCriteriaShopware {

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

    /**
     * Get information about current customer
     * Returns information about the current customer.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns Customer Returns the logged in customer, also for guest sessions. Check for the value of `guest` field to see whether the customer is a guest.
     * @throws ApiError
     */
    public static readCustomer(
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: Criteria,
    ): CancelablePromise<Customer> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/account/customer',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch addresses of a customer
     * Lists all addresses of the current customer and allows filtering them based on a criteria.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns CustomerAddress
     * @throws ApiError
     */
    public static listAddress(
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: Criteria,
    ): CancelablePromise<Array<CustomerAddress>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/account/list-address',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch a wishlist
     * Fetch a customer's wishlist. Products on the wishlist can be filtered using a criteria object.
     *
     * **Important constraints**
     *
     * * Anonymous (not logged-in) customers can not have wishlists.
     * * The wishlist feature has to be activated.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns WishlistLoadRouteResponse
     * @throws ApiError
     */
    public static readCustomerWishlist(
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: Criteria,
    ): CancelablePromise<WishlistLoadRouteResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/customer/wishlist',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Download generated document
     * Returns blob file of a generated document to download.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns Document Returns the document information and blob to download.
     * @throws ApiError
     */
    public static download(
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: Criteria,
    ): CancelablePromise<Document> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/document/download',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch a list of orders
     * List orders of a customer.
     * @param requestBody
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns OrderRouteResponse An array of orders and an indicator if the payment of the order can be changed.
     * @throws ApiError
     */
    public static readOrder(
        requestBody: (Criteria & {
            /**
             * Check if the payment method of the order is still changeable.
             */
            checkPromotion?: boolean;
        }),
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<OrderRouteResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/order',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Loads all available payment methods
     * @param requestBody
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns any
     * @throws ApiError
     */
    public static readPaymentMethod(
        requestBody: (Criteria & {
            /**
             * List only available
             */
            onlyAvailable?: boolean;
        }),
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<{
        /**
         * Total amount
         */
        total?: number;
        /**
         * aggregation result
         */
        aggregations?: any;
        elements?: Array<PaymentMethod>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/payment-method',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch shipping methods
     * Perform a filtered search for shipping methods.
     * @param onlyAvailable List only available shipping methods. This filters shipping methods methods which can not be used in the actual context because of their availability rule.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static readShippingMethod(
        onlyAvailable?: boolean,
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: Criteria,
    ): CancelablePromise<{
        /**
         * Total amount
         */
        total?: number;
        /**
         * aggregation result
         */
        aggregations?: any;
        elements?: Array<ShippingMethod>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/shipping-method',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            query: {
                'onlyAvailable': onlyAvailable,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch a list of categories
     * Perform a filtered search for categories.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns any Entity search result containing categories.
     * @throws ApiError
     */
    public static readCategoryList(
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: Criteria,
    ): CancelablePromise<({
        elements?: Array<Category>;
    } & EntitySearchResult)> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/category',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch a single category
     * This endpoint returns information about the category, as well as a fully resolved (hydrated with mapping values) CMS page, if one is assigned to the category. You can pass slots which should be resolved exclusively.
     * @param categoryId Identifier of the category to be fetched
     * @param slots Resolves only the given slot identifiers. The identifiers have to be seperated by a '|' character
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns Category The loaded category with cms page
     * @throws ApiError
     */
    public static readCategory(
        categoryId: string,
        slots?: string,
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: (Criteria & ProductListingCriteria),
    ): CancelablePromise<Category> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/category/{categoryId}',
            path: {
                'categoryId': categoryId,
            },
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            query: {
                'slots': slots,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch a navigation menu
     * This endpoint returns categories that can be used as a page navigation. You can either return them as a tree or as a flat list. You can also control the depth of the tree.
     *
     * Instead of passing uuids, you can also use one of the following aliases for the activeId and rootId parameters to get the respective navigations of your sales channel.
     *
     * * main-navigation
     * * service-navigation
     * * footer-navigation
     * @param requestActiveId Identifier of the active category in the navigation tree (if not used, just set to the same as rootId).
     * @param requestRootId Identifier of the root category for your desired navigation tree. You can use it to fetch sub-trees of your navigation tree.
     * @param requestBody
     * @param swIncludeSeoUrls Instructs Shopware to try and resolve SEO URLs for the given navigation item
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns NavigationRouteResponse All available navigations
     * @throws ApiError
     */
    public static readNavigation(
        requestActiveId: string,
        requestRootId: string,
        requestBody: (Criteria & {
            /**
             * Determines the depth of fetched navigation levels.
             */
            depth?: any;
            /**
             * Return the categories as a tree or as a flat list.
             */
            buildTree?: any;
        }),
        swIncludeSeoUrls?: boolean,
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<NavigationRouteResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/navigation/{requestActiveId}/{requestRootId}',
            path: {
                'requestActiveId': requestActiveId,
                'requestRootId': requestRootId,
            },
            headers: {
                'sw-include-seo-urls': swIncludeSeoUrls,
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch a landing page with the resolved CMS page
     * Loads a landing page by its identifier and resolves the CMS page.
     *
     * **Important notice**
     *
     * The criteria passed with this route also affects the listing, if there is one within the cms page.
     * @param landingPageId Identifier of the landing page.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns LandingPage The loaded landing page with cms page
     * @throws ApiError
     */
    public static readLandingPage(
        landingPageId: string,
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: (Criteria & ({
            /**
             * Resolves only the given slot identifiers. The identifiers have to be seperated by a `|` character.
             */
            slots?: string;
        } & ProductListingCriteria)),
    ): CancelablePromise<LandingPage> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/landing-page/{landingPageId}',
            path: {
                'landingPageId': landingPageId,
            },
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
     * Fetch countries
     * Perform a filtered search for countries
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns any Entity search result containing countries.
     * @throws ApiError
     */
    public static readCountry(
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: Criteria,
    ): CancelablePromise<({
        elements?: Array<Country>;
    } & EntitySearchResult)> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/country',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch the states of a country
     * Perform a filtered search the states for a country
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns any Entity search result containing countries.
     * @throws ApiError
     */
    public static readCountryState(
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: Criteria,
    ): CancelablePromise<({
        elements?: Array<CountryState>;
    } & EntitySearchResult)> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/country-state',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch currencies
     * Perform a filtered search for currencies.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns any Entity search result containing currencies.
     * @throws ApiError
     */
    public static readCurrency(
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: Criteria,
    ): CancelablePromise<({
        elements?: Array<Currency>;
    } & EntitySearchResult)> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/currency',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch languages
     * Perform a filtered search for languages.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns any Entity search result containing languages.
     * @throws ApiError
     */
    public static readLanguages(
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: Criteria,
    ): CancelablePromise<({
        elements?: Array<Language>;
    } & EntitySearchResult)> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/language',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch salutations
     * Perform a filtered search for salutations.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns any Entity search result containing salutations.
     * @throws ApiError
     */
    public static readSalutation(
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: Criteria,
    ): CancelablePromise<({
        elements?: Array<Salutation>;
    } & EntitySearchResult)> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/salutation',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}

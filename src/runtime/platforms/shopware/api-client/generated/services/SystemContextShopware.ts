/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContextTokenResponse } from '../models/ContextTokenResponse';
import type { Country } from '../models/Country';
import type { Criteria } from '../models/Criteria';
import type { Currency } from '../models/Currency';
import type { EntitySearchResult } from '../models/EntitySearchResult';
import type { Language } from '../models/Language';
import type { SalesChannelContext } from '../models/SalesChannelContext';
import type { Salutation } from '../models/Salutation';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SystemContextShopware {

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
     * Fetch the current context
     * Fetches the current context. This includes for example the `customerGroup`, `currency`, `taxRules` and many more.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns SalesChannelContext Returns the current context.
     * @throws ApiError
     */
    public static readContext(
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<SalesChannelContext> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/context',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
        });
    }

    /**
     * Modify the current context
     * Used for switching the context. A typical example would be changing the language or changing the currency.
     * @param requestBody
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns ContextTokenResponse Returns the context token. Use that as your `sw-context-token` header for subsequent requests.
     * @throws ApiError
     */
    public static updateContext(
        requestBody: {
            /**
             * Currency
             */
            currencyId?: string;
            /**
             * Language
             */
            languageId?: string;
            /**
             * Billing Address
             */
            billingAddressId?: string;
            /**
             * Shipping Address
             */
            shippingAddressId?: string;
            /**
             * Payment Method
             */
            paymentMethodId?: string;
            /**
             * Shipping Method
             */
            shippingMethodId?: string;
            /**
             * Country
             */
            countryId?: string;
            /**
             * Country State
             */
            countryStateId?: string;
        },
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<ContextTokenResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/context',
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

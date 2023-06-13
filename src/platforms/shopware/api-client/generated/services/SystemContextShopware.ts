/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContextTokenResponse } from '../models/ContextTokenResponse';
import type { Country } from '../models/Country';
import type { CountryState } from '../models/CountryState';
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
     * Fetch the current context
     * Fetches the current context. This includes for example the `customerGroup`, `currency`, `taxRules` and many more.
     * @returns SalesChannelContext Returns the current context.
     * @throws ApiError
     */
    public static readContext(): CancelablePromise<SalesChannelContext> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/context',
        });
    }

    /**
     * Modify the current context
     * Used for switching the context. A typical example would be changing the language or changing the currency.
     * @param requestBody
     * @returns ContextTokenResponse Returns the context token. Use that as your `sw-context-token` header for subsequent requests. Redirect if getRedirectUrl is set.
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
    ): CancelablePromise<ContextTokenResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/context',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch the states of a country
     * Perform a filtered search the states for a country
     * @param countryId
     * @param requestBody
     * @returns any Entity search result containing countries.
     * @throws ApiError
     */
    public static readCountryState(
        countryId: string,
        requestBody?: Criteria,
    ): CancelablePromise<({
        elements?: Array<CountryState>;
    } & EntitySearchResult)> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/country-state/{countryId}',
            path: {
                'countryId': countryId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch countries
     * Perform a filtered search for countries
     * @param requestBody
     * @returns any Entity search result containing countries.
     * @throws ApiError
     */
    public static readCountry(
        requestBody?: Criteria,
    ): CancelablePromise<({
        elements?: Array<Country>;
    } & EntitySearchResult)> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/country',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch currencies
     * Perform a filtered search for currencies.
     * @param requestBody
     * @returns any Entity search result containing currencies.
     * @throws ApiError
     */
    public static readCurrency(
        requestBody?: Criteria,
    ): CancelablePromise<({
        elements?: Array<Currency>;
    } & EntitySearchResult)> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/currency',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch languages
     * Perform a filtered search for languages.
     * @param requestBody
     * @returns any Entity search result containing languages.
     * @throws ApiError
     */
    public static readLanguages(
        requestBody?: Criteria,
    ): CancelablePromise<({
        elements?: Array<Language>;
    } & EntitySearchResult)> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/language',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch salutations
     * Perform a filtered search for salutations.
     * @param requestBody
     * @returns any Entity search result containing salutations.
     * @throws ApiError
     */
    public static readSalutation(
        requestBody?: Criteria,
    ): CancelablePromise<({
        elements?: Array<Salutation>;
    } & EntitySearchResult)> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/salutation',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CountryState } from './CountryState';

/**
 * Added since version: 6.0.0.0
 */
export type Country = {
    id?: string;
    name: string;
    iso?: string;
    position?: number;
    active?: boolean;
    shippingAvailable?: boolean;
    iso3?: string;
    displayStateInRegistration?: boolean;
    forceStateInRegistration?: boolean;
    /**
     * @deprecated
     */
    companyTaxFree?: boolean;
    checkVatIdPattern?: boolean;
    vatIdRequired?: boolean;
    /**
     * @deprecated
     */
    taxFree?: boolean;
    vatIdPattern?: string;
    customFields?: any;
    customerTax?: {
        enabled: boolean;
        currencyId: string;
        amount: number;
    };
    companyTax?: {
        enabled: boolean;
        currencyId: string;
        amount: number;
    };
    postalCodeRequired?: boolean;
    checkPostalCodePattern?: boolean;
    checkAdvancedPostalCodePattern?: boolean;
    advancedPostalCodePattern?: string;
    addressFormat: any;
    defaultPostalCodePattern?: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: any;
    states?: CountryState;
};


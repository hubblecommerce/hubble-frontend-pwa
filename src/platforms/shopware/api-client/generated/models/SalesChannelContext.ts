/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Country } from './Country';
import type { Currency } from './Currency';
import type { Customer } from './Customer';
import type { CustomerAddress } from './CustomerAddress';
import type { PaymentMethod } from './PaymentMethod';
import type { ShippingMethod } from './ShippingMethod';
import type { Struct } from './Struct';
export type SalesChannelContext = (Struct & {
    /**
     * Context the user session
     */
    token?: string;
    /**
     * Customer group of the current user
     */
    currentCustomerGroup?: {
        name?: string;
        displayGross?: boolean;
    };
    /**
     * Fallback group if the default customer group is not applicable
     */
    fallbackCustomerGroup?: {
        name?: string;
        displayGross?: boolean;
    };
    currency?: Currency;
    /**
     * Information about the current sales channel
     */
    salesChannel?: {
        typeId?: string;
        languageId?: string;
        currencyId?: string;
        paymentMethodId?: string;
        shippingMethodId?: string;
        countryId?: string;
        navigationCategoryId?: string;
        navigationCategoryDepth?: number;
        footerCategoryId?: string;
        serviceCategoryId?: string;
        name?: string;
        shortName?: string;
        accessKey?: string;
        active?: boolean;
        maintenance?: boolean;
        maintenanceIpWhitelist?: string;
        mailHeaderFooterId?: string;
        customerGroupId?: string;
        hreflangActive?: boolean;
        hreflangDefaultDomainId?: string;
        analyticsId?: string;
    };
    /**
     * Currently active tax rules and/or rates
     */
    taxRules?: Array<{
        taxRate?: number;
        name?: string;
    }>;
    customer?: Customer;
    paymentMethod?: PaymentMethod;
    shippingLocation?: {
        apiAlias?: 'cart_delivery_shipping_location';
        country?: Country;
        address?: CustomerAddress;
    };
    shippingMethod?: ShippingMethod;
    /**
     * Core context with general configuration values and state
     */
    context?: {
        versionId?: string;
        currencyId?: string;
        currencyFactor?: number;
        currencyPrecision?: number;
        languageIdChain?: Array<string>;
        scope?: string;
        source?: string;
        taxState?: string;
        useCache?: boolean;
    };
});


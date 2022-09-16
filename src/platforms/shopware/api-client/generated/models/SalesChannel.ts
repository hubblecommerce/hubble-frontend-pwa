/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Category } from './Category';
import type { Country } from './Country';
import type { Currency } from './Currency';
import type { Language } from './Language';
import type { PaymentMethod } from './PaymentMethod';
import type { SalesChannelDomain } from './SalesChannelDomain';
import type { ShippingMethod } from './ShippingMethod';

/**
 * Added since version: 6.0.0.0
 */
export type SalesChannel = {
    id?: string;
    languageId: string;
    customerGroupId: string;
    currencyId: string;
    paymentMethodId: string;
    shippingMethodId: string;
    countryId: string;
    navigationCategoryId: string;
    navigationCategoryVersionId?: string;
    navigationCategoryDepth?: number;
    footerCategoryId?: string;
    footerCategoryVersionId?: string;
    serviceCategoryId?: string;
    serviceCategoryVersionId?: string;
    mailHeaderFooterId?: string;
    hreflangDefaultDomainId?: string;
    name: string;
    shortName?: string;
    taxCalculationType?: string;
    configuration?: any;
    active?: boolean;
    hreflangActive?: boolean;
    maintenance?: boolean;
    customFields?: any;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: any;
    language?: Language;
    currency?: Currency;
    paymentMethod?: PaymentMethod;
    shippingMethod?: ShippingMethod;
    country?: Country;
    domains?: SalesChannelDomain;
    navigationCategory?: Category;
    footerCategory?: Category;
    serviceCategory?: Category;
    hreflangDefaultDomain?: SalesChannelDomain;
};


/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

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
    /**
     * Currency associated with the current user
     */
    currency?: {
        isoCode?: string;
        factor?: number;
        symbol?: string;
        shortName?: string;
        name?: string;
        position?: number;
        decimalPrecision?: number;
        isSystemDefault?: boolean;
    };
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
    /**
     * Information about the current customer - `null` if the customer is not logged in
     */
    customer?: {
        groupId?: string;
        defaultPaymentMethodId?: string;
        salesChannelId?: string;
        languageId?: string;
        lastPaymentMethodId?: string;
        defaultBillingAddressId?: string;
        defaultShippingAddressId?: string;
        customerNumber?: string;
        salutationId?: string;
        firstName?: string;
        lastName?: string;
        company?: string;
        password?: string;
        email?: string;
        title?: string;
        affiliateCode?: string;
        campaignCode?: string;
        active?: boolean;
        doubleOptInRegistration?: boolean;
        doubleOptInEmailSentDate?: string;
        doubleOptInConfirmDate?: string;
        hash?: string;
        guest?: boolean;
        firstLogin?: string;
        lastLogin?: string;
        newsletter?: boolean;
        birthday?: string;
        lastOrderDate?: string;
        orderCount?: number;
        legacyEncoder?: string;
        legacyPassword?: string;
        autoIncrement?: number;
        remoteAddress?: string;
    };
    /**
     * Selected payment method
     */
    paymentMethod?: {
        pluginId?: string;
        handlerIdentifier?: string;
        name?: string;
        description?: string;
        position?: number;
        active?: boolean;
        availabilityRuleId?: string;
        mediaId?: string;
        formattedHandlerIdentifier?: string;
    };
    /**
     * Selected shipping method
     */
    shippingMethod?: {
        name?: string;
        active?: boolean;
        description?: string;
        trackingUrl?: string;
        deliveryTimeId?: string;
        availabilityRuleId?: string;
        mediaId?: string;
    };
    /**
     * Core context with general configuration values and state
     */
    context?: {
        versionId?: string;
        currencyId?: string;
        currencyFactor?: number;
        currencyPrecision?: number;
        scope?: string;
        source?: string;
        taxState?: string;
        useCache?: boolean;
    };
});


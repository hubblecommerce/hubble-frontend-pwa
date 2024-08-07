/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ShippingMethodPageRouteResponse = Array<{
    name?: string;
    active?: boolean;
    description?: string;
    deliveryTimeId?: string;
    deliveryTime?: {
        name?: string;
        min?: number;
        max?: number;
        unit?: string;
    };
    translations?: Array<{
        shippingMethodId?: string;
        name?: string;
        description?: string;
    }>;
    orderDeliveries?: Array<{
        orderId?: string;
        shippingOrderAddressId?: string;
        shippingMethodId?: string;
        shippingDateEarliest?: string;
        shippingDateLatest?: string;
        stateId?: string;
    }>;
    salesChannelDefaultAssignments?: Array<{
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
    }>;
    salesChannels?: Array<{
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
    }>;
    availabilityRule?: {
        name?: string;
        description?: string;
        priority?: number;
        invalid?: boolean;
    };
    availabilityRuleId?: string;
    prices?: Array<{
        shippingMethodId?: string;
        currencyId?: string;
        ruleId?: string;
        calculation?: number;
        quantityStart?: number;
        quantityEnd?: number;
        price?: number;
        calculationRuleId?: string;
    }>;
    mediaId?: string;
    media?: {
        userId?: string;
        mimeType?: string;
        fileExtension?: string;
        fileSize?: number;
        title?: string;
        metaDataRaw?: string;
        mediaTypeRaw?: string;
        uploadedAt?: string;
        alt?: string;
        url?: string;
        fileName?: string;
        mediaFolderId?: string;
        private?: boolean;
        thumbnailsRo?: string;
    };
    tags?: Array<{
        name?: string;
    }>;
}>;

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CustomerAddress } from './CustomerAddress';
import type { CustomerGroup } from './CustomerGroup';
import type { Language } from './Language';
import type { PaymentMethod } from './PaymentMethod';
import type { Salutation } from './Salutation';

/**
 * Added since version: 6.0.0.0
 */
export type Customer = {
    id?: string;
    groupId: string;
    defaultPaymentMethodId: string;
    salesChannelId: string;
    languageId: string;
    lastPaymentMethodId?: string;
    defaultBillingAddressId: string;
    defaultShippingAddressId: string;
    customerNumber: string;
    salutationId?: string;
    firstName: string;
    lastName: string;
    company?: string;
    email: string;
    title?: string;
    vatIds?: Array<string>;
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
    birthday?: string;
    readonly lastOrderDate?: string;
    readonly orderCount?: number;
    readonly orderTotalAmount?: number;
    readonly reviewCount?: number;
    customFields?: Record<string, any>;
    readonly tagIds?: Array<string>;
    accountType: string;
    createdById?: string;
    updatedById?: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    group?: CustomerGroup;
    defaultPaymentMethod?: PaymentMethod;
    language?: Language;
    lastPaymentMethod?: PaymentMethod;
    defaultBillingAddress?: CustomerAddress;
    defaultShippingAddress?: CustomerAddress;
    salutation?: Salutation;
    addresses?: CustomerAddress;
};


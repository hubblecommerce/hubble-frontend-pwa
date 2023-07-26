/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Currency } from './Currency';
import type { Document } from './Document';
import type { Language } from './Language';
import type { OrderAddress } from './OrderAddress';
import type { OrderCustomer } from './OrderCustomer';
import type { OrderDelivery } from './OrderDelivery';
import type { OrderLineItem } from './OrderLineItem';
import type { OrderTransaction } from './OrderTransaction';
import type { StateMachineState } from './StateMachineState';
import type { Tag } from './Tag';

/**
 * Added since version: 6.0.0.0
 */
export type Order = {
    id?: string;
    versionId?: string;
    orderNumber?: string;
    billingAddressId: string;
    billingAddressVersionId?: string;
    currencyId: string;
    languageId: string;
    salesChannelId: string;
    orderDateTime: string;
    readonly orderDate?: string;
    price?: {
        netPrice: number;
        totalPrice: number;
        calculatedTaxes?: Record<string, any>;
        taxRules?: Record<string, any>;
        positionPrice: number;
        rawTotal: number;
        taxStatus: string;
    };
    readonly amountTotal?: number;
    readonly amountNet?: number;
    readonly positionPrice?: number;
    readonly taxStatus?: string;
    shippingCosts?: {
        unitPrice: number;
        totalPrice: number;
        quantity: number;
        calculatedTaxes?: Record<string, any>;
        taxRules?: Record<string, any>;
        referencePrice?: Record<string, any>;
        listPrice?: {
            price?: number;
            discount?: number;
            percentage?: number;
        };
        regulationPrice?: {
            price?: number;
        };
    };
    readonly shippingTotal?: number;
    currencyFactor: number;
    deepLinkCode?: string;
    affiliateCode?: string;
    campaignCode?: string;
    customerComment?: string;
    customFields?: Record<string, any>;
    createdById?: string;
    updatedById?: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    stateMachineState?: StateMachineState;
    orderCustomer?: OrderCustomer;
    currency?: Currency;
    language?: Language;
    addresses?: OrderAddress;
    billingAddress?: OrderAddress;
    deliveries?: OrderDelivery;
    lineItems?: OrderLineItem;
    transactions?: OrderTransaction;
    documents?: Document;
    tags?: Tag;
};


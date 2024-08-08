/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LineItem } from './LineItem';
import type { Struct } from './Struct';
export type Cart = (Struct & {
    /**
     * Name of the cart - for example `guest-cart`
     */
    name?: string;
    /**
     * Context token identifying the cart and the user session
     */
    token?: string;
    price?: {
        /**
         * Net price of the cart
         */
        netPrice?: number;
        /**
         * Total price of the cart, including shipping costs, discounts and taxes
         */
        totalPrice?: number;
        /**
         * Price for all line items in the cart
         */
        positionPrice?: number;
        /**
         * Tax calculation for the cart. One of `gross`, `net` or `tax-free`
         */
        taxStatus?: string;
    };
    /**
     * All items within the cart
     */
    lineItems?: Array<LineItem>;
    /**
     * A list of all cart errors, such as insufficient stocks, invalid addresses or vouchers.
     */
    errors?: Array<{
        key?: string;
        level?: string;
        message?: string;
    }>;
    /**
     * A list of all payment transactions associated with the current cart.
     */
    transactions?: Array<{
        paymentMethodId?: string;
    }>;
    modified?: boolean;
    /**
     * A comment that can be added to the cart.
     */
    customerComment?: string;
    /**
     * An affiliate tracking code
     */
    affiliateCode?: string;
    /**
     * A campaign tracking code
     */
    campaignCode?: string;
});


/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type OrderRouteResponse = {
    orders?: Record<string, any>;
    /**
     * The key-value pairs contain the uuid of the order as key and a boolean as value, indicating that the payment method can still be changed.
     */
    paymentChangeable?: Record<string, boolean>;
};


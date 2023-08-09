/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Country } from './Country';
import type { CountryState } from './CountryState';
import type { Salutation } from './Salutation';

/**
 * Added since version: 6.0.0.0
 */
export type CustomerAddress = {
    id?: string;
    customerId: string;
    countryId: string;
    countryStateId?: string;
    salutationId?: string;
    firstName: string;
    lastName: string;
    zipcode?: string;
    city: string;
    company?: string;
    street: string;
    department?: string;
    title?: string;
    phoneNumber?: string;
    additionalAddressLine1?: string;
    additionalAddressLine2?: string;
    customFields?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
    country?: Country;
    countryState?: CountryState;
    salutation?: Salutation;
};


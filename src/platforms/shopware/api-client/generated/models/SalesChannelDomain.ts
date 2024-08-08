/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Currency } from './Currency';
import type { Language } from './Language';
import type { SalesChannel } from './SalesChannel';
/**
 * Added since version: 6.0.0.0
 */
export type SalesChannelDomain = {
    id: string;
    url: string;
    salesChannelId: string;
    languageId: string;
    currencyId: string;
    snippetSetId: string;
    hreflangUseOnlyLocale?: boolean;
    customFields?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
    language?: Language;
    currency?: Currency;
    salesChannelDefaultHreflang?: SalesChannel;
};


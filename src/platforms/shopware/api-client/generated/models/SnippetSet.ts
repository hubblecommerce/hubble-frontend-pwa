/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Snippet } from './Snippet';
/**
 * Added since version: 6.0.0.0
 */
export type SnippetSet = {
    id?: string;
    name: string;
    iso: string;
    customFields?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
    snippets?: Array<Snippet>;
};


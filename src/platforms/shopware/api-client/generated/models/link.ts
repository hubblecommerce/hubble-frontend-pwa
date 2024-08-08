/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { meta } from './meta';
/**
 * A link **MUST** be represented as either: a string containing the link's URL or a link object.
 */
export type link = (string | {
    /**
     * A string containing the link's URL.
     */
    href: string;
    meta?: meta;
});


/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { links } from './links';
import type { meta } from './meta';

export type error = {
    /**
     * A unique identifier for this particular occurrence of the problem.
     */
    id?: string;
    links?: links;
    /**
     * The HTTP status code applicable to this problem, expressed as a string value.
     */
    status?: string;
    /**
     * An application-specific error code, expressed as a string value.
     */
    code?: string;
    /**
     * A short, human-readable summary of the problem. It **SHOULD NOT** change from occurrence to occurrence of the problem, except for purposes of localization.
     */
    title?: string;
    /**
     * A human-readable explanation specific to this occurrence of the problem.
     */
    detail?: string;
    source?: {
        /**
         * A JSON Pointer [RFC6901] to the associated entity in the request document [e.g. "/data" for a primary data object, or "/data/attributes/title" for a specific attribute].
         */
        pointer?: string;
        /**
         * A string indicating which query parameter caused the error.
         */
        parameter?: string;
    };
    meta?: meta;
};


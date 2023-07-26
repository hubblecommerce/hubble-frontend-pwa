/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { attributes } from './attributes';
import type { links } from './links';
import type { meta } from './meta';
import type { relationships } from './relationships';

/**
 * "Resource objects" appear in a JSON API document to represent resources.
 */
export type resource = {
    type: string;
    id: string;
    attributes?: attributes;
    relationships?: relationships;
    links?: links;
    meta?: meta;
};


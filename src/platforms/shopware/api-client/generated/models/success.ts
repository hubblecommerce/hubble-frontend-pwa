/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { data } from './data';
import type { links } from './links';
import type { meta } from './meta';
import type { pagination } from './pagination';
import type { resource } from './resource';

export type success = {
    meta?: meta;
    /**
     * Link members related to the primary data.
     */
    links?: (links & pagination);
    data: data;
    /**
     * To reduce the number of HTTP requests, servers **MAY** allow responses that include related resources along with the requested primary resources. Such responses are called "compound documents".
     */
    included?: Array<resource>;
};


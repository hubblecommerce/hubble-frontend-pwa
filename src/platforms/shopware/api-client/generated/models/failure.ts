/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { error } from './error';
import type { links } from './links';
import type { meta } from './meta';

export type failure = {
    meta?: meta;
    links?: links;
    errors: Array<error>;
};


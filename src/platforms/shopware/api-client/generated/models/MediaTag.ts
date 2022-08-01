/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Media } from './Media';
import type { Tag } from './Tag';

/**
 * Added since version: 6.0.0.0
 */
export type MediaTag = {
    id?: string;
    mediaId: string;
    tagId: string;
    media?: Media;
    tag?: Tag;
};


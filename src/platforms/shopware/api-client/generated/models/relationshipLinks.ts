/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { link } from './link';

/**
 * A resource object **MAY** contain references to other resource objects ("relationships"). Relationships may be to-one or to-many. Relationships can be specified by including a member in a resource's links object.
 */
export type relationshipLinks = {
    self?: (any[] & link);
    related?: link;
};


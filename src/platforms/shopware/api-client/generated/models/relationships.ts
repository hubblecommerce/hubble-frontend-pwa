/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { relationshipLinks } from './relationshipLinks';
import type { relationshipToMany } from './relationshipToMany';
import type { relationshipToOne } from './relationshipToOne';
/**
 * Members of the relationships object ("relationships") represent references from the resource object in which it's defined to other resource objects.
 */
export type relationships = {
    links?: relationshipLinks;
    /**
     * Member, whose value represents "resource linkage".
     */
    data?: (relationshipToOne | relationshipToMany);
};


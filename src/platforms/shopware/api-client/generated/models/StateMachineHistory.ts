/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StateMachineState } from './StateMachineState';
/**
 * Added since version: 6.0.0.0
 */
export type StateMachineHistory = {
    id?: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    fromStateMachineState?: StateMachineState;
    toStateMachineState?: StateMachineState;
};


/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StateMachineState } from './StateMachineState';
import type { StateMachineTransition } from './StateMachineTransition';
/**
 * Added since version: 6.0.0.0
 */
export type StateMachine = {
    id?: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: Record<string, any>;
    states?: Array<StateMachineState>;
    transitions?: Array<StateMachineTransition>;
};


import { Action } from "redux";

export const APP_READY = "APP_READY";

export type AppReady = {

} & Action;

export const appReady = (): AppReady => ({ type: APP_READY });
import { Action } from "redux";

export const APP_READY = "APP_READY";
export const MAIN_WINDOW_OPENED = "MAIN_WINDOW_OPENED";

export type AppReady = {} & Action;

export const appReady = (): AppReady => ({ type: APP_READY });
export const mainWindowOpened = (): Action => ({ type: MAIN_WINDOW_OPENED });

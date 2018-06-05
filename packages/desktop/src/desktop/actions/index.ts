import { Action } from "redux";
import { PCConfig } from "paperclip";

export const APP_READY = "APP_READY";
export const MAIN_WINDOW_OPENED = "MAIN_WINDOW_OPENED";
export const PC_CONFIG_LOADED = "PC_CONFIG_LOADED";

export type AppReady = {} & Action;
export type PCConfigLoaded = {
  config: PCConfig;
} & Action;

export const appReady = (): AppReady => ({ type: APP_READY });
export const mainWindowOpened = (): Action => ({ type: MAIN_WINDOW_OPENED });
export const pcConfigLoaded = (config: PCConfig): PCConfigLoaded => ({
  type: PC_CONFIG_LOADED,
  config
});

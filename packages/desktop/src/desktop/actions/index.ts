import { Action } from "redux";
import { PCConfig } from "paperclip";
import { TDConfig } from "../state";

export const APP_READY = "APP_READY";
export const MAIN_WINDOW_OPENED = "MAIN_WINDOW_OPENED";
export const PC_CONFIG_LOADED = "PC_CONFIG_LOADED";
export const TD_CONFIG_LOADED = "TD_CONFIG_LOADED";
export const PREVIEW_SERVER_STARTED = "PREVIEW_SERVER_STARTED";

export type AppReady = {} & Action;
export type PCConfigLoaded = {
  config: PCConfig;
} & Action;

export type TDConfigLoaded = {
  config: TDConfig;
} & Action;

export type PreviewServerStarted = {
  port: number;
} & Action;

export const appReady = (): AppReady => ({ type: APP_READY });
export const mainWindowOpened = (): Action => ({ type: MAIN_WINDOW_OPENED });
export const pcConfigLoaded = (config: PCConfig): PCConfigLoaded => ({
  type: PC_CONFIG_LOADED,
  config
});

export const tdConfigLoaded = (config: TDConfig): TDConfigLoaded => ({
  type: TD_CONFIG_LOADED,
  config
});

export const previewServerStarted = (port: number): PreviewServerStarted => ({
  type: PREVIEW_SERVER_STARTED,
  port
});

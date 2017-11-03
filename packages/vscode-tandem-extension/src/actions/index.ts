import { Action } from "redux";
import { VisualDevConfig } from "../state";
import { Request, Response } from "express";

export const ALERT = "ALERT";
export const EXTENSION_ACTIVATED = "EXTENSION_ACTIVATED";
export const HTTP_REQUEST = "HTTP_REQUEST";
export const VISUAL_DEV_CONFIG_LOADED = "VISUAL_DEV_CONFIG_LOADED";
export const CHILD_DEV_SERVER_STARTED = "CHILD_DEV_SERVER_STARTED";
export const FILE_CONTENT_CHANGED = "FILE_CONTENT_CHANGED";
export const TEXT_CONTENT_CHANGED = "TEXT_CONTENT_CHANGED";
export const START_DEV_SERVER_REQUESTED = "START_DEV_SERVER_REQUESTED";
export const OPEN_FILE_REQUESTED = "OPEN_FILE_REQUESTED";
export const OPEN_TANDEM_EXECUTED = "OPEN_TANDEM_EXECUTED";
export const OPEN_EXTERNAL_WINDOW_EXECUTED = "OPEN_EXTERNAL_WINDOW_EXECUTED";
export const STOP_DEV_SERVER_EXECUTED = "STOP_DEV_SERVER_EXECUTED";
export const FILE_CHANGED = "FILE_CHANGED";

export type HTTPRequest = {
  request: Request;
  response: Response;
} & Action;

export type VisualDevConfigLoaded = {
  config:  VisualDevConfig;
} & Action;

export type FileContentChanged =  {
  filePath: string;
  content: string;
} & Action;

export type FileAction = {
  filePath: string
} & Action;

export enum AlertLevel {
  NOTICE,
  ERROR,
  WARNING
};

export type Alert = {
  level: AlertLevel;
  text: string;
} & Action;

export type ChildDevServerStarted = {
  port: number
} & Action;

export const fileChanged = (filePath: string) => ({
  type: FILE_CHANGED,
  filePath
});

export const extensionActivated = () => ({
  type: EXTENSION_ACTIVATED
});

export const fileContentChanged = (filePath: string, content: string): FileContentChanged  => ({
  type: FILE_CONTENT_CHANGED,
  content,
  filePath
});

export const textContentChanged = (filePath: string, content: string): FileContentChanged  => ({
  type: TEXT_CONTENT_CHANGED,
  content,
  filePath
});

export const childDevServerStarted = (port: number): ChildDevServerStarted => ({
  port,
  type: CHILD_DEV_SERVER_STARTED
});

export const httpRequest = (request: Request, response: Response): HTTPRequest => ({
  type: HTTP_REQUEST,
  request,
  response,
});

export const startDevServerRequest = () => ({ 
  type: START_DEV_SERVER_REQUESTED
});

export const openFileRequested = (filePath): FileAction => ({ 
  type: OPEN_FILE_REQUESTED,
  filePath
});

export const openTandemExecuted = () => ({ 
  type: OPEN_TANDEM_EXECUTED
});

export const openExternalWindowExecuted = () => ({ 
  type: OPEN_EXTERNAL_WINDOW_EXECUTED
});

export const visualDevConfigLoaded = (config: VisualDevConfig) => ({
  type: VISUAL_DEV_CONFIG_LOADED,
  config,
})

export const alert = (text: string, level: AlertLevel = AlertLevel.NOTICE): Alert => ({
  type: ALERT,
  text,
  level
})
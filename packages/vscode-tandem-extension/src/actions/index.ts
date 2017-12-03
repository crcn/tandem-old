import { Action } from "redux";
import { VisualDevConfig } from "../state";
import { Request, Response } from "express";
import * as express from "express";
import { VMObjectExpressionSource } from "paperclip";
import { TextEditor } from "vscode";

export const ALERT = "ALERT";
export const EXTENSION_ACTIVATED = "EXTENSION_ACTIVATED";
export const HTTP_REQUEST = "HTTP_REQUEST";
export const CHILD_DEV_SERVER_STARTED = "CHILD_DEV_SERVER_STARTED";
export const FILE_CONTENT_CHANGED = "FILE_CONTENT_CHANGED";
export const FILE_REMOVED = "FILE_REMOVED";
export const TEXT_CONTENT_CHANGED = "TEXT_CONTENT_CHANGED";
export const START_DEV_SERVER_REQUESTED = "START_DEV_SERVER_REQUESTED";
export const ACTIVE_TEXT_EDITOR_CHANGED = "ACTIVE_TEXT_EDITOR_CHANGED";
export const EXPRESS_SERVER_STARTED = "EXPRESS_SERVER_STARTED";
export const OPEN_FILE_REQUESTED = "OPEN_FILE_REQUESTED";
export const OPEN_TANDEM_EXECUTED = "OPEN_TANDEM_EXECUTED";
export const OPEN_EXTERNAL_WINDOW_EXECUTED = "OPEN_EXTERNAL_WINDOW_EXECUTED";
export const STOP_DEV_SERVER_EXECUTED = "STOP_DEV_SERVER_EXECUTED";

export type HTTPRequest = {
  request: Request;
  response: Response;
} & Action;

export type ExpressServerStarted = {
  type: string;
  port: number;
  server: express.Express;
};

export type FileContentChanged =  {
  filePath: string;
  content: Buffer;
  mtime: Date;
} & Action;

export type ActiveTextEditorChanged =  {
  editor: TextEditor;
} & Action;

export type FileAction = {
  filePath: string
} & Action;

export type OpenFileRequested = {
  source: VMObjectExpressionSource
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

export const extensionActivated = () => ({
  type: EXTENSION_ACTIVATED
});

export const textContentChanged = (filePath: string, content: Buffer, mtime: Date = new Date()): FileContentChanged  => ({
  type: TEXT_CONTENT_CHANGED,
  content,
  filePath,
  mtime,
});

export const activeTextEditorChange = (editor: TextEditor): ActiveTextEditorChanged  => ({
  editor,
  type: ACTIVE_TEXT_EDITOR_CHANGED
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

export const openFileRequested = (source: VMObjectExpressionSource): OpenFileRequested => ({ 
  type: OPEN_FILE_REQUESTED,
  source
});

export const openTandemExecuted = () => ({ 
  type: OPEN_TANDEM_EXECUTED
});

export const openExternalWindowExecuted = () => ({ 
  type: OPEN_EXTERNAL_WINDOW_EXECUTED
});

export const alert = (text: string, level: AlertLevel = AlertLevel.NOTICE): Alert => ({
  type: ALERT,
  text,
  level
})


export const expressServerStarted = (server: express.Express, port: number): ExpressServerStarted => ({
  type: EXPRESS_SERVER_STARTED,
  port,
  server
});
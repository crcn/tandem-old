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
export const TANDEM_FE_CONNECTIVITY = "TANDEM_FE_CONNECTIVITY";
export const SOCKET_CLIENT_CONNECTED = "SOCKET_CLIENT_CONNECTED";
export const START_DEV_SERVER_REQUESTED = "START_DEV_SERVER_REQUESTED";
export const ACTIVE_TEXT_EDITOR_CHANGED = "ACTIVE_TEXT_EDITOR_CHANGED";
export const OPEN_ARTBOARDS_REQUESTED = "OPEN_ARTBOARDS_REQUESTED";
export const EXPRESS_SERVER_STARTED = "EXPRESS_SERVER_STARTED";
export const OPEN_FILE_REQUESTED = "OPEN_FILE_REQUESTED";
export const OPEN_TANDEM_EXECUTED = "OPEN_TANDEM_EXECUTED";
export const OPEN_EXTERNAL_WINDOW_EXECUTED = "OPEN_EXTERNAL_WINDOW_EXECUTED";
export const OPEN_TANDEM_IF_DISCONNECTED_REQUESTED = "OPEN_TANDEM_IF_DISCONNECTED_REQUESTED";
export const OPENING_TANDEM_APP = "OPENING_TANDEM_APP";
export const OPEN_CURRENT_FILE_IN_TANDEM_EXECUTED = "OPEN_CURRENT_FILE_IN_TANDEM_EXECUTED";
export const CREATE_INSERT_NEW_COMPONENT_EXECUTED = "CREATE_INSERT_NEW_COMPONENT_EXECUTED";
export const MODULE_CREATED = "MODULE_CREATED";
export const STOP_DEV_SERVER_EXECUTED = "STOP_DEV_SERVER_EXECUTED";
export const OPEN_FILE_REQUEST_RESULT = "OPEN_FILE_REQUEST_RESULT";

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
  content: string;
  mtime: Date;
} & Action;

export type ActiveTextEditorChanged =  {
  editor: TextEditor;
} & Action;

export type FileAction = {
  filePath: string
} & Action;

export type OpenFileRequested = {
  componentId: string;
  previewName: string;
  checksum: string;
  vmObjectPath: any[];
} & Action;


export type OpenFileRequestResult = {
  request: OpenFileRequested;
  error?: Error;
} & Action;

export type OpenArtboardsRequested = {
  artboardInfo: Array<string[]>;
  type: string;
  $public: true
} & Action;

export enum AlertLevel {
  NOTICE,
  ERROR,
  WARNING
};

export type TandemFEConnectivity = {
  connected: boolean
} & Action;

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

export const textContentChanged = (filePath: string, content: string, mtime: Date = new Date()): FileContentChanged  => ({
  type: TEXT_CONTENT_CHANGED,
  content,
  filePath,
  mtime,
});

export const openTandemIfDisconnectedRequested = () => ({
  type: OPEN_TANDEM_IF_DISCONNECTED_REQUESTED
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

export const openFileRequested = ({ componentId, previewName, checksum, vmObjectPath }): OpenFileRequested => ({ 
  componentId,
  previewName,
  type: OPEN_FILE_REQUESTED,
  checksum,
  vmObjectPath
});

export const openTandemExecuted = () => ({ 
  type: OPEN_TANDEM_EXECUTED
});

export const openExternalWindowExecuted = () => ({ 
  type: OPEN_EXTERNAL_WINDOW_EXECUTED
});

export const openCurrentFileInTandemExecuted = () => ({
  type: OPEN_CURRENT_FILE_IN_TANDEM_EXECUTED
});

export const insertNewComponentExecuted = () => ({
  type: CREATE_INSERT_NEW_COMPONENT_EXECUTED
});

export const openArtboardsRequested = (artboardInfo: Array<string[]>): OpenArtboardsRequested => ({
  type: OPEN_ARTBOARDS_REQUESTED,
  artboardInfo,
  $public: true
});

export const alert = (text: string, level: AlertLevel = AlertLevel.NOTICE): Alert => ({
  type: ALERT,
  text,
  level
})

export const openingTandemApp = () => ({
  type: OPENING_TANDEM_APP
});

export const expressServerStarted = (server: express.Express, port: number): ExpressServerStarted => ({
  type: EXPRESS_SERVER_STARTED,
  port,
  server
});

export const tandemFEConnectivity = (connected: boolean): TandemFEConnectivity => ({
  connected,
  type: TANDEM_FE_CONNECTIVITY
});

export const openFileRequestResult = (request: OpenFileRequested, error?: Error): OpenFileRequestResult => ({
  request,
  type: OPEN_FILE_REQUEST_RESULT,
  error
})
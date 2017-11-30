import { Action } from "redux";
import { FileCacheItem, ApplicationState, ScreenshotClippings, InitOptions } from "../state";
import { Request, Response } from "express";
import { publicActionFactory } from "aerial-common2";
import * as express from "express";
import * as puppeteer from "puppeteer";

export const ALERT = "ALERT";
export const EXTENSION_ACTIVATED = "EXTENSION_ACTIVATED";
export const VISUAL_DEV_CONFIG_LOADED = "VISUAL_DEV_CONFIG_LOADED";
export const CHILD_DEV_SERVER_STARTED = "CHILD_DEV_SERVER_STARTED";
export const MUTATE_SOURCE_CONTENT = "MUTATE_SOURCE_CONTENT";
export const FILE_CONTENT_CHANGED = "FILE_CONTENT_CHANGED";
export const HEADLESS_BROWSER_LAUNCHED = "HEADLESS_BROWSER_LAUNCHED";
export const COMPONENT_SCREENSHOT_SAVED = "COMPONENT_SCREENSHOT_SAVED";
export const COMPONENT_SCREENSHOT_STARTED = "COMPONENT_SCREENSHOT_STARTED";
export const COMPONENT_SCREENSHOT_TAKEN = "COMPONENT_SCREENSHOT_TAKEN";
export const COMPONENT_SCREENSHOT_REMOVED = "COMPONENT_SCREENSHOT_REMOVED";
export const START_DEV_SERVER_EXECUTED = "START_DEV_SERVER_EXECUTED";
export const STOP_DEV_SERVER_EXECUTED = "STOP_DEV_SERVER_EXECUTED";
export const WATCH_URIS_REQUESTED = "WATCH_URIS_REQUESTED";
export const WATCHING_FILES = "WATCHING_FILES";
export const INIT_SERVER_REQUESTED = "INIT_SERVER_REQUESTED";
export const EXPRESS_SERVER_STARTED = "EXPRESS_SERVER_STARTED";

export type HTTPRequest = {
  request: Request;
  response: Response;
} & Action;

export type ExpressServerStarted = {
  type: string;
  server: express.Express;
}

export type Mutation =  {
  $type: string;
  source: {
    uri: string
  }
};

export type FileAction = {
  filePath: string
  publicPath: string;
} & Action;

export type FileContentChanged =  {
  publicPath: string;
  content: Buffer;
  mtime: Date;
} & FileAction;

export type MutateSourceContentRequest = {
  mutations: Mutation[];
} & FileAction;

export type WatchUrisRequested = {
  uris: string[]
} & Action;

export type WatchingFiles = {
  initialFileCache: FileCacheItem[]
} & Action;

export type HeadlessBrowserLaunched = {
  browser: puppeteer.Browser
} & Action;

export type ComponentScreenshotTaken = {
  buffer: Buffer;
  contentType: string;
  clippings: ScreenshotClippings;
} & Action;

export type ComponentScreenshotSaved = {
  clippings: ScreenshotClippings;
  uri: string;
} & Action;

export type ComponentScreenshotRemoved = {
  uri: string;
} & Action;

export type ComponentScreenshotRequested = {
} & Action;

export type ComponentScreenshotStarted = {
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

export type InitServerRequested = {
  options: InitOptions;
  $$public: boolean;
} & Action;

export type ChildDevServerStarted = {
  port: number
} & Action;

export const initServerRequested = (options: InitOptions): InitServerRequested => ({
  type: INIT_SERVER_REQUESTED,
  options,
  $$public: true
});

export const watchUrisRequested = (uris: string[]): WatchUrisRequested => ({
  uris,
  type: WATCH_URIS_REQUESTED
});

export const extensionActivated = () => ({
  type: EXTENSION_ACTIVATED
});

export const fileContentChanged = publicActionFactory((filePath: string, publicPath: string, content: Buffer, mtime: Date): FileContentChanged  => ({
  type: FILE_CONTENT_CHANGED,
  content,
  filePath,
  publicPath,
  mtime
}));

export const componentScreenshotTaken = (buffer: Buffer, clippings: ScreenshotClippings, contentType: string): ComponentScreenshotTaken => ({
  buffer, 
  contentType,
  clippings,
  type: COMPONENT_SCREENSHOT_TAKEN
});

export const componentScreenshotStarted = (): ComponentScreenshotStarted => ({
  type: COMPONENT_SCREENSHOT_STARTED
});

export const headlessBrowserLaunched = (browser: puppeteer.Browser): HeadlessBrowserLaunched => ({
  type: HEADLESS_BROWSER_LAUNCHED,
  browser
});

export const componentScreenshotSaved = publicActionFactory((uri: string, clippings: ScreenshotClippings): ComponentScreenshotSaved => ({
  type: COMPONENT_SCREENSHOT_SAVED,
  clippings,
  uri
}));

export const componentScreenshotRemoved = (uri: string): ComponentScreenshotRemoved => ({
  type: COMPONENT_SCREENSHOT_REMOVED,
  uri
});

export const childDevServerStarted = (port: number): ChildDevServerStarted => ({
  port,
  type: CHILD_DEV_SERVER_STARTED
});

export const watchingFiles = (initialFileCache: FileCacheItem[]): WatchingFiles => ({
  type: WATCHING_FILES,
  initialFileCache
})
export const startDevServerExecuted = () => ({ 
  type: START_DEV_SERVER_EXECUTED
});

export const expressServerStarted = (server: express.Express): ExpressServerStarted => ({
  type: EXPRESS_SERVER_STARTED,
  server
});
import { Action } from "redux";
import { FileCacheItem, ApplicationState, ScreenshotClippings, InitOptions } from "../state";
import { DependencyGraph } from "paperclip";
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
export const FILE_REMOVED = "FILE_REMOVED";
export const DEPENDENCY_GRAPH_LOADED = "DEPENDENCY_GRAPH_LOADED";
export const HEADLESS_BROWSER_LAUNCHED = "HEADLESS_BROWSER_LAUNCHED";
export const COMPONENT_SCREENSHOT_SAVED = "COMPONENT_SCREENSHOT_SAVED";
export const COMPONENT_SCREENSHOT_STARTED = "COMPONENT_SCREENSHOT_STARTED";
export const MODULE_CREATED = "MODULE_CREATED";
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
  $public: boolean;
} & Action;

export type FileContentChanged =  {
  publicPath: string;
  content: Buffer;
  mtime: Date;
  $public: true;
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

export type DependencyGraphLoaded = {
  graph: DependencyGraph;
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
  $public: boolean;
} & Action;

export type ChildDevServerStarted = {
  port: number
} & Action;

export type ModuleCreated = {
  filePath: string;
  content: Buffer;
  $public: true;
} & Action;

export const moduleCreated = (filePath: string, publicPath: string, content: Buffer): FileContentChanged => ({
  filePath,
  content,
  publicPath,
  mtime: new Date(),
  $public: true,
  type: MODULE_CREATED
}); 

export const initServerRequested = (options: InitOptions): InitServerRequested => ({
  type: INIT_SERVER_REQUESTED,
  options,
  $public: true
});

export const watchUrisRequested = (uris: string[]): WatchUrisRequested => ({
  uris,
  type: WATCH_URIS_REQUESTED
});

export const extensionActivated = () => ({
  type: EXTENSION_ACTIVATED
});

export const fileContentChanged = (filePath: string, publicPath: string, content: Buffer, mtime: Date): FileContentChanged  => ({
  type: FILE_CONTENT_CHANGED,
  content,
  filePath,
  publicPath,
  mtime,
  $public: true
});

export const fileRemoved = (filePath: string, publicPath: string): FileAction  => ({
  type: FILE_REMOVED,
  filePath,
  publicPath,
  $public: true
});

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

export const dependencyGraphLoaded = (graph: DependencyGraph): DependencyGraphLoaded => ({
  graph,
  type: DEPENDENCY_GRAPH_LOADED
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
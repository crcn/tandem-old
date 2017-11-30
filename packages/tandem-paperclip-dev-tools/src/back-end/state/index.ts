import * as fs from "fs";
import * as path from "path";
import * as pupeteer from "puppeteer";
import { arrayReplaceIndex, arraySplice, weakMemo, arrayRemoveItem, Bounds, arrayRemoveIndex } from "aerial-common2";
import { getModuleId, getModuleFilePaths } from "../utils";
import * as pc from "paperclip";

export type ProjectConfig = {
  sourceDirectory?: string;
  extensions?: string[];
  moduleDirectories?: string[];
};

export type FileCacheItem = {
  filePath: string;
  mtime: Date;
  content: Buffer;
};

export type AllComponentsPreviewEntry = {
  targetComponentId: string;
  previewComponentId: string;
  relativeFilePath: string;
  bounds: Bounds;
};

export type Screenshot = {
  uri: string;
  clippings: ScreenshotClippings
};

export type ScreenshotClippings = {
  [identifier: string]: Bounds
};

export type InitOptions = {
  cwd: string;
  port: number;
  projectConfig: ProjectConfig;
}

export type ApplicationState = {
  options?: InitOptions;
  watchUris: string[];
  headlessBrowser?: pupeteer.Browser;
  shouldTakeAnotherScreenshot?: boolean;
  componentScreenshots: Screenshot[];
  fileCache: FileCacheItem[];
};

export type RegisteredComponent = {
  filePath: string;
  label: string;
  screenshot: {
    uri: string;
    clip: Bounds;
  };
  tagName?: string;
  moduleId?: string;
};


export const updateApplicationState = (state: ApplicationState, properties: Partial<ApplicationState>) => ({
  ...state,
  ...properties
});

export const addComponentScreenshot = (screenshot: Screenshot, state: ApplicationState) => updateApplicationState(state, {
  componentScreenshots: [...state.componentScreenshots, screenshot]
});

export const removeComponentScreenshot = (uri: string, state: ApplicationState) => {
  const index = state.componentScreenshots.findIndex((screenshot) => screenshot.uri === uri);
  if (index === -1) {
    return state;
  }
  return updateApplicationState(state, {
    componentScreenshots: arrayRemoveIndex(state.componentScreenshots, index)
  });
}

export const updateFileCacheItem = (state: ApplicationState, item: FileCacheItem) => {

  const index = state.fileCache.findIndex((v) => v.filePath === item.filePath);

  return updateApplicationState(state, {
    fileCache: index > -1 ? arraySplice(state.fileCache, index, 1, item) : arraySplice(state.fileCache, 0, 0, item)
  });
}
export const getFileCacheContent = (filePath: string, state: ApplicationState) => {
  const item = state.fileCache.find((item) => item.filePath === filePath);
  return item && item.content;
}
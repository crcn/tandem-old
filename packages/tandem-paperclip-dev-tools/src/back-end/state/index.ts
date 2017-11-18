import * as fs from "fs";
import * as path from "path";
import * as pupeteer from "puppeteer";
import { arrayReplaceIndex, arraySplice, weakMemo, arrayRemoveItem } from "aerial-common2";
import { getModuleId, getModuleFilePaths } from "../utils";
import * as pc from "paperclip";

export type Config = {
  sourceDirectory?: string;
  extensions?: string[];
  moduleDirectories?: string[];
};

export type FileCacheItem = {
  filePath: string;
  mtime: Date;
  content: Buffer;
};

export type ComponentScreenshots = {
  [identifier: string]: string[]
};

export type ApplicationState = {
  cwd: string;
  port: number;
  config: Config;
  watchUris: string[];
  headlessBrowser?: pupeteer.Browser;
  componentScreenshotQueue: string[];
  componentScreenshots: ComponentScreenshots;
  fileCache: FileCacheItem[];
};

export type RegisteredComponent = {
  filePath: string;
  label: string;
  screenshotUrl: string;
  tagName?: string;
  moduleId?: string;
}

export const getComponentsFromSourceContent = (content: string, filePath: string, state: ApplicationState): RegisteredComponent[] => {
  const moduleId = getModuleId(filePath);
  try {
    const ast = pc.parseModuleSource(content);
    const module = pc.loadModuleAST(ast, filePath);
    return module.components.map(({id}) => ({
      filePath,
      label: id,
      screenshotUrl: getScreenshotUrl(id, state),
      tagName: id,
      moduleId: moduleId,
    }));

  } catch(e) {
    console.log(JSON.stringify(e.stack, null, 2));
    return [{
      label: path.basename(filePath) + ":<syntax error>" ,
      filePath,
      screenshotUrl: null,
      moduleId,
    }];
  }
};

export const getAvailableComponents = (state: ApplicationState, readFileSync: (filePath) => string) => {
  return getModuleFilePaths(state).reduce((components, filePath) => (
    [...components, ...getComponentsFromSourceContent(readFileSync(filePath), filePath, state)]
  ), []);
}

export const getScreenshotUrl = (tagName: string, state: ApplicationState) => {
  const ss = state.componentScreenshots[tagName] || [];
  return ss ? `http://localhost:${state.port}/components/${tagName}/screenshots/${ss.length - 1}` : null;
}

export const updateApplicationState = (state: ApplicationState, properties: Partial<ApplicationState>) => ({
  ...state,
  ...properties
});

export const updateComponentScreenshots = (state: ApplicationState, properties: Partial<ComponentScreenshots>) => ({
  ...state,
  ...{
    componentScreenshots: {
      ...state.componentScreenshots,
      ...properties
    }
  }
});

export const addComponentScreenshot = (componentId: string, uri: string, state: ApplicationState) => updateComponentScreenshots(state, {
  [componentId]: state.componentScreenshots[componentId] ? [...state.componentScreenshots[componentId], uri] : [uri]
});

export const removeComponentScreenshot = (componentId: string, uri: string, state: ApplicationState) => updateComponentScreenshots(state, {
  [componentId]: state.componentScreenshots[componentId] ? arrayRemoveItem(state.componentScreenshots[componentId], uri) : []
});

export const updateFileCacheItem = (state: ApplicationState, item: FileCacheItem) => {

  const index = state.fileCache.findIndex((v) => v.filePath === item.filePath);

  return updateApplicationState(state, {
    fileCache: index > -1 ? arraySplice(state.fileCache, index, 1, item) : arraySplice(state.fileCache, 0, 0, item)
  });
}
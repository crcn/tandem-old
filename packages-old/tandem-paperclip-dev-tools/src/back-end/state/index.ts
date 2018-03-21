import * as fs from "fs";
import * as path from "path";
import * as pupeteer from "puppeteer";
import { arrayReplaceIndex, arraySplice, weakMemo, arrayRemoveItem, Bounds, arrayRemoveIndex } from "aerial-common2";
import { getModuleId, getModuleFilePaths } from "../utils";
import { SlimParentNode, getDocumentChecksum } from "slim-dom";
import { ExpressionLocation, DependencyGraph, getAllComponents } from "paperclip";

export type ProjectConfig = {
  sourceFilePattern: string;
};

export type FileCacheItem = {
  filePath: string;
  mtime: Date;
  content: Buffer;
};

export type AllComponentsPreviewEntry = {
  componentId: string;
  previewName: string;
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
  pipeStdio?: boolean;
  port: number;
  projectConfig: ProjectConfig;
}

export type PreviewDocuments = {
  [identifier: string]: SlimParentNode[]
};

export type ApplicationState = {
  options?: InitOptions;
  graph?: DependencyGraph;
  previewDocuments?: PreviewDocuments;
  watchUris: string[];
  headlessBrowser?: pupeteer.Browser;
  shouldTakeAnotherScreenshot?: boolean;
  componentScreenshots: Screenshot[];
  fileCache: FileCacheItem[];
};

export type RegisteredComponent = {
  filePath: string;
  label: string;
  location: ExpressionLocation;
  screenshots: Array<{
    previewName: string;
    uri: string;
    clip: Bounds;
  }>;
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
};

export const addPreviewDocument = (componentId: string, previewName: string, document: SlimParentNode, root: ApplicationState) => {
  const key = getPreviewHash(componentId, previewName, root);
  return updateApplicationState(root, {
    previewDocuments: {
      ...(root.previewDocuments as any),
      [key]: [
        ...(root.previewDocuments[key] || []),
        document
      ]
    }
  })
};

export const limitPreviewDocuments = (componentId: string, previewName: string, max: number, root: ApplicationState) => {
  const key = getPreviewHash(componentId, previewName, root);
  if (root.previewDocuments[key].length > max) {
    return updateApplicationState(root, {
      previewDocuments: {
        ...(root.previewDocuments as any),
        [key]: root.previewDocuments[key].slice(1)
      }
    });
  }
  return root;
};

export const getLatestPreviewDocument = (componentId: string, previewName: string, root: ApplicationState) => {
  const key = getPreviewHash(componentId, previewName, root);
  const docs = root.previewDocuments[key];
  return docs && docs.length ? docs[docs.length - 1] : null;
};

export const getPreviewDocumentByChecksum = (componentId: string, previewName: string, checksum: string, root: ApplicationState) => {
  const key = getPreviewHash(componentId, previewName, root);
  const docs = root.previewDocuments[key];
  if (checksum === "latest") {
    return docs[docs.length - 1];
  }
  return docs.find(doc => getDocumentChecksum(doc) === checksum);
};

const getPreviewHash = (componentId: string, previewName: string, { graph }: ApplicationState) => {
  if (previewName) {
    return componentId + previewName;
  }
  const component = getAllComponents(graph)[componentId];
  return componentId + component.previews[0].name;
};

export const updateFileCacheItem = (state: ApplicationState, item: FileCacheItem) => {

  const index = state.fileCache.findIndex((v) => v.filePath === item.filePath);

  return updateApplicationState(state, {
    fileCache: index > -1 ? arraySplice(state.fileCache, index, 1, item) : arraySplice(state.fileCache, 0, 0, item)
  });
}

export const removeFileCacheItem = (state: ApplicationState, filePath: string) => {
  
  const index = state.fileCache.findIndex((v) => v.filePath === filePath);

  return updateApplicationState(state, {
    fileCache: index > -1 ? arraySplice(state.fileCache, index, 1) : state.fileCache
  });
}

export const getFileCacheContent = (filePath: string, state: ApplicationState) => {
  const item = state.fileCache.find((item) => item.filePath === filePath);
  return item && item.content;
}
import * as fs from "fs";
import * as path from "path";
import { arrayReplaceIndex, arraySplice } from "aerial-common2";
import { getModuleId } from "../utils";
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

export type ApplicationState = {
  cwd: string;
  port: number;
  config: Config;
  watchUris: string[];
  fileCache: FileCacheItem[];
};

export type RegisteredComponent = {
  filePath: string;
  label: string;
  tagName?: string;
  moduleId?: string;
}

export const getComponentsFromSourceContent = (content: string, filePath: string): RegisteredComponent[] => {
  const moduleId = getModuleId(filePath);
  try {
    const ast = pc.parseModuleSource(content);
    const module = pc.loadModuleAST(ast, filePath);
    return module.components.map(({id}) => ({
      filePath,
      label: id,
      tagName: id,
      moduleId: moduleId,
    }));

  } catch(e) {
    console.log(JSON.stringify(e.stack, null, 2));
    return [{
      label: path.basename(filePath) + ":<syntax error>" ,
      filePath,
      moduleId,
    }];
  }
};

export const updateApplicationState = (state: ApplicationState, properties: Partial<ApplicationState>) => ({
  ...state,
  ...properties
});

export const updateFileCacheItem = (state: ApplicationState, item: FileCacheItem) => {

  const index = state.fileCache.findIndex((v) => v.filePath === item.filePath);

  return updateApplicationState(state, {
    fileCache: index > -1 ? arraySplice(state.fileCache, index, 1, item) : arraySplice(state.fileCache, 0, 0, item)
  });
}
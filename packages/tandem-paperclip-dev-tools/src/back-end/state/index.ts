import * as md5 from "md5";
import * as fs from "fs";
import * as path from "path";
import { arrayReplaceIndex, arraySplice } from "aerial-common2";
import { getPCMetaName, parse } from "../../paperclip";

export type Config = {
  componentsDirectory?: string;
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

export type Component = {
  label: string;
  $id: string;
  filePath?: string;
}

export const createComponentFromFilePath = (content: string, filePath: string): Component => {
  let info = {
    $id: md5(filePath),
    filePath: filePath,
    label: path.basename(filePath)
  };
  
  try {
    info.label = getPCMetaName(parse(content));
  } catch(e) {
    info.label += ":<syntax error>";
  }

  return info;
}

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
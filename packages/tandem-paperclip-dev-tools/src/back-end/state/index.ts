import * as md5 from "md5";
import * as fs from "fs";
import * as path from "path";
import { arrayReplaceIndex, arraySplice } from "aerial-common2";
import { getPCMetaName, parse, getPCASTElementsByTagName, getPCStartTagAttribute, transpilePCASTToVanillaJS, Transpiler } from "../../paperclip2";
import * as pc from "paperclip";

export type Config = {
  componentsDirectory?: string;
  transpilers?: {
    [identifier: string]: Transpiler
  },
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

export type Component = {
  label: string;
  tagName?: string;
  filePath?: string;
  hash?: string;
}

export const getComponentsFromSourceContent = (content: string, filePath: string): Component[] => {
  const hash = md5(filePath);
  try {
    const now = Date.now();
    const ast = pc.parseModule(content);
    const module = pc.loadModuleAST(ast);
    return module.components.map(({id}) => ({
      tagName: id,
      hash,
      filePath,
      label: id
    }));

  } catch(e) {
    console.log(JSON.stringify(e.stack, null, 2));
    return [{
      label: path.basename(filePath) + ":<syntax error>" ,
      filePath,
      hash,
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
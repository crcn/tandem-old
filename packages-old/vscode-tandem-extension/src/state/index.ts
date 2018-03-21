import { ExtensionContext, TextEditor } from "vscode";


export type VisualDevConfig = {
  editSourceContent: (content: string, mutation: any, filePath: string) => any;
  sourceFilePattern: string;
}

export type ChildDevServerInfo = {
  port: number;
}

export type FileCache = {
  [identifer: string]: {
    content: string;
    mtime: Date;
  }
}

export enum TandemEditorReadyStatus {
  CONNECTING,
  CONNECTED,
  DISCONNECTED
};

export type ExtensionState = {
  port?: number;
  tandemEditorStatus: TandemEditorReadyStatus;
  activeTextEditor: TextEditor;
  context: ExtensionContext;

  visualDevConfig?: VisualDevConfig;

  childDevServerInfo?: ChildDevServerInfo;

  fileCache: FileCache;

  // root project path
  rootPath: string;
};

export const updateExtensionState = (state: ExtensionState, properties: Partial<ExtensionState>) => ({
  ...state,
  ...properties
});

export const getFileCacheContent = (filePath: string, state: ExtensionState) => {
  return state.fileCache[filePath] && state.fileCache[filePath].content;
}
export const getFileCacheMtime = (filePath: string, state: ExtensionState) => {
  return state.fileCache[filePath] && state.fileCache[filePath].mtime 
}

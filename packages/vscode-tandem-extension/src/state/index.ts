export type VisualDevConfig = {
  port: number;
  editSourceContent: (content: string, mutation: any, filePath: string) => any;
  sourceFilePattern: string;
  vscode: {
    devServerScript: string[],
    tandemcodeDirectory
  };
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

export type ExtensionState = {
  context: any;

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

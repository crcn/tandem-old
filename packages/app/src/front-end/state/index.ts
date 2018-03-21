import { arraySplice } from "common/utils";

export type SyntheticWindow = {

};

export type OpenFile = {
  path: string;

  // TRUE if the file has been edited
  dirty?: boolean;
  content: Buffer;

  // TODO
  // history?: string[]; 
  window?: 
}

export type RootState = {
  activeFilePath?: string;
  openFiles: OpenFile[];
  mount: Element;
};

export const updateRootState = (root: RootState, properties: Partial<RootState>) => ({
  ...root,
  ...properties,
});

export const setActiveFile = (root: RootState, newActivePath: string) => {
  if (!root.openFiles.some(({path}) => path === newActivePath)) {
    throw new Error(`Active file path is not currently open`);
  }
  return updateRootState(root, {
    activeFilePath: newActivePath
  });
};

export const addOpenedProject = (root: RootState, file: OpenFile) => {
  root = updateRootState(root, {
    openFiles: arraySplice(root.openFiles, 0, 0, file)
  });

  if (!root.activeFilePath) {
    root = setActiveFile(root, file.path);
  }

  return root;
}
import { arraySplice, Directory } from "common";
import { SyntheticBrowser } from "paperclip";

export type RootState = {
  activeUri?: string;
  mount: Element;
  browser: SyntheticBrowser;
  projectDirectory?: Directory;
};

export const updateRootState = (properties: Partial<RootState>, root: RootState) => ({
  ...root,
  ...properties,
});

export const setActiveUri = (newActiveUri: string, root: RootState) => {
  if (!root.browser.windows.some(({location}) => location === newActiveUri)) {
    throw new Error(`Active file path is not currently open`);
  }
  return updateRootState({
    activeUri: newActiveUri
  }, root);
};
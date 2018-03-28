import { arraySplice, Directory, memoize, EMPTY_ARRAY, StructReference } from "common";
import { SyntheticBrowser, updateSyntheticBrowser, SyntheticWindow, updateSyntheticWindow, SyntheticDocument, getSyntheticWindow } from "paperclip";

export type RootState = {
  activeFilePath?: string;
  mount: Element;
  hoveringReferences: StructReference[];
  selectionReferences: StructReference[];
  browser: SyntheticBrowser;
  projectDirectory?: Directory;
};

export const updateRootState = (properties: Partial<RootState>, root: RootState) => ({
  ...root,
  ...properties,
});

export const updateRootStateSyntheticBrowser = (properties: Partial<SyntheticBrowser>, root: RootState) => updateRootState({
  browser: updateSyntheticBrowser(properties, root.browser)
}, root);

export const updateRootStateSyntheticWindow = (location: string, properties: Partial<SyntheticWindow>, root: RootState) => updateRootState({
  browser: updateSyntheticWindow(location, properties, root.browser)
}, root);

export const updateRootStateSyntheticWindowDocument = (location: string, documentIndex: number, properties: Partial<SyntheticDocument>, root: RootState) => {
  const window = getSyntheticWindow(location, root.browser);
  return updateRootState({
    browser: updateSyntheticWindow(location, {
      documents: arraySplice(window.documents, documentIndex, 1, {
        ...window.documents[documentIndex],
        ...properties
      })
    }, root.browser)
  }, root);
};

export const setActiveFilePath = (newActiveFilePath: string, root: RootState) => {
  if (!root.browser.windows.some(({location}) => location === newActiveFilePath)) {
    throw new Error(`Active file path is not currently open`);
  }
  return updateRootState({
    activeFilePath: newActiveFilePath
  }, root);
};

export const getActiveWindow = (root: RootState) => root.browser.windows.find(window => window.location === root.activeFilePath);

export const getAllWindowDocuments = memoize((browser: SyntheticBrowser): SyntheticDocument[] => {
  return browser.windows.reduce((documents, window) => {
    return [...documents, ...(window.documents || EMPTY_ARRAY)];
  }, []);
});

export * from "./constants";

import { Action } from "redux";
import { Directory } from "common";
import { SyntheticWindow, Dependency, DependencyGraph, ComputedDisplayInfo } from "paperclip";

export const PROJECT_LOADED = "PROJECT_LOADED";
export const ACTIVE_FILE_CHANGED = "ACTIVE_FILE_CHANGED";
export const SYNTHETIC_WINDOW_OPENED = "SYNTHETIC_WINDOW_OPENED";
export const PROJECT_DIRECTORY_LOADED = "PROJECT_DIRECTORY_LOADED";
export const DEPENDENCY_ENTRY_LOADED = "DEPENDENCY_ENTRY_LOADED";
export const DOCUMENT_RENDERED = "DOCUMENT_RENDERERED";

export const FILE_NAVIGATOR_ITEM_CLICKED = "FILE_NAVIGATOR_ITEM_CLICKED";

export type ProjectLoaded = {
  uri: string;
} & Action;

export type DocumentRendered = {
  window: SyntheticWindow;
  documentIndex: number;
  info: ComputedDisplayInfo;
} & Action;

export type DependencyEntryLoaded = {
  entry: Dependency;
  graph: DependencyGraph;
} & Action;

export type FileNavigatorItemClicked = {
  path: number[];
} & Action;

export type ProjectDirectoryLoaded = {
  directory: Directory;
} & Action;

export type SyntheticWindowOpened = {
  window: SyntheticWindow
} & Action;

export const fileNavigatorItemClicked = (path: number[]): FileNavigatorItemClicked => ({
  path,
  type: FILE_NAVIGATOR_ITEM_CLICKED,
});

export const dependencyEntryLoaded = (entry: Dependency, graph: DependencyGraph): DependencyEntryLoaded => ({
  entry,
  graph,
  type: DEPENDENCY_ENTRY_LOADED
});

export const projectLoaded = (uri: string): ProjectLoaded => ({
  uri,
  type: PROJECT_LOADED
});

export const projectDirectoryLoaded = (directory: Directory): ProjectDirectoryLoaded => ({
  directory,
  type: PROJECT_DIRECTORY_LOADED
});

export const documentRendered = (documentIndex: number, info: ComputedDisplayInfo, window: SyntheticWindow): DocumentRendered => ({
  documentIndex,
  info,
  window,
  type: DOCUMENT_RENDERED
});

export const syntheticWindowOpened = (window: SyntheticWindow): SyntheticWindowOpened => ({
  window,
  type: SYNTHETIC_WINDOW_OPENED
});
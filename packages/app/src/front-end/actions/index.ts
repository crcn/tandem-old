import { Action } from "redux";
import { SyntheticWindow } from "paperclip";

export const PROJECT_LOADED = "PROJECT_LOADED";
export const ACTIVE_FILE_CHANGED = "ACTIVE_FILE_CHANGED";
export const SYNTHETIC_WINDOW_OPENED = "SYNTHETIC_WINDOW_OPENED";

export type ProjectLoaded = {
  uri: string;
} & Action;

export type SyntheticWindowOpened = {
  window: SyntheticWindow
} & Action;

export const projectLoaded = (uri: string): ProjectLoaded => ({
  uri,
  type: PROJECT_LOADED
});

export const syntheticWindowOpened = (window: SyntheticWindow): SyntheticWindowOpened => ({
  window,
  type: SYNTHETIC_WINDOW_OPENED
});
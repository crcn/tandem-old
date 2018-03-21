import { Action } from "redux";
import { OpenFile } from "../state";

export const TEST_PROJECT_LOADED = "TEST_PROJECT_LOADED";
export const ACTIVE_FILE_CHANGED = "ACTIVE_FILE_CHANGED";

export type TestProjectLoaded = {
  file: OpenFile;
} & Action;

export const testProjectLoaded = (file: OpenFile): TestProjectLoaded => ({
  file,
  type: TEST_PROJECT_LOADED
});
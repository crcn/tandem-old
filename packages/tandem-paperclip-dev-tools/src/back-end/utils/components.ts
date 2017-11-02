import { ApplicationState } from "../state";
import { PAPERCLIP_FILE_PATTERN } from "../constants";
import * as glob from "glob";
import * as path from "path";

export const getComponentsFilePattern = ({ cwd, config: { componentsDirectory }}: ApplicationState) => path.join(componentsDirectory || cwd, "**", PAPERCLIP_FILE_PATTERN);

export const getComponentsFileTester = (state: ApplicationState) => {
  return filePath => /\*\.pc$/.test;
}

export const getComponentFilePaths = (state: ApplicationState) => glob.sync(getComponentsFilePattern(state));
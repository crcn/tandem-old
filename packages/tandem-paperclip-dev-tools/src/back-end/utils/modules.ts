import { ApplicationState } from "../state";
import { PAPERCLIP_FILE_PATTERN } from "../constants";
import * as glob from "glob";
import * as path from "path";
import * as md5 from "md5";

export const getModulesFilePattern = ({ cwd, config: { sourceDirectory }}: ApplicationState) => path.join(sourceDirectory || cwd, "**", PAPERCLIP_FILE_PATTERN);

export const getModulesFileTester = (state: ApplicationState) => {
  return filePath => /\.pc$/.test(filePath);
}

export const getModuleFilePaths = (state: ApplicationState) => glob.sync(getModulesFilePattern(state));

export const getModuleId = (filePath: string) => md5(filePath);

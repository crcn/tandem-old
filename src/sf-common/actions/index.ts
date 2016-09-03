import { Action } from "./base";
import { IActor } from "sf-common/actors";
import { File } from "../models";

export * from "./base";
export * from "./core";


export class SaveAllFilesAction extends Action {
  static readonly SAVE_ALL_FILES = "saveAllFiles";

  constructor() {
    super(SaveAllFilesAction.SAVE_ALL_FILES);
  }
}

export class OpenProjectAction extends Action {
  static readonly OPEN_PROJECT_FILE = "openProjectFile";
  constructor(readonly path: string) {
    super(OpenProjectAction.OPEN_PROJECT_FILE);
  }
}

export class GetPrimaryProjectFilePathAction extends Action {
  static readonly GET_PRIMARY_PROJECT_FILE_PATH = "getPrimaryProjectFilePath";
  constructor() {
    super(GetPrimaryProjectFilePathAction.GET_PRIMARY_PROJECT_FILE_PATH);
  }
  static async execute(bus: IActor): Promise<string> {
    return (await bus.execute(new GetPrimaryProjectFilePathAction()).read()).value;
  }
}